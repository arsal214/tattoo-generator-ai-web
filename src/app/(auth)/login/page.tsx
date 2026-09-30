import type { Metadata } from "next";
import Link from "next/link";
import { AuthForm } from "@/components/auth/AuthForm";
import { safeNext } from "@/lib/safe-next";

export const metadata: Metadata = { title: "Log in", robots: { index: false, follow: false } };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const next = safeNext((await searchParams).next);
  return (
    <>
      <h1 className="text-3xl font-semibold">Welcome back</h1>
      <p className="mb-6 mt-2 text-muted">Log in to your designs and credits.</p>
      <AuthForm mode="login" next={next} />
      <p className="mt-6 text-center text-sm text-muted">
        New here?{" "}
        <Link href={`/signup?next=${encodeURIComponent(next)}`} className="font-semibold text-accent underline underline-offset-4">
          Get 20 free credits
        </Link>
      </p>
    </>
  );
}
