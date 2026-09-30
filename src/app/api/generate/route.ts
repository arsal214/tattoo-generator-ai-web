import { api, parseBody } from "@/lib/api";
import { generateSchema, generateTattoo } from "@/lib/services/generation";
import { getBalance } from "@/lib/services/credits";

export const maxDuration = 60; // image generation can take a while

export const POST = api(
  async ({ req, user }) => {
    const input = await parseBody(req, generateSchema);
    // user id comes from the session, never from the request body.
    const { generation, replayed } = await generateTattoo(user._id, input);
    return { generation, replayed, credits: await getBalance(user._id) };
  },
  {
    auth: true,
    limits: [
      { name: "gen-min", max: 8, windowSec: 60, by: "user" },
      { name: "gen-hour", max: 100, windowSec: 3600, by: "user" },
      { name: "gen-ip", max: 30, windowSec: 60, by: "ip" },
    ],
  },
);
