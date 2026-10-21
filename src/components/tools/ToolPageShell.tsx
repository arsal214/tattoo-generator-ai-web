import { JsonLd } from "@/components/seo/JsonLd";
import { PostCard } from "@/components/blog/PostCard";
import { Breadcrumbs, CtaBand, FaqList, FeatureGrid, Inline, SectionHeading, Steps, ToolCard } from "@/components/marketing/Sections";
import { breadcrumbLd, faqLd, webAppLd } from "@/lib/seo";
import type { ToolDef } from "@/lib/tools/types";
import type { PostSummary } from "@/lib/blog/queries";
import { ToolWidget } from "./widgets";

interface Props {
  tool: ToolDef;
  related: ToolDef[];
  posts: PostSummary[];
}

/** Standard tool-page template: H1 → intro → tool → how it works → features → examples → tips → related → FAQ → CTA. */
export function ToolPageShell({ tool, related, posts }: Props) {
  const isAi = tool.kind === "ai";
  return (
    <main>
      <JsonLd
        data={[
          webAppLd(tool.name, tool.metaDescription, `/${tool.slug}`),
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: tool.name, path: `/${tool.slug}` },
          ]),
          faqLd(tool.faq),
        ]}
      />

      <header className="bg-ink bg-dots pb-20 pt-8 text-bone sm:pb-24 sm:pt-10">
        <div className="container-x">
          <Breadcrumbs dark items={[{ name: "Home", href: "/" }, { name: tool.name }]} />
          <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-[1.08] sm:text-5xl">{tool.h1}</h1>
        </div>
      </header>

        <section aria-label={`${tool.name} tool`} className="container-x -mt-12 mb-4 sm:-mt-14">
          <div className="rounded-3xl border border-line bg-paper p-4 shadow-[0_24px_60px_-30px_rgba(14,14,17,0.45)] sm:p-7">
            <ToolWidget tool={tool} />
          </div>
          {isAi && <p className="mt-3 text-center text-sm text-muted">Free to try — new accounts get 20 credits. 1 credit = 1 AI tattoo generation.</p>}
        </section>

        <section className="section container-x" aria-labelledby="how">
          <SectionHeading id="how" eyebrow="How it works" title={`Using the ${tool.name.toLowerCase()}`} />
          <Steps steps={tool.steps} />
        </section>

        <section className="bg-bone/60">
          <div className="section container-x" aria-labelledby="features">
            <SectionHeading id="features" eyebrow="What you get" title="Built for real tattoo planning" />
            <FeatureGrid items={tool.features} />
          </div>
        </section>

        <section className="section container-x" aria-labelledby="examples">
          <SectionHeading id="examples" eyebrow="Ideas" title="Examples and ways to use it" />
          <div className="grid gap-4 md:grid-cols-2">
            {tool.examples.map((e) => (
              <div key={e.title} className="rounded-2xl border-l-4 border-accent bg-white p-5">
                <h3 className="text-lg font-semibold">{e.title}</h3>
                <p className="mt-1.5 text-[15px] leading-relaxed text-ink/75">{e.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-bone/60">
          <div className="section container-x grid gap-10 lg:grid-cols-[5fr_7fr]" aria-labelledby="tips">
            <div>
              <SectionHeading id="tips" eyebrow="Tips" title="Get better results" className="mb-0" />
            </div>
            <ul className="space-y-3">
              {tool.tips.map((t) => (
                <li key={t} className="flex gap-3 rounded-xl bg-white p-4 text-[15px] leading-relaxed">
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-accent" aria-hidden />
                  <Inline md={t} />
                </li>
              ))}
            </ul>
          </div>
        </section>

        {tool.info && (
          <section className="section container-x" aria-labelledby="info">
            <div className="max-w-3xl">
              <h2 id="info" className="text-3xl font-semibold sm:text-4xl">
                {tool.info.heading}
              </h2>
              <div className="prose-tg mt-4">
                {tool.info.paragraphs.map((p, i) => (
                  <p key={i}>
                    <Inline md={p} />
                  </p>
                ))}
              </div>
            </div>
          </section>
        )}

        {related.length > 0 && (
          <section className="bg-bone/60">
            <div className="section container-x" aria-labelledby="related">
              <SectionHeading id="related" eyebrow="Keep planning" title="Related tattoo tools" />
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {related.map((t) => (
                  <ToolCard key={t.slug} tool={t} />
                ))}
              </div>
            </div>
          </section>
        )}

        {posts.length > 0 && (
          <section className="section container-x" aria-labelledby="reading">
            <SectionHeading id="reading" eyebrow="Read next" title="Related guides" />
            <div className="grid gap-4 md:grid-cols-3">
              {posts.map((p) => (
                <PostCard key={p.slug} post={p} />
              ))}
            </div>
          </section>
        )}

        <section className="section container-x" aria-labelledby="faq">
          <SectionHeading id="faq" eyebrow="FAQ" title="Frequently asked questions" />
          <div className="max-w-3xl">
            <FaqList faq={tool.faq} />
          </div>
        </section>

      <CtaBand
        heading={tool.cta?.heading ?? "Ready to plan your next tattoo?"}
        body={tool.cta?.body ?? "Start with 20 free credits and turn your idea into a design you can take to your artist."}
        primary={{ href: "/signup", label: "Get 20 free credits" }}
        secondary={{ href: "/tattoo-generator", label: "Explore the AI generator" }}
      />
    </main>
  );
}
