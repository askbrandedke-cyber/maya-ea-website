import { Hero } from "@/components/home/Hero";
import { ProofStrip } from "@/components/home/ProofStrip";
import { CategoryTiles } from "@/components/home/CategoryTiles";
import { SectionHeading } from "@/components/home/SectionHeading";
import { Story } from "@/components/home/Story";
import { PackagingTeaser } from "@/components/home/PackagingTeaser";
import { RegionMap } from "@/components/home/RegionMap";
import { WholesaleBand } from "@/components/home/WholesaleBand";
import { Finder } from "@/components/tools/Finder";
import { brand } from "@/content/brand";
import { metaFor } from "@/lib/meta";

const base = metaFor("/");
export const metadata = { ...base, title: { absolute: `${brand.name} | ${base.title as string}` } };

/** Home: section order and jobs are defined in SITEMAP.md §4. */
export default function HomePage() {
  return (
    <>
      <Hero />
      <ProofStrip />
      <CategoryTiles />

      <section aria-labelledby="finder-title" className="border-y border-line bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:gap-10 md:px-6 md:py-24 lg:grid-cols-[1fr_1.4fr] lg:items-center">
          <SectionHeading
            id="finder-title"
            eyebrow="Product finder"
            title="Not sure where to start?"
            lead="Three questions, and we point you to the categories that fit your bakery and the fastest way to order."
          />
          <Finder compact />
        </div>
      </section>

      <Story />
      <PackagingTeaser />

      <section aria-labelledby="map-title" className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-24">
        <SectionHeading
          id="map-title"
          eyebrow="Regional footprint"
          title="Three hubs, closer to your bakery"
          lead="Kenya since 2009, Uganda since 2016 as Best Ingredients Africa Ltd, and Rwanda since 2024. Tap a hub for address, phone and WhatsApp."
          action={{ href: "/locations", label: "All locations" }}
        />
        <div className="mt-8 md:mt-10">
          <RegionMap />
        </div>
      </section>

      <WholesaleBand />
    </>
  );
}
