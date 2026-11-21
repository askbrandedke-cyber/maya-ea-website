# PACKAGING SYSTEM — Maya E.A. Limited · Bakeshed range

> **Concept packaging by BRANDED — proposal only.**
> Nothing in this document or in `/public/packaging` is Maya's current packaging.

**Version:** 0.1 (stage 2 review)
**Date:** 17 November 2026
**Artwork:** `public/packaging/` (generated from `/content` by `npm run labels`)
**Previews:** `docs/previews/` (anatomy, palette, shelf, before/after, back panel)

---

## 1. The problem we are solving

Today each own-label pack is a one-off design (see AUDIT.md §4).
- Three bread improvers use three unrelated palettes.
- Product names use a different typeface on each pack.
- The brand mark moves around from pack to pack.
- Maya E.A. is hardly visible.

A baker on a shelf, or a buyer on WhatsApp, can't tell the range apart, or tell that it comes from one company.

**The system has one job:** every pack looks like Maya, and every category is recognisable from across a warehouse.

## 2. Brand architecture

| Level | What it is | Where it appears |
|---|---|---|
| **Master brand** | **Maya E.A. Limited** logo, unchanged (from `Maya-Logo-maya-final.png`) | Fixed position, top-left of every front and back panel |
| **Range** | **BAKESHED**, set as a wordmark in Poppins Bold, yellow on navy, followed by "by Maya E.A. Limited" | Brand band, right of the logo |
| **Category** | One of 14 categories, each with a **colour**, a **2-letter code** and an **icon** | Code badge, colour field, category tile |
| **Product** | Product name and descriptor | Colour field |

This is *Option A* from the audit: Maya is the master brand and Bakeshed is the range. We don't use the existing Bakeshed roof logo on concept packs. It already contains the Maya chef, so placing both would show the mascot twice.
**[CONFIRM: Maya is happy with Option A, and with the Bakeshed wordmark set in type rather than the roof logo]**

**Logo rules**
- The logo is never redrawn, recoloured, cropped or separated from its wordmark. We only trimmed the empty margin around the PNG.
- It always sits on a white plate with a 10% corner radius, so it stays legible on navy.
- Its size is fixed at 136 units tall on the front panel and 96 on the back. The inset is ½M from the top and left.
- We need a vector master (AI/SVG/PDF) for print. **[CONFIRM: vector logo file]**

## 3. Colour

### 3.1 Fixed brand colours (from mayaealtd.com)
| Token | Hex | Use on pack |
|---|---|---|
| Navy | `#1A487B` | Brand band, headings on the back panel |
| Ink | `#0D2036` | Body text, pack size, dark text on light category colours |
| Night | `#061220` | Concept tag bar |
| Chef yellow | `#FCEA00` | Signature stripe, range wordmark, code-badge ring. **Never used as text on white** (1.24:1). On navy it reaches 7.49:1. |
| White | `#FFFFFF` | Logo plate, info strip, back panel |

### 3.2 Category colours (proposal)
Each colour is assigned a text colour, its "ink", and passes **WCAG AA (≥ 4.5:1)** with that ink. The values below were measured with the WCAG relative-luminance formula.

| # | Code | Category | Colour | Ink | Contrast | Icon | Family |
|---|---|---|---|---|---|---|---|
| 01 | IM | Bread Improvers | `#1E6B3C` green | white | 6.51 | loaf with rise arrow | Bread |
| 02 | BP | Bread Premixes | `#E3B04B` wheat | ink | 8.28 | wheat ear | Bread |
| 03 | SD | Seeds | `#B5C96A` sage | ink | 9.03 | seeds | Bread |
| 04 | PR | Preservatives | `#26272B` charcoal | white | 14.92 | shield | Bread |
| 05 | CP | Cake Premixes | `#B42A57` raspberry | white | 6.16 | cake slice | Cakes & finishing |
| 06 | CH | Chocolates | `#5B2F1E` cocoa | white | 11.23 | chocolate bar | Cakes & finishing |
| 07 | FR | Fruits | `#C2410C` orange | white | 5.18 | cherries | Cakes & finishing |
| 08 | LF | Liquid Flavours | `#6B3FA6` violet | white | 7.27 | droplet | Cakes & finishing |
| 09 | PG | Piping Gels | `#0B6BB0` blue | white | 5.61 | piping bag | Cakes & finishing |
| 10 | VM | Vermicelli | `#A4167F` magenta | white | 7.00 | sprinkles | Cakes & finishing |
| 11 | GC | General Class | `#EADFC8` flour | ink | 12.44 | bowl and whisk | Cakes & finishing |
| 12 | PA | Baking Papers | `#C9A27A` kraft | ink | 7.00 | paper case | Packaging |
| 13 | CB | Cake Bases | `#4B5A6B` slate | white | 7.06 | cake board | Packaging |
| 14 | BX | Cake Boxes | `#0E6F78` teal | white | 5.89 | cake box | Packaging |

**How the palette was chosen**
- **Distinctness.** The closest pair is Cake Bases vs Cake Boxes at ΔE (CIELAB) 21. That is a clear difference at shelf distance. The first draft had a pair at ΔE 11, so we added four light colours to spread the palette by lightness as well as hue.
- **Colour is never the only cue.** For colour-blind viewers no 14-colour palette can stay fully distinct. Under deuteranopia, Cake Boxes and Vermicelli are nearly the same colour. So every pack also carries a **2-letter code, a number and an icon** in two places: the badge and the tile. This follows the intent of WCAG 1.4.1.
- **Families.** Bread inputs sit in greens, wheat and charcoal. Cake and finishing sit in saturated reds, purples, blues and browns. Packaging and consumables sit in kraft, slate and teal, which are deliberately quieter.
- **No clash with the master brand.** No category colour is close to brand navy or chef yellow. The bread-premix wheat is amber, not lemon.

## 4. Typography

The only typeface is Poppins, the same one mayaealtd.com uses. Every label converts its text to vector outlines, so the artwork needs no font files.

| Role | Weight | Size (units) | Rules |
|---|---|---|---|
| Product name | Bold, tracking −1 | 86, stepping down to 50 | Max 2 lines; auto-fit |
| Descriptor | SemiBold, CAPS, tracking +3 | 20 | e.g. "BREAD IMPROVER" |
| What it does | Regular | 25 / 34 leading | Max 3 lines, 420 wide |
| Pack size | Bold, tracking −1 | 72, stepping down to 40 | The largest text after the name |
| Range wordmark | Bold, CAPS, tracking +5 | 34 | Yellow on navy |
| Back headings | Bold, CAPS, tracking +2 | 16 | Navy, with a category-colour bar |
| Back body | Regular | 16 / 22 | |
| Concept tag | SemiBold | 17 | White on night |

Minimum print size: on a 10 kg box front (about 300 × 420 mm), 1 unit is about 0.5 mm. The smallest back-panel text (12 units) then prints at about 6 mm cap height. On 500 g pouches (about 140 × 196 mm), 1 unit is about 0.23 mm and 12 units is about 2.8 mm.
**[CONFIRM: real pack dimensions per format, so that we can set print scale and check legal minimum type sizes]**

## 5. Grid and zones (front panel)

`docs/previews/anatomy.png` shows the panel with the grid overlay.

- **Panel:** 600 × 840 units (5:7 portrait). This is the master for sacks, pouches, upright box faces, bottle labels and tub wraps. Landscape box faces centre the panel and extend the colour field sideways.
- **Module:** M = 40 units, giving 15 columns. Content margins are 1M. Band items are inset ½M.

| Zone | y | Height | Content (fixed order) |
|---|---|---|---|
| **A: Brand band** | 0 | 176 | Navy. Maya logo plate (fixed). BAKESHED / by Maya E.A. Limited / CATEGORY. Code badge top-right (r = 44, chef-yellow ring). |
| **B: Signature stripe** | 176 | 16 | Chef yellow. Identical on every pack. It is the one thing that says "Maya" from 10 metres away. |
| **C: Colour field** | 192 | 448 | Category colour, with a large icon watermark at 13% opacity. **Descriptor → product name → what it does.** Verified claims sit as outline pills at the bottom. |
| **D: Info strip** | 640 | 156 | White. NET WEIGHT / SIZE label, pack size, carton line (beside the size), category tile (icon + code). |
| **E: Concept tag** | 796 | 44 | **"Concept packaging by BRANDED — proposal only"**, mandatory and never removed in proposal artwork. |

**Front-of-pack hierarchy**, as the brief requires: (1) product name → (2) what it does → (3) pack size. The category is signalled in parallel by colour, code and icon.

## 5b. Side panel (added at stage 5)

Cartons, sacks, pouches and sleeves have side or gusset faces, and leaving them plain made the 3D packs look unfinished. Each side panel measures 372 × 840 units and uses **the same zone heights as the front**, so the navy band, the yellow stripe and the colour field run around the corner of the pack. Top to bottom it holds:
- BAKESHED and the category code badge
- the product name, set vertically (it reads bottom-to-top, so it can be read on a stacked pallet)
- the category tile
- the concept tag, in two lines

Files are named `{slug}--side.svg`.

## 6. Back panel

| Section | Content rule | Source |
|---|---|---|
| Header | Logo (fixed), BAKESHED, product name, descriptor, code badge | `content/products.ts` |
| How to use | **Only verified figures.** Mega Plus, Excess and Volume Plus: "Use 0.5% to 1% of total flour weight (5–10 g per 1 kg of flour). Guide only; follow product instructions." The g/kg figure is arithmetic on the verified percentage, not a new dosage. Volume Plus adds "Add directly to flour and mix." from its current pack. Everything else shows a **[CONFIRM]** box. | Brief, current pack |
| Storage | "Store in a cool dry place." where it is printed on the current pack (Volume Plus, Easy Mix). Otherwise **[CONFIRM]**. | Pack photos |
| Ingredients & allergens | Volume Plus only: "Soya flour carrier, INS 170 (i) and ascorbic acid as antioxidant. Contains soya." Otherwise **[CONFIRM]**. | Pack photo |
| QR code | Links to `mayaealtd.com/products/{category}/{slug}`, which is the product page and baker guide. Error correction M, 2-module quiet zone, ink on white. The URL is printed under the code. | `productPath()` |
| Certifications | KEBS · UNBS · ISO 22000:2018 as outline badges, always with **[CONFIRM: which marks apply to this product]**. A mark may only be printed for the site that makes the product. | mayaealtd.com |
| Contact | Kenya, Uganda and Rwanda: main phone and email for each | `content/contacts.ts` |
| Batch / best before | Dashed print area, plus the country of manufacture ("Made in Uganda" for Volume Plus; **[CONFIRM]** for others) | |
| Concept tag | Same as the front | |

**Not yet on the back panel** (needed before production; see PLACEHOLDERS.md): net-quantity legal statements, registration and KEBS/UNBS permit numbers, the manufacturer's legal address per country, barcodes (EAN), halal mark status, and language requirements (Kinyarwanda, French or Swahili).

## 7. Formats

| Format | Used for | 3D model (stage 5) |
|---|---|---|
| `sack` | 10–25 kg improvers, premixes, seeds, sugar, vermicelli | Pillow-shaped bag with gusset and stitched top |
| `box` | 4.5–10 kg cartons, chocolate, papers, fat | Rounded box; front panel is the label, sides use the category colour and code |
| `pouch` | 500 g – 1 kg retail units (cake premixes, icing sugar, sorbate) | Stand-up pouch with a lathe-shaped bottom gusset |
| `tub` | Piping gel, cherries, caramel | Tapered cylinder with lid; the label wraps around |
| `bottle` | 4.5 L liquid flavours | Jerrycan-style block with cap |
| `sleeve` | Cake bases and boxes (the product *is* packaging) | Paper band around a flat stack |

## 8. Rules: do and don't

**Do**
- Generate every label from `/content` (`npm run labels`). Never hand-edit an SVG.
- Keep zones A, B and E identical across all packs.
- Use a product's own pack claims only when they appear on Maya's current pack or site.
- Use the category's assigned ink. Light colours (wheat, sage, flour, kraft) always take ink, never white.

**Don't**
- Don't put yellow text on white or light colours.
- Don't add dosages, prices, awards, "No. 1" claims or nutritional claims that Maya hasn't supplied.
- Don't make concept packs for partner brands (Niacet, Dairyland, Bakeland, Magest, Bakerdream and others). Show their real packs.
- Don't show a concept without the concept tag, in any medium: print, web, 3D, social or OG images.

## 9. Scope of the artwork delivered

- **47 products: 74 front panels (one per pack size), 47 back panels and 47 side panels**, for **168 SVGs** in `public/packaging/labels/{category}/`:
  - **38 own-label products**, the ones sold under the Bakeshed name.
  - **9 stand-ins**, one each for the categories with no Bakeshed-named product. Each shows **[CONFIRM: is this an own-label product?]** on the front.
- PNG textures for the 3D viewer: `public/packaging/textures/` (these become WebP in the performance pass).
- System sheets: `public/packaging/system/` (`anatomy`, `palette`, `shelf`).
- 14 category icons: `public/packaging/icons/`.
- `public/packaging/manifest.json` maps product and size to its files. The site reads this.

File naming: `{product-slug}--{size-key}--front.svg` and `{product-slug}--back.svg`.

## 10. Known limits of this concept

- **Products within a category look alike by design.** Only the name changes. If Maya wants faster picking inside a large category (Cake Premixes has 27 products), we can add a flavour accent (a small coloured dot plus flavour name in the info strip) without breaking the system. **[CONFIRM: wanted?]**
- The SVGs are about 165 KB each because all text is outlined and the logo is embedded. That's fine for print hand-off. The website uses compressed textures instead.
- Print production still needs: real dielines from Maya's packaging supplier, CMYK/Pantone conversion of the category colours, and a print proof. **[CONFIRM: packaging supplier and dielines]**
