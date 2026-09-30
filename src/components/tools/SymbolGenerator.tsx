"use client";

import { useMemo, useState } from "react";
import { Download } from "lucide-react";
import type { ToolDef } from "@/lib/tools/types";
import { TATTOO_FONTS, getFont, type TattooFont } from "@/lib/tattoo-fonts";
import { downloadCanvas, ensureFont } from "@/lib/lettering";

const r1 = (n: number) => Math.round(n * 10) / 10;
const polar = (cx: number, cy: number, r: number, deg: number) => {
  const a = (deg * Math.PI) / 180;
  return `${r1(cx + r * Math.cos(a))} ${r1(cy + r * Math.sin(a))}`;
};
const STAR = "M" + Array.from({ length: 10 }, (_, i) => polar(50, 53, i % 2 ? 17 : 42, -90 + 36 * i)).join(" L") + " Z";
const RAYS = Array.from({ length: 8 }, (_, i) => `M${polar(50, 50, 26, 45 * i)} L${polar(50, 50, 40, 45 * i)}`).join(" ");
const circle = (cx: number, cy: number, r: number) => `M${cx + r} ${cy} A${r} ${r} 0 1 1 ${cx - r} ${cy} A${r} ${r} 0 1 1 ${cx + r} ${cy} Z`;

/** Hand-drawn line symbols in a 100x100 viewBox. Stroke only, no fills. */
const SYMBOLS: { id: string; label: string; paths: string[] }[] = [
  { id: "infinity", label: "Infinity", paths: ["M50 50 C40 30 12 30 12 50 C12 70 40 70 50 50 C60 30 88 30 88 50 C88 70 60 70 50 50 Z"] },
  { id: "heart", label: "Heart", paths: ["M50 84 C20 62 12 44 12 32 C12 20 22 14 32 14 C40 14 47 19 50 26 C53 19 60 14 68 14 C78 14 88 20 88 32 C88 44 80 62 50 84 Z"] },
  { id: "star", label: "Star", paths: [STAR] },
  { id: "moon", label: "Crescent moon", paths: ["M66 14 A38 38 0 1 0 86 68 A30 30 0 0 1 66 14 Z"] },
  { id: "sun", label: "Sun", paths: [circle(50, 50, 16), RAYS] },
  { id: "arrow", label: "Arrow", paths: ["M16 84 L84 16", "M54 16 H84 V46", "M16 84 V62 M16 84 H38", "M28 72 V54 M28 72 H46"] },
  { id: "anchor", label: "Anchor", paths: [circle(50, 20, 8), "M50 28 V86", "M36 40 H64", "M16 58 C18 78 34 86 50 86 C66 86 82 78 84 58", "M8 64 L16 54 L24 64", "M76 64 L84 54 L92 64"] },
  { id: "feather", label: "Feather", paths: ["M84 14 C50 16 24 40 18 82 C50 74 78 50 84 14 Z", "M12 92 L18 82 L80 20", "M40 62 L28 58", "M52 50 L40 44", "M64 38 L54 30"] },
  { id: "compass", label: "Compass rose", paths: [circle(50, 50, 40), "M50 12 L58 42 L88 50 L58 58 L50 88 L42 58 L12 50 L42 42 Z", "M26 26 L38 38 M74 26 L62 38 M26 74 L38 62 M74 74 L62 62"] },
  { id: "triangle", label: "Triangle / delta", paths: ["M50 12 L90 82 H10 Z", "M50 40 L68 70 H32 Z"] },
  { id: "lotus", label: "Lotus", paths: ["M50 18 C38 34 38 56 50 72 C62 56 62 34 50 18 Z", "M50 72 C30 68 16 54 12 36 C30 38 42 50 50 72", "M50 72 C70 68 84 54 88 36 C70 38 58 50 50 72", "M50 72 C24 76 10 66 6 54 C22 52 38 58 50 72", "M50 72 C76 76 90 66 94 54 C78 52 62 58 50 72", "M32 86 H68"] },
  { id: "key", label: "Key", paths: [circle(24, 50, 14), circle(24, 50, 4), "M38 50 H90", "M76 50 V64", "M88 50 V60"] },
  { id: "mountain", label: "Mountains", paths: ["M6 82 L36 32 L54 62 L64 46 L94 82 Z", "M28 46 L36 52 L44 46"] },
  { id: "eye", label: "Eye", paths: ["M6 50 C24 22 76 22 94 50 C76 78 24 78 6 50 Z", circle(50, 50, 11), circle(50, 50, 3)] },
  { id: "cross", label: "Cross", paths: ["M50 8 V92", "M28 34 H72"] },
];

const COLORS = [
  { id: "black", label: "Black", hex: "#0e0e11" },
  { id: "ink", label: "Blue-black ink", hex: "#1f2a44" },
  { id: "grey", label: "Grey wash", hex: "#8a8a8a" },
];

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const textSize = (len: number) => Math.min(18, 175 / Math.max(len, 1));

function buildSvg(o: { paths: string[]; weight: number; color: string; text: string; font: TattooFont; width: number; transparent: boolean }) {
  const H = o.text ? 136 : 100;
  const bg = o.transparent ? "" : `<rect width="100" height="${H}" fill="#ffffff"/>`;
  const paths = o.paths.map((d) => `<path d="${d}"/>`).join("");
  const text = o.text
    ? `<text x="50" y="122" text-anchor="middle" fill="${o.color}" font-size="${r1(textSize(o.text.length))}" font-weight="${o.font.weight}" font-family="${o.font.family.replace(/"/g, "'")}, Georgia, serif">${esc(o.text)}</text>`
    : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 ${H}" width="${o.width}" height="${r1((o.width * H) / 100)}">${bg}<g fill="none" stroke="${o.color}" stroke-width="${o.weight}" stroke-linecap="round" stroke-linejoin="round">${paths}</g>${text}</svg>`;
}

function save(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default function SymbolGenerator({ tool }: { tool: ToolDef }) {
  const [symId, setSymId] = useState("infinity");
  const [weight, setWeight] = useState(3);
  const [size, setSize] = useState(240);
  const [colorId, setColorId] = useState("black");
  const [text, setText] = useState("");
  const [fontId, setFontId] = useState(tool.preset?.fontStyle ?? "minimal");
  const [transparent, setTransparent] = useState(false);

  const sym = SYMBOLS.find((s) => s.id === symId) ?? SYMBOLS[0];
  const color = (COLORS.find((c) => c.id === colorId) ?? COLORS[0]).hex;
  const font = getFont(fontId);
  const caption = text.trim().slice(0, 24);

  const svg = useMemo(
    () => buildSvg({ paths: sym.paths, weight, color, text: caption, font, width: size, transparent }),
    [sym, weight, color, caption, font, size, transparent],
  );

  const downloadSvg = () => save(new Blob([buildSvg({ paths: sym.paths, weight, color, text: caption, font, width: 1000, transparent })], { type: "image/svg+xml" }), `tattoo-symbol-${sym.id}.svg`);

  const downloadPng = async () => {
    const H = caption ? 136 : 100;
    const px = 1000;
    const canvas = document.createElement("canvas");
    canvas.width = px;
    canvas.height = Math.round((px * H) / 100);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const k = px / 100;
    if (!transparent) {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    ctx.scale(k, k);
    ctx.strokeStyle = color;
    ctx.lineWidth = weight;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    sym.paths.forEach((d) => ctx.stroke(new Path2D(d)));
    if (caption) {
      const fs = textSize(caption.length);
      await ensureFont(font, 48, caption);
      ctx.font = `${font.weight} ${fs}px ${font.family}`;
      ctx.fillStyle = color;
      ctx.textAlign = "center";
      ctx.fillText(caption, 50, 122);
    }
    downloadCanvas(canvas, `tattoo-symbol-${sym.id}`);
  };

  return (
    <div className="card p-4 sm:p-6">
      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <div className="space-y-5">
          <div>
            <span className="label">Symbol</span>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-5" role="group" aria-label="Symbol">
              {SYMBOLS.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  aria-pressed={symId === s.id}
                  aria-label={s.label}
                  title={s.label}
                  onClick={() => setSymId(s.id)}
                  className={`flex min-h-16 flex-col items-center justify-center gap-1 rounded-xl border p-2 text-[11px] leading-tight transition-colors ${symId === s.id ? "border-ink bg-ink text-bone" : "border-line bg-white text-ink hover:border-ink"}`}
                >
                  <svg viewBox="0 0 100 100" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    {s.paths.map((d, i) => (
                      <path key={i} d={d} />
                    ))}
                  </svg>
                  <span className="truncate">{s.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="sy-w">Stroke weight ({weight})</label>
              <input id="sy-w" type="range" min={1} max={8} step={0.5} value={weight} onChange={(e) => setWeight(Number(e.target.value))} className="h-11 w-full" />
            </div>
            <div>
              <label className="label" htmlFor="sy-s">Preview size ({size}px)</label>
              <input id="sy-s" type="range" min={80} max={400} step={10} value={size} onChange={(e) => setSize(Number(e.target.value))} className="h-11 w-full" />
            </div>
          </div>

          <div>
            <span className="label">Ink colour</span>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Ink colour">
              {COLORS.map((c) => (
                <button key={c.id} type="button" className="chip" aria-pressed={colorId === c.id} onClick={() => setColorId(c.id)}>
                  <span className="mr-2 inline-block h-3 w-3 rounded-full border border-line" style={{ background: c.hex }} aria-hidden />
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="label" htmlFor="sy-text">Text below the symbol (optional)</label>
            <input id="sy-text" className="input" value={text} maxLength={24} onChange={(e) => setText(e.target.value)} placeholder="e.g. Always" />
          </div>
          {caption && (
            <div>
              <span className="label">Text style</span>
              <div className="flex flex-wrap gap-2" role="group" aria-label="Text style">
                {TATTOO_FONTS.map((f) => (
                  <button key={f.id} type="button" className="chip" aria-pressed={fontId === f.id} onClick={() => setFontId(f.id)}>{f.label}</button>
                ))}
              </div>
            </div>
          )}
          <label className="flex min-h-11 items-center gap-2 text-sm">
            <input type="checkbox" checked={transparent} onChange={(e) => setTransparent(e.target.checked)} className="h-5 w-5" />
            Transparent background
          </label>
        </div>

        <div>
          <div
            className={`flex min-h-64 items-center justify-center overflow-hidden rounded-xl border border-line p-4 ${transparent ? "bg-[repeating-conic-gradient(#eee_0_25%,#fff_0_50%)] bg-[length:16px_16px]" : "bg-white"}`}
            role="img"
            aria-label={`${sym.label} tattoo symbol preview${caption ? ` with the text ${caption}` : ""}`}
          >
            {/* svg is built from static path data and escaped text only */}
            <div className="max-w-full [&_svg]:h-auto [&_svg]:max-w-full" dangerouslySetInnerHTML={{ __html: svg }} />
          </div>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <button type="button" className="btn btn-dark" onClick={downloadPng}><Download size={16} aria-hidden /> Download PNG</button>
            <button type="button" className="btn btn-outline" onClick={downloadSvg}><Download size={16} aria-hidden /> Download SVG</button>
          </div>
          <p className="mt-3 text-xs text-muted">These are simple reference drawings for planning. Your artist will redraw and refine the symbol for your body and skin. SVG text uses live fonts, so it may look different on a computer without them; use the PNG if you want exact lettering.</p>
        </div>
      </div>
    </div>
  );
}
