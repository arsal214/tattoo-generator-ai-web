import Link from "next/link";
import { Check } from "lucide-react";
import { PLANS } from "@/lib/config/plans";
import type { PublicPlan } from "@/lib/services/plans";
import { cn } from "@/lib/utils";
import { PlanButton } from "./PlanButton";

/** Static fallback so pricing renders even if the database is unreachable at build/render time. */
export const CONFIG_PLANS: PublicPlan[] = PLANS.map((p) => ({ key: p.id, name: p.name, price: p.price, credits: p.credits, currency: p.currency, features: p.features }));

export function PlanCards({ plans = CONFIG_PLANS, currentPlan, from }: { plans?: PublicPlan[]; currentPlan?: string; from: string }) {
  return (
    <div className="grid gap-5 md:grid-cols-3">
      {plans.map((p) => {
        const highlight = p.key === "creator";
        return (
          <div key={p.key} className={cn("relative flex flex-col rounded-3xl border p-6 sm:p-7", highlight ? "border-ink bg-ink text-bone shadow-[6px_6px_0_0_var(--color-accent)]" : "border-line bg-white")}>
            {highlight && <span className="absolute -top-3 left-6 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-white">Most popular</span>}
            <h3 className="text-xl font-semibold">{p.name}</h3>
            <p className="mt-4 flex items-baseline gap-1">
              <span className="font-display text-5xl font-semibold">${p.price}</span>
              <span className={highlight ? "text-bone/60" : "text-muted"}>{p.price === 0 ? "to start" : "one-time"}</span>
            </p>
            <p className="mt-2 text-lg font-semibold">{p.credits} credits</p>
            <p className={cn("text-sm", highlight ? "text-bone/70" : "text-muted")}>= {p.credits} AI tattoo generations</p>
            <ul className="my-6 space-y-2.5 text-[15px]">
              {p.features.map((f) => (
                <li key={f} className="flex gap-2.5">
                  <Check size={18} className={cn("mt-0.5 shrink-0", highlight ? "text-accent" : "text-good")} aria-hidden />
                  {f}
                </li>
              ))}
            </ul>
            <div className="mt-auto">
              {p.key === "free" ? (
                <Link href={currentPlan ? "/dashboard/generate" : "/signup"} className={cn("btn w-full", highlight ? "btn-primary" : "btn-dark")}>
                  {currentPlan ? "Start generating" : "Get 20 free credits"}
                </Link>
              ) : (
                <PlanButton planId={p.key} label={`Get ${p.credits} credits`} from={from} highlight={highlight} />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
