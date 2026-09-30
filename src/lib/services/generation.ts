import { randomUUID } from "node:crypto";
import { isValidObjectId, type Types } from "mongoose";
import { z } from "zod";
import { AppError, err } from "../errors";
import { isDuplicateKey } from "../db/tx";
import { Generation, type GenerationDoc } from "../db/models/Generation";
import { CreditTransaction } from "../db/models/CreditTransaction";
import { Favorite } from "../db/models/Favorite";
import { applyCredits } from "./credits";
import { trackServer } from "./analytics";
import { buildTattooPrompt } from "../ai/prompt";
import { generateImage, ImageGenerationError } from "../ai/gemini";
import { EXT, getStorage } from "../storage";
import { CREDITS_PER_GENERATION, PROMPT_MAX, colorValues, placementValues, sizeValues, styleValues } from "../config/generation";

export const generateSchema = z.object({
  prompt: z.string().trim().min(3, "Please describe the tattoo you want to generate.").max(PROMPT_MAX, `Please keep your description under ${PROMPT_MAX} characters.`),
  style: z.enum(styleValues),
  placement: z.enum(placementValues),
  size: z.enum(sizeValues),
  color: z.enum(colorValues),
  idempotencyKey: z.string().regex(/^[A-Za-z0-9_-]{16,64}$/, "Invalid request key."),
});
export type GenerateInput = z.infer<typeof generateSchema>;

const MAX_IN_FLIGHT = 2;
const STALE_PENDING_MS = 3 * 60_000;
const REFUND_MESSAGE = "Something went wrong while generating your tattoo. Your credit has been refunded.";

export const toGenerationDto = (g: GenerationDoc, favorite = false) => ({
  id: String(g._id),
  prompt: g.prompt,
  style: g.style,
  placement: g.placement,
  size: g.size,
  color: g.color,
  status: g.status,
  imageUrl: g.imageKey ? getStorage().url(g.imageKey) : (g.imageUrl ?? null),
  creditsUsed: g.creditsUsed,
  errorMessage: g.errorMessage ?? null,
  favorite,
  createdAt: g.createdAt.toISOString(),
});
export type GenerationDto = ReturnType<typeof toGenerationDto>;

/** Core flow: validate → reserve credit → call model → store image → record; refund on any failure. */
export async function generateTattoo(userId: Types.ObjectId, input: GenerateInput) {
  await sweepStale(userId);

  const replay = await Generation.findOne({ userId, idempotencyKey: input.idempotencyKey });
  if (replay) return replayResult(replay);

  if ((await Generation.countDocuments({ userId, status: "pending" })) >= MAX_IN_FLIGHT) {
    throw new AppError(429, "RATE_LIMITED", "You already have tattoos generating. Please wait for them to finish.", { retryAfter: 15 });
  }

  let gen: GenerationDoc;
  try {
    gen = (await Generation.create({ userId, prompt: input.prompt, style: input.style, placement: input.placement, size: input.size, color: input.color, idempotencyKey: input.idempotencyKey, status: "pending" })).toObject();
  } catch (e) {
    if (isDuplicateKey(e)) return replayResult((await Generation.findOne({ userId, idempotencyKey: input.idempotencyKey }))!);
    throw e;
  }

  // Atomically reserve the credit. Insufficient balance → no charge, no leftover record.
  try {
    await applyCredits({ userId, amount: -CREDITS_PER_GENERATION, type: "generation", referenceId: String(gen._id), description: "AI tattoo generation" });
  } catch (e) {
    await Generation.deleteOne({ _id: gen._id });
    throw e;
  }
  await Generation.updateOne({ _id: gen._id }, { creditsUsed: CREDITS_PER_GENERATION });
  trackServer("generation_started", userId, { style: input.style });

  let stored: { key: string; url: string } | undefined;
  try {
    const image = await generateImage(buildTattooPrompt(input));
    const key = `generations/${randomUUID()}.${EXT[image.mimeType] ?? "png"}`;
    const { url } = await getStorage().put(key, image.data, image.mimeType);
    stored = { key, url };
    const done = await Generation.findOneAndUpdate(
      { _id: gen._id, status: "pending" },
      { status: "success", imageKey: key, imageUrl: url, storageProvider: getStorage().name, model: image.model, imageMeta: { mimeType: image.mimeType, bytes: image.data.length } },
      { returnDocument: "after" },
    ).lean();
    if (!done) throw new Error("generation was closed before completion"); // swept as stale; refunded there
    trackServer("generation_success", userId, { style: input.style });
    trackServer("credit_consumed", userId, { amount: CREDITS_PER_GENERATION });
    return { generation: toGenerationDto(done), replayed: false };
  } catch (e) {
    if (stored) await getStorage().delete(stored.key).catch(() => {});
    console.error("[generation] failed", String(gen._id), e);
    await failAndRefund(gen._id, e instanceof ImageGenerationError ? e.userMessage : "Generation failed.");
    trackServer("generation_failed", userId, { style: input.style });
    throw new AppError(502, "GENERATION_FAILED", e instanceof ImageGenerationError && e.userMessage.includes("rephras") ? `${e.userMessage} Your credit has been refunded.` : REFUND_MESSAGE);
  }
}

function replayResult(g: GenerationDoc) {
  if (g.status === "success") return { generation: toGenerationDto(g), replayed: true };
  if (g.status === "pending") throw err.conflict("This tattoo is already being generated.");
  throw new AppError(502, "GENERATION_FAILED", REFUND_MESSAGE);
}

/** Closes a pending generation as failed (atomic gate: only one caller wins) and refunds its credit once. */
export async function failAndRefund(id: Types.ObjectId, message: string) {
  const g = await Generation.findOneAndUpdate({ _id: id, status: "pending" }, { status: "failed", errorMessage: message.slice(0, 300) }, { returnDocument: "after" }).lean();
  if (g) await refund(g);
}

async function refund(g: GenerationDoc) {
  // Only refund a credit that was really taken (ledger row completed: balanceBefore > 0).
  const spent = await CreditTransaction.findOne({ type: "generation", referenceId: String(g._id), balanceBefore: { $gt: 0 } }, { _id: 1 }).lean();
  if (spent) await applyCredits({ userId: g.userId, amount: CREDITS_PER_GENERATION, type: "refund", referenceId: String(g._id), description: "Refund for failed generation" });
  await Generation.updateOne({ _id: g._id }, { refunded: true, creditsUsed: 0 });
}

/** Recovers from crashed/timed-out requests: closes stale pending generations and finishes interrupted refunds. */
export async function sweepStale(userId: Types.ObjectId) {
  const stale = await Generation.find({ userId, status: "pending", updatedAt: { $lt: new Date(Date.now() - STALE_PENDING_MS) } }, { _id: 1 }).limit(5).lean();
  for (const s of stale) await failAndRefund(s._id, "Generation timed out.");
  const unrefunded = await Generation.find({ userId, status: "failed", refunded: false, creditsUsed: { $gt: 0 } }).limit(5).lean();
  for (const g of unrefunded) await refund(g);
}

// ---------- reads / mutations used by the API and dashboard ----------

export async function getOwnedGeneration(userId: Types.ObjectId, id: string) {
  if (!isValidObjectId(id)) throw err.notFound("Design not found.");
  // Ownership enforced in the query itself: someone else's id is indistinguishable from a missing one.
  const g = await Generation.findOne({ _id: id, userId }).lean();
  if (!g) throw err.notFound("Design not found.");
  return g;
}

export async function listGenerations(userId: Types.ObjectId, opts: { limit?: number; cursor?: string; favoritesOnly?: boolean; status?: GenerationDoc["status"] } = {}) {
  const limit = Math.min(Math.max(opts.limit ?? 24, 1), 60);
  const filter: Record<string, unknown> = { userId };
  if (opts.status) filter.status = opts.status;
  if (opts.cursor && isValidObjectId(opts.cursor)) filter._id = { $lt: opts.cursor };
  if (opts.favoritesOnly) {
    const favs = await Favorite.find({ userId }, { generationId: 1 }).lean();
    filter._id = { ...(filter._id as object), $in: favs.map((f) => f.generationId) };
  }
  const rows = await Generation.find(filter).sort({ _id: -1 }).limit(limit + 1).lean();
  const page = rows.slice(0, limit);
  const favIds = new Set((await Favorite.find({ userId, generationId: { $in: page.map((g) => g._id) } }, { generationId: 1 }).lean()).map((f) => String(f.generationId)));
  return {
    items: page.map((g) => toGenerationDto(g, favIds.has(String(g._id)))),
    nextCursor: rows.length > limit ? String(page[page.length - 1]._id) : null,
  };
}

export async function toggleFavorite(userId: Types.ObjectId, id: string) {
  const g = await getOwnedGeneration(userId, id);
  const removed = await Favorite.findOneAndDelete({ userId, generationId: g._id });
  if (removed) return { favorite: false };
  try {
    await Favorite.create({ userId, generationId: g._id });
  } catch (e) {
    if (!isDuplicateKey(e)) throw e;
  }
  trackServer("favorite", userId);
  return { favorite: true };
}

export async function deleteGeneration(userId: Types.ObjectId, id: string) {
  const g = await getOwnedGeneration(userId, id);
  if (g.status === "pending") throw err.conflict("This tattoo is still generating.");
  if (g.imageKey) await getStorage().delete(g.imageKey).catch((e) => console.warn("[storage] delete failed", e));
  await Favorite.deleteMany({ userId, generationId: g._id });
  await Generation.deleteOne({ _id: g._id, userId });
}

export const isFavorite = async (userId: Types.ObjectId, generationId: Types.ObjectId) => Boolean(await Favorite.exists({ userId, generationId }));
