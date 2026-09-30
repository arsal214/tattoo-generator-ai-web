"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Check, Copy, Sparkles } from "lucide-react";
import type { ToolDef } from "@/lib/tools/types";
import { PLACEMENTS, label } from "@/lib/config/generation";
import { TATTOO_FONTS, getFont, type TattooFont } from "@/lib/tattoo-fonts";
import { LetteringPreview } from "@/components/tools/LetteringPreview";

const SYMBOLS = [
  { value: "none", label: "None", glyph: "", word: "" },
  { value: "heart", label: "Heart", glyph: "♥", word: "small heart" },
  { value: "star", label: "Star", glyph: "★", word: "small star" },
  { value: "crown", label: "Crown", glyph: "♛", word: "small crown" },
  { value: "infinity", label: "Infinity", glyph: "∞", word: "infinity symbol" },
  { value: "moon", label: "Moon", glyph: "☾", word: "crescent moon" },
  { value: "cross", label: "Cross", glyph: "✝", word: "small cross" },
  { value: "anchor", label: "Anchor", glyph: "⚓︎", word: "small anchor" },
  { value: "feather", label: "Feather", glyph: "✒︎", word: "delicate feather" },
  { value: "laurel", label: "Laurel", glyph: "❧", word: "laurel leaf" },
] as const;

/** Approximate letter height in inches that stays readable per placement (general guidance, artists may differ). */
const LETTER_HEIGHT: Record<string, number> = {
  wrist: 0.4, hand: 0.4, neck: 0.5, ankle: 0.5, rib: 0.6, forearm: 0.6, "upper-arm": 0.7,
  shoulder: 0.7, calf: 0.7, chest: 0.8, leg: 0.8, thigh: 1, back: 1,
};
const NARROW = new Set(["rib", "forearm", "leg", "calf", "neck"]);
const CURVED = new Set(["wrist", "ankle", "neck", "chest", "upper-arm", "calf", "shoulder"]);
const BLACKLETTER = new Set(["gothic", "old-english", "blackletter"]);

const titleCase = (s: string) => s.toLowerCase().replace(/(^|[\s'-])(\p{L})/gu, (_m, a: string, b: string) => a + b.toUpperCase());

interface Concept {
  id: string;
  title: string;
  lines: string[];
  spacing: number;
  lineHeight: number;
  size: number;
  description: string;
}

function build(name: string, font: TattooFont, symbolValue: string, placement: string): Concept[] {
  const sym = SYMBOLS.find((s) => s.value === symbolValue) ?? SYMBOLS[0];
  const g = sym.glyph;
  const place = label(PLACEMENTS, placement).toLowerCase();
  const black = BLACKLETTER.has(font.id);
  const chars = [...name].length;
  const h = LETTER_HEIGHT[placement] ?? 0.6;
  const base = font.defaultSpacing * 3;
  const cased = titleCase(name);
  const lower = name.toLowerCase();
  const upper = name.toUpperCase();
  const dims = (text: string, factor: number, tall = 1) => {
    const w = Math.max(1, Math.round([...text].length * h * factor * 2) / 2);
    return `about ${w} in wide by ${(Math.round(h * tall * 10) / 10).toFixed(1)} in tall`;
  };
  const spacingNote = base >= 12 ? "Open, airy letter spacing works well here." : black ? "Keep letters tight; blackletter reads best when strokes nearly touch." : "Keep spacing even and slightly generous so the letters stay distinct.";
  const symWord = sym.word ? ` with a ${sym.word}` : "";
  const out: Concept[] = [];

  out.push({
    id: "classic",
    title: g ? "Name with symbol beside" : "Classic single line",
    lines: [g ? `${cased} ${g}` : cased],
    spacing: base, lineHeight: 1.15, size: 84,
    description: `${cased} in ${font.label} lettering${g ? `, ${sym.word} sitting just after the last letter` : ""}, set on one straight line on the ${place}. Suggested size: ${dims(cased, 0.55)}, letters roughly ${h} in tall. ${spacingNote}`,
  });

  out.push({
    id: "above",
    title: g ? "Symbol above, name below" : "Name in title case, centered",
    lines: g ? [g, cased] : [cased],
    spacing: base, lineHeight: 1.05, size: 84,
    description: g
      ? `A ${sym.word} centered above ${cased} in ${font.label} lettering on the ${place}, like a crest over a signature. Allow a symbol about ${Math.round(h * 1.3 * 10) / 10} in tall and ${dims(cased, 0.55)} for the name. Leave a gap about half a letter height between the two.`
      : `${cased} centered in ${font.label} lettering with a capital first letter, on the ${place}. Suggested size: ${dims(cased, 0.55)}. ${spacingNote}`,
  });

  out.push({
    id: "lower",
    title: black ? "Lowercase-leaning, tight" : "Lowercase, wide spacing",
    lines: [lower, ...(g ? [g] : [])],
    spacing: black ? font.defaultSpacing : Math.max(base, 10), lineHeight: 1.2, size: 84,
    description: `${lower} in all lowercase ${font.label} lettering${g ? `, ${sym.word} centered below` : ""} for a softer, quieter feel on the ${place}. ${black ? "Blackletter is more readable in lowercase or title case than in capitals." : "Wider tracking gives thin strokes room so each letter stays distinct."} Suggested size: ${dims(lower, 0.5)}.`,
  });

  out.push({
    id: "caps",
    title: black ? "Title case, framed" : "All caps, framed",
    lines: [g ? `${g}  ${black ? cased : upper}  ${g}` : black ? cased : upper],
    spacing: black ? font.defaultSpacing : Math.max(base, 8), lineHeight: 1.15, size: 84,
    description: `${black ? cased : upper} in ${font.label}${g ? `, with a matching ${sym.word} on each side` : ""}. ${black ? "Title case instead of capitals, since capital blackletter is hard to read. " : "Capitals feel bold and formal. "}Suggested size: ${dims(black ? cased : upper, 0.75)}, letters about ${h} in tall.`,
  });

  if (NARROW.has(placement) || chars <= 10) {
    const letters = [...(black ? cased : upper)].filter((c) => c.trim());
    out.push({
      id: "stacked",
      title: "Stacked letters, top to bottom",
      lines: g ? [...letters, g] : letters,
      spacing: 0, lineHeight: 0.95, size: 56,
      description: `${(black ? cased : upper)} with one letter on top of the next in ${font.label}${g ? `, ${sym.word} at the bottom` : ""}, a narrow column that suits the ${place}. It runs about ${(Math.round(letters.length * h * 1.1 * 10) / 10).toFixed(1)} in long and ${h.toFixed(1)} in wide. Ask your artist to check the vertical rhythm, since stacked names can read oddly if spacing is uneven.`,
    });
  }

  if (CURVED.has(placement)) {
    out.push({
      id: "curved",
      title: "Curved to follow the body",
      lines: [g ? `${cased} ${g}` : cased],
      spacing: Math.round(base * 0.6), lineHeight: 1.15, size: 84,
      description: `${cased}${symWord} arched to follow the natural curve of the ${place}, in ${font.label}. The preview is drawn flat, but your artist can bend the baseline on the stencil so the name wraps rather than sits on top. Suggested size: ${dims(cased, 0.6)} measured along the curve.`,
    });
  }
  return out.slice(0, 6);
}

export default function NameGenerator({ tool }: { tool: ToolDef }) {
  const [name, setName] = useState(tool.preset?.text ?? "Ava");
  const [fontId, setFontId] = useState(tool.preset?.fontStyle ?? "script");
  const [symbol, setSymbol] = useState("heart");
  const [placement, setPlacement] = useState(tool.preset?.placement ?? "forearm");
  const [copied, setCopied] = useState<string | null>(null);

  const clean = name.replace(/\s+/g, " ").trim().slice(0, 24);
  const font = getFont(fontId);
  const concepts = useMemo(() => (clean ? build(clean, font, symbol, placement) : []), [clean, font, symbol, placement]);

  const copy = async (c: Concept) => {
    try {
      await navigator.clipboard.writeText(`${c.title}: ${c.description}`);
      setCopied(c.id);
      setTimeout(() => setCopied((cur) => (cur === c.id ? null : cur)), 1800);
    } catch {
      setCopied(null);
    }
  };

  const aiHref = (c: Concept) => {
    const sym = SYMBOLS.find((s) => s.value === symbol);
    const prompt = `Name tattoo reading "${clean}" in ${font.label.toLowerCase()} lettering${sym?.word ? ` with a ${sym.word}` : ""}, layout: ${c.title.toLowerCase()}`;
    return `/dashboard/generate?prompt=${encodeURIComponent(prompt)}&placement=${encodeURIComponent(placement)}`;
  };

  return (
    <div className="space-y-6">
      <div className="card grid gap-4 p-4 sm:grid-cols-2 sm:p-6 lg:grid-cols-4">
        <div>
          <label className="label" htmlFor="ng-name">Name</label>
          <input id="ng-name" className="input" value={name} maxLength={24} autoComplete="off" onChange={(e) => setName(e.target.value)} placeholder="Type a name" />
        </div>
        <div>
          <label className="label" htmlFor="ng-font">Font style</label>
          <select id="ng-font" className="input" value={fontId} onChange={(e) => setFontId(e.target.value)}>
            {TATTOO_FONTS.map((f) => (
              <option key={f.id} value={f.id}>{f.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="ng-symbol">Symbol</label>
          <select id="ng-symbol" className="input" value={symbol} onChange={(e) => setSymbol(e.target.value)}>
            {SYMBOLS.map((s) => (
              <option key={s.value} value={s.value}>{s.glyph ? `${s.glyph} ` : ""}{s.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="ng-place">Placement</label>
          <select id="ng-place" className="input" value={placement} onChange={(e) => setPlacement(e.target.value)}>
            {PLACEMENTS.map((p) => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
        </div>
      </div>

      {!clean ? (
        <div className="card p-8 text-center text-muted">Type a name above and layout concepts will appear here.</div>
      ) : (
        <>
          <p className="text-sm text-muted">
            {concepts.length} layout concepts for <strong className="text-ink">{clean}</strong>. Symbols are shown as simple stand-ins; your artist will draw the real artwork. Sizes are general starting points, so confirm them with your artist.
          </p>
          <ul className="grid gap-5 md:grid-cols-2">
            {concepts.map((c) => (
              <li key={c.id} className="card flex flex-col p-4 sm:p-5">
                <h3 className="mb-3 text-lg">{c.title}</h3>
                <LetteringPreview
                  lines={c.lines}
                  font={font}
                  size={c.size}
                  spacing={c.spacing}
                  align="center"
                  lineHeight={c.lineHeight}
                  color="#111111"
                  background="#ffffff"
                  filename={`${clean.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "name"}-${c.id}`}
                />
                <p className="mt-3 flex-1 text-sm text-muted">{c.description}</p>
                <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                  <button type="button" className="btn btn-outline" onClick={() => copy(c)}>
                    {copied === c.id ? <Check size={15} aria-hidden /> : <Copy size={15} aria-hidden />}
                    {copied === c.id ? "Copied" : "Copy concept"}
                  </button>
                  <Link href={aiHref(c)} className="btn btn-primary">
                    <Sparkles size={15} aria-hidden /> Turn this into an AI design
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
