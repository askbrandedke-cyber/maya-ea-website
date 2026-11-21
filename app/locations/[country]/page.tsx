import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SITE_URL, brand } from "@/content/brand";
import { certifications } from "@/content/certifications";
import { confirm } from "@/content/confirm";
import { directionsUrl, officeDetails, offices } from "@/content/contacts";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { CountryMap } from "@/components/locations/CountryMap";
import { Confirm } from "@/components/concept/Confirm";
import { WhatsAppIcon } from "@/components/site/icons";
import { WholesaleBand } from "@/components/home/WholesaleBand";
import { JsonLd } from "@/lib/jsonld";
import { metaFor } from "@/lib/meta";
import { whatsappLink } from "@/content/contacts";
import { waMessage } from "@/lib/whatsapp";

type Props = { params: Promise<{ country: string }> };

const bySlug = Object.fromEntries(offices.map((o) => [officeDetails[o.countryCode].slug, o]));
const tel = (n: string) => `tel:${n.replace(/\s/g, "")}`;

export const dynamicParams = false;
export function generateStaticParams() {
  return offices.map((o) => ({ country: officeDetails[o.countryCode].slug }));
}
export async function generateMetadata({ params }: Props) {
  const { country } = await params;
  return metaFor(`/locations/${country}`);
}

export default async function CountryPage({ params }: Props) {
  const { country } = await params;
  const o = bySlug[country];
  if (!o) notFound();
  const d = officeDetails[o.countryCode];
  const certs = certifications.filter((c) => (d.certIds as readonly string[]).includes(c.id));
  const path = `/locations/${d.slug}`;

  return (
    <>
      <section className="bg-ink text-white">
        <div className="mx-auto max-w-7xl px-4 pb-10 pt-8 md:px-6 md:pb-14">
          <Breadcrumbs
            tone="dark"
            items={[
              { name: "Locations", href: "/locations" },
              { name: o.country, href: path },
            ]}
          />
          <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-chef">
            {o.role} · since {d.since}
          </p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight md:text-5xl">
            {o.country}: {o.entity}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-white/85">
            {d.sinceNote} {d.extra ?? ""}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr]">
          <div className="grid content-start gap-6">
            <div className="rounded-3xl bg-white p-6 ring-1 ring-line md:p-8">
              <h2 className="text-xl font-bold">Address</h2>
              <address className="mt-3 not-italic leading-relaxed">
                {o.addressLines.map((l) => (
                  <span key={l} className="block">
                    {l}
                  </span>
                ))}
              </address>
              <a href={directionsUrl(o.addressLines)} target="_blank" rel="noopener" className="mt-4 inline-flex min-h-11 items-center font-semibold text-navy underline underline-offset-4">
                Get directions in Google Maps ↗<span className="sr-only"> (opens in a new tab)</span>
              </a>
            </div>
            <div className="rounded-3xl bg-white p-6 ring-1 ring-line md:p-8">
              <h2 className="text-xl font-bold">Talk to the {o.country} team</h2>
              <ul className="mt-4 grid gap-1">
                {o.phones.map((p) => (
                  <li key={p.number}>
                    <a href={tel(p.number)} className="inline-flex min-h-11 items-center gap-3">
                      <span className="w-28 text-sm text-ink/75">{p.label}</span>
                      <span className="font-semibold text-navy underline-offset-4 hover:underline">{p.number}</span>
                    </a>
                  </li>
                ))}
                {o.emails.map((e) => (
                  <li key={e}>
                    <a href={`mailto:${e}`} className="inline-flex min-h-11 items-center gap-3">
                      <span className="w-28 text-sm text-ink/75">Email</span>
                      <span className="break-all font-semibold text-navy underline-offset-4 hover:underline">{e}</span>
                    </a>
                  </li>
                ))}
              </ul>
              <div className="mt-5 flex flex-wrap gap-3">
                {o.whatsapp.length ? (
                  o.whatsapp.map((w) => (
                    <a key={w} href={whatsappLink(w, waMessage(o.country))} target="_blank" rel="noopener" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[#0B6E4F] px-5 font-semibold text-white">
                      <WhatsAppIcon className="size-5" /> WhatsApp {w}
                    </a>
                  ))
                ) : (
                  <Confirm text={confirm(`which ${o.country} number takes WhatsApp`)} />
                )}
              </div>
              <p className="mt-3 text-xs text-ink/75">WhatsApp opens with a short message already written; you can edit it before sending.</p>
            </div>
            <div className="rounded-3xl bg-white p-6 ring-1 ring-line md:p-8">
              <h2 className="text-xl font-bold">Order</h2>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <Link href={`/wholesale?country=${o.countryCode}`} className="inline-flex min-h-12 items-center justify-center rounded-full bg-chef px-6 font-semibold text-ink">
                  Request wholesale pricing
                </Link>
                <a href="https://bakeshed.rw" target="_blank" rel="noopener" className="inline-flex min-h-12 items-center justify-center rounded-full px-6 font-semibold ring-1 ring-ink/25">
                  Shop on Bakeshed ↗
                </a>
              </div>
              {o.countryCode !== "RW" && <Confirm className="mt-3" text={confirm(`whether bakeshed.rw delivers to ${o.country}`)} />}
              {o.website && o.website !== "https://bakeshed.rw" && (
                <p className="mt-4 text-sm">
                  Website:{" "}
                  <a href={o.website} target="_blank" rel="noopener" className="font-semibold text-navy underline underline-offset-4">
                    {o.website.replace(/^https?:\/\//, "")}
                  </a>
                </p>
              )}
            </div>
          </div>

          <div className="grid content-start gap-6">
            <div className="overflow-hidden rounded-3xl bg-white p-4 ring-1 ring-line">
              <CountryMap code={o.countryCode} city={d.city} />
            </div>
            <div className="rounded-3xl bg-white p-6 ring-1 ring-line md:p-8">
              <h2 className="text-xl font-bold">Certifications</h2>
              {certs.length ? (
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  {certs.map((c) => (
                    <li key={c.id} className="flex items-center gap-3 rounded-2xl bg-paper p-3">
                      <Image src={c.image} alt={c.alt} width={56} height={56} className="size-14 rounded-xl bg-white object-contain p-1" />
                      <span className="text-sm">
                        <strong className="block">{c.name}</strong>
                        {c.body} · {c.scope}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <Confirm className="mt-3" text={confirm(`certifications that apply to ${o.country} operations`)} />
              )}
            </div>
          </div>
        </div>
      </section>
      <WholesaleBand />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "@id": `${SITE_URL}${path}#business`,
          name: `${o.entity} (${o.country})`,
          url: `${SITE_URL}${path}`,
          image: `${SITE_URL}${brand.logo.src}`,
          parentOrganization: { "@id": `${SITE_URL}/#organization` },
          address: {
            "@type": "PostalAddress",
            streetAddress: o.addressLines.slice(0, -1).join(", "),
            addressLocality: d.city,
            addressCountry: o.countryCode,
          },
          telephone: o.phones[0].number,
          email: o.emails[0],
          foundingDate: String(d.since),
          ...(o.website ? { sameAs: [o.website] } : {}),
        }}
      />
    </>
  );
}
