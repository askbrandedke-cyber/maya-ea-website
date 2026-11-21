import Link from "next/link";
import { officeDetails, offices } from "@/content/contacts";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { RegionMap } from "@/components/home/RegionMap";
import { WholesaleBand } from "@/components/home/WholesaleBand";
import { metaFor } from "@/lib/meta";

export const metadata = metaFor("/locations");

export default function LocationsPage() {
  return (
    <>
      <section className="bg-ink text-white">
        <div className="mx-auto max-w-7xl px-4 pb-10 pt-8 md:px-6 md:pb-14">
          <Breadcrumbs tone="dark" items={[{ name: "Locations", href: "/locations" }]} />
          <h1 className="mt-5 text-4xl font-bold tracking-tight md:text-5xl">Nairobi, Kampala and Kigali</h1>
          <p className="mt-4 max-w-2xl text-lg text-white/85">
            Three hubs serving bakeries, cafés, food manufacturers, wholesalers and supermarket chains across Kenya, Uganda and Rwanda.
          </p>
        </div>
      </section>
      <section aria-label="Regional map" className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
        <RegionMap headingLevel={2} />
      </section>
      <section aria-labelledby="hubs-title" className="border-t border-line bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
          <h2 id="hubs-title" className="text-2xl font-bold tracking-tight">
            Country pages
          </h2>
          <ul className="mt-6 grid gap-4 md:grid-cols-3">
            {offices.map((o) => {
              const d = officeDetails[o.countryCode];
              return (
                <li key={o.countryCode}>
                  <Link href={`/locations/${d.slug}`} className="group flex h-full flex-col rounded-3xl bg-paper p-6 ring-1 ring-line transition hover:ring-navy">
                    <span className="text-xs font-bold uppercase tracking-[0.18em] text-navy">Since {d.since}</span>
                    <span className="mt-2 text-2xl font-bold">
                      {o.country} · {d.city}
                    </span>
                    <span className="mt-1 font-medium text-ink/75">{o.entity}</span>
                    <span className="mt-3 text-sm">{o.addressLines.join(", ")}</span>
                    <span className="mt-auto pt-5 font-semibold text-navy group-hover:underline">Address, phone and WhatsApp →</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
      <WholesaleBand />
    </>
  );
}
