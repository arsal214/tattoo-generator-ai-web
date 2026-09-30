"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { ToolDef } from "@/lib/tools/types";
import { PLACEMENT_INFO, PLACEMENT_NOTE, anchorFor, getPlacement, type BodyView, type PlacementInfo } from "@/lib/tools/data/placements";
import { BodyFigure } from "./BodyFigure";

const ROWS: { key: keyof PlacementInfo; title: string }[] = [
  { key: "shapes", title: "Shapes that suit it" },
  { key: "styles", title: "Styles that work" },
  { key: "visibility", title: "Visibility and coverage" },
  { key: "movement", title: "Movement and stretch" },
  { key: "sun", title: "Sun exposure" },
  { key: "detail", title: "Detail and legibility" },
];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function PlacementGuide({ tool }: { tool: ToolDef }) {
  const [selected, setSelected] = useState("forearm");
  const [compare, setCompare] = useState("");
  const [view, setView] = useState<BodyView>("front");

  const select = (id: string) => {
    setSelected(id);
    if (compare === id) setCompare("");
    const p = getPlacement(id);
    if (p && !p.views.includes(view)) setView(p.views[0]);
  };

  // Deep link support: /tattoo-placement-guide?area=wrist
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("area");
    if (id && getPlacement(id)) select(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const main = getPlacement(selected)!;
  const other = compare ? getPlacement(compare) : undefined;
  const shown = [main, ...(other ? [other] : [])];

  return (
    <div className="card p-4 sm:p-6">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Choose a body area">
        {PLACEMENT_INFO.map((p) => (
          <button key={p.id} type="button" className="chip min-h-11" aria-pressed={selected === p.id} onClick={() => select(p.id)}>
            {p.label}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <div>
          <div className="mb-2 flex gap-2" role="group" aria-label="Body view">
            {(["front", "back"] as BodyView[]).map((v) => (
              <button key={v} type="button" className="chip min-h-11 capitalize" aria-pressed={view === v} onClick={() => setView(v)}>
                {v}
              </button>
            ))}
          </div>
          <div className="mx-auto max-w-[240px] rounded-2xl border border-line bg-white p-2 lg:max-w-none">
            <BodyFigure view={view} label={`Body outline, ${view} view. Select an area.`} className="mx-auto h-auto max-h-[520px] w-full">
              {PLACEMENT_INFO.filter((p) => p.views.includes(view)).map((p) => (
                <Regions key={p.id} p={p} active={p.id === selected || p.id === compare} onPick={select} />
              ))}
            </BodyFigure>
          </div>
          <p className="mt-2 text-center text-xs text-muted">Tap a region or use the chips. Outline is a simple guide, not to scale for every body.</p>
        </div>

        <div>
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <label htmlFor="pg-compare" className="text-[13px] font-semibold">Compare with</label>
            <select id="pg-compare" className="input max-w-56" value={compare} onChange={(e) => setCompare(e.target.value)}>
              <option value="">Nothing</option>
              {PLACEMENT_INFO.filter((p) => p.id !== selected).map((p) => (
                <option key={p.id} value={p.id}>{p.label}</option>
              ))}
            </select>
          </div>

          <div className={`grid gap-4 ${other ? "md:grid-cols-2" : ""}`}>
            {shown.map((p) => (
              <Panel key={p.id} p={p} />
            ))}
          </div>
          <p className="mt-4 text-xs text-muted">
            {PLACEMENT_NOTE} This is general information, not professional advice. Pain, healing and how a design ages vary by person, so ask a licensed tattoo artist about your situation.
          </p>
        </div>
      </div>
    </div>
  );
}

function Regions({ p, active, onPick }: { p: PlacementInfo; active: boolean; onPick: (id: string) => void }) {
  const sides = p.paired ? (["left", "right"] as const) : (["left"] as const);
  return (
    <>
      {sides.map((s) => {
        const a = anchorFor(p, s);
        const { hw, hh } = p.anchor;
        const common = { x: a.x - hw, y: a.y - hh, width: hw * 2, height: hh * 2, rx: Math.min(hw, hh) * 0.6, transform: `rotate(${a.rot} ${a.x} ${a.y})` };
        if (p.clickable === false) {
          return active ? <rect key={s} {...common} className="pointer-events-none fill-none stroke-accent" strokeWidth={1.5} strokeDasharray="4 3" /> : null;
        }
        return (
          <rect
            key={s}
            {...common}
            role="button"
            tabIndex={0}
            aria-label={p.label}
            aria-pressed={active}
            onClick={() => onPick(p.id)}
            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), onPick(p.id))}
            className={`cursor-pointer stroke-accent transition ${active ? "fill-accent/30" : "fill-transparent stroke-transparent hover:fill-accent/15 hover:stroke-accent/50"}`}
            strokeWidth={1.5}
          />
        );
      })}
    </>
  );
}

function Panel({ p }: { p: PlacementInfo }) {
  return (
    <article className="rounded-2xl border border-line bg-white p-4">
      <h3 className="text-xl font-semibold">{p.label}</h3>
      <p className="mt-1 text-[15px] text-ink/80">{p.summary}</p>
      <p className="mt-3 inline-block rounded-full bg-bone px-3 py-1 text-[13px] font-semibold">
        Typical design area: about {p.areaIn.w} x {p.areaIn.h} in ({Math.round(p.areaIn.w * 2.54)} x {Math.round(p.areaIn.h * 2.54)} cm)
      </p>
      <dl className="mt-4 space-y-3">
        {ROWS.map((r) => (
          <div key={r.key}>
            <dt className="text-xs font-semibold uppercase tracking-wide text-muted">{r.title}</dt>
            <dd className="text-[15px] leading-6 text-ink/90">{p[r.key] as string}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">Questions to ask your artist</p>
        <ul className="mt-1 list-disc space-y-1 pl-5 text-[15px]">
          {p.questions.map((q) => (
            <li key={q}>{q}</li>
          ))}
        </ul>
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        <Link href={`/tattoo-placement-visualizer?area=${p.id}`} className="btn btn-outline btn-sm min-h-11">
          Preview it
        </Link>
        <Link href={`/dashboard/generate?placement=${p.id}`} className="btn btn-primary btn-sm min-h-11">
          Design for this spot
        </Link>
      </div>
    </article>
  );
}
