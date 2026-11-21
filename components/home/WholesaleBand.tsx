import Link from "next/link";
import { offices } from "@/content/contacts";
import { chatLink } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/site/icons";

export function WholesaleBand() {
  return (
    <section aria-labelledby="ws-title" className="bg-chef">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 md:px-6 lg:grid-cols-[1.4fr_1fr] lg:items-center">
        <div>
          <h2 id="ws-title" className="text-balance text-3xl font-bold tracking-tight text-ink md:text-[2.6rem] md:leading-[1.1]">
            Need bulk quantities or a recurring supply arrangement?
          </h2>
          <p className="mt-3 max-w-2xl text-lg text-ink/80">
            Tell us your business type, products and volumes. Our team in Kenya, Uganda or Rwanda will come back with wholesale pricing.
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <Link href="/wholesale" className="inline-flex min-h-14 items-center justify-center rounded-full bg-ink px-8 text-lg font-semibold text-white hover:bg-navy">
            Request wholesale pricing
          </Link>
          <ul className="flex flex-wrap justify-center gap-2 lg:justify-start" aria-label="WhatsApp or call by country">
            {offices.map((o) => {
              const c = chatLink(o, "wholesale pricing");
              return (
                <li key={o.countryCode}>
                  <a href={c.href} target="_blank" rel="noopener" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-white/70 px-4 text-sm font-semibold text-ink hover:bg-white">
                    {c.kind === "whatsapp" && <WhatsAppIcon className="size-4" />}
                    {c.kind === "whatsapp" ? "WhatsApp" : "Call"} {o.country}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
