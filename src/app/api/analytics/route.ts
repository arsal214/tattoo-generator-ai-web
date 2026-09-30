import { z } from "zod";
import { api, parseBody } from "@/lib/api";
import { getSessionUser } from "@/lib/auth/session";
import { ANALYTICS_EVENTS, trackServer } from "@/lib/services/analytics";

const schema = z.object({
  name: z.enum(ANALYTICS_EVENTS),
  props: z.record(z.string().max(40), z.union([z.string().max(100), z.number(), z.boolean()])).optional(),
});

// Client-side product events. Always answers 204-ish success; failures are swallowed so analytics never blocks UX.
export const POST = api(
  async ({ req }) => {
    const { name, props } = await parseBody(req, schema);
    const user = await getSessionUser();
    trackServer(name, user?._id, props);
    return { ok: true };
  },
  { limits: [{ name: "analytics", max: 120, windowSec: 60 }] },
);
