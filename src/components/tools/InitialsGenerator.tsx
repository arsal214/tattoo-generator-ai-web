"use client";

import { useState } from "react";
import type { ToolDef } from "@/lib/tools/types";
import { TATTOO_FONTS, getFont } from "@/lib/tattoo-fonts";
import { LetteringPreview } from "./LetteringPreview";

type Style = "stacked" | "interlocked" | "dotted" | "ampersand" | "row";

const STYLES: { id: Style; label: string; hint: string }[] = [
  { id: "dotted", label: "Dotted A.B.", hint: "Periods between letters" },
  { id: "ampersand", label: "Ampersand A & B", hint: "Pairs and couples" },
  { id: "interlocked", label: "Interlocked look", hint: "Letters overlap; ask your artist to weave them" },
  { id: "stacked", label: "Monogram stacked", hint: "One letter per line" },
  { id: "row", label: "Spaced row", hint: "Plain letters in a line" },
];

export default function InitialsGenerator({ tool }: { tool: ToolDef }) {
  const [raw, setRaw] = useState(tool.preset?.text ?? "AB");
  const [style, setStyle] = useState<Style>("dotted");
  const [fontId, setFontId] = useState(tool.preset?.fontStyle ?? "traditional");
  const [size, setSize] = useState(120);
  const [overlap, setOverlap] = useState(30);
  const [transparent, setTransparent] = useState(false);

  const letters = [...raw.toUpperCase().replace(/[^A-Z]/g, "")].slice(0, 4);
  const font = getFont(fontId);

  let lines: string[] = [];
  let spacing = font.defaultSpacing;
  if (letters.length) {
    if (style === "dotted") lines = [letters.map((l) => `${l}.`).join("")];
    else if (style === "ampersand") lines = [letters.join(" & ")];
    else if (style === "stacked") lines = letters;
    else if (style === "interlocked") {
      lines = [letters.join("")];
      spacing = -Math.round((size * overlap) / 100);
    } else {
      lines = [letters.join("")];
      spacing = Math.max(font.defaultSpacing, 12);
    }
  }

  const note = letters.length === 1 && style === "ampersand" ? "Add a second initial to see the ampersand pair." : "";

  return (
    <div className="card p-4 sm:p-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-5">
          <div>
            <label className="label" htmlFor="in-text">Initials (1 to 4 letters)</label>
            <input id="in-text" className="input uppercase" value={raw} maxLength={12} autoComplete="off" onChange={(e) => setRaw(e.target.value)} placeholder="AB" aria-describedby="in-help" />
            <p id="in-help" className="mt-1 text-xs text-muted">
              Letters A to Z only; anything else is ignored. {letters.length > 0 ? `Using: ${letters.join(" ")}` : ""}
            </p>
            {raw.replace(/[^A-Za-z]/g, "").length > 4 && <p role="alert" className="mt-1 text-sm text-accent-dark">Only the first four letters are used.</p>}
            {letters.length === 0 && <p role="alert" className="mt-1 text-sm text-accent-dark">Type at least one letter to see a preview.</p>}
            {note && <p className="mt-1 text-sm text-muted">{note}</p>}
          </div>

          <div>
            <span className="label">Arrangement</span>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Arrangement">
              {STYLES.map((s) => (
                <button key={s.id} type="button" className="chip" aria-pressed={style === s.id} onClick={() => setStyle(s.id)} title={s.hint}>{s.label}</button>
              ))}
            </div>
            <p className="mt-2 text-xs text-muted">{STYLES.find((s) => s.id === style)?.hint}</p>
          </div>

          <div>
            <span className="label">Lettering style</span>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Lettering style">
              {TATTOO_FONTS.map((f) => (
                <button key={f.id} type="button" className="chip" aria-pressed={fontId === f.id} onClick={() => setFontId(f.id)}>{f.label}</button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="in-size">Size ({size})</label>
              <input id="in-size" type="range" min={60} max={200} value={size} onChange={(e) => setSize(Number(e.target.value))} className="h-11 w-full" />
            </div>
            <div>
              <label className="label" htmlFor="in-ov">Overlap ({overlap}%)</label>
              <input id="in-ov" type="range" min={0} max={50} value={overlap} disabled={style !== "interlocked"} onChange={(e) => setOverlap(Number(e.target.value))} className="h-11 w-full disabled:opacity-40" />
            </div>
          </div>
          <label className="flex min-h-11 items-center gap-2 text-sm">
            <input type="checkbox" checked={transparent} onChange={(e) => setTransparent(e.target.checked)} className="h-5 w-5" />
            Transparent background
          </label>
        </div>

        <div>
          {letters.length ? (
            <LetteringPreview
              lines={lines}
              font={font}
              size={size}
              spacing={spacing}
              align="center"
              lineHeight={style === "stacked" ? 1 : 1.2}
              color="#111111"
              background={transparent ? "transparent" : "#ffffff"}
              filename={`tattoo-initials-${letters.join("")}-${style}`}
            />
          ) : (
            <div className="flex min-h-40 items-center justify-center rounded-xl border border-dashed border-line px-4 text-center text-sm text-muted">Your initials preview appears here.</div>
          )}
          <p className="mt-3 text-xs text-muted">Overlap here is only a preview effect. A true interlocked monogram is drawn by hand, so treat this as a reference for your artist.</p>
        </div>
      </div>
    </div>
  );
}
