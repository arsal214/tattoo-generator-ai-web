import { createHmac, timingSafeEqual } from "node:crypto";
import { env } from "../env";
import { AppError } from "../errors";
import type { PaymentProvider, VerifiedEvent } from "./provider";

const TOLERANCE_SEC = 300;

/** Verifies a Stripe-Signature header (t=timestamp,v1=hmac) against the raw body. */
export function verifyStripeSignature(rawBody: string, header: string | null, secret: string, now = Date.now()): boolean {
  if (!header) return false;
  const parts = Object.fromEntries(header.split(",").map((kv) => kv.split("=") as [string, string]));
  const t = parts.t;
  const candidates = header.split(",").filter((p) => p.startsWith("v1=")).map((p) => p.slice(3));
  if (!t || !candidates.length || Math.abs(now / 1000 - Number(t)) > TOLERANCE_SEC) return false;
  const expected = createHmac("sha256", secret).update(`${t}.${rawBody}`).digest("hex");
  return candidates.some((c) => c.length === expected.length && timingSafeEqual(Buffer.from(c), Buffer.from(expected)));
}

interface StripeSession {
  id: string;
  payment_status?: string;
  client_reference_id?: string;
  amount_total?: number;
  currency?: string;
  metadata?: Record<string, string>;
}

export const stripeProvider: PaymentProvider = {
  name: "stripe",

  async createCheckout(i) {
    const { PAYMENT_SECRET } = env();
    if (!PAYMENT_SECRET) throw new AppError(503, "UNAVAILABLE", "Payments are not available yet. Please check back soon.");
    const body = new URLSearchParams({
      mode: "payment",
      success_url: i.successUrl,
      cancel_url: i.cancelUrl,
      client_reference_id: i.paymentId,
      customer_email: i.customerEmail,
      "metadata[paymentId]": i.paymentId,
      "line_items[0][quantity]": "1",
      "line_items[0][price_data][currency]": i.currency,
      "line_items[0][price_data][unit_amount]": String(i.amount),
      "line_items[0][price_data][product_data][name]": i.productName,
    });
    const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: { Authorization: `Bearer ${PAYMENT_SECRET}`, "Content-Type": "application/x-www-form-urlencoded", "Idempotency-Key": i.paymentId },
      body,
    });
    const data = (await res.json()) as { id?: string; url?: string; error?: { message?: string } };
    if (!res.ok || !data.id || !data.url) {
      console.error("[stripe] checkout failed", res.status, data.error?.message);
      throw new AppError(502, "PAYMENT", "We couldn't start checkout. Please try again.");
    }
    return { url: data.url, providerTransactionId: data.id };
  },

  verifyWebhook(rawBody, headers) {
    const secret = env().PAYMENT_WEBHOOK_SECRET;
    if (!secret || !verifyStripeSignature(rawBody, headers.get("stripe-signature"), secret)) return null;
    const event = JSON.parse(rawBody) as { id: string; type: string; data: { object: StripeSession } };
    const s = event.data.object;
    const base = { eventId: event.id, type: event.type, paymentId: s.client_reference_id ?? s.metadata?.paymentId, providerTransactionId: s.id, amount: s.amount_total, currency: s.currency };
    let outcome: VerifiedEvent["outcome"] = "ignored";
    // "paid" only when Stripe says so — never inferred from the customer's redirect.
    if (event.type === "checkout.session.async_payment_succeeded" || (event.type === "checkout.session.completed" && s.payment_status === "paid")) outcome = "paid";
    else if (event.type === "checkout.session.async_payment_failed" || event.type === "checkout.session.expired") outcome = "failed";
    return { ...base, outcome };
  },
};
