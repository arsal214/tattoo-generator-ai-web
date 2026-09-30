import { getPost } from "@/lib/blog/queries";
import { OG_SIZE, renderOg } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Tattoo article";
export const revalidate = 3600;

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const post = await getPost((await params).slug);
  return renderOg({ title: post?.title ?? "TattooGenerator.com", eyebrow: "Tattoo guide" });
}
