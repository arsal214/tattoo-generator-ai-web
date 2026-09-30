import type { TattooFont } from "./tattoo-fonts";

export interface LetteringOptions {
  /** One string per line. */
  lines: string[];
  font: TattooFont;
  /** Font size in canvas px. */
  size: number;
  /** Extra letter spacing in px. */
  spacing: number;
  align: "left" | "center" | "right";
  /** Line height multiplier. */
  lineHeight: number;
  color: string;
  /** CSS colour or "transparent". */
  background: string;
  /** Mirror horizontally (for stencil transfer). */
  mirror?: boolean;
  /** Optional rotation in degrees applied around the centre. */
  padding?: number;
}

const fontShorthand = (o: Pick<LetteringOptions, "font" | "size">) => `${o.font.weight} ${o.size}px ${o.font.family}`;

/** Wait until the browser has the font loaded so the canvas doesn't draw a fallback. */
export async function ensureFont(font: TattooFont, size = 48, sample = "AaBb") {
  if (typeof document === "undefined" || !document.fonts) return;
  try {
    await document.fonts.load(`${font.weight} ${size}px ${font.family}`, sample);
  } catch {
    /* fall back to whatever is available */
  }
}

/** Draws text with manual letter spacing (ctx.letterSpacing is not supported everywhere). */
export function renderLettering(canvas: HTMLCanvasElement, o: LetteringOptions) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const pad = o.padding ?? Math.round(o.size * 0.6);
  const lines = o.lines.length ? o.lines : [""];
  ctx.font = fontShorthand(o);

  const measure = (line: string) => {
    if (o.spacing === 0) return ctx.measureText(line).width;
    return [...line].reduce((w, ch) => w + ctx.measureText(ch).width + o.spacing, -o.spacing);
  };
  const widths = lines.map(measure);
  const contentW = Math.max(...widths, o.size);
  const lh = o.size * o.lineHeight;
  const dpr = 2;
  const w = Math.ceil(contentW + pad * 2);
  const h = Math.ceil(lh * lines.length + pad * 2 - (lh - o.size) * 0.5);

  canvas.width = w * dpr;
  canvas.height = h * dpr;
  ctx.scale(dpr, dpr);
  if (o.background !== "transparent") {
    ctx.fillStyle = o.background;
    ctx.fillRect(0, 0, w, h);
  }
  if (o.mirror) {
    ctx.translate(w, 0);
    ctx.scale(-1, 1);
  }
  ctx.font = fontShorthand(o); // resetting canvas size clears state
  ctx.fillStyle = o.color;
  ctx.textBaseline = "alphabetic";
  lines.forEach((line, i) => {
    const lw = widths[i];
    const x = o.align === "left" ? pad : o.align === "right" ? w - pad - lw : (w - lw) / 2;
    const y = pad + o.size * 0.85 + i * lh;
    if (o.spacing === 0) return ctx.fillText(line, x, y);
    let cx = x;
    for (const ch of line) {
      ctx.fillText(ch, cx, y);
      cx += ctx.measureText(ch).width + o.spacing;
    }
  });
}

export function downloadCanvas(canvas: HTMLCanvasElement, filename: string) {
  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename.endsWith(".png") ? filename : `${filename}.png`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }, "image/png");
}
