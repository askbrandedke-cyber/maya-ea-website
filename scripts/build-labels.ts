/**
 * Generates all concept label artwork from /content.
 *   npm run labels
 * Output: /public/packaging (SVG artwork + PNG textures) and packaging/manifest.json.
 */
import fs from "node:fs";
import path from "node:path";
import { Resvg } from "@resvg/resvg-js";
import sharp from "sharp";
import { brand, CONCEPT_TAG } from "../content/brand";
import { categories, categoryBySlug, families } from "../content/categories";
import { products, shelfProducts } from "../content/products";
import { icons, iconSvg } from "./labels/icons";
import { back, front, H, M, side, svgDoc, W, Z } from "./labels/layout";
import { text } from "./labels/text";
import { sizeKey } from "../lib/pack-files";

const OUT = path.join(process.cwd(), "public/packaging");
const write = (rel: string, data: string | Buffer) => {
  const f = path.join(OUT, rel);
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(f, data);
};
const png = (svg: string, width: number) => new Resvg(svg, { fitTo: { mode: "width", value: width } }).render().asPng();
/** WebP textures: 1024 px for the product viewer, 384 px for the hero and shelf. */
async function textures(name: string, svg: string) {
  const big = png(svg, 1024);
  write(`textures/${name}.webp`, await sharp(big).webp({ quality: 82 }).toBuffer());
  write(`textures/sm/${name}.webp`, await sharp(big).resize(384).webp({ quality: 80 }).toBuffer());
}


/** Texture names resolve to /packaging/textures/{tex}.webp (1024) and /packaging/textures/sm/{tex}.webp (384). */
type Manifest = Record<string, { category: string; back: string; backTex: string; fronts: Record<string, { svg: string; tex: string; format: string }> }>;

async function main() {
  fs.rmSync(OUT, { recursive: true, force: true });
  const manifest: Manifest = {};
  const fronts: Record<string, string> = {};

  for (const p of products) {
    const cat = categoryBySlug[p.category];
    const dir = `labels/${p.category}`;
    const entry: Manifest[string] = { category: p.category, back: "", backTex: "", fronts: {} };
    for (const ps of p.packSizes) {
      const k = sizeKey(ps.label);
      const svg = front(p, cat, ps);
      write(`${dir}/${p.slug}--${k}--front.svg`, svg);
      await textures(`${p.slug}--${k}--front`, svg);
      entry.fronts[k] = { svg: `/packaging/${dir}/${p.slug}--${k}--front.svg`, tex: `${p.slug}--${k}--front`, format: ps.format };
      fronts[`${p.slug}--${k}`] = svg;
    }
    const b = await back(p, cat);
    write(`${dir}/${p.slug}--back.svg`, b);
    await textures(`${p.slug}--back`, b);
    const sd = side(p, cat);
    write(`${dir}/${p.slug}--side.svg`, sd);
    await textures(`${p.slug}--side`, sd);
    entry.back = `/packaging/${dir}/${p.slug}--back.svg`;
    entry.backTex = `${p.slug}--back`;
    manifest[p.slug] = entry;
  }

  // Icons as standalone SVGs for the website
  for (const [name] of Object.entries(icons))
    write(`icons/${name}.svg`, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">${iconSvg(name as never, { x: 0, y: 0, size: 100, colour: "currentColor" })}</svg>`);

  // System sheets: palette, shelf, anatomy
  write("system/palette.svg", paletteSheet());
  const shelf = shelfSheet(fronts);
  write("system/shelf.svg", shelf);
  write("system/shelf.png", png(shelf, 2400));
  const anat = anatomySheet(fronts["volume-plus--10-kg"]);
  write("system/anatomy.svg", anat);
  write("system/anatomy.png", png(anat, 1600));

  write("manifest.json", JSON.stringify(manifest, null, 2));
  const count = Object.values(manifest).reduce((n, m) => n + Object.keys(m.fronts).length + 2, 0);
  console.log(`✓ ${products.length} products · ${count} label SVGs · ${categories.length} categories → public/packaging`);
}

/* -------- sheets -------- */

function inner(svg: string) {
  return svg.replace(/^<svg[^>]*>/, "").replace(/<\/svg>$/, "").replace(/<title>.*?<\/title>/, "");
}

function paletteSheet() {
  const cw = 300, ch = 170, cols = 7, pad = 24;
  const w = cols * cw + pad * 2, h = 2 * ch + 160;
  let s = `<rect width="${w}" height="${h}" fill="#FFFFFF"/>`;
  s += text("BRANDED proposal · category colour system", pad, 50, { weight: "bold", size: 28, fill: brand.colours.ink });
  s += text(CONCEPT_TAG, pad, 84, { weight: "medium", size: 18, fill: "#B00020" });
  categories.forEach((c, i) => {
    const x = pad + (i % cols) * cw, y = 110 + Math.floor(i / cols) * ch;
    s += `<rect x="${x}" y="${y}" width="${cw - 12}" height="${ch - 12}" rx="10" fill="${c.colour}"/>`;
    s += iconSvg(c.icon, { x: x + cw - 92, y: y + 14, size: 64, colour: c.ink, stroke: 7 });
    s += text(`${c.code} · ${String(c.index).padStart(2, "0")}`, x + 16, y + 40, { weight: "bold", size: 22, fill: c.ink });
    s += text(c.name, x + 16, y + 98, { weight: "semibold", size: 21, fill: c.ink });
    s += text(c.colour, x + 16, y + 132, { weight: "medium", size: 16, fill: c.ink, opacity: 0.85 });
  });
  return svgDoc(s, "Category colour system", w, h);
}

function shelfSheet(fronts: Record<string, string>) {
  const items = shelfProducts().sort((a, b) => categoryBySlug[a.category].index - categoryBySlug[b.category].index);
  const scale = 0.42, pw = W * scale, ph = H * scale, gap = 18, pad = 40;
  const w = pad * 2 + items.length * (pw + gap) - gap, h = ph + 230;
  let s = `<rect width="${w}" height="${h}" fill="#F3EFE6"/>`;
  s += text("Shelf view: one representative pack per category", pad, 52, { weight: "bold", size: 30, fill: brand.colours.ink });
  s += text(CONCEPT_TAG, pad, 86, { weight: "semibold", size: 20, fill: "#B00020" });
  let lastFam = "";
  items.forEach((p, i) => {
    const x = pad + i * (pw + gap);
    const c = categoryBySlug[p.category];
    if (c.family !== lastFam) {
      s += text(families[c.family].toUpperCase(), x, 124, { weight: "bold", size: 14, fill: brand.colours.navy, tracking: 2 });
      lastFam = c.family;
    }
    const k = Object.keys(fronts).find((f) => f.startsWith(`${p.slug}--`))!;
    s += `<g transform="translate(${x} 140) scale(${scale})">${inner(fronts[k])}</g>`;
  });
  s += `<rect x="0" y="${140 + ph}" width="${w}" height="26" fill="#8A7A62"/>`;
  return svgDoc(s, "Shelf view of concept packs, one per category", w, h);
}

function anatomySheet(frontSvg: string) {
  const ox = 520, oy = 60, w = 1700, h = H + 120;
  let s = `<rect width="${w}" height="${h}" fill="#FFFFFF"/>`;
  s += `<g transform="translate(${ox} ${oy})">${inner(frontSvg)}</g>`;
  // grid overlay
  for (let gx = 0; gx <= W; gx += M) s += `<line x1="${ox + gx}" y1="${oy}" x2="${ox + gx}" y2="${oy + H}" stroke="#00B3FF" stroke-width="0.6" opacity="0.5"/>`;
  const notes: [number, string, string][] = [
    [Z.band.y + 88, "A · Brand band (176)", "Navy. Maya logo plate fixed top-left, 136 tall, ½M inset. Range name, category, code badge."],
    [Z.stripe.y + 8, "B · Signature stripe (16)", "Brand yellow. Same on every pack."],
    [Z.field.y + 140, "C · Colour field (448)", "Category colour. Descriptor, then product name, then what it does. Verified claims only."],
    [Z.info.y + 78, "D · Info strip (156)", "White. Net weight / size, carton line, category tile (icon + code)."],
    [Z.tag.y + 22, "E · Concept tag (44)", "Mandatory: “" + CONCEPT_TAG + "”."],
  ];
  notes.forEach(([y, t, d]) => {
    s += `<line x1="${ox - 12}" y1="${oy + y}" x2="${ox - 60}" y2="${oy + y}" stroke="#B00020" stroke-width="2"/><circle cx="${ox - 8}" cy="${oy + y}" r="5" fill="#B00020"/>`;
    s += text(t, 24, oy + y - 6, { weight: "bold", size: 20, fill: brand.colours.ink });
    const words = d.split(" ");
    let line = "", ly = oy + y + 20;
    for (const wd of words) {
      if ((line + " " + wd).length > 48) { s += text(line.trim(), 24, ly, { size: 15, fill: brand.colours.ink }); ly += 20; line = ""; }
      line += " " + wd;
    }
    s += text(line.trim(), 24, ly, { size: 15, fill: brand.colours.ink });
  });
  const rx = ox + W + 40;
  const rules = ["Grid: 600 × 840 units (5:7), module M = 40", "Margins: 1M (½M for band items)", "Type: Poppins Bold / SemiBold / Regular", "Name: 86 down to 50 units, max 2 lines", "What it does: 25 units, max 3 lines", "Pack size: 72 down to 40 units", "Yellow is never text on white", "Every colour field passes WCAG AA with its ink"];
  s += text("RULES", rx, oy + 30, { weight: "bold", size: 20, fill: brand.colours.navy, tracking: 2 });
  rules.forEach((r, i) => (s += text("· " + r, rx, oy + 64 + i * 28, { size: 16, fill: brand.colours.ink })));
  return svgDoc(s, "Front panel anatomy and grid", w, h);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
