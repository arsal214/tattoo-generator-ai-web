import { api, parseBody } from "@/lib/api";
import { createSession, getSessionUser, toPublicUser } from "@/lib/auth/session";
import { profileSchema, updateProfile } from "@/lib/services/auth";
import { connectDB } from "@/lib/db/connect";
import { Generation } from "@/lib/db/models/Generation";
import { NextResponse } from "next/server";

// Anonymous visitors get { user: null } (200) so the header can check login state without console 401s.
export const GET = api(async () => {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ user: null }, { headers: { "Cache-Control": "no-store" } });
  await connectDB();
  const totalDesigns = await Generation.countDocuments({ userId: user._id, status: "success" });
  return NextResponse.json({ user: toPublicUser(user), totalDesigns }, { headers: { "Cache-Control": "no-store" } });
}, { limits: [{ name: "user-get", max: 120, windowSec: 60 }] });

export const PATCH = api(
  async ({ req, user }) => {
    const { user: updated, sessionRotated } = await updateProfile(user._id, await parseBody(req, profileSchema));
    if (sessionRotated) await createSession(updated); // keep this device signed in after the version bump
    return { user: toPublicUser(updated) };
  },
  { auth: true, limits: [{ name: "user-patch", max: 10, windowSec: 600, by: "user" }] },
);
