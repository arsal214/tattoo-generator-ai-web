import { api } from "@/lib/api";
import { err } from "@/lib/errors";
import { getOwnedGeneration } from "@/lib/services/generation";
import { trackServer } from "@/lib/services/analytics";
import { getStorage } from "@/lib/storage";

/** Authenticated download (works for any storage provider; the Content-Disposition header forces a save). */
export const GET = api<{ id: string }>(
  async ({ params, user }) => {
    const g = await getOwnedGeneration(user._id, params.id);
    if (g.status !== "success" || !g.imageKey) throw err.notFound("This design has no image.");
    const data = await getStorage().read(g.imageKey);
    trackServer("download", user._id);
    const mime = g.imageMeta?.mimeType ?? "image/png";
    return new Response(new Uint8Array(data), {
      headers: {
        "Content-Type": mime,
        "Content-Disposition": `attachment; filename="tattoo-design-${String(g._id).slice(-6)}.${mime === "image/jpeg" ? "jpg" : mime.split("/")[1]}"`,
        "Cache-Control": "private, no-store",
      },
    });
  },
  { auth: true, limits: [{ name: "gen-dl", max: 60, windowSec: 60, by: "user" }] },
);
