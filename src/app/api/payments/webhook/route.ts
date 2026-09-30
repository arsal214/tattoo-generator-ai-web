import { api } from "@/lib/api";
import { processWebhook } from "@/lib/services/payments";

/**
 * Payment provider webhook. Authenticated by signature (not cookies/origin). Credits are only ever
 * granted from here after signature + amount verification, and replays are no-ops.
 */
export const POST = api(
  async ({ req }) => {
    const raw = await req.text(); // raw body is required for signature verification
    const outcome = await processWebhook(raw, req.headers);
    return { received: true, outcome };
  },
  { skipOriginCheck: true, limits: [{ name: "webhook", max: 300, windowSec: 60 }] },
);
