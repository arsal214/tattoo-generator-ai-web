import { revalidatePath } from "next/cache";
import { api, parseBody } from "@/lib/api";
import { BlogPost } from "@/lib/db/models/BlogPost";
import { err } from "@/lib/errors";
import { blogInput } from "./schema";

export const POST = api(
  async ({ req }) => {
    const body = await parseBody(req, blogInput);
    if (await BlogPost.exists({ slug: body.slug })) throw err.validation("That slug is already used.");
    const post = await BlogPost.create({ ...body, publishedAt: body.status === "published" ? new Date() : undefined });
    revalidatePath("/blog");
    return { id: String(post._id) };
  },
  { admin: true },
);
