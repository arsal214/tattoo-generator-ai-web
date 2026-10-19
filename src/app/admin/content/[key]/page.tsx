import { notFound } from "next/navigation";
import { Editor } from "@/components/admin/Editor";
import { getContent } from "@/lib/content";
import { CONTENT_KEYS, type ContentKey } from "@/lib/content/defaults";

export default async function ContentPage({ params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  if (!CONTENT_KEYS.includes(key as ContentKey)) notFound();
  const data = await getContent(key as ContentKey);
  return (
    <>
      <h1 className="mb-1 text-3xl font-semibold capitalize">{key} content</h1>
      <p className="mb-6 text-sm text-muted">Fields named “body” accept Markdown. Tool pages and the legal pages (privacy, terms, cookies) are not editable here.</p>
      <Editor initial={data} url={`/api/admin/content/${key}`} wrap="data" />
    </>
  );
}
