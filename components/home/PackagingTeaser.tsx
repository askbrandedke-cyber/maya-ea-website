import Image from "next/image";
import Link from "next/link";
import { categoryBySlug } from "@/content/categories";
import { productBySlug, productPath, shelfProducts } from "@/content/products";
import { BeforeAfter } from "@/components/packaging/BeforeAfter";
import { ConceptTag } from "@/components/concept/ConceptTag";
import { currentPhoto, frontTex } from "@/lib/pack-files";
import { SectionHeading } from "./SectionHeading";

export function PackagingTeaser() {
  const vp = productBySlug["volume-plus"];
  const shelf = shelfProducts().sort((a, b) => categoryBySlug[a.category].index - categoryBySlug[b.category].index);
  return (
    <section aria-labelledby="pack-title" className="overflow-hidden bg-ink py-12 text-white md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <SectionHeading
          tone="dark"
          id="pack-title"
          eyebrow="Proposal by BRANDED Agency"
          title="One range, one system: a packaging proposal for Bakeshed"
          lead="Today every own-label pack is designed differently. The proposal gives each category a colour, code and icon, and keeps the Maya logo in the same place on every pack."
          action={{ href: "/packaging", label: "See the full proposal" }}
        />
        <div className="mt-10 grid items-center gap-10 lg:grid-cols-2">
          <div className="rounded-3xl bg-paper p-3 text-ink">
            <BeforeAfter before={currentPhoto(vp)} after={frontTex(vp)} name="Volume Plus bread improver" />
          </div>
          <ul className="grid gap-3 text-sm text-white/85 md:gap-4 md:text-base">
            {[
              ["Maya logo fixed", "Same size and position on every front and back panel."],
              ["Colour per category", "14 colours, each tested for WCAG AA contrast, plus a code and icon for colour-blind readers."],
              ["Clear front of pack", "Product name, then what it does, then pack size."],
              ["Useful back panel", "Verified usage only, storage, certifications, three country contacts and a QR code to the baker guide."],
            ].map(([t, d]) => (
              <li key={t} className="flex gap-3 md:gap-4 md:rounded-2xl md:bg-white/5 md:p-5 md:ring-1 md:ring-white/10">
                <span aria-hidden className="mt-1 size-3 shrink-0 rounded-sm bg-chef" />
                <span>
                  <strong className="block font-semibold text-white md:text-lg">{t}</strong>
                  {d}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Shelf strip: scroll horizontally on touch, auto layout on wide screens */}
      <div className="mt-14">
        <div className="mx-auto flex max-w-7xl flex-col items-start gap-2 px-4 sm:flex-row sm:items-center sm:justify-between md:px-6">
          <h3 className="text-lg font-semibold">Shelf view: one pack per category</h3>
          <ConceptTag />
        </div>
        <ul className="no-scrollbar mt-5 flex snap-x gap-4 overflow-x-auto px-4 pb-6 md:px-6" aria-label="Concept packs, one per category">
          {shelf.map((p) => {
            const c = categoryBySlug[p.category];
            return (
              <li key={p.slug} className="w-28 shrink-0 snap-start md:w-32">
                <Link href={productPath(p)} className="group block">
                  <Image
                    src={frontTex(p, 0, true)}
                    alt={`${p.name}, ${c.name}: concept pack`}
                    width={384}
                    height={538}
                    sizes="128px"
                    className="h-auto w-full rounded-[5px] shadow-[0_18px_30px_-12px_rgba(0,0,0,.6)] transition duration-300 group-hover:-translate-y-1.5"
                  />
                  <span className="mt-2 block text-xs font-semibold text-white/80">
                    {c.code} · {c.name}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
        <div aria-hidden className="mx-4 h-3 rounded-full bg-[#8A7A62]/80 md:mx-6" />
      </div>
    </section>
  );
}
