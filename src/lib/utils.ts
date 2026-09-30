export const cn = (...parts: (string | false | null | undefined)[]) => parts.filter(Boolean).join(" ");

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const formatDate = (d: Date | string) =>
  new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
