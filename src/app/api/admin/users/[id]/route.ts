import { isValidObjectId } from "mongoose";
import { z } from "zod";
import { api, parseBody } from "@/lib/api";
import { User } from "@/lib/db/models/User";
import { err } from "@/lib/errors";

export const PATCH = api<{ id: string }>(
  async ({ req, params, user }) => {
    if (!isValidObjectId(params.id)) throw err.notFound();
    const body = await parseBody(req, z.object({ name: z.string().min(1).max(80), credits: z.coerce.number().int().min(0), plan: z.enum(["free", "creator", "pro"]), role: z.enum(["user", "admin"]) }));
    if (params.id === String(user._id) && body.role !== "admin") throw err.validation("You can't remove your own admin role.");
    if (!(await User.updateOne({ _id: params.id }, { $set: body })).matchedCount) throw err.notFound();
    return { ok: true };
  },
  { admin: true },
);
