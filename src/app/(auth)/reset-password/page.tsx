import type { Metadata } from "next";
import Link from "next/link";
import { AuthForm } from "@/components/auth/AuthForm";

export const metadata: Metadata = { title: "Choose a new password", robots: { index: false, follow: false } };

export default async function ResetPasswordPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const token = (await searchParams).token;
  if (!token || !/^[0-9a-f]{64}$/.test(token)) {
    return (
      <>
        <h1 className="text-3xl font-semibold">Link not valid</h1>
        <p className="mb-6 mt-2 text-muted">This password reset link is missing or malformed. Request a new one and try again.</p>
        <Link href="/forgot-password" className="btn btn-primary">Request a new link</Link>
      </>
    );
  }
  return (
    <>
      <h1 className="text-3xl font-semibold">Choose a new password</h1>
      <p className="mb-6 mt-2 text-muted">You&apos;ll be signed out on other devices.</p>
      <AuthForm mode="reset" token={token} />
    </>
  );
}
