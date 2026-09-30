import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolPageShell } from "@/components/tools/ToolPageShell";
import { postsBySlugs } from "@/lib/blog/queries";
import { buildMetadata } from "@/lib/seo";
import { TOOLS, getTool } from "@/lib/tools/registry";

// Only registered tools exist; anything else falls through to the 404 page.
export const dynamicParams = false;
export const revalidate = 3600;

export const generateStaticParams = () => TOOLS.map((t) => ({ tool: t.slug }));

export async function generateMetadata({ params }: { params: Promise<{ tool: string }> }): Promise<Metadata> {
  const tool = getTool((await params).tool);
  if (!tool) return {};
  return buildMetadata({ title: tool.metaTitle, description: tool.metaDescription, path: `/${tool.slug}`, ownOg: true });
}

export default async function ToolPage({ params }: { params: Promise<{ tool: string }> }) {
  const tool = getTool((await params).tool);
  if (!tool) notFound();
  const related = tool.related.map(getTool).filter((t) => t !== undefined);
  const posts = await postsBySlugs(tool.articles);
  return <ToolPageShell tool={tool} related={related} posts={posts} />;
}
