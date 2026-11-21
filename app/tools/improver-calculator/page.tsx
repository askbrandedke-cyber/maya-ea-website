import Link from "next/link";
import { productBySlug, productPath } from "@/content/products";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { ImproverCalculator, type CalcProduct } from "@/components/tools/ImproverCalculator";
import { WholesaleBand } from "@/components/home/WholesaleBand";
import { metaFor } from "@/lib/meta";
import { frontTex } from "@/lib/pack-files";

export const metadata = metaFor("/tools/improver-calculator");

/** The three improvers with a verified dosage (client brief). */
const SLUGS = ["mega-plus", "excess", "volume-plus"];

export default function CalculatorPage() {
  const items: CalcProduct[] = SLUGS.map((s) => {
    const p = productBySlug[s];
    const size = p.packSizes[0];
    return {
      slug: p.slug,
      name: p.name,
      href: productPath(p),
      image: frontTex(p, 0, true),
      packLabel: size.label,
      packKg: parseFloat(size.label),
      minPercent: p.dosage!.minPercent,
      maxPercent: p.dosage!.maxPercent,
    };
  });
  return (
    <>
      <section className="bg-ink text-white">
        <div className="mx-auto max-w-7xl px-4 pb-10 pt-8 md:px-6 md:pb-14">
          <Breadcrumbs
            tone="dark"
            items={[
              { name: "Tools", href: "/tools/product-finder" },
              { name: "Improver calculator", href: "/tools/improver-calculator" },
            ]}
          />
          <h1 className="mt-5 text-4xl font-bold tracking-tight md:text-5xl">Bread improver calculator</h1>
          <p className="mt-4 max-w-2xl text-lg text-white/85">
            Enter your total flour weight to see how much Mega Plus, Excess or Volume Plus to use at 0.5% and 1% of flour weight.
          </p>
        </div>
      </section>
      <section aria-label="Calculator" className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
        <ImproverCalculator items={items} />
        <p className="mt-10 text-ink/75">
          Need a different improver? See all{" "}
          <Link href="/products/bread-improvers" className="font-semibold text-navy underline underline-offset-4">
            bread improvers
          </Link>{" "}
          or ask our team on WhatsApp.
        </p>
      </section>
      <WholesaleBand />
    </>
  );
}
