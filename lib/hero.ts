import { categoryBySlug } from "@/content/categories";
import { productBySlug, productPath } from "@/content/products";
import { backTex, frontTex, sideTex } from "./pack-files";

/** Hero line-up: five formats, five category colours. Order = left → right. */
const LINEUP: [slug: string, sizeIndex: number][] = [
  ["icing-sugar", 1], // sack, General Class
  ["blondy-vanilla-sponge", 0], // pouch, Cake Premixes
  ["volume-plus", 0], // carton, Bread Improvers (centre)
  ["coconut-flavour", 0], // jerrycan, Liquid Flavours
  ["red-cherries", 0], // tub, Fruits
];

export const heroPacks = LINEUP.map(([slug, i]) => {
  const p = productBySlug[slug];
  const c = categoryBySlug[p.category];
  return {
    slug,
    name: p.name,
    category: c.name,
    href: productPath(p),
    format: p.packSizes[i].format,
    colour: c.colour,
    front: frontTex(p, i, true),
    back: backTex(p, true),
    side: sideTex(p, true),
  };
});

export type HeroPack = (typeof heroPacks)[number];
