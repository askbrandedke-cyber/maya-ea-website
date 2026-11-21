# SITEMAP — Maya E.A. Limited (BRANDED proposal)

**Stage:** 3 of 9, for review
**Date:** 17 November 2026
**Source of truth:** `content/site.ts` holds the routes, titles, descriptions, nav and sitemap priorities. Run `npm run check:meta` to confirm every title and description is unique and fits Google's limits (currently 77 routes, 0 issues).

---

## 1. Principles (from AUDIT.md)

1. **Keep every current URL.** `/about`, `/press`, `/products`, `/careers`, `/team` and `/contact` stay at the same paths, so we need no redirects and lose no search ranking.
2. **One job per page.** History, mission and values live **only** on /about. Addresses live **only** on /locations and /contact. Today they repeat on Home, About and the footer.
3. **Wholesale is the main conversion.** "Request wholesale pricing" is in the header, the hero, every product page and a sticky bar on mobile. "Shop on Bakeshed" is always the second option.
4. **Concepts are fenced off.** Concept packs appear on /packaging, product pages, the hero and category pages, always inside a `<ConceptPack>` frame that carries the tag *"Concept packaging by BRANDED — proposal only"*.
5. **The proposal build is not indexed.** The robots meta tag and `robots.txt` say `noindex` until `NEXT_PUBLIC_ALLOW_INDEXING=true` is set. Without this, a public Vercel preview would compete with mayaealtd.com in Google and show concept packs as if they were real. We flip the switch only when Maya approves go-live.

## 2. Tree: 77 URLs

```
/                                   Home
├── /products                       Product explorer: 14 categories, 121 shop products
│   ├── /products/[category]        ×14 category pages, colour-coded
│   │   └── /[product]              ×47 product pages: 3D concept pack, before/after (QR target)
├── /packaging                      Packaging proposal: system, shelf view, before/after gallery  [concept]
├── /tools
│   ├── /tools/product-finder       3-question quiz → categories
│   └── /tools/improver-calculator  Flour weight → Mega Plus / Excess / Volume Plus at 0.5% and 1%
├── /wholesale                      Multi-step enquiry: business → products → volume → contact
├── /about                          History, milestones, mission, vision, values, certifications, partners
├── /locations                      Interactive regional map
│   ├── /locations/kenya            HQ Nairobi
│   ├── /locations/uganda           Best Ingredients Africa Ltd, Kampala
│   └── /locations/rwanda           Kigali SEZ, Bakeshed shop
├── /contact                        Offices, WhatsApp per country, general message form
├── /team · /press · /careers       Kept from the current site; content unchanged
├── /privacy                        Required: forms collect personal data  [CONFIRM: text from Maya]
└── (system) /sitemap.xml · /robots.txt · /opengraph-image per route · /api/wholesale · /api/contact · 404
```

Product counts: there are 14 category pages. The explorer lists all **121** Bakeshed products. **47** of them have their own page, the own-label products and stand-ins that carry concept packs. Every other product (mainly partner brands) appears as an explorer card that links straight to bakeshed.rw.

## 3. Navigation

**Header (desktop):** logo · Products · Packaging proposal · Tools ▾ (Product finder, Improver calculator) · About · Locations · Contact · **[Request wholesale pricing]** (primary button) · Shop on Bakeshed ↗ (secondary)

**Mobile:**
- The header has the logo, a hamburger button with an accessible label, and a full-screen menu with the same items. Every touch target is at least 44 px.
- A **sticky bottom bar** shows `WhatsApp` (opens a country picker, then a pre-filled `wa.me` message) and `Wholesale pricing`. It hides on /wholesale itself.

**Footer:** 3 columns (Products: 14 categories · Company · Buy) + 3 country blocks (phone, WhatsApp, email) + certification marks + social links (each with a label) + "Concept packaging by BRANDED — proposal only" + © line.

**Breadcrumbs:** on every page below the top level (`Home › Products › Bread Improvers › Volume Plus`), with matching `BreadcrumbList` JSON-LD.

## 4. Page specs

Order of sections = order on the page. "★" marks the page's primary action.

### `/` Home
**Job:** Show in under 5 seconds who Maya is, what it supplies and where, then route the visitor to buy, to a category, or to the proposal.
**H1:** Bakery ingredients for Kenya, Uganda and Rwanda
**Mobile budget:** about 7 screens, against about 15 today.

| # | Section | Content | Interactive | Notes |
|---|---|---|---|---|
| 1 | **Hero** | Value line: "Bread improvers, premixes, chocolates and bakery supplies, from Nairobi, Kampala and Kigali since 2009." ★ Request wholesale pricing · Shop on Bakeshed | 3D line-up of 5 concept packs that tilts with mouse, touch or gyro | A static WebP poster renders first. 3D loads after first paint, and never on Save-Data, reduced motion or low-power devices. Concept tag stays on screen. |
| 2 | **Proof strip** | Counters: **Since 2009 · 3 countries · 14 categories**. Certification marks: KEBS · UNBS · ISO 22000:2018 (KE) · ISO 22000:2018 (UG) | Counters animate once on view; the marks scroll as a marquee | Verified numbers only |
| 3 | **Shop by category** | 14 colour tiles (code, icon, name, shop count) | Hover/tap lift; links to /products/[category] | The tiles reuse the packaging colours, so the system is visible before the visitor reaches /packaging |
| 4 | **Product finder (inline)** | Question 1 of 3 shown; the result links to categories | 3-step quiz | The same component as /tools/product-finder |
| 5 | **From our warehouse to your oven** | 4 steps: Source → Store → Deliver → Bake. Text from About/Partnerships copy | GSAP pinned scroll story (fades without motion) | Photos: **[CONFIRM: warehouse, delivery and bakery photos]** placeholders |
| 6 | **The packaging proposal** | Before/after slider (Volume Plus), a strip of the shelf view, link to /packaging | Drag slider (keyboard: arrows) | Framed as "Proposal by BRANDED" |
| 7 | **Where we are** | Regional map with 3 hubs | Hubs animate in; clicking one opens address, phone, WhatsApp and shop | Same component as /locations |
| 8 | **Wholesale band** | "Need bulk or recurring supply?" ★ Request wholesale pricing · WhatsApp per country | — | Ends every journey on the main action |

### `/products` Explorer
**Job:** Find any product in under 3 interactions.
**H1:** Bakery ingredients, premixes and supplies
- Search box: matches product names and category names, client-side, over the 121 products.
- Filter chips: 14 categories plus "Concept pack available".
- Grid of flip cards:
  - **Front:** product photo from bakeshed.rw, name, category colour chip.
  - **Back** (on hover, tap or Enter): uses (category copy), pack size (shop text), and the buttons **Buy on Bakeshed ↗** and, where one exists, **View product**.
- Wholesale band at the bottom.
- **No prices anywhere.**
- **JSON-LD:** BreadcrumbList, plus an ItemList of the categories.

### `/products/[category]` ×14
**Job:** Prove Maya covers this need, and send the visitor to buy.
**H1:** {Category name}
- **Header:** category colour band with code and icon, the description (verbatim from Maya's site), the shop count, ★ Buy this category on Bakeshed · Request wholesale pricing.
- **Product grid:** the products in this category, from the explorer data.
- **Concept pack strip:** this category's concept packs, tagged.
- **Tools:** the Bread Improvers page embeds the improver calculator.
- **Related categories:** others in the same family.
- **JSON-LD:** BreadcrumbList, plus an ItemList of the products.

### `/products/[category]/[product]` ×47
**Job:** A product page and baker guide, and the target of the QR code on the pack.
**H1:** {Product name}, with the descriptor as a sub-line.

| Section | Content |
|---|---|
| Summary | Name, descriptor, what it does, pack sizes, ★ Buy on Bakeshed ↗ · Request wholesale pricing · WhatsApp |
| **3D pack viewer** | Drag to rotate, pinch or scroll to zoom, switch between pack sizes and formats, view front or back. A static PNG shows first. Concept tag pinned in the viewer. |
| **Before / after** | The current pack photo from bakeshed.rw vs the concept front. Where the shop photo is wrong (for example, Mega Plus shows the Volume Plus photo), a [CONFIRM] note appears. |
| Baker guide | Usage and dosage (**verified only**; improvers link to the calculator). Storage, ingredients and allergens where verified. Everything else shows a visible [CONFIRM] block. |
| Back panel | The back-panel artwork, zoomable |
| Related | Other products in the category |

- **JSON-LD:** `Product` with name, brand (Bakeshed), manufacturer (Maya E.A. Limited), category, image and URL. It has **no `offers`**, because we don't publish prices. Also BreadcrumbList.
- Stand-in products carry a banner: **[CONFIRM: is this an own-label product?]**

### `/packaging` Packaging proposal [concept]
**Job:** The centrepiece of the pitch. Show Maya the problem, the system and the result.
**H1:** A packaging system for the Bakeshed range (proposal)
1. **The problem:** a grid of current packs (from bakeshed.rw), with the audit findings as short captions.
2. **The system:** an interactive anatomy view (hover a zone to see its rule), the colour palette, and the type scale.
3. **Shelf view:** a horizontal scrolling shelf with 14 packs, one per category, grouped Bread / Cakes & finishing / Packaging. A toggle switches between the current shelf and the concept shelf.
4. **Before / after gallery:** sliders for every product that has a current photo.
5. **3D formats:** sack, box, pouch, tub, bottle and sleeve, each switchable.
6. **What it needs from Maya:** the open [CONFIRM] items, and next steps.
- Every pack on the page carries the concept tag, and the page header states "Proposal by BRANDED Agency, not current packaging".

### `/tools/product-finder`
**Job:** Turn "I bake X" into the right categories.
**H1:** Find the right ingredients
- **Q1, what are you baking?** Bread & buns · Cakes & cupcakes · Decorated & celebration cakes · Pastries & doughnuts · Other food production.
- **Q2, your scale?** Home or small batch · Commercial bakery or café · Food manufacturer · Wholesaler or retailer.
- **Q3, your country?** Kenya · Uganda · Rwanda · Other.
- **Result:**
  - Recommended categories, ranked by a rule table in `content/finder.ts`. It maps only to Maya's own category descriptions; no new claims.
  - CTAs based on the answers: commercial, manufacturer and wholesaler answers get Wholesale as the primary CTA. Small-batch buyers get Bakeshed.
  - The WhatsApp link for the chosen country.

### `/tools/improver-calculator`
**Job:** A useful tool that also shows Maya's expertise.
**H1:** Bread improver calculator
- **Input:** flour weight in kg or g (number, validated, greater than 0).
- **Output:** a table for Mega Plus, Excess and Volume Plus, giving the amount at 0.5% and at 1%. The figure is the same for all three, because the verified range is the same.
- **Label:** "Guide only; follow product instructions." It stays visible next to the results.
- **Links:** to each product page and to Buy.

### `/wholesale`
**Job:** Capture a qualified lead that sales can act on without calling back to ask basic questions.
**H1:** Request wholesale pricing
- **Step 1, business type:** Commercial bakery · Café · Food manufacturer · Wholesaler · Supermarket chain · Other. These are the customer types listed on Maya's site.
- **Step 2, products:** multi-select of the 14 categories, plus optional free text for specific products.
- **Step 3, volume:** frequency (one-off, weekly, monthly), approximate quantity per order (free text with a unit picker), and country of delivery.
- **Step 4, contact details:** name, company, phone (with country code), email, preferred contact method (WhatsApp, phone or email), and consent to the privacy notice.
- **Behaviour:**
  - zod validation on every step and again on the server.
  - The enquiry goes to `/api/wholesale` and is routed by country to that office's inbox **[CONFIRM: inbox per country]**.
  - The success screen offers WhatsApp as a faster follow-up.
  - Anti-spam: a honeypot field and rate limiting.
  - Progress is saved in sessionStorage, so a dropped connection on mobile data doesn't lose the form.

### `/about`
**Job:** Build trust. This is the only page that tells the company story.
**H1:** About Maya E.A. Limited
- **Story:** 2009 Kenya, 2016 Uganda, 2024 Rwanda (from the About copy).
- **Milestones timeline**, **in the correct order**: 2009, 2015, 2016, 2018, 2020, 2024.
- **Mission and vision**, from the About section, as the brief requires. **[CONFIRM: wording, since Home and About differ]**
- **Values**, the About set of 7. **[CONFIRM: the About set vs the Home set]**
- **Certifications:** the marks plus their scope (which country each covers).
- **Supplier partners:** a logo strip. **[CONFIRM: permission to show the logos]**
- **Who we supply:** commercial bakeries, cafés, food manufacturers, wholesalers, supermarket chains. Names only; no client logos.
- **JSON-LD:** Organization.

### `/locations` and `/locations/[country]`
**Job:** Local trust and local search ("bakery ingredients Kampala").
- **Hub page:** the interactive map plus 3 country cards.
- **Country pages:**
  - H1 "{Country}: {entity}", then address, phones, WhatsApp click-to-chat (pre-filled message), email and shop link.
  - A static map image that links to Google Maps directions, with no embedded map script, to keep the page light.
  - The certifications that apply to that country.
- **JSON-LD:** a `LocalBusiness` node per country, linked to the Organization with `parentOrganization`.
- Uganda WhatsApp: **[CONFIRM: which number takes WhatsApp]**

### `/contact`
**Job:** Fast human contact.
**H1:** Contact us
- Three office cards, each with phone, WhatsApp and email.
- A general message form: name, email, country, message (1000 characters, the same as today). Country routing works as on /wholesale.
- A prominent link: "Ordering in bulk? Request wholesale pricing →".

### `/team`, `/press`, `/careers`
- **Team:** the names and titles from the current site. **[CONFIRM: photos, optional]**
- **Press:** the New Times Rwanda article (12 Feb 2026), linking out. The "More media updates will be added here" line is removed.
- **Careers:** the current copy and the CV email. **[CONFIRM: any open roles]**

### `/privacy`
Required because the forms collect names, phone numbers and emails from residents of Kenya (Data Protection Act 2019), Uganda (Data Protection and Privacy Act 2019) and Rwanda (Law 058/2021). **[CONFIRM: Maya's privacy text, or approve our draft for legal review]**

## 5. Where each brief feature lives

| Feature | Primary page | Also on |
|---|---|---|
| 3D hero pack line-up | `/` | — |
| Packaging system | `/packaging` | — |
| 3D pack viewer (rotate, zoom, size and format) | product pages | `/packaging` |
| Before / after slider | product pages | `/`, `/packaging` |
| Shelf view | `/packaging` | `/` (teaser strip) |
| Product finder | `/tools/product-finder` | `/` (inline) |
| Improver calculator | `/tools/improver-calculator` | `/products/bread-improvers`, 3 improver product pages |
| Product explorer (filter, search, flip cards) | `/products` | — |
| Regional map | `/locations` | `/` |
| Warehouse to oven scroll story | `/` | — |
| Certification strip and counters | `/` | `/about` |
| WhatsApp click-to-chat per country | sticky mobile bar | `/contact`, `/locations/*`, product pages, finder result |
| Multi-step wholesale form | `/wholesale` | — |

## 6. Main journeys

1. **Bakery owner on mobile, from Google:** "/products/bread-improvers" → Volume Plus page → calculator → **Buy on Bakeshed** or **WhatsApp**.
2. **Procurement at a manufacturer:** Home → Products explorer → category → **Request wholesale pricing** (4 steps) → country inbox.
3. **Baker scanning the QR code on a future pack:** product page (the baker guide is visible on the first screen).
4. **Maya's board in the pitch meeting:** Home hero → /packaging (problem → system → shelf → before/after → 3D) → a product page to show the QR target.

## 7. SEO map

| Item | Implementation |
|---|---|
| Titles and descriptions | `content/site.ts`; unique per route, checked by `npm run check:meta` |
| Open Graph images | `opengraph-image.tsx` per route group (category colour, name, logo). Concept routes include the concept tag in the image. |
| JSON-LD | **Organization** (in the root layout; 3 `location`s, `sameAs` socials, logo) · **LocalBusiness** ×3 · **Product** ×47 (no offers) · **BreadcrumbList** on every non-home page · **ItemList** on explorer and category pages |
| sitemap.xml | Generated from `allRoutes` |
| robots.txt | `Disallow: /` until `NEXT_PUBLIC_ALLOW_INDEXING=true`, then `Allow: /` plus the sitemap URL |
| Canonical URLs | Every page, built from `NEXT_PUBLIC_SITE_URL` |
| Headings | Exactly one H1 per page (the current home page has none) |

## 8. Decisions for you

1. **The scroll story goes on Home**, as section 5. It's the most "presentation" moment, but it adds weight. The alternative is to put it on /about and keep only a teaser on Home. *I recommend Home, because GSAP loads only when the section scrolls into view.*
2. **Product pages exist only for the 47 concept-pack products.** The other 74 shop products are explorer cards that link to Bakeshed. That avoids 74 thin pages Maya would have to maintain.
3. **"Packaging proposal" is in the main nav** for the pitch. Before go-live it would come out of the nav, or be renamed if Maya adopts the packaging.
4. **Proposal builds are noindex** (principle 5).

**Next stage:** the home page with the 3D hero.
