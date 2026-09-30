import { env } from "../env";

/** Sends a transactional email through Resend. Without RESEND_API_KEY it logs to the console (development only). */
export async function sendEmail({ to, subject, html, text }: { to: string; subject: string; html: string; text: string }) {
  const { RESEND_API_KEY, EMAIL_FROM } = env();
  if (!RESEND_API_KEY) {
    if (process.env.NODE_ENV === "production") console.error("[email] RESEND_API_KEY is not set; email not sent");
    else console.log(`\n[email:dev] to=${to}\nsubject=${subject}\n${text}\n`);
    return;
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: EMAIL_FROM, to, subject, html, text }),
  });
  if (!res.ok) console.error("[email] send failed", res.status);
}
