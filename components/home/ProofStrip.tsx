"use client";

import { useInView, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { categories } from "@/content/categories";
import { certifications } from "@/content/certifications";
import { offices } from "@/content/contacts";
import { brand } from "@/content/brand";

/** Verified numbers only (brief): since 2009, 3 countries, 14 categories. */
const STATS = [
  { value: brand.founded, from: 2000, label: "Established in Kenya", prefix: "Since " },
  { value: offices.length, from: 0, label: "Countries" },
  { value: categories.length, from: 0, label: "Product categories" },
];

function Counter({ value, from, prefix = "" }: { value: number; from: number; prefix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotion();
  const [n, setN] = useState(value);
  useEffect(() => {
    if (!inView || reduce) return;
    // small rAF counter (no animation engine needed)
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const k = Math.min(1, (t - t0) / 1400);
      const eased = 1 - Math.pow(1 - k, 4);
      setN(Math.round(from + (value - from) * eased));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduce, from, value]);
  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {n}
    </span>
  );
}

export function ProofStrip() {
  const items = [...certifications, ...certifications];
  return (
    <section aria-label="Key facts and certifications" className="border-b border-line bg-white">
      <div className="mx-auto grid max-w-7xl grid-cols-3 gap-px bg-line">
        {STATS.map((s) => (
          <div key={s.label} className="bg-white px-2 py-6 text-center sm:px-6 sm:py-10">
            <p className="text-2xl font-bold tracking-tight text-navy sm:text-4xl md:text-5xl">
              <Counter value={s.value} from={s.from} prefix={s.prefix} />
            </p>
            <p className="mt-1 text-xs font-medium text-ink/70 sm:mt-2 sm:text-sm">{s.label}</p>
          </div>
        ))}
      </div>
      <div className="relative overflow-hidden border-t border-line py-4" aria-label="Certifications">
        <ul className="flex w-max animate-marquee gap-4 hover:[animation-play-state:paused] motion-reduce:animate-none">
          {items.map((c, i) => (
            <li key={`${c.id}-${i}`} aria-hidden={i >= certifications.length} className="flex items-center gap-3 rounded-full bg-cream py-1.5 pl-1.5 pr-5">
              <Image src={c.image} alt={i >= certifications.length ? "" : c.alt} width={40} height={40} className="size-10 rounded-full bg-white object-contain p-0.5" />
              <span className="whitespace-nowrap text-sm">
                <strong className="font-semibold">{c.name}</strong> <span className="text-ink/70">· {c.body} · {c.scope}</span>
              </span>
            </li>
          ))}
        </ul>
        <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white" />
        <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white" />
      </div>
    </section>
  );
}
