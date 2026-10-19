import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const NAV = [
  ["/admin", "Overview"],
  ["/admin/content/home", "Home"],
  ["/admin/content/about", "About"],
  ["/admin/content/contact", "Contact"],
  ["/admin/content/pricing", "Pricing page"],
  ["/admin/content/site", "Footer"],
  ["/admin/blog", "Blog"],
  ["/admin/plans", "Plans"],
  ["/admin/users", "Users"],
  ["/admin/messages", "Messages"],
] as const;

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();
  if (!user) redirect("/login?next=/admin");
  if (user.role !== "admin") redirect("/dashboard");
  return (
    <div className="min-h-screen bg-bone/40 lg:flex">
      <aside className="border-b border-line bg-white p-4 lg:w-56 lg:border-b-0 lg:border-r">
        <p className="mb-3 font-display text-lg font-semibold">Admin</p>
        <nav className="flex flex-wrap gap-1 lg:flex-col" aria-label="Admin">
          {NAV.map(([href, label]) => (
            <Link key={href} href={href} className="rounded-lg px-3 py-1.5 text-sm hover:bg-bone">
              {label}
            </Link>
          ))}
          <Link href="/" className="rounded-lg px-3 py-1.5 text-sm text-muted hover:bg-bone">
            ← View site
          </Link>
        </nav>
      </aside>
      <main className="min-w-0 flex-1 px-4 py-6 sm:px-8 sm:py-10">
        <div className="mx-auto w-full max-w-4xl">{children}</div>
      </main>
    </div>
  );
}
