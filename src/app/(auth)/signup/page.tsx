import type { Metadata } from "next";
import Link from "next/link";
import { AuthForm } from "@/components/auth/AuthForm";
import { safeNext } from "@/lib/safe-next";

export const metadata: Metadata = { title: "Sign up free", robots: { index: false, follow: false } };

export default async function SignupPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const next = safeNext((await searchParams).next);
  return (
    <>
      <h1 className="text-3xl font-semibold">Create your free account</h1>
      <p className="mb-6 mt-2 text-muted">Get 20 free credits to generate tattoo designs. No card required.</p>
      <AuthForm mode="signup" next={next} />
      <p className="mt-6 text-center text-sm text-muted">
        Already have an account?{" "}
        <Link href={`/login?next=${encodeURIComponent(next)}`} className="font-semibold text-accent underline underline-offset-4">
          Log in
        </Link>
      </p>
    </>
  );
}
