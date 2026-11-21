import { offices, whatsappLink } from "@/content/contacts";
import type { Office } from "@/content/types";

/** Pre-filled WhatsApp message per country. */
export const waMessage = (country: Office["country"], topic = "bakery ingredients") =>
  `Hello Maya E.A. team, I'm contacting you from the website about ${topic} in ${country}.`;

/** Best click-to-chat link for an office, or a tel: link when no WhatsApp line is published. */
export function chatLink(o: Office, topic?: string) {
  if (o.whatsapp[0]) return { href: whatsappLink(o.whatsapp[0], waMessage(o.country, topic)), kind: "whatsapp" as const, number: o.whatsapp[0] };
  return { href: `tel:${o.phones[0].number.replace(/\s/g, "")}`, kind: "phone" as const, number: o.phones[0].number };
}

export const officeByCode = Object.fromEntries(offices.map((o) => [o.countryCode, o])) as Record<Office["countryCode"], Office>;
