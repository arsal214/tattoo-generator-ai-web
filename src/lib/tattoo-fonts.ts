import {
  Alfa_Slab_One,
  Caveat,
  Dancing_Script,
  Grenze_Gotisch,
  Great_Vibes,
  Jost,
  Pirata_One,
  Special_Elite,
  UnifrakturCook,
} from "next/font/google";

// Only import this module from tool pages that need lettering; it registers @font-face rules.
// next/font requires literal option objects (no spreads), so each call spells them out.

const gothic = Grenze_Gotisch({ subsets: ["latin"], display: "swap", preload: false, weight: "700" });
const oldEnglish = UnifrakturCook({ subsets: ["latin"], display: "swap", preload: false, weight: "700" });
const blackletter = Pirata_One({ subsets: ["latin"], display: "swap", preload: false, weight: "400" });
const cursive = Dancing_Script({ subsets: ["latin"], display: "swap", preload: false, weight: "700" });
const script = Great_Vibes({ subsets: ["latin"], display: "swap", preload: false, weight: "400" });
const handwritten = Caveat({ subsets: ["latin"], display: "swap", preload: false, weight: "600" });
const traditional = Alfa_Slab_One({ subsets: ["latin"], display: "swap", preload: false, weight: "400" });
const minimal = Jost({ subsets: ["latin"], display: "swap", preload: false, weight: "300" });
const typewriter = Special_Elite({ subsets: ["latin"], display: "swap", preload: false, weight: "400" });

export type FontStyleId =
  | "gothic"
  | "old-english"
  | "cursive"
  | "script"
  | "blackletter"
  | "minimal"
  | "handwritten"
  | "traditional"
  | "typewriter";

export interface TattooFont {
  id: FontStyleId;
  label: string;
  /** CSS font-family value (works for DOM and canvas). */
  family: string;
  /** CSS font shorthand fragment for canvas (weight + family), e.g. `700 ${size}px ...`. */
  weight: number;
  description: string;
  /** Sensible spacing default in em/100 for this style. */
  defaultSpacing: number;
}

export const TATTOO_FONTS: TattooFont[] = [
  { id: "gothic", label: "Gothic", family: gothic.style.fontFamily, weight: 700, description: "Sharp, angular, dramatic.", defaultSpacing: 2 },
  { id: "old-english", label: "Old English", family: oldEnglish.style.fontFamily, weight: 700, description: "Classic ornate blackletter.", defaultSpacing: 0 },
  { id: "cursive", label: "Cursive", family: cursive.style.fontFamily, weight: 700, description: "Lively, connected strokes.", defaultSpacing: 0 },
  { id: "script", label: "Script", family: script.style.fontFamily, weight: 400, description: "Formal, elegant flourishes.", defaultSpacing: 0 },
  { id: "blackletter", label: "Blackletter", family: blackletter.style.fontFamily, weight: 400, description: "Tight medieval texture.", defaultSpacing: 1 },
  { id: "minimal", label: "Minimal", family: minimal.style.fontFamily, weight: 300, description: "Clean, thin, modern.", defaultSpacing: 6 },
  { id: "handwritten", label: "Handwritten", family: handwritten.style.fontFamily, weight: 600, description: "Personal, pen-on-paper feel.", defaultSpacing: 0 },
  { id: "traditional", label: "Traditional", family: traditional.style.fontFamily, weight: 400, description: "Bold flash-sheet lettering.", defaultSpacing: 2 },
  { id: "typewriter", label: "Typewriter", family: typewriter.style.fontFamily, weight: 400, description: "Vintage typed look.", defaultSpacing: 2 },
];

export const getFont = (id: string | undefined) => TATTOO_FONTS.find((f) => f.id === id) ?? TATTOO_FONTS[0];
