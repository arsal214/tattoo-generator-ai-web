/**
 * Payment provider abstraction. To add another processor (Paddle, LemonSqueezy, PayPal…), implement this
 * interface and register it in `getProvider()` — the rest of the app only talks to these types.
 */
export interface CheckoutInput {
  paymentId: string;
  amount: number; // minor units
  currency: string;
  productName: string;
  customerEmail: string;
  successUrl: string;
  cancelUrl: string;
}

/** A provider webhook, normalised and signature-verified. */
export interface VerifiedEvent {
  eventId: string;
  type: string;
  /** What the event means for us. */
  outcome: "paid" | "failed" | "ignored";
  paymentId?: string;
  providerTransactionId?: string;
  amount?: number;
  currency?: string;
}

export interface PaymentProvider {
  name: string;
  createCheckout(input: CheckoutInput): Promise<{ url: string; providerTransactionId: string }>;
  /** Returns null if the signature is invalid. Must never trust the payload before verifying it. */
  verifyWebhook(rawBody: string, headers: Headers): VerifiedEvent | null;
}
