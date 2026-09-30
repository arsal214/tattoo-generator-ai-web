import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { isValidObjectId } from "mongoose";
import { env } from "../env";
import { connectDB } from "../db/connect";
import { User, type UserDoc } from "../db/models/User";
import { err } from "../errors";

const COOKIE = "tg_session";
const MAX_AGE = 60 * 60 * 24 * 30; // 30 days

const key = () => new TextEncoder().encode(env().AUTH_SECRET);

export const hashPassword = (pw: string) => bcrypt.hash(pw, 12);
export const verifyPassword = (pw: string, hash: string) => bcrypt.compare(pw, hash);
// Compared against when the email is unknown so login timing doesn't reveal which emails exist.
let dummy: Promise<string> | undefined;
export const dummyHash = () => (dummy ??= bcrypt.hash("timing-equalizer", 12));

export async function createSession(user: Pick<UserDoc, "_id" | "sessionVersion">) {
  const token = await new SignJWT({ sv: user.sessionVersion ?? 0 })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(String(user._id))
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(key());
  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function destroySession() {
  (await cookies()).delete(COOKIE);
}

/** Current user (lean doc) or null. Memoized per request. Verifies the session version against the DB. */
export const getSessionUser = cache(async (): Promise<(UserDoc & { _id: UserDoc["_id"] }) | null> => {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, key(), { algorithms: ["HS256"] });
    if (!payload.sub || !isValidObjectId(payload.sub)) return null;
    await connectDB();
    const user = await User.findById(payload.sub).lean();
    if (!user || (user.sessionVersion ?? 0) !== payload.sv) return null;
    return user as UserDoc;
  } catch {
    return null;
  }
});

export async function requireUser() {
  const user = await getSessionUser();
  if (!user) throw err.unauthenticated();
  return user;
}

export async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== "admin") throw err.forbidden();
  return user;
}

/** For server-rendered private pages. */
export async function requireUserOrRedirect(next = "/dashboard") {
  const user = await getSessionUser();
  if (!user) redirect(`/login?next=${encodeURIComponent(next)}`);
  return user;
}

/** Fields that are safe to send to the browser. */
export const toPublicUser = (u: UserDoc) => ({
  name: u.name,
  email: u.email,
  avatar: u.avatar ?? null,
  credits: u.credits,
  plan: u.plan,
  role: u.role,
  emailVerified: u.emailVerified,
});
export type PublicUser = ReturnType<typeof toPublicUser>;
