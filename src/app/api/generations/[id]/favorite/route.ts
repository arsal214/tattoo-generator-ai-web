import { api } from "@/lib/api";
import { toggleFavorite } from "@/lib/services/generation";

export const POST = api<{ id: string }>(
  async ({ params, user }) => toggleFavorite(user._id, params.id),
  { auth: true, limits: [{ name: "gen-fav", max: 60, windowSec: 60, by: "user" }] },
);
