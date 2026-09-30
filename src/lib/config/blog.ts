export const BLOG_CATEGORIES = [
  { slug: "ideas", name: "Ideas", description: "Tattoo ideas and inspiration for every taste." },
  { slug: "styles", name: "Styles", description: "Tattoo styles explained, from fine line to blackwork." },
  { slug: "lettering", name: "Lettering", description: "Fonts, scripts and lettering styles for text tattoos." },
  { slug: "placement", name: "Placement", description: "Where to put a tattoo and what to think about first." },
  { slug: "design", name: "Design", description: "How tattoo designs come together, from concept to stencil." },
  { slug: "guides", name: "Guides", description: "Practical guides for planning your tattoo." },
] as const;

export type BlogCategorySlug = (typeof BLOG_CATEGORIES)[number]["slug"];
export const blogCategorySlugs = BLOG_CATEGORIES.map((c) => c.slug) as [BlogCategorySlug, ...BlogCategorySlug[]];
