import Link from "next/link";
import { categories, families } from "@/content/categories";
import { CategoryIcon } from "@/components/site/icons";
import { SectionHeading } from "./SectionHeading";

/** 14 tiles in the packaging colours: the colour system is visible before /packaging. */
export function CategoryTiles() {
  return (
    <section aria-labelledby="cats-title" className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-24">
      <SectionHeading
        id="cats-title"
        eyebrow="14 categories"
        title="Find what your production needs"
        lead="From bread improvers to cake boxes. Each category has its own colour, code and icon, the same system as the proposed packs."
        action={{ href: "/products", label: "Browse all products" }}
      />
      <ul className="mt-8 grid grid-cols-3 gap-2 md:mt-10 md:gap-3 lg:grid-cols-7">
        {categories.map((c) => (
          <li key={c.slug}>
            <Link
              href={`/products/${c.slug}`}
              className="group flex h-full min-h-24 flex-col justify-between rounded-xl p-2.5 sm:min-h-36 sm:rounded-2xl sm:p-4 transition duration-300 ease-out-soft hover:-translate-y-1 hover:shadow-xl focus-visible:-translate-y-1"
              style={{ backgroundColor: c.colour, color: c.ink }}
            >
              <span className="flex items-start justify-between">
                <span className="text-[11px] font-bold tracking-wider sm:text-xs">
                  {c.code} · {String(c.index).padStart(2, "0")}
                </span>
                <CategoryIcon name={c.icon} className="size-7 transition sm:size-9 duration-300 group-hover:scale-110" strokeWidth={7} />
              </span>
              <span>
                <span className="block text-[13px] font-semibold leading-tight sm:text-base">{c.name}</span>
                <span className="mt-1 hidden text-xs opacity-85 sm:block">
                  {families[c.family]} · {c.shopCount} on Bakeshed
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
