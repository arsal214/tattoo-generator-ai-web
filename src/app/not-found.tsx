import Link from "next/link";
import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";

export const metadata: Metadata = { title: "Page not found", robots: { index: false, follow: false } };

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="container-x flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
        <p className="font-display text-7xl font-semibold text-accent sm:text-8xl">404</p>
        <h1 className="mt-4 text-3xl font-semibold sm:text-4xl">Looks like this tattoo idea got lost.</h1>
        <p className="mt-3 max-w-md text-lg text-muted">The page you&apos;re after doesn&apos;t exist or has moved. Let&apos;s get you back to designing.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/tattoo-generator" className="btn btn-primary btn-lg">
            Generate a Tattoo
          </Link>
          <Link href="/tattoo-font-generator" className="btn btn-outline btn-lg">
            Explore Tattoo Tools
          </Link>
          <Link href="/" className="btn btn-ghost btn-lg">
            Go Home
          </Link>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
