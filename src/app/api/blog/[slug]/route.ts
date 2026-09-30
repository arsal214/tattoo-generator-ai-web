import { api } from "@/lib/api";
import { err } from "@/lib/errors";
import { getPost } from "@/lib/blog/queries";

export const GET = api<{ slug: string }>(
  async ({ params }) => {
    const post = await getPost(params.slug);
    if (!post) throw err.notFound("Article not found.");
    const { _id, __v, status, ...rest } = post as typeof post & { __v?: number };
    void _id; void __v; void status;
    return { post: rest };
  },
  { limits: [{ name: "blog-post", max: 120, windowSec: 60 }] },
);
