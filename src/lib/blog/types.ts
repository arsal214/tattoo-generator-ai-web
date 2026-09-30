import type { BlogCategorySlug } from "@/lib/config/blog";

/** Shape of an article in the seed files (src/lib/blog/posts/*.ts). Stored 1:1 in the BlogPost collection. */
export interface SeedPost {
  slug: string;
  title: string;
  /** 1–2 sentences shown on cards and used as fallback description. */
  excerpt: string;
  /** Markdown body. No H1 (the title is the H1). Use ## and ### headings. */
  content: string;
  category: BlogCategorySlug;
  /** <title> tag, ≤ 60 chars, unique. */
  metaTitle: string;
  /** 130–160 chars, unique. */
  metaDescription: string;
  /** Tool slugs this article links to (for "Try the tool" boxes). Must exist in the tool registry. */
  tools: string[];
}
