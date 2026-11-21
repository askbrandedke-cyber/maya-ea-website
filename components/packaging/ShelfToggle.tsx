"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ConceptTag } from "@/components/concept/ConceptTag";

export interface ShelfItem {
  slug: string;
  name: string;
  href: string;
  code: string;
  category: string;
  family: string;
  concept: string;
  current: string;
}

/** Horizontal shelf: switch between today's packs (bakeshed.rw photos) and the concept system. */
export function ShelfToggle({ items }: { items: ShelfItem[] }) {
  const [view, setView] = useState<"concept" | "current">("concept");
  let lastFamily = "";
  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div role="radiogroup" aria-label="Shelf view" className="inline-flex rounded-full bg-white/10 p-1">
          {(
            [
              ["current", "Today's packs"],
              ["concept", "Concept system"],
            ] as const
          ).map(([v, l]) => (
            <button
              key={v}
              type="button"
              role="radio"
              aria-checked={view === v}
              onClick={() => setView(v)}
              className={`min-h-11 rounded-full px-5 text-sm font-semibold transition ${view === v ? "bg-chef text-ink" : "text-white"}`}
            >
              {l}
            </button>
          ))}
        </div>
        {view === "concept" ? <ConceptTag /> : <span className="text-sm text-white/85">Current pack photos from bakeshed.rw</span>}
      </div>
      <div className="no-scrollbar -mx-4 mt-8 overflow-x-auto px-4 pb-4 md:-mx-6 md:px-6">
        <ul className="flex w-max items-end gap-5" aria-label={view === "concept" ? "Concept packs, one per category" : "Current packs, one per category"}>
          {items.map((it) => {
            const showFamily = it.family !== lastFamily;
            lastFamily = it.family;
            return (
              <li key={it.slug} className="w-36 md:w-44">
                <p className={`mb-2 h-4 text-[11px] font-bold uppercase tracking-[0.18em] text-chef ${showFamily ? "" : "invisible"}`}>{it.family}</p>
                <Link href={it.href} className="group block">
                  <div className="relative flex aspect-[5/7] items-end justify-center">
                    <Image
                      src={view === "concept" ? it.concept : it.current}
                      alt={`${it.name}: ${view === "concept" ? "concept pack" : "current pack photo"}`}
                      fill
                      sizes="176px"
                      className={`transition duration-500 group-hover:-translate-y-1.5 ${view === "concept" ? "rounded-[5px] object-cover shadow-[0_18px_30px_-12px_rgba(0,0,0,.65)]" : "rounded-lg bg-white object-contain p-2"}`}
                    />
                  </div>
                  <span className="mt-3 block text-sm font-semibold text-white">{it.name}</span>
                  <span className="block text-xs text-white/80">
                    {it.code} · {it.category}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
        <div aria-hidden className="mt-1 h-3 w-full min-w-[60rem] rounded-full bg-[#8A7A62]" />
      </div>
    </div>
  );
}
