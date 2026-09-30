import type { Metadata } from "next";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { requireUserOrRedirect } from "@/lib/auth/session";

// Private area: never indexed, never cached.
export const metadata: Metadata = { title: "Dashboard", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUserOrRedirect("/dashboard");
  return (
    <div className="min-h-screen bg-bone/40 lg:flex">
      <DashboardNav name={user.name} initialCredits={user.credits} />
      <main className="min-w-0 flex-1 px-4 py-6 sm:px-8 sm:py-10">
        <div className="mx-auto w-full max-w-5xl">{children}</div>
      </main>
    </div>
  );
}
