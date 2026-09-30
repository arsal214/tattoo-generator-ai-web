import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 };

/** Branded 1200×630 social card used by every indexable page. */
export function renderOg({ title, eyebrow }: { title: string; eyebrow?: string }) {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#0e0e11", color: "#f4efe4", padding: 72 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 30, letterSpacing: 2 }}>
          <div style={{ width: 16, height: 16, borderRadius: 16, background: "#d6371f" }} />
          TATTOOGENERATOR.COM
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {eyebrow && <div style={{ fontSize: 28, color: "#d6371f", textTransform: "uppercase", letterSpacing: 4 }}>{eyebrow}</div>}
          <div style={{ fontSize: title.length > 60 ? 58 : 72, lineHeight: 1.08, fontWeight: 700, maxWidth: 1000 }}>{title}</div>
        </div>
        <div style={{ fontSize: 28, color: "#a9a498" }}>Design ideas · Lettering · Placement · Planning</div>
      </div>
    ),
    OG_SIZE,
  );
}
