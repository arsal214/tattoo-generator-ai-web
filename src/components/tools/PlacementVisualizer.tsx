"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import type { ToolDef } from "@/lib/tools/types";
import { PLACEMENT_INFO, PLACEMENT_NOTE, anchorFor, getPlacement, type BodyView } from "@/lib/tools/data/placements";
import { convert, fromInches, round, toInches, type Unit } from "@/lib/tools/size";
import { BodyFigure, FIGURE_H, FIGURE_W } from "./BodyFigure";

const UNITS2: { id: Unit; label: string }[] = [
  { id: "in", label: "in" },
  { id: "cm", label: "cm" },
];
const MAX_IMG = 10 * 1024 * 1024;
const num = (s: string) => {
  const n = Number(s.replace(",", "."));
  return s.trim() !== "" && Number.isFinite(n) ? n : NaN;
};
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const f = (n: number, d = 1) => String(round(n, d));

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function PlacementVisualizer({ tool }: { tool: ToolDef }) {
  const uid = useId().replace(/:/g, "");
  const [view, setView] = useState<BodyView>("front");
  const [pid, setPid] = useState("forearm");
  const [side, setSide] = useState<"left" | "right">("left");
  const [hUnit, setHUnit] = useState<Unit>("in");
  const [height, setHeight] = useState("68");
  const [tUnit, setTUnit] = useState<Unit>("in");
  const [tw, setTw] = useState("2");
  const [th, setTh] = useState("4");
  const [shape, setShape] = useState<"rect" | "ellipse">("ellipse");
  const [zoom, setZoom] = useState(true);
  const [off, setOff] = useState({ x: 0, y: 0 });
  const [img, setImg] = useState<string | null>(null);
  const [imgErr, setImgErr] = useState("");
  const svgRef = useRef<SVGSVGElement>(null);
  const drag = useRef<{ sx: number; sy: number; ox: number; oy: number } | null>(null);

  const p = getPlacement(pid)!;

  const choose = (id: string) => {
    const np = getPlacement(id)!;
    setPid(id);
    setOff({ x: 0, y: 0 });
    if (!np.views.includes(view)) setView(np.views[0]);
  };

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("area");
    if (id && getPlacement(id)) choose(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => () => { if (img) URL.revokeObjectURL(img); }, [img]);

  const heightIn = toInches(num(height), hUnit);
  const heightOk = heightIn >= 48 && heightIn <= 96;
  const wIn = toInches(num(tw), tUnit);
  const hIn = toInches(num(th), tUnit);
  const sizeOk = wIn > 0 && hIn > 0 && wIn <= 40 && hIn <= 40;

  const g = useMemo(() => {
    const u = FIGURE_H / (heightOk ? heightIn : 68);
    const a = anchorFor(p, side);
    const areaW = p.areaIn.w * u;
    const areaH = p.areaIn.h * u;
    const pw = sizeOk ? wIn * u : 0;
    const ph = sizeOk ? hIn * u : 0;
    let vb = `0 0 ${FIGURE_W} ${FIGURE_H}`;
    if (zoom) {
      const Z = clamp(Math.max(areaW * 2.6, (areaH * 2.6) / 2.5, pw * 1.6, (ph * 1.6) / 2.5), 50, FIGURE_W);
      const H = Z * 2.5;
      vb = `${clamp(a.x - Z / 2, 0, FIGURE_W - Z)} ${clamp(a.y - H / 2, 0, FIGURE_H - H)} ${Z} ${H}`;
    }
    return { u, a, areaW, areaH, pw, ph, vb };
  }, [p, side, heightOk, heightIn, sizeOk, wIn, hIn, zoom]);

  const toSvg = (cx: number, cy: number) => {
    const svg = svgRef.current;
    const m = svg?.getScreenCTM();
    if (!svg || !m) return { x: 0, y: 0 };
    const pt = svg.createSVGPoint();
    pt.x = cx;
    pt.y = cy;
    const r = pt.matrixTransform(m.inverse());
    return { x: r.x, y: r.y };
  };

  const onDown = (e: React.PointerEvent) => {
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
    const s = toSvg(e.clientX, e.clientY);
    drag.current = { sx: s.x, sy: s.y, ox: off.x, oy: off.y };
  };
  const onMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    const s = toSvg(e.clientX, e.clientY);
    setOff({ x: clamp(d.ox + s.x - d.sx, -100, 100), y: clamp(d.oy + s.y - d.sy, -250, 250) });
  };
  const onKey = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 5 : 1;
    const d: Record<string, [number, number]> = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] };
    const v = d[e.key];
    if (!v) return;
    e.preventDefault();
    setOff((o) => ({ x: clamp(o.x + v[0], -100, 100), y: clamp(o.y + v[1], -250, 250) }));
  };

  const onFile = (file?: File) => {
    setImgErr("");
    if (!file) return;
    if (!/^image\/(png|jpe?g|webp|gif)$/.test(file.type)) return setImgErr("Please choose a PNG, JPG, WebP or GIF image.");
    if (file.size > MAX_IMG) return setImgErr("That image is over 10 MB. Try a smaller file.");
    setImg(URL.createObjectURL(file));
  };

  const switchTUnit = (u: Unit) => {
    if (u === tUnit) return;
    const d = u === "in" ? 2 : 1;
    if (wIn > 0) setTw(f(fromInches(wIn, u), d));
    if (hIn > 0) setTh(f(fromInches(hIn, u), d));
    setTUnit(u);
  };
  const switchHUnit = (u: Unit) => {
    if (u === hUnit) return;
    const n = num(height);
    if (n > 0) setHeight(f(convert(n, hUnit, u), u === "in" ? 1 : 0));
    setHUnit(u);
  };

  const wPct = sizeOk ? Math.round((wIn / p.areaIn.w) * 100) : 0;
  const hPct = sizeOk ? Math.round((hIn / p.areaIn.h) * 100) : 0;
  const bigger = sizeOk && (wIn > p.areaIn.w || hIn > p.areaIn.h);
  const clipId = `clip-${uid}`;
  const strokeProps = { vectorEffect: "non-scaling-stroke" as const, strokeWidth: 2 };

  return (
    <div className="card p-4 sm:p-6">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        {/* Figure */}
        <div>
          <div className="mx-auto max-w-[300px] overflow-hidden rounded-2xl border border-line bg-white">
            <div className="aspect-[2/5] w-full">
              <BodyFigure
                view={view}
                viewBox={g.vb}
                svgRef={svgRef}
                label={`Body outline, ${view} view, with a ${f(wIn)} by ${f(hIn)} inch design on the ${p.label.toLowerCase()}`}
                className="h-full w-full"
              >
                <g transform={`translate(${g.a.x} ${g.a.y}) rotate(${g.a.rot})`}>
                  <rect x={-g.areaW / 2} y={-g.areaH / 2} width={g.areaW} height={g.areaH} rx={2} className="fill-none stroke-muted/60" strokeDasharray="4 3" {...strokeProps} strokeWidth={1} />
                </g>
                {sizeOk && (
                  <g transform={`translate(${g.a.x + off.x} ${g.a.y + off.y}) rotate(${g.a.rot})`}>
                    <defs>
                      <clipPath id={clipId}>
                        {shape === "rect" ? (
                          <rect x={-g.pw / 2} y={-g.ph / 2} width={g.pw} height={g.ph} />
                        ) : (
                          <ellipse cx={0} cy={0} rx={g.pw / 2} ry={g.ph / 2} />
                        )}
                      </clipPath>
                    </defs>
                    {img && <image href={img} x={-g.pw / 2} y={-g.ph / 2} width={g.pw} height={g.ph} preserveAspectRatio="xMidYMid meet" clipPath={`url(#${clipId})`} />}
                    {(() => {
                      const cls = `${img ? "fill-transparent" : "fill-accent/25"} stroke-accent cursor-grab active:cursor-grabbing`;
                      const handlers = {
                        tabIndex: 0,
                        role: "application" as const,
                        "aria-label": "Design outline. Drag, or use arrow keys, to nudge.",
                        onPointerDown: onDown,
                        onPointerMove: onMove,
                        onPointerUp: () => (drag.current = null),
                        onPointerCancel: () => (drag.current = null),
                        onKeyDown: onKey,
                        style: { touchAction: "none" as const },
                        className: cls,
                        ...strokeProps,
                      };
                      return shape === "rect" ? (
                        <rect x={-g.pw / 2} y={-g.ph / 2} width={g.pw} height={g.ph} {...handlers} />
                      ) : (
                        <ellipse cx={0} cy={0} rx={g.pw / 2} ry={g.ph / 2} {...handlers} />
                      );
                    })()}
                  </g>
                )}
              </BodyFigure>
            </div>
          </div>
          <p className="mt-2 text-center text-xs text-muted">Dashed box = typical design area. Drag the outline (or use arrow keys) to nudge it.</p>
        </div>

        {/* Controls */}
        <div className="space-y-5">
          <div>
            <label className="label" htmlFor="pv-height">Your height</label>
            <div className="flex gap-2">
              <input id="pv-height" className="input" inputMode="decimal" value={height} onChange={(e) => setHeight(e.target.value)} aria-invalid={!heightOk} />
              <div className="flex gap-1.5" role="group" aria-label="Height unit">
                {UNITS2.map((u) => (
                  <button key={u.id} type="button" className="chip min-h-11" aria-pressed={hUnit === u.id} onClick={() => switchHUnit(u.id)}>
                    {u.label}
                  </button>
                ))}
              </div>
            </div>
            {!heightOk && <p role="alert" className="mt-1 text-sm text-accent-dark">Enter a height between 48 and 96 in (122 to 244 cm). Using 68 in until then.</p>}
          </div>

          <div>
            <label className="label" htmlFor="pv-area">Placement</label>
            <select id="pv-area" className="input" value={pid} onChange={(e) => choose(e.target.value)}>
              {PLACEMENT_INFO.map((x) => (
                <option key={x.id} value={x.id}>{x.label}</option>
              ))}
            </select>
            <div className="mt-2 flex flex-wrap gap-2">
              <div className="flex gap-1.5" role="group" aria-label="Body view">
                {(["front", "back"] as BodyView[]).map((v) => (
                  <button key={v} type="button" className="chip min-h-11 capitalize" aria-pressed={view === v} disabled={!p.views.includes(v)} onClick={() => setView(v)}>
                    {v}
                  </button>
                ))}
              </div>
              {p.paired && (
                <div className="flex gap-1.5" role="group" aria-label="Side of figure">
                  {(["left", "right"] as const).map((s) => (
                    <button key={s} type="button" className="chip min-h-11 capitalize" aria-pressed={side === s} onClick={() => { setSide(s); setOff({ x: 0, y: 0 }); }}>
                      {s} side
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
            <span className="label" id="pv-size">Tattoo size (width x height)</span>
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2" role="group" aria-labelledby="pv-size">
              <input className="input" aria-label="Tattoo width" inputMode="decimal" value={tw} onChange={(e) => setTw(e.target.value)} aria-invalid={!sizeOk} />
              <span aria-hidden>x</span>
              <input className="input" aria-label="Tattoo height" inputMode="decimal" value={th} onChange={(e) => setTh(e.target.value)} aria-invalid={!sizeOk} />
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {UNITS2.map((u) => (
                <button key={u.id} type="button" className="chip min-h-11" aria-pressed={tUnit === u.id} onClick={() => switchTUnit(u.id)}>
                  {u.label}
                </button>
              ))}
              <button
                type="button"
                className="chip min-h-11"
                onClick={() => {
                  const d = tUnit === "in" ? 2 : 1;
                  setTw(f(fromInches(p.areaIn.w * 0.8, tUnit), d));
                  setTh(f(fromInches(p.areaIn.h * 0.8, tUnit), d));
                  setOff({ x: 0, y: 0 });
                }}
              >
                Try typical size
              </button>
            </div>
            {!sizeOk && <p role="alert" className="mt-1 text-sm text-accent-dark">Enter a width and height greater than 0 (up to 40 in).</p>}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex gap-1.5" role="group" aria-label="Shape">
              {(["ellipse", "rect"] as const).map((s) => (
                <button key={s} type="button" className="chip min-h-11" aria-pressed={shape === s} onClick={() => setShape(s)}>
                  {s === "ellipse" ? "Oval" : "Rectangle"}
                </button>
              ))}
            </div>
            <button type="button" className="chip min-h-11" aria-pressed={zoom} onClick={() => setZoom((z) => !z)}>
              Zoom to area
            </button>
            <button type="button" className="chip min-h-11" onClick={() => setOff({ x: 0, y: 0 })}>
              Re-center
            </button>
          </div>

          <div>
            <label className="label" htmlFor="pv-img">Optional: add your design image</label>
            <input id="pv-img" type="file" accept="image/png,image/jpeg,image/webp,image/gif" className="input py-2" onChange={(e) => onFile(e.target.files?.[0])} />
            <p className="mt-1 text-xs text-muted">Stays in your browser. Nothing is uploaded. PNG, JPG, WebP or GIF up to 10 MB.</p>
            {imgErr && <p role="alert" className="mt-1 text-sm text-accent-dark">{imgErr}</p>}
            {img && (
              <button type="button" className="btn btn-ghost btn-sm mt-1" onClick={() => setImg(null)}>
                Remove image
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl bg-bone p-4 text-[15px]">
        {sizeOk ? (
          <>
            <p>
              <strong>{f(wIn)} x {f(hIn)} in</strong> ({f(wIn * 2.54)} x {f(hIn * 2.54)} cm) is about <strong>{wPct}% of the width</strong> and <strong>{hPct}% of the height</strong> of the
              typical {p.label.toLowerCase()} design area (about {p.areaIn.w} x {p.areaIn.h} in).
            </p>
            {bigger && <p className="mt-2">This is larger than the typical area, so it would likely wrap around, extend into neighboring areas, or be planned as a bigger piece with your artist.</p>}
          </>
        ) : (
          <p>Enter a tattoo size to see how it compares with the area.</p>
        )}
        <p className="mt-2 text-sm text-muted">
          {PLACEMENT_NOTE} The outline is a simplified, flat guide. Curves, proportions and skin movement change how a design looks on a real body. Use this for planning and talk it through with a professional artist.
        </p>
      </div>
    </div>
  );
}
