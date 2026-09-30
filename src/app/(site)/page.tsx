import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { TattooGenerator } from "@/components/generator/TattooGenerator";
import { PostCard } from "@/components/blog/PostCard";
import { CtaBand, FaqList, SectionHeading, Steps, ToolCard } from "@/components/marketing/Sections";
import { PlanCards } from "@/components/pricing/PlanCards";
import { JsonLd } from "@/components/seo/JsonLd";
import { listPosts } from "@/lib/blog/queries";
import { STYLES } from "@/lib/config/generation";
import { buildMetadata, faqLd } from "@/lib/seo";
import { SITE, absoluteUrl } from "@/lib/site";
import { TOOLS, getTool } from "@/lib/tools/registry";
import { TOOL_CATEGORIES } from "@/lib/tools/types";

export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: "Free Tattoo Generator – Create Tattoo Designs Online",
  description: SITE.description,
  path: "/",
});

const STEPS = [
  { title: "Describe your idea", body: "Write it the way you'd tell a friend — \"a small fine-line moth on the wrist\" is plenty. No prompt-writing skills needed." },
  { title: "Pick style, placement and size", body: "Choose from 14 tattoo styles and 13 body areas. We shape the design to suit both the look and the spot." },
  { title: "Generate and refine", body: "Get a clean, tattoo-ready concept in seconds. Try another style, tweak the prompt, or generate again." },
  { title: "Save, download, take it to your artist", body: "Keep favorites in your account and download the artwork as reference for a professional consultation." },
];

const FAQ = [
  { q: "What is a tattoo generator?", a: "A tattoo generator is an online tool that turns a written idea into tattoo design concepts. Ours uses AI to create tattoo-style artwork based on your description, chosen style, placement, size and color." },
  { q: "Is the tattoo generator free?", a: "You can start for free. Every new account gets 20 credits with no payment details, and each generation uses 1 credit. If you need more, the Creator and Pro plans add more credits." },
  { q: "Can I generate custom tattoo ideas?", a: "Yes. Describe anything from a single symbol to a detailed scene. The generator produces original artwork for your description rather than picking from a catalog of stock designs." },
  { q: "Can I choose a tattoo style?", a: "Yes. There are 14 styles, including minimalist, fine line, traditional, neo traditional, blackwork, geometric, tribal, gothic, watercolor, realism, Japanese, old school, sketch and dotwork." },
  { q: "Can I download my tattoo design?", a: "Yes. Every design is saved to your account, and you can download the image from the result screen or from My Designs." },
  { q: "Can I use the design as inspiration for a tattoo artist?", a: "That's exactly what it's for. Treat generated designs as concepts and reference material, then work with a professional tattoo artist who can adapt the idea to your body, skin and their own style." },
];

export default async function HomePage() {
  const featured = ["tattoo-font-generator", "tattoo-name-generator", "tattoo-placement-guide", "tattoo-size-calculator"].map(getTool).filter((t) => t !== undefined);
  const { items: posts } = await listPosts({ limit: 3 });

  return (
    <main>
      <JsonLd
        data={[
          { "@context": "https://schema.org", "@type": "WebSite", name: SITE.name, url: SITE.url, description: SITE.description },
          { "@context": "https://schema.org", "@type": "Organization", name: SITE.name, url: SITE.url, logo: absoluteUrl("/icon.svg") },
          {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "TattooGenerator.com – AI Tattoo Generator",
            url: SITE.url,
            applicationCategory: "DesignApplication",
            operatingSystem: "Any",
            description: SITE.description,
            offers: [
              { "@type": "Offer", name: "Free", price: "0", priceCurrency: "USD" },
              { "@type": "Offer", name: "Creator", price: "9", priceCurrency: "USD" },
              { "@type": "Offer", name: "Pro", price: "50", priceCurrency: "USD" },
            ],
          },
          faqLd(FAQ),
        ]}
      />

      {/* ---------- hero + live generator ---------- */}
      <section className="bg-ink bg-dots pb-24 pt-10 text-bone sm:pb-28 sm:pt-14">
        <div className="container-x">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-bone/20 px-3 py-1 text-[13px] text-bone/80">
            <span className="h-2 w-2 rounded-full bg-accent" aria-hidden /> 20 free credits when you sign up
          </p>
          <h1 className="max-w-4xl text-4xl font-semibold leading-[1.05] sm:text-6xl">Free Tattoo Generator – Create Tattoo Designs Online</h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-bone/80 sm:text-xl">
            Turn your ideas into unique tattoo designs with AI. Describe your idea, choose a style, and generate tattoo concepts you can save, customize, and download.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a href="#generator" className="btn btn-primary btn-lg">
              Generate Your Tattoo
            </a>
            <Link href="/tattoo-idea-generator" className="btn btn-outline-light btn-lg">
              Explore Tattoo Ideas
            </Link>
          </div>
        </div>
      </section>

      <section id="generator" className="container-x -mt-16 scroll-mt-20 sm:-mt-20" aria-label="Tattoo generator">
        <div className="rounded-3xl border border-line bg-paper p-4 shadow-[0_30px_70px_-30px_rgba(14,14,17,0.55)] sm:p-8">
          <TattooGenerator />
        </div>
      </section>

      {/* ---------- how it works ---------- */}
      <section className="section container-x" aria-labelledby="how">
        <SectionHeading id="how" eyebrow="How it works" title="From rough idea to tattoo-ready concept">
          A tattoo design has to work on skin, not just on a screen. The generator is tuned for clean composition, strong linework and a clear silhouette.
        </SectionHeading>
        <Steps steps={STEPS} />
      </section>

      {/* ---------- styles ---------- */}
      <section className="bg-bone/60">
        <div className="section container-x" aria-labelledby="styles">
          <SectionHeading id="styles" eyebrow="Tattoo styles" title="14 styles, each with its own rules">
            Style changes everything: line weight, shading, how much detail survives at small sizes. Pick the look, and the generator handles the rest.
          </SectionHeading>
          <ul className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-5">
            {STYLES.map((s) => {
              const inner = (
                <>
                  <span className="font-display text-lg font-semibold">{s.label}</span>
                  <span className="mt-1 block text-[13px] leading-snug text-muted">{s.blurb}</span>
                </>
              );
              return (
                <li key={s.value}>
                  {s.toolSlug ? (
                    <Link href={`/${s.toolSlug}`} className="block h-full rounded-xl border border-line bg-white p-4 transition hover:border-ink hover:shadow-[3px_3px_0_0_var(--color-ink)]">
                      {inner}
                    </Link>
                  ) : (
                    <div className="h-full rounded-xl border border-line bg-white p-4">{inner}</div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ---------- tools ---------- */}
      <section className="section container-x" aria-labelledby="tools">
        <SectionHeading id="tools" eyebrow="More than a generator" title="Everything for planning a tattoo">
          Lettering, names, dates, symbols, sizing and placement — the details that decide whether a tattoo works long after the excitement of choosing it.
        </SectionHeading>
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((t) => (
            <ToolCard key={t.slug} tool={t} />
          ))}
        </div>
        <div className="grid gap-x-8 gap-y-6 md:grid-cols-2 lg:grid-cols-3">
          {TOOL_CATEGORIES.map((c) => (
            <div key={c.id}>
              <h3 className="text-lg font-semibold">{c.name}</h3>
              <p className="mb-2 text-sm text-muted">{c.description}</p>
              <ul className="space-y-0.5 text-[15px]">
                {TOOLS.filter((t) => t.category === c.id).map((t) => (
                  <li key={t.slug}>
                    <Link href={`/${t.slug}`} className="inline-flex min-h-9 items-center gap-1 hover:text-accent">
                      {t.name} <ArrowRight size={13} aria-hidden />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- pricing ---------- */}
      <section className="bg-bone/60">
        <div className="section container-x" aria-labelledby="pricing">
          <SectionHeading id="pricing" eyebrow="Pricing" title="Start free. Pay only if you need more.">
            1 credit = 1 AI tattoo generation. The lettering, symbol and planning tools never use credits.
          </SectionHeading>
          <PlanCards from="home" />
        </div>
      </section>

      {/* ---------- blog ---------- */}
      {posts.length > 0 && (
        <section className="section container-x" aria-labelledby="reading">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <SectionHeading id="reading" eyebrow="From the blog" title="Guides and ideas" className="mb-0" />
            <Link href="/blog" className="btn btn-outline btn-sm">
              All articles
            </Link>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {posts.map((p) => (
              <PostCard key={p.slug} post={p} />
            ))}
          </div>
        </section>
      )}

      {/* ---------- faq ---------- */}
      <section className="section container-x" aria-labelledby="faq">
        <SectionHeading id="faq" eyebrow="FAQ" title="Tattoo generator questions" />
        <div className="max-w-3xl">
          <FaqList faq={FAQ} />
        </div>
      </section>

      <CtaBand heading="Your next tattoo starts with an idea" body="Claim 20 free credits and see your concept on screen before you ever book a consultation." primary={{ href: "/signup", label: "Get 20 free credits" }} secondary={{ href: "/tattoo-font-generator", label: "Try the font generator" }} />
    </main>
  );
}
