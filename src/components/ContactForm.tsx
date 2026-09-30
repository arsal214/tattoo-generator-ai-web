"use client";

import { useState } from "react";
import { toast } from "sonner";

const SUBJECTS = ["General", "Billing", "Bug report", "Content/Copyright", "Partnership"] as const;
const MAX = 4000;

export default function ContactForm() {
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<{ ok: boolean; text: string } | null>(null);
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    setBusy(true);
    setStatus(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: String(fd.get("name") ?? "").trim(),
          email: String(fd.get("email") ?? "").trim(),
          subject: String(fd.get("subject") ?? ""),
          message: String(fd.get("message") ?? "").trim(),
          website: String(fd.get("website") ?? ""),
        }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.ok) {
        throw new Error(data?.error?.message ?? "Something went wrong. Please try again.");
      }
      form.reset();
      setMessage("");
      setStatus({ ok: true, text: "Thanks, your message was sent. We will reply by email." });
      toast.success("Message sent");
    } catch (err) {
      const text = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setStatus({ ok: false, text });
      toast.error(text);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="card space-y-4 p-5 sm:p-6" noValidate={false}>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="cf-name" className="label">Name</label>
          <input id="cf-name" name="name" className="input" required maxLength={100} autoComplete="name" disabled={busy} />
        </div>
        <div>
          <label htmlFor="cf-email" className="label">Email</label>
          <input id="cf-email" name="email" type="email" className="input" required maxLength={254} autoComplete="email" disabled={busy} />
        </div>
      </div>
      <div>
        <label htmlFor="cf-subject" className="label">Subject</label>
        <select id="cf-subject" name="subject" className="input" defaultValue="General" disabled={busy}>
          {SUBJECTS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="cf-message" className="label">Message</label>
        <textarea
          id="cf-message"
          name="message"
          className="input min-h-40"
          required
          minLength={10}
          maxLength={MAX}
          rows={7}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={busy}
        />
        <p className="mt-1 text-right text-xs text-muted">{message.length}/{MAX}</p>
      </div>

      {/* Honeypot: hidden from people and assistive tech; bots fill it in. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="cf-website">Website</label>
        <input id="cf-website" name="website" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>

      <div aria-live="polite">
        {status && (
          <p
            role={status.ok ? "status" : "alert"}
            className={`rounded-xl px-3.5 py-2.5 text-sm ${status.ok ? "bg-good/10 text-good" : "bg-accent-soft text-accent-dark"}`}
          >
            {status.text}
          </p>
        )}
      </div>

      <button type="submit" className="btn btn-primary w-full sm:w-auto" disabled={busy}>
        {busy ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
