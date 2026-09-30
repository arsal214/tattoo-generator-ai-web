"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useUser } from "@/components/UserProvider";

const MAX_TRIES = 15;

/**
 * Shown after returning from checkout. The redirect itself proves nothing: credits are only added when the
 * payment provider webhook is verified server-side, so this polls the real balance for up to ~45 seconds.
 */
export function CheckoutNotice({ startCredits }: { startCredits: number }) {
  const { user, refresh } = useUser();
  const router = useRouter();
  const [tries, setTries] = useState(0);
  const done = (user?.credits ?? startCredits) > startCredits;

  useEffect(() => {
    if (done) {
      router.refresh();
      return;
    }
    if (tries >= MAX_TRIES) return;
    const t = setTimeout(async () => {
      await refresh();
      setTries((n) => n + 1);
    }, 3000);
    return () => clearTimeout(t);
  }, [done, tries, refresh, router]);

  if (done) {
    return (
      <p role="status" className="flex items-center gap-2 rounded-xl bg-good/10 px-4 py-3 font-medium text-good">
        <CheckCircle2 size={18} aria-hidden /> Payment confirmed. Your credits have been added.
      </p>
    );
  }
  return (
    <p role="status" className="flex items-center gap-2 rounded-xl bg-bone px-4 py-3 text-sm">
      {tries < MAX_TRIES && <Loader2 className="animate-spin" size={16} aria-hidden />}
      {tries < MAX_TRIES
        ? "Confirming your payment. Credits appear as soon as it is verified."
        : "Still waiting for payment confirmation. If you were charged, your credits will appear shortly. Contact us if they do not."}
    </p>
  );
}
