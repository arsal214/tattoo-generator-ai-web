import Link from "next/link";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbLd, buildMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";

export const metadata = buildMetadata({
  title: "About TattooGenerator.com | Tattoo Design Tools",
  description:
    "TattooGenerator.com helps you explore tattoo concepts, lettering and placement ideas online before you sit down with a professional tattoo artist.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <main className="py-12 sm:py-16">
      <JsonLd data={breadcrumbLd([{ name: "Home", path: "/" }, { name: "About", path: "/about" }])} />
      <div className="container-x max-w-3xl">
        <h1 className="text-4xl font-semibold sm:text-5xl">About {SITE.name}</h1>
        <p className="mt-4 text-lg leading-8 text-muted">
          We build free and low-cost tools that help you figure out what you want tattooed, where it should go and how it
          might look, so the conversation with your tattoo artist starts from a real idea instead of a blank page.
        </p>

        <div className="prose-tg mt-6">
          <h2>Concepts first, artist always</h2>
          <p>
            A tattoo is permanent, and getting it right takes a skilled human. Everything you generate here is meant as
            inspiration: a concept, a reference, a starting sketch. It is not a finished, tattoo-ready design and it is
            not a substitute for a consultation.
          </p>
          <p>
            A professional artist knows how a design will sit on skin, how it will age, what linework and shading will
            hold up, and what suits your body. Bring your concepts to them, expect changes, and let them have the final
            say on the drawing.
          </p>

          <h2>What we build</h2>
          <ul>
            <li>
              <strong>AI tattoo generator.</strong> Describe an idea, choose a style, placement and color mode, and get
              concept images. Start with the <Link href="/tattoo-generator">tattoo generator</Link>, or narrow it down
              with the <Link href="/minimalist-tattoo-generator">minimalist</Link>,{" "}
              <Link href="/fine-line-tattoo-generator">fine line</Link> and{" "}
              <Link href="/traditional-tattoo-generator">traditional</Link> style pages.
            </li>
            <li>
              <strong>Lettering and font tools.</strong> Preview names, words and quotes in tattoo-style scripts using
              the <Link href="/tattoo-font-generator">tattoo font generator</Link>, then compare{" "}
              <Link href="/gothic-tattoo-generator">gothic</Link> and{" "}
              <Link href="/old-english-tattoo-generator">Old English</Link> looks.
            </li>
            <li>
              <strong>Symbols and details.</strong> Roman numerals, dates, initials, coordinates and zodiac ideas, all
              formatted for tattoo use.
            </li>
            <li>
              <strong>Planning tools.</strong> Estimate proportions with the{" "}
              <Link href="/tattoo-size-calculator">size calculator</Link>, browse the{" "}
              <Link href="/tattoo-placement-guide">placement guide</Link>, and try ideas on a body outline with the{" "}
              <Link href="/tattoo-placement-visualizer">placement visualizer</Link>.
            </li>
          </ul>

          <h2>How credits work</h2>
          <p>
            The lettering, symbol and planning tools are free to use. AI generation runs on credits. When you create an
            account you get 20 free credits, and one credit equals one generation. If you need more, you can buy credit
            packs on the <Link href="/pricing">pricing page</Link>. The Terms of Service cover the details, including
            what happens when a generation fails.
          </p>

          <h2>How we think about quality</h2>
          <p>
            AI image models are good at atmosphere and composition and less reliable at fine detail, exact text and
            anatomy. We shape prompts and options around tattoo conventions, such as bold outlines, clear negative space
            and placement-aware framing, and we would rather tell you a result is a concept than oversell it.
          </p>
          <p>
            We keep the site focused on tattoos: design, lettering, symbols, styles and planning. If a tool is not
            useful for someone planning a tattoo, it does not belong here. Our{" "}
            <Link href="/blog">blog</Link> covers the same topics in more depth.
          </p>

          <h2>Who it is for</h2>
          <p>
            {SITE.name} is intended for adults planning their own tattoos, whether that is a first small piece or the
            next addition to a collection. Tattoos are age-restricted in most of the United States, and our service is
            not for anyone under 18.
          </p>

          <h2>Get in touch</h2>
          <p>
            Questions, bug reports or partnership ideas? Use the <Link href="/contact">contact form</Link> or email{" "}
            <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
          </p>
        </div>
      </div>
    </main>
  );
}
