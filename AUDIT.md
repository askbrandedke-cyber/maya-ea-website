# AUDIT — mayaealtd.com and bakeshed.rw

**Prepared by:** BRANDED Agency
**Date:** 16 November 2026
**Sources read:** mayaealtd.com (Home, About, Press, Products, Careers, Team, Contact), the CSS, robots.txt and sitemap.xml requests, bakeshed.rw (home page, the full WooCommerce catalogue through its public Store API, 3 improver product pages), and 10 current pack photos.
**Raw captures:** `_research/` (page text, `catalogue.txt` with all 121 shop products, logo, certification marks, pack photos).

---

## 1. What we extracted

### Brand
| Item | Value | Source |
|---|---|---|
| Logo | `Maya-Logo-maya-final.png`, 904×1080 PNG. Chef mascot (yellow toque and beard) in a navy roundel, with the wordmark "MAYA E.A LIMITED / Manufacturer and distributor of food ingredients & additives". We need a vector (SVG/AI) version. | mayaealtd.com/images |
| Primary navy | `#1A487B` (deep: `#163C67`, `#0D2036`, `#061220`) | site CSS |
| Primary yellow | `#FCEA00` (tint `#FFF666`) | site CSS |
| Accent red | `#DD2831` (the mascot's face) | site CSS + logo |
| Typeface | Poppins (only family in use) | site CSS |
| Second brand | **BAKESHED**: "Home of unbeatable baking ingredients". A house-roof mark with the Maya chef inside it. Used on all own-label packs and the Rwanda shop. | packs, bakeshed.rw |

### Company facts (as stated on the live site)
- Established in Kenya in 2009. Uganda in 2016 (as Best Ingredients Africa Ltd). Rwanda in 2024. The About page says Rwanda serves "Eastern Congo & Burundi".
- Milestones: 2009 founded · 2015 product line grew beyond yeast · 2016 Uganda · 2018 international supplier partnerships (Europe, Middle East, Asia) · 2020 technical support with international baking experts and an in-house team · 2024 Rwanda.
- Mission: "To supply bakery ingredients and food-production inputs with the consistency, responsiveness and support customers need to run better operations." (The home page uses "service and technical support" instead of "responsiveness and support". **[CONFIRM]** which wording.)
- Vision: "To remain a trusted East African partner for bakery ingredients, premixes and food additives across regional markets."
- Values: the About page lists 7 (Quality, Innovation, Customer Focus, Integrity, Sustainability, Teamwork, Safety). The home page lists a different 7 (Consistent Quality, Practical Solutions, Customer Support, Integrity, Regional Reach, Partnership, Food Safety). **[CONFIRM]** which set is official.
- Certifications: KEBS · UNBS · ISO 22000:2018 (Kenya operations) · ISO 22000:2018 (Best Ingredients Africa Ltd, Uganda). The Volume Plus pack also shows a **Uganda Halal Bureau** mark that the website does not list. **[CONFIRM]**
- Supplier partners shown on the site: Bakeland (Egypt), Özgür Tarım (Turkey), Vandemoortele (Belgium), Goldenpack (Egypt), Niacet (Netherlands), Angel (Egypt as listed; **[CONFIRM]** the country), Maesindo (Indonesia).
- Team: 3 board members and 4 senior managers, names and titles only, with no photos.
- Press: 1 article, New Times Rwanda, 12 Feb 2026.

### Contacts. Two items are missing from the brief:
- **Kenya HQ:** Off Mombasa Road, ICD Road, Inside Ideal Ceramics Building, Go-down 1C, Nairobi · Office +254 773 864 849 · WhatsApp +254 743 590 495, +254 706 362 534 · info@mayaealtd.com
- **Uganda (Best Ingredients Africa Ltd):** Plot 94, Block 112, Kolo Namanve Industrial Park, P.O. Box 4224, Kampala · +256 788 722 180, +256 759 097 176, +256 750 357 947 · **bestingredientskampala@gmail.com** (not in the brief) · www.bestingredientsafrica.com
- **Rwanda:** GS, Street Rda/2, Kigali Special Economic Zone, Gasabo District · Office +250 793 902 825 · WhatsApp +250 795 598 607 · **Additional line +250 795 027 270** (not in the brief) · info@bakeshed.rw · bakeshed.rw
- Social accounts: Facebook (share link), X @mayaearwd, Instagram @mayaearwd. These handles look Rwanda-specific. **[CONFIRM]** whether Kenya and Uganda have their own accounts.
- The site does not say which Uganda number takes WhatsApp. **[CONFIRM]**

### Catalogue (bakeshed.rw, live API, 16 Nov 2026)
14 categories, 121 products: Baking Papers 24 · Bread Improvers 9 · Bread Premixes 5 · Cake Bases 8 · Cake Boxes 6 · Cake Premixes 27 · Chocolates 5 · Fruits 3 · General Class 17 · Liquid Flavours 3 · Piping Gels 5 · Preservatives 4 · Seeds 3 · Vermicelli 2.
The shop shows prices in RWF. The new site will **not** copy them and will link to Bakeshed instead.

Bread improvers named in the brief:
| Product | Pack (shop text) | Shop URL |
|---|---|---|
| Bakeshed Bread Improver (Mega Plus) | 1 × 20 kg | /product/bakeshed-bread-improver-20kg-mega-plus/ |
| Bakeshed Excess Bread Improver | 1 × 4.5 kg | /product/bakeshed-excess-bread-improver/ |
| Bakeshed Bread Improver (Volume Plus) | 1 × 10 kg | /product/bakeshed-bread-improver-10kg-volume-plus/ |

---

## 2. Current site: what works

1. **It is already fast.** It is built in Next.js. Mobile Lighthouse scores, measured today:

   | Page | Performance | Accessibility | Best practices | SEO | LCP | Page weight |
   |---|---|---|---|---|---|---|
   | Home | 89 | 86 | 100 | 100 | 3.6 s | 568 KiB |
   | Products | 100 | 86 | 100 | 100 | 1.5 s | 325 KiB |

   **This raises the bar.** Your target of "85+ performance" is *lower* than the current home page. A 3D-heavy rebuild that scores 85 would be a regression we would have to explain to Maya. We will hold ourselves to **≥ 89 on mobile for the home page and ≥ 95 on inner pages**.
2. The copy is plain and factual, with little hype. Most of it can be reused.
3. Contacts are complete and use `tel:` and `mailto:` links. Rwanda has a `wa.me` link.
4. The Products page has a sensible model: categories → "Buy on Bakeshed", plus a separate wholesale CTA.
5. The brand colours are strong and recognisable: navy, chef yellow and red.
6. The certifications are shown with real marks.

## 3. Current site: what is weak

### Structure and content
- **The same message repeats on every page.** Home, About and the footer all restate the history, mission, values and three addresses. Home and About give *different* values and mission wording.
- **The milestones are out of order** (2016 is listed before 2015).
- **Data errors on the Products page.** The "Seeds" card uses the cocoa-powder photo. Category counts don't match the shop (Bread Improvers shows 8 on the site and 9 on the shop; General Class 15 vs 17; Cake Boxes 5 vs 6; Piping Gels 4 vs 5). The new site will read counts from one data file, or from the shop API at build time.
- **No individual product pages.** Buyers can't see what a product does, its pack size or its usage on the corporate site. Every click leaves for Bakeshed.
- **"Shop Now" goes to bakeshed.rw for Kenya and Uganda too.** It's unclear whether Bakeshed delivers outside Rwanda. **[CONFIRM]**
- **Thin pages.** Careers is a single sentence. Press has one article and a line saying "More media updates will be added here". Team has names only.
- **The trust signals are weak for a B2B buyer.** There is no clear "who we supply" proof, no product specs and no download (catalogue or spec sheets).

### Calls to action
- The hero is a **5-slide auto-carousel**. Most visitors see only the first slide, and its CTAs are "View Products" and "Contact Us". There is **no wholesale-pricing CTA above the fold**, even though wholesale is the main B2B conversion.
- The site shows **no WhatsApp click-to-chat for Kenya or Uganda**, even though WhatsApp is the main sales channel in the region.
- The contact form is a single step and collects no business type, products or volume. Sales has to ask again.

### SEO, measured
- **All 7 pages share one `<title>` and one meta description.**
- **There is no H1 on the home page.**
- **No Open Graph or Twitter tags.** Shared links on WhatsApp and Facebook have no preview image.
- **No JSON-LD** (Organization, LocalBusiness or Product).
- **No canonical tags.**
- **robots.txt and sitemap.xml both return 404.**
- No product URLs exist, so Google has nothing to index for searches such as "bread improver Kenya".

### Accessibility, measured
Lighthouse accessibility scores 86 on both pages tested. The failures are:
- **Buttons without accessible names.** The mobile menu button is an icon with no label.
- **Links without discernible names.** The Facebook, X and Instagram icon links have no label.
- **Touch targets are too small or too close** on mobile.
- **Contrast risk.** Brand yellow `#FCEA00` on white is about 1.2:1, so it can't carry text on white. It's fine on navy, at about 7.5:1. The current site mostly uses it correctly, but the new system must make this a hard rule.

### Mobile
- The home page is **12,220 px tall at phone width**, roughly 15 screens of scrolling, much of it repeated content.
- Content fades in on scroll. In a full-page capture, large sections were blank until scrolled into view. The text is in the HTML, so SEO is fine, but on slow devices it can look empty. The new build will render content visible by default and add motion only as an enhancement.

### Speed
Speed is good overall. Lighthouse flags unused JavaScript, images not served in WebP/AVIF, and oversized images. Shop thumbnails are hot-linked through `/_next/image` with `w=3840` for 300 px images.

### Bakeshed shop (observations only; out of scope to rebuild)
- Logo images have empty `alt` text. There are 7 empty `<img>` tags in the banner area.
- **Mega Plus uses the Volume Plus photo.**
- There are typos in product names: "Softner", "Premixe", "Alkanized". **[CONFIRM]** the spellings Maya wants on concept packs. We propose "Softener", "Premix" and "Alkalised".

---

## 4. Packaging consistency (current packs)

Reviewed: Blondie Vanilla Sponge Cake Mix, Volume (+) Plus, Bread Softener, Excess, Easy Mix, Coconut Liquid Flavour, Colour Vermicelli, plus third-party packs (Niacet Pro Bake, Dairyland Milk Compound, Bakeland Piping Gel).

| Issue | Evidence |
|---|---|
| **No shared layout.** Every own-label pack is a one-off design. | Volume Plus: green and yellow ornamental frame. Excess: diagonal photo split with orange script. Softener: red and orange full-bleed photo. Blondie: white with an orange badge. Easy Mix: white sack with purple and yellow bands. |
| **No colour logic.** The three bread improvers use three unrelated palettes. | Green (Volume Plus), cream/black/yellow (Excess), white/purple (Easy Mix) |
| **Name typography changes on every pack.** | Serif (Volume Plus), italic script (Excess), bold sans (Softener), script (Blondie) |
| **The brand mark moves and changes size.** | Bakeshed house mark sits top-centre, large, on Excess; small at top-centre on Volume Plus; tiny top-right on the vermicelli sticker |
| **Maya E.A. is barely visible.** The chef appears only inside the Bakeshed roof icon, and "Maya E.A." appears nowhere on the front. | All own-label packs |
| **Weak hierarchy.** It is hard to tell what the product does and how much is in the pack. | Net weight appears in different corners. "Tolerance / Volume / Texture" claims appear only on Volume Plus. |
| **Some packs are sticker-only.** | Coconut flavour (white A5 sticker on a jerrycan), vermicelli (plain bag with a small sticker) |
| **Naming and spelling inconsistencies.** | "VOLUME (+) PLUS" on the pack vs "Volume Plus" on the shop. "INGREDDIENTS" in the Bakeshed tagline on the Volume Plus pack. |
| **No QR code, no web link, no country contacts** on the front or back. | All |
| **The level-of-use line is cropped in the only photo we have.** | Volume Plus reads "…00 gm for 100 kg of flour". We can't see the first digit, so it can't be checked against the 0.5–1% figure. |
| **Inconsistent product photography.** | Mixed backgrounds (white, grey, wall), crushed boxes, glare. This weakens the "before" side of the before/after slider. |

**Our conclusion:** the packaging problem is real and easy to show. Seven own-label packs look like seven different companies. That is the core of the BRANDED proposal.

---

## 5. Decisions needed from you before the packaging stage

These change what we build, so we're raising them now rather than guessing.

1. **Brand hierarchy on packs: Maya or Bakeshed?** Today the packs are branded **BAKESHED**, and the Maya chef appears only inside its roof icon. The brief says the "Maya logo position is fixed on every pack."
   - *Option A (we recommend this):* the **Maya E.A. logo is the fixed master mark** in a top-left lock-up, and **Bakeshed is the range name** ("Bakeshed Volume Plus"). This keeps both marks and matches the brief.
   - *Option B:* Bakeshed stays the lead brand and a "by Maya E.A. Limited" endorsement bar is fixed at the bottom.
2. **Third-party brands.** Many products in the catalogue are partner brands (Niacet Pro Bake, Dairyland, Bakeland, Magest, Bakerdream). Redesigning those packs would misrepresent the partners. **Our plan:** concept packs only for Maya/Bakeshed own-label products. Partner products show their real pack photo with a "Partner brand" tag.
   - The catch: some categories (for example Chocolates, Fruits and Seeds) may contain **no own-label product**. In the Shelf View we would show those as clearly labelled *"Concept own-label pack (proposal only)"* using a generic category name, never an invented product name. **[CONFIRM]** this is acceptable, or tell us which products are Maya's own label.
3. **The improver dosage.** You gave us 0.5–1% of flour weight for Mega Plus, Excess and Volume Plus. **We couldn't find this figure anywhere in the text of mayaealtd.com or bakeshed.rw**, and the Volume Plus pack shows a cropped "…00 gm per 100 kg". We will use your figure because you supplied it. Until Maya confirms, we'll label the calculator "guide only; follow product instructions" and add a **[CONFIRM]** note.
4. **Counters.** The live site shows "15+ years" and "B2B / ISO" stat tiles. As instructed, we'll use only **Since 2009 · 3 countries · 14 categories**.
5. **The supplier-partner logos are on Maya's live site** (Vandemoortele, Niacet and others). They aren't invented, so we plan to keep a "Supplier partners" strip. **[CONFIRM]** Maya has permission to show those logos.

---

## 6. Plan

### Proposed sitemap (detailed in the next stage)
```
/                       Home: 3D pack line-up hero, value line, 2 CTAs, finder, shelf teaser, map, certifications
/products               Explorer: filter, search, flip cards, links to Bakeshed
/products/[category]    14 category pages: colour-coded, products, uses, Bakeshed link
/products/[cat]/[slug]  Own-label product pages: 3D viewer, before/after, pack sizes, back-panel info, QR target
/packaging              The proposal: system, shelf view, before/after gallery (all tagged "Concept by BRANDED")
/tools/improver-calculator
/product-finder
/about                  History, milestones (fixed order), mission, vision, values, certifications, partners
/locations              Interactive map with 3 hubs plus per-country pages /locations/kenya|uganda|rwanda
/wholesale              Multi-step enquiry form
/press, /careers, /team, /contact
sitemap.xml, robots.txt, OG images per page
```

### Build approach
- **Next.js App Router, TypeScript, Tailwind, Framer Motion.** GSAP is used only for the "warehouse to oven" scroll story. R3F with drei builds the packs from primitives: box, pouch (a deformed plane/lathe), tub (a cylinder with lid) and sack. Label textures come from the same SVG artwork exported to `/public/packaging`.
- **Content lives in `/content/*.ts`** (categories, products, packs, contacts, certifications, milestones), with types in `/content/types.ts`. Shop counts and links are refreshed from the Bakeshed Store API by a script (`npm run sync:bakeshed`), not at runtime.
- **The performance budget covers mobile data:**
  - Server-render everything. Three.js loads only through `dynamic(() => import(...), { ssr:false })` after an `IntersectionObserver` fires.
  - A pre-rendered **static WebP poster** of every 3D scene is shown first. The 3D stays off when `prefers-reduced-motion` is set, `navigator.connection.saveData` is on, or `hardwareConcurrency ≤ 4` without WebGL2, and the user gets a "View in 3D" button instead.
  - The home page targets less than 170 KB of JavaScript before 3D loads, AVIF/WebP images, and Poppins self-hosted via `next/font` with only the 400/600/700 weights.
- **SEO:** unique metadata per route, OG images through `next/og`, JSON-LD (Organization with 3 `location`s, Product, BreadcrumbList), canonical URLs, sitemap and robots.
- **Accessibility:** a WCAG AA token palette (yellow never used as text on white), labelled icon buttons, 44 px touch targets, a keyboard-operable 3D viewer and before/after slider (arrow keys plus visible buttons), and a skip link.
- **Concept labelling is enforced in code.** A single `<ConceptPack>` wrapper renders the tag *"Concept packaging by BRANDED — proposal only"* on every concept pack in 2D, 3D, the shelf and OG images, and the label artwork includes it too. Components can't render a concept pack without the tag.
- **Forms:** zod validation on the client and in `/api/wholesale`. Email goes out through Resend (or SMTP) with keys in `.env.local`, plus a honeypot field and basic rate limiting. Enquiries are routed to the right country inbox.

### Placeholders already known (they will go into PLACEHOLDERS.md)
- A vector logo (SVG/AI) and Bakeshed mark.
- Which products are Maya/Bakeshed own label.
- Confirmation of the improver dosage, and the full Volume Plus level-of-use line.
- Real warehouse and production photos for the scroll story.
- Pack sizes per product beyond the shop text, such as 1×20 kg.
- Storage text per category (the only verified line is "Store in a cool dry place", from the Volume Plus pack).
- A Uganda WhatsApp number, and whether Bakeshed delivers to Kenya and Uganda.
- The official mission wording and values set, and the Halal certification status.
- Permission to show partner logos.
- The inbox that receives wholesale enquiries in each country.

---

**Next stage:** once you sign off sections 5 and 6, I'll produce PACKAGING-SYSTEM.md and the SVG label artwork for all 14 categories.
