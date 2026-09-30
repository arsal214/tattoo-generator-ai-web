import { api, parseBody } from "@/lib/api";
import { createSession, toPublicUser } from "@/lib/auth/session";
import { authenticate, loginSchema } from "@/lib/services/auth";
import { trackServer } from "@/lib/services/analytics";

export const POST = api(
  async ({ req }) => {
    const user = await authenticate(await parseBody(req, loginSchema));
    await createSession(user);
    trackServer("login", user._id);
    return { user: toPublicUser(user) };
  },
  { limits: [{ name: "login", max: 20, windowSec: 600 }] },
);
