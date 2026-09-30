import { NextResponse } from "next/server";
import { api, parseBody } from "@/lib/api";
import { createSession, toPublicUser } from "@/lib/auth/session";
import { registerSchema, registerUser } from "@/lib/services/auth";
import { trackServer } from "@/lib/services/analytics";
import { SIGNUP_CREDITS } from "@/lib/config/generation";

export const POST = api(
  async ({ req }) => {
    const user = await registerUser(await parseBody(req, registerSchema));
    await createSession(user);
    trackServer("signup", user._id);
    return NextResponse.json({ user: toPublicUser(user), message: `${SIGNUP_CREDITS} free credits added!` }, { status: 201 });
  },
  { limits: [{ name: "register", max: 5, windowSec: 3600 }] },
);
