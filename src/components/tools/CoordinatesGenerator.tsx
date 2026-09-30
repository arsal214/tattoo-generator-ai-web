"use client";

import { useMemo, useState } from "react";
import { Check, Copy } from "lucide-react";
import type { ToolDef } from "@/lib/tools/types";
import { TATTOO_FONTS, getFont } from "@/lib/tattoo-fonts";
import { LetteringPreview } from "./LetteringPreview";

type Fmt = "decimal" | "dms" | "ddm";

function parseNum(s: string): number | null {
  const t = s.trim();
  if (!t) return null;
  return /^[-+]?(\d+\.?\d*|\.\d+)$/.test(t) ? Number(t) : null;
}

/** Accepts "40.7128, -74.0060" or "40.7128 N 74.0060 W" (decimal degrees only). */
function parsePair(text: string): { lat: string; lon: string } | null {
  const m = /^\s*([-+]?\d+(?:\.\d+)?)\s*°?\s*([NSns])?\s*[,;\s]\s*([-+]?\d+(?:\.\d+)?)\s*°?\s*([EWew])?\s*$/.exec(text);
  if (!m) return null;
  const sign = (v: string, neg: boolean) => {
    const bare = v.replace(/^[-+]/, "");
    return neg || v.startsWith("-") ? `-${bare}` : bare;
  };
  return { lat: sign(m[1], m[2]?.toUpperCase() === "S"), lon: sign(m[3], m[4]?.toUpperCase() === "W") };
}

function fmt(value: number, axis: "lat" | "lon", f: Fmt, decimals: number): string {
  const hemi = axis === "lat" ? (value < 0 ? "S" : "N") : value < 0 ? "W" : "E";
  const abs = Math.abs(value);
  if (f === "decimal") return `${abs.toFixed(decimals)}° ${hemi}`;
  if (f === "dms") {
    const t = Math.round(abs * 3600);
    return `${Math.floor(t / 3600)}° ${Math.floor((t % 3600) / 60)}' ${t % 60}" ${hemi}`;
  }
  const t = Math.round(abs * 60000);
  return `${Math.floor(t / 60000)}° ${((t % 60000) / 1000).toFixed(3)}' ${hemi}`;
}

const FORMAT_LABELS: { id: Fmt; label: string }[] = [
  { id: "decimal", label: "Decimal degrees" },
  { id: "dms", label: "Degrees, minutes, seconds" },
  { id: "ddm", label: "Degrees, decimal minutes" },
];

function CopyButton({ text }: { text: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      className="btn btn-outline btn-sm"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setDone(true);
          setTimeout(() => setDone(false), 1500);
        } catch {
          /* clipboard unavailable */
        }
      }}
    >
      {done ? <Check size={14} aria-hidden /> : <Copy size={14} aria-hidden />} {done ? "Copied" : "Copy"}
    </button>
  );
}

export default function CoordinatesGenerator({ tool }: { tool: ToolDef }) {
  const [lat, setLat] = useState("40.7128");
  const [lon, setLon] = useState("-74.0060");
  const [paste, setPaste] = useState("");
  const [pasteErr, setPasteErr] = useState("");
  const [f, setF] = useState<Fmt>("decimal");
  const [layout, setLayout] = useState<"stacked" | "line">("stacked");
  const [decimals, setDecimals] = useState(4);
  const [fontId, setFontId] = useState(tool.preset?.fontStyle ?? "minimal");
  const [size, setSize] = useState(64);
  const [transparent, setTransparent] = useState(false);

  const latN = parseNum(lat);
  const lonN = parseNum(lon);
  const latErr = !lat.trim() ? "Enter a latitude." : latN === null ? "Latitude must be a number like 40.7128." : Math.abs(latN) > 90 ? "Latitude must be between -90 and 90." : "";
  const lonErr = !lon.trim() ? "Enter a longitude." : lonN === null ? "Longitude must be a number like -74.0060." : Math.abs(lonN) > 180 ? "Longitude must be between -180 and 180." : "";
  const valid = !latErr && !lonErr && latN !== null && lonN !== null;

  const out = useMemo(() => {
    if (!valid) return null;
    return Object.fromEntries(
      FORMAT_LABELS.map(({ id }) => [id, [fmt(latN!, "lat", id, decimals), fmt(lonN!, "lon", id, decimals)]]),
    ) as Record<Fmt, [string, string]>;
  }, [valid, latN, lonN, decimals]);

  const lines = out ? (layout === "stacked" ? out[f] : [out[f].join("   ")]) : [];
  const font = getFont(fontId);

  const applyPaste = () => {
    const p = parsePair(paste);
    if (!p) {
      setPasteErr("Use decimal degrees such as 40.7128, -74.0060 or 40.7128 N 74.0060 W.");
      return;
    }
    setPasteErr("");
    setLat(p.lat);
    setLon(p.lon);
  };

  return (
    <div className="card p-4 sm:p-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-5">
          <div>
            <label className="label" htmlFor="co-paste">Paste decimal coordinates (optional)</label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <input id="co-paste" className="input" value={paste} onChange={(e) => setPaste(e.target.value)} placeholder="40.7128, -74.0060" aria-describedby="co-paste-err" />
              <button type="button" className="btn btn-dark shrink-0" onClick={applyPaste}>Fill fields</button>
            </div>
            <p id="co-paste-err" role="alert" className="mt-1 text-sm text-accent-dark">{pasteErr}</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="co-lat">Latitude (-90 to 90)</label>
              <input id="co-lat" className="input" inputMode="decimal" value={lat} onChange={(e) => setLat(e.target.value)} aria-invalid={!!latErr} aria-describedby="co-lat-err" />
              <p id="co-lat-err" role="alert" className="mt-1 min-h-5 text-sm text-accent-dark">{latErr}</p>
            </div>
            <div>
              <label className="label" htmlFor="co-lon">Longitude (-180 to 180)</label>
              <input id="co-lon" className="input" inputMode="decimal" value={lon} onChange={(e) => setLon(e.target.value)} aria-invalid={!!lonErr} aria-describedby="co-lon-err" />
              <p id="co-lon-err" role="alert" className="mt-1 min-h-5 text-sm text-accent-dark">{lonErr}</p>
            </div>
          </div>
          <p className="text-xs text-muted">Positive latitude is north, negative is south. Positive longitude is east, negative is west. Nothing you type leaves your browser.</p>

          {out && (
            <ul className="space-y-2" aria-label="Formats">
              {FORMAT_LABELS.map(({ id, label }) => {
                const text = out[id].join("  ");
                return (
                  <li key={id} className={`flex flex-wrap items-center justify-between gap-2 rounded-xl border p-3 ${f === id ? "border-ink bg-bone" : "border-line"}`}>
                    <button type="button" className="min-h-11 flex-1 text-left" aria-pressed={f === id} onClick={() => setF(id)}>
                      <span className="block text-xs text-muted">{label}</span>
                      <span className="block break-words font-mono text-sm sm:text-base">{text}</span>
                    </button>
                    <CopyButton text={text} />
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Layout">
            <button type="button" className="chip" aria-pressed={layout === "stacked"} onClick={() => setLayout("stacked")}>Stacked</button>
            <button type="button" className="chip" aria-pressed={layout === "line"} onClick={() => setLayout("line")}>Single line</button>
          </div>
          <div>
            <span className="label">Lettering style</span>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Lettering style">
              {TATTOO_FONTS.map((x) => (
                <button key={x.id} type="button" className="chip" aria-pressed={fontId === x.id} onClick={() => setFontId(x.id)}>{x.label}</button>
              ))}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="co-size">Size ({size})</label>
              <input id="co-size" type="range" min={32} max={120} value={size} onChange={(e) => setSize(Number(e.target.value))} className="h-11 w-full" />
            </div>
            <div>
              <label className="label" htmlFor="co-dec">Decimal places ({decimals})</label>
              <input id="co-dec" type="range" min={2} max={6} value={decimals} onChange={(e) => setDecimals(Number(e.target.value))} className="h-11 w-full" />
            </div>
          </div>
          <label className="flex min-h-11 items-center gap-2 text-sm">
            <input type="checkbox" checked={transparent} onChange={(e) => setTransparent(e.target.checked)} className="h-5 w-5" />
            Transparent background
          </label>
          {out ? (
            <LetteringPreview
              lines={lines}
              font={font}
              size={size}
              spacing={font.defaultSpacing}
              align="center"
              lineHeight={1.25}
              color="#111111"
              background={transparent ? "transparent" : "#ffffff"}
              filename={`tattoo-coordinates-${f}`}
            />
          ) : (
            <div className="flex min-h-40 items-center justify-center rounded-xl border border-dashed border-line px-4 text-center text-sm text-muted">Fix the fields on the left to see your coordinates.</div>
          )}
        </div>
      </div>
    </div>
  );
}
