import { api } from "@/lib/api";
import { deleteGeneration, getOwnedGeneration, isFavorite, toGenerationDto } from "@/lib/services/generation";

export const GET = api<{ id: string }>(
  async ({ params, user }) => {
    const g = await getOwnedGeneration(user._id, params.id); // 404 for other users' ids
    return { generation: toGenerationDto(g, await isFavorite(user._id, g._id)) };
  },
  { auth: true, limits: [{ name: "gen-get", max: 120, windowSec: 60, by: "user" }] },
);

export const DELETE = api<{ id: string }>(
  async ({ params, user }) => {
    await deleteGeneration(user._id, params.id);
    return { ok: true };
  },
  { auth: true, limits: [{ name: "gen-del", max: 60, windowSec: 60, by: "user" }] },
);
