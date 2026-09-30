"use client";

import { useMemo, useState } from "react";
import type { ToolDef } from "@/lib/tools/types";
import { TATTOO_FONTS, getFont } from "@/lib/tattoo-fonts";
import { joinRomanDate, romanDate } from "@/lib/tools/roman";
import { LetteringPreview } from "./LetteringPreview";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const p2 = (n: number) => String(n).padStart(2, "0");

function formats(iso: string) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return [];
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  const dt = new Date(Date.UTC(y, mo - 1, d));
  if (y < 1 || dt.getUTCFullYear() !== y || dt.getUTCMonth() !== mo - 1 || dt.getUTCDate() !== d) return [];
  const month = MONTHS[mo - 1];
  const wd = DAYS[dt.getUTCDay()];
  const yy = p2(y % 100);
  const roman = romanDate(iso);
  const out: { group: string; label: string; value: string }[] = [
    { group: "Numeric", label: "US", value: `${p2(mo)}/${p2(d)}/${y}` },
    { group: "Numeric", label: "US short", value: `${mo}/${d}/${yy}` },
    { group: "Numeric", label: "US dotted", value: `${p2(mo)}.${p2(d)}.${y}` },
    { group: "Numeric", label: "ISO", value: `${y}-${p2(mo)}-${p2(d)}` },
    { group: "Numeric", label: "Day first", value: `${p2(d)}.${p2(mo)}.${y}` },
    { group: "Numeric", label: "Compact", value: `${p2(mo)}${p2(d)}${yy}` },
    { group: "Written", label: "Full", value: `${month} ${d}, ${y}` },
    { group: "Written", label: "Day first", value: `${d} ${month} ${y}` },
    { group: "Written", label: "Abbreviated", value: `${month.slice(0, 3)} ${d}, ${y}` },
    { group: "Written", label: "Uppercase", value: `${month.slice(0, 3).toUpperCase()} ${p2(d)} ${y}` },
    { group: "Weekday", label: "Weekday, full", value: `${wd}, ${month} ${d}, ${y}` },
    { group: "Weekday", label: "Weekday, short", value: `${wd.slice(0, 3).toUpperCase()} ${p2(mo)}.${p2(d)}.${yy}` },
    { group: "Year", label: "Year only", value: String(y) },
    { group: "Year", label: "Month and year", value: `${month} ${y}` },
  ];
  if (roman) {
    out.push(
      { group: "Roman", label: "Roman separated", value: joinRomanDate(roman, "·") },
      { group: "Roman", label: "Roman continuous", value: joinRomanDate(roman, "") },
      { group: "Roman", label: "Roman year", value: roman.year },
    );
  }
  return out.map((o, i) => ({ ...o, id: i }));
}

export default function DateTattooGenerator({ tool }: { tool: ToolDef }) {
  const [date, setDate] = useState("2025-06-05");
  const [pick, setPick] = useState(0);
  const [fontId, setFontId] = useState(tool.preset?.fontStyle ?? "traditional");
  const [size, setSize] = useState(80);
  const [spacing, setSpacing] = useState(4);
  const [transparent, setTransparent] = useState(false);

  const list = useMemo(() => formats(date), [date]);
  const chosen = list[Math.min(pick, list.length - 1)];
  const font = getFont(fontId);
  const groups = [...new Set(list.map((l) => l.group))];

  return (
    <div className="card p-4 sm:p-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-5">
          <div>
            <label className="label" htmlFor="dt-date">Date</label>
            <input id="dt-date" type="date" className="input" value={date} min="0001-01-01" onChange={(e) => { setDate(e.target.value); }} />
          </div>
          {list.length === 0 ? (
            <p role="alert" className="rounded-lg bg-accent-soft px-3 py-2 text-sm text-accent-dark">
              {date ? "That date is not valid. Try another." : "Pick a date to see your formats."}
            </p>
          ) : (
            <div className="space-y-4">
              {groups.map((g) => (
                <div key={g}>
                  <span className="label">{g}</span>
                  <div className="flex flex-wrap gap-2">
                    {list.filter((l) => l.group === g).map((l) => (
                      <button key={l.id} type="button" className="chip" aria-pressed={chosen?.id === l.id} onClick={() => setPick(l.id)} title={l.label}>
                        {l.value}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4">
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
              <label className="label" htmlFor="dt-size">Size ({size})</label>
              <input id="dt-size" type="range" min={40} max={140} value={size} onChange={(e) => setSize(Number(e.target.value))} className="h-11 w-full" />
            </div>
            <div>
              <label className="label" htmlFor="dt-sp">Letter spacing ({spacing})</label>
              <input id="dt-sp" type="range" min={0} max={20} value={spacing} onChange={(e) => setSpacing(Number(e.target.value))} className="h-11 w-full" />
            </div>
          </div>
          <label className="flex min-h-11 items-center gap-2 text-sm">
            <input type="checkbox" checked={transparent} onChange={(e) => setTransparent(e.target.checked)} className="h-5 w-5" />
            Transparent background
          </label>
          {chosen ? (
            <LetteringPreview
              lines={[chosen.value]}
              font={font}
              size={size}
              spacing={spacing}
              align="center"
              lineHeight={1.2}
              color="#111111"
              background={transparent ? "transparent" : "#ffffff"}
              filename={`tattoo-date-${chosen.value.replace(/[^A-Za-z0-9]+/g, "-")}`}
            />
          ) : (
            <div className="flex min-h-40 items-center justify-center rounded-xl border border-dashed border-line px-4 text-center text-sm text-muted">Your date preview appears here.</div>
          )}
        </div>
      </div>
    </div>
  );
}
