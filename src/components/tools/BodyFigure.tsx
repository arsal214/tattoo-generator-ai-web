import type { ReactNode, Ref, SVGProps } from "react";
import type { BodyView } from "@/lib/tools/data/placements";

export const FIGURE_W = 200;
export const FIGURE_H = 500;

const mirror = (x: number) => FIGURE_W - x;

/** Simple, neutral body silhouette shared by the placement guide and visualizer (viewBox 0 0 200 500). */
export function BodyFigure({
  view,
  viewBox = `0 0 ${FIGURE_W} ${FIGURE_H}`,
  svgRef,
  label,
  children,
  ...rest
}: {
  view: BodyView;
  viewBox?: string;
  svgRef?: Ref<SVGSVGElement>;
  label: string;
  children?: ReactNode;
} & Omit<SVGProps<SVGSVGElement>, "ref" | "viewBox" | "children">) {
  const limb = (x1: number, y1: number, x2: number, y2: number, w: number) => (
    <>
      <line x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth={w} />
      <line x1={mirror(x1)} y1={y1} x2={mirror(x2)} y2={y2} strokeWidth={w} />
    </>
  );
  return (
    <svg ref={svgRef} viewBox={viewBox} role="img" aria-label={label} {...rest}>
      <g className="fill-line stroke-line" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx={100} cy={30} rx={21} ry={28} strokeWidth={0} />
        <line x1={100} y1={56} x2={100} y2={86} strokeWidth={24} />
        <path d="M52 84 Q100 76 148 84 L142 150 Q138 190 132 212 L138 252 L62 252 L68 212 Q62 190 58 150 Z" strokeWidth={0} />
        {limb(46, 94, 30, 178, 24)}
        {limb(30, 178, 20, 252, 19)}
        {limb(20, 252, 17, 282, 13)}
        {limb(82, 252, 78, 365, 44)}
        {limb(78, 365, 76, 468, 30)}
        {limb(76, 468, 74, 490, 24)}
      </g>
      <g className="stroke-muted/40" fill="none" strokeWidth={1.5} aria-hidden>
        {view === "back" && <line x1={100} y1={62} x2={100} y2={246} strokeDasharray="3 4" />}
        {view === "front" && <circle cx={100} cy={170} r={1.6} className="fill-muted/40" strokeWidth={0} />}
      </g>
      {children}
    </svg>
  );
}
