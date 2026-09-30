import { z } from "zod";
import { api } from "@/lib/api";
import { blogCategorySlugs } from "@/lib/config/blog";
import { listPosts } from "@/lib/blog/queries";

const query = z.object({
  category: z.enum(blogCategorySlugs).optional(),
  page: z.coerce.number().int().min(1).max(500).optional(),
  limit: z.coerce.number().int().min(1).max(50).optional(),
});

export const GET = api(
  async ({ req }) => {
    const q = query.parse(Object.fromEntries(req.nextUrl.searchParams));
    const { items, total, pages, page } = await listPosts(q);
    return { posts: items, total, pages, page };
  },
  { limits: [{ name: "blog", max: 120, windowSec: 60 }] },
);
