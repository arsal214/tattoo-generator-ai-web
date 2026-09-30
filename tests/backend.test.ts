import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { createHmac } from "node:crypto";
import os from "node:os";
import path from "node:path";
import mongoose from "mongoose";
import { MongoMemoryReplSet, MongoMemoryServer } from "mongodb-memory-server";

// `npm run test:rs` runs against a replica set (transactions on); `npm test` uses standalone (transactions off).
const REPLSET = process.env.TEST_REPLSET === "1" || import.meta.env.MODE === "rs";
let mongod: MongoMemoryServer | MongoMemoryReplSet;

vi.mock("@/lib/ai/gemini", () => ({
  generateImage: vi.fn(),
  ImageGenerationError: class ImageGenerationError extends Error {
    constructor(public userMessage: string) {
      super(userMessage);
    }
  },
}));

const modules = {} as {
  gemini: typeof import("@/lib/ai/gemini");
  generation: typeof import("@/lib/services/generation");
  credits: typeof import("@/lib/services/credits");
  auth: typeof import("@/lib/services/auth");
  payments: typeof import("@/lib/services/payments");
  stripe: typeof import("@/lib/payments/stripe");
  User: typeof import("@/lib/db/models/User");
  Ledger: typeof import("@/lib/db/models/CreditTransaction");
  Gen: typeof import("@/lib/db/models/Generation");
  Payment: typeof import("@/lib/db/models/Payment");
};

beforeAll(async () => {
  mongod = REPLSET ? await MongoMemoryReplSet.create({ replSet: { count: 1 } }) : await MongoMemoryServer.create();
  process.env.MONGODB_URI = mongod.getUri();
  process.env.AUTH_SECRET = "x".repeat(40);
  process.env.LOCAL_STORAGE_DIR = path.join(os.tmpdir(), `tg-test-${Date.now()}`);
  process.env.PAYMENT_WEBHOOK_SECRET = "whsec_test";
  const { connectDB } = await import("@/lib/db/connect");
  await connectDB();
  modules.gemini = await import("@/lib/ai/gemini");
  modules.generation = await import("@/lib/services/generation");
  modules.credits = await import("@/lib/services/credits");
  modules.auth = await import("@/lib/services/auth");
  modules.payments = await import("@/lib/services/payments");
  modules.stripe = await import("@/lib/payments/stripe");
  modules.User = await import("@/lib/db/models/User");
  modules.Ledger = await import("@/lib/db/models/CreditTransaction");
  modules.Gen = await import("@/lib/db/models/Generation");
  modules.Payment = await import("@/lib/db/models/Payment");
  // Make sure unique indexes exist before racing anything.
  await Promise.all(Object.values(mongoose.models).map((m) => m.init()));
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

beforeEach(() => {
  vi.mocked(modules.gemini.generateImage).mockReset();
});

const okImage = () => ({ data: Buffer.from("fake-png"), mimeType: "image/png", model: "test" });
const input = (k: string) => ({ prompt: "a wolf", style: "fine-line", placement: "forearm", size: "small", color: "black-white", idempotencyKey: `key-${k}`.padEnd(20, "x") });
let n = 0;
const newUser = async (credits = 20) => {
  const u = await modules.User.User.create({ name: "T", email: `u${++n}-${Date.now()}@example.com`, credits });
  return u._id;
};
const credits = async (id: unknown) => (await modules.User.User.findById(id).lean())!.credits;

describe(`credits & signup (${REPLSET ? "replica set" : "standalone"})`, () => {
  it("signup grants exactly 20 credits, once, even with concurrent duplicate requests", async () => {
    const email = `dup-${Date.now()}@example.com`;
    const results = await Promise.allSettled(Array.from({ length: 6 }, () => modules.auth.registerUser({ name: "A", email, password: "password123" })));
    expect(results.filter((r) => r.status === "fulfilled")).toHaveLength(1);
    const user = await modules.User.User.findOne({ email }).lean();
    expect(user!.credits).toBe(20);
    expect(await modules.Ledger.CreditTransaction.countDocuments({ userId: user!._id, type: "signup_bonus" })).toBe(1);
  });

  it("applyCredits is idempotent per (type, referenceId) and never overdraws", async () => {
    const id = await newUser(1);
    const a = await modules.credits.applyCredits({ userId: id, amount: 5, type: "admin_adjustment", referenceId: "adj-1" });
    const b = await modules.credits.applyCredits({ userId: id, amount: 5, type: "admin_adjustment", referenceId: "adj-1" });
    expect([a.applied, b.applied]).toEqual([true, false]);
    expect(await credits(id)).toBe(6);
    await expect(modules.credits.applyCredits({ userId: id, amount: -7, type: "generation", referenceId: "g-x" })).rejects.toMatchObject({ code: "NO_CREDITS" });
    expect(await credits(id)).toBe(6);
    expect(await modules.Ledger.CreditTransaction.countDocuments({ referenceId: "g-x" })).toBe(0); // no leftover ledger row
  });
});

describe("generation", () => {
  it("successful generation consumes exactly 1 credit and records history + ledger", async () => {
    vi.mocked(modules.gemini.generateImage).mockResolvedValue(okImage());
    const id = await newUser(20);
    const { generation } = await modules.generation.generateTattoo(id, input("ok"));
    expect(generation.status).toBe("success");
    expect(generation.imageUrl).toMatch(/^\/api\/files\/generations\//);
    expect(await credits(id)).toBe(19);
    const led = await modules.Ledger.CreditTransaction.findOne({ userId: id, type: "generation" }).lean();
    expect(led).toMatchObject({ amount: -1, balanceBefore: 20, balanceAfter: 19 });
  });

  it("failed generation refunds the credit and reports a friendly error", async () => {
    vi.mocked(modules.gemini.generateImage).mockRejectedValue(new modules.gemini.ImageGenerationError("busy"));
    const id = await newUser(3);
    await expect(modules.generation.generateTattoo(id, input("fail"))).rejects.toMatchObject({ code: "GENERATION_FAILED", message: expect.stringContaining("refunded") });
    expect(await credits(id)).toBe(3);
    const g = await modules.Gen.Generation.findOne({ userId: id }).lean();
    expect(g).toMatchObject({ status: "failed", refunded: true, creditsUsed: 0 });
    expect(await modules.Ledger.CreditTransaction.countDocuments({ userId: id, type: "refund" })).toBe(1);
  });

  it("cannot generate with 0 credits and leaves no pending record", async () => {
    vi.mocked(modules.gemini.generateImage).mockResolvedValue(okImage());
    const id = await newUser(0);
    await expect(modules.generation.generateTattoo(id, input("zero"))).rejects.toMatchObject({ code: "NO_CREDITS" });
    expect(modules.gemini.generateImage).not.toHaveBeenCalled();
    expect(await modules.Gen.Generation.countDocuments({ userId: id })).toBe(0);
  });

  it("concurrent requests cannot double-spend the last credit", async () => {
    vi.mocked(modules.gemini.generateImage).mockImplementation(async () => {
      await new Promise((r) => setTimeout(r, 50));
      return okImage();
    });
    const id = await newUser(1);
    const results = await Promise.allSettled(Array.from({ length: 8 }, (_, i) => modules.generation.generateTattoo(id, input(`race${i}`))));
    expect(results.filter((r) => r.status === "fulfilled")).toHaveLength(1);
    expect(await credits(id)).toBe(0);
    expect(modules.gemini.generateImage).toHaveBeenCalledTimes(1);
  });

  it("same idempotency key is charged once", async () => {
    vi.mocked(modules.gemini.generateImage).mockResolvedValue(okImage());
    const id = await newUser(5);
    const [a, b] = await Promise.allSettled([modules.generation.generateTattoo(id, input("same")), modules.generation.generateTattoo(id, input("same"))]);
    const later = await modules.generation.generateTattoo(id, input("same"));
    expect(later.replayed).toBe(true);
    expect(await credits(id)).toBe(4);
    expect([a.status, b.status]).toContain("fulfilled");
  });

  it("sweeper refunds a stale pending generation exactly once", async () => {
    vi.mocked(modules.gemini.generateImage).mockResolvedValue(okImage());
    const id = await newUser(2);
    // Simulate a crash after the credit was reserved but before the model call finished.
    const g = await modules.Gen.Generation.create({ userId: id, prompt: "x", style: "fine-line", placement: "wrist", size: "small", color: "black-white", status: "pending", creditsUsed: 1 });
    await modules.credits.applyCredits({ userId: id, amount: -1, type: "generation", referenceId: String(g._id) });
    await modules.Gen.Generation.updateOne({ _id: g._id }, { updatedAt: new Date(Date.now() - 10 * 60_000) }, { timestamps: false });
    expect(await credits(id)).toBe(1);
    await Promise.all([modules.generation.sweepStale(id), modules.generation.sweepStale(id)]);
    expect(await credits(id)).toBe(2);
  });

  it("users can only read their own generations", async () => {
    vi.mocked(modules.gemini.generateImage).mockResolvedValue(okImage());
    const owner = await newUser(2);
    const other = await newUser(2);
    const { generation } = await modules.generation.generateTattoo(owner, input("own"));
    await expect(modules.generation.getOwnedGeneration(other, generation.id)).rejects.toMatchObject({ status: 404 });
    await expect(modules.generation.deleteGeneration(other, generation.id)).rejects.toMatchObject({ status: 404 });
    await expect(modules.generation.getOwnedGeneration(owner, generation.id)).resolves.toBeTruthy();
  });
});

describe("payments", () => {
  const sign = (body: string, t = Math.floor(Date.now() / 1000), secret = "whsec_test") =>
    `t=${t},v1=${createHmac("sha256", secret).update(`${t}.${body}`).digest("hex")}`;

  const pending = async (amount = 900, credits = 80) => {
    const userId = await newUser(0);
    const p = await modules.Payment.Payment.create({ userId, planId: "creator", amount, currency: "usd", creditsToGrant: credits, provider: "stripe", providerTransactionId: `cs_${Date.now()}_${++n}`, status: "pending" });
    return { userId, p };
  };
  const event = (p: { _id: unknown; providerTransactionId?: string | null }, over: Record<string, unknown> = {}, id = `evt_${Date.now()}_${++n}`, type = "checkout.session.completed") =>
    JSON.stringify({ id, type, data: { object: { id: p.providerTransactionId, client_reference_id: String(p._id), payment_status: "paid", amount_total: 900, currency: "usd", ...over } } });

  it("verifies signatures (valid, tampered, stale, wrong secret)", () => {
    const { verifyStripeSignature: v } = modules.stripe;
    const body = '{"a":1}';
    expect(v(body, sign(body), "whsec_test")).toBe(true);
    expect(v(body + " ", sign(body), "whsec_test")).toBe(false);
    expect(v(body, sign(body, Math.floor(Date.now() / 1000) - 3600), "whsec_test")).toBe(false);
    expect(v(body, sign(body, undefined, "other"), "whsec_test")).toBe(false);
    expect(v(body, null, "whsec_test")).toBe(false);
  });

  it("rejects webhooks with a bad signature", async () => {
    const { p } = await pending();
    const body = event(p);
    await expect(modules.payments.processWebhook(body, new Headers({ "stripe-signature": "t=1,v1=bad" }))).rejects.toMatchObject({ status: 400 });
  });

  it("grants credits once, even if the webhook is delivered many times in parallel", async () => {
    const { userId, p } = await pending();
    const body = event(p, {}, "evt_same");
    const headers = () => new Headers({ "stripe-signature": sign(body) });
    await Promise.all(Array.from({ length: 6 }, () => modules.payments.processWebhook(body, headers())));
    // a *different* event id for the same payment must not double-grant either
    await modules.payments.processWebhook(event(p, {}, "evt_other"), new Headers({ "stripe-signature": sign(event(p, {}, "evt_other")) }));
    expect(await credits(userId)).toBe(80);
    expect(await modules.Ledger.CreditTransaction.countDocuments({ userId, type: "purchase" })).toBe(1);
    expect((await modules.Payment.Payment.findById(p._id).lean())!.status).toBe("succeeded");
    expect((await modules.User.User.findById(userId).lean())!.plan).toBe("creator");
  });

  it("does not fulfil unpaid sessions, redirect-only, or mismatched amounts", async () => {
    const a = await pending();
    const unpaid = event(a.p, { payment_status: "unpaid" });
    expect(await modules.payments.processWebhook(unpaid, new Headers({ "stripe-signature": sign(unpaid) }))).toBe("ignored");
    const b = await pending();
    const cheap = event(b.p, { amount_total: 100 });
    expect(await modules.payments.processWebhook(cheap, new Headers({ "stripe-signature": sign(cheap) }))).toBe("rejected");
    expect(await credits(a.userId)).toBe(0);
    expect(await credits(b.userId)).toBe(0);
  });
});
