import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/layout/Logo";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-bone/50">
      <div className="container-x flex h-16 items-center">
        <Logo />
      </div>
      <main className="container-x flex flex-1 items-start justify-center pb-16 pt-6 sm:items-center sm:pt-0">
        <div className="w-full max-w-md rounded-3xl border border-line bg-white p-6 shadow-[0_24px_60px_-40px_rgba(14,14,17,0.5)] sm:p-9">{children}</div>
      </main>
      <p className="pb-6 text-center text-xs text-muted">
        <Link href="/privacy-policy" className="underline">Privacy</Link> · <Link href="/terms" className="underline">Terms</Link>
      </p>
    </div>
  );
}
