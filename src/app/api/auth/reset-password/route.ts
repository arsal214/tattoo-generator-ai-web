import { api, parseBody } from "@/lib/api";
import { completePasswordReset, resetSchema } from "@/lib/services/auth";

export const POST = api(
  async ({ req }) => {
    const { token, password } = await parseBody(req, resetSchema);
    await completePasswordReset(token, password);
    return { ok: true, message: "Password updated. You can log in now." };
  },
  { limits: [{ name: "reset", max: 10, windowSec: 3600 }] },
);
