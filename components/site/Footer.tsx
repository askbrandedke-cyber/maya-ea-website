import Image from "next/image";
import Link from "next/link";
import { brand, CONCEPT_TAG } from "@/content/brand";
import { certifications } from "@/content/certifications";
import { offices, socials } from "@/content/contacts";
import { footerNav } from "@/content/site";
import { chatLink } from "@/lib/whatsapp";
import { Logo } from "./Logo";

const tel = (n: string) => `tel:${n.replace(/\s/g, "")}`;

export function Footer() {
  return (
    <footer className="bg-night text-white/80">
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-14">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_2fr]">
          <div>
            <Logo height={60} link={false} />
            <p className="mt-4 max-w-xs text-sm leading-relaxed">
              {brand.legalName}. {brand.tagline}. Serving Kenya, Uganda and Rwanda since {brand.founded}.
            </p>
            <ul className="mt-5 flex gap-2" aria-label="Social media">
              {socials.map((s) => (
                <li key={s.name}>
                  <a href={s.href} target="_blank" rel="noopener" className="inline-flex min-h-11 items-center rounded-full px-4 text-sm font-medium ring-1 ring-white/20 hover:bg-white/10">
                    {s.name}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 sm:gap-8">
            {footerNav.map((col, ci) => (
              <nav key={col.heading} aria-label={col.heading} className={ci === 0 ? "col-span-2 sm:col-span-1" : ""}>
                <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-chef">{col.heading}</h2>
                <ul className={`mt-3 grid gap-0.5 text-sm ${ci === 0 ? "grid-cols-2 gap-x-4 sm:grid-cols-1" : ""}`}>
                  {col.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="inline-flex min-h-8 items-center hover:text-white">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="mt-10 grid gap-6 border-t border-white/10 pt-8 md:mt-12 md:grid-cols-3 md:pt-10">
          {offices.map((o) => {
            const chat = chatLink(o);
            return (
              <address key={o.countryCode} className="not-italic text-sm leading-relaxed">
                <h2 className="font-semibold text-white">
                  {o.country} <span className="font-normal text-white/60">· {o.role}</span>
                </h2>
                <p className="mt-1 text-white/70">{o.entity}</p>
                <p>{o.addressLines.join(", ")}</p>
                <p className="mt-2 flex flex-wrap gap-x-3">
                  <a className="inline-flex min-h-7 items-center underline-offset-2 hover:underline" href={tel(o.phones[0].number)}>
                    {o.phones[0].number}
                  </a>
                  {chat.kind === "whatsapp" && (
                    <a className="inline-flex min-h-7 items-center underline-offset-2 hover:underline" href={chat.href} target="_blank" rel="noopener">
                      WhatsApp {chat.number}
                    </a>
                  )}
                </p>
                <a className="inline-flex min-h-7 items-center underline-offset-2 hover:underline" href={`mailto:${o.emails[0]}`}>
                  {o.emails[0]}
                </a>
              </address>
            );
          })}
        </div>

        <div className="mt-10 flex flex-col gap-6 border-t border-white/10 pt-8 md:flex-row md:items-center md:justify-between">
          <ul className="flex flex-wrap items-center gap-3" aria-label="Certifications">
            {certifications.map((c) => (
              <li key={c.id} className="flex items-center gap-2 rounded-lg bg-white px-2 py-1">
                <Image src={c.image} alt={c.alt} width={36} height={36} className="size-9 object-contain" />
                <span className="pr-1 text-xs font-semibold text-ink">{c.name}</span>
              </li>
            ))}
          </ul>
          <div className="text-xs text-white/60 md:text-right">
            <p className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 font-medium text-white/80">
              <span className="size-2.5 rounded-sm bg-chef" aria-hidden />
              Packaging shown on this site: {CONCEPT_TAG}
            </p>
            <p className="mt-3">© {new Date().getFullYear()} {brand.name}. All rights reserved. Website proposal by BRANDED Agency.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
