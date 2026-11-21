import { categoryBySlug } from "@/content/categories";
import { productBySlug, products } from "@/content/products";
import { ogImage, ogSize } from "@/lib/og";
import { frontTex } from "@/lib/pack-files";

export const size = ogSize;
export const contentType = "image/png";
export const alt = "Product with its BRANDED concept pack (proposal only)";
export function generateStaticParams() {
  return products.map((p) => ({ category: p.category, product: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ category: string; product: string }> }) {
  const { product } = await params;
  const p = productBySlug[product];
  const c = categoryBySlug[p.category];
  return ogImage({ eyebrow: `${c.code} · ${c.name}`, title: p.name, subtitle: p.whatItDoes ?? c.whatItDoes, bg: c.colour, ink: c.ink, packs: [frontTex(p, 0, true)], concept: true });
}
