export const SITE = {
  name: "TattooGenerator.com",
  shortName: "TattooGenerator",
  url: (process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000").replace(/\/$/, ""),
  tagline: "Free Tattoo Generator – Create Tattoo Designs Online",
  description:
    "Create tattoo ideas online with a free tattoo generator. Explore lettering, names, symbols and design styles to plan your next tattoo.",
  email: "hello@tattoogenerator.com",
  twitter: "@tattoogenerator",
} as const;

export const absoluteUrl = (path = "/") => `${SITE.url}${path.startsWith("/") ? path : `/${path}`}`;
