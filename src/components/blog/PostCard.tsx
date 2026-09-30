import Link from "next/link";
import { BLOG_CATEGORIES } from "@/lib/config/blog";
import type { PostSummary } from "@/lib/blog/queries";
import { formatDate } from "@/lib/utils";

export function PostCard({ post }: { post: PostSummary }) {
  const cat = BLOG_CATEGORIES.find((c) => c.slug === post.category);
  return (
    <article className="group relative flex flex-col rounded-2xl border border-line bg-white p-5 transition hover:border-ink hover:shadow-[4px_4px_0_0_var(--color-ink)]">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">{cat?.name ?? post.category}</p>
      <h3 className="mt-2 text-xl font-semibold leading-snug">
        <Link href={`/blog/${post.slug}`} className="after:absolute after:inset-0">
          {post.title}
        </Link>
      </h3>
      <p className="mt-2 line-clamp-3 text-[15px] text-ink/70">{post.excerpt}</p>
      {post.publishedAt && <p className="mt-auto pt-4 text-xs text-muted">{formatDate(post.publishedAt)}</p>}
    </article>
  );
}
