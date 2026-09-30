import { connectDB } from "./db/connect";
import { RateLimit } from "./db/models/Misc";
import { err } from "./errors";

export interface LimitRule {
  /** Namespace, e.g. "login". */
  name: string;
  max: number;
  windowSec: number;
  /** Identify callers by IP or by authenticated user id. */
  by: "ip" | "user";
}

/**
 * Fixed-window limiter backed by MongoDB (one atomic upsert per check) so it holds across
 * serverless instances. Throws a 429 AppError when exceeded.
 */
export async function enforce(rule: LimitRule, id: string) {
  await connectDB();
  const windowMs = rule.windowSec * 1000;
  const bucket = Math.floor(Date.now() / windowMs);
  const doc = await RateLimit.findOneAndUpdate(
    { key: `${rule.name}:${id}:${bucket}` },
    { $inc: { count: 1 }, $setOnInsert: { expiresAt: new Date((bucket + 1) * windowMs + 60_000) } },
    { upsert: true, returnDocument: "after" },
  ).lean();
  if (doc && doc.count > rule.max) throw err.rateLimited(Math.ceil(((bucket + 1) * windowMs - Date.now()) / 1000));
}

export function clientIp(req: Request): string {
  // ponytail: trusts the first X-Forwarded-For hop; put the app behind a proxy that overwrites it (Vercel/Cloudflare do).
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
}
