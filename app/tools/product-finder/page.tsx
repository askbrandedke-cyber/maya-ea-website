import Link from "next/link";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { Finder } from "@/components/tools/Finder";
import { metaFor } from "@/lib/meta";

export const metadata = metaFor("/tools/product-finder");

export default function FinderPage() {
  return (
    <>
      <section className="bg-ink text-white">
        <div className="mx-auto max-w-7xl px-4 pb-10 pt-8 md:px-6 md:pb-14">
          <Breadcrumbs
            tone="dark"
            items={[
              { name: "Tools", href: "/tools/product-finder" },
              { name: "Product finder", href: "/tools/product-finder" },
            ]}
          />
          <h1 className="mt-5 text-4xl font-bold tracking-tight md:text-5xl">Find the right ingredients</h1>
          <p className="mt-4 max-w-2xl text-lg text-white/85">
            Three questions: what you bake, your scale and your country. We point you to the categories that fit and the fastest way to order.
          </p>
        </div>
      </section>
      <section aria-label="Product finder" className="mx-auto max-w-4xl px-4 py-12 md:px-6 md:py-16">
        <h2 className="sr-only">Three questions</h2>
        <Finder />
        <p className="mt-8 text-center text-ink/75">
          Know what you need already?{" "}
          <Link href="/products" className="font-semibold text-navy underline underline-offset-4">
            Browse all 121 products
          </Link>
          .
        </p>
      </section>
    </>
  );
}
