import Link from "next/link";
import { PostCard } from "@/components/blog/PostCard";
import { BLOG_CATEGORIES } from "@/lib/config/blog";
import type { PostSummary } from "@/lib/blog/queries";
import { cn } from "@/lib/utils";

export function BlogIndex({ posts, active }: { posts: PostSummary[]; active?: string }) {
  return (
    <>
      <nav aria-label="Blog categories" className="mb-8 flex flex-wrap gap-2">
        <Link href="/blog" className={cn("chip", !active && "border-ink bg-ink text-bone")}>
          All
        </Link>
        {BLOG_CATEGORIES.map((c) => (
          <Link key={c.slug} href={`/blog/category/${c.slug}`} className={cn("chip", active === c.slug && "border-ink bg-ink text-bone")}>
            {c.name}
          </Link>
        ))}
      </nav>

      {posts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-ink/25 bg-bone/50 p-10 text-center">
          <p className="font-display text-xl font-semibold">No articles here yet</p>
          <p className="mt-1 text-muted">New guides are on the way. In the meantime, try the tattoo generator.</p>
          <Link href="/tattoo-generator" className="btn btn-primary mt-5">
            Open the generator
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <PostCard key={p.slug} post={p} />
          ))}
        </div>
      )}

    </>
  );
}
