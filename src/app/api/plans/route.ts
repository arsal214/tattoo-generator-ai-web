import { api } from "@/lib/api";
import { getPlans, toPublicPlan } from "@/lib/services/plans";

export const GET = api(async () => ({ plans: (await getPlans()).map(toPublicPlan), creditsPerGeneration: 1 }), {
  limits: [{ name: "plans", max: 120, windowSec: 60 }],
});
