"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { headerCtas, primaryNav } from "@/content/site";
import { Logo } from "./Logo";

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href.split("/").slice(0, 2).join("/")));

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-ink text-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 md:h-[72px] md:px-6">
        <Logo height={48} />
        <nav aria-label="Main" className="hidden flex-1 lg:block">
          <ul className="flex items-center gap-1">
            {primaryNav.map((item) => (
              <li key={item.href} className="group relative">
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className="inline-flex min-h-11 items-center rounded-md px-3 text-[15px] font-medium text-white/85 transition hover:text-white aria-[current=page]:text-chef"
                >
                  {item.label}
                </Link>
                {"children" in item && (
                  <ul className="invisible absolute left-0 top-full min-w-56 rounded-xl bg-white p-2 text-ink opacity-0 shadow-xl transition group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                    {item.children.map((c) => (
                      <li key={c.href}>
                        <Link href={c.href} className="block rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-cream">
                          {c.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>
        <div className="ml-auto hidden items-center gap-2 md:flex">
          <a
            href={headerCtas.secondary.href}
            target="_blank"
            rel="noopener"
            className="inline-flex min-h-11 items-center rounded-full px-4 text-sm font-semibold text-white/90 ring-1 ring-white/30 transition hover:bg-white/10"
          >
            {headerCtas.secondary.label}
            <span aria-hidden className="ml-1">↗</span>
            <span className="sr-only"> (opens bakeshed.rw in a new tab)</span>
          </a>
          <Link
            href={headerCtas.primary.href}
            className="inline-flex min-h-11 items-center rounded-full bg-chef px-5 text-sm font-semibold text-ink transition hover:bg-chef-tint"
          >
            {headerCtas.primary.label}
          </Link>
        </div>
        <button
          type="button"
          className="ml-auto inline-flex size-11 items-center justify-center rounded-lg lg:hidden md:ml-2"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>

      <div id="mobile-menu" hidden={!open} className="fixed inset-x-0 bottom-0 top-16 overflow-y-auto bg-ink px-4 pb-24 pt-4 md:top-[72px] lg:hidden">
        <nav aria-label="Mobile">
          <ul className="divide-y divide-white/10">
            {primaryNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="flex min-h-14 items-center text-lg font-semibold">
                  {item.label}
                </Link>
                {"children" in item && (
                  <ul className="pb-3 pl-4">
                    {item.children.map((c) => (
                      <li key={c.href}>
                        <Link href={c.href} className="flex min-h-11 items-center text-white/80">
                          {c.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
          <div className="mt-6 grid gap-3">
            <Link href={headerCtas.primary.href} className="flex min-h-12 items-center justify-center rounded-full bg-chef font-semibold text-ink">
              {headerCtas.primary.label}
            </Link>
            <a href={headerCtas.secondary.href} target="_blank" rel="noopener" className="flex min-h-12 items-center justify-center rounded-full font-semibold ring-1 ring-white/30">
              {headerCtas.secondary.label} ↗
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
