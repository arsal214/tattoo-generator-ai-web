"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { useUser } from "@/components/UserProvider";
import { CreditBadge } from "@/components/generator/CreditBadge";
import { Logo } from "./Logo";

export interface NavGroup {
  name: string;
  links: { name: string; href: string }[];
}

export function Header({ groups }: { groups: NavGroup[] }) {
  const { user, loading } = useUser();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/90 backdrop-blur">
      <div className="container-x flex h-16 items-center justify-between gap-4">
        <Logo />

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          <div className="group relative">
            <button type="button" className="btn btn-ghost btn-sm" aria-haspopup="true">
              Tattoo Tools <ChevronDown size={14} aria-hidden />
            </button>
            <div className="invisible absolute left-1/2 top-full w-[760px] -translate-x-1/2 pt-2 opacity-0 transition group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
              <div className="grid grid-cols-3 gap-6 rounded-2xl border border-line bg-white p-6 shadow-xl">
                {groups.map((g) => (
                  <div key={g.name}>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-accent">{g.name}</p>
                    <ul className="space-y-1">
                      {g.links.map((l) => (
                        <li key={l.href}>
                          <Link href={l.href} className="block rounded-md py-1 text-[14px] hover:text-accent">
                            {l.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <Link href="/tattoo-font-generator" className="btn btn-ghost btn-sm">
            Font Generator
          </Link>
          <Link href="/blog" className="btn btn-ghost btn-sm">
            Blog
          </Link>
          <Link href="/pricing" className="btn btn-ghost btn-sm">
            Pricing
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Link href="/dashboard/credits" className="hidden sm:block" aria-label="Your credits">
                <CreditBadge credits={user.credits} />
              </Link>
              <Link href="/dashboard" className="btn btn-dark btn-sm">
                Dashboard
              </Link>
            </>
          ) : (
            !loading && (
              <>
                <Link href="/login" className="btn btn-ghost btn-sm hidden sm:inline-flex">
                  Log in
                </Link>
                <Link href="/signup" className="btn btn-primary btn-sm">
                  Sign up free
                </Link>
              </>
            )
          )}
          <button type="button" className="btn btn-outline !min-h-11 !min-w-11 !px-0 lg:hidden" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen((o) => !o)}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="fixed inset-x-0 bottom-0 top-16 z-50 overflow-y-auto overscroll-contain bg-paper lg:hidden">
          <nav className="container-x space-y-6 py-6" aria-label="Mobile">
            <ul className="space-y-1 text-lg font-semibold">
              <li>
                <Link href="/pricing" className="flex min-h-12 items-center">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/blog" className="flex min-h-12 items-center">
                  Blog
                </Link>
              </li>
              {!user && !loading && (
                <li>
                  <Link href="/login" className="flex min-h-12 items-center">
                    Log in
                  </Link>
                </li>
              )}
            </ul>
            {groups.map((g) => (
              <div key={g.name}>
                <p className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-accent">{g.name}</p>
                <ul>
                  {g.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="flex min-h-11 items-center text-[16px]">
                        {l.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
