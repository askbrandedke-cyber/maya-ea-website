import { categories, categoryBySlug } from "@/content/categories";
import { productsIn } from "@/content/products";
import type { CategorySlug } from "@/content/types";
import { ogImage, ogSize } from "@/lib/og";
import { frontTex } from "@/lib/pack-files";

export const size = ogSize;
export const contentType = "image/png";
export const alt = "Product category at Maya E.A. Limited";
export function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }));
}

export default async function Image({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const c = categoryBySlug[category as CategorySlug];
  const packs = productsIn(c.slug).slice(0, 3).map((p) => frontTex(p, 0, true));
  return ogImage({ eyebrow: `${c.code} · ${c.name}`, title: c.name, subtitle: c.whatItDoes, bg: c.colour, ink: c.ink, packs, concept: packs.length > 0 });
}
