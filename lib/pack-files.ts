import type { PackFormat, Product } from "@/content/types";

/** File key for a pack size label, e.g. "4.5 kg" → "4-5-kg", "8″" → "8in". Shared with scripts/build-labels.ts. */
export const sizeKey = (label: string) =>
  label.toLowerCase().replace(/″/g, "in").replace(/\./g, "-").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

/** Texture URLs produced by `npm run labels`. */
export const frontTex = (p: Product, sizeIndex = 0, small = false) =>
  `/packaging/textures/${small ? "sm/" : ""}${p.slug}--${sizeKey(p.packSizes[sizeIndex].label)}--front.webp`;
export const backTex = (p: Product, small = false) => `/packaging/textures/${small ? "sm/" : ""}${p.slug}--back.webp`;
export const sideTex = (p: Product, small = false) => `/packaging/textures/${small ? "sm/" : ""}${p.slug}--side.webp`;
export const frontSvg = (p: Product, sizeIndex = 0) =>
  `/packaging/labels/${p.category}/${p.slug}--${sizeKey(p.packSizes[sizeIndex].label)}--front.svg`;

/** Current pack photo (downloaded from bakeshed.rw by scripts/current-packs.ts). */
export const currentPhoto = (p: Product) => `/current-packs/${p.slug}.webp`;

export const formatLabel: Record<PackFormat, string> = {
  sack: "Sack",
  box: "Carton",
  pouch: "Pouch",
  tub: "Tub",
  bottle: "Jerrycan",
  sleeve: "Sleeve",
};
