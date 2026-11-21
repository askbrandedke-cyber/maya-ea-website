import Image from "next/image";
import Link from "next/link";
import { brand } from "@/content/brand";
import { certifications } from "@/content/certifications";
import { customers, expertise, milestones, mission, missionConfirm, partners, partnersConfirm, story, values, valuesConfirm, vision } from "@/content/company";
import { Confirm } from "@/components/concept/Confirm";
import { PageHero } from "@/components/site/PageHero";
import { SectionHeading } from "@/components/home/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { WholesaleBand } from "@/components/home/WholesaleBand";
import { metaFor } from "@/lib/meta";

export const metadata = metaFor("/about");

export default function AboutPage() {
  return (
    <>
      <PageHero crumbs={[{ name: "About", href: "/about" }]} eyebrow={`Since ${brand.founded}`} title="About Maya E.A. Limited" lead="A regional supply partner for bakers and food manufacturers in Kenya, Uganda and Rwanda." />

      <section aria-labelledby="story-title" className="mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
          <SectionHeading id="story-title" eyebrow="Who we are" title="From one baking-input supplier to a regional operation" />
          <div className="grid gap-4 text-lg leading-relaxed text-ink/85">
            {story.map((p) => (
              <p key={p.slice(0, 20)}>{p}</p>
            ))}
            <p className="text-base">
              <strong>We supply:</strong> {customers.join(", ").toLowerCase()}.
            </p>
          </div>
        </div>
      </section>

      <section aria-labelledby="ms-title" className="border-y border-line bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-20">
          <SectionHeading id="ms-title" eyebrow="Milestones" title="2009 to today" />
          <ol className="relative mt-10 grid gap-6 md:grid-cols-3 lg:grid-cols-6">
            {milestones.map((m, i) => (
              <li key={m.year}>
                <Reveal delay={i * 0.06} className="h-full rounded-2xl bg-paper p-5 ring-1 ring-line">
                  <p className="text-3xl font-bold text-navy">{m.year}</p>
                  <h3 className="mt-2 font-semibold">{m.title}</h3>
                  <p className="mt-1 text-sm text-ink/80">{m.text}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="mv-title" className="mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-20">
        <h2 id="mv-title" className="sr-only">
          Mission and vision
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          {[
            ["Our mission", mission],
            ["Our vision", vision],
          ].map(([t, d]) => (
            <Reveal key={t} className="rounded-3xl bg-ink p-8 text-white">
              <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-chef">{t}</h3>
              <p className="mt-3 text-2xl font-semibold leading-snug">{d}</p>
            </Reveal>
          ))}
        </div>
        <Confirm className="mt-4" text={missionConfirm} />

        <h2 className="mt-16 text-3xl font-bold tracking-tight">Our values</h2>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v) => (
            <li key={v.name} className="rounded-2xl bg-white p-5 ring-1 ring-line">
              <h3 className="font-semibold">{v.name}</h3>
              <p className="mt-1 text-sm text-ink/80">{v.text}</p>
            </li>
          ))}
        </ul>
        <Confirm className="mt-4" text={valuesConfirm} />
      </section>

      <section aria-labelledby="exp-title" className="border-y border-line bg-cream">
        <div className="mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-20">
          <SectionHeading
            id="exp-title"
            eyebrow="Our expertise"
            title="Core bakery inputs, premixes and support"
            lead="We work with established suppliers across Europe, the Middle East and Asia, and support customers with practical guidance on application, performance and more consistent production."
            action={{ href: "/products", label: "Browse products" }}
          />
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {expertise.map((e) => (
              <li key={e.name} className="rounded-2xl bg-white p-5 ring-1 ring-line">
                <h3 className="font-semibold">{e.name}</h3>
                <p className="mt-1 text-sm text-ink/80">{e.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="cert-title" className="mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-20">
        <SectionHeading id="cert-title" eyebrow="Quality assurance" title="Certifications" />
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {certifications.map((c) => (
            <li key={c.id} className="flex items-center gap-4 rounded-2xl bg-white p-4 ring-1 ring-line">
              <Image src={c.image} alt={c.alt} width={72} height={72} className="size-18 shrink-0 object-contain" />
              <span>
                <strong className="block">{c.name}</strong>
                <span className="text-sm text-ink/80">
                  {c.body} · {c.scope}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="partners-title" className="border-t border-line bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-20">
          <SectionHeading id="partners-title" eyebrow="Supplier partners" title="Partners in Europe, the Middle East and Asia" lead="Supplier relationships that bring a broader ingredient portfolio into the East African bakery market." />
          <ul className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-7">
            {partners.map((p) => (
              <li key={p.name} className="flex flex-col items-center gap-2 rounded-2xl bg-paper p-4 text-center ring-1 ring-line">
                <span className="flex h-20 w-full items-center justify-center">
                  {p.logo ? (
                    <Image src={p.logo} alt={`${p.name} logo`} width={200} height={120} className="max-h-20 w-auto object-contain" />
                  ) : (
                    <span aria-hidden className="flex size-16 items-center justify-center rounded-full bg-ink text-2xl font-bold text-white">
                      {p.name[0]}
                    </span>
                  )}
                </span>
                <span className="text-sm font-semibold">{p.name}</span>
                <span className="text-xs text-ink/75">{p.country}</span>
              </li>
            ))}
          </ul>
          <Confirm className="mt-4" text={partnersConfirm} />
          <p className="mt-8">
            <Link href="/team" className="font-semibold text-navy underline underline-offset-4">
              Meet the team →
            </Link>
          </p>
        </div>
      </section>
      <WholesaleBand />
    </>
  );
}
