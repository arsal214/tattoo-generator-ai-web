import Link from "next/link";

export function Logo({ light }: { light?: boolean }) {
  return (
    <Link href="/" className={`flex min-h-11 items-center gap-2 ${light ? "text-bone" : "text-ink"}`} aria-label="TattooGenerator.com home">
      {/* needle-and-drop mark */}
      <svg width="26" height="26" viewBox="0 0 32 32" aria-hidden fill="none">
        <path d="M16 3c4.6 5.7 8 9.6 8 14a8 8 0 1 1-16 0c0-4.4 3.4-8.3 8-14Z" fill="var(--color-accent)" />
        <path d="M16 12v15" stroke={light ? "#f4efe4" : "#0e0e11"} strokeWidth="2" strokeLinecap="round" />
      </svg>
      <span className="font-display text-[19px] font-semibold tracking-tight">
        Tattoo<span className="text-accent">Generator</span>
      </span>
    </Link>
  );
}
