import { api, parseBody } from "@/lib/api";
import { forgotSchema, startPasswordReset } from "@/lib/services/auth";

export const POST = api(
  async ({ req }) => {
    const { email } = await parseBody(req, forgotSchema);
    await startPasswordReset(email);
    // Same response whether or not the account exists.
    return { ok: true, message: "If an account exists for that email, a reset link is on its way." };
  },
  { limits: [{ name: "forgot", max: 5, windowSec: 3600 }] },
);
