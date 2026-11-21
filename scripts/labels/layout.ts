import fs from "node:fs";
import path from "node:path";
import QRCode from "qrcode";
import { brand, CONCEPT_TAG, SITE_URL } from "../../content/brand";
import { confirm, isConfirm } from "../../content/confirm";
import { offices } from "../../content/contacts";
import { productPath } from "../../content/products";
import type { Category, PackSize, Product } from "../../content/types";
import { iconSvg } from "./icons";
import { block, fit, measure, text, wrap } from "./text";

/* ------------------------------------------------------------------ */
/* Grid. A panel is 600 × 840 units (5:7). Module M = 600/15 = 40.     */
/* All positions below are multiples or halves of M.                   */
/* ------------------------------------------------------------------ */
export const W = 600;
export const H = 840;
export const M = 40;

/** Zones (front). Fixed for every pack in the range. */
export const Z = {
  band: { y: 0, h: 176 }, // brand band, navy; logo position fixed here
  stripe: { y: 176, h: 16 }, // yellow signature stripe (from the chef's toque)
  field: { y: 192, h: 448 }, // category colour field
  info: { y: 640, h: 156 }, // white info strip: pack size + code tile
  tag: { y: 796, h: 44 }, // concept tag bar (proposal only)
};

const C = brand.colours;
const NAVY = C.navy;
const INK = C.ink;
const PLACEHOLDER = "#B00020";

const logoB64 = fs.readFileSync(path.join(process.cwd(), "scripts/.maya-logo-label.png")).toString("base64");
const LOGO_RATIO = brand.logo.width / brand.logo.height;

/** Maya logo on a white plate. Fixed size and position on every front panel. */
export function logoPlate(x: number, y: number, h: number) {
  const pad = h * 0.07;
  const lh = h - pad * 2;
  const lw = lh * LOGO_RATIO;
  const w = lw + pad * 2;
  return {
    w,
    svg:
      `<rect x="${x}" y="${y}" width="${w.toFixed(1)}" height="${h}" rx="${h * 0.1}" fill="#FFFFFF"/>` +
      `<image x="${(x + pad).toFixed(1)}" y="${(y + pad).toFixed(1)}" width="${lw.toFixed(1)}" height="${lh.toFixed(1)}" href="data:image/png;base64,${logoB64}" preserveAspectRatio="xMidYMid meet"/>`,
  };
}

/** Category code badge: colour + two-letter code, so colour is never the only cue. */
function codeBadge(cat: Category, cx: number, cy: number, r: number) {
  return (
    `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${cat.colour}" stroke="${C.yellow}" stroke-width="${r * 0.12}"/>` +
    text(cat.code, cx, cy + r * 0.26, { weight: "bold", size: r * 0.72, fill: cat.ink, anchor: "middle", tracking: 1 }) +
    text(String(cat.index).padStart(2, "0"), cx, cy + r * 0.62, { weight: "semibold", size: r * 0.26, fill: cat.ink, anchor: "middle", opacity: 0.85 })
  );
}

function conceptBar(y: number) {
  return (
    `<rect x="0" y="${y}" width="${W}" height="${H - y}" fill="${C.night}"/>` +
    `<rect x="${M / 2}" y="${y + 13}" width="18" height="18" rx="3" fill="${C.yellow}"/>` +
    text(CONCEPT_TAG, M / 2 + 28, y + 28, { weight: "semibold", size: 17, fill: "#FFFFFF" })
  );
}

/** Placeholder text: dashed red box, visible on the artwork. */
function placeholder(str: string, x: number, y: number, maxW: number, size = 15) {
  const lines = wrap(str, maxW - 16, { weight: "medium", size });
  const lh = size * 1.35;
  const h = lines.length * lh + 12;
  return {
    h,
    svg:
      `<rect x="${x}" y="${y}" width="${maxW}" height="${h}" rx="4" fill="#FFF5F5" stroke="${PLACEHOLDER}" stroke-width="1.5" stroke-dasharray="5 4"/>` +
      block(lines, x + 8, y + 6 + size, lh, { weight: "medium", size, fill: PLACEHOLDER }).svg,
  };
}

/* ------------------------------- FRONT ------------------------------- */

export function front(p: Product, cat: Category, ps: PackSize) {
  const ink = cat.ink;
  const out: string[] = [];

  // 1. Brand band + fixed logo (top-left, 136 units tall, 1/2 M from edges)
  out.push(`<rect width="${W}" height="${Z.band.h}" fill="${NAVY}"/>`);
  const logo = logoPlate(M / 2, M / 2, 136);
  out.push(logo.svg);
  const tx = M / 2 + logo.w + M / 2;
  out.push(text(brand.rangeName.toUpperCase(), tx, 74, { weight: "bold", size: 34, fill: C.yellow, tracking: 5 }));
  out.push(text("by Maya E.A. Limited", tx, 104, { weight: "medium", size: 17, fill: "#FFFFFF" }));
  out.push(text(cat.name.toUpperCase(), tx, 146, { weight: "semibold", size: 15, fill: "#FFFFFF", tracking: 2.5, opacity: 0.85 }));
  out.push(codeBadge(cat, W - 68, 84, 44));

  // 2. Signature stripe
  out.push(`<rect y="${Z.stripe.y}" width="${W}" height="${Z.stripe.h}" fill="${C.yellow}"/>`);

  // 3. Colour field: name → what it does → claims
  out.push(`<rect y="${Z.field.y}" width="${W}" height="${Z.field.h}" fill="${cat.colour}"/>`);
  out.push(iconSvg(cat.icon, { x: W - 270, y: Z.field.y + 150, size: 260, colour: ink, opacity: 0.13, stroke: 5 }));

  let y = Z.field.y + 70;
  out.push(text(p.descriptor.toUpperCase(), M, y, { weight: "semibold", size: 20, fill: ink, tracking: 3, opacity: 0.9 }));
  const name = fit(p.name, W - 2 * M, 2, { weight: "bold", from: 86, to: 50, tracking: -1 });
  y += name.size * 1.02;
  const nb = block(name.lines, M, y, name.size * 1.0, { weight: "bold", size: name.size, fill: ink, tracking: -1 });
  out.push(nb.svg);
  y = nb.end + 46;
  const does = p.whatItDoes ?? cat.whatItDoes;
  const db = block(wrap(does, 420, { weight: "regular", size: 25 }), M, y, 34, { weight: "regular", size: 25, fill: ink });
  out.push(db.svg);

  // Claims from Maya's current pack (verified only)
  if (p.packClaims?.length) {
    let cx = M;
    const cy = Z.field.y + Z.field.h - 64;
    for (const c of p.packClaims) {
      const w = measure(c, { weight: "semibold", size: 18 }) + 32;
      out.push(`<rect x="${cx}" y="${cy}" width="${w}" height="38" rx="19" fill="none" stroke="${ink}" stroke-width="2"/>`);
      out.push(text(c, cx + 16, cy + 26, { weight: "semibold", size: 18, fill: ink }));
      cx += w + 10;
    }
  }
  if (p.ownLabel === "confirm") {
    const ph = placeholder(confirm("is this an own-label product?"), M, Z.field.y + Z.field.h - 58, 330, 14);
    out.push(ph.svg);
  }

  // 4. Info strip: pack size (largest text after the name) + category tile
  out.push(`<rect y="${Z.info.y}" width="${W}" height="${Z.info.h}" fill="#FFFFFF"/>`);
  const isWeight = /\b(kg|g|L)\b/.test(ps.label);
  out.push(text(isWeight ? "NET WEIGHT" : "SIZE", M, Z.info.y + 44, { weight: "semibold", size: 15, fill: NAVY, tracking: 2.5 }));
  const sizeFit = fit(ps.label, 330, 1, { weight: "bold", from: 72, to: 40, tracking: -1 });
  out.push(text(ps.label, M, Z.info.y + 44 + sizeFit.size * 0.98, { weight: "bold", size: sizeFit.size, fill: INK, tracking: -1 }));
  if (ps.carton) {
    const sx = M + measure(ps.label, { weight: "bold", size: sizeFit.size, tracking: -1 }) + 24;
    const base = Z.info.y + 44 + sizeFit.size * 0.98;
    out.push(text("CARTON", sx, base - 26, { weight: "semibold", size: 13, fill: NAVY, tracking: 2 }));
    out.push(text(ps.carton, sx, base, { weight: "semibold", size: 20, fill: INK }));
  }
  const tile = 112;
  const tX = W - M / 2 - tile;
  const tY = Z.info.y + (Z.info.h - tile) / 2;
  out.push(`<rect x="${tX}" y="${tY}" width="${tile}" height="${tile}" rx="12" fill="${cat.colour}"/>`);
  out.push(iconSvg(cat.icon, { x: tX + 22, y: tY + 12, size: 68, colour: ink, stroke: 7 }));
  out.push(text(`${cat.code} · ${String(cat.index).padStart(2, "0")}`, tX + tile / 2, tY + tile - 12, { weight: "bold", size: 15, fill: ink, anchor: "middle", tracking: 1 }));

  // 5. Concept tag
  out.push(conceptBar(Z.tag.y));

  return svgDoc(out.join(""), `${p.name} ${ps.label}: front panel, concept by BRANDED`);
}

/* -------------------------------- SIDE ------------------------------- */

/** Side panel (carton/sack gusset): same zones as the front so the bands run around the pack. */
export const SW = 372;
export function side(p: Product, cat: Category) {
  const ink = cat.ink;
  const out: string[] = [];
  out.push(`<rect width="${SW}" height="${Z.band.h}" fill="${NAVY}"/>`);
  out.push(text(brand.rangeName.toUpperCase(), SW / 2, 48, { weight: "bold", size: 24, fill: C.yellow, tracking: 4, anchor: "middle" }));
  out.push(codeBadge(cat, SW / 2, 112, 40));
  out.push(`<rect y="${Z.stripe.y}" width="${SW}" height="${Z.stripe.h}" fill="${C.yellow}"/>`);
  out.push(`<rect y="${Z.field.y}" width="${SW}" height="${Z.field.h}" fill="${cat.colour}"/>`);
  // product name reads bottom-to-top along the field
  const name = fit(p.name, Z.field.h - 2 * M, 1, { weight: "bold", from: 64, to: 30, tracking: -1 });
  const cx = SW / 2 + name.size * 0.18, cy = Z.field.y + Z.field.h / 2;
  out.push(`<g transform="rotate(-90 ${cx} ${cy})">${text(name.lines[0], cx, cy + name.size * 0.35, { weight: "bold", size: name.size, fill: ink, anchor: "middle", tracking: -1 })}</g>`);
  const dx = SW / 2 + name.size * 0.18 + name.size * 0.75;
  out.push(`<g transform="rotate(-90 ${dx} ${cy})">${text(p.descriptor.toUpperCase(), dx, cy + 6, { weight: "semibold", size: 16, fill: ink, anchor: "middle", tracking: 3, opacity: 0.9 })}</g>`);
  out.push(`<rect y="${Z.info.y}" width="${SW}" height="${Z.info.h}" fill="#FFFFFF"/>`);
  out.push(`<rect x="${(SW - 112) / 2}" y="${Z.info.y + 22}" width="112" height="112" rx="12" fill="${cat.colour}"/>`);
  out.push(iconSvg(cat.icon, { x: (SW - 112) / 2 + 22, y: Z.info.y + 34, size: 68, colour: ink, stroke: 7 }));
  out.push(text(`${cat.code} · ${String(cat.index).padStart(2, "0")}`, SW / 2, Z.info.y + 122, { weight: "bold", size: 15, fill: ink, anchor: "middle", tracking: 1 }));
  out.push(`<rect y="${Z.tag.y}" width="${SW}" height="${H - Z.tag.y}" fill="${C.night}"/>`);
  out.push(text("Concept packaging by BRANDED —", SW / 2, Z.tag.y + 19, { weight: "semibold", size: 13, fill: "#FFFFFF", anchor: "middle" }));
  out.push(text("proposal only", SW / 2, Z.tag.y + 36, { weight: "semibold", size: 13, fill: "#FFFFFF", anchor: "middle" }));
  return svgDoc(out.join(""), `${p.name}: side panel, concept by BRANDED`, SW, H);
}

/* -------------------------------- BACK ------------------------------- */

async function qr(url: string, x: number, y: number, size: number) {
  const q = QRCode.create(url, { errorCorrectionLevel: "M" });
  const n = q.modules.size;
  const quiet = 2;
  const cell = size / (n + quiet * 2);
  let d = "";
  for (let r = 0; r < n; r++)
    for (let c = 0; c < n; c++)
      if (q.modules.get(r, c)) d += `M${(x + (c + quiet) * cell).toFixed(2)} ${(y + (r + quiet) * cell).toFixed(2)}h${cell.toFixed(2)}v${cell.toFixed(2)}h-${cell.toFixed(2)}z`;
  return `<rect x="${x}" y="${y}" width="${size}" height="${size}" fill="#FFFFFF"/><path d="${d}" fill="${INK}"/>`;
}

export async function back(p: Product, cat: Category) {
  const out: string[] = [];
  const BH = 128;
  out.push(`<rect width="${W}" height="${H}" fill="#FFFFFF"/>`);
  out.push(`<rect width="${W}" height="${BH}" fill="${NAVY}"/>`);
  const logo = logoPlate(M / 2, M / 2 - 4, 96);
  out.push(logo.svg);
  const tx = M / 2 + logo.w + M / 2;
  out.push(text(brand.rangeName.toUpperCase(), tx, 52, { weight: "bold", size: 22, fill: C.yellow, tracking: 4 }));
  const nm = fit(p.name, W - tx - 110, 1, { weight: "bold", from: 32, to: 20 });
  out.push(text(nm.lines[0], tx, 88, { weight: "bold", size: nm.size, fill: "#FFFFFF" }));
  out.push(text(p.descriptor, tx, 112, { weight: "medium", size: 15, fill: "#FFFFFF", opacity: 0.85 }));
  out.push(codeBadge(cat, W - 58, 64, 36));
  out.push(`<rect y="${BH}" width="${W}" height="12" fill="${C.yellow}"/>`);

  const colW = 360;
  let y = BH + 12 + 40;
  const section = (title: string) => {
    out.push(`<rect x="${M / 2}" y="${y - 17}" width="6" height="22" rx="2" fill="${cat.colour === "#EADFC8" ? "#B9A57A" : cat.colour}"/>`);
    out.push(text(title, M / 2 + 16, y, { weight: "bold", size: 16, fill: NAVY, tracking: 2 }));
    y += 26;
  };
  const body = (str: string | undefined, missing: string) => {
    if (!str || isConfirm(str)) {
      const ph = placeholder(str ?? confirm(missing), M / 2 + 16, y - 14, colW - 16, 14);
      out.push(ph.svg);
      y += ph.h + 22;
    } else {
      const b = block(wrap(str, colW - 16, { size: 16 }), M / 2 + 16, y, 22, { size: 16, fill: INK });
      out.push(b.svg);
      y = b.end + 34;
    }
  };

  section("HOW TO USE");
  if (p.dosage) {
    const d = p.dosage;
    const usage = `Use ${d.minPercent}% to ${d.maxPercent}% of total flour weight (${d.minPercent * 10}–${d.maxPercent * 10} g per 1 kg of flour).${p.usage ? " " + p.usage : ""} Guide only; follow product instructions.`;
    body(usage, "");
  } else body(p.usage, `usage instructions for ${p.name}`);

  section("STORAGE");
  body(p.storage, "storage instructions");

  section("INGREDIENTS & ALLERGENS");
  body(p.ingredients ? `${p.ingredients} ${p.allergens ?? ""}`.trim() : undefined, "ingredients and allergens");

  // QR block, right column
  const qx = M / 2 + colW + 24;
  const qs = W - qx - M / 2;
  const url = `${SITE_URL}${productPath(p)}`;
  out.push(`<rect x="${qx - 8}" y="${BH + 12 + 20}" width="${qs + 16}" height="${qs + 112}" rx="12" fill="${C.mist}"/>`);
  out.push(await qr(url, qx, BH + 12 + 28, qs));
  const qy = BH + 12 + 28 + qs + 26;
  out.push(text("Scan for product page", qx + qs / 2, qy, { weight: "semibold", size: 14, fill: NAVY, anchor: "middle" }));
  out.push(text("and baker guide", qx + qs / 2, qy + 19, { weight: "semibold", size: 14, fill: NAVY, anchor: "middle" }));
  const short = url.replace(/^https?:\/\/(www\.)?/, "");
  const cut = short.lastIndexOf("/");
  const urlLines = [short.slice(0, cut + 1), short.slice(cut + 1)];
  const us = Math.min(...urlLines.map((l) => fit(l, qs + 4, 1, { weight: "regular", from: 12, to: 8 }).size));
  out.push(block(urlLines, qx + qs / 2, qy + 42, us * 1.35, { size: us, fill: INK, anchor: "middle" }).svg);
  const panelBottom = BH + 12 + 20 + qs + 112;

  // Certifications (full width)
  y = Math.max(y, panelBottom + 40);
  section("CERTIFICATIONS");
  let bx = M / 2 + 16;
  for (const c of ["KEBS", "UNBS", "ISO 22000:2018"]) {
    const w = measure(c, { weight: "bold", size: 14 }) + 24;
    out.push(`<rect x="${bx}" y="${y - 18}" width="${w}" height="28" rx="14" fill="none" stroke="${NAVY}" stroke-width="1.5"/>`);
    out.push(text(c, bx + 12, y + 1, { weight: "bold", size: 14, fill: NAVY }));
    bx += w + 8;
  }
  const ph = placeholder(confirm("which marks apply to this product"), bx + 4, y - 18, W - bx - M / 2 - 4, 12);
  out.push(ph.svg);
  y += Math.max(28, ph.h) + 26;

  // Contacts: three columns
  section("CONTACT");
  const cw = (W - M) / 3;
  offices.forEach((o, i) => {
    const x = M / 2 + i * cw + (i === 0 ? 16 : 0);
    out.push(text(o.country.toUpperCase(), x, y, { weight: "bold", size: 13, fill: NAVY, tracking: 1.5 }));
    out.push(text(o.phones[0].number, x, y + 20, { weight: "medium", size: 13, fill: INK }));
    const em = o.emails[0];
    const ef = fit(em, cw - 12, 1, { weight: "regular", from: 12, to: 9 });
    out.push(text(em, x, y + 38, { size: ef.size, fill: INK }));
  });
  y += 64;

  // Batch / best before print area + origin
  out.push(`<rect x="${M / 2 + 16}" y="${y}" width="250" height="44" rx="6" fill="none" stroke="${INK}" stroke-width="1" stroke-dasharray="4 3"/>`);
  out.push(text("Batch no. / Best before: print area", M / 2 + 28, y + 27, { size: 12, fill: INK, opacity: 0.7 }));
  out.push(text(p.madeIn ?? "", W - M / 2, y + 27, { weight: "semibold", size: 14, fill: NAVY, anchor: "end" }));
  if (!p.madeIn) {
    const o = placeholder(confirm("country of manufacture"), W - M / 2 - 250, y, 250, 12);
    out.push(o.svg);
  }

  out.push(conceptBar(Z.tag.y));
  return svgDoc(out.join(""), `${p.name}: back panel, concept by BRANDED`);
}

export function svgDoc(inner: string, title: string, w = W, h = H) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${title}"><title>${title}</title>${inner}</svg>`;
}
