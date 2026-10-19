import Link from "next/link";
import { connectDB } from "@/lib/db/connect";
import { BlogPost } from "@/lib/db/models/BlogPost";

export default async function AdminBlog() {
  await connectDB();
  const posts = await BlogPost.find().select("title slug status category publishedAt").sort({ createdAt: -1 }).lean();
  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Blog ({posts.length})</h1>
        <Link href="/admin/blog/new" className="btn btn-primary btn-sm">
          New post
        </Link>
      </div>
      <ul className="divide-y divide-line rounded-xl border border-line bg-white">
        {posts.map((p) => (
          <li key={String(p._id)}>
            <Link href={`/admin/blog/${p._id}`} className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-bone/60">
              <span className="min-w-0 truncate">{p.title}</span>
              <span className="shrink-0 text-xs text-muted">
                {p.category} · {p.status}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
