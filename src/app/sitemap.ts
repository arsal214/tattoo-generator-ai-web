import type { MetadataRoute } from "next";
import { allPublishedSlugs } from "@/lib/blog/queries";
import { BLOG_CATEGORIES } from "@/lib/config/blog";
import { absoluteUrl } from "@/lib/site";
import { TOOLS } from "@/lib/tools/registry";

export const revalidate = 3600;

// Only public, indexable pages. Dashboard, auth pages, account pages and /api are excluded (see robots.ts).
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await allPublishedSlugs();
  const now = new Date();
  const flagship = new Set(["tattoo-generator", "tattoo-font-generator"]);
  return [
    { url: absoluteUrl("/"), lastModified: now, changeFrequency: "weekly", priority: 1 },
    ...TOOLS.map((t) => ({ url: absoluteUrl(`/${t.slug}`), lastModified: now, changeFrequency: "monthly" as const, priority: flagship.has(t.slug) ? 0.95 : 0.8 })),
    { url: absoluteUrl("/pricing"), lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: absoluteUrl("/blog"), lastModified: now, changeFrequency: "daily", priority: 0.7 },
    ...BLOG_CATEGORIES.map((c) => ({ url: absoluteUrl(`/blog/category/${c.slug}`), lastModified: now, changeFrequency: "weekly" as const, priority: 0.5 })),
    ...posts.map((p) => ({ url: absoluteUrl(`/blog/${p.slug}`), lastModified: p.updatedAt ?? p.publishedAt ?? now, changeFrequency: "monthly" as const, priority: 0.6 })),
    ...["/about", "/contact", "/privacy-policy", "/terms", "/cookie-policy"].map((p) => ({ url: absoluteUrl(p), lastModified: now, changeFrequency: "yearly" as const, priority: 0.3 })),
  ];
}
