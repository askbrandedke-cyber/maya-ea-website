"use client";

import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useId, useRef, useState } from "react";
import { categoryBySlug } from "@/content/categories";
import { confirm } from "@/content/confirm";
import { bakeOptions, countryOptions, scaleOptions, type BakeId, type CountryId, type ScaleId } from "@/content/finder";
import { CategoryIcon, WhatsAppIcon } from "@/components/site/icons";
import { Confirm } from "@/components/concept/Confirm";
import { chatLink, officeByCode } from "@/lib/whatsapp";

type Answers = { bake?: BakeId; scale?: ScaleId; country?: CountryId };
const STEPS = [
  { key: "bake", q: "What are you baking?", options: bakeOptions },
  { key: "scale", q: "What is your scale?", options: scaleOptions },
  { key: "country", q: "Where are you based?", options: countryOptions },
] as const;

export function Finder({ compact = false }: { compact?: boolean }) {
  const [step, setStep] = useState(0);
  const [a, setA] = useState<Answers>({});
  const reduce = useReducedMotion();
  const uid = useId();
  const live = useRef<HTMLDivElement>(null);
  const done = step >= STEPS.length;

  const choose = (key: keyof Answers, id: string) => {
    setA((prev) => ({ ...prev, [key]: id }));
    setStep((s) => s + 1);
    requestAnimationFrame(() => live.current?.focus());
  };

  const slide = reduce ? {} : { initial: { opacity: 0, x: 24 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -24 }, transition: { duration: 0.28 } };

  return (
    <div className={`rounded-3xl bg-white p-5 shadow-[0_30px_60px_-30px_rgba(13,32,54,.35)] ring-1 ring-line md:p-8 ${compact ? "" : "lg:p-10"}`}>
      <div className="flex items-center justify-between gap-4">
        <ol className="flex gap-2" aria-label="Progress">
          {STEPS.map((s, i) => (
            <li key={s.key} aria-current={i === step ? "step" : undefined} className={`h-1.5 w-10 rounded-full ${i < step ? "bg-navy" : i === step ? "bg-chef" : "bg-line"}`}>
              <span className="sr-only">
                Step {i + 1} of {STEPS.length}
                {i < step ? ", answered" : ""}
              </span>
            </li>
          ))}
        </ol>
        {step > 0 && (
          <button type="button" onClick={() => setStep((s) => s - 1)} className="min-h-11 rounded-full px-4 text-sm font-semibold text-navy hover:bg-cream">
            ← Back
          </button>
        )}
      </div>

      <div ref={live} tabIndex={-1} aria-live="polite" className="mt-6 outline-none">
        <AnimatePresence mode="wait" initial={false}>
          {!done ? (
            <m.fieldset key={step} {...slide}>
              <legend className="text-2xl font-bold tracking-tight md:text-3xl">{STEPS[step].q}</legend>
              <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
                {STEPS[step].options.map((o) => {
                  const key = STEPS[step].key;
                  const checked = a[key] === o.id;
                  return (
                    <label
                      key={o.id}
                      className={`flex min-h-14 cursor-pointer items-center gap-3 rounded-2xl px-4 py-3 font-medium ring-1 transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-navy ${
                        checked ? "bg-ink text-white ring-ink" : "bg-paper ring-line hover:ring-navy"
                      }`}
                    >
                      <input type="radio" name={`${uid}-${key}`} value={o.id} checked={checked} onChange={() => choose(key, o.id)} className="sr-only" />
                      <span aria-hidden className={`size-4 shrink-0 rounded-full ring-2 ${checked ? "bg-chef ring-chef" : "ring-ink/30"}`} />
                      {o.label}
                    </label>
                  );
                })}
              </div>
            </m.fieldset>
          ) : (
            <m.div key="result" {...slide}>
              <Result a={a as Required<Answers>} onRestart={() => (setA({}), setStep(0))} />
            </m.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Result({ a, onRestart }: { a: Required<Answers>; onRestart: () => void }) {
  const bake = bakeOptions.find((b) => b.id === a.bake)!;
  const scale = scaleOptions.find((s) => s.id === a.scale)!;
  const office = a.country !== "OTHER" ? officeByCode[a.country] : undefined;
  const chat = office && chatLink(office, `${bake.label.toLowerCase()} ingredients`);
  const wholesaleFirst = scale.wholesale;

  const wholesale = (
    <Link href={`/wholesale?bake=${a.bake}&country=${a.country}`} className="inline-flex min-h-12 items-center justify-center rounded-full bg-chef px-6 font-semibold text-ink hover:bg-chef-tint">
      Request wholesale pricing
    </Link>
  );
  const shop = (
    <a href="https://bakeshed.rw" target="_blank" rel="noopener" className="inline-flex min-h-12 items-center justify-center rounded-full px-6 font-semibold ring-1 ring-ink/25 hover:bg-cream">
      Shop on Bakeshed ↗
    </a>
  );

  return (
    <div>
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-navy">Your match</p>
      <h3 className="mt-2 text-2xl font-bold tracking-tight md:text-3xl">
        {bake.label} · {scale.label.toLowerCase()}
      </h3>
      <p className="mt-2 max-w-2xl text-ink/70">{bake.why}</p>
      <ul className="mt-5 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
        {bake.categories.map((slug, i) => {
          const c = categoryBySlug[slug];
          return (
            <li key={slug}>
              <Link href={`/products/${slug}`} className="group flex items-center gap-3 rounded-2xl p-3 ring-1 ring-line transition hover:ring-navy">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-xl" style={{ background: c.colour, color: c.ink }}>
                  <CategoryIcon name={c.icon} className="size-7" strokeWidth={7} />
                </span>
                <span>
                  <span className="block font-semibold">
                    {i === 0 && <span className="sr-only">Top match: </span>}
                    {c.name}
                  </span>
                  <span className="block text-sm text-ink/75">{c.whatItDoes}</span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        {wholesaleFirst ? wholesale : shop}
        {wholesaleFirst ? shop : wholesale}
        {chat && (
          <a href={chat.href} target="_blank" rel="noopener" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 font-semibold text-[#0B6E4F] ring-1 ring-[#0B6E4F]/40 hover:bg-[#0B6E4F]/5">
            {chat.kind === "whatsapp" ? <WhatsAppIcon className="size-5" /> : null}
            {chat.kind === "whatsapp" ? `WhatsApp ${office!.country}` : `Call ${office!.country} ${chat.number}`}
          </a>
        )}
        {!office && (
          <Link href="/contact" className="inline-flex min-h-12 items-center justify-center rounded-full px-6 font-semibold text-navy ring-1 ring-navy/30">
            Contact us
          </Link>
        )}
      </div>
      {(a.country === "KE" || a.country === "UG") && (
        <p className="mt-4 text-sm">
          <Confirm text={confirm(`whether bakeshed.rw delivers to ${office!.country}`)} />
        </p>
      )}
      <button type="button" onClick={onRestart} className="mt-6 min-h-11 text-sm font-semibold text-navy underline underline-offset-4">
        Start again
      </button>
    </div>
  );
}
