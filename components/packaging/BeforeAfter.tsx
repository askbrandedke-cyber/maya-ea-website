"use client";

import Image from "next/image";
import { useId, useState } from "react";
import { ConceptTag } from "@/components/concept/ConceptTag";

/**
 * Before/after: current pack photo (bakeshed.rw) vs BRANDED concept.
 * A native range input drives the split, so keyboard (arrows/Home/End) and screen readers work.
 */
export function BeforeAfter({
  before,
  after,
  name,
  className = "",
  sizes = "(min-width: 1024px) 40vw, 90vw",
}: {
  before: string;
  after: string;
  name: string;
  className?: string;
  sizes?: string;
}) {
  const [pos, setPos] = useState(50);
  const id = useId();
  return (
    <figure className={className}>
      <div className="relative aspect-square w-full select-none overflow-hidden rounded-3xl bg-white ring-1 ring-line">
        {/* After (concept), full layer */}
        <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_50%_40%,#ffffff,#EEE8DB)] p-[8%]">
          <Image src={after} alt={`${name}: BRANDED concept pack front`} width={512} height={717} sizes={sizes} className="h-full w-auto rounded-md object-contain shadow-[0_24px_40px_-16px_rgba(13,32,54,.45)]" />
        </div>
        {/* Before (current), clipped layer */}
        <div className="absolute inset-0 bg-white" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
          <Image src={before} alt={`${name}: current pack photo from bakeshed.rw`} fill sizes={sizes} className="object-contain p-[4%]" />
        </div>
        {/* Handle */}
        <div aria-hidden className="pointer-events-none absolute inset-y-0 w-0.5 bg-ink" style={{ left: `${pos}%` }}>
          <div className="absolute left-1/2 top-1/2 flex size-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-chef text-ink shadow-lg ring-2 ring-ink">
            <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M9 6 3 12l6 6M15 6l6 6-6 6" />
            </svg>
          </div>
        </div>
        <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-ink ring-1 ring-ink/10">Current pack</span>
        <ConceptTag className="pointer-events-none absolute bottom-3 right-3 max-w-[calc(100%-1.5rem)]" />
        <label htmlFor={id} className="sr-only">
          Compare the current {name} pack with the concept. Left shows more of the current pack, right shows more of the concept.
        </label>
        <input
          id={id}
          type="range"
          min={0}
          max={100}
          value={pos}
          onChange={(e) => setPos(Number(e.target.value))}
          aria-valuetext={`${pos}% current pack`}
          className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
        />
      </div>
      <figcaption className="mt-3 text-sm text-ink/70">
        <strong className="font-semibold text-ink">{name}.</strong> Drag (or use the arrow keys) to compare the current pack photo from bakeshed.rw with
        the BRANDED concept.
      </figcaption>
    </figure>
  );
}
