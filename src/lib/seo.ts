import type { Metadata } from "next";
import { SITE, absoluteUrl } from "./site";

interface MetaInput {
  title: string;
  description: string;
  /** Path such as "/tattoo-generator". Becomes the canonical URL. */
  path: string;
  type?: "website" | "article";
  /** Absolute or site-relative OG image. Omit to use the nearest opengraph-image file convention. */
  image?: string;
  publishedTime?: string;
  modifiedTime?: string;
  noindex?: boolean;
  /** Set when the route has its own opengraph-image file (tool and blog pages). Otherwise the site default card is used. */
  ownOg?: boolean;
}

/** Unique title/description/canonical/OG/Twitter for every indexable page. */
export function buildMetadata({ title, description, path, type = "website", image, publishedTime, modifiedTime, noindex, ownOg }: MetaInput): Metadata {
  image ??= ownOg ? undefined : "/opengraph-image";
  const url = absoluteUrl(path);
  const images = image ? [{ url: image.startsWith("http") ? image : absoluteUrl(image), width: 1200, height: 630, alt: title }] : undefined;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    robots: noindex ? { index: false, follow: false } : undefined,
    openGraph: { title, description, url, siteName: SITE.name, locale: "en_US", type, ...(images && { images }), ...(type === "article" && { publishedTime, modifiedTime }) },
    twitter: { card: "summary_large_image", title, description, site: SITE.twitter, ...(images && { images: images.map((i) => i.url) }) },
  };
}

export const noIndexMetadata = (title: string): Metadata => ({
  title,
  robots: { index: false, follow: false },
});

// ---------- JSON-LD builders (only used where visible content matches) ----------

export const breadcrumbLd = (items: { name: string; path: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: absoluteUrl(it.path) })),
});

export const faqLd = (faq: { q: string; a: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
});

export const webAppLd = (name: string, description: string, path: string) => ({
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name,
  description,
  url: absoluteUrl(path),
  applicationCategory: "DesignApplication",
  operatingSystem: "Any",
  browserRequirements: "Requires JavaScript",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
});
