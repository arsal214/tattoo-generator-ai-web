import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

/**
 * 301 redirect architecture: add `{ source, destination }` rows here when a URL changes or a
 * near-duplicate slug should consolidate onto the canonical page.
 */
const REDIRECTS: { source: string; destination: string }[] = [
  { source: "/ai-tattoo-generator", destination: "/tattoo-generator" },
  { source: "/tattoo-generators", destination: "/tattoo-generator" },
  { source: "/tattoo-fonts", destination: "/tattoo-font-generator" },
  { source: "/tattoo-lettering", destination: "/tattoo-lettering-generator" },
  { source: "/tattoo-placement", destination: "/tattoo-placement-guide" },
  { source: "/tattoo-size-chart", destination: "/tattoo-size-calculator" },
  { source: "/blog/category", destination: "/blog" },
];

const config: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    localPatterns: [{ pathname: "/api/files/**" }],
  },
  async redirects() {
    return REDIRECTS.map((r) => ({ ...r, permanent: true }));
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default config;
