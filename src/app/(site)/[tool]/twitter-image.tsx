import { renderOg, OG_SIZE } from "@/lib/og";
import { TOOLS, getTool } from "@/lib/tools/registry";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Tattoo tool preview";
export const generateStaticParams = () => TOOLS.map((t) => ({ tool: t.slug }));

export default async function Image({ params }: { params: Promise<{ tool: string }> }) {
  const tool = getTool((await params).tool);
  return renderOg({ title: tool?.h1 ?? "TattooGenerator.com", eyebrow: "Free tattoo tool" });
}
