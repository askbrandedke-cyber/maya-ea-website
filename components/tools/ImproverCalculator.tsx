"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useMemo, useState } from "react";
import type { Product } from "@/content/types";

export interface CalcProduct {
  slug: string;
  name: string;
  href: string;
  image: string;
  packLabel: string;
  packKg: number;
  minPercent: number;
  maxPercent: number;
}

const PRESETS_KG = [1, 10, 25, 50, 100];
const MAX_KG = 100_000;

const fmtMass = (grams: number) => {
  if (grams >= 1000) return `${(grams / 1000).toLocaleString("en-GB", { maximumFractionDigits: 2 })} kg`;
  return `${grams.toLocaleString("en-GB", { maximumFractionDigits: grams < 10 ? 2 : 1 })} g`;
};
const fmtKg = (kg: number) => `${kg.toLocaleString("en-GB", { maximumFractionDigits: 0 })} kg`;

/**
 * Flour weight → improver amount at the verified 0.5% and 1% (of total flour weight).
 * Only figures from the client brief are used; everything else is arithmetic on them.
 */
export function ImproverCalculator({ items, highlight }: { items: CalcProduct[]; highlight?: Product["slug"] }) {
  const id = useId();
  const [raw, setRaw] = useState("25");
  const [unit, setUnit] = useState<"kg" | "g">("kg");
  const [focus, setFocus] = useState<string | undefined>(highlight);

  useEffect(() => {
    const p = new URLSearchParams(window.location.search).get("product");
    if (p && items.some((i) => i.slug === p)) setFocus(p);
  }, [items]);

  const parsed = Number(raw.replace(",", "."));
  const error =
    raw.trim() === ""
      ? "Enter your flour weight."
      : !Number.isFinite(parsed) || parsed <= 0
        ? "Enter a number greater than 0."
        : (unit === "kg" ? parsed : parsed / 1000) > MAX_KG
          ? `Enter up to ${MAX_KG.toLocaleString("en-GB")} kg.`
          : null;
  const flourKg = error ? 0 : unit === "kg" ? parsed : parsed / 1000;
  const flourG = flourKg * 1000;

  const rows = useMemo(
    () =>
      items.map((i) => ({
        ...i,
        low: (flourG * i.minPercent) / 100,
        high: (flourG * i.maxPercent) / 100,
        // flour one pack treats, from the same verified range
        packFlourMax: i.packKg / (i.minPercent / 100),
        packFlourMin: i.packKg / (i.maxPercent / 100),
      })),
    [items, flourG],
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
      <form className="rounded-3xl bg-white p-6 ring-1 ring-line md:p-8" onSubmit={(e) => e.preventDefault()} noValidate>
        <label htmlFor={`${id}-w`} className="text-lg font-bold">
          Total flour weight
        </label>
        <div className="mt-3 flex gap-2">
          <input
            id={`${id}-w`}
            inputMode="decimal"
            autoComplete="off"
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            aria-invalid={!!error}
            aria-describedby={`${id}-err ${id}-hint`}
            className={`min-h-14 w-full rounded-2xl bg-paper px-4 text-2xl font-bold ring-1 focus:outline-none focus:ring-2 ${error ? "ring-placeholder focus:ring-placeholder" : "ring-line focus:ring-navy"}`}
          />
          <div role="radiogroup" aria-label="Unit" className="flex rounded-2xl bg-paper p-1 ring-1 ring-line">
            {(["kg", "g"] as const).map((u) => (
              <button
                key={u}
                type="button"
                role="radio"
                aria-checked={unit === u}
                onClick={() => setUnit(u)}
                className={`min-h-12 min-w-12 rounded-xl px-3 font-semibold ${unit === u ? "bg-ink text-white" : "text-ink"}`}
              >
                {u}
              </button>
            ))}
          </div>
        </div>
        <p id={`${id}-err`} role="alert" className="mt-2 min-h-6 text-sm font-semibold text-placeholder">
          {error ?? ""}
        </p>
        <p id={`${id}-hint`} className="text-sm text-ink/75">
          Quick picks:
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {PRESETS_KG.map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => (setRaw(String(k)), setUnit("kg"))}
              aria-pressed={unit === "kg" && parsed === k}
              className="min-h-11 rounded-full bg-paper px-4 text-sm font-semibold ring-1 ring-line hover:ring-navy aria-pressed:bg-ink aria-pressed:text-white"
            >
              {k} kg
            </button>
          ))}
        </div>
      </form>

      <div>
        <div aria-live="polite" className="sr-only">
          {error ? "" : `For ${fmtKg(flourKg)} of flour: ${fmtMass(rows[0]?.low ?? 0)} to ${fmtMass(rows[0]?.high ?? 0)} of improver.`}
        </div>
        <div className="mb-4 rounded-2xl border-[1.5px] border-dashed border-placeholder bg-[#FFF5F5] p-4 text-sm text-placeholder">
          <p className="font-bold">Guide only; follow product instructions.</p>
          <p className="mt-1">
            Uses the dosage stated for Mega Plus, Excess and Volume Plus: 0.5% to 1% of total flour weight. Always check the instructions on the pack
            for your recipe.
          </p>
        </div>
        <table className="w-full overflow-hidden rounded-3xl bg-white text-left ring-1 ring-line">
          <caption className="px-5 pb-2 pt-5 text-left text-sm text-ink/75 md:px-6">
            Improver for <strong className="text-ink">{error ? "—" : unit === "kg" ? fmtKg(flourKg) : fmtMass(flourG)}</strong> of flour
          </caption>
          <thead>
            <tr className="border-b border-line text-sm">
              <th scope="col" className="px-5 py-3 font-semibold md:px-6">
                Product
              </th>
              <th scope="col" className="px-3 py-3 text-right font-semibold">
                at 0.5%
              </th>
              <th scope="col" className="px-5 py-3 text-right font-semibold md:px-6">
                at 1%
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.slug} className={`border-b border-line last:border-0 ${focus === r.slug ? "bg-chef/25" : ""}`}>
                <th scope="row" className="px-5 py-4 font-normal md:px-6">
                  <Link href={r.href} className="flex items-center gap-3">
                    <Image src={r.image} alt="" width={384} height={538} className="h-14 w-10 shrink-0 rounded-[3px] object-cover shadow" />
                    <span>
                      <span className="block font-semibold underline-offset-4 hover:underline">{r.name}</span>
                      <span className="block text-sm text-ink/75">{r.packLabel} pack</span>
                    </span>
                  </Link>
                </th>
                <td className="px-3 py-4 text-right text-xl font-bold tabular-nums">{error ? "—" : fmtMass(r.low)}</td>
                <td className="px-5 py-4 text-right text-xl font-bold tabular-nums md:px-6">{error ? "—" : fmtMass(r.high)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <ul className="mt-4 grid gap-2 text-sm text-ink/75">
          {rows.map((r) => (
            <li key={r.slug}>
              One {r.packLabel} pack of <strong className="text-ink">{r.name}</strong> covers {fmtKg(r.packFlourMin)} to {fmtKg(r.packFlourMax)} of flour
              at 1% to 0.5%.
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm font-semibold text-placeholder">Guide only; follow product instructions.</p>
      </div>
    </div>
  );
}
