// NOTE: This policy is a starting template based on how the product works today. Have counsel review it before launch.
import Link from "next/link";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbLd, buildMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";

const LEGAL_ENTITY = "[Legal entity name]";
const LAST_UPDATED = "September 24, 2026";

export const metadata = buildMetadata({
  title: "Cookie Policy | TattooGenerator.com",
  description:
    "See which cookies TattooGenerator.com uses: one essential session cookie to keep you signed in, plus optional analytics that only run when configured.",
  path: "/cookie-policy",
});

const toc = [
  ["what-are-cookies", "What cookies are"],
  ["essential", "Essential session cookie"],
  ["analytics", "Optional analytics"],
  ["managing", "Managing cookies"],
  ["changes", "Changes and contact"],
] as const;

export default function CookiePolicyPage() {
  return (
    <main className="py-12 sm:py-16">
      <JsonLd data={breadcrumbLd([{ name: "Home", path: "/" }, { name: "Cookie Policy", path: "/cookie-policy" }])} />
      <div className="container-x max-w-3xl">
        <h1 className="text-4xl font-semibold sm:text-5xl">Cookie Policy</h1>
        <p className="mt-3 text-sm text-muted">Last updated: {LAST_UPDATED}</p>

        <nav aria-label="Table of contents" className="card mt-8 p-5">
          <p className="label">On this page</p>
          <ol className="grid gap-x-6 gap-y-1.5 text-[15px] sm:grid-cols-2">
            {toc.map(([id, label], i) => (
              <li key={id}>
                <a href={`#${id}`} className="text-accent underline-offset-4 hover:underline">
                  {i + 1}. {label}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="prose-tg">
          <section id="what-are-cookies" className="scroll-mt-24">
            <h2>What cookies are</h2>
            <p>
              Cookies are small text files a website stores in your browser. {LEGAL_ENTITY} uses as few as possible on{" "}
              {SITE.name}. This page lists what we use and why.
            </p>
          </section>

          <section id="essential" className="scroll-mt-24">
            <h2>Essential session cookie</h2>
            <p>
              When you sign in, we set a single session cookie so the site knows who you are as you move between pages.
              It is marked httpOnly, which means scripts running in your browser cannot read it. Without it you could not
              stay signed in, so it is strictly necessary and does not require consent. It is not used for advertising.
            </p>
          </section>

          <section id="analytics" className="scroll-mt-24">
            <h2>Optional analytics</h2>
            <p>
              The site supports an optional analytics setup. It is only active if it has been configured for the site.
              When it is active, it helps us understand which pages and tools are used so we can improve them. Separately
              from cookies, we record product events on our own servers, such as account signups and generations, as
              described in the <Link href="/privacy-policy">Privacy Policy</Link>.
            </p>
            <p>We do not use advertising or cross-site tracking cookies.</p>
          </section>

          <section id="managing" className="scroll-mt-24">
            <h2>Managing cookies</h2>
            <p>
              You can block or delete cookies in your browser settings. If you block the session cookie, you will not be
              able to sign in, but the free tools that do not need an account should still work. Some browsers also
              offer a Global Privacy Control or similar signal; you can enable it in your browser if you would like.
            </p>
          </section>

          <section id="changes" className="scroll-mt-24">
            <h2>Changes and contact</h2>
            <p>
              If we add new cookies or trackers we will update this page and the date above. Questions? Email{" "}
              <a href={`mailto:${SITE.email}`}>{SITE.email}</a> or use the <Link href="/contact">contact form</Link>.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
