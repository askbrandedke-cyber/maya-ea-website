import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { brand, SITE_URL } from "@/content/brand";
import { categoryBySlug } from "@/content/categories";
import { confirm } from "@/content/confirm";
import { offices } from "@/content/contacts";
import { productBySlug, productPath, products, productsIn } from "@/content/products";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { CategoryIcon, WhatsAppIcon } from "@/components/site/icons";
import { Confirm } from "@/components/concept/Confirm";
import { ConceptTag } from "@/components/concept/ConceptTag";
import { PackViewer } from "@/components/packaging/PackViewer";
import { BeforeAfter } from "@/components/packaging/BeforeAfter";
import { WholesaleBand } from "@/components/home/WholesaleBand";
import { JsonLd } from "@/lib/jsonld";
import { metaFor } from "@/lib/meta";
import { backTex, currentPhoto, formatLabel, frontSvg, frontTex, sideTex } from "@/lib/pack-files";
import { chatLink } from "@/lib/whatsapp";

type Props = { params: Promise<{ category: string; product: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return products.map((p) => ({ category: p.category, product: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { category, product } = await params;
  return metaFor(`/products/${category}/${product}`);
}

export default async function ProductPage({ params }: Props) {
  const { category, product } = await params;
  const p = productBySlug[product];
  if (!p || p.category !== category) notFound();
  const c = categoryBySlug[p.category];
  const related = productsIn(p.category).filter((x) => x.slug !== p.slug).slice(0, 6);
  const url = `${SITE_URL}${productPath(p)}`;

  const sizes = p.packSizes.map((s, i) => ({ label: s.label, carton: s.carton, format: s.format, front: frontTex(p, i), frontSm: frontTex(p, i, true) }));

  return (
    <>
      <section className="bg-cream">
        <div className="mx-auto max-w-7xl px-4 pb-12 pt-8 md:px-6 md:pb-16">
          <Breadcrumbs
            items={[
              { name: "Products", href: "/products" },
              { name: c.name, href: `/products/${c.slug}` },
              { name: p.name, href: productPath(p) },
            ]}
          />
          <div className="mt-6 grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-start">
            <div className="order-2 lg:order-1">
              <PackViewer name={p.name} colour={c.colour} sizes={sizes} back={backTex(p)} backSm={backTex(p, true)} side={sideTex(p)} />
            </div>
            <div className="order-1 lg:sticky lg:top-24 lg:order-2">
              <Link href={`/products/${c.slug}`} className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold" style={{ background: c.colour, color: c.ink }}>
                <CategoryIcon name={c.icon} className="size-4" strokeWidth={9} />
                {c.code} · {c.name}
              </Link>
              <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">{p.name}</h1>
              <p className="mt-1 text-lg font-medium text-ink/70">
                {p.descriptor}
                {p.ownLabel === "own-label" ? ` · ${brand.rangeName} range` : ""}
              </p>
              {p.ownLabel === "confirm" && (
                <p className="mt-3">
                  <Confirm text={confirm("is this an own-label product? Shown here only to demonstrate the category colour.")} />
                </p>
              )}
              <p className="mt-5 text-lg leading-relaxed">{p.whatItDoes ?? c.whatItDoes}</p>
              {p.packClaims && (
                <ul className="mt-4 flex flex-wrap gap-2" aria-label="Claims on Maya's current pack">
                  {p.packClaims.map((cl) => (
                    <li key={cl} className="rounded-full bg-white px-3 py-1 text-sm font-semibold ring-1 ring-line">
                      {cl}
                    </li>
                  ))}
                </ul>
              )}
              <dl className="mt-6 grid gap-3 rounded-2xl bg-white p-5 text-sm ring-1 ring-line sm:grid-cols-2">
                <div>
                  <dt className="font-semibold text-ink/75">Pack sizes</dt>
                  <dd className="mt-0.5 font-semibold">
                    {p.packSizes.map((s) => `${s.label}${s.carton ? ` (${s.carton})` : ""}`).join(" · ")}
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-ink/75">Proposed format</dt>
                  <dd className="mt-0.5 font-semibold">{[...new Set(p.packSizes.map((s) => formatLabel[s.format]))].join(" · ")}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="font-semibold text-ink/75">On Bakeshed as</dt>
                  <dd className="mt-0.5">{p.shopName}</dd>
                </div>
              </dl>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <a href={p.shopUrl} target="_blank" rel="noopener" className="inline-flex min-h-12 items-center justify-center rounded-full bg-ink px-6 font-semibold text-white hover:bg-navy">
                  Buy on Bakeshed ↗<span className="sr-only"> (opens in a new tab)</span>
                </a>
                <Link href={`/wholesale?category=${c.slug}&product=${p.slug}`} className="inline-flex min-h-12 items-center justify-center rounded-full bg-chef px-6 font-semibold text-ink hover:bg-chef-tint">
                  Request wholesale pricing
                </Link>
              </div>
              <ul className="mt-3 flex flex-wrap gap-2" aria-label="Ask on WhatsApp or by phone">
                {offices.map((o) => {
                  const ch = chatLink(o, p.name);
                  return (
                    <li key={o.countryCode}>
                      <a href={ch.href} target="_blank" rel="noopener" className="inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 text-sm font-semibold text-[#0B6E4F] ring-1 ring-[#0B6E4F]/30 hover:bg-white">
                        {ch.kind === "whatsapp" && <WhatsAppIcon className="size-4" />}
                        {ch.kind === "whatsapp" ? "WhatsApp" : "Call"} {o.country}
                      </a>
                    </li>
                  );
                })}
              </ul>
              <p className="mt-4 text-xs text-ink/75">Prices are shown on bakeshed.rw. This site does not list prices.</p>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="guide-title" className="mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-20">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-navy">Baker guide</p>
            <h2 id="guide-title" className="mt-2 text-3xl font-bold tracking-tight">
              Using {p.name}
            </h2>
            <dl className="mt-6 divide-y divide-line rounded-3xl bg-white ring-1 ring-line">
              <GuideRow term="How to use">
                {p.dosage ? (
                  <>
                    <p>
                      Use <strong>{p.dosage.minPercent}% to {p.dosage.maxPercent}%</strong> of total flour weight ({p.dosage.minPercent * 10}–{p.dosage.maxPercent * 10} g per 1 kg of flour).
                      {p.usage ? ` ${p.usage}` : ""}
                    </p>
                    <p className="mt-2 text-sm font-semibold text-placeholder">Guide only; follow product instructions.</p>
                    <Link href={`/tools/improver-calculator?product=${p.slug}`} className="mt-3 inline-flex min-h-11 items-center font-semibold text-navy underline underline-offset-4">
                      Calculate for your batch →
                    </Link>
                  </>
                ) : p.usage ? (
                  <p>{p.usage}</p>
                ) : (
                  <Confirm text={confirm(`usage instructions for ${p.name}`)} />
                )}
              </GuideRow>
              <GuideRow term="Storage">{p.storage ? <p>{p.storage}</p> : <Confirm text={confirm("storage instructions")} />}</GuideRow>
              <GuideRow term="Ingredients">{p.ingredients ? <p>{p.ingredients}</p> : <Confirm text={confirm("ingredients")} />}</GuideRow>
              <GuideRow term="Allergens">{p.allergens ? <p>{p.allergens}</p> : <Confirm text={confirm("allergen statement")} />}</GuideRow>
              <GuideRow term="Made in">{p.madeIn ? <p>{p.madeIn.replace("Made in ", "")}</p> : <Confirm text={confirm("country of manufacture")} />}</GuideRow>
              <GuideRow term="Certifications">
                <p>Maya E.A. Limited holds KEBS, UNBS and ISO 22000:2018 certification (Kenya operations; Best Ingredients Africa Ltd, Uganda).</p>
                <Confirm className="mt-2" text={confirm("which marks apply to this product")} />
              </GuideRow>
            </dl>
            {(p.ingredients || p.storage || p.packClaims) && (
              <p className="mt-3 text-xs text-ink/75">Verified details are taken from Maya&apos;s current pack as photographed on bakeshed.rw.</p>
            )}
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-navy">Proposal by BRANDED</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight">Current pack vs concept</h2>
            <BeforeAfter className="mt-6" before={currentPhoto(p)} after={frontTex(p)} name={p.name} />
            {p.photoNote && (
              <p className="mt-3 text-sm">
                <Confirm text={p.photoNote} />
              </p>
            )}
          </div>
        </div>
      </section>

      <section aria-labelledby="panels-title" className="bg-ink py-14 text-white md:py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 id="panels-title" className="text-3xl font-bold tracking-tight">
                Label artwork
              </h2>
              <p className="mt-2 max-w-xl text-white/75">Front and back panels from the packaging system. The QR code on the back opens this page.</p>
            </div>
            <ConceptTag />
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:max-w-4xl">
            {[
              { src: frontTex(p), alt: `${p.name}: concept front panel`, href: frontSvg(p), label: "Front panel" },
              { src: backTex(p), alt: `${p.name}: concept back panel with usage, storage, certifications, contacts and QR code`, href: `/packaging/labels/${p.category}/${p.slug}--back.svg`, label: "Back panel" },
            ].map((x) => (
              <figure key={x.label}>
                <Image src={x.src} alt={x.alt} width={1024} height={1434} sizes="(min-width: 1024px) 28rem, 90vw" className="h-auto w-full rounded-lg" />
                <figcaption className="mt-2 flex items-center justify-between text-sm text-white/80">
                  {x.label}
                  <a href={x.href} target="_blank" rel="noopener" className="inline-flex min-h-11 items-center font-semibold text-chef underline underline-offset-4">
                    Open SVG artwork
                  </a>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section aria-labelledby="rel-title" className="mx-auto max-w-7xl px-4 py-14 md:px-6">
          <h2 id="rel-title" className="text-2xl font-bold tracking-tight">
            More {c.name.toLowerCase()}
          </h2>
          <ul className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {related.map((r) => (
              <li key={r.slug}>
                <Link href={productPath(r)} className="group block">
                  <Image src={frontTex(r, 0, true)} alt={`${r.name}: concept pack`} width={384} height={538} sizes="(min-width: 1024px) 15vw, 45vw" className="h-auto w-full rounded-[5px] shadow-md transition group-hover:-translate-y-1" />
                  <span className="mt-2 block font-semibold">{r.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <WholesaleBand />

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: p.name,
          description: p.whatItDoes ?? c.description,
          category: c.name,
          url,
          image: `${SITE_URL}${currentPhoto(p)}`,
          // Brand/manufacturer only for confirmed own-label products; stand-ins may be bought-in goods.
          ...(p.ownLabel === "own-label"
            ? { brand: { "@type": "Brand", name: brand.rangeName }, manufacturer: { "@id": `${SITE_URL}/#organization` } }
            : { seller: { "@id": `${SITE_URL}/#organization` } }),
          // No `offers`: prices are only published on bakeshed.rw.
        }}
      />
    </>
  );
}

function GuideRow({ term, children }: { term: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1 p-5 sm:grid-cols-[9rem_1fr] sm:gap-4">
      <dt className="font-semibold">{term}</dt>
      <dd className="leading-relaxed">{children}</dd>
    </div>
  );
}
