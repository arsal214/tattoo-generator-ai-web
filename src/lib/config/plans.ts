export interface PlanConfig {
  id: "free" | "creator" | "pro";
  name: string;
  /** Price in whole USD. */
  price: number;
  credits: number;
  currency: "usd";
  features: string[];
  highlight?: boolean;
}

export const PLANS: PlanConfig[] = [
  { id: "free", name: "Free", price: 0, credits: 20, currency: "usd", features: ["20 AI image generation credits", "Basic tattoo generator", "Save generated designs", "Generation history"] },
  { id: "creator", name: "Creator", price: 9, credits: 80, currency: "usd", highlight: true, features: ["80 AI generations", "Save designs", "Generation history", "Higher usage limits", "Premium generation experience"] },
  { id: "pro", name: "Pro", price: 50, credits: 500, currency: "usd", features: ["500 AI generations", "Save designs", "Generation history", "Higher usage limits", "Priority generation", "Premium tools"] },
];

export const PAID_PLAN_IDS = ["creator", "pro"] as const;
export const LOW_CREDITS = 5;
