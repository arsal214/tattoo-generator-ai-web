import Link from "next/link";
import ContactForm from "@/components/ContactForm";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbLd, buildMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";

export const metadata = buildMetadata({
  title: "Contact TattooGenerator.com | Support and Feedback",
  description:
    "Contact the TattooGenerator.com team about billing, bugs, copyright concerns, partnerships or general questions. We reply to every message by email.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <main className="py-12 sm:py-16">
      <JsonLd data={breadcrumbLd([{ name: "Home", path: "/" }, { name: "Contact", path: "/contact" }])} />
      <div className="container-x max-w-3xl">
        <h1 className="text-4xl font-semibold sm:text-5xl">Contact us</h1>
        <p className="mt-4 text-lg leading-8 text-muted">
          Have a question, a bug to report or a billing issue? Send us a message and we will reply by email.
        </p>

        <div className="mt-8">
          <ContactForm />
        </div>

        <div className="prose-tg mt-10">
          <h2>Other ways to reach us</h2>
          <p>
            You can also email <a href={`mailto:${SITE.email}`}>{SITE.email}</a>. For privacy requests such as access or
            deletion of your data, pick General as the subject and say what you need. See the{" "}
            <Link href="/privacy-policy">privacy policy</Link> for details.
          </p>
          <p>
            For copyright or content concerns, choose Content/Copyright and include a link to the page or design in
            question. Looking for how credits work first? Check the <Link href="/pricing">pricing page</Link>.
          </p>
          <p>
            We cannot give tattoo consultations, medical advice or aftercare guidance. For those, talk to a licensed
            tattoo artist or a healthcare professional.
          </p>
        </div>
      </div>
    </main>
  );
}
