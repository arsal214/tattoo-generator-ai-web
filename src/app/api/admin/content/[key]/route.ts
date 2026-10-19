import { revalidatePath } from "next/cache";
import { z } from "zod";
import { api, parseBody } from "@/lib/api";
import { CONTENT_KEYS } from "@/lib/content/defaults";
import { PageContent } from "@/lib/db/models/PageContent";
import { err } from "@/lib/errors";

export const PUT = api<{ key: string }>(
  async ({ req, params }) => {
    if (!(CONTENT_KEYS as string[]).includes(params.key)) throw err.notFound("Unknown content key.");
    const { data } = await parseBody(req, z.object({ data: z.record(z.string(), z.unknown()) }));
    await PageContent.updateOne({ key: params.key }, { $set: { data } }, { upsert: true });
    revalidatePath("/", "layout"); // page copy is cached for an hour
    return { ok: true };
  },
  { admin: true },
);
