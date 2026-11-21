"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { categoryBySlug } from "@/content/categories";
import { productBySlug, productPath } from "@/content/products";
import type { CatalogueItem } from "@/content/types";
import { CategoryIcon } from "@/components/site/icons";

/**
 * Product card that flips to show uses + pack size.
 * Desktop: flips on hover. Touch/keyboard: "Details" button toggles (aria-expanded).
 * The hidden face is `inert`, so focus never lands on invisible links.
 * Reduced motion: cross-fade instead of rotation.
 */
export function FlipCard({ item }: { item: CatalogueItem }) {
  const [toggled, setToggled] = useState(false);
  const [hovered, setHovered] = useState(false);
  const flipped = toggled || hovered;
  const c = categoryBySlug[item.category];
  const concept = item.conceptSlug ? productBySlug[item.conceptSlug] : undefined;

  return (
    <article
      className="group relative h-[23rem] [perspective:1200px]"
      onPointerEnter={(e) => e.pointerType === "mouse" && setHovered(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && setHovered(false)}
      aria-label={item.name}
    >
      <div
        className={`relative h-full w-full transition-transform duration-500 ease-out-soft [transform-style:preserve-3d] motion-reduce:transition-none ${
          flipped ? "[transform:rotateY(180deg)] motion-reduce:[transform:none]" : ""
        }`}
      >
        {/* FRONT */}
        <div
          inert={flipped}
          className={`absolute inset-0 flex flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-line [backface-visibility:hidden] motion-reduce:transition-opacity ${
            flipped ? "motion-reduce:opacity-0" : ""
          }`}
        >
          <div className="relative aspect-[4/3] w-full bg-white">
            {item.image ? (
              <Image src={item.image} alt={`${item.name}: current pack photo`} fill sizes="(min-width: 1280px) 22vw, (min-width: 640px) 45vw, 90vw" className="object-contain p-3" />
            ) : (
              <div className="flex h-full items-center justify-center text-ink/40">No photo</div>
            )}
            <span className="absolute left-2.5 top-2.5 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold" style={{ background: c.colour, color: c.ink }}>
              <CategoryIcon name={c.icon} className="size-3.5" strokeWidth={9} />
              {c.code} · {c.name}
            </span>
          </div>
          <div className="flex flex-1 flex-col p-4">
            <h3 className="line-clamp-2 font-semibold leading-snug">{item.name}</h3>
            {item.pack && <p className="mt-1 text-sm text-ink/75">Pack: {item.pack}</p>}
            <div className="mt-auto flex items-center justify-between gap-2 pt-3">
              <span className="flex flex-wrap gap-1.5">
                {concept && <span className="rounded-full bg-chef px-2 py-0.5 text-[11px] font-bold text-ink">Concept pack</span>}
                {item.partner && <span className="rounded-full bg-cream px-2 py-0.5 text-[11px] font-semibold text-ink/80">Partner brand: {item.partner}</span>}
              </span>
              <button
                type="button"
                onClick={() => setToggled(true)}
                aria-expanded={flipped}
                className="min-h-11 shrink-0 rounded-full px-3 text-sm font-semibold text-navy ring-1 ring-navy/25 hover:bg-cream"
              >
                Details<span className="sr-only"> for {item.name}</span>
              </button>
            </div>
          </div>
        </div>

        {/* BACK */}
        <div
          inert={!flipped}
          className={`absolute inset-0 flex flex-col rounded-2xl p-5 [backface-visibility:hidden] [transform:rotateY(180deg)] motion-reduce:[transform:none] motion-reduce:transition-opacity ${
            flipped ? "" : "motion-reduce:opacity-0"
          }`}
          style={{ background: c.colour, color: c.ink }}
        >
          <div className="flex items-start justify-between gap-3">
            <p className="text-xs font-bold tracking-wider">
              {c.code} · {c.name.toUpperCase()}
            </p>
            <CategoryIcon name={c.icon} className="size-8 shrink-0" strokeWidth={7} />
          </div>
          <h3 className="mt-2 line-clamp-2 text-lg font-bold leading-snug">{item.name}</h3>
          <dl className="mt-3 grid gap-2 text-sm">
            <div>
              <dt className="font-semibold opacity-80">Uses</dt>
              <dd>{c.description}</dd>
            </div>
            <div>
              <dt className="font-semibold opacity-80">Pack size</dt>
              <dd>{item.pack ?? "See product page on Bakeshed"}</dd>
            </div>
          </dl>
          <div className="mt-auto grid gap-2 pt-3">
            {concept && (
              <Link href={productPath(concept)} className="flex min-h-11 items-center justify-center rounded-full bg-white text-sm font-semibold text-ink">
                View product &amp; concept pack
              </Link>
            )}
            <a
              href={item.shopUrl}
              target="_blank"
              rel="noopener"
              className="flex min-h-11 items-center justify-center rounded-full text-sm font-semibold ring-1"
              style={{ borderColor: c.ink, boxShadow: `inset 0 0 0 1.5px ${c.ink}` }}
            >
              Buy on Bakeshed ↗<span className="sr-only"> (opens in a new tab)</span>
            </a>
            {toggled && (
              <button type="button" onClick={() => setToggled(false)} className="min-h-9 text-xs font-semibold underline underline-offset-4">
                Back to photo
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
