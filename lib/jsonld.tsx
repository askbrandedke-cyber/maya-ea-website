import { brand, SITE_URL } from "@/content/brand";
import { offices, socials } from "@/content/contacts";

const address = (lines: string[], country: string, code: string) => ({
  "@type": "PostalAddress",
  streetAddress: lines.slice(0, -1).join(", "),
  addressLocality: lines[lines.length - 1].split(",")[0],
  addressCountry: code,
  name: country,
});

/** Organization with all three locations (rendered in the root layout). */
export function organizationJsonLd() {
  const hq = offices[0];
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: brand.name,
    legalName: brand.legalName,
    url: SITE_URL,
    logo: `${SITE_URL}${brand.logo.src}`,
    description: "Manufacturer and distributor of bakery ingredients and food additives in Kenya, Uganda and Rwanda.",
    foundingDate: String(brand.founded),
    foundingLocation: "Kenya",
    email: hq.emails[0],
    telephone: hq.phones[0].number,
    address: address(hq.addressLines, hq.country, hq.countryCode),
    areaServed: offices.map((o) => o.country),
    sameAs: socials.map((s) => s.href),
    location: offices.map((o) => ({
      "@type": "Place",
      name: `${o.entity}, ${o.country}`,
      address: address(o.addressLines, o.country, o.countryCode),
      telephone: o.phones[0].number,
    })),
    contactPoint: offices.map((o) => ({
      "@type": "ContactPoint",
      contactType: "sales",
      areaServed: o.countryCode,
      telephone: o.phones[0].number,
      email: o.emails[0],
    })),
  };
}

export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
