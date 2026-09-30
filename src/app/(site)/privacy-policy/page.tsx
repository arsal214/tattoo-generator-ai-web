// NOTE: This policy is a starting template based on how the product works today. Have counsel review it before launch.
import Link from "next/link";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbLd, buildMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";

const LEGAL_ENTITY = "[Legal entity name]";
const LAST_UPDATED = "September 24, 2026";

export const metadata = buildMetadata({
  title: "Privacy Policy | TattooGenerator.com",
  description:
    "How TattooGenerator.com collects, uses and protects your account details, prompts, generated designs and payment records, plus your privacy choices and rights.",
  path: "/privacy-policy",
});

const toc = [
  ["who-we-are", "Who we are"],
  ["what-we-collect", "Information we collect"],
  ["how-we-use", "How we use information"],
  ["service-providers", "Service providers"],
  ["cookies", "Cookies and analytics"],
  ["retention", "Retention"],
  ["your-rights", "Your rights and choices"],
  ["california", "California notice"],
  ["children", "Children"],
  ["security", "Security"],
  ["changes", "Changes and contact"],
] as const;

export default function PrivacyPolicyPage() {
  return (
    <main className="py-12 sm:py-16">
      <JsonLd data={breadcrumbLd([{ name: "Home", path: "/" }, { name: "Privacy Policy", path: "/privacy-policy" }])} />
      <div className="container-x max-w-3xl">
        <h1 className="text-4xl font-semibold sm:text-5xl">Privacy Policy</h1>
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
          <section id="who-we-are" className="scroll-mt-24">
            <h2>Who we are</h2>
            <p>
              {SITE.name} is operated by {LEGAL_ENTITY} (&ldquo;we&rdquo;, &ldquo;us&rdquo;). This policy explains what
              personal information we collect when you use our website and tools, why we collect it and what you can do
              about it. Our service is aimed at users in the United States.
            </p>
          </section>

          <section id="what-we-collect" className="scroll-mt-24">
            <h2>Information we collect</h2>
            <ul>
              <li>
                <strong>Account information.</strong> Your email address, your name and your password. Passwords are
                stored only as a salted hash, never in readable form.
              </li>
              <li>
                <strong>Generations.</strong> The prompts and options you enter (style, placement, size, color) and the
                images generated for you, which are stored under your account so you can find them later.
              </li>
              <li>
                <strong>Credits and payment records.</strong> Your credit balance, credit history and a record of your
                purchases. Payments are handled by a third-party payment processor. We do not receive or store your
                card number.
              </li>
              <li>
                <strong>Usage analytics events.</strong> Product events such as signing up or creating a generation, so
                we can understand what works and fix what does not.
              </li>
              <li>
                <strong>IP address and technical data.</strong> Your IP address and basic request information, used for
                security, fraud prevention and rate limiting.
              </li>
              <li>
                <strong>Messages you send us.</strong> If you use the contact form, we keep your name, email address and
                message so we can respond.
              </li>
            </ul>
            <p>
              Free lettering, symbol and planning tools generally run in your browser. Text you type into them is not
              needed to use the tools and is not stored on your account unless a tool says otherwise.
            </p>
          </section>

          <section id="how-we-use" className="scroll-mt-24">
            <h2>How we use information</h2>
            <ul>
              <li>To create and secure your account and sign you in.</li>
              <li>To generate designs, deliver results and keep your history.</li>
              <li>To manage credits, process purchases and issue refunds of credits for failed generations.</li>
              <li>To send transactional email such as account and receipt messages.</li>
              <li>To prevent abuse, enforce our <Link href="/terms">Terms of Service</Link> and keep the service stable.</li>
              <li>To understand product usage and improve the service.</li>
              <li>To respond to your messages and requests.</li>
            </ul>
            <p>We do not sell your personal information.</p>
          </section>

          <section id="service-providers" className="scroll-mt-24">
            <h2>Service providers</h2>
            <p>
              We share information with companies that help us run the service. They may only use it to provide their
              services to us. By category:
            </p>
            <ul>
              <li>
                <strong>AI model provider.</strong> Your prompts and any images needed to produce a design are sent to
                Google Gemini so it can generate the result. Do not include personal information or content you do not
                want processed this way in your prompts.
              </li>
              <li><strong>Database hosting.</strong> Stores account, credit and generation records.</li>
              <li><strong>Image storage.</strong> Stores the images generated under your account.</li>
              <li><strong>Payment processing.</strong> Handles checkout and card data.</li>
              <li><strong>Transactional email.</strong> Delivers account and receipt emails.</li>
            </ul>
            <p>
              We may also disclose information if required by law, to protect rights and safety, or as part of a
              business transfer such as a merger or acquisition.
            </p>
          </section>

          <section id="cookies" className="scroll-mt-24">
            <h2>Cookies and analytics</h2>
            <p>
              We use a single essential session cookie (httpOnly) to keep you signed in. An optional analytics setup is
              only active if it is configured for the site. See our <Link href="/cookie-policy">Cookie Policy</Link> for
              details.
            </p>
          </section>

          <section id="retention" className="scroll-mt-24">
            <h2>Retention</h2>
            <p>
              We keep account, generation and credit records for as long as your account is open and as needed to
              provide the service. Payment and transaction records may be kept longer where needed for tax, accounting
              or legal reasons. Security logs are kept for a limited period. When you ask us to delete your account, we
              delete or de-identify your personal information, except what we must keep by law or for legitimate
              purposes such as preventing fraud.
            </p>
          </section>

          <section id="your-rights" className="scroll-mt-24">
            <h2>Your rights and choices</h2>
            <p>You can ask us to:</p>
            <ul>
              <li>give you a copy of the personal information we hold about you (access);</li>
              <li>correct information that is wrong;</li>
              <li>delete your account and associated data (deletion).</li>
            </ul>
            <p>
              To make a request, use the <Link href="/contact">contact form</Link> or email{" "}
              <a href={`mailto:${SITE.email}`}>{SITE.email}</a> from the address on your account. We may need to verify
              your identity first. You can also opt out of marketing email, if we send any, using the link in the
              message.
            </p>
          </section>

          <section id="california" className="scroll-mt-24">
            <h2>California notice</h2>
            <p>
              If you live in California, you may have the right to know what personal information we collect, to
              request access to or deletion of it, to correct it and not to be treated differently for exercising these
              rights. In the past 12 months we have collected the categories described above (identifiers such as email
              and IP address, commercial information such as purchases, and content you provide such as prompts). We do
              not sell or share personal information for cross-context behavioral advertising. Submit requests as
              described in &ldquo;Your rights and choices&rdquo;.
            </p>
          </section>

          <section id="children" className="scroll-mt-24">
            <h2>Children</h2>
            <p>
              Tattoos are age-restricted and {SITE.name} is intended for adults. It is not for anyone under 18, and we
              do not knowingly collect information from children. If you believe a child has given us information,
              contact us and we will delete it.
            </p>
          </section>

          <section id="security" className="scroll-mt-24">
            <h2>Security</h2>
            <p>
              We use reasonable technical and organizational measures to protect your information, including hashed
              passwords and access controls. No system is perfectly secure, so we cannot guarantee absolute security.
            </p>
          </section>

          <section id="changes" className="scroll-mt-24">
            <h2>Changes and contact</h2>
            <p>
              We may update this policy from time to time. The date at the top shows when it last changed, and we will
              give more notice for material changes. Questions? Email <a href={`mailto:${SITE.email}`}>{SITE.email}</a>{" "}
              or use the <Link href="/contact">contact form</Link>.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
