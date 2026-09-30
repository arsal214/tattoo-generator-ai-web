import { OG_SIZE, renderOg } from "@/lib/og";
import { SITE } from "@/lib/site";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = SITE.tagline;

export default function Image() {
  return renderOg({ title: SITE.tagline, eyebrow: "AI tattoo design" });
}
