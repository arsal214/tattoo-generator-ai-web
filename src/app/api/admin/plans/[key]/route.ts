import { revalidatePath } from "next/cache";
import { z } from "zod";
import { api, parseBody } from "@/lib/api";
import { Plan } from "@/lib/db/models/Plan";
import { err } from "@/lib/errors";

export const PUT = api<{ key: string }>(
  async ({ req, params }) => {
    const body = await parseBody(req, z.object({ name: z.string().min(1), price: z.coerce.number().min(0), credits: z.coerce.number().int().min(0), features: z.array(z.string()), active: z.boolean(), sortOrder: z.coerce.number().int() }));
    if (!(await Plan.updateOne({ key: params.key }, { $set: body })).matchedCount) throw err.notFound();
    revalidatePath("/", "layout");
    return { ok: true };
  },
  { admin: true },
);
