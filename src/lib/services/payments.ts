import type { Types } from "mongoose";
import { z } from "zod";
import { AppError, err } from "../errors";
import { connectDB } from "../db/connect";
import { Payment } from "../db/models/Payment";
import { Transaction } from "../db/models/Transaction";
import { User } from "../db/models/User";
import { PAID_PLAN_IDS } from "../config/plans";
import { getPlan } from "./plans";
import { applyCredits } from "./credits";
import { trackServer } from "./analytics";
import { absoluteUrl } from "../site";
import type { PaymentProvider, VerifiedEvent } from "../payments/provider";
import { stripeProvider } from "../payments/stripe";

export const getProvider = (): PaymentProvider => stripeProvider;

export const createPaymentSchema = z.object({ planId: z.enum(PAID_PLAN_IDS) });

/** Starts a checkout. Price, credits and plan come from the DB — never from the client. */
export async function createCheckout(userId: Types.ObjectId, email: string, planKey: string, provider = getProvider()) {
  const plan = await getPlan(planKey);
  if (!plan || plan.price <= 0) throw err.validation("That plan isn't available.");
  const amount = Math.round(plan.price * 100);

  const payment = await Payment.create({
    userId,
    planId: plan.key,
    amount,
    currency: plan.currency ?? "usd",
    creditsToGrant: plan.credits,
    provider: provider.name,
    status: "pending",
  });
  try {
    const { url, providerTransactionId } = await provider.createCheckout({
      paymentId: String(payment._id),
      amount,
      currency: payment.currency,
      productName: `${plan.name} plan – ${plan.credits} AI tattoo credits`,
      customerEmail: email,
      successUrl: absoluteUrl(`/dashboard/credits?checkout=success&payment=${payment._id}`),
      cancelUrl: absoluteUrl("/pricing?checkout=canceled"),
    });
    await Payment.updateOne({ _id: payment._id }, { providerTransactionId });
    trackServer("payment_started", userId, { plan: plan.key });
    return { url };
  } catch (e) {
    await Payment.updateOne({ _id: payment._id }, { status: "failed" });
    throw e;
  }
}

/**
 * Applies a verified provider event. Idempotent: replays of the same event (or a different event for the
 * same payment) can never grant credits twice — the credit ledger's unique (purchase, paymentId) key is the gate.
 */
export async function handlePaymentEvent(provider: string, ev: VerifiedEvent): Promise<"fulfilled" | "failed" | "ignored" | "rejected"> {
  await connectDB();
  let outcome: "fulfilled" | "failed" | "ignored" | "rejected" = "ignored";

  if (ev.outcome !== "ignored" && ev.paymentId && /^[0-9a-f]{24}$/.test(ev.paymentId)) {
    const payment = await Payment.findOne({ _id: ev.paymentId, provider });
    if (!payment) outcome = "rejected";
    else if (ev.outcome === "failed") {
      await Payment.updateOne({ _id: payment._id, status: "pending" }, { status: "failed" });
      outcome = "failed";
    } else if (payment.providerTransactionId !== ev.providerTransactionId || payment.amount !== ev.amount || payment.currency !== ev.currency) {
      // Amount/currency/session must match what we created server-side.
      console.error("[payments] mismatch, refusing to fulfil", String(payment._id));
      outcome = "rejected";
    } else {
      await applyCredits({ userId: payment.userId, amount: payment.creditsToGrant, type: "purchase", referenceId: String(payment._id), description: `${payment.planId} plan purchase` });
      await Payment.updateOne({ _id: payment._id }, { status: "succeeded" });
      await User.updateOne({ _id: payment.userId, plan: { $ne: "pro" } }, { plan: payment.planId });
      trackServer("payment_completed", payment.userId, { plan: payment.planId });
      outcome = "fulfilled";
    }
  }

  await Transaction.updateOne({ provider, eventId: ev.eventId }, { $setOnInsert: { type: ev.type, paymentId: ev.paymentId && /^[0-9a-f]{24}$/.test(ev.paymentId) ? ev.paymentId : undefined }, $set: { outcome } }, { upsert: true });
  return outcome;
}

export async function processWebhook(rawBody: string, headers: Headers, provider = getProvider()) {
  const ev = provider.verifyWebhook(rawBody, headers);
  if (!ev) throw new AppError(400, "VALIDATION", "Invalid webhook signature.");
  return handlePaymentEvent(provider.name, ev);
}
