/**
 * Prints the per-product data matrix used in PLACEHOLDERS.md:
 * which back-panel facts are verified (✓) and which still need Maya (–).
 *   npx tsx scripts/placeholder-matrix.ts
 */
import { categoryBySlug } from "../content/categories";
import { products } from "../content/products";

const yes = (v: unknown) => (v ? "✓" : "–");
console.log("| Product | Category | Own label | Usage/dosage | Storage | Ingredients | Allergens | Made in | Photo note |");
console.log("|---|---|---|---|---|---|---|---|---|");
for (const p of products) {
  console.log(
    `| ${p.name} | ${categoryBySlug[p.category].name} | ${p.ownLabel === "own-label" ? "✓ Bakeshed" : "**?**"} | ${p.dosage ? "✓ 0.5–1%" : yes(p.usage)} | ${yes(p.storage)} | ${yes(p.ingredients)} | ${yes(p.allergens)} | ${yes(p.madeIn)} | ${p.photoNote ? "**see note**" : ""} |`,
  );
}
const n = products.length;
const c = (f: (p: (typeof products)[number]) => unknown) => products.filter(f).length;
console.log(`\nTotals: ${n} products · own-label confirmed ${c((p) => p.ownLabel === "own-label")} · usage ${c((p) => p.dosage || p.usage)} · storage ${c((p) => p.storage)} · ingredients ${c((p) => p.ingredients)} · allergens ${c((p) => p.allergens)} · made-in ${c((p) => p.madeIn)}`);
