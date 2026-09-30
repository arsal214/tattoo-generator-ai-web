import type { Types } from "mongoose";
import { connectDB } from "../db/connect";
import { AnalyticsEvent } from "../db/models/Misc";

export const ANALYTICS_EVENTS = [
  "signup",
  "login",
  "generator_opened",
  "generation_started",
  "generation_success",
  "generation_failed",
  "credit_consumed",
  "upgrade_clicked",
  "payment_started",
  "payment_completed",
  "download",
  "favorite",
] as const;
export type AnalyticsEventName = (typeof ANALYTICS_EVENTS)[number];

/** Fire-and-forget: analytics must never block or break the product. */
export function trackServer(name: AnalyticsEventName, userId?: Types.ObjectId | string, props?: Record<string, string | number | boolean>) {
  void (async () => {
    try {
      await connectDB();
      await AnalyticsEvent.create({ name, userId, props });
    } catch (e) {
      console.warn("[analytics] dropped event", name, (e as Error).message);
    }
  })();
}
