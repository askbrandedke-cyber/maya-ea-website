import { categories } from "@/content/categories";
import { catalogue } from "@/content/catalogue.generated";
import { SITE_URL } from "@/content/brand";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { Explorer } from "@/components/products/Explorer";
import { WholesaleBand } from "@/components/home/WholesaleBand";
import { JsonLd } from "@/lib/jsonld";
import { metaFor } from "@/lib/meta";

export const metadata = metaFor("/products");

export default function ProductsPage() {
  return (
    <>
      <section className="bg-ink text-white">
        <div className="mx-auto max-w-7xl px-4 pb-10 pt-8 md:px-6 md:pb-14 md:pt-10">
          <Breadcrumbs tone="dark" items={[{ name: "Products", href: "/products" }]} />
          <h1 className="mt-5 max-w-3xl text-balance text-4xl font-bold tracking-tight md:text-5xl">Bakery ingredients, premixes and supplies</h1>
          <p className="mt-4 max-w-2xl text-lg text-white/80">
            {catalogue.length} products in {categories.length} categories. Search, filter, and flip a card for uses and pack size. Retail orders go through
            bakeshed.rw; for bulk or recurring supply, request wholesale pricing.
          </p>
        </div>
      </section>
      <section aria-label="Product explorer" className="mx-auto max-w-7xl px-4 pb-16 md:px-6 md:pb-24">
        <Explorer items={catalogue} />
      </section>
      <WholesaleBand />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Product categories",
          itemListElement: categories.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, url: `${SITE_URL}/products/${c.slug}` })),
        }}
      />
    </>
  );
}
