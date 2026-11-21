"use client";

import { AnimatePresence, m, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { offices } from "@/content/contacts";
import { confirm } from "@/content/confirm";
import { mapCountries, mapHubs, mapViewBox } from "@/content/map.generated";
import type { Office } from "@/content/types";
import { Confirm } from "@/components/concept/Confirm";
import { WhatsAppIcon } from "@/components/site/icons";
import { chatLink } from "@/lib/whatsapp";

const tel = (n: string) => `tel:${n.replace(/\s/g, "")}`;
const CITY: Record<Office["countryCode"], string> = { KE: "Nairobi", UG: "Kampala", RW: "Kigali" };

export function RegionMap({ headingLevel = 3 }: { headingLevel?: 2 | 3 }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const reduce = useReducedMotion();
  const [sel, setSel] = useState<Office["countryCode"]>("KE");
  // Server HTML shows the full map (no-JS safe). After mount, if the map starts below the fold,
  // hide it instantly and animate it in when scrolled into view.
  const [armed, setArmed] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!reduce && el && el.getBoundingClientRect().top > window.innerHeight) setArmed(true);
  }, [reduce]);
  const show = !armed || inView;
  const o = offices.find((x) => x.countryCode === sel)!;
  const chat = chatLink(o);
  const H = headingLevel === 2 ? "h2" : "h3";

  return (
    <div className="grid items-start gap-8 lg:grid-cols-[1.25fr_1fr]">
      <div ref={ref} className="relative w-full" style={{ aspectRatio: `${mapViewBox.w} / ${mapViewBox.h}` }}>
        <svg viewBox={`0 0 ${mapViewBox.w} ${mapViewBox.h}`} className="absolute inset-0 h-full w-full" role="img" aria-label="Map of East Africa showing Maya hubs in Nairobi, Kampala and Kigali">
          {mapCountries.map((c) => (
            <m.path
              key={c.id}
              d={c.d}
              initial={false}
              animate={{ opacity: show ? 1 : 0 }}
              transition={show ? { duration: 0.8, delay: c.focus ? 0.2 : 0 } : { duration: 0 }}
              fill={c.focus ? (c.id === sel ? "#1A487B" : "#2D5C8F") : "#E7E1D3"}
              stroke="#FBF8F1"
              strokeWidth={c.focus ? 1.5 : 1}
            />
          ))}
          {/* route lines between hubs */}
          <m.path
            d={`M${mapHubs.RW.join(" ")} L${mapHubs.UG.join(" ")} L${mapHubs.KE.join(" ")}`}
            fill="none"
            stroke="#FCEA00"
            strokeWidth="3"
            strokeDasharray="1 0"
            strokeLinecap="round"
            initial={false}
            animate={{ pathLength: show ? 1 : 0 }}
            transition={show ? { duration: 1.4, delay: 0.8, ease: "easeInOut" } : { duration: 0 }}
          />
        </svg>
        {offices.map((office, i) => {
          const [x, y] = mapHubs[office.countryCode];
          const on = office.countryCode === sel;
          return (
            <m.button
              key={office.countryCode}
              type="button"
              onClick={() => setSel(office.countryCode)}
              aria-pressed={on}
              aria-controls="hub-panel"
              initial={false}
              animate={{ scale: show ? 1 : 0, opacity: show ? 1 : 0 }}
              transition={show ? { type: "spring", stiffness: 260, damping: 18, delay: 1 + i * 0.25 } : { duration: 0 }}
              className="group absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-2"
              style={{ left: `${(x / mapViewBox.w) * 100}%`, top: `${(y / mapViewBox.h) * 100}%` }}
            >
              <span className="relative flex size-11 items-center justify-center">
                <span aria-hidden className="absolute inset-0 m-auto size-5 animate-pulse-ring rounded-full bg-chef motion-reduce:hidden" />
                <span aria-hidden className={`relative size-5 rounded-full ring-4 ${on ? "bg-chef ring-ink" : "bg-white ring-navy"}`} />
              </span>
              <span className={`whitespace-nowrap rounded-full px-3 py-1 text-sm font-semibold shadow ${on ? "bg-ink text-white" : "bg-white text-ink"}`}>
                {CITY[office.countryCode]}
                <span className="sr-only">, {office.country}: show contact details</span>
              </span>
            </m.button>
          );
        })}
      </div>

      <div id="hub-panel" aria-live="polite" className="lg:sticky lg:top-24">
        <AnimatePresence mode="wait" initial={false}>
          <m.div
            key={sel}
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="rounded-3xl bg-white p-6 ring-1 ring-line md:p-8"
          >
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-navy">{o.role}</p>
            <H className="mt-2 text-2xl font-bold tracking-tight">
              {o.country} · {CITY[o.countryCode]}
            </H>
            <p className="mt-1 font-medium text-ink/75">{o.entity}</p>
            <address className="mt-4 not-italic leading-relaxed">{o.addressLines.map((l) => <span key={l} className="block">{l}</span>)}</address>
            <dl className="mt-5 grid gap-3 text-sm">
              <div>
                <dt className="font-semibold">Phone</dt>
                <dd className="flex flex-wrap gap-x-4">
                  {o.phones.map((p) => (
                    <a key={p.number} href={tel(p.number)} className="inline-flex min-h-11 items-center font-medium text-navy underline-offset-4 hover:underline">
                      {p.number}
                    </a>
                  ))}
                </dd>
              </div>
              <div>
                <dt className="font-semibold">Email</dt>
                <dd>
                  {o.emails.map((e) => (
                    <a key={e} href={`mailto:${e}`} className="inline-flex min-h-11 items-center break-all font-medium text-navy underline-offset-4 hover:underline">
                      {e}
                    </a>
                  ))}
                </dd>
              </div>
            </dl>
            <div className="mt-5 flex flex-wrap gap-3">
              {chat.kind === "whatsapp" ? (
                <a href={chat.href} target="_blank" rel="noopener" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[#0B6E4F] px-5 font-semibold text-white">
                  <WhatsAppIcon className="size-5" /> WhatsApp {chat.number}
                </a>
              ) : (
                <Confirm text={confirm("which Uganda number takes WhatsApp")} />
              )}
              <a href="https://bakeshed.rw" target="_blank" rel="noopener" className="inline-flex min-h-12 items-center rounded-full px-5 font-semibold ring-1 ring-ink/25 hover:bg-cream">
                Shop on Bakeshed ↗
              </a>
            </div>
          </m.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
