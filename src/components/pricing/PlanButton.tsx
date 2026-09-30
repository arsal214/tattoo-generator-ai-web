"use client";

import Link from "next/link";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useUser } from "@/components/UserProvider";
import { apiFetch, track } from "@/lib/client/api";
import { cn } from "@/lib/utils";

/** Starts a checkout for a paid plan. The server decides price and credits; we only send the plan key. */
export function PlanButton({ planId, label, from, highlight }: { planId: string; label: string; from: string; highlight?: boolean }) {
  const { user, loading } = useUser();
  const [busy, setBusy] = useState(false);
  const cls = cn("btn w-full", highlight ? "btn-primary" : "btn-dark");

  if (!user && !loading) {
    return (
      <Link href={`/signup?next=${encodeURIComponent("/dashboard/pricing")}`} className={cls} onClick={() => track("upgrade_clicked", { plan: planId, from })}>
        Sign up to buy
      </Link>
    );
  }

  return (
    <button
      type="button"
      className={cls}
      disabled={busy || loading}
      onClick={async () => {
        track("upgrade_clicked", { plan: planId, from });
        setBusy(true);
        try {
          const { url } = await apiFetch<{ url: string }>("/api/payments/create", { body: { planId } });
          window.location.assign(url);
        } catch (e) {
          toast.error((e as Error).message);
          setBusy(false);
        }
      }}
    >
      {busy ? <Loader2 className="animate-spin" size={18} aria-hidden /> : null}
      {busy ? "Redirecting to checkout…" : label}
    </button>
  );
}
