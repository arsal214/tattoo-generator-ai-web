export type ToolCategory = "generators" | "fonts" | "symbols" | "planning" | "styles";

/** Which interactive widget a tool page renders. See src/components/tools/widgets.tsx. */
export type ToolKind =
  | "ai" // AI image generator (uses the shared <TattooGenerator/>), optionally preset
  | "font" // <FontGenerator/> with a preset font style
  | "name" // <NameGenerator/>
  | "quote" // <QuoteGenerator/>
  | "roman" // <RomanNumeralGenerator/>
  | "date" // <DateTattooGenerator/>
  | "coordinates" // <CoordinatesGenerator/>
  | "initials" // <InitialsGenerator/>
  | "symbols" // <SymbolGenerator/>
  | "size" // <SizeCalculator/>
  | "placement-guide" // <PlacementGuide/>
  | "visualizer" // <PlacementVisualizer/>
  | "stencil"; // <StencilMaker/>

export interface ToolPreset {
  /** AI generator defaults (values from lib/config/generation.ts). */
  style?: string;
  placement?: string;
  size?: string;
  color?: string;
  prompt?: string;
  /** Clickable idea chips that fill the prompt (AI tools). */
  chips?: string[];
  /** Font generator default style id (see lib/tattoo-fonts.ts). */
  fontStyle?: string;
  /** Default sample text for text tools. */
  text?: string;
}

export interface TitledText {
  title: string;
  body: string;
}

export interface ToolDef {
  /** URL slug, served at /{slug}. */
  slug: string;
  /** Short display name used in nav and cards, e.g. "Tattoo Font Generator". */
  name: string;
  /** One line used on cards and in nav. */
  blurb: string;
  category: ToolCategory;
  kind: ToolKind;
  preset?: ToolPreset;

  // ---- SEO ----
  /** <title>, max ~60 chars, unique. */
  metaTitle: string;
  /** Meta description, 130–160 chars, unique. */
  metaDescription: string;
  /** The one H1 on the page. */
  h1: string;

  // ---- Content (all unique per page; no boilerplate reuse) ----
  /** 1–2 short paragraphs shown above the tool. */
  intro: string[];
  /** "How it works": 3–4 steps. */
  steps: TitledText[];
  /** 3–6 feature cards. */
  features: TitledText[];
  /** 3–5 examples / use cases. */
  examples: TitledText[];
  /** 4–6 practical tips. */
  tips: string[];
  /** Optional "helpful information" section. Body paragraphs may contain markdown links. */
  info?: { heading: string; paragraphs: string[] };
  /** 4–6 FAQs. Rendered visibly AND emitted as FAQPage JSON-LD, so answers must be plain text. */
  faq: { q: string; a: string }[];
  /** Related tool slugs (2–4, must exist in the registry). */
  related: string[];
  /** Blog post slugs that support this tool (must exist in blog seed). */
  articles: string[];
  /** Final call-to-action copy. */
  cta?: { heading: string; body: string };
}

export const TOOL_CATEGORIES: { id: ToolCategory; name: string; description: string }[] = [
  { id: "generators", name: "Tattoo Generators", description: "AI-powered ideas, designs, names and quotes." },
  { id: "fonts", name: "Fonts & Lettering", description: "Preview and download tattoo lettering styles." },
  { id: "symbols", name: "Symbols & Numbers", description: "Numerals, dates, initials, zodiac and coordinates." },
  { id: "planning", name: "Tattoo Planning", description: "Size, placement and stencil tools." },
  { id: "styles", name: "Tattoo Styles", description: "Style-specific AI generators." },
];
