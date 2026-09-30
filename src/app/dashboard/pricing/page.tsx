import type { Metadata } from "next";
import { CONFIG_PLANS, PlanCards } from "@/components/pricing/PlanCards";
import { requireUserOrRedirect } from "@/lib/auth/session";
import { getPlans, toPublicPlan } from "@/lib/services/plans";

export const metadata: Metadata = { title: "Pricing" };

export default async function DashboardPricingPage() {
  const user = await requireUserOrRedirect("/dashboard/pricing");
  const plans = (await getPlans().catch(() => [])).map(toPublicPlan);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold sm:text-4xl">Pricing</h1>
        <p className="mt-1 text-muted">
          You have {user.credits} credit{user.credits === 1 ? "" : "s"}. 1 credit = 1 AI tattoo generation. Credits are added once your payment is confirmed.
        </p>
      </div>
      <div className="pt-3">
        <PlanCards plans={plans.length ? plans : CONFIG_PLANS} currentPlan={user.plan} from="dashboard" />
      </div>
    </div>
  );
}
