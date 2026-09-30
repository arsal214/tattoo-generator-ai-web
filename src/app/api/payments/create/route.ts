import { api, parseBody } from "@/lib/api";
import { createCheckout, createPaymentSchema } from "@/lib/services/payments";

export const POST = api(
  async ({ req, user }) => {
    const { planId } = await parseBody(req, createPaymentSchema);
    // Price/credits are resolved from the DB by plan key; nothing monetary is read from the client.
    return createCheckout(user._id, user.email, planId);
  },
  { auth: true, limits: [{ name: "pay-create", max: 10, windowSec: 3600, by: "user" }, { name: "pay-ip", max: 30, windowSec: 3600 }] },
);
