import type { Metadata } from "next";
import Link from "next/link";
import { AuthForm } from "@/components/auth/AuthForm";

export const metadata: Metadata = { title: "Forgot password", robots: { index: false, follow: false } };

export default function ForgotPasswordPage() {
  return (
    <>
      <h1 className="text-3xl font-semibold">Reset your password</h1>
      <p className="mb-6 mt-2 text-muted">Enter your email and we&apos;ll send you a link to choose a new one.</p>
      <AuthForm mode="forgot" />
      <p className="mt-6 text-center text-sm text-muted">
        <Link href="/login" className="font-semibold text-accent underline underline-offset-4">
          Back to login
        </Link>
      </p>
    </>
  );
}
