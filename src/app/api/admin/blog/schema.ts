import { z } from "zod";
import { blogCategorySlugs } from "@/lib/config/blog";

export const blogInput = z.object({
  title: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Slug: lowercase letters, numbers and dashes."),
  excerpt: z.string().min(1),
  content: z.string().min(1),
  featuredImage: z.string().optional(),
  category: z.enum(blogCategorySlugs),
  author: z.string().min(1),
  metaTitle: z.string().min(1),
  metaDescription: z.string().min(1),
  tools: z.array(z.string()).default([]),
  status: z.enum(["draft", "published"]),
});
