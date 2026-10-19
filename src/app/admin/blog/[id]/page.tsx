import { isValidObjectId } from "mongoose";
import { notFound } from "next/navigation";
import { Editor } from "@/components/admin/Editor";
import { connectDB } from "@/lib/db/connect";
import { BlogPost } from "@/lib/db/models/BlogPost";

const EMPTY = { title: "", slug: "", excerpt: "", content: "", featuredImage: "", category: "ideas", author: "TattooGenerator Editorial Team", metaTitle: "", metaDescription: "", tools: [] as string[], status: "draft" };

export default async function BlogEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (id === "new") {
    return (
      <>
        <h1 className="mb-6 text-3xl font-semibold">New post</h1>
        <Editor initial={EMPTY} url="/api/admin/blog" method="POST" redirectTo="/admin/blog/:id" />
      </>
    );
  }
  if (!isValidObjectId(id)) notFound();
  await connectDB();
  const p = await BlogPost.findById(id).lean();
  if (!p) notFound();
  const initial = { title: p.title, slug: p.slug, excerpt: p.excerpt, content: p.content, featuredImage: p.featuredImage ?? "", category: p.category, author: p.author ?? EMPTY.author, metaTitle: p.metaTitle, metaDescription: p.metaDescription, tools: [...(p.tools ?? [])], status: p.status };
  return (
    <>
      <h1 className="mb-6 text-3xl font-semibold">Edit post</h1>
      <Editor initial={initial} url={`/api/admin/blog/${id}`} deleteUrl={`/api/admin/blog/${id}`} redirectTo="/admin/blog" />
    </>
  );
}
