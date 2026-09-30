import { z } from "zod";
import { api } from "@/lib/api";
import { listGenerations, sweepStale } from "@/lib/services/generation";

const query = z.object({
  limit: z.coerce.number().int().min(1).max(60).optional(),
  cursor: z.string().max(24).optional(),
  favorites: z.enum(["1", "0"]).optional(),
  status: z.enum(["success", "failed", "pending"]).optional(),
});

export const GET = api(
  async ({ req, user }) => {
    const q = query.parse(Object.fromEntries(req.nextUrl.searchParams));
    await sweepStale(user._id);
    return listGenerations(user._id, { limit: q.limit, cursor: q.cursor, favoritesOnly: q.favorites === "1", status: q.status });
  },
  { auth: true, limits: [{ name: "gen-list", max: 60, windowSec: 60, by: "user" }] },
);
