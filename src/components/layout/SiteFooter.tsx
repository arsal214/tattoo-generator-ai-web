import Link from "next/link";
import { TOOLS } from "@/lib/tools/registry";
import { BLOG_CATEGORIES } from "@/lib/config/blog";
import { Logo } from "./Logo";

const FEATURED = ["tattoo-generator", "tattoo-font-generator", "tattoo-name-generator", "tattoo-placement-guide", "tattoo-size-calculator", "tattoo-stencil-maker"];

export function SiteFooter() {
  const featured = FEATURED.map((s) => TOOLS.find((t) => t.slug === s)).filter((t) => t !== undefined);
  return (
    <footer className="bg-ink text-bone/80">
      <div className="container-x grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Logo light />
          <p className="mt-4 max-w-xs text-sm leading-relaxed">
            Explore tattoo ideas, lettering and placement before you sit down with a professional artist. Designs are concepts and inspiration, not a substitute for a consultation.
          </p>
        </div>
        <FooterCol title="Popular tools">
          {featured.map((t) => (
            <FooterLink key={t.slug} href={`/${t.slug}`}>
              {t.name}
            </FooterLink>
          ))}
        </FooterCol>
        <FooterCol title="Styles & symbols">
          {TOOLS.filter((t) => t.category === "styles" || ["roman-numeral-tattoo-generator", "zodiac-tattoo-generator", "coordinates-tattoo-generator"].includes(t.slug)).map((t) => (
            <FooterLink key={t.slug} href={`/${t.slug}`}>
              {t.name}
            </FooterLink>
          ))}
          <FooterLink href="/pricing">Pricing</FooterLink>
        </FooterCol>
        <FooterCol title="Learn & company">
          <FooterLink href="/blog">Blog</FooterLink>
          {BLOG_CATEGORIES.slice(0, 3).map((c) => (
            <FooterLink key={c.slug} href={`/blog/category/${c.slug}`}>
              {c.name}
            </FooterLink>
          ))}
          <FooterLink href="/about">About</FooterLink>
          <FooterLink href="/contact">Contact</FooterLink>
        </FooterCol>
      </div>
      <div className="border-t border-bone/10">
        <div className="container-x py-6">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-bone">Every tattoo tool</p>
          <ul className="flex flex-wrap gap-x-4 gap-y-1 text-[13px]">
            {TOOLS.map((t) => (
              <li key={t.slug}>
                <Link href={`/${t.slug}`} className="inline-flex min-h-8 items-center hover:text-bone">
                  {t.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-bone/10">
        <div className="container-x flex flex-col items-start justify-between gap-3 py-6 text-[13px] sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} TattooGenerator.com. All rights reserved.</p>
          <nav className="flex flex-wrap gap-x-5 gap-y-1" aria-label="Legal">
            <Link href="/privacy-policy" className="hover:text-bone">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-bone">
              Terms
            </Link>
            <Link href="/cookie-policy" className="hover:text-bone">
              Cookies
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-bone">{title}</p>
      <ul className="space-y-1.5 text-sm">{children}</ul>
    </div>
  );
}
const FooterLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <li>
    <Link href={href} className="inline-flex min-h-8 items-center hover:text-bone">
      {children}
    </Link>
  </li>
);
