"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { offices } from "@/content/contacts";
import { chatLink } from "@/lib/whatsapp";
import { WhatsAppIcon } from "./icons";

/** Sticky bottom bar on phones: WhatsApp (country picker) + Wholesale pricing. */
export function MobileBar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const sheet = useRef<HTMLDivElement>(null);
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (open) sheet.current?.querySelector("a")?.focus();
  }, [open]);

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 md:hidden">
      {open && (
        <div
          ref={sheet}
          id="wa-sheet"
          role="dialog"
          aria-label="Chat with a country team"
          className="mx-3 mb-2 rounded-2xl bg-white p-3 text-ink shadow-2xl ring-1 ring-black/5"
          onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
        >
          <p className="px-2 pb-2 text-sm font-semibold">Chat with our team in…</p>
          <ul className="grid gap-1">
            {offices.map((o) => {
              const l = chatLink(o);
              return (
                <li key={o.countryCode}>
                  <a href={l.href} target="_blank" rel="noopener" className="flex min-h-12 items-center justify-between rounded-xl px-3 hover:bg-cream">
                    <span className="font-semibold">{o.country}</span>
                    <span className="text-sm text-ink/70">
                      {l.kind === "whatsapp" ? "WhatsApp" : "Call"} {l.number}
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      )}
      <div className="flex gap-2 border-t border-black/10 bg-white/95 p-2 backdrop-blur">
        <button
          type="button"
          aria-expanded={open}
          aria-controls="wa-sheet"
          onClick={() => setOpen((v) => !v)}
          className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full bg-[#0B6E4F] px-2 text-[15px] font-semibold text-white"
        >
          <WhatsAppIcon className="size-5" /> WhatsApp
        </button>
        {pathname !== "/wholesale" && (
          <Link href="/wholesale" className="flex min-h-12 flex-1 items-center justify-center whitespace-nowrap rounded-full bg-ink px-2 text-[15px] font-semibold text-white">
            Wholesale pricing
          </Link>
        )}
      </div>
    </div>
  );
}
