"use client";

import Link from "next/link";
import { useEffect } from "react";

// Error boundary: never shows stack traces or internal details.
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <main className="container-x flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <h1 className="text-3xl font-semibold sm:text-4xl">Something went wrong</h1>
      <p className="mt-3 max-w-md text-lg text-muted">An unexpected error occurred. You can try again, or head back to the homepage.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button type="button" onClick={reset} className="btn btn-primary btn-lg">
          Try again
        </button>
        <Link href="/" className="btn btn-outline btn-lg">
          Go Home
        </Link>
      </div>
    </main>
  );
}
