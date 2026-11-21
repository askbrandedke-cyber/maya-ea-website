import Image from "next/image";
import { press } from "@/content/company";
import { PageHero } from "@/components/site/PageHero";
import { metaFor } from "@/lib/meta";

export const metadata = metaFor("/press");
const fmt = (d: string) => new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

export default function PressPage() {
  return (
    <>
      <PageHero crumbs={[{ name: "Press & news", href: "/press" }]} title="Press & news" lead="News coverage and company updates from Maya E.A. Limited." />
      <div className="mx-auto max-w-5xl px-4 py-14 md:px-6 md:py-20">
        <ul className="grid gap-8">
          {press.map((a) => (
            <li key={a.url}>
              <article className="grid overflow-hidden rounded-3xl bg-white ring-1 ring-line md:grid-cols-[1fr_1.1fr]">
                <Image src={a.image} alt={`Photo from The New Times article: ${a.title}`} width={1000} height={666} sizes="(min-width:768px) 45vw, 95vw" className="h-full w-full object-cover" />
                <div className="p-6 md:p-8">
                  <p className="text-sm font-semibold text-navy">
                    {a.outlet} · <time dateTime={a.date}>{fmt(a.date)}</time> · {a.place}
                  </p>
                  <h2 className="mt-3 text-2xl font-bold leading-snug tracking-tight">{a.title}</h2>
                  <p className="mt-3 text-ink/80">{a.summary}</p>
                  <a href={a.url} target="_blank" rel="noopener" className="mt-5 inline-flex min-h-12 items-center rounded-full bg-ink px-5 font-semibold text-white">
                    Read the full article ↗<span className="sr-only"> on The New Times (opens in a new tab)</span>
                  </a>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
