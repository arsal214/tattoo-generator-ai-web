"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useUser } from "@/components/UserProvider";
import { apiFetch } from "@/lib/client/api";

type Mode = "login" | "signup" | "forgot" | "reset";

const COPY: Record<Mode, { submit: string; endpoint: string }> = {
  login: { submit: "Log in", endpoint: "/api/auth/login" },
  signup: { submit: "Create free account", endpoint: "/api/auth/register" },
  forgot: { submit: "Send reset link", endpoint: "/api/auth/forgot-password" },
  reset: { submit: "Set new password", endpoint: "/api/auth/reset-password" },
};

export function AuthForm({ mode, next = "/dashboard", token }: { mode: Mode; next?: string; token?: string }) {
  const router = useRouter();
  const { refresh } = useUser();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);
  const [f, setF] = useState({ name: "", email: "", password: "" });
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => setF((s) => ({ ...s, [k]: e.target.value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const body = mode === "signup" ? f : mode === "login" ? { email: f.email, password: f.password } : mode === "forgot" ? { email: f.email } : { token, password: f.password };
      const data = await apiFetch<{ message?: string }>(COPY[mode].endpoint, { body });
      if (mode === "signup" || mode === "login") {
        if (mode === "signup") toast.success(data.message ?? "20 free credits added!", { duration: 6000 });
        await refresh();
        router.push(next);
        router.refresh();
        return; // keep the button disabled while navigating
      }
      setDone(data.message ?? "Done.");
    } catch (err) {
      setError((err as Error).message);
    }
    setBusy(false);
  }

  if (done) {
    return (
      <div role="status" className="rounded-xl bg-bone p-5 text-[15px]">
        <p className="font-semibold">{done}</p>
        {mode === "reset" && (
          <Link href="/login" className="btn btn-primary mt-4">
            Go to login
          </Link>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      {mode === "signup" && (
        <div>
          <label htmlFor="name" className="label">
            Name
          </label>
          <input id="name" className="input" autoComplete="name" required maxLength={80} value={f.name} onChange={set("name")} />
        </div>
      )}
      {mode !== "reset" && (
        <div>
          <label htmlFor="email" className="label">
            Email
          </label>
          <input id="email" type="email" className="input" autoComplete="email" required value={f.email} onChange={set("email")} />
        </div>
      )}
      {mode !== "forgot" && (
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label htmlFor="password" className="label !mb-0">
              {mode === "reset" ? "New password" : "Password"}
            </label>
            {mode === "login" && (
              <Link href="/forgot-password" className="text-[13px] font-medium text-accent underline underline-offset-4">
                Forgot password?
              </Link>
            )}
          </div>
          <input id="password" type="password" className="input" autoComplete={mode === "login" ? "current-password" : "new-password"} required minLength={mode === "login" ? 1 : 8} maxLength={72} value={f.password} onChange={set("password")} />
          {mode !== "login" && <p className="mt-1 text-xs text-muted">At least 8 characters.</p>}
        </div>
      )}
      {error && (
        <p role="alert" className="rounded-xl bg-accent-soft px-4 py-3 text-sm text-accent-dark">
          {error}
        </p>
      )}
      <button type="submit" className="btn btn-primary btn-lg w-full" disabled={busy}>
        {busy && <Loader2 className="animate-spin" size={18} aria-hidden />} {COPY[mode].submit}
      </button>
      {mode === "signup" && <p className="text-center text-xs text-muted">You&apos;ll get 20 free credits instantly. No payment details needed.</p>}
    </form>
  );
}
