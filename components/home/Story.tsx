"use client";

import { useEffect, useRef, useState } from "react";
import { confirm } from "@/content/confirm";
import { Confirm } from "@/components/concept/Confirm";
import { SectionHeading } from "./SectionHeading";

/** Copy is verbatim from mayaealtd.com (About / Products). Photos are placeholders until Maya supplies them. */
const STEPS = [
  {
    kicker: "01 · Source",
    title: "Sourced from established suppliers",
    body: "We work with established suppliers across Europe, the Middle East and Asia to keep strong product options available for the regional market.",
    photo: "inbound ingredient containers or supplier products",
    icon: "M10 60h50V32H10zM60 42h16l10 12v6H60M22 66a6 6 0 1 0 0 .1M70 66a6 6 0 1 0 0 .1",
  },
  {
    kicker: "02 · Store",
    title: "Held close to you",
    body: "Our Kenya, Uganda and Rwanda operations help customers access products more easily across East Africa.",
    photo: "the Nairobi, Kampala or Kigali warehouse",
    icon: "M10 40 48 16l38 24v38H10zM26 78V52h44v26M26 62h44",
  },
  {
    kicker: "03 · Order",
    title: "Ordered your way",
    body: "Individual and retail orders are available on bakeshed.rw. For wholesale pricing, regional account support or larger B2B requirements, contact Maya E.A. Limited directly.",
    photo: "order picking or a delivery leaving the warehouse",
    icon: "M14 20h10l10 40h40l8-28H30M38 74a5 5 0 1 0 0 .1M70 74a5 5 0 1 0 0 .1",
  },
  {
    kicker: "04 · Bake",
    title: "Supported in your bakery",
    body: "Beyond product supply, Maya also supports customers with practical guidance on application, performance and more consistent production outcomes.",
    photo: "a customer bakery using Maya products",
    icon: "M14 72C14 48 30 38 48 38s34 10 34 34ZM34 50l6 9M48 48l6 9M62 50l6 9M8 82h80",
  },
];

function Visual({ step, i }: { step: (typeof STEPS)[number]; i: number }) {
  return (
    <div className="relative flex aspect-[16/10] w-full flex-col justify-between overflow-hidden rounded-3xl bg-navy p-5 text-white md:aspect-[4/3] md:p-6">
      <div aria-hidden className="absolute -right-10 -top-10 size-56 rounded-full bg-white/[0.06]" />
      <svg viewBox="0 0 96 96" className="relative size-14 text-chef md:size-20" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d={step.icon} />
      </svg>
      <div className="relative">
        <svg aria-hidden viewBox="0 0 120 70" className="h-12 w-auto md:h-20">
          <text x="0" y="62" fill="#FFFFFF" fillOpacity="0.1" fontWeight="700" fontSize="80" fontFamily="var(--font-poppins)">
            0{i + 1}
          </text>
        </svg>
        <Confirm text={confirm(`photo of ${step.photo}`)} className="!bg-white" />
      </div>
    </div>
  );
}

export function Story() {
  const root = useRef<HTMLElement>(null);
  const pinEl = useRef<HTMLDivElement>(null);
  const grid = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const [pinned, setPinned] = useState(false);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px) and (prefers-reduced-motion: no-preference)");
    if (!mq.matches) return;
    let cleanup = () => {};
    let cancelled = false;
    (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      setPinned(true);
      await new Promise((r) => requestAnimationFrame(r));
      const st = ScrollTrigger.create({
        trigger: grid.current,
        start: "top top+=104",
        end: `+=${STEPS.length * 70}%`,
        pin: true,
        scrub: 0.4,
        onUpdate: (self) => {
          setActive(Math.min(STEPS.length - 1, Math.floor(self.progress * STEPS.length)));
          if (bar.current) bar.current.style.transform = `scaleY(${self.progress})`;
        },
      });
      cleanup = () => st.kill();
    })();
    return () => {
      cancelled = true;
      cleanup();
    };
  }, []);

  return (
    <section ref={root} aria-labelledby="story-title" className="bg-cream">
      <div ref={pinEl} className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-20">
        <SectionHeading
          id="story-title"
          eyebrow="How supply works"
          title="From our warehouse to your oven"
          lead="Four steps between Maya's suppliers and your production line."
        />
        {pinned ? (
          <div ref={grid} className="mt-10 grid grid-cols-12 gap-10">
            <div className="col-span-6">
              <div className="relative mx-auto max-w-xl">
                {STEPS.map((s, i) => (
                  <div key={s.kicker} className={`transition-opacity duration-500 ${i === active ? "relative opacity-100" : "absolute inset-0 opacity-0"}`} aria-hidden={i !== active}>
                    <Visual step={s} i={i} />
                  </div>
                ))}
              </div>
            </div>
            <ol className="relative col-span-6 grid content-center gap-6 pl-8">
              <div aria-hidden className="absolute inset-y-0 left-0 w-1 rounded-full bg-line">
                <div ref={bar} className="h-full origin-top rounded-full bg-navy" style={{ transform: "scaleY(0)" }} />
              </div>
              {STEPS.map((s, i) => (
                <li key={s.kicker} aria-current={i === active ? "step" : undefined} className={`transition duration-500 ${i === active ? "opacity-100" : "opacity-35"}`}>
                  <p className="text-sm font-bold uppercase tracking-[0.18em] text-navy">{s.kicker}</p>
                  <h3 className="mt-1 text-2xl font-bold tracking-tight">{s.title}</h3>
                  <p className="mt-2 max-w-lg leading-relaxed text-ink/75">{s.body}</p>
                </li>
              ))}
            </ol>
          </div>
        ) : (
          <ol className="no-scrollbar -mx-4 mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 md:mx-0 md:mt-10 md:grid md:grid-cols-2 md:gap-8 md:overflow-visible md:px-0" aria-label="Four supply steps, swipe for more">
            {STEPS.map((s, i) => (
              <li key={s.kicker} className="w-[84%] shrink-0 snap-center md:w-auto">
                <Visual step={s} i={i} />
                <p className="mt-5 text-sm font-bold uppercase tracking-[0.18em] text-navy">{s.kicker}</p>
                <h3 className="mt-1 text-2xl font-bold tracking-tight">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/75 md:text-base">{s.body}</p>
              </li>
            ))}
          </ol>
        )}
      </div>
    </section>
  );
}
