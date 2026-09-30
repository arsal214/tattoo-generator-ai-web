import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs, CtaBand, FaqList, SectionHeading } from "@/components/marketing/Sections";
import { CONFIG_PLANS, PlanCards } from "@/components/pricing/PlanCards";
import { breadcrumbLd, buildMetadata, faqLd } from "@/lib/seo";
import { getPlans, toPublicPlan } from "@/lib/services/plans";

export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: "Tattoo Generator Pricing – Free Credits & Plans",
  description: "Start with 20 free credits. Need more? Creator is $9 for 80 AI tattoo generations and Pro is $50 for 500. 1 credit equals 1 generation.",
  path: "/pricing",
});

const FAQ = [
  { q: "What is a credit?", a: "One credit pays for one AI tattoo generation. Every account starts with 20 free credits, and you can add more with the Creator or Pro plan." },
  { q: "Is anything unlimited?", a: "No. Each plan includes a fixed number of credits, and each generation uses one. The font, lettering, symbol, size and placement tools are free to use and don't use credits." },
  { q: "What happens if a generation fails?", a: "If an image can't be generated, your credit is refunded automatically and you'll see a message explaining what happened." },
  { q: "Do I need a card to start?", a: "No. Your 20 free credits are added at signup with no payment details. You only pay if you choose a paid plan." },
  { q: "How are payments handled?", a: "Checkout is handled by our payment processor, so your card details never touch our servers. Credits are added after the payment is confirmed." },
  { q: "Can I download and keep my designs?", a: "Yes. Every design you generate is saved to your account, and you can download the image at any time. Treat designs as inspiration to bring to a professional tattoo artist." },
];

async function loadPlans() {
  try {
    const plans = (await getPlans()).map(toPublicPlan);
    return plans.length ? plans : CONFIG_PLANS;
  } catch {
    return CONFIG_PLANS;
  }
}

export default async function PricingPage() {
  const plans = process.env.MONGODB_URI ? await loadPlans() : CONFIG_PLANS;
  return (
    <main>
      <JsonLd
        data={[
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Pricing", path: "/pricing" },
          ]),
          faqLd(FAQ),
        ]}
      />
      <section className="bg-ink bg-dots pb-20 pt-8 text-bone sm:pb-24 sm:pt-10">
        <div className="container-x">
          <Breadcrumbs dark items={[{ name: "Home", href: "/" }, { name: "Pricing" }]} />
          <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-[1.08] sm:text-5xl">Simple credit pricing for tattoo designs</h1>
          <p className="mt-5 max-w-2xl text-lg text-bone/80">
            Start free with 20 credits. <strong className="text-bone">1 credit = 1 AI tattoo generation.</strong> Add more when you need them — no subscriptions to cancel, no surprises.
          </p>
        </div>
      </section>

      <section className="container-x -mt-12 pb-16 sm:-mt-14" aria-label="Plans">
        <PlanCards plans={plans} from="pricing_page" />
        <p className="mt-6 text-center text-sm text-muted">Prices in USD. Credits are added to your account once payment is confirmed.</p>
      </section>

      <section className="section container-x" aria-labelledby="faq">
        <SectionHeading id="faq" eyebrow="FAQ" title="Questions about credits and plans" />
        <div className="max-w-3xl">
          <FaqList faq={FAQ} />
        </div>
      </section>

      <CtaBand heading="Try it before you decide" body="Create an account, claim your 20 free credits and generate your first tattoo design in under a minute." primary={{ href: "/signup", label: "Get 20 free credits" }} secondary={{ href: "/tattoo-generator", label: "See the generator" }} />
    </main>
  );
}
