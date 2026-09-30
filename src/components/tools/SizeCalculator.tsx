"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { ToolDef } from "@/lib/tools/types";
import { PLACEMENT_INFO, PLACEMENT_NOTE } from "@/lib/tools/data/placements";
import {
  DETAIL_LEVELS,
  SIZE_CATEGORIES,
  SQ_CM_PER_SQ_IN,
  aspectRatio,
  convert,
  detailCheck,
  fitPlacements,
  fromInches,
  round,
  sizeCategory,
  toInches,
  UNITS,
  type DetailLevel,
  type Unit,
} from "@/lib/tools/size";

const CARD = { w: 3.37, h: 2.13 };
const HAND = 8;
const REFS = [
  { id: "card", label: "Credit card" },
  { id: "hand", label: "Hand span" },
  { id: "none", label: "No reference" },
] as const;

const parse = (s: string) => {
  const n = Number(s.replace(",", "."));
  return s.trim() !== "" && Number.isFinite(n) ? n : NaN;
};
const fmt = (n: number, d = 2) => String(round(n, d));

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function SizeCalculator({ tool }: { tool: ToolDef }) {
  const [unit, setUnit] = useState<Unit>("in");
  const [w, setW] = useState("3");
  const [h, setH] = useState("4");
  const [detail, setDetail] = useState<DetailLevel>("moderate");
  const [ref, setRef] = useState<(typeof REFS)[number]["id"]>("card");

  const wv = parse(w);
  const hv = parse(h);
  const max = fromInches(60, unit);
  const valid = wv > 0 && hv > 0 && wv <= max && hv <= max;
  const error = valid
    ? ""
    : `Enter a width and height greater than 0 and up to ${fmt(max, 0)} ${unit}.`;

  const changeUnit = (u: Unit) => {
    if (u === unit) return;
    const d = u === "in" ? 2 : u === "cm" ? 1 : 0;
    if (wv > 0) setW(fmt(convert(wv, unit, u), d));
    if (hv > 0) setH(fmt(convert(hv, unit, u), d));
    setUnit(u);
  };

  const scale = (f: number) => {
    const d = unit === "in" ? 2 : unit === "cm" ? 1 : 0;
    if (wv > 0) setW(fmt(wv * f, d));
    if (hv > 0) setH(fmt(hv * f, d));
  };

  const r = useMemo(() => {
    if (!valid) return null;
    const wi = toInches(wv, unit);
    const hi = toInches(hv, unit);
    const areaSqIn = wi * hi;
    return {
      wi,
      hi,
      areaSqIn,
      areaSqCm: areaSqIn * SQ_CM_PER_SQ_IN,
      aspect: aspectRatio(wi, hi),
      cat: sizeCategory(wi, hi),
      det: detailCheck(Math.max(wi, hi), detail),
      fits: fitPlacements(wi, hi, PLACEMENT_INFO),
    };
  }, [valid, wv, hv, unit, detail]);

  const fitting = r?.fits.filter((f) => f.fits) ?? [];
  const notFitting = r?.fits.filter((f) => !f.fits) ?? [];

  return (
    <div className="card p-4 sm:p-6">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        {/* Inputs */}
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label" htmlFor="sc-w">Width ({unit})</label>
              <input id="sc-w" className="input" inputMode="decimal" value={w} onChange={(e) => setW(e.target.value)} aria-invalid={!valid} />
            </div>
            <div>
              <label className="label" htmlFor="sc-h">Height ({unit})</label>
              <input id="sc-h" className="input" inputMode="decimal" value={h} onChange={(e) => setH(e.target.value)} aria-invalid={!valid} />
            </div>
          </div>

          <div>
            <span className="label" id="sc-unit">Unit</span>
            <div className="flex flex-wrap gap-2" role="group" aria-labelledby="sc-unit">
              {UNITS.map((u) => (
                <button key={u.id} type="button" className="chip min-h-11" aria-pressed={unit === u.id} onClick={() => changeUnit(u.id)}>
                  {u.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="label" id="sc-scale">Quick scale</span>
            <div className="flex flex-wrap gap-2" role="group" aria-labelledby="sc-scale">
              {[
                ["Half size", 0.5],
                ["-25%", 0.75],
                ["+25%", 1.25],
                ["Double", 2],
              ].map(([label, f]) => (
                <button key={label} type="button" className="btn btn-outline btn-sm min-h-11" onClick={() => scale(f as number)} disabled={!valid}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="label" htmlFor="sc-detail">How detailed is the design?</label>
            <select id="sc-detail" className="input" value={detail} onChange={(e) => setDetail(e.target.value as DetailLevel)}>
              {DETAIL_LEVELS.map((d) => (
                <option key={d.id} value={d.id}>{d.label}</option>
              ))}
            </select>
          </div>

          {error && (
            <p role="alert" className="rounded-xl bg-accent-soft px-3 py-2 text-sm text-accent-dark">
              {error}
            </p>
          )}
        </div>

        {/* Preview */}
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="text-[13px] font-semibold">To-scale preview</span>
            <div className="flex flex-wrap gap-1.5" role="group" aria-label="Reference object">
              {REFS.map((x) => (
                <button key={x.id} type="button" className="chip" aria-pressed={ref === x.id} onClick={() => setRef(x.id)}>
                  {x.label}
                </button>
              ))}
            </div>
          </div>
          <ScalePreview wi={r?.wi} hi={r?.hi} refId={ref} />
        </div>
      </div>

      {r && (
        <div className="mt-6 space-y-6 border-t border-line pt-6">
          <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat label="Inches" value={`${fmt(r.wi)} x ${fmt(r.hi)} in`} />
            <Stat label="Centimeters" value={`${fmt(r.wi * 2.54, 1)} x ${fmt(r.hi * 2.54, 1)} cm`} />
            <Stat label="Area" value={`${fmt(r.areaSqIn, 1)} sq in`} sub={`${fmt(r.areaSqCm, 1)} sq cm`} />
            <Stat label="Aspect ratio" value={r.aspect.label} sub="width : height" />
          </dl>

          <div className="rounded-2xl bg-bone p-4">
            <p className="text-sm text-muted">Suggested size category</p>
            <p className="font-display text-2xl font-semibold">{r.cat.label}</p>
            <p className="mt-1 text-[15px] text-ink/80">{r.cat.blurb}</p>
            <p
              className={`mt-3 rounded-xl px-3 py-2 text-sm ${r.det.enough ? "bg-white text-ink/80" : "bg-accent-soft text-accent-dark"}`}
            >
              {r.det.enough
                ? `For this level of detail, the longest side is at or above the rough ${r.det.minIn} in guideline. Your artist has the final say on what stays legible.`
                : `Finer detail generally needs more room. Many designs at this detail level are planned at about ${r.det.minIn} in or more on the longest side. Consider simplifying or scaling up, and check with your artist.`}
            </p>
          </div>

          <div>
            <h3 className="mb-2 text-lg font-semibold">Where this size fits</h3>
            <p className="mb-3 text-sm text-muted">{PLACEMENT_NOTE}</p>
            {fitting.length > 0 ? (
              <ul className="flex flex-wrap gap-2">
                {fitting.map((f) => (
                  <li key={f.placement.id}>
                    <Link
                      href={`/tattoo-placement-guide?area=${f.placement.id}`}
                      className="chip border-good/40 bg-white"
                      title={`Typical area about ${f.placement.areaIn.w} x ${f.placement.areaIn.h} in`}
                    >
                      {f.placement.label} <span className="ml-1.5 text-muted">{Math.round(f.ratio * 100)}% of area</span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted">This is larger than the typical design area for every listed placement. Big pieces are usually planned across several zones with an artist.</p>
            )}
            {notFitting.length > 0 && fitting.length > 0 && (
              <p className="mt-3 text-sm text-muted">
                Larger than the typical area for: {notFitting.map((f) => f.placement.label).join(", ")}.
              </p>
            )}
            <Link href="/tattoo-placement-visualizer" className="btn btn-outline btn-sm mt-4">
              See it on a body outline
            </Link>
          </div>

          <details className="rounded-2xl border border-line p-4 text-sm">
            <summary className="cursor-pointer font-semibold">How the size categories are defined</summary>
            <p className="mt-2 text-muted">
              Categories use the longest side of the design. They are rules of thumb for planning, not an industry standard, and artists may describe sizes differently.
            </p>
            <ul className="mt-2 space-y-1">
              {SIZE_CATEGORIES.map((c) => (
                <li key={c.id}>
                  <strong>{c.label}:</strong>{" "}
                  {c.maxIn === Infinity ? `${c.minIn} in and up` : c.minIn === 0 ? `under ${c.maxIn} in` : `${c.minIn} to under ${c.maxIn} in`}
                </li>
              ))}
            </ul>
            <p className="mt-2 text-muted">
              Detail guidance: simple designs are usually comfortable from about {DETAIL_LEVELS[0].minIn} in, moderate detail from about {DETAIL_LEVELS[1].minIn} in, and fine detail from about {DETAIL_LEVELS[2].minIn} in on the longest side.
            </p>
          </details>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-xl border border-line p-3">
      <dt className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</dt>
      <dd className="mt-1 text-[15px] font-semibold">{value}</dd>
      {sub && <dd className="text-xs text-muted">{sub}</dd>}
    </div>
  );
}

function ScalePreview({ wi, hi, refId }: { wi?: number; hi?: number; refId: "card" | "hand" | "none" }) {
  if (!wi || !hi) {
    return <div className="flex h-56 items-center justify-center rounded-xl border border-dashed border-line text-sm text-muted">Enter a size to see it to scale.</div>;
  }
  const ref = refId === "card" ? { w: CARD.w, h: CARD.h } : refId === "hand" ? { w: HAND, h: 0.6 } : { w: 0, h: 0 };
  const gap = ref.w ? Math.max(wi, ref.w) * 0.12 + 0.3 : 0;
  const totalW = wi + gap + ref.w + 0.6;
  const totalH = Math.max(hi, ref.h) + 1.2;
  const baseY = totalH - 0.6;
  const fontSize = Math.max(totalW, totalH) * 0.035;
  const px = 0.3;
  const refX = px + wi + gap;

  return (
    <div className="rounded-xl border border-line bg-white p-2">
      <svg
        viewBox={`0 0 ${totalW} ${totalH}`}
        className="mx-auto h-auto max-h-[340px] w-full"
        role="img"
        aria-label={`Design ${fmt(wi)} by ${fmt(hi)} inches drawn to scale${refId === "none" ? "" : ` next to a ${refId === "card" ? "credit card" : "hand span"}`}`}
      >
        <rect x={px} y={baseY - hi} width={wi} height={hi} rx={Math.min(wi, hi) * 0.04} className="fill-accent-soft stroke-accent" strokeWidth={fontSize * 0.15} />
        <text x={px + wi / 2} y={baseY - hi / 2} textAnchor="middle" dominantBaseline="middle" fontSize={fontSize} className="fill-accent-dark">
          {fmt(wi)} x {fmt(hi)} in
        </text>
        {refId === "card" && (
          <g>
            <rect x={refX} y={baseY - ref.h} width={ref.w} height={ref.h} rx={0.18} className="fill-bone stroke-ink/40" strokeWidth={fontSize * 0.15} />
            <text x={refX + ref.w / 2} y={baseY - ref.h / 2} textAnchor="middle" dominantBaseline="middle" fontSize={fontSize} className="fill-muted">
              Credit card
            </text>
          </g>
        )}
        {refId === "hand" && (
          <g className="stroke-ink/50" strokeWidth={fontSize * 0.15}>
            <line x1={refX} x2={refX + ref.w} y1={baseY - 0.3} y2={baseY - 0.3} />
            <line x1={refX} x2={refX} y1={baseY - 0.6} y2={baseY} />
            <line x1={refX + ref.w} x2={refX + ref.w} y1={baseY - 0.6} y2={baseY} />
            <text x={refX + ref.w / 2} y={baseY - 0.55} textAnchor="middle" fontSize={fontSize} className="fill-muted stroke-none">
              Adult hand span (about {HAND} in)
            </text>
          </g>
        )}
      </svg>
      <p className="px-2 pb-1 text-xs text-muted">
        Drawn in proportion using inches; on-screen size depends on your display. A credit card is 3.37 x 2.13 in, and an adult hand span is roughly 8 in, though hands vary.
      </p>
    </div>
  );
}
