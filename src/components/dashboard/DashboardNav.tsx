"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CreditCard, History, Image as ImageIcon, LayoutDashboard, LogOut, Menu, Settings, Sparkles, Tag, X } from "lucide-react";
import { CreditBadge } from "@/components/generator/CreditBadge";
import { Logo } from "@/components/layout/Logo";
import { useUser } from "@/components/UserProvider";
import { apiFetch } from "@/lib/client/api";
import { cn } from "@/lib/utils";

const ITEMS = [
  { href: "/dashboard", label: "Overview", Icon: LayoutDashboard, exact: true },
  { href: "/dashboard/generate", label: "Generate", Icon: Sparkles },
  { href: "/dashboard/designs", label: "My Designs", Icon: ImageIcon },
  { href: "/dashboard/history", label: "Generation History", Icon: History },
  { href: "/dashboard/credits", label: "Credits", Icon: CreditCard },
  { href: "/dashboard/pricing", label: "Pricing", Icon: Tag },
  { href: "/dashboard/settings", label: "Account Settings", Icon: Settings },
];

export function DashboardNav({ name, initialCredits }: { name: string; initialCredits: number }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, refresh } = useUser();
  const [open, setOpen] = useState(false);
  const credits = user?.credits ?? initialCredits;

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  async function logout() {
    await apiFetch("/api/auth/logout", { method: "POST", body: {} }).catch(() => {});
    await refresh();
    router.push("/");
    router.refresh();
  }

  const links = (
    <ul className="space-y-1">
      {ITEMS.map(({ href, label, Icon, exact }) => {
        const active = exact ? pathname === href : pathname.startsWith(href);
        return (
          <li key={href}>
            <Link href={href} aria-current={active ? "page" : undefined} className={cn("flex min-h-11 items-center gap-3 rounded-xl px-3 text-[15px] font-medium transition", active ? "bg-ink text-bone" : "hover:bg-ink/5")}>
              <Icon size={18} aria-hidden /> {label}
            </Link>
          </li>
        );
      })}
    </ul>
  );

  const account = (
    <div className="space-y-3 border-t border-line pt-4">
      <p className="truncate px-3 text-sm text-muted">Signed in as {name}</p>
      <button type="button" onClick={logout} className="flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-[15px] font-medium hover:bg-ink/5">
        <LogOut size={18} aria-hidden /> Log out
      </button>
    </div>
  );

  return (
    <>
      {/* desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col justify-between border-r border-line bg-white p-4 lg:flex">
        <div className="space-y-6">
          <Logo />
          <Link href="/dashboard/credits" className="block" aria-label="Your credits">
            <CreditBadge credits={credits} className="w-full justify-center !min-h-10" />
          </Link>
          <nav aria-label="Dashboard">{links}</nav>
        </div>
        {account}
      </aside>

      {/* mobile top bar */}
      <div className="sticky top-0 z-40 flex h-16 items-center justify-between gap-3 border-b border-line bg-white/95 px-4 backdrop-blur lg:hidden">
        <Logo />
        <div className="flex items-center gap-2">
          <Link href="/dashboard/credits" aria-label="Your credits">
            <CreditBadge credits={credits} />
          </Link>
          <button type="button" className="btn btn-outline !min-h-11 !min-w-11 !px-0" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen((o) => !o)}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
      {open && (
        <div className="fixed inset-x-0 bottom-0 top-16 z-50 flex flex-col justify-between overflow-y-auto bg-white p-4 lg:hidden">
          <nav aria-label="Dashboard mobile">{links}</nav>
          {account}
        </div>
      )}
    </>
  );
}
