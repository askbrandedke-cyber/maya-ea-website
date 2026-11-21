# CONTENT GUIDE: editing the Maya E.A. website

Almost everything a non-developer needs to change lives in **`/content`** as plain, typed data. Edit, save and commit; Vercel redeploys. If you make a typing mistake (for example a misspelt category), `npm run build` stops with a clear error instead of publishing a broken page.

```
content/
  brand.ts           colours, logo, concept tag, site URL
  categories.ts      the 14 categories (colour, code, icon, copy, shop link)
  products.ts        the 47 products that have concept packs
  catalogue.generated.ts   all 121 bakeshed.rw products (generated, do not hand-edit)
  contacts.ts        offices, phones, WhatsApp, emails, socials, country-page facts
  company.ts         story, milestones, mission, values, partners, team, press, careers
  certifications.ts  KEBS / UNBS / ISO marks
  finder.ts          product finder questions and rules
  site.ts            routes, page titles, descriptions, navigation, indexing switch
  map.generated.ts   map shapes (generated, do not hand-edit)
  confirm.ts         the [CONFIRM: …] helper
```

## Golden rules

1. **Only verified facts.** Use facts from mayaealtd.com, bakeshed.rw, Maya's current packs, or Maya in writing. Never add prices, statistics, testimonials, awards, recipes or dosages that Maya has not supplied.
2. **Missing? Use `confirm("…")`.** It shows a visible red **[CONFIRM: …]** marker on the site and on the packs, so nothing invented slips through. When Maya answers, replace the `confirm(...)` call with the real text, then tick the item off in PLACEHOLDERS.md.
3. **Every concept pack carries the concept tag.** The tag reads "Concept packaging by BRANDED — proposal only". It's built into the label generator and into `<ConceptTag>` / `<ConceptFrame>`. Don't remove it unless Maya formally adopts the packaging.
4. **No prices on this site.** Prices live on bakeshed.rw only.

---

## 1. Products (`content/products.ts`)

Each product is one object:

```ts
{
  slug: "volume-plus",                 // URL: /products/bread-improvers/volume-plus (keep stable: it is printed in the QR code)
  category: "bread-improvers",         // one of the 14 slugs in categories.ts
  name: "Volume Plus",                 // printed big on the pack
  descriptor: "Bread improver",        // small line above the name
  shopName: "Bakeshed Bread Improver 10KG (Volume Plus)",
  shopUrl: "https://bakeshed.rw/product/…/",
  ownLabel: "own-label",               // or "confirm" until Maya confirms it is own-label
  whatItDoes: "…",                     // optional; otherwise the category line is used
  packClaims: ["Tolerance", "Volume", "Texture"],   // only claims printed on Maya's current pack
  packSizes: [{ label: "10 kg", shopText: "1×10 Kgs", format: "box", carton: "1 kg × 10" /* optional */ }],
  dosage: { minPercent: 0.5, maxPercent: 1, source: "…" },  // ONLY verified figures
  usage: "Add directly to flour and mix.",
  storage: "Store in a cool dry place.",
  ingredients: "…", allergens: "…", madeIn: "Made in Uganda",
  currentPhoto: "https://bakeshed.rw/wp-content/uploads/…",
  photoNote: "…",                      // shown under the before/after slider
  featured: true,                      // used for the shelf view (first featured product per category)
}
```

`format` is one of `sack`, `box` (carton), `pouch`, `tub`, `bottle` (jerrycan) or `sleeve`. It decides the 3D model and the default "proposed format".

**Add a product**
1. Add the object to the right array in `products.ts`.
2. Run `npm run labels` to generate its front, side and back artwork and textures.
3. Run `npx tsx scripts/check-photos.ts`, piping its output into curl to confirm the photo URL resolves (see the script header). Then download the photo:
   ```bash
   npx tsx scripts/current-packs.ts <folder-with-downloaded-photos>
   ```
   File names must equal the product slug.
4. Run `npm run check:meta`, then `npm run build`.

A product page, its share image, a sitemap entry, a shelf or explorer link and its QR code all follow automatically.

**Fill in a [CONFIRM] fact:** add `usage`, `storage`, `ingredients`, `allergens` or `madeIn`, then run `npm run labels` so the back panel updates too.

**Rename a product:** change `name`, not `slug`. The slug is part of the URL and the QR code.

## 2. Categories (`content/categories.ts`)

Each category has a name, code (2 letters), index, family, colour, `ink` (text colour), icon, `whatItDoes`, `description`, `examples`, `shopCount` and `shopUrl`.

- **Changing a colour:** the colour must pass WCAG AA (4.5:1) with its `ink` (`#FFFFFF` or `#0D2036`). The /packaging page shows the contrast for every colour; check it there after `npm run build`. Then run `npm run labels`.
- **Icons:** the 14 line icons are in `scripts/labels/icons.ts`, drawn on a 100×100 grid. The same icons are used on the site and on the packs.
- **Shop counts:** update these after `npm run sync:bakeshed`. The explorer counts the catalogue itself; `shopCount` feeds the home tiles.

## 3. Packaging artwork (`npm run labels`)

`scripts/build-labels.ts` reads `/content` and writes:

| Output | Use |
|---|---|
| `public/packaging/labels/{category}/{slug}--{size}--front.svg`, `--side.svg`, `--back.svg` | Print and hand-off artwork (text outlined, logo embedded) |
| `public/packaging/textures/*.webp` (1024 px) and `textures/sm/*.webp` (384 px) | 3D viewer, shelf, hero, share images |
| `public/packaging/system/` | anatomy, palette and shelf sheets |
| `public/packaging/icons/*.svg` | category icons |
| `public/packaging/manifest.json` | index of all files |

Layout rules (grid, zones, type sizes) live in `scripts/labels/layout.ts` and are documented in PACKAGING-SYSTEM.md. **Never hand-edit the SVGs**; change the data or the layout and re-run the script.

## 4. Product catalogue from Bakeshed (`npm run sync:bakeshed`)

Pulls all products from the bakeshed.rw store API into `content/catalogue.generated.ts`, and saves 400 px thumbnails to `public/catalogue/`. **No prices are stored.**

- Partner brands are detected by name (Probake → Niacet, Dairyland, Magest, Bakerdream). Add more in `PARTNERS` in `scripts/sync-bakeshed.ts`.
- Shop items that are other sizes of a concept product are linked through `ALIASES` in the same file.
- Behind a corporate proxy the script honours `HTTPS_PROXY`.

## 5. Contacts and locations (`content/contacts.ts`)

- `offices[]` holds, for each country: entity, role, address lines, phones (with labels), `whatsapp` numbers, emails, website and shop URL.
- **WhatsApp:** add the number to `whatsapp: ["+256 …"]`. Every WhatsApp button (mobile bar, footer, map, product pages, finder, country pages) then uses it, with a pre-filled message from `lib/whatsapp.ts` (`waMessage`).
- `officeDetails` holds country-page facts: slug, city, year started, certification IDs, and an extra line.
- Map shapes are generated by `npx tsx scripts/build-map.ts` from Natural Earth data. You only need to re-run it to change hub positions.

## 6. Company pages (`content/company.ts`)

Story, milestones (keep them in year order), mission, vision, values, expertise, customer types, partners (logo files in `public/partners/`), team, press articles (images in `public/press/`) and careers.

**Add a press article:** add an object to `press` with title, outlet, date (ISO format), place, summary, url and image.

## 7. Pages, titles and navigation (`content/site.ts`)

- `staticRoutes` holds the title (≤ 45 characters before "| Maya E.A. Limited"), description (70–160 characters), sitemap priority and change frequency for each page. Category and product routes are generated.
- `npm run check:meta` fails on duplicate or over-long titles and descriptions.
- `primaryNav`, `headerCtas` and `footerNav` control the menus.
- **Indexing switch:** `NEXT_PUBLIC_ALLOW_INDEXING` (see section 10).

## 8. Images: rules

- Put files in `public/` and reference them as `/folder/file.webp`. Prefer WebP, no wider than about 1600 px.
- Use `next/image` (`<Image>`) for every image, with **meaningful `alt` text**. Use empty alt (`alt=""`) only for purely decorative images.
- Logo: `public/brand/maya-logo.png` (unchanged artwork, margins trimmed). Never recolour or redraw it.
- Current pack photos: `public/current-packs/{slug}.webp`, used for the before/after sliders.

## 9. Tools

- **Product finder:** `content/finder.ts`. Each "what are you baking" option lists categories plus a `why` sentence taken from Maya's own category copy. Business types marked `wholesale: true` see wholesale pricing as the first button.
- **Improver calculator:** uses `dosage` from the three improvers in `products.ts`. The "Guide only; follow product instructions" label is hard-coded and must stay.
- **Hero line-up:** `lib/hero.ts` lists which five packs (and which pack size) appear in the 3D hero.

## 10. Environment variables

Copy `.env.example` to `.env.local` for local work. On Vercel, set them under **Settings → Environment Variables**.

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical URLs, sitemap, and **the URL inside every pack QR code** (run `npm run labels` after changing it) |
| `NEXT_PUBLIC_ALLOW_INDEXING` | `false` = noindex and robots disallow (proposal); `true` = indexable (go-live) |
| `RESEND_API_KEY` | Email sending. Empty = dry run (enquiries are logged, not emailed) |
| `ENQUIRY_FROM` | Sender address on a domain verified in Resend |
| `ENQUIRY_TO_KE`, `ENQUIRY_TO_UG`, `ENQUIRY_TO_RW` | Inbox per country (comma-separate several) |
| `ENQUIRY_TO_DEFAULT` | "Other" countries and any unset country |

**Never commit `.env.local`.** It's already git-ignored.

## 11. Forms

- Validation rules (shared by browser and server): `lib/forms/schema.ts`.
- Email routing, spam guards (honeypot, under-3-second submits, 5 per 10 minutes per IP) and email layout: `lib/forms/server.ts`.
- Endpoints: `app/api/wholesale/route.ts` and `app/api/contact/route.ts`.
- To add a wholesale question: add the field to the right step in `wholesaleSteps`, render it in `components/forms/WholesaleForm.tsx`, and add a row in the API route's email table.

## 12. Command reference

| Command | Does |
|---|---|
| `npm run dev` | Local dev server at http://localhost:3000 |
| `npm run build` then `npm start` | Production build and server |
| `npm run labels` | Regenerate all pack artwork and textures from `/content` |
| `npm run sync:bakeshed` | Refresh the 121-product catalogue and thumbnails from bakeshed.rw |
| `npm run check:meta` | Check page titles and descriptions |
| `npx tsx scripts/placeholder-matrix.ts` | Print the per-product verified-facts matrix (for PLACEHOLDERS.md) |
| `npx tsx scripts/build-map.ts` | Rebuild map shapes and hub positions |
| `npm run lint` | Lint |

## 13. Where things are (for developers)

```
app/                    routes (App Router). Each page imports its metadata via metaFor(path)
  api/                  form endpoints
  products/[category]/[product]/   product pages + opengraph-image.tsx
components/
  home/ products/ packaging/ tools/ forms/ locations/ site/ concept/ motion/
  three/                PackModel (simple geometry), HeroScene, ViewerScene
lib/                    pack file paths, JSON-LD, metadata, OG renderer, 3D gating, WhatsApp links
scripts/                generators (labels, catalogue, map, photos, checks)
public/                 brand, packaging, current-packs, catalogue, partners, press, certifications
docs/                   previews per stage, mobile QA screenshots
```

**3D performance rules (do not undo):**
- 3D loads only after the first interaction, and only for viewers in view.
- No 3D on Save-Data, low-power devices, reduced motion, or without WebGL2. Those visitors get a static image and a "View in 3D" button.
- Static WebP images always render first.
