import { shelfProducts } from "@/content/products";
import { ogImage, ogSize } from "@/lib/og";
import { frontTex } from "@/lib/pack-files";

export const size = ogSize;
export const contentType = "image/png";
export const alt = "Packaging proposal for the Bakeshed range by BRANDED (proposal only)";

export default function Image() {
  const pick = ["volume-plus", "blondy-vanilla-sponge", "coconut-flavour"];
  const packs = pick.map((slug) => shelfProducts().find((p) => p.slug === slug)!).map((p) => frontTex(p, 0, true));
  return ogImage({ eyebrow: "Proposal by BRANDED Agency", title: "One range, one packaging system", subtitle: "14 category colours. Maya logo fixed on every pack.", packs, concept: true });
}
