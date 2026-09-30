// Pure size helpers for the size calculator (and reused by the visualizer). No DOM, easy to unit-test.

export type Unit = "in" | "cm" | "mm";
export const UNITS: { id: Unit; label: string }[] = [
  { id: "in", label: "inches" },
  { id: "cm", label: "centimeters" },
  { id: "mm", label: "millimeters" },
];

const PER_INCH: Record<Unit, number> = { in: 1, cm: 2.54, mm: 25.4 };

export const toInches = (value: number, unit: Unit) => value / PER_INCH[unit];
export const fromInches = (inches: number, unit: Unit) => inches * PER_INCH[unit];
export const round = (n: number, digits = 2) => {
  const f = 10 ** digits;
  return Math.round(n * f) / f;
};
export const convert = (value: number, from: Unit, to: Unit) => fromInches(toInches(value, from), to);

/** Rough size categories by the LONGEST side of the design. Rules of thumb, not an industry standard. */
export interface SizeCategory {
  id: string;
  label: string;
  /** Inclusive lower bound (inches) of the longest side. */
  minIn: number;
  /** Exclusive upper bound; Infinity for the last band. */
  maxIn: number;
  blurb: string;
}

export const SIZE_CATEGORIES: SizeCategory[] = [
  { id: "tiny", label: "Tiny", minIn: 0, maxIn: 1.5, blurb: "Coin-to-thumb scale: a symbol, initial or single small motif." },
  { id: "small", label: "Small", minIn: 1.5, maxIn: 3, blurb: "Up to about a credit card's length: simple icons, short words, small florals." },
  { id: "medium", label: "Medium", minIn: 3, maxIn: 6, blurb: "Palm-to-hand scale: room for moderate detail and short phrases." },
  { id: "large", label: "Large", minIn: 6, maxIn: 10, blurb: "A big single piece, roughly a hand span or more, with room for layered detail." },
  { id: "half-sleeve", label: "Half-sleeve / large panel", minIn: 10, maxIn: 16, blurb: "Covers much of an upper arm, thigh or shoulder blade area." },
  { id: "sleeve", label: "Sleeve / back-piece scale", minIn: 16, maxIn: Infinity, blurb: "A multi-session project scale; plan it with your artist." },
];

export function sizeCategory(widthIn: number, heightIn: number): SizeCategory {
  const longest = Math.max(widthIn, heightIn);
  return SIZE_CATEGORIES.find((c) => longest >= c.minIn && longest < c.maxIn) ?? SIZE_CATEGORIES[0];
}

export const areaIn = (w: number, h: number) => w * h;
export const SQ_CM_PER_SQ_IN = 6.4516;

/** Simplified aspect ratio label (width : height), e.g. 1.5 -> "3:2". Falls back to "1.37:1" style. */
export function aspectRatio(w: number, h: number): { ratio: number; label: string } {
  if (!(w > 0) || !(h > 0)) return { ratio: 0, label: "-" };
  const r = w / h;
  for (let d = 1; d <= 10; d++) {
    const n = Math.round(r * d);
    if (n > 0 && Math.abs(n / d - r) / r < 0.02) return { ratio: r, label: `${n}:${d}` };
  }
  return { ratio: r, label: `${round(r, 2)}:1` };
}

export const scaleSize = (w: number, h: number, factor: number) => ({ w: w * factor, h: h * factor });

/** Rule-of-thumb minimum longest side by detail level. General guidance only; artists vary. */
export const DETAIL_LEVELS = [
  { id: "simple", label: "Simple (bold lines, few elements)", minIn: 1 },
  { id: "moderate", label: "Moderate (some shading or small parts)", minIn: 2.5 },
  { id: "fine", label: "Fine (thin lines, tiny text, dense detail)", minIn: 4 },
] as const;
export type DetailLevel = (typeof DETAIL_LEVELS)[number]["id"];

export function detailCheck(longestIn: number, level: DetailLevel) {
  const min = DETAIL_LEVELS.find((d) => d.id === level)!.minIn;
  return { minIn: min, enough: longestIn >= min };
}

export interface FitArea {
  id: string;
  label: string;
  areaIn: { w: number; h: number };
}

/** Compares a piece to each placement's typical design area (either orientation). */
export function fitPlacements<T extends FitArea>(wIn: number, hIn: number, list: T[]) {
  return list.map((p) => {
    const { w: aw, h: ah } = p.areaIn;
    const fits = (wIn <= aw && hIn <= ah) || (hIn <= aw && wIn <= ah);
    return { placement: p, fits, ratio: (wIn * hIn) / (aw * ah) };
  });
}
