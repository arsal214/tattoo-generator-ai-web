"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BookOpen, CreditCard, ExternalLink, Home, Info, LayoutDashboard, LogOut, Mail, Menu, MessageSquare, PanelBottom, Tag, Users, X, type LucideIcon } from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { apiFetch } from "@/lib/client/api";
import { cn } from "@/lib/utils";

const GROUPS: { title: string; items: { href: string; label: string; Icon: LucideIcon; exact?: boolean }[] }[] = [
  { title: "", items: [{ href: "/admin", label: "Overview", Icon: LayoutDashboard, exact: true }] },
  {
    title: "Pages",
    items: [
      { href: "/admin/content/home", label: "Home", Icon: Home },
      { href: "/admin/content/about", label: "About", Icon: Info },
      { href: "/admin/content/contact", label: "Contact", Icon: Mail },
      { href: "/admin/content/pricing", label: "Pricing page", Icon: Tag },
      { href: "/admin/content/site", label: "Footer", Icon: PanelBottom },
    ],
  },
  { title: "Content", items: [{ href: "/admin/blog", label: "Blog posts", Icon: BookOpen }] },
  {
    title: "Business",
    items: [
      { href: "/admin/plans", label: "Plans", Icon: CreditCard },
      { href: "/admin/users", label: "Users", Icon: Users },
      { href: "/admin/messages", label: "Messages", Icon: MessageSquare },
    ],
  },
];

export function AdminNav({ name, email }: { name: string; email: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  async function logout() {
    await apiFetch("/api/auth/logout", { method: "POST", body: {} }).catch(() => {});
    router.push("/login");
    router.refresh();
  }

  const panel = (
    <div className="flex h-full flex-col justify-between gap-6">
      <nav aria-label="Admin" className="space-y-5">
        {GROUPS.map((g) => (
          <div key={g.title || "top"}>
            {g.title && <p className="mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-bone/40">{g.title}</p>}
            <ul className="space-y-0.5">
              {g.items.map(({ href, label, Icon, exact }) => {
                const active = exact ? pathname === href : pathname.startsWith(href);
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      aria-current={active ? "page" : undefined}
                      className={cn("flex min-h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium transition", active ? "bg-accent text-white shadow-sm" : "text-bone/75 hover:bg-bone/10 hover:text-bone")}
                    >
                      <Icon size={17} aria-hidden /> {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
        <Link href="/" target="_blank" className="flex min-h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium text-bone/75 transition hover:bg-bone/10 hover:text-bone">
          <ExternalLink size={17} aria-hidden /> View site
        </Link>
      </nav>

      <div className="space-y-3 border-t border-bone/10 pt-4">
        <div className="flex items-center gap-3 px-1">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent font-semibold text-white" aria-hidden>
            {(name[0] ?? "A").toUpperCase()}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-bone">{name}</p>
            <p className="truncate text-xs text-bone/50">{email}</p>
          </div>
        </div>
        <button type="button" onClick={logout} className="flex min-h-10 w-full items-center justify-center gap-2 rounded-lg border border-bone/20 text-sm font-medium text-bone transition hover:bg-bone/10">
          <LogOut size={16} aria-hidden /> Log out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col overflow-y-auto bg-ink p-4 lg:flex">
        <div className="mb-6 flex items-center justify-between">
          <Logo light />
        </div>
        <span className="mb-5 ml-3 w-fit rounded-full bg-bone/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-widest text-bone/70">Admin</span>
        {panel}
      </aside>

      {/* mobile top bar + drawer */}
      <div className="sticky top-0 z-40 flex h-16 items-center justify-between bg-ink px-4 lg:hidden">
        <Logo light />
        <button type="button" className="flex h-11 w-11 items-center justify-center rounded-lg text-bone hover:bg-bone/10" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen((o) => !o)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      {open && <div className="fixed inset-x-0 bottom-0 top-16 z-50 overflow-y-auto bg-ink p-4 lg:hidden">{panel}</div>}
    </>
  );
}
