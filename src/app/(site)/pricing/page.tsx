import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs, CtaBand, FaqList, Rich, SectionHeading } from "@/components/marketing/Sections";
import { CONFIG_PLANS, PlanCards } from "@/components/pricing/PlanCards";
import { getContent } from "@/lib/content";
import { breadcrumbLd, buildMetadata, faqLd } from "@/lib/seo";
import { getPlans, toPublicPlan } from "@/lib/services/plans";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const c = await getContent("pricing");
  return buildMetadata({ title: c.metaTitle, description: c.metaDescription, path: "/pricing" });
}

async function loadPlans() {
  try {
    const plans = (await getPlans()).map(toPublicPlan);
    return plans.length ? plans : CONFIG_PLANS;
  } catch {
    return CONFIG_PLANS;
  }
}

export default async function PricingPage() {
  const c = await getContent("pricing");
  const plans = process.env.MONGODB_URI ? await loadPlans() : CONFIG_PLANS;
  return (
    <main>
      <JsonLd
        data={[
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Pricing", path: "/pricing" },
          ]),
          faqLd(c.faq),
        ]}
      />
      <section className="bg-ink bg-dots pb-20 pt-8 text-bone sm:pb-24 sm:pt-10">
        <div className="container-x">
          <Breadcrumbs dark items={[{ name: "Home", href: "/" }, { name: "Pricing" }]} />
          <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-[1.08] sm:text-5xl">{c.heroTitle}</h1>
          <Rich html={c.heroBody} className="mt-5 max-w-2xl text-lg text-bone/80" />
        </div>
      </section>

      <section className="container-x -mt-12 pb-16 sm:-mt-14" aria-label="Plans">
        <PlanCards plans={plans} from="pricing_page" />
        <p className="mt-6 text-center text-sm text-muted">{c.note}</p>
      </section>

      <section className="section container-x" aria-labelledby="faq">
        <SectionHeading id="faq" eyebrow="FAQ" title={c.faqTitle} />
        <div className="max-w-3xl">
          <FaqList faq={c.faq} />
        </div>
      </section>

      <CtaBand heading={c.ctaHeading} body={c.ctaBody} primary={{ href: "/signup", label: c.ctaPrimary }} secondary={{ href: "/tattoo-generator", label: c.ctaSecondary }} />
    </main>
  );
}
