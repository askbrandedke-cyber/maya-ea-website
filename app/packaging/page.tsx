import Image from "next/image";
import Link from "next/link";
import { brand, CONCEPT_TAG } from "@/content/brand";
import { categories, categoryBySlug, families } from "@/content/categories";
import { confirm } from "@/content/confirm";
import { productBySlug, productPath, shelfProducts } from "@/content/products";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { CategoryIcon } from "@/components/site/icons";
import { Confirm } from "@/components/concept/Confirm";
import { ConceptTag } from "@/components/concept/ConceptTag";
import { BeforeAfter } from "@/components/packaging/BeforeAfter";
import { PackViewer } from "@/components/packaging/PackViewer";
import { ShelfToggle } from "@/components/packaging/ShelfToggle";
import { SectionHeading } from "@/components/home/SectionHeading";
import { metaFor } from "@/lib/meta";
import { backTex, currentPhoto, frontTex, sideTex } from "@/lib/pack-files";

export const metadata = metaFor("/packaging");

/** WCAG relative-luminance contrast, so the table shows real numbers. */
function contrast(a: string, b: string) {
  const lum = (h: string) => {
    const [r, g, bl] = [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
    return 0.2126 * r + 0.7152 * g + 0.0722 * bl;
  };
  const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
}

const PROBLEMS: [string, string, string][] = [
  ["volume-plus", "Green ornamental frame, serif name", "Volume Plus"],
  ["excess", "Photo split, orange script name", "Excess"],
  ["bread-softener", "Full-bleed photo, bold sans name", "Bread Softener"],
  ["easy-mix", "White sack, purple and yellow bands", "Easy Mix"],
  ["blondy-vanilla-sponge", "White carton, script name", "Blondy Vanilla Sponge"],
  ["coconut-flavour", "Plain sticker on a jerrycan", "Coconut Flavour"],
];

const ZONES = [
  ["A", "Brand band", "Navy. Maya logo on a white plate, fixed size and position on every pack. BAKESHED range name, category, code badge."],
  ["B", "Signature stripe", "Chef yellow, identical on every pack. The one cue that says Maya from across a warehouse."],
  ["C", "Colour field", "Category colour. Descriptor, then product name, then what it does. Only claims printed on Maya's current packs."],
  ["D", "Info strip", "White. Net weight or size, carton line, category tile with icon and code."],
  ["E", "Concept tag", `“${CONCEPT_TAG}” on every concept panel: front, side and back.`],
];

const GALLERY = ["mega-plus", "excess", "red-velvet", "colour-vermicelli", "icing-sugar", "caramel"];

export default function PackagingPage() {
  const shelf = shelfProducts()
    .sort((a, b) => categoryBySlug[a.category].index - categoryBySlug[b.category].index)
    .map((p) => {
      const c = categoryBySlug[p.category];
      return { slug: p.slug, name: p.name, href: productPath(p), code: c.code, category: c.name, family: families[c.family], concept: frontTex(p, 0, true), current: currentPhoto(p) };
    });
  const vp = productBySlug["volume-plus"];
  const vpc = categoryBySlug[vp.category];

  return (
    <>
      <section className="relative overflow-hidden bg-ink text-white">
        <div className="mx-auto max-w-7xl px-4 pb-12 pt-8 md:px-6 md:pb-16">
          <Breadcrumbs tone="dark" items={[{ name: "Packaging proposal", href: "/packaging" }]} />
          <p className="mt-8 text-xs font-bold uppercase tracking-[0.2em] text-chef">Proposal by BRANDED Agency · not current packaging</p>
          <h1 className="mt-3 max-w-4xl text-balance text-4xl font-bold tracking-tight md:text-6xl">A packaging system for the Bakeshed range</h1>
          <p className="mt-5 max-w-2xl text-lg text-white/85">
            One label architecture for all 14 categories: the {brand.name} logo fixed on every pack, a colour per category, a clear front of pack and a useful
            back panel with a QR code to each product&apos;s baker guide.
          </p>
          <div className="mt-6">
            <ConceptTag />
          </div>
        </div>
      </section>

      {/* 1. Problem */}
      <section aria-labelledby="problem-title" className="mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-20">
        <SectionHeading
          id="problem-title"
          eyebrow="01 · The problem"
          title="Six own-label packs, six different designs"
          lead="Today each Bakeshed pack is designed on its own: different colours, typefaces and logo positions, even within one category. On a shelf or in a WhatsApp photo the range does not read as one company."
        />
        <ul className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {PROBLEMS.map(([slug, note, name]) => (
            <li key={slug} className="rounded-2xl bg-white p-3 ring-1 ring-line">
              <div className="relative aspect-square">
                <Image src={currentPhoto(productBySlug[slug])} alt={`${name}: current pack photo from bakeshed.rw`} fill sizes="(min-width:1024px) 15vw, 45vw" className="object-contain" />
              </div>
              <p className="mt-2 text-sm font-semibold">{name}</p>
              <p className="text-xs text-ink/75">{note}</p>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-ink/75">Photos: current packs as shown on bakeshed.rw, November 2026.</p>
      </section>

      {/* 2. System */}
      <section aria-labelledby="system-title" className="border-y border-line bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-20">
          <SectionHeading
            id="system-title"
            eyebrow="02 · The system"
            title="Five fixed zones on every front panel"
            lead="A 600 × 840 grid (module 40). The zones never move, so packs line up on a shelf and a buyer learns the layout once."
          />
          <div className="mt-10 grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-center">
            <Image src="/packaging/system/anatomy.webp" alt="Front panel anatomy: brand band, signature stripe, colour field, info strip and concept tag, with the 40-unit grid" width={1600} height={904} sizes="(min-width:1024px) 55vw, 95vw" className="h-auto w-full rounded-2xl ring-1 ring-line" />
            <ol className="grid gap-4">
              {ZONES.map(([k, t, d]) => (
                <li key={k} className="flex gap-4">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-ink font-bold text-chef">{k}</span>
                  <span>
                    <strong className="block">{t}</strong>
                    <span className="text-ink/80">{d}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>

          <h3 className="mt-16 text-2xl font-bold tracking-tight">Colour per category</h3>
          <p className="mt-2 max-w-3xl text-ink/80">
            Every colour passes WCAG AA (4.5:1) with its text colour. Because no 14-colour palette stays distinct for colour-blind readers, every pack also
            carries a two-letter code and an icon.
          </p>
          <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-7">
            {categories.map((c) => (
              <li key={c.slug} className="flex min-h-36 flex-col justify-between rounded-2xl p-3" style={{ background: c.colour, color: c.ink }}>
                <span className="flex items-start justify-between">
                  <span className="text-xs font-bold">
                    {c.code} · {String(c.index).padStart(2, "0")}
                  </span>
                  <CategoryIcon name={c.icon} className="size-7" strokeWidth={7} />
                </span>
                <span>
                  <span className="block text-sm font-semibold leading-tight">{c.name}</span>
                  <span className="mt-1 block font-mono text-xs">{c.colour}</span>
                  <span className="block text-xs">Contrast {contrast(c.colour, c.ink).toFixed(1)}:1</span>
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm">
            Full rules, type scale and grid:{" "}
            <a href="/packaging/system/palette.svg" className="font-semibold text-navy underline underline-offset-4">
              palette SVG
            </a>{" "}
            · PACKAGING-SYSTEM.md in the project.
          </p>
        </div>
      </section>

      {/* 3. Shelf */}
      <section aria-labelledby="shelf-title" className="bg-ink py-14 text-white md:py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <SectionHeading
            tone="dark"
            id="shelf-title"
            eyebrow="03 · Shelf view"
            title="The range, side by side"
            lead="One pack per category, grouped as Bread, Cakes & finishing, and Packaging. Switch between today's packs and the concept system."
          />
          <div className="mt-10">
            <ShelfToggle items={shelf} />
          </div>
        </div>
      </section>

      {/* 4. Before / after */}
      <section aria-labelledby="ba-title" className="mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-20">
        <SectionHeading id="ba-title" eyebrow="04 · Before and after" title="Current pack vs concept" lead="Drag each slider (or use the arrow keys) to compare." />
        <ul className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {GALLERY.map((slug) => {
            const p = productBySlug[slug];
            return (
              <li key={slug}>
                <BeforeAfter before={currentPhoto(p)} after={frontTex(p)} name={p.name} sizes="(min-width:1024px) 30vw, (min-width:768px) 45vw, 90vw" />
                {p.photoNote && <Confirm className="mt-2" text={p.photoNote} />}
              </li>
            );
          })}
        </ul>
      </section>

      {/* 5. 3D formats */}
      <section aria-labelledby="formats-title" className="border-y border-line bg-cream">
        <div className="mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-20">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
            <div>
              <SectionHeading
                id="formats-title"
                eyebrow="05 · One system, six formats"
                title="Sack, carton, pouch, tub, jerrycan, sleeve"
                lead="The same zones work on every format the range uses. Turn the pack, switch formats, and flip to the back panel with usage, storage, certifications, contacts and the QR code."
              />
              <Link href={productPath(vp)} className="mt-6 inline-flex min-h-11 items-center font-semibold text-navy underline underline-offset-4">
                Open the Volume Plus product page →
              </Link>
            </div>
            <PackViewer
              name={vp.name}
              colour={vpc.colour}
              sizes={vp.packSizes.map((s, i) => ({ label: s.label, carton: s.carton, format: s.format, front: frontTex(vp, i), frontSm: frontTex(vp, i, true) }))}
              back={backTex(vp)}
              backSm={backTex(vp, true)}
              side={sideTex(vp)}
            />
          </div>
        </div>
      </section>

      {/* 6. Next steps */}
      <section aria-labelledby="next-title" className="mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-20">
        <SectionHeading id="next-title" eyebrow="06 · Next steps" title="What the proposal needs from Maya" />
        <ul className="mt-8 grid gap-3 md:grid-cols-2">
          {[
            confirm("brand hierarchy: Maya logo as master, Bakeshed as range name"),
            confirm("which unbranded shop products are Maya's own label"),
            confirm("vector logo file (AI, SVG or PDF)"),
            confirm("real pack dimensions and dielines from the packaging supplier"),
            confirm("usage, storage, ingredients and allergens for each product"),
            confirm("which certification marks may be printed on which product"),
            confirm("registration numbers, barcodes and language requirements per country"),
            confirm("print proof and CMYK/Pantone match for the 14 category colours"),
          ].map((t) => (
            <li key={t}>
              <Confirm as="div" text={t} className="w-full" />
            </li>
          ))}
        </ul>
        <p className="mt-8 max-w-3xl text-ink/80">
          {CONCEPT_TAG}. Nothing on this page is Maya&apos;s current packaging. Partner brands (for example Niacet, Dairyland, Bakeland) keep their own packs.
        </p>
      </section>
    </>
  );
}
