import { api } from "@/lib/api";
import { CreditTransaction } from "@/lib/db/models/CreditTransaction";
import { Payment } from "@/lib/db/models/Payment";
import { LOW_CREDITS } from "@/lib/config/plans";

export const GET = api(
  async ({ user }) => {
    const [transactions, payments] = await Promise.all([
      CreditTransaction.find({ userId: user._id }).sort({ createdAt: -1 }).limit(50).lean(),
      Payment.find({ userId: user._id }).sort({ createdAt: -1 }).limit(20).lean(),
    ]);
    return {
      credits: user.credits,
      plan: user.plan,
      low: user.credits <= LOW_CREDITS,
      transactions: transactions.map((t) => ({ type: t.type, amount: t.amount, balanceAfter: t.balanceAfter, description: t.description ?? null, createdAt: t.createdAt.toISOString() })),
      payments: payments.map((p) => ({ id: String(p._id), plan: p.planId, amount: p.amount, currency: p.currency, status: p.status, createdAt: p.createdAt.toISOString() })),
    };
  },
  { auth: true, limits: [{ name: "credits", max: 60, windowSec: 60, by: "user" }] },
);
