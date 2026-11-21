import { brand } from "@/content/brand";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { WholesaleForm } from "@/components/forms/WholesaleForm";
import { metaFor } from "@/lib/meta";

export const metadata = metaFor("/wholesale");

export default function WholesalePage() {
  return (
    <>
      <section className="bg-ink text-white">
        <div className="mx-auto max-w-7xl px-4 pb-10 pt-8 md:px-6 md:pb-14">
          <Breadcrumbs tone="dark" items={[{ name: "Request wholesale pricing", href: "/wholesale" }]} />
          <h1 className="mt-5 text-4xl font-bold tracking-tight md:text-5xl">Request wholesale pricing</h1>
          <p className="mt-4 max-w-2xl text-lg text-white/85">
            Four short steps. Tell us about your business, the products you need and your volumes, and the {brand.name} team in your country will
            come back with pricing and supply terms.
          </p>
        </div>
      </section>
      <section aria-label="Wholesale enquiry form" className="mx-auto max-w-4xl px-4 py-10 md:px-6 md:py-14">
        <WholesaleForm />
      </section>
    </>
  );
}
