import { offices } from "@/content/contacts";
import { confirm } from "@/content/confirm";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { ContactForm } from "@/components/forms/ContactForm";
import { Confirm } from "@/components/concept/Confirm";
import { WhatsAppIcon } from "@/components/site/icons";
import { metaFor } from "@/lib/meta";
import { chatLink } from "@/lib/whatsapp";

export const metadata = metaFor("/contact");
const tel = (n: string) => `tel:${n.replace(/\s/g, "")}`;

export default function ContactPage() {
  return (
    <>
      <section className="bg-ink text-white">
        <div className="mx-auto max-w-7xl px-4 pb-10 pt-8 md:px-6 md:pb-14">
          <Breadcrumbs tone="dark" items={[{ name: "Contact", href: "/contact" }]} />
          <h1 className="mt-5 text-4xl font-bold tracking-tight md:text-5xl">Contact us</h1>
          <p className="mt-4 max-w-2xl text-lg text-white/85">Call, WhatsApp or email the team in your country, or send a message below.</p>
        </div>
      </section>
      <section aria-labelledby="offices-title" className="mx-auto max-w-7xl px-4 pt-10 md:px-6 md:pt-14">
        <h2 id="offices-title" className="sr-only">
          Regional offices
        </h2>
        <ul className="grid gap-4 md:grid-cols-3">
          {offices.map((o) => {
            const c = chatLink(o);
            return (
              <li key={o.countryCode} className="flex flex-col rounded-3xl bg-white p-6 ring-1 ring-line">
                <h3 className="text-xl font-bold">{o.country}</h3>
                <p className="text-sm font-medium text-ink/75">
                  {o.entity} · {o.role}
                </p>
                <address className="mt-3 text-sm not-italic leading-relaxed">{o.addressLines.join(", ")}</address>
                <ul className="mt-3 grid text-sm">
                  {o.phones.map((p) => (
                    <li key={p.number}>
                      <a href={tel(p.number)} className="inline-flex min-h-10 items-center font-semibold text-navy underline-offset-4 hover:underline">
                        {p.number}
                      </a>
                      <span className="text-ink/75"> · {p.label}</span>
                    </li>
                  ))}
                  {o.emails.map((e) => (
                    <li key={e}>
                      <a href={`mailto:${e}`} className="inline-flex min-h-10 items-center break-all font-semibold text-navy underline-offset-4 hover:underline">
                        {e}
                      </a>
                    </li>
                  ))}
                </ul>
                <div className="mt-auto pt-4">
                  {c.kind === "whatsapp" ? (
                    <a href={c.href} target="_blank" rel="noopener" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[#0B6E4F] px-5 font-semibold text-white">
                      <WhatsAppIcon className="size-5" /> WhatsApp {c.number}
                    </a>
                  ) : (
                    <Confirm text={confirm(`which ${o.country} number takes WhatsApp`)} />
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </section>
      <section aria-label="Message form" className="mx-auto max-w-3xl px-4 py-10 md:px-6 md:py-14">
        <ContactForm />
      </section>
    </>
  );
}
