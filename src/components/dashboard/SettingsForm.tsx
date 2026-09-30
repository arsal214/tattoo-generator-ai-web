"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useUser } from "@/components/UserProvider";
import { apiFetch } from "@/lib/client/api";

export function SettingsForm({ name: initialName, email }: { name: string; email: string }) {
  const { refresh } = useUser();
  const [name, setName] = useState(initialName);
  const [pw, setPw] = useState({ current: "", next: "" });
  const [busy, setBusy] = useState<"name" | "pw" | null>(null);

  async function save(kind: "name" | "pw", body: object, success: string) {
    setBusy(kind);
    try {
      await apiFetch("/api/user", { method: "PATCH", body });
      toast.success(success);
      if (kind === "pw") setPw({ current: "", next: "" });
      await refresh();
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <form
        className="card space-y-4 p-6"
        onSubmit={(e) => {
          e.preventDefault();
          void save("name", { name }, "Name updated.");
        }}
      >
        <h2 className="text-xl font-semibold">Profile</h2>
        <div>
          <label htmlFor="s-email" className="label">
            Email
          </label>
          <input id="s-email" className="input bg-bone/60" value={email} readOnly aria-readonly />
        </div>
        <div>
          <label htmlFor="s-name" className="label">
            Name
          </label>
          <input id="s-name" className="input" value={name} maxLength={80} required onChange={(e) => setName(e.target.value)} />
        </div>
        <button className="btn btn-dark" disabled={busy !== null || !name.trim() || name === initialName}>
          {busy === "name" && <Loader2 className="animate-spin" size={16} aria-hidden />} Save changes
        </button>
      </form>

      <form
        className="card space-y-4 p-6"
        onSubmit={(e) => {
          e.preventDefault();
          void save("pw", { currentPassword: pw.current, newPassword: pw.next }, "Password changed. Other devices were signed out.");
        }}
      >
        <h2 className="text-xl font-semibold">Change password</h2>
        <div>
          <label htmlFor="s-cur" className="label">
            Current password
          </label>
          <input id="s-cur" type="password" className="input" autoComplete="current-password" required maxLength={72} value={pw.current} onChange={(e) => setPw((s) => ({ ...s, current: e.target.value }))} />
        </div>
        <div>
          <label htmlFor="s-new" className="label">
            New password
          </label>
          <input id="s-new" type="password" className="input" autoComplete="new-password" required minLength={8} maxLength={72} value={pw.next} onChange={(e) => setPw((s) => ({ ...s, next: e.target.value }))} />
          <p className="mt-1 text-xs text-muted">At least 8 characters.</p>
        </div>
        <button className="btn btn-dark" disabled={busy !== null || !pw.current || pw.next.length < 8}>
          {busy === "pw" && <Loader2 className="animate-spin" size={16} aria-hidden />} Update password
        </button>
      </form>
    </div>
  );
}
