import type { Metadata } from "next";
import Link from "next/link";
import { CheckoutNotice } from "@/components/dashboard/CheckoutNotice";
import { CreditBadge } from "@/components/generator/CreditBadge";
import { requireUserOrRedirect } from "@/lib/auth/session";
import { connectDB } from "@/lib/db/connect";
import { CreditTransaction } from "@/lib/db/models/CreditTransaction";
import { Payment } from "@/lib/db/models/Payment";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Credits" };

const TYPE_LABEL: Record<string, string> = { signup_bonus: "Signup bonus", generation: "Tattoo generation", refund: "Refund", purchase: "Plan purchase", admin_adjustment: "Adjustment" };

export default async function CreditsPage({ searchParams }: { searchParams: Promise<{ checkout?: string }> }) {
  const user = await requireUserOrRedirect("/dashboard/credits");
  const checkout = (await searchParams).checkout === "success";
  await connectDB();
  const [txs, payments] = await Promise.all([
    CreditTransaction.find({ userId: user._id }).sort({ createdAt: -1 }).limit(50).lean(),
    Payment.find({ userId: user._id }).sort({ createdAt: -1 }).limit(10).lean(),
  ]);
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold sm:text-4xl">Credits</h1>
        <p className="mt-1 text-muted">1 credit = 1 AI tattoo generation. Failed generations are refunded automatically.</p>
      </div>
      {checkout && <CheckoutNotice startCredits={user.credits} />}
      <div className="card flex flex-wrap items-center justify-between gap-4 p-6">
        <div>
          <p className="text-sm font-medium text-muted">Current balance</p>
          <CreditBadge credits={user.credits} className="mt-2 !min-h-11 text-lg" />
          {user.credits === 0 && <p className="mt-3 font-semibold text-accent-dark">You&apos;re out of credits.</p>}
        </div>
        <Link href="/dashboard/pricing" className="btn btn-primary">
          {user.credits === 0 ? "View Plans" : "Get more credits"}
        </Link>
      </div>

      <section aria-labelledby="ledger">
        <h2 id="ledger" className="mb-3 text-2xl font-semibold">
          Credit activity
        </h2>
        {txs.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-ink/25 bg-white p-8 text-center text-muted">No credit activity yet.</p>
        ) : (
          <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-white">
            {txs.map((t) => (
              <li key={String(t._id)} className="flex items-center justify-between gap-4 p-4">
                <div>
                  <p className="font-medium">{TYPE_LABEL[t.type] ?? t.type}</p>
                  <p className="text-[13px] text-muted">{formatDate(t.createdAt)}</p>
                </div>
                <div className="text-right">
                  <p className={t.amount > 0 ? "font-semibold text-good" : "font-semibold"}>
                    {t.amount > 0 ? "+" : ""}
                    {t.amount}
                  </p>
                  <p className="text-[13px] text-muted">Balance {t.balanceAfter}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {payments.length > 0 && (
        <section aria-labelledby="payments">
          <h2 id="payments" className="mb-3 text-2xl font-semibold">
            Payments
          </h2>
          <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-white">
            {payments.map((p) => (
              <li key={String(p._id)} className="flex items-center justify-between gap-4 p-4">
                <div>
                  <p className="font-medium capitalize">{p.planId} plan</p>
                  <p className="text-[13px] text-muted">{formatDate(p.createdAt)}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">${(p.amount / 100).toFixed(2)}</p>
                  <p className="text-[13px] capitalize text-muted">{p.status}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
