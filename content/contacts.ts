import { confirm } from "./confirm";
import type { Office } from "./types";

/** From mayaealtd.com/contact and footer (re-checked 16 Nov 2026). */
export const offices: Office[] = [
  {
    country: "Kenya",
    countryCode: "KE",
    entity: "Maya E.A. Limited",
    role: "Headquarters (HQ)",
    addressLines: [
      "Off Mombasa Road, ICD Road",
      "Inside Ideal Ceramics Building, Go-down 1C",
      "Nairobi, Kenya",
    ],
    phones: [{ label: "Office", number: "+254 773 864 849" }],
    whatsapp: ["+254 743 590 495", "+254 706 362 534"],
    emails: ["info@mayaealtd.com"],
    website: "https://www.mayaealtd.com",
    shopUrl: "https://bakeshed.rw",
  },
  {
    country: "Uganda",
    countryCode: "UG",
    entity: "Best Ingredients Africa Ltd",
    role: "Uganda operations",
    addressLines: [
      "Plot 94, Block 112, Kolo Namanve Industrial Park",
      "P.O. Box 4224, Kampala, Uganda",
    ],
    phones: [
      { label: "Office", number: "+256 788 722 180" },
      { label: "Office", number: "+256 759 097 176" },
      { label: "Office", number: "+256 750 357 947" },
    ],
    /** The live site does not say which Uganda line takes WhatsApp. */
    whatsapp: [],
    emails: ["bestingredientskampala@gmail.com"],
    website: "https://www.bestingredientsafrica.com",
    shopUrl: "https://bakeshed.rw",
  },
  {
    country: "Rwanda",
    countryCode: "RW",
    entity: "Maya E.A. Limited",
    role: "Rwanda operations · Bakeshed shop",
    addressLines: [
      "GS, Street Rda/2, Kigali Special Economic Zone",
      "Gasabo District, Kigali, Rwanda",
    ],
    phones: [
      { label: "Office", number: "+250 793 902 825" },
      { label: "Additional line", number: "+250 795 027 270" },
    ],
    whatsapp: ["+250 795 598 607"],
    emails: ["info@bakeshed.rw"],
    website: "https://bakeshed.rw",
    shopUrl: "https://bakeshed.rw",
  },
];

export const ugandaWhatsappPlaceholder = confirm("which Uganda number takes WhatsApp");

export const socials = [
  { name: "Facebook", href: "https://www.facebook.com/share/1DnuCTowvZ/?mibextid=qi2Omg" },
  { name: "X", href: "https://twitter.com/mayaearwd" },
  { name: "Instagram", href: "https://www.instagram.com/mayaearwd/" },
];

/** wa.me link with a pre-filled message. */
export const whatsappLink = (number: string, message: string) =>
  `https://wa.me/${number.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;

/** Per-country page facts, from mayaealtd.com About (milestones) and certifications. */
export const officeDetails = {
  KE: {
    slug: "kenya",
    city: "Nairobi",
    since: 2009,
    sinceNote: "Maya E.A. Limited was established in Kenya in 2009.",
    certIds: ["kebs", "iso-ke"],
    extra: undefined as string | undefined,
  },
  UG: {
    slug: "uganda",
    city: "Kampala",
    since: 2016,
    sinceNote: "Maya expanded to Uganda in 2016 as Best Ingredients Africa Limited.",
    certIds: ["unbs", "iso-ug"],
    extra: undefined as string | undefined,
  },
  RW: {
    slug: "rwanda",
    city: "Kigali",
    since: 2024,
    sinceNote: "Maya opened operations in Rwanda in 2024.",
    certIds: [] as string[],
    extra: "Rwanda operations serve Eastern Congo and Burundi (mayaealtd.com, About).",
  },
} as const;

export const directionsUrl = (lines: string[]) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(lines.join(", "))}`;
