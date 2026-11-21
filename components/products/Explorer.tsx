"use client";

import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { categories, categoryBySlug } from "@/content/categories";
import type { CatalogueItem, CategorySlug } from "@/content/types";
import { CategoryIcon } from "@/components/site/icons";
import { FlipCard } from "./FlipCard";

const PAGE = 24;
const norm = (s: string) => s.toLowerCase().normalize("NFKD").replace(/[^\w\s]/g, " ");

/** Filter by category, search, "concept pack" toggle. State mirrors the URL (?category=&q=&concept=1). */
export function Explorer({ items, initialCategory }: { items: CatalogueItem[]; initialCategory?: CategorySlug }) {
  const [cat, setCat] = useState<CategorySlug | "all">(initialCategory ?? "all");
  const [q, setQ] = useState("");
  const [conceptOnly, setConceptOnly] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const dq = useDeferredValue(q);

  // read initial state from the URL once (keeps the page statically rendered)
  useEffect(() => {
    if (initialCategory) return;
    const sp = new URLSearchParams(window.location.search);
    const c = sp.get("category");
    if (c && c in categoryBySlug) setCat(c as CategorySlug);
    setQ(sp.get("q") ?? "");
    setConceptOnly(sp.get("concept") === "1");
  }, [initialCategory]);

  useEffect(() => {
    if (initialCategory) return;
    const sp = new URLSearchParams();
    if (cat !== "all") sp.set("category", cat);
    if (q) sp.set("q", q);
    if (conceptOnly) sp.set("concept", "1");
    const qs = sp.toString();
    window.history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname);
  }, [cat, q, conceptOnly, initialCategory]);

  const counts = useMemo(() => {
    const m: Record<string, number> = {};
    for (const i of items) m[i.category] = (m[i.category] ?? 0) + 1;
    return m;
  }, [items]);

  const results = useMemo(() => {
    const terms = norm(dq).split(/\s+/).filter(Boolean);
    return items.filter((i) => {
      if (cat !== "all" && i.category !== cat) return false;
      if (conceptOnly && !i.conceptSlug) return false;
      if (!terms.length) return true;
      const hay = norm(`${i.name} ${categoryBySlug[i.category].name} ${i.pack ?? ""} ${i.partner ?? ""}`);
      return terms.every((t) => hay.includes(t));
    });
  }, [items, cat, dq, conceptOnly]);

  // Render 24 cards first (fast hydration on mobile); filters and search always show every match.
  const filtered = cat !== "all" || !!dq || conceptOnly || !!initialCategory;

  return (
    <div>
      <div className="sticky top-16 z-20 -mx-4 border-b border-line bg-paper/95 px-4 py-3 backdrop-blur md:top-[72px] md:-mx-6 md:px-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <label className="relative flex-1">
            <span className="sr-only">Search products</span>
            <svg aria-hidden viewBox="0 0 20 20" className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-ink/75" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="9" r="6" />
              <path d="m14 14 4 4" strokeLinecap="round" />
            </svg>
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search 121 products, e.g. improver, cocoa, cake box"
              className="min-h-12 w-full rounded-full bg-white pl-12 pr-4 text-base ring-1 ring-line placeholder:text-ink/60 focus:outline-none focus:ring-2 focus:ring-navy"
            />
          </label>
          {!initialCategory && (
            <label className="inline-flex min-h-12 cursor-pointer items-center gap-3 rounded-full bg-white px-4 ring-1 ring-line has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-navy">
              <input type="checkbox" checked={conceptOnly} onChange={(e) => setConceptOnly(e.target.checked)} className="peer sr-only" />
              <span aria-hidden className="relative h-6 w-10 rounded-full bg-line transition peer-checked:bg-navy after:absolute after:left-0.5 after:top-0.5 after:size-5 after:rounded-full after:bg-white after:transition peer-checked:after:translate-x-4" />
              <span className="text-sm font-semibold">Concept pack available</span>
            </label>
          )}
        </div>
        {!initialCategory && (
          <div role="group" aria-label="Filter by category" className="no-scrollbar -mx-4 mt-3 flex gap-2 overflow-x-auto px-4 md:mx-0 md:flex-wrap md:px-0">
            <FilterChip active={cat === "all"} onClick={() => setCat("all")} label="All" count={items.length} />
            {categories.map((c) => (
              <FilterChip
                key={c.slug}
                active={cat === c.slug}
                onClick={() => setCat(c.slug)}
                label={c.name}
                count={counts[c.slug] ?? 0}
                colour={c.colour}
                ink={c.ink}
                icon={<CategoryIcon name={c.icon} className="size-4" strokeWidth={9} />}
              />
            ))}
          </div>
        )}
      </div>

      <p aria-live="polite" className="mt-5 text-sm text-ink/70">
        {results.length} {results.length === 1 ? "product" : "products"}
        {cat !== "all" && !initialCategory ? ` in ${categoryBySlug[cat].name}` : ""}
        {dq ? ` matching “${dq}”` : ""}
      </p>

      {results.length ? (
        <>
          <h2 className="sr-only">Products</h2>
          <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {(filtered || showAll ? results : results.slice(0, PAGE)).map((i) => (
              <li key={i.slug}>
                <FlipCard item={i} />
              </li>
            ))}
          </ul>
          {!filtered && !showAll && results.length > PAGE && (
            <div className="mt-8 text-center">
              <button type="button" onClick={() => setShowAll(true)} className="min-h-12 rounded-full bg-ink px-6 font-semibold text-white hover:bg-navy">
                Show all {results.length} products
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="mt-6 rounded-3xl bg-white p-8 text-center ring-1 ring-line">
          <p className="text-lg font-semibold">No products match.</p>
          <p className="mt-1 text-ink/70">Try a shorter word, or clear the filters.</p>
          <button type="button" onClick={() => (setQ(""), setCat("all"), setConceptOnly(false))} className="mt-4 min-h-11 rounded-full bg-ink px-5 font-semibold text-white">
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  label,
  count,
  colour,
  ink,
  icon,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
  colour?: string;
  ink?: string;
  icon?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-full px-3.5 text-sm font-semibold ring-1 transition ${active ? "ring-transparent" : "bg-white text-ink ring-line hover:ring-navy"}`}
      style={active ? { background: colour ?? "#0D2036", color: ink ?? "#FFFFFF" } : undefined}
    >
      {icon}
      {label}
      <span className={`text-xs ${active ? "opacity-80" : "text-ink/75"}`}>{count}</span>
    </button>
  );
}
