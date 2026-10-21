import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import { marked } from "marked";
import { richHtml } from "@/lib/rich";
import type { ReactNode } from "react";
import type { ToolDef, TitledText } from "@/lib/tools/types";
import { cn } from "@/lib/utils";

/** Renders trusted (repo-authored) markdown inline: links and emphasis only. */
export function Inline({ md, className }: { md: string; className?: string }) {
  return <span className={className} dangerouslySetInnerHTML={{ __html: marked.parseInline(md, { async: false }) as string }} />;
}

/** Block-level admin copy (HTML or markdown) in a div, so it can hold paragraphs and lists. */
export function Rich({ html, className }: { html: string; className?: string }) {
  return <div className={cn("rich", className)} dangerouslySetInnerHTML={{ __html: richHtml(html) }} />;
}

export function SectionHeading({ id, eyebrow, title, children, className }: { id?: string; eyebrow?: string; title: string; children?: ReactNode; className?: string }) {
  return (
    <div className={cn("mb-8 max-w-2xl", className)}>
      {eyebrow && <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-accent">{eyebrow}</p>}
      <h2 id={id} className="text-3xl font-semibold sm:text-4xl">
        {title}
      </h2>
      {children && <div className="mt-3 text-lg text-muted">{typeof children === "string" ? <Rich html={children} /> : children}</div>}
    </div>
  );
}

export function Steps({ steps }: { steps: TitledText[] }) {
  return (
    <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {steps.map((s, i) => (
        <li key={s.title} className="card p-5">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink font-display text-lg font-semibold text-bone">{i + 1}</span>
          <h3 className="mt-4 text-lg font-semibold">{s.title}</h3>
          <Rich html={s.body} className="mt-1.5 text-[15px] leading-relaxed text-ink/75" />
        </li>
      ))}
    </ol>
  );
}

export function FeatureGrid({ items }: { items: TitledText[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((f) => (
        <div key={f.title} className="rounded-2xl border border-line bg-white p-5">
          <h3 className="text-lg font-semibold">{f.title}</h3>
          <p className="mt-1.5 text-[15px] leading-relaxed text-ink/75">{f.body}</p>
        </div>
      ))}
    </div>
  );
}

export function FaqList({ faq }: { faq: { q: string; a: string }[] }) {
  return (
    <div className="divide-y divide-line rounded-2xl border border-line bg-white">
      {faq.map((f) => (
        <details key={f.q} className="group px-5 py-1">
          <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-3 text-left font-semibold [&::-webkit-details-marker]:hidden">
            <h3 className="text-base font-semibold sm:text-[17px]">{f.q}</h3>
            <ChevronDown className="shrink-0 transition group-open:rotate-180" size={20} aria-hidden />
          </summary>
          <Rich html={f.a} className="pb-4 pr-8 leading-relaxed text-ink/80" />
        </details>
      ))}
    </div>
  );
}

export function ToolCard({ tool }: { tool: Pick<ToolDef, "slug" | "name" | "blurb"> }) {
  return (
    <Link href={`/${tool.slug}`} className="group flex min-h-24 flex-col justify-between rounded-2xl border border-line bg-white p-5 transition hover:border-ink hover:shadow-[4px_4px_0_0_var(--color-ink)]">
      <div>
        <h3 className="text-lg font-semibold leading-snug">{tool.name}</h3>
        <p className="mt-1 text-sm text-muted">{tool.blurb}</p>
      </div>
      <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-accent">
        Open tool <ArrowRight size={15} className="transition group-hover:translate-x-1" aria-hidden />
      </span>
    </Link>
  );
}

export function CtaBand({ heading, body, primary, secondary }: { heading: string; body: string; primary: { href: string; label: string }; secondary?: { href: string; label: string } }) {
  return (
    <section className="bg-ink bg-dots text-bone">
      <div className="container-x py-14 text-center sm:py-20">
        <h2 className="mx-auto max-w-2xl text-3xl font-semibold sm:text-4xl">{heading}</h2>
        <Rich html={body} className="mx-auto mt-3 max-w-xl text-lg text-bone/75" />
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link href={primary.href} className="btn btn-primary btn-lg">
            {primary.label}
          </Link>
          {secondary && (
            <Link href={secondary.href} className="btn btn-outline-light btn-lg">
              {secondary.label}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}

export function Breadcrumbs({ items, dark }: { items: { name: string; href?: string }[]; dark?: boolean }) {
  return (
    <nav aria-label="Breadcrumb" className={cn("text-[13px]", dark ? "text-bone/60" : "text-muted")}>
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((it, i) => (
          <li key={it.name} className="flex items-center gap-1.5">
            {i > 0 && <span aria-hidden>/</span>}
            {it.href ? (
              <Link href={it.href} className="hover:underline">
                {it.name}
              </Link>
            ) : (
              <span aria-current="page" className={dark ? "text-bone" : "text-ink"}>
                {it.name}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
