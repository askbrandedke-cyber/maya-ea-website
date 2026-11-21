import { confirm } from "@/content/confirm";
import { offices } from "@/content/contacts";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { Confirm } from "@/components/concept/Confirm";
import { metaFor } from "@/lib/meta";

export const metadata = metaFor("/privacy");

/**
 * DRAFT written by BRANDED to describe what this website's forms actually do.
 * Must be reviewed by Maya's legal adviser before go-live.
 */
export default function PrivacyPage() {
  return (
    <>
      <section className="bg-ink text-white">
        <div className="mx-auto max-w-3xl px-4 pb-10 pt-8 md:px-6">
          <Breadcrumbs tone="dark" items={[{ name: "Privacy notice", href: "/privacy" }]} />
          <h1 className="mt-5 text-4xl font-bold tracking-tight">Privacy notice</h1>
          <p className="mt-3 text-white/85">How this website handles the details you send through its forms.</p>
        </div>
      </section>
      <article className="mx-auto max-w-3xl px-4 py-10 leading-relaxed md:px-6 [&_h2]:mt-10 [&_h2]:text-2xl [&_h2]:font-bold [&_li]:mt-1 [&_p]:mt-3 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-6">
        <Confirm as="p" text={confirm("draft by BRANDED. Maya's legal adviser must review this notice (Kenya Data Protection Act 2019, Uganda Data Protection and Privacy Act 2019, Rwanda Law No. 058/2021) before go-live")} />

        <h2>What we collect</h2>
        <p>Only what you type into a form on this website:</p>
        <ul>
          <li>Wholesale enquiry: business type, product categories, order frequency and quantity, delivery country, your name, business name, phone number, email and preferred contact method.</li>
          <li>Contact message: name, email, country and your message.</li>
        </ul>
        <p>This website does not use advertising cookies. <Confirm text={confirm("analytics tool, if Maya adds one")} /></p>

        <h2>Why we use it</h2>
        <p>To reply to your enquiry and, if you ask for it, to prepare wholesale pricing and supply terms. We do not sell your details.</p>

        <h2>Where it goes</h2>
        <p>
          Your enquiry is sent by email to the Maya team in the country you choose (Kenya, Uganda or Rwanda). Emails are delivered by an email service
          provider acting on our behalf. <Confirm text={confirm("name of email provider and its data location, e.g. Resend")} />
        </p>

        <h2>How long we keep it</h2>
        <p>
          <Confirm text={confirm("retention period for enquiry emails")} />
        </p>

        <h2>Your rights</h2>
        <p>
          You can ask to see, correct or delete the details you sent us. Contact the office for your country:
        </p>
        <ul>
          {offices.map((o) => (
            <li key={o.countryCode}>
              {o.country}: <a href={`mailto:${o.emails[0]}`} className="inline-flex min-h-6 items-center break-all font-semibold text-navy underline underline-offset-4">{o.emails[0]}</a>
            </li>
          ))}
        </ul>

        <h2>Who is responsible</h2>
        <p>
          <Confirm text={confirm("data controller name, registered address and data protection contact for each country")} />
        </p>
        <p className="text-sm text-ink/75">Last updated: <Confirm text={confirm("date of legal approval")} /></p>
      </article>
    </>
  );
}
