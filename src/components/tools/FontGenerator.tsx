"use client";

import { useState } from "react";
import { AlignCenter, AlignLeft, AlignRight } from "lucide-react";
import { TATTOO_FONTS, getFont, type FontStyleId } from "@/lib/tattoo-fonts";
import type { ToolDef } from "@/lib/tools/types";
import { LetteringPreview } from "./LetteringPreview";

const ALIGN = [
  { v: "left", Icon: AlignLeft, label: "Align left" },
  { v: "center", Icon: AlignCenter, label: "Align center" },
  { v: "right", Icon: AlignRight, label: "Align right" },
] as const;

export default function FontGenerator({ tool }: { tool: ToolDef }) {
  const initialFont = getFont(tool.preset?.fontStyle);
  const [text, setText] = useState(tool.preset?.text ?? "Forever");
  const [fontId, setFontId] = useState<FontStyleId>(initialFont.id);
  const [size, setSize] = useState(96);
  const [spacing, setSpacing] = useState(initialFont.defaultSpacing);
  const [align, setAlign] = useState<"left" | "center" | "right">("center");
  const [lineHeight, setLineHeight] = useState(1.2);
  const [bg, setBg] = useState<"white" | "transparent">("white");
  const font = getFont(fontId);
  const lines = text.split("\n").slice(0, 6);

  const pickFont = (id: FontStyleId) => {
    setFontId(id);
    setSpacing(getFont(id).defaultSpacing); // each style has a sensible default spacing
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
      <div className="space-y-5">
        <div>
          <label htmlFor="font-text" className="label">
            Your text
          </label>
          <textarea
            id="font-text"
            className="input min-h-24 resize-y text-lg"
            value={text}
            maxLength={60}
            rows={2}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a name, word or short phrase"
          />
          <p className="mt-1 text-xs text-muted">Press Enter for a new line (up to 6 lines, 60 characters).</p>
        </div>

        <fieldset>
          <legend className="label">Tattoo font style</legend>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {TATTOO_FONTS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => pickFont(f.id)}
                aria-pressed={f.id === fontId}
                className={`min-h-[64px] rounded-xl border px-3 py-2 text-left transition ${f.id === fontId ? "border-ink bg-ink text-bone" : "border-line bg-white hover:border-ink"}`}
              >
                <span className="block truncate text-2xl leading-tight" style={{ fontFamily: f.family, fontWeight: f.weight }}>
                  {text.split("\n")[0].slice(0, 10) || "Aa"}
                </span>
                <span className="block text-[11px] font-medium opacity-70">{f.label}</span>
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-muted">{font.description}</p>
        </fieldset>

        <div className="grid gap-4 sm:grid-cols-2">
          <Slider id="font-size" label="Size" value={size} min={32} max={200} onChange={setSize} unit="px" />
          <Slider id="font-spacing" label="Letter spacing" value={spacing} min={-4} max={40} onChange={setSpacing} unit="px" />
          <Slider id="font-lh" label="Line height" value={lineHeight} min={0.8} max={2} step={0.05} onChange={setLineHeight} unit="×" />
          <div>
            <span className="label">Alignment</span>
            <div className="flex gap-2" role="group" aria-label="Text alignment">
              {ALIGN.map(({ v, Icon, label }) => (
                <button key={v} type="button" className="chip !min-h-11 !min-w-11 justify-center !px-0" aria-pressed={align === v} aria-label={label} onClick={() => setAlign(v)}>
                  <Icon size={18} aria-hidden />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <span className="label">Download background</span>
          <div className="flex gap-2" role="group" aria-label="Background">
            <button type="button" className="chip" aria-pressed={bg === "white"} onClick={() => setBg("white")}>
              White
            </button>
            <button type="button" className="chip" aria-pressed={bg === "transparent"} onClick={() => setBg("transparent")}>
              Transparent
            </button>
          </div>
        </div>
      </div>

      <div className="min-w-0 lg:sticky lg:top-24 lg:self-start">
        <LetteringPreview
          lines={lines.some((l) => l.trim()) ? lines : ["Your text"]}
          font={font}
          size={size}
          spacing={spacing}
          align={align}
          lineHeight={lineHeight}
          color="#0e0e11"
          background={bg === "white" ? "#ffffff" : "transparent"}
          filename={`tattoo-${font.id}-${(lines[0] || "lettering").toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 24)}`}
        />
        <p className="mt-3 text-xs text-muted">
          Preview only — a professional tattoo artist should redraw and size lettering for your skin. Check spelling twice, then once more.
        </p>
      </div>
    </div>
  );
}

function Slider({ id, label, value, min, max, step = 1, onChange, unit }: { id: string; label: string; value: number; min: number; max: number; step?: number; onChange: (n: number) => void; unit: string }) {
  return (
    <div>
      <label htmlFor={id} className="label flex justify-between">
        <span>{label}</span>
        <span className="font-normal text-muted">
          {value}
          {unit}
        </span>
      </label>
      <input id={id} type="range" className="h-11 w-full accent-[var(--color-accent)]" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} />
    </div>
  );
}
