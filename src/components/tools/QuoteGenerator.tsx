"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, Check, Copy, Heart, Shuffle } from "lucide-react";
import type { ToolDef } from "@/lib/tools/types";
import { TATTOO_FONTS, getFont } from "@/lib/tattoo-fonts";
import { LetteringPreview } from "@/components/tools/LetteringPreview";
import {
  QUOTES,
  QUOTE_LANGS,
  QUOTE_MOODS,
  QUOTE_THEMES,
  SOURCE_LABEL,
  lengthOf,
  type QuoteEntry,
  type QuoteLang,
  type QuoteLength,
  type QuoteMood,
  type QuoteTheme,
} from "@/lib/tools/data/quotes";

const PAGE = 6;
const FAV_KEY = "tg-quote-favs";
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** Small seeded PRNG so the first render is identical on server and client. */
function shuffled<T>(items: T[], seed: number): T[] {
  const a = [...items];
  let s = seed * 2654435761 >>> 0;
  const rnd = () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Break a phrase into short lines for the lettering preview. */
function wrap(text: string, max = 16): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    if (cur && (cur + " " + w).length > max) {
      lines.push(cur);
      cur = w;
    } else cur = cur ? cur + " " + w : w;
  }
  if (cur) lines.push(cur);
  return lines;
}

export default function QuoteGenerator({ tool }: { tool: ToolDef }) {
  const [theme, setTheme] = useState<QuoteTheme | "any">("any");
  const [mood, setMood] = useState<QuoteMood | "any">("any");
  const [length, setLength] = useState<QuoteLength | "any">("any");
  const [lang, setLang] = useState<QuoteLang>("en");
  const [seed, setSeed] = useState(1);
  const [fontId, setFontId] = useState(tool.preset?.fontStyle ?? "script");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [favs, setFavs] = useState<string[]>([]);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(FAV_KEY);
      if (raw) setFavs(JSON.parse(raw).filter((x: unknown) => typeof x === "string"));
    } catch {
      /* storage unavailable */
    }
  }, []);

  const toggleFav = (id: string) =>
    setFavs((cur) => {
      const next = cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id];
      try {
        localStorage.setItem(FAV_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });

  const matches = useMemo(
    () => QUOTES.filter((q) => (theme === "any" || q.theme === theme) && (mood === "any" || q.mood === mood) && (length === "any" || lengthOf(q) === length)),
    [theme, mood, length],
  );
  const order = useMemo(() => shuffled(matches, seed), [matches, seed]);
  const start = ((seed - 1) * PAGE) % Math.max(order.length, 1);
  const shown = useMemo(() => {
    const out: QuoteEntry[] = [];
    for (let i = 0; i < Math.min(PAGE, order.length); i++) out.push(order[(start + i) % order.length]);
    return out;
  }, [order, start]);

  const selected = QUOTES.find((q) => q.id === selectedId) ?? shown[0] ?? null;
  const font = getFont(fontId);
  const favQuotes = favs.map((id) => QUOTES.find((q) => q.id === id)).filter((q): q is QuoteEntry => !!q);

  const copy = async (q: QuoteEntry) => {
    try {
      await navigator.clipboard.writeText(q.text[lang]);
      setCopied(q.id);
      setTimeout(() => setCopied((c) => (c === q.id ? null : c)), 1800);
    } catch {
      setCopied(null);
    }
  };

  const reset = () => {
    setTheme("any");
    setMood("any");
    setLength("any");
  };

  const Select = ({ id, labelText, value, onChange, children }: { id: string; labelText: string; value: string; onChange: (v: string) => void; children: React.ReactNode }) => (
    <div>
      <label className="label" htmlFor={id}>{labelText}</label>
      <select id={id} className="input" value={value} onChange={(e) => { onChange(e.target.value); setSeed(1); }}>
        {children}
      </select>
    </div>
  );

  const card = (q: QuoteEntry) => (
    <li key={q.id} className={`card flex flex-col p-4 ${selected?.id === q.id ? "ring-2 ring-ink" : ""}`}>
      <p className="font-display text-xl leading-snug">{q.text[lang]}</p>
      {lang !== "en" && <p className="mt-1 text-sm text-muted">English: {q.text.en}</p>}
      <p className="mt-2 text-xs text-muted">
        {cap(q.theme)} · {cap(q.mood)} · {SOURCE_LABEL[q.source]}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" className="btn btn-dark" onClick={() => setSelectedId(q.id)} aria-pressed={selected?.id === q.id}>
          Preview
        </button>
        <button type="button" className="btn btn-outline" onClick={() => copy(q)}>
          {copied === q.id ? <Check size={16} aria-hidden /> : <Copy size={16} aria-hidden />}
          {copied === q.id ? "Copied" : "Copy"}
        </button>
        <button type="button" className="btn btn-ghost" onClick={() => toggleFav(q.id)} aria-pressed={favs.includes(q.id)} aria-label={favs.includes(q.id) ? "Remove from favorites" : "Save to favorites"}>
          <Heart size={16} aria-hidden fill={favs.includes(q.id) ? "currentColor" : "none"} />
          {favs.includes(q.id) ? "Saved" : "Save"}
        </button>
      </div>
    </li>
  );

  return (
    <div className="space-y-6">
      <div role="note" className="flex gap-3 rounded-xl border border-accent/40 bg-accent-soft p-4 text-sm">
        <AlertTriangle size={20} className="mt-0.5 shrink-0 text-accent-dark" aria-hidden />
        <p>
          <strong>Verify before you ink.</strong> Translations here are plain, literal renderings. Have a fluent speaker check spelling, accents, grammar and gender before anything is tattooed, and ask your artist to confirm the final wording.
        </p>
      </div>

      <div className="card grid gap-4 p-4 sm:grid-cols-2 sm:p-6 lg:grid-cols-4">
        <Select id="qg-theme" labelText="Theme" value={theme} onChange={(v) => setTheme(v as QuoteTheme | "any")}>
          <option value="any">Any theme</option>
          {QUOTE_THEMES.map((t) => <option key={t} value={t}>{cap(t)}</option>)}
        </Select>
        <Select id="qg-mood" labelText="Mood" value={mood} onChange={(v) => setMood(v as QuoteMood | "any")}>
          <option value="any">Any mood</option>
          {QUOTE_MOODS.map((m) => <option key={m} value={m}>{cap(m)}</option>)}
        </Select>
        <Select id="qg-length" labelText="Length" value={length} onChange={(v) => setLength(v as QuoteLength | "any")}>
          <option value="any">Any length</option>
          <option value="short">Short (4 words or fewer)</option>
          <option value="medium">Medium (5 to 7 words)</option>
          <option value="long">Long (8+ words)</option>
        </Select>
        <Select id="qg-lang" labelText="Language" value={lang} onChange={(v) => setLang(v as QuoteLang)}>
          {QUOTE_LANGS.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
        </Select>
      </div>

      {shown.length === 0 ? (
        <div className="card p-8 text-center">
          <p className="font-semibold">No phrases match all of those filters.</p>
          <p className="mt-1 text-sm text-muted">Try loosening one filter, such as setting Mood or Length back to "Any".</p>
          <button type="button" className="btn btn-outline mt-4" onClick={reset}>Clear filters</button>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted">
              Showing {shown.length} of {matches.length} matching {matches.length === 1 ? "phrase" : "phrases"}.
            </p>
            {matches.length > PAGE && (
              <button type="button" className="btn btn-primary" onClick={() => setSeed((s) => s + 1)}>
                <Shuffle size={16} aria-hidden /> Show more ideas
              </button>
            )}
          </div>
          <ul className="grid gap-4 md:grid-cols-2">{shown.map(card)}</ul>
        </>
      )}

      {selected && (
        <section className="card p-4 sm:p-6" aria-label="Lettering preview">
          <div className="mb-4 grid gap-4 sm:grid-cols-[1fr_16rem] sm:items-end">
            <div>
              <h2 className="text-xl">Preview in lettering</h2>
              <p className="text-sm text-muted">{selected.text[lang]}</p>
            </div>
            <div>
              <label className="label" htmlFor="qg-font">Preview font</label>
              <select id="qg-font" className="input" value={fontId} onChange={(e) => setFontId(e.target.value)}>
                {TATTOO_FONTS.map((f) => <option key={f.id} value={f.id}>{f.label}</option>)}
              </select>
            </div>
          </div>
          <LetteringPreview
            lines={wrap(selected.text[lang])}
            font={font}
            size={64}
            spacing={font.defaultSpacing * 2}
            align="center"
            lineHeight={1.25}
            color="#111111"
            background="#ffffff"
            filename={`tattoo-quote-${selected.id}`}
          />
          <p className="mt-3 text-xs text-muted">Accents and special characters may look different in a finished tattoo. Ask your artist to test them at your chosen size.</p>
        </section>
      )}

      {favQuotes.length > 0 && (
        <section aria-label="Saved phrases">
          <h2 className="mb-3 text-xl">Your saved phrases</h2>
          <ul className="grid gap-4 md:grid-cols-2">{favQuotes.map(card)}</ul>
        </section>
      )}
    </div>
  );
}
