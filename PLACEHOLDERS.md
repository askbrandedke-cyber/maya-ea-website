# PLACEHOLDERS: what we need from Maya

Every item below appears on the site or on the label artwork as a visible red dashed **[CONFIRM: …]** marker, or it blocks go-live. The list was extracted from the code (`confirm(...)` calls), so it matches what visitors see.

**When needed**
- 🟥 **Before the pitch:** answer, or be ready to explain, during the presentation.
- 🟧 **Before go-live:** the site must not launch without these.
- 🟨 **Before print:** needed only if Maya adopts the packaging.

**How to fill an item:** edit the file named in "Where to change", then remove the `confirm(...)` call. See CONTENT-GUIDE.md.

---

## A. Brand and packaging decisions (Maya management)

| # | Item | When | Where it shows | Where to change |
|---|---|---|---|---|
| A1 | **Brand hierarchy:** Maya logo as the master brand, Bakeshed as the range name (proposal "Option A"). | 🟥 | /packaging next steps; every concept pack | `content/brand.ts` (`rangeName`), `scripts/labels/layout.ts` |
| A2 | **Which unbranded shop products are Maya's own label.** 9 categories show a stand-in pack marked "is this an own-label product?": Baguette, Simsim Seeds, Potassium Sorbate, Dark Compound Chips, Red Cherries, Piping Gel, Greaseproof Paper, Round Cake Base, Cake Box. | 🟥 | Those 9 product pages and packs; the shelf view | `content/products.ts` → `ownLabel: "own-label"` |
| A3 | Whether Maya sells an **own-label piping gel**. The current photo shows a Bakeland (partner) pack. | 🟥 | /products/piping-gels/piping-gel | `content/products.ts` |
| A4 | **Vector logo** (AI, SVG or PDF). The site and packs currently use the PNG from mayaealtd.com. | 🟨 | Print artwork | `public/brand/`, `scripts/.maya-logo-label.png` |
| A5 | Whether **/packaging stays public** at go-live, and whether the nav item "Packaging proposal" stays. | 🟧 | Main menu | `content/site.ts` → `primaryNav` |
| A6 | Whether to add a **flavour accent** to tell products apart inside large categories (27 cake premixes). | 🟨 | Packs | `scripts/labels/layout.ts` |
| A7 | **Product name spellings** for the packs. The shop uses "Softner", "Premixe" and "Alkanized"; the concepts use "Softener" and "Premix". | 🟥 | Packs and product pages | `content/products.ts` → `name` |

## B. Product facts (Maya technical / quality team)

Only verified facts are printed. Anything missing shows as a [CONFIRM] box on the product page and the back panel.

| # | Item | When | Where to change |
|---|---|---|---|
| B1 | **The improver dosage, 0.5–1% of total flour weight** (Mega Plus, Excess, Volume Plus). It came from the brief, but **we could not find it in the text of mayaealtd.com or bakeshed.rw**, and the Volume Plus pack photo shows a cropped "…00 gm for 100 kg of flour". Please confirm the figure and the full pack line. | 🟥 | `content/products.ts` → `IMPROVER_DOSAGE` |
| B2 | **Usage instructions** for the other 44 products. | 🟧 | `content/products.ts` → `usage` (or `dosage`) |
| B3 | **Storage instructions**. Verified only for Volume Plus and Easy Mix ("Store in a cool dry place", from the pack photos). | 🟧 | `storage` |
| B4 | **Ingredients and allergen statements**. Verified only for Volume Plus (soya flour carrier, INS 170 (i), ascorbic acid; contains soya). | 🟧 | `ingredients`, `allergens` |
| B5 | **Country of manufacture** per product. Only Volume Plus is verified ("Made in Uganda"). | 🟧 | `madeIn` |
| B6 | **Which certification marks apply to which product.** KEBS, UNBS and ISO 22000:2018 are held per site, and a mark may only appear on a product made at that site. | 🟧 | Back panel (`scripts/labels/layout.ts`); product page |
| B7 | **Halal certification.** The Volume Plus pack shows a Uganda Halal Bureau mark that the website does not list. | 🟧 | `content/certifications.ts` |
| B8 | **Pack photos:** a real Mega Plus photo (bakeshed.rw shows the Volume Plus photo for it), and a studio photo for Oil Muffin Vanilla (the shop uses a WhatsApp image). | 🟥 | Re-shoot, then `npm run sync:bakeshed` and `npx tsx scripts/current-packs.ts` |

The full per-product matrix is at the end of this file.

## C. Company copy (Maya management / marketing)

| # | Item | When | Where it shows | Where to change |
|---|---|---|---|---|
| C1 | **Mission wording.** About says "consistency, responsiveness and support"; the home page says "service and technical support". | 🟧 | /about | `content/company.ts` → `mission` |
| C2 | **The official values.** About and Home on the current site list two different sets of 7; the site uses the About set, as the brief asks. | 🟧 | /about | `values` |
| C3 | **Permission to show the partner logos** (Bakeland, Özgür Tarım, Vandemoortele, Goldenpack, Niacet, Angel), and Angel's country (listed as Egypt). | 🟧 | /about | `partners` |
| C4 | **Team photos** (optional), and which country each manager is based in. | 🟨 | /team | `team` |
| C5 | **Open roles**, if any. | 🟨 | /careers | `careers` |
| C6 | **Photos for "From our warehouse to your oven"**: inbound goods, a warehouse (Nairobi, Kampala or Kigali), order picking or delivery, and a customer bakery. | 🟥 | Home, scroll story | `components/home/Story.tsx` (`STEPS[].photo`) + `public/` |
| C7 | **Social accounts for Kenya and Uganda.** The current links (@mayaearwd) look Rwanda-specific. | 🟨 | Footer | `content/contacts.ts` → `socials` |

## D. Sales operations (country managers)

| # | Item | When | Where to change |
|---|---|---|---|
| D1 | **Which Uganda number takes WhatsApp.** Uganda currently shows "Call" instead of WhatsApp. | 🟥 | `content/contacts.ts` → Uganda `whatsapp: [...]` |
| D2 | **Whether bakeshed.rw delivers to Kenya and Uganda.** This is shown on the finder results and the Kenya and Uganda pages. | 🟥 | Remove the `Confirm` in `components/tools/Finder.tsx` and `app/locations/[country]/page.tsx` once answered |
| D3 | **Certifications that apply to Rwanda operations.** | 🟧 | `content/contacts.ts` → `officeDetails.RW.certIds` |
| D4 | **The inbox for each country** for wholesale and contact enquiries. | 🟧 | Vercel env `ENQUIRY_TO_KE` / `_UG` / `_RW` / `_DEFAULT` |
| D5 | The Uganda email is a Gmail address (bestingredientskampala@gmail.com). Should a company-domain address replace it? | 🟨 | `content/contacts.ts` |

## E. Legal (Maya's legal adviser)

| # | Item | When | Where |
|---|---|---|---|
| E1 | **Review the privacy notice** against the Kenya Data Protection Act 2019, the Uganda Data Protection and Privacy Act 2019, and Rwanda Law No. 058/2021. | 🟧 | `app/privacy/page.tsx` |
| E2 | **Data controller** name, registered address and data-protection contact for each country. | 🟧 | same |
| E3 | **Retention period** for enquiry emails. | 🟧 | same |
| E4 | **Email provider and data location** (planned: Resend). | 🟧 | same |
| E5 | **Analytics tool**, if Maya adds one. A cookie notice may then be needed. | 🟧 | same |
| E6 | **Date of legal approval**. | 🟧 | same |

## F. Packaging production (packaging supplier) 🟨

| # | Item |
|---|---|
| F1 | Real pack dimensions and dielines for each format (sack, carton, pouch, tub, jerrycan, sleeve). |
| F2 | Print proof and CMYK/Pantone match for the 14 category colours. |
| F3 | Registration and permit numbers, EAN barcodes, and language requirements (Swahili, Kinyarwanda, French) for each country. |
| F4 | Legal minimum type sizes for each pack size. The label scale is in PACKAGING-SYSTEM.md §4. |

## G. Go-live technical (Maya IT / BRANDED)

| # | Item | Where |
|---|---|---|
| G1 | A Resend account, a verified sending domain (DNS records), the API key and the `ENQUIRY_FROM` address. | DEPLOY.md §3 |
| G2 | The domain switch: `www.mayaealtd.com` DNS pointed at Vercel; `NEXT_PUBLIC_ALLOW_INDEXING=true`. | DEPLOY.md §4 |
| G3 | Google Search Console: verify the property and submit the sitemap. | DEPLOY.md §4 |

---

## Per-product data matrix

✓ = verified from Maya's site or current pack · – = shows a [CONFIRM] marker · **?** = own-label status not confirmed
Regenerate with `npx tsx scripts/placeholder-matrix.ts`.

| Product | Category | Own label | Usage/dosage | Storage | Ingredients | Allergens | Made in | Photo note |
|---|---|---|---|---|---|---|---|---|
| Volume Plus | Bread Improvers | ✓ Bakeshed | ✓ 0.5–1% | ✓ | ✓ | ✓ | ✓ |  |
| Mega Plus | Bread Improvers | ✓ Bakeshed | ✓ 0.5–1% | – | – | – | – | **see note** |
| Excess | Bread Improvers | ✓ Bakeshed | ✓ 0.5–1% | – | – | – | – |  |
| Easy Mix | Bread Improvers | ✓ Bakeshed | – | ✓ | – | – | – |  |
| Bread Softener | Bread Improvers | ✓ Bakeshed | – | – | – | – | – |  |
| Natural Sugar Deduction | Bread Improvers | ✓ Bakeshed | – | – | – | – | – |  |
| Tangerine Sponge | Cake Premixes | ✓ Bakeshed | – | – | – | – | – |  |
| Tangerine Muffin | Cake Premixes | ✓ Bakeshed | – | – | – | – | – |  |
| Coconut Sponge | Cake Premixes | ✓ Bakeshed | – | – | – | – | – |  |
| Coconut Muffin | Cake Premixes | ✓ Bakeshed | – | – | – | – | – |  |
| Passion Sponge | Cake Premixes | ✓ Bakeshed | – | – | – | – | – |  |
| Passion Muffin | Cake Premixes | ✓ Bakeshed | – | – | – | – | – |  |
| Pistachio Sponge | Cake Premixes | ✓ Bakeshed | – | – | – | – | – |  |
| Pistachio Muffin | Cake Premixes | ✓ Bakeshed | – | – | – | – | – |  |
| Oreo Sponge | Cake Premixes | ✓ Bakeshed | – | – | – | – | – |  |
| Oreo Muffin | Cake Premixes | ✓ Bakeshed | – | – | – | – | – |  |
| Lemon Sponge | Cake Premixes | ✓ Bakeshed | – | – | – | – | – |  |
| Lemon Muffin | Cake Premixes | ✓ Bakeshed | – | – | – | – | – |  |
| Strawberry Sponge | Cake Premixes | ✓ Bakeshed | – | – | – | – | – |  |
| Strawberry Muffin | Cake Premixes | ✓ Bakeshed | – | – | – | – | – |  |
| Blondy Vanilla Sponge | Cake Premixes | ✓ Bakeshed | – | – | – | – | – |  |
| Blondy White Forest | Cake Premixes | ✓ Bakeshed | – | – | – | – | – |  |
| Browny Black Forest | Cake Premixes | ✓ Bakeshed | – | – | – | – | – |  |
| Red Velvet | Cake Premixes | ✓ Bakeshed | – | – | – | – | – |  |
| Purple Velvet | Cake Premixes | ✓ Bakeshed | – | – | – | – | – |  |
| Fudge Cake | Cake Premixes | ✓ Bakeshed | – | – | – | – | – |  |
| Butter Cake | Cake Premixes | ✓ Bakeshed | – | – | – | – | – |  |
| Oil Muffin Vanilla | Cake Premixes | ✓ Bakeshed | – | – | – | – | – | **see note** |
| Oil Muffin Chocolate | Cake Premixes | ✓ Bakeshed | – | – | – | – | – |  |
| Whip S | Cake Premixes | ✓ Bakeshed | – | – | – | – | – |  |
| Caramel | General Class | ✓ Bakeshed | – | – | – | – | – |  |
| Premium Master Fat | General Class | ✓ Bakeshed | – | – | – | – | – |  |
| Icing Sugar | General Class | ✓ Bakeshed | – | – | – | – | – |  |
| Colour Vermicelli | Vermicelli | ✓ Bakeshed | – | – | – | – | – |  |
| Dark Vermicelli | Vermicelli | ✓ Bakeshed | – | – | – | – | – |  |
| Vanilla Flavour | Liquid Flavours | ✓ Bakeshed | – | – | – | – | – |  |
| Lemon Flavour | Liquid Flavours | ✓ Bakeshed | – | – | – | – | – |  |
| Coconut Flavour | Liquid Flavours | ✓ Bakeshed | – | – | – | – | – |  |
| Baguette | Bread Premixes | **?** | – | – | – | – | – |  |
| Simsim Seeds | Seeds | **?** | – | – | – | – | – |  |
| Potassium Sorbate | Preservatives | **?** | – | – | – | – | – |  |
| Dark Compound Chips | Chocolates | **?** | – | – | – | – | – |  |
| Red Cherries | Fruits | **?** | – | – | – | – | – |  |
| Piping Gel | Piping Gels | **?** | – | – | – | – | – | **see note** |
| Greaseproof Paper | Baking Papers | **?** | – | – | – | – | – |  |
| Round Cake Base | Cake Bases | **?** | – | – | – | – | – |  |
| Cake Box | Cake Boxes | **?** | – | – | – | – | – |  |

**Totals:** 47 products. Own label confirmed for 38. Usage verified for 3, storage for 2, ingredients and allergens for 1, country of manufacture for 1.
