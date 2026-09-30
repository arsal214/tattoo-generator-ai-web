"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import type { ToolDef } from "@/lib/tools/types";
import { TATTOO_FONTS, getFont } from "@/lib/tattoo-fonts";
import { fromRoman, joinRomanDate, romanDate, toRoman, type RomanSeparator } from "@/lib/tools/roman";
import { LetteringPreview } from "./LetteringPreview";

const SEPARATORS: { sep: RomanSeparator; label: string }[] = [
  { sep: "·", label: "Classic · separated" },
  { sep: "", label: "Continuous" },
  { sep: ".", label: "Dotted" },
  { sep: "-", label: "Dashed" },
  { sep: "/", label: "Slashed" },
];

function CopyButton({ text }: { text: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      className="btn btn-outline btn-sm"
      aria-label={`Copy ${text}`}
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

export default function RomanNumeralGenerator({ tool }: { tool: ToolDef }) {
  const [mode, setMode] = useState<"date" | "number">("date");
  const [date, setDate] = useState("2025-06-12");
  const [num, setNum] = useState("2025");
  const [order, setOrder] = useState<"mdy" | "dmy">("mdy");
  const [pick, setPick] = useState(0);
  const [fontId, setFontId] = useState(tool.preset?.fontStyle ?? "traditional");
  const [transparent, setTransparent] = useState(false);
  const [size, setSize] = useState(96);

  const parts = mode === "date" ? romanDate(date) : null;
  const n = /^\d+$/.test(num.trim()) ? Number(num) : NaN;
  const numeral = mode === "number" ? toRoman(n) : null;
  const backConv = mode === "number" && !numeral && num.trim() ? fromRoman(num) : null;

  const rows: { label: string; value: string }[] =
    mode === "date"
      ? parts
        ? SEPARATORS.map((s) => ({ label: s.label, value: joinRomanDate(parts, s.sep, order) }))
        : []
      : numeral
        ? [{ label: "Roman numeral", value: numeral }]
        : backConv
          ? [{ label: `Roman numeral ${num.trim().toUpperCase()} equals`, value: String(backConv) }]
          : [];

  const error =
    mode === "date"
      ? parts
        ? ""
        : date
          ? "Roman numerals cover years 1 to 3999. Pick a valid date in that range."
          : "Pick a date to convert."
      : numeral || backConv
        ? ""
        : num.trim()
          ? "Enter a whole number from 1 to 3999 (Roman numerals have no zero and stop at MMMCMXCIX)."
          : "Enter a number from 1 to 3999.";

  const chosen = rows[Math.min(pick, rows.length - 1)];
  const previewText = mode === "number" && backConv ? "" : (chosen?.value ?? "");
  const font = getFont(fontId);

  return (
    <div className="card p-4 sm:p-6">
      <div className="mb-5 flex flex-wrap gap-2" role="group" aria-label="Conversion mode">
        <button type="button" className="chip" aria-pressed={mode === "date"} onClick={() => setMode("date")}>Date</button>
        <button type="button" className="chip" aria-pressed={mode === "number"} onClick={() => setMode("number")}>Number</button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-5">
          {mode === "date" ? (
            <>
              <div>
                <label className="label" htmlFor="rn-date">Date</label>
                <input id="rn-date" type="date" className="input" value={date} min="0001-01-01" max="3999-12-31" onChange={(e) => setDate(e.target.value)} />
              </div>
              <div>
                <span className="label">Date order</span>
                <div className="flex flex-wrap gap-2" role="group" aria-label="Date order">
                  <button type="button" className="chip" aria-pressed={order === "mdy"} onClick={() => setOrder("mdy")}>Month-Day-Year (US)</button>
                  <button type="button" className="chip" aria-pressed={order === "dmy"} onClick={() => setOrder("dmy")}>Day-Month-Year</button>
                </div>
              </div>
            </>
          ) : (
            <div>
              <label className="label" htmlFor="rn-num">Number (1 to 3999) or a Roman numeral</label>
              <input id="rn-num" className="input" inputMode="numeric" value={num} onChange={(e) => setNum(e.target.value)} placeholder="e.g. 1994" />
            </div>
          )}

          {error && (
            <p role="alert" className="rounded-lg bg-accent-soft px-3 py-2 text-sm text-accent-dark">{error}</p>
          )}

          {rows.length > 0 && (
            <ul className="space-y-2" aria-label="Results">
              {rows.map((r, i) => (
                <li key={r.label} className={`flex flex-wrap items-center justify-between gap-2 rounded-xl border p-3 ${i === pick ? "border-ink bg-bone" : "border-line"}`}>
                  <button type="button" className="min-h-11 flex-1 text-left" onClick={() => setPick(i)} aria-pressed={i === pick}>
                    <span className="block text-xs text-muted">{r.label}</span>
                    <span className="block break-all font-mono text-lg">{r.value}</span>
                  </button>
                  <CopyButton text={r.value} />
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <span className="label">Lettering style</span>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Lettering style">
              {TATTOO_FONTS.map((f) => (
                <button key={f.id} type="button" className="chip" aria-pressed={fontId === f.id} onClick={() => setFontId(f.id)}>
                  {f.label}
                </button>
              ))}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="rn-size">Size ({size})</label>
              <input id="rn-size" type="range" min={48} max={160} value={size} onChange={(e) => setSize(Number(e.target.value))} className="h-11 w-full" />
            </div>
            <label className="flex min-h-11 items-center gap-2 text-sm">
              <input type="checkbox" checked={transparent} onChange={(e) => setTransparent(e.target.checked)} className="h-5 w-5" />
              Transparent background
            </label>
          </div>
          {previewText ? (
            <LetteringPreview
              lines={[previewText]}
              font={font}
              size={size}
              spacing={mode === "date" ? Math.max(font.defaultSpacing, 4) : font.defaultSpacing}
              align="center"
              lineHeight={1.2}
              color="#111111"
              background={transparent ? "transparent" : "#ffffff"}
              filename={`roman-numeral-${previewText.replace(/[^A-Za-z0-9]+/g, "-")}`}
            />
          ) : (
            <div className="flex min-h-40 items-center justify-center rounded-xl border border-dashed border-line px-4 text-center text-sm text-muted">
              Your numeral preview appears here.
            </div>
          )}
        </div>
      </div>
      <p className="mt-4 text-xs text-muted">Check the numerals with your artist before the stencil is made; one wrong letter is hard to fix.</p>
    </div>
  );
}
