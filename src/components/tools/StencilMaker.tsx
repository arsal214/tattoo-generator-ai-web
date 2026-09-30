"use client";

import { useEffect, useRef, useState } from "react";
import { Download, Upload } from "lucide-react";
import type { ToolDef } from "@/lib/tools/types";

const MAX_BYTES = 10 * 1024 * 1024;
const DPI = 300;
const MAX_PX = 4800; // 16 in at 300 DPI
const PREVIEW_PX = 720;

interface Opts {
  mode: "tone" | "outline";
  threshold: number; // 0-255, tone mode
  sensitivity: number; // 0-100, outline mode
  contrast: number; // -100..100
  thickness: number; // 0..5
  invert: boolean;
  mirror: boolean;
  transparent: boolean;
}

const DEFAULTS: Opts = { mode: "tone", threshold: 140, sensitivity: 50, contrast: 0, thickness: 0, invert: false, mirror: false, transparent: false };

/** Builds a black-ink stencil canvas of width W from the source image. Runs entirely in the browser. */
function buildStencil(img: HTMLImageElement, W: number, o: Opts): HTMLCanvasElement {
  const H = Math.max(1, Math.round((W * img.naturalHeight) / img.naturalWidth));
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const ctx = c.getContext("2d", { willReadFrequently: true })!;
  ctx.fillStyle = "#fff"; // transparent PNGs become white before thresholding
  ctx.fillRect(0, 0, W, H);
  ctx.drawImage(img, 0, 0, W, H);
  const src = ctx.getImageData(0, 0, W, H).data;
  const n = W * H;

  const k = (259 * (o.contrast + 255)) / (255 * (259 - o.contrast));
  const gray = new Uint8ClampedArray(n);
  for (let i = 0; i < n; i++) {
    const g = 0.299 * src[i * 4] + 0.587 * src[i * 4 + 1] + 0.114 * src[i * 4 + 2];
    gray[i] = (g - 128) * k + 128;
  }

  let ink = new Uint8Array(n);
  if (o.mode === "tone") {
    for (let i = 0; i < n; i++) ink[i] = gray[i] < o.threshold ? 1 : 0;
  } else {
    const cut = 400 - o.sensitivity * 3.5; // Sobel magnitude cutoff; higher sensitivity = more lines
    for (let y = 1; y < H - 1; y++) {
      for (let x = 1; x < W - 1; x++) {
        const i = y * W + x;
        const a = gray[i - W - 1], b = gray[i - W], cc = gray[i - W + 1];
        const d = gray[i - 1], f = gray[i + 1];
        const g = gray[i + W - 1], h = gray[i + W], j = gray[i + W + 1];
        const gx = cc + 2 * f + j - a - 2 * d - g;
        const gy = g + 2 * h + j - a - 2 * b - cc;
        ink[i] = Math.hypot(gx, gy) > cut ? 1 : 0;
      }
    }
  }

  const r = Math.round((o.thickness * W) / 1200);
  if (r > 0) ink = dilate(ink, W, H, r);

  const out = ctx.createImageData(W, H);
  const px = out.data;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const sx = o.mirror ? W - 1 - x : x;
      const on = (ink[y * W + sx] === 1) !== o.invert;
      const p = (y * W + x) * 4;
      if (on) {
        px[p] = px[p + 1] = px[p + 2] = 17;
        px[p + 3] = 255;
      } else {
        px[p] = px[p + 1] = px[p + 2] = 255;
        px[p + 3] = o.transparent ? 0 : 255;
      }
    }
  }
  ctx.putImageData(out, 0, 0);
  return c;
}

/** Square dilation via two sliding-window passes (O(n) regardless of radius). */
function dilate(src: Uint8Array, W: number, H: number, r: number) {
  const tmp = new Uint8Array(src.length);
  for (let y = 0; y < H; y++) {
    let cnt = 0;
    const row = y * W;
    for (let x = 0; x < Math.min(r, W); x++) cnt += src[row + x];
    for (let x = 0; x < W; x++) {
      if (x + r < W) cnt += src[row + x + r];
      if (x - r - 1 >= 0) cnt -= src[row + x - r - 1];
      tmp[row + x] = cnt > 0 ? 1 : 0;
    }
  }
  const out = new Uint8Array(src.length);
  for (let x = 0; x < W; x++) {
    let cnt = 0;
    for (let y = 0; y < Math.min(r, H); y++) cnt += tmp[y * W + x];
    for (let y = 0; y < H; y++) {
      if (y + r < H) cnt += tmp[(y + r) * W + x];
      if (y - r - 1 >= 0) cnt -= tmp[(y - r - 1) * W + x];
      out[y * W + x] = cnt > 0 ? 1 : 0;
    }
  }
  return out;
}

const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();
const crc32 = (b: Uint8Array) => {
  let c = 0xffffffff;
  for (let i = 0; i < b.length; i++) c = CRC_TABLE[(c ^ b[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
};

/** Inserts a pHYs chunk so print software opens the PNG at the intended physical size. */
function withDpi(png: Uint8Array, dpi: number): Uint8Array {
  const ppm = Math.round(dpi / 0.0254);
  const chunk = new Uint8Array(21); // length(4) + type(4) + data(9) + crc(4)
  const dv = new DataView(chunk.buffer);
  dv.setUint32(0, 9);
  chunk.set([0x70, 0x48, 0x59, 0x73], 4); // "pHYs"
  dv.setUint32(8, ppm);
  dv.setUint32(12, ppm);
  chunk[16] = 1; // meters
  dv.setUint32(17, crc32(chunk.subarray(4, 17)));
  const at = 33; // signature (8) + IHDR chunk (25)
  const out = new Uint8Array(png.length + chunk.length);
  out.set(png.subarray(0, at), 0);
  out.set(chunk, at);
  out.set(png.subarray(at), at + chunk.length);
  return out;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function StencilMaker({ tool }: { tool: ToolDef }) {
  const [o, setO] = useState<Opts>(DEFAULTS);
  const [src, setSrc] = useState<{ img: HTMLImageElement; url: string; name: string } | null>(null);
  const [err, setErr] = useState("");
  const [inches, setInches] = useState("4");
  const [busy, setBusy] = useState(false);
  const canvas = useRef<HTMLCanvasElement>(null);
  const set = <K extends keyof Opts>(k: K, v: Opts[K]) => setO((p) => ({ ...p, [k]: v }));

  const inch = Number(inches);
  const inchOk = Number.isFinite(inch) && inch >= 0.5 && inch <= MAX_PX / DPI;
  const outW = inchOk ? Math.round(inch * DPI) : 0;
  const outH = src ? Math.round((outW * src.img.naturalHeight) / src.img.naturalWidth) : 0;

  useEffect(() => () => { if (src) URL.revokeObjectURL(src.url); }, [src]);

  const onFile = (file?: File) => {
    setErr("");
    if (!file) return;
    if (!/^image\/(png|jpe?g|webp)$/.test(file.type)) return setErr("Please choose a PNG, JPG or WebP image.");
    if (file.size > MAX_BYTES) return setErr(`That file is ${(file.size / 1048576).toFixed(1)} MB. The limit is 10 MB, so try a smaller or compressed copy.`);
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => setSrc({ img, url, name: file.name.replace(/\.[^.]+$/, "") });
    img.onerror = () => {
      URL.revokeObjectURL(url);
      setErr("We could not read that image. Try re-saving it as a PNG or JPG.");
    };
    img.src = url;
  };

  // Live preview at reduced resolution (line thickness scales with width, so it matches the export).
  useEffect(() => {
    if (!src || !canvas.current) return;
    const t = setTimeout(() => {
      const w = Math.min(PREVIEW_PX, src.img.naturalWidth);
      const out = buildStencil(src.img, w, o);
      const el = canvas.current;
      if (!el) return;
      el.width = out.width;
      el.height = out.height;
      el.getContext("2d")!.drawImage(out, 0, 0);
    }, 60);
    return () => clearTimeout(t);
  }, [src, o]);

  const download = () => {
    if (!src || !inchOk) return;
    setBusy(true);
    setTimeout(() => {
      try {
        buildStencil(src.img, outW, o).toBlob(async (blob) => {
          if (!blob) {
            setErr("The export failed. Try a smaller print width.");
            setBusy(false);
            return;
          }
          const bytes = withDpi(new Uint8Array(await blob.arrayBuffer()), DPI);
          const a = document.createElement("a");
          a.href = URL.createObjectURL(new Blob([bytes as BlobPart], { type: "image/png" }));
          a.download = `${src.name || "tattoo"}-stencil-${inch}in-${DPI}dpi.png`;
          a.click();
          setTimeout(() => URL.revokeObjectURL(a.href), 2000);
          setBusy(false);
        }, "image/png");
      } catch {
        setErr("The export failed. Try a smaller print width.");
        setBusy(false);
      }
    }, 30);
  };

  const smaller = src && outW > src.img.naturalWidth;

  return (
    <div className="card p-4 sm:p-6">
      <p className="mb-4 rounded-xl bg-bone px-4 py-3 text-sm text-ink/80">
        Your image never leaves your browser. Everything is processed on your device. The stencil is for planning and reference; a professional tattoo artist prepares the actual transfer.
      </p>

      <div className="grid gap-6 lg:grid-cols-[340px_minmax(0,1fr)]">
        <div className="space-y-5">
          <div>
            <label className="label" htmlFor="st-file">Upload an image (PNG, JPG or WebP, up to 10 MB)</label>
            <label htmlFor="st-file" className="flex min-h-24 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-ink/30 bg-white px-3 text-center text-sm hover:border-ink">
              <Upload size={20} aria-hidden />
              <span>{src ? `Replace "${src.name}"` : "Choose a file"}</span>
            </label>
            <input id="st-file" type="file" accept="image/png,image/jpeg,image/webp" className="sr-only" onChange={(e) => { onFile(e.target.files?.[0]); e.target.value = ""; }} />
            {err && <p role="alert" className="mt-2 rounded-xl bg-accent-soft px-3 py-2 text-sm text-accent-dark">{err}</p>}
          </div>

          <div>
            <span className="label" id="st-mode">Style</span>
            <div className="flex gap-2" role="group" aria-labelledby="st-mode">
              <button type="button" className="chip min-h-11" aria-pressed={o.mode === "tone"} onClick={() => set("mode", "tone")}>Solid tones</button>
              <button type="button" className="chip min-h-11" aria-pressed={o.mode === "outline"} onClick={() => set("mode", "outline")}>Outline only</button>
            </div>
          </div>

          {o.mode === "tone" ? (
            <Range id="st-thr" label="Threshold" hint="Higher keeps more of the image as ink" min={0} max={255} value={o.threshold} onChange={(v) => set("threshold", v)} />
          ) : (
            <Range id="st-sens" label="Edge sensitivity" hint="Higher picks up fainter lines" min={0} max={100} value={o.sensitivity} onChange={(v) => set("sensitivity", v)} />
          )}
          <Range id="st-con" label="Contrast" min={-100} max={100} value={o.contrast} onChange={(v) => set("contrast", v)} />
          <Range id="st-thick" label="Line thickness" hint="0 = as detected" min={0} max={5} value={o.thickness} onChange={(v) => set("thickness", v)} />

          <div className="grid gap-1">
            <Check label="Invert (swap ink and paper)" checked={o.invert} onChange={(v) => set("invert", v)} />
            <Check label="Mirror horizontally" checked={o.mirror} onChange={(v) => set("mirror", v)} />
            <Check label="Transparent background" checked={o.transparent} onChange={(v) => set("transparent", v)} />
          </div>

          <div>
            <label className="label" htmlFor="st-in">Print width (inches, at {DPI} DPI)</label>
            <input id="st-in" className="input" inputMode="decimal" value={inches} onChange={(e) => setInches(e.target.value)} aria-invalid={!inchOk} />
            {!inchOk ? (
              <p role="alert" className="mt-1 text-sm text-accent-dark">Enter a width from 0.5 to {MAX_PX / DPI} inches.</p>
            ) : src ? (
              <p className="mt-1 text-xs text-muted">
                Output: {outW} x {outH} px, about {inch} x {(outH / DPI).toFixed(2)} in.
                {smaller && " Your image is smaller than this output size, so edges may look soft."}
              </p>
            ) : null}
          </div>

          <div className="flex flex-wrap gap-2">
            <button type="button" className="btn btn-dark" disabled={!src || !inchOk || busy} onClick={download}>
              <Download size={16} aria-hidden /> {busy ? "Preparing..." : "Download PNG"}
            </button>
            <button type="button" className="btn btn-outline" onClick={() => setO(DEFAULTS)}>Reset settings</button>
          </div>
        </div>

        <div>
          <div
            className={`flex min-h-64 items-center justify-center overflow-hidden rounded-xl border border-line ${
              o.transparent ? "bg-[repeating-conic-gradient(#eee_0_25%,#fff_0_50%)] bg-[length:16px_16px]" : "bg-white"
            }`}
          >
            {src ? (
              <canvas ref={canvas} className="h-auto max-h-[600px] w-full object-contain" role="img" aria-label="Live stencil preview" />
            ) : (
              <p className="px-6 text-center text-sm text-muted">Upload a design to see a live stencil preview. Line art with clear contrast works best.</p>
            )}
          </div>
          <p className="mt-2 text-xs text-muted">Preview is shown at reduced resolution; the download is rendered at full size.</p>
        </div>
      </div>
    </div>
  );
}

function Range({ id, label, hint, min, max, value, onChange }: { id: string; label: string; hint?: string; min: number; max: number; value: number; onChange: (v: number) => void }) {
  return (
    <div>
      <label className="label flex justify-between" htmlFor={id}>
        <span>{label}</span>
        <span className="font-normal text-muted">{value}</span>
      </label>
      <input id={id} type="range" min={min} max={max} value={value} onChange={(e) => onChange(Number(e.target.value))} className="h-11 w-full accent-accent" />
      {hint && <p className="-mt-1 text-xs text-muted">{hint}</p>}
    </div>
  );
}

function Check({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex min-h-11 cursor-pointer items-center gap-3 text-sm">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="h-5 w-5 accent-accent" />
      {label}
    </label>
  );
}
