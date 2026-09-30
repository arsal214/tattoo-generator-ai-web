// Single source of truth for generator options. Used by the UI, zod validation and the prompt engine.
export interface StyleOption {
  value: string;
  label: string;
  /** Prompt fragment describing the style for the image model. */
  prompt: string;
  blurb: string;
  /** Dedicated style landing page, if one exists. */
  toolSlug?: string;
}

export const STYLES: StyleOption[] = [
  { value: "minimalist", label: "Minimalist", blurb: "Few lines, lots of breathing room.", toolSlug: "minimalist-tattoo-generator", prompt: "minimalist tattoo design, a single clean thin line, very few elements, generous negative space" },
  { value: "fine-line", label: "Fine Line", blurb: "Delicate single-needle detail.", toolSlug: "fine-line-tattoo-generator", prompt: "fine line tattoo design, delicate single-needle linework, elegant thin strokes, subtle detail" },
  { value: "traditional", label: "Traditional", blurb: "Bold outlines and a limited palette.", toolSlug: "traditional-tattoo-generator", prompt: "American traditional tattoo flash design, thick bold black outlines, solid fills, limited classic palette" },
  { value: "neo-traditional", label: "Neo Traditional", blurb: "Traditional structure, richer colour.", prompt: "neo-traditional tattoo design, bold outlines with variable line weight, rich saturated colour, ornamental detail" },
  { value: "blackwork", label: "Blackwork", blurb: "Solid black shapes and contrast.", prompt: "blackwork tattoo design, heavy solid black fills, strong contrast, graphic shapes" },
  { value: "geometric", label: "Geometric", blurb: "Precise shapes and symmetry.", toolSlug: "geometric-tattoo-generator", prompt: "geometric tattoo design, precise sacred-geometry shapes, symmetry, crisp straight lines and circles" },
  { value: "tribal", label: "Tribal", blurb: "Flowing bold black patterns.", toolSlug: "tribal-tattoo-generator", prompt: "tribal style tattoo design, bold flowing black patterns, sharp curves, interlocking shapes" },
  { value: "gothic", label: "Gothic", blurb: "Dark, ornate, dramatic.", toolSlug: "gothic-tattoo-generator", prompt: "gothic tattoo design, dark ornate imagery, dramatic contrast, pointed arches and blackletter-inspired detail" },
  { value: "watercolor", label: "Watercolor", blurb: "Soft colour washes and splashes.", prompt: "watercolor tattoo design, soft colour washes, loose painterly gradients, light linework" },
  { value: "realism", label: "Realism", blurb: "Photographic shading and depth.", prompt: "realism tattoo design, detailed smooth shading, lifelike depth and texture" },
  { value: "japanese", label: "Japanese", blurb: "Irezumi motifs and bold flow.", prompt: "traditional Japanese irezumi tattoo design, bold outlines, flowing wind bars and waves, classic motifs" },
  { value: "old-school", label: "Old School", blurb: "Classic sailor-flash energy.", prompt: "old school sailor tattoo flash, thick black outlines, bold simple shading, vintage feel" },
  { value: "sketch", label: "Sketch", blurb: "Hand-drawn, loose linework.", prompt: "sketch style tattoo design, loose hand-drawn pencil-like linework, cross-hatching" },
  { value: "dotwork", label: "Dotwork", blurb: "Shading built from dots.", prompt: "dotwork tattoo design, stippled shading made of individual dots, delicate gradients" },
];

export interface PlacementOption {
  value: string;
  label: string;
  /** Shape hint so the composition suits the body area. */
  shape: string;
}

export const PLACEMENTS: PlacementOption[] = [
  { value: "forearm", label: "Forearm", shape: "a vertical elongated composition that follows the length of a forearm" },
  { value: "upper-arm", label: "Upper Arm", shape: "a compact, roughly oval composition suited to an upper arm" },
  { value: "wrist", label: "Wrist", shape: "a small, narrow horizontal composition that wraps a wrist" },
  { value: "hand", label: "Hand", shape: "a small, simple, high-contrast composition suited to a hand" },
  { value: "chest", label: "Chest", shape: "a wide, symmetrical composition suited to a chest" },
  { value: "back", label: "Back", shape: "a large, tall composition with room to breathe, suited to a back" },
  { value: "shoulder", label: "Shoulder", shape: "a rounded composition that fits the curve of a shoulder" },
  { value: "neck", label: "Neck", shape: "a narrow, compact composition suited to the neck" },
  { value: "rib", label: "Rib", shape: "a long, narrow vertical composition that follows the ribcage" },
  { value: "leg", label: "Leg", shape: "a tall composition suited to the leg" },
  { value: "ankle", label: "Ankle", shape: "a small, delicate composition suited to an ankle" },
  { value: "thigh", label: "Thigh", shape: "a large oval composition suited to a thigh" },
  { value: "calf", label: "Calf", shape: "a vertical, slightly tapered composition suited to a calf" },
];

export const SIZES = [
  { value: "small", label: "Small", prompt: "small tattoo, simple with minimal detail so it stays legible when tattooed at a few inches" },
  { value: "medium", label: "Medium", prompt: "medium tattoo, moderate detail" },
  { value: "large", label: "Large", prompt: "large tattoo piece, rich detail and layered composition" },
] as const;

export const COLORS = [
  { value: "black-white", label: "Black & White", prompt: "pure black ink on a white background, no grey shading" },
  { value: "black-grey", label: "Black & Grey", prompt: "black and grey wash ink shading, no colour" },
  { value: "color", label: "Color", prompt: "full-colour tattoo ink palette" },
] as const;

export const styleValues = STYLES.map((s) => s.value) as [string, ...string[]];
export const placementValues = PLACEMENTS.map((p) => p.value) as [string, ...string[]];
export const sizeValues = SIZES.map((s) => s.value) as [string, ...string[]];
export const colorValues = COLORS.map((c) => c.value) as [string, ...string[]];

export const label = (list: readonly { value: string; label: string }[], value: string) =>
  list.find((o) => o.value === value)?.label ?? value;

export const PROMPT_EXAMPLES = [
  "A minimalist wolf with mountains",
  "Roman numeral tattoo with flowers",
  "Small fine-line butterfly",
  "Gothic lion tattoo",
  "Couple tattoo with initials",
];

export const CREDITS_PER_GENERATION = 1;
export const SIGNUP_CREDITS = 20;
export const PROMPT_MAX = 500;
