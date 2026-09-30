import { Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export function CreditBadge({ credits, className }: { credits: number; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex min-h-8 items-center gap-1.5 rounded-full px-3 text-[13px] font-semibold",
        credits === 0 ? "bg-accent-soft text-accent-dark" : "bg-ink text-bone",
        className,
      )}
      aria-label={`${credits} credits remaining`}
    >
      <Zap size={14} aria-hidden className={credits === 0 ? "" : "fill-current"} />
      {credits} {credits === 1 ? "Credit" : "Credits"}
    </span>
  );
}
