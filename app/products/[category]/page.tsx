import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SITE_URL } from "@/content/brand";
import { categories, categoryBySlug, families } from "@/content/categories";
import { catalogue } from "@/content/catalogue.generated";
import { productBySlug, productPath, productsIn } from "@/content/products";
import type { CategorySlug } from "@/content/types";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { CategoryIcon } from "@/components/site/icons";
import { Explorer } from "@/components/products/Explorer";
import { ConceptTag } from "@/components/concept/ConceptTag";
import { WholesaleBand } from "@/components/home/WholesaleBand";
import { JsonLd } from "@/lib/jsonld";
import { metaFor } from "@/lib/meta";
import { frontTex } from "@/lib/pack-files";

type Props = { params: Promise<{ category: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { category } = await params;
  return metaFor(`/products/${category}`);
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const c = categoryBySlug[category as CategorySlug];
  if (!c) notFound();
  const items = catalogue.filter((i) => i.category === c.slug);
  const concepts = productsIn(c.slug);
  const related = categories.filter((x) => x.family === c.family && x.slug !== c.slug);

  return (
    <>
      <section style={{ background: c.colour, color: c.ink }}>
        <div className="mx-auto max-w-7xl px-4 pb-10 pt-8 md:px-6 md:pb-14 md:pt-10">
          <Breadcrumbs
            tone={c.ink === "#FFFFFF" ? "dark" : "light"}
            items={[
              { name: "Products", href: "/products" },
              { name: c.name, href: `/products/${c.slug}` },
            ]}
          />
          <div className="mt-6 grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <p className="text-sm font-bold tracking-[0.18em]">
                {c.code} · {String(c.index).padStart(2, "0")} · {families[c.family].toUpperCase()}
              </p>
              <h1 className="mt-2 text-4xl font-bold tracking-tight md:text-6xl">{c.name}</h1>
              <p className="mt-4 max-w-2xl text-lg opacity-90">{c.description}</p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <a href={c.shopUrl} target="_blank" rel="noopener" className="inline-flex min-h-12 items-center justify-center rounded-full bg-ink px-6 font-semibold text-white ring-1 ring-white/20">
                  Buy {c.name.toLowerCase()} on Bakeshed ↗<span className="sr-only"> (opens in a new tab)</span>
                </a>
                <Link href={`/wholesale?category=${c.slug}`} className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-6 font-semibold text-ink">
                  Request wholesale pricing
                </Link>
              </div>
            </div>
            <CategoryIcon name={c.icon} className="hidden size-40 opacity-90 md:block" strokeWidth={4} />
          </div>
        </div>
      </section>

      {concepts.length > 0 && (
        <section aria-labelledby="concepts-title" className="border-b border-line bg-ink py-10 text-white">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <h2 id="concepts-title" className="text-xl font-bold">
                Concept packs in this category ({concepts.length})
              </h2>
              <ConceptTag />
            </div>
            <ul className="no-scrollbar -mx-4 mt-5 flex gap-4 overflow-x-auto px-4 pb-2 md:mx-0 md:px-0">
              {concepts.map((p) => (
                <li key={p.slug} className="w-32 shrink-0 md:w-36">
                  <Link href={productPath(p)} className="group block">
                    <Image src={frontTex(p, 0, true)} alt={`${p.name}: concept pack`} width={384} height={538} sizes="144px" className="h-auto w-full rounded-[5px] shadow-[0_16px_28px_-12px_rgba(0,0,0,.6)] transition group-hover:-translate-y-1" />
                    <span className="mt-2 block text-sm font-semibold">{p.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section aria-labelledby="items-title" className="mx-auto max-w-7xl px-4 pb-16 pt-8 md:px-6 md:pb-20">
        <h2 id="items-title" className="sr-only">
          All {c.name.toLowerCase()} on Bakeshed
        </h2>
        <Explorer items={items} initialCategory={c.slug} />
        {c.slug === "bread-improvers" && (
          <Link href="/tools/improver-calculator" className="mt-10 flex flex-col gap-1 rounded-3xl bg-white p-6 ring-1 ring-line transition hover:ring-navy md:flex-row md:items-center md:justify-between">
            <span>
              <strong className="block text-lg">Bread improver calculator</strong>
              <span className="text-ink/70">Enter your flour weight to see Mega Plus, Excess and Volume Plus amounts at 0.5% and 1%.</span>
            </span>
            <span className="font-semibold text-navy">Open the calculator →</span>
          </Link>
        )}
      </section>

      <section aria-labelledby="related-title" className="border-t border-line bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 md:px-6">
          <h2 id="related-title" className="text-xl font-bold">
            More in {families[c.family]}
          </h2>
          <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {related.map((r) => (
              <li key={r.slug}>
                <Link href={`/products/${r.slug}`} className="flex min-h-20 items-center gap-3 rounded-2xl p-3 font-semibold" style={{ background: r.colour, color: r.ink }}>
                  <CategoryIcon name={r.icon} className="size-7 shrink-0" strokeWidth={7} />
                  {r.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <WholesaleBand />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: c.name,
          numberOfItems: items.length,
          itemListElement: items.map((i, n) => ({ "@type": "ListItem", position: n + 1, name: i.name, url: i.conceptSlug ? `${SITE_URL}${productPath(productBySlug[i.conceptSlug])}` : i.shopUrl })),
        }}
      />
    </>
  );
}
