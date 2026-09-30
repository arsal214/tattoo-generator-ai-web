import "server-only";
import { NextResponse, type NextRequest } from "next/server";
import { ZodError, type ZodType } from "zod";
import { AppError, err } from "./errors";
import { connectDB } from "./db/connect";
import { requireAdmin, requireUser } from "./auth/session";
import { clientIp, enforce, type LimitRule } from "./rate-limit";
import type { UserDoc } from "./db/models/User";
import { SITE } from "./site";

type Params = Record<string, string>;

interface Ctx<P extends Params> {
  req: NextRequest;
  params: P;
  /** Set when `auth` is true. */
  user: UserDoc;
}

interface Options {
  /** Require a logged-in user. */
  auth?: boolean;
  admin?: boolean;
  /** Rate limits; "user" rules only apply when authenticated. */
  limits?: (Omit<LimitRule, "by"> & { by?: LimitRule["by"] })[];
  /** Skip the same-origin check (webhooks authenticate by signature instead). */
  skipOriginCheck?: boolean;
}

const json = (body: unknown, status = 200, headers?: HeadersInit) => NextResponse.json(body, { status, headers });

/** Blocks cross-site state-changing requests (CSRF) on top of SameSite=Lax cookies. */
function assertSameOrigin(req: NextRequest) {
  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) return;
  const origin = req.headers.get("origin");
  if (!origin) return; // non-browser client; browsers always send Origin on cross-site POST
  const allowed = new Set([new URL(SITE.url).host, req.headers.get("host"), req.headers.get("x-forwarded-host")]);
  if (!allowed.has(new URL(origin).host)) throw err.forbidden("Cross-site request blocked.");
}

export const errorResponse = (e: unknown) => {
  if (e instanceof AppError) {
    const headers = e.code === "RATE_LIMITED" ? { "Retry-After": String((e.details as { retryAfter: number }).retryAfter) } : undefined;
    return json({ error: { code: e.code, message: e.message, ...(e.code === "VALIDATION" && e.details ? { details: e.details } : {}) } }, e.status, headers);
  }
  if (e instanceof ZodError) {
    return json({ error: { code: "VALIDATION", message: e.issues[0]?.message ?? "Invalid request.", details: e.issues.map((i) => ({ path: i.path.join("."), message: i.message })) } }, 400);
  }
  // Never leak internals: log server-side, return a generic message.
  console.error("[api] unhandled error", e);
  return json({ error: { code: "INTERNAL", message: "Something went wrong. Please try again." } }, 500);
};

/**
 * Wraps a route handler with: same-origin check, auth, rate limiting, DB connection and
 * consistent error formatting. Handlers return plain objects (→ 200 JSON) or a Response.
 */
export function api<P extends Params = Params>(handler: (ctx: Ctx<P>) => Promise<Response | object>, opts: Options = {}) {
  return async (req: NextRequest, routeCtx: { params: Promise<P> }) => {
    try {
      if (!opts.skipOriginCheck) assertSameOrigin(req);
      await connectDB();
      const user = opts.admin ? await requireAdmin() : opts.auth ? await requireUser() : (undefined as unknown as UserDoc);
      for (const rule of opts.limits ?? []) {
        const by = rule.by ?? "ip";
        if (by === "user" && !user) continue;
        await enforce({ ...rule, by }, by === "user" ? String(user._id) : clientIp(req));
      }
      const result = await handler({ req, params: await routeCtx.params, user });
      return result instanceof Response ? result : json(result);
    } catch (e) {
      return errorResponse(e);
    }
  };
}

/** Parses and validates a JSON body with zod. Rejects non-JSON content types. */
export async function parseBody<T>(req: NextRequest, schema: ZodType<T>): Promise<T> {
  if (!req.headers.get("content-type")?.includes("application/json")) throw err.validation("Expected a JSON request body.");
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    throw err.validation("Request body is not valid JSON.");
  }
  return schema.parse(raw);
}
