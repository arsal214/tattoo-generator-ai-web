import { isValidObjectId } from "mongoose";
import { revalidatePath } from "next/cache";
import { api, parseBody } from "@/lib/api";
import { BlogPost } from "@/lib/db/models/BlogPost";
import { err } from "@/lib/errors";
import { blogInput } from "../schema";

export const PUT = api<{ id: string }>(
  async ({ req, params }) => {
    if (!isValidObjectId(params.id)) throw err.notFound();
    const body = await parseBody(req, blogInput);
    const post = await BlogPost.findById(params.id);
    if (!post) throw err.notFound();
    if (body.slug !== post.slug && (await BlogPost.exists({ slug: body.slug }))) throw err.validation("That slug is already used.");
    post.set({ ...body, publishedAt: body.status === "published" ? (post.publishedAt ?? new Date()) : post.publishedAt });
    await post.save();
    revalidatePath("/", "layout");
    return { ok: true };
  },
  { admin: true },
);

export const DELETE = api<{ id: string }>(
  async ({ params }) => {
    if (!isValidObjectId(params.id)) throw err.notFound();
    await BlogPost.deleteOne({ _id: params.id });
    revalidatePath("/", "layout");
    return { ok: true };
  },
  { admin: true },
);
