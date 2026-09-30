import { connectDB } from "../db/connect";
import { Plan } from "../db/models/Plan";
import { PLANS } from "../config/plans";

/**
 * Plans live in MongoDB (so admins can change price/credits later) and are upserted from config on first use,
 * so the site works even before `npm run seed` has been run.
 */
export async function getPlans() {
  await connectDB();
  if ((await Plan.estimatedDocumentCount()) === 0) await seedPlans();
  return Plan.find({ active: true }).sort({ sortOrder: 1 }).lean();
}

export async function getPlan(key: string) {
  await connectDB();
  return Plan.findOne({ key, active: true }).lean();
}

export async function seedPlans() {
  await Plan.bulkWrite(
    PLANS.map((p, i) => ({
      updateOne: {
        filter: { key: p.id },
        update: { $setOnInsert: { key: p.id, name: p.name, price: p.price, credits: p.credits, currency: p.currency, features: p.features, active: true, sortOrder: i } },
        upsert: true,
      },
    })),
  );
}

export type PublicPlan = { key: string; name: string; price: number; credits: number; currency: string; features: string[] };
export const toPublicPlan = (p: { key: string; name: string; price: number; credits: number; currency?: string | null; features: string[] }): PublicPlan => ({
  key: p.key,
  name: p.name,
  price: p.price,
  credits: p.credits,
  currency: p.currency ?? "usd",
  features: p.features,
});
