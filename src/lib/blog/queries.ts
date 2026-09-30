import { connectDB } from "../db/connect";
import { BlogPost, type BlogPostDoc } from "../db/models/BlogPost";
import type { BlogCategorySlug } from "../config/blog";

export type PostSummary = Pick<BlogPostDoc, "title" | "slug" | "excerpt" | "category" | "author" | "featuredImage" | "publishedAt" | "updatedAt">;
const SUMMARY_FIELDS = "title slug excerpt category author featuredImage publishedAt updatedAt";

/** Blog reads degrade to empty (never crash a page) if the database is unreachable at render time. */
async function safe<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  if (!process.env.MONGODB_URI) return fallback; // e.g. `next build` without a database
  try {
    await connectDB();
    return await fn();
  } catch (e) {
    console.error("[blog] query failed", (e as Error).message);
    return fallback;
  }
}

export const listPosts = (opts: { category?: string; page?: number; limit?: number } = {}) =>
  safe(async () => {
    const limit = Math.min(opts.limit ?? 12, 50);
    const page = Math.max(opts.page ?? 1, 1);
    const filter = { status: "published" as const, ...(opts.category && { category: opts.category as BlogCategorySlug }) };
    const [items, total] = await Promise.all([
      BlogPost.find(filter).select(SUMMARY_FIELDS).sort({ publishedAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
      BlogPost.countDocuments(filter),
    ]);
    return { items: items as PostSummary[], total, pages: Math.max(Math.ceil(total / limit), 1), page };
  }, { items: [] as PostSummary[], total: 0, pages: 1, page: 1 });

export const getPost = (slug: string) => safe(() => BlogPost.findOne({ slug, status: "published" }).lean(), null);

export const relatedPosts = (slug: string, category: string, limit = 3) =>
  safe(async () => {
    const same = await BlogPost.find({ status: "published", slug: { $ne: slug }, category: category as BlogCategorySlug }).select(SUMMARY_FIELDS).sort({ publishedAt: -1 }).limit(limit).lean();
    if (same.length >= limit) return same as PostSummary[];
    const more = await BlogPost.find({ status: "published", slug: { $nin: [slug, ...same.map((s) => s.slug)] } }).select(SUMMARY_FIELDS).sort({ publishedAt: -1 }).limit(limit - same.length).lean();
    return [...same, ...more] as PostSummary[];
  }, [] as PostSummary[]);

/** Posts that link to a given tool (used for "Related articles" on tool pages). */
export const postsForTool = (toolSlug: string, limit = 3) =>
  safe(async () => (await BlogPost.find({ status: "published", tools: toolSlug }).select(SUMMARY_FIELDS).sort({ publishedAt: -1 }).limit(limit).lean()) as PostSummary[], [] as PostSummary[]);

export const allPublishedSlugs = () =>
  safe(async () => await BlogPost.find({ status: "published" }).select("slug updatedAt publishedAt").lean(), [] as Pick<BlogPostDoc, "slug" | "updatedAt" | "publishedAt">[]);

/** Published posts for a list of slugs, in the given order (used for hand-picked "Related reading"). */
export const postsBySlugs = (slugs: string[]) =>
  safe(async () => {
    const rows = (await BlogPost.find({ status: "published", slug: { $in: slugs } }).select(SUMMARY_FIELDS).lean()) as PostSummary[];
    return slugs.map((s) => rows.find((r) => r.slug === s)).filter((r): r is PostSummary => Boolean(r));
  }, [] as PostSummary[]);
