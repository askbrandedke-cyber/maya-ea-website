import { categories } from "./categories";
import { products, productPath } from "./products";

/** Trim to `max` chars at a sentence or word boundary (no cut-off words). */
export function clip(text: string, max: number) {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const sentence = cut.lastIndexOf(". ");
  if (sentence > max * 0.6) return cut.slice(0, sentence + 1);
  return cut.slice(0, cut.lastIndexOf(" ")).replace(/[,;:]$/, "") + "…";
}

/**
 * Single source of truth for routes: drives navigation, <head> metadata,
 * sitemap.xml and breadcrumbs. See SITEMAP.md for each page's job.
 * Titles ≤ 60 chars; descriptions ≤ 155 chars. Template appends " | Maya E.A. Limited".
 */
export interface RouteMeta {
  path: string;
  title: string;
  description: string;
  /** sitemap.xml priority */
  priority: number;
  changeFrequency: "weekly" | "monthly" | "yearly";
  /** Concept/proposal pages carry the concept tag in their OG image. */
  concept?: boolean;
}

export const staticRoutes: RouteMeta[] = [
  {
    path: "/",
    title: "Bakery Ingredients in Kenya, Uganda & Rwanda",
    description:
      "Maya E.A. Limited supplies bread improvers, premixes, chocolates and bakery supplies to bakeries and food manufacturers in Kenya, Uganda and Rwanda since 2009.",
    priority: 1,
    changeFrequency: "monthly",
  },
  {
    path: "/products",
    title: "Products: 14 Bakery Ingredient Categories",
    description:
      "Browse bread improvers, cake premixes, chocolates, preservatives, seeds, baking papers and more. Order online on bakeshed.rw or request wholesale pricing.",
    priority: 0.9,
    changeFrequency: "weekly",
  },
  {
    path: "/packaging",
    title: "Packaging Proposal: Bakeshed Range Concept",
    description:
      "A concept packaging system for the Bakeshed range by BRANDED: one label layout, a colour per category, 3D packs and a shelf view. Proposal only.",
    priority: 0.5,
    changeFrequency: "monthly",
    concept: true,
  },
  {
    path: "/tools/improver-calculator",
    title: "Bread Improver Calculator",
    description:
      "Enter your flour weight to see Mega Plus, Excess and Volume Plus amounts at 0.5% and 1% of flour weight. Guide only; follow product instructions.",
    priority: 0.7,
    changeFrequency: "yearly",
  },
  {
    path: "/tools/product-finder",
    title: "Product Finder: What Are You Baking?",
    description:
      "Answer three questions (what you bake, your scale, your country) and get the ingredient categories that fit, with links to order.",
    priority: 0.6,
    changeFrequency: "yearly",
  },
  {
    path: "/wholesale",
    title: "Request Wholesale Pricing",
    description:
      "Tell us your business type, products and volumes. The Maya team in Kenya, Uganda or Rwanda will reply with wholesale pricing and supply terms.",
    priority: 0.9,
    changeFrequency: "yearly",
  },
  {
    path: "/about",
    title: "About Maya E.A. Limited: Since 2009",
    description:
      "Established in Kenya in 2009, Maya E.A. Limited operates in Kenya, Uganda and Rwanda. Our history, mission, values, certifications and supplier partners.",
    priority: 0.7,
    changeFrequency: "yearly",
  },
  {
    path: "/locations",
    title: "Locations: Nairobi, Kampala & Kigali",
    description:
      "Find Maya E.A. Limited in Nairobi (HQ), Kampala (Best Ingredients Africa Ltd) and Kigali. Addresses, phone, WhatsApp and online shop.",
    priority: 0.8,
    changeFrequency: "yearly",
  },
  {
    path: "/locations/kenya",
    title: "Kenya HQ: Nairobi, Off Mombasa Road",
    description:
      "Maya E.A. Limited headquarters, Ideal Ceramics Building, Go-down 1C, ICD Road, Nairobi. Office +254 773 864 849. WhatsApp and directions.",
    priority: 0.7,
    changeFrequency: "yearly",
  },
  {
    path: "/locations/uganda",
    title: "Uganda: Best Ingredients Africa Ltd, Kampala",
    description:
      "Best Ingredients Africa Ltd, Plot 94, Block 112, Kolo Namanve Industrial Park, Kampala. Phone +256 788 722 180. ISO 22000:2018 certified.",
    priority: 0.7,
    changeFrequency: "yearly",
  },
  {
    path: "/locations/rwanda",
    title: "Rwanda: Kigali Special Economic Zone",
    description:
      "Maya E.A. Limited Rwanda, Kigali Special Economic Zone, Gasabo. Office +250 793 902 825, WhatsApp +250 795 598 607. Shop online at bakeshed.rw.",
    priority: 0.7,
    changeFrequency: "yearly",
  },
  {
    path: "/contact",
    title: "Contact Maya E.A. Limited",
    description:
      "Phone, WhatsApp and email for our Kenya, Uganda and Rwanda teams, or send a message and we will route it to the right country.",
    priority: 0.8,
    changeFrequency: "yearly",
  },
  {
    path: "/team",
    title: "Our Team",
    description:
      "Meet the board and senior management team of Maya E.A. Limited across Kenya, Uganda and Rwanda.",
    priority: 0.3,
    changeFrequency: "yearly",
  },
  {
    path: "/press",
    title: "Press & News",
    description:
      "News coverage and company updates from Maya E.A. Limited, including our expansion into Rwanda.",
    priority: 0.3,
    changeFrequency: "monthly",
  },
  {
    path: "/careers",
    title: "Careers",
    description: "Work with Maya E.A. Limited in Kenya, Uganda or Rwanda. Send your CV to info@mayaealtd.com.",
    priority: 0.3,
    changeFrequency: "monthly",
  },
  {
    path: "/privacy",
    title: "Privacy Notice",
    description: "How Maya E.A. Limited handles personal data sent through this website's forms.",
    priority: 0.1,
    changeFrequency: "yearly",
  },
];

export const categoryRoutes: RouteMeta[] = categories.map((c) => ({
  path: `/products/${c.slug}`,
  title: `${c.name} for Bakeries in East Africa`,
  description: clip(`${c.description} Order on bakeshed.rw or request wholesale pricing.`, 155),
  priority: 0.8,
  changeFrequency: "weekly",
}));

export const productRoutes: RouteMeta[] = products.map((p) => ({
  path: productPath(p),
  title: `${p.name}: ${p.descriptor}`,
  description: clip(
    `${p.name}, ${p.descriptor.toLowerCase()} ${p.ownLabel === "own-label" ? "from the Bakeshed range by Maya E.A. Limited" : "supplied by Maya E.A. Limited"}. Pack: ${p.packSizes
      .map((s) => s.label)
      .join(", ")}. Order on bakeshed.rw or request wholesale pricing.`,
    155,
  ),
  priority: 0.6,
  changeFrequency: "monthly",
  concept: true,
}));

export const allRoutes = [...staticRoutes, ...categoryRoutes, ...productRoutes];

/* ------------------------------- Navigation ------------------------------- */

export const primaryNav = [
  { label: "Products", href: "/products" },
  { label: "Packaging proposal", href: "/packaging" },
  {
    label: "Tools",
    href: "/tools/product-finder",
    children: [
      { label: "Product finder", href: "/tools/product-finder" },
      { label: "Improver calculator", href: "/tools/improver-calculator" },
    ],
  },
  { label: "About", href: "/about" },
  { label: "Locations", href: "/locations" },
  { label: "Contact", href: "/contact" },
] as const;

export const headerCtas = {
  primary: { label: "Request wholesale pricing", href: "/wholesale" },
  secondary: { label: "Shop on Bakeshed", href: "https://bakeshed.rw", external: true },
} as const;

export const footerNav = [
  { heading: "Products", links: categories.map((c) => ({ label: c.name, href: `/products/${c.slug}` })) },
  {
    heading: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Team", href: "/team" },
      { label: "Press & news", href: "/press" },
      { label: "Careers", href: "/careers" },
      { label: "Packaging proposal", href: "/packaging" },
    ],
  },
  {
    heading: "Buy",
    links: [
      { label: "Request wholesale pricing", href: "/wholesale" },
      { label: "Shop on Bakeshed", href: "https://bakeshed.rw" },
      { label: "Product finder", href: "/tools/product-finder" },
      { label: "Improver calculator", href: "/tools/improver-calculator" },
      { label: "Contact", href: "/contact" },
      { label: "Privacy notice", href: "/privacy" },
    ],
  },
] as const;

/**
 * Proposal builds must not be indexed: the site would otherwise compete with
 * mayaealtd.com and present concept packs publicly. Set NEXT_PUBLIC_ALLOW_INDEXING=true
 * only when Maya approves go-live.
 */
export const allowIndexing = process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";
