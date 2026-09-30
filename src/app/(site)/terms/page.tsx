// NOTE: These terms are a starting template based on how the product works today. Have counsel review them before launch.
import Link from "next/link";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbLd, buildMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";

const LEGAL_ENTITY = "[Legal entity name]";
const LAST_UPDATED = "September 24, 2026";

export const metadata = buildMetadata({
  title: "Terms of Service | TattooGenerator.com",
  description:
    "The rules for using TattooGenerator.com: accounts, how credits work, acceptable use, who owns your designs, disclaimers, liability limits and termination.",
  path: "/terms",
});

const toc = [
  ["agreement", "Agreement and eligibility"],
  ["service", "The service"],
  ["accounts", "Accounts"],
  ["credits", "Credits and payments"],
  ["acceptable-use", "Acceptable use"],
  ["ownership", "Ownership of designs"],
  ["concepts", "Designs are concepts"],
  ["disclaimer", "Disclaimer"],
  ["liability", "Limitation of liability"],
  ["termination", "Termination"],
  ["law", "Governing law"],
  ["changes", "Changes and contact"],
] as const;

export default function TermsPage() {
  return (
    <main className="py-12 sm:py-16">
      <JsonLd data={breadcrumbLd([{ name: "Home", path: "/" }, { name: "Terms of Service", path: "/terms" }])} />
      <div className="container-x max-w-3xl">
        <h1 className="text-4xl font-semibold sm:text-5xl">Terms of Service</h1>
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
          <section id="agreement" className="scroll-mt-24">
            <h2>Agreement and eligibility</h2>
            <p>
              These terms are an agreement between you and {LEGAL_ENTITY} (&ldquo;we&rdquo;, &ldquo;us&rdquo;) for your
              use of {SITE.name}. By using the site or creating an account, you agree to them and to our{" "}
              <Link href="/privacy-policy">Privacy Policy</Link>. You must be at least 18 years old. If you do not
              agree, do not use the service.
            </p>
          </section>

          <section id="service" className="scroll-mt-24">
            <h2>The service</h2>
            <p>
              {SITE.name} provides tools for exploring tattoo ideas, including an AI design generator, lettering and
              symbol tools and planning tools. Some features are free and some require credits. We may change, add or
              remove features at any time.
            </p>
          </section>

          <section id="accounts" className="scroll-mt-24">
            <h2>Accounts</h2>
            <p>
              You are responsible for the accuracy of your account information, for keeping your password secure and for
              activity under your account. Tell us promptly if you think your account has been accessed without
              permission. One person may not use the service through multiple accounts to get around limits.
            </p>
          </section>

          <section id="credits" className="scroll-mt-24">
            <h2>Credits and payments</h2>
            <ul>
              <li>New accounts receive 20 free credits. One credit is used for each generation.</li>
              <li>If a generation fails, the credit is automatically refunded to your balance.</li>
              <li>Additional credits can be bought as described on the <Link href="/pricing">pricing page</Link>.</li>
              <li>Credits have no cash value, cannot be transferred and are not redeemable for money except where the law requires.</li>
              <li>Usage is limited by your credit balance and by rate limits. There is no unlimited usage.</li>
              <li>
                Payments are processed by a third-party payment processor, and we do not store your card number. Prices
                are shown in US dollars at checkout and may change for future purchases.
              </li>
            </ul>
            <p>
              If you have a billing problem, contact us through the <Link href="/contact">contact form</Link> and choose
              Billing.
            </p>
          </section>

          <section id="acceptable-use" className="scroll-mt-24">
            <h2>Acceptable use</h2>
            <p>You agree not to use the service to create, upload or request content that is:</p>
            <ul>
              <li>illegal, or that promotes illegal activity;</li>
              <li>hateful, harassing or that promotes violence against people or groups;</li>
              <li>sexually explicit;</li>
              <li>infringing on someone else&rsquo;s copyright, trademark or other rights, or depicting a real person without permission.</li>
            </ul>
            <p>
              You also agree not to attempt to abuse the service, including by scraping, reverse engineering, automating
              requests beyond normal use, bypassing credit or rate limits, probing for vulnerabilities or overloading our
              systems. We may remove content and limit or suspend access if we believe these rules are broken.
            </p>
          </section>

          <section id="ownership" className="scroll-mt-24">
            <h2>Ownership of designs</h2>
            <p>
              As between you and us, you own the designs you generate, to the extent permitted by law. You grant us a
              limited license to store, process and display them as needed to run the service for you. You are
              responsible for your prompts and for making sure your use of a design does not infringe anyone&rsquo;s
              rights.
            </p>
            <p>
              AI-generated outputs may not be eligible for copyright protection in some jurisdictions, and similar
              designs may be produced for other users. This is a general statement, not legal advice. The site itself,
              including its software, text and branding, belongs to us or our licensors.
            </p>
          </section>

          <section id="concepts" className="scroll-mt-24">
            <h2>Designs are concepts</h2>
            <p>
              Generated and planned designs are concepts and inspiration, not finished tattoo artwork and not a
              guarantee of any result. How a tattoo turns out depends on the artist, your skin, the placement and many
              other factors. Always consult a licensed tattoo artist before getting a tattoo. Nothing on the site is
              medical or health advice.
            </p>
          </section>

          <section id="disclaimer" className="scroll-mt-24">
            <h2>Disclaimer</h2>
            <p>
              The service is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo; without warranties of any
              kind, express or implied, including merchantability, fitness for a particular purpose and
              non-infringement. AI output can be inaccurate, unexpected or contain errors, including in text and
              details. We do not promise the service will be uninterrupted or error-free.
            </p>
          </section>

          <section id="liability" className="scroll-mt-24">
            <h2>Limitation of liability</h2>
            <p>
              To the fullest extent permitted by law, {LEGAL_ENTITY} and its owners, employees and suppliers are not
              liable for indirect, incidental, special, consequential or punitive damages, or for lost profits, data or
              goodwill, arising from your use of the service. This includes any decision to get a tattoo. Our total
              liability for any claim is limited to the greater of the amount you paid us in the 12 months before the
              claim or $100. Some jurisdictions do not allow certain limits, so parts of this section may not apply to
              you.
            </p>
          </section>

          <section id="termination" className="scroll-mt-24">
            <h2>Termination</h2>
            <p>
              You can stop using the service or ask us to delete your account at any time. We may suspend or end your
              access if you break these terms, misuse the service or where required by law. Sections that by their
              nature should survive termination, such as ownership, disclaimers and liability limits, will survive.
            </p>
          </section>

          <section id="law" className="scroll-mt-24">
            <h2>Governing law</h2>
            <p>
              These terms are governed by the laws of [State], United States, without regard to conflict-of-law rules.
              Disputes will be handled in the state or federal courts located in [County, State], and you consent to
              that jurisdiction, unless applicable law requires otherwise.
            </p>
          </section>

          <section id="changes" className="scroll-mt-24">
            <h2>Changes and contact</h2>
            <p>
              We may update these terms. The date at the top shows the latest version, and continued use after a change
              means you accept it. Questions? Email <a href={`mailto:${SITE.email}`}>{SITE.email}</a> or use the{" "}
              <Link href="/contact">contact form</Link>.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
