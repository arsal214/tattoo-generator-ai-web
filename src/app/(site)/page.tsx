import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { TattooGenerator } from "@/components/generator/TattooGenerator";
import { PostCard } from "@/components/blog/PostCard";
import { CtaBand, FaqList, Rich, SectionHeading, Steps, ToolCard } from "@/components/marketing/Sections";
import { PlanCards } from "@/components/pricing/PlanCards";
import { JsonLd } from "@/components/seo/JsonLd";
import { getContent } from "@/lib/content";
import { listPosts } from "@/lib/blog/queries";
import { STYLES } from "@/lib/config/generation";
import { buildMetadata, faqLd } from "@/lib/seo";
import { SITE, absoluteUrl } from "@/lib/site";
import { TOOLS, getTool } from "@/lib/tools/registry";
import { TOOL_CATEGORIES } from "@/lib/tools/types";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const c = await getContent("home");
  return buildMetadata({ title: c.metaTitle, description: c.metaDescription, path: "/" });
}

export default async function HomePage() {
  const featured = ["tattoo-font-generator", "tattoo-name-generator", "tattoo-placement-guide", "tattoo-size-calculator"].map(getTool).filter((t) => t !== undefined);
  const { items: posts } = await listPosts({ limit: 3 });
  const c = await getContent("home");

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
          faqLd(c.faq),
        ]}
      />

      {/* ---------- hero + live generator ---------- */}
      <section className="bg-ink bg-dots pb-24 pt-10 text-bone sm:pb-28 sm:pt-14">
        <div className="container-x">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-bone/20 px-3 py-1 text-[13px] text-bone/80">
            <span className="h-2 w-2 rounded-full bg-accent" aria-hidden /> {c.badge}
          </p>
          <h1 className="max-w-4xl text-4xl font-semibold leading-[1.05] sm:text-6xl">{c.heroTitle}</h1>
          <Rich html={c.heroBody} className="mt-5 max-w-2xl text-lg leading-relaxed text-bone/80 sm:text-xl" />
          <div className="mt-7 flex flex-wrap gap-3">
            <a href="#generator" className="btn btn-primary btn-lg">
              {c.primaryCta}
            </a>
            <Link href="/tattoo-idea-generator" className="btn btn-outline-light btn-lg">
              {c.secondaryCta}
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
        <SectionHeading id="how" eyebrow={c.howEyebrow} title={c.howTitle}>
          {c.howBody}
        </SectionHeading>
        <Steps steps={c.steps} />
      </section>

      {/* ---------- styles ---------- */}
      <section className="bg-bone/60">
        <div className="section container-x" aria-labelledby="styles">
          <SectionHeading id="styles" eyebrow={c.stylesEyebrow} title={c.stylesTitle}>
            {c.stylesBody}
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
        <SectionHeading id="tools" eyebrow={c.toolsEyebrow} title={c.toolsTitle}>
          {c.toolsBody}
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
          <SectionHeading id="pricing" eyebrow={c.pricingEyebrow} title={c.pricingTitle}>
            {c.pricingBody}
          </SectionHeading>
          <PlanCards from="home" />
        </div>
      </section>

      {/* ---------- blog ---------- */}
      {posts.length > 0 && (
        <section className="section container-x" aria-labelledby="reading">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <SectionHeading id="reading" eyebrow={c.blogEyebrow} title={c.blogTitle} className="mb-0" />
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
        <SectionHeading id="faq" eyebrow="FAQ" title={c.faqTitle} />
        <div className="max-w-3xl">
          <FaqList faq={c.faq} />
        </div>
      </section>

      <CtaBand heading={c.ctaHeading} body={c.ctaBody} primary={{ href: "/signup", label: c.ctaPrimary }} secondary={{ href: "/tattoo-font-generator", label: c.ctaSecondary }} />
    </main>
  );
}
