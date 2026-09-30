import { z } from "zod";
import { api, parseBody } from "@/lib/api";
import { ContactMessage } from "@/lib/db/models/Misc";
import { clientIp } from "@/lib/rate-limit";
import { sendEmail } from "@/lib/services/email";
import { SITE } from "@/lib/site";

const schema = z.object({
  name: z.string().trim().min(1, "Please enter your name.").max(100),
  email: z.string().trim().toLowerCase().pipe(z.email("Please enter a valid email address.")),
  subject: z.string().trim().max(100).default("General"),
  message: z.string().trim().min(10, "Please write at least a few words.").max(4000),
  website: z.string().max(200).optional(), // honeypot: real users leave this empty
});

export const POST = api(
  async ({ req }) => {
    const { website, ...data } = await parseBody(req, schema);
    if (website) return { ok: true }; // silently drop bots
    await ContactMessage.create({ ...data, ip: clientIp(req) });
    await sendEmail({ to: SITE.email, subject: `[Contact] ${data.subject} – ${data.name}`, text: `From: ${data.name} <${data.email}>\n\n${data.message}`, html: `<pre>${data.message.replace(/</g, "&lt;")}</pre>` }).catch(() => {});
    return { ok: true };
  },
  { limits: [{ name: "contact", max: 5, windowSec: 3600 }] },
);
