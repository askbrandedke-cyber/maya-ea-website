import { confirm } from "./confirm";
import type { CategorySlug, PackFormat, PackSize, Product } from "./types";

/**
 * Products that receive a BRANDED concept pack.
 *
 * Rule (AUDIT.md §5.2): concept packs are made only for Maya's own label, meaning
 * products sold under the Bakeshed name on bakeshed.rw. In categories with no
 * Bakeshed-named product, one unbranded shop product stands in. Those are marked
 * `ownLabel: "confirm"` until Maya confirms they are own-label.
 * Partner brands (Niacet Pro Bake, Dairyland, Bakeland, Magest, Bakerdream, …) never get concept packs.
 *
 * Pack sizes: `shopText` is the pack line from bakeshed.rw (16 Nov 2026).
 * No prices are stored here; the site links to `shopUrl`.
 */

const UP = "https://bakeshed.rw/wp-content/uploads/";
const P = (s: string) => `https://bakeshed.rw/product/${s}/`;

/** Dosage supplied in the client brief: 0.5–1% of total flour weight. */
const IMPROVER_DOSAGE = {
  minPercent: 0.5,
  maxPercent: 1,
  source: "Client brief (from mayaealtd.com, 9 Nov 2026)",
};

const size = (label: string, shopText: string, format: PackFormat, carton?: string): PackSize => ({
  label,
  shopText,
  format,
  carton,
});

/* ----------------------------- Bread improvers ---------------------------- */

const improvers: Product[] = [
  {
    slug: "volume-plus",
    category: "bread-improvers",
    name: "Volume Plus",
    descriptor: "Bread improver",
    shopName: "Bakeshed Bread Improver 10KG (Volume Plus)",
    shopUrl: P("bakeshed-bread-improver-10kg-volume-plus"),
    ownLabel: "own-label",
    packClaims: ["Tolerance", "Volume", "Texture"],
    packSizes: [size("10 kg", "1×10 Kgs", "box")],
    dosage: IMPROVER_DOSAGE,
    usage: "Add directly to flour and mix.",
    storage: "Store in a cool dry place.",
    ingredients: "Soya flour carrier, INS 170 (i) and ascorbic acid as antioxidant.",
    allergens: "Contains soya.",
    madeIn: "Made in Uganda",
    currentPhoto: `${UP}2026/03/BAKESHED20BREAD20IMPROVER2010KG20VOLUME20PLUS-scaled.jpg`,
    featured: true,
  },
  {
    slug: "mega-plus",
    category: "bread-improvers",
    name: "Mega Plus",
    descriptor: "Bread improver",
    shopName: "Bakeshed Bread Improver 20KG (Mega Plus)",
    shopUrl: P("bakeshed-bread-improver-20kg-mega-plus"),
    ownLabel: "own-label",
    packSizes: [size("20 kg", "1×20 Kgs", "sack")],
    dosage: IMPROVER_DOSAGE,
    currentPhoto: `${UP}2026/03/BAKESHED20BREAD20IMPROVER2010KG20VOLUME20PLUS-scaled.jpg`,
    photoNote: "bakeshed.rw shows the Volume Plus photo for Mega Plus. " + confirm("real Mega Plus pack photo"),
    featured: true,
  },
  {
    slug: "excess",
    category: "bread-improvers",
    name: "Excess",
    descriptor: "Bread improver",
    shopName: "Bakeshed Excess Bread Improver",
    shopUrl: P("bakeshed-excess-bread-improver"),
    ownLabel: "own-label",
    packSizes: [size("4.5 kg", "1×4.5 Kgs", "box")],
    dosage: IMPROVER_DOSAGE,
    currentPhoto: `${UP}2026/03/BAKESHED20EXCESS20BREAD20IMRPOVER-scaled.jpg`,
    featured: true,
  },
  {
    slug: "easy-mix",
    category: "bread-improvers",
    name: "Easy Mix",
    descriptor: "Complete bread improver mix",
    shopName: "Bakeshed Easy Mix Bread Improver",
    shopUrl: P("bakeshed-easy-mix-bread-improver"),
    ownLabel: "own-label",
    packSizes: [size("25 kg", "1×25 Kgs", "sack")],
    storage: "Store in a cool dry place.",
    currentPhoto: `${UP}2026/03/BAKESHED20EASY20MIX20BREAD20IMPROVER-scaled.jpg`,
  },
  {
    slug: "bread-softener",
    category: "bread-improvers",
    name: "Bread Softener",
    descriptor: "Bread improver",
    shopName: "Bakeshed Bread Softner",
    shopUrl: P("bakeshed-bread-softner"),
    ownLabel: "own-label",
    packSizes: [size("10 kg", "1×10 Kgs", "box")],
    currentPhoto: `${UP}2026/03/BAKESHED20BREAD20SOFTNER-scaled.jpg`,
  },
  {
    slug: "natural-sugar-deduction",
    category: "bread-improvers",
    name: "Natural Sugar Deduction",
    descriptor: "Bread improver",
    shopName: "Bakeshed Natural Sugar Deduction Improver",
    shopUrl: P("bakeshed-natural-sugar-deduction-improver"),
    ownLabel: "own-label",
    packSizes: [size("10 kg", "1×10 Kgs", "sack")],
    currentPhoto: `${UP}2026/03/BAKESHED20NATURAL20SUGAR20DEDUCTION20IMPROVER-1-scaled.jpg`,
  },
];

/* ------------------------------ Cake premixes ----------------------------- */

const cakeFlavours: [string, string][] = [
  ["tangerine", "Tangerine"],
  ["coconut", "Coconut"],
  ["passion", "Passion"],
  ["pistachio", "Pistachio"],
  ["oreo", "Oreo"],
  ["lemon", "Lemon"],
  ["strawberry", "Strawberry"],
];

const sponge1kg: Product[] = cakeFlavours.flatMap(([slug, name]) =>
  (["sponge", "muffin"] as const).map((kind) => {
    const shopSlug = `bakeshed-${slug}-${kind}-1kg-x-10`;
    const K = kind === "sponge" ? "SPONGE" : "MUFFIN";
    const file = `BAKESHED20${name.toUpperCase()}20${K}120KGC39710${slug === "tangerine" && kind === "sponge" ? "-1" : ""}-scaled.jpg`;
    return {
      slug: `${slug}-${kind}`,
      category: "cake-premixes" as CategorySlug,
      name: `${name} ${kind === "sponge" ? "Sponge" : "Muffin"}`,
      descriptor: "Cake premix",
      shopName: `Bakeshed ${name} ${kind === "sponge" ? "Sponge" : "Muffin"} (1KG x 10)`,
      shopUrl: P(shopSlug),
      ownLabel: "own-label" as const,
      packSizes: [
        size("1 kg", "1×10 Kgs", "pouch", "1 kg × 10"),
        size("10 kg", "1×10 Kgs", "box", "1 kg × 10"),
      ],
      currentPhoto: `${UP}2026/03/${file}`,
    };
  }),
);

const cakeOther: Product[] = [
  {
    slug: "blondy-vanilla-sponge",
    category: "cake-premixes",
    name: "Blondy Vanilla Sponge",
    descriptor: "Cake premix",
    shopName: "Bakeshed Blondy Vanilla Sponge Cake Premixe (500G x 20)",
    shopUrl: P("bakeshed-blondy-vanilla-sponge-cake-premixe-500g-x-20"),
    ownLabel: "own-label",
    packSizes: [
      size("500 g", "1×10 Kgs", "pouch", "500 g × 20"),
      size("10 kg", "1×10 Kgs", "box", "500 g × 20"),
    ],
    currentPhoto: `${UP}2026/03/BAKESHED20BLONDY20VANILLA20SPONGE20CAKE20PREMIXE500GC39720-scaled.jpg`,
    featured: true,
  },
  {
    slug: "blondy-white-forest",
    category: "cake-premixes",
    name: "Blondy White Forest",
    descriptor: "Cake premix",
    shopName: "Bakeshed Blondy (White Forest) Cake Premixe",
    shopUrl: P("bakeshed-blondy-white-forest-cake-premixe"),
    ownLabel: "own-label",
    packSizes: [size("10 kg", "1×10 Kgs", "box")],
    currentPhoto: `${UP}2026/03/Bakeshed-Blondy-White-Forest-scaled.jpg`,
  },
  {
    slug: "browny-black-forest",
    category: "cake-premixes",
    name: "Browny Black Forest",
    descriptor: "Cake premix",
    shopName: "Bakeshed Browny (Black Forest) Cake Premixe",
    shopUrl: P("bakeshed-browny-black-forest-cake-premixe"),
    ownLabel: "own-label",
    packSizes: [size("10 kg", "1×10 Kgs", "box")],
    currentPhoto: `${UP}2026/03/BAKESHED20BROWNY20BLACK20FOREST20CAKE20PREMIXE-scaled.jpg`,
  },
  {
    slug: "red-velvet",
    category: "cake-premixes",
    name: "Red Velvet",
    descriptor: "Cake premix",
    shopName: "Bakeshed Red Velvet Cake Premixe (500G x 20)",
    shopUrl: P("bakeshed-red-velvet-cake-premixe-500g-x-20"),
    ownLabel: "own-label",
    packSizes: [
      size("500 g", "1×10 Kgs", "pouch", "500 g × 20"),
      size("10 kg", "1×10 Kgs", "box"),
    ],
    currentPhoto: `${UP}2026/03/BAKESHED20RED20VELVET20CAKE20PREMIXE2020500GC39720-scaled.jpg`,
    featured: true,
  },
  {
    slug: "purple-velvet",
    category: "cake-premixes",
    name: "Purple Velvet",
    descriptor: "Cake premix",
    shopName: "Bakeshed Purple Velvet Cake Premixe",
    shopUrl: P("bakeshed-purple-velvet-cake-premixe"),
    ownLabel: "own-label",
    packSizes: [size("10 kg", "1×10 Kgs", "box")],
    currentPhoto: `${UP}2026/03/BAKESHED20PURPLE20VELVET20CAKE20PREMIXE-scaled.jpg`,
  },
  {
    slug: "fudge-cake",
    category: "cake-premixes",
    name: "Fudge Cake",
    descriptor: "Cake premix",
    shopName: "Bakeshed Fudge Cake Premixe",
    shopUrl: P("bakeshed-fudge-cake-premixe"),
    ownLabel: "own-label",
    packSizes: [size("10 kg", "1×10 Kgs", "box")],
    currentPhoto: `${UP}2026/03/BAKESHED20FUDGE20CAKE20PREMIXE-scaled.jpg`,
  },
  {
    slug: "butter-cake",
    category: "cake-premixes",
    name: "Butter Cake",
    descriptor: "Cake premix",
    shopName: "Bakeshed Butter Cake Premixe",
    shopUrl: P("bakeshed-butter-cake-premixe"),
    ownLabel: "own-label",
    packSizes: [size("10 kg", "1×10 Kgs", "box")],
    currentPhoto: `${UP}2026/03/BAKESHED20BUTTER20CAKE20PREMIXE-scaled.jpg`,
  },
  {
    slug: "oil-muffin-vanilla",
    category: "cake-premixes",
    name: "Oil Muffin Vanilla",
    descriptor: "Cake premix",
    shopName: "Bakeshed Oil Muffin Vanilla Cake Premixe (500G x 20)",
    shopUrl: P("bakeshed-oil-muffin-vanilla-cake-premixe-500g-x-20"),
    ownLabel: "own-label",
    packSizes: [
      size("500 g", "1×10 Kgs", "pouch", "500 g × 20"),
      size("10 kg", "1×10 Kgs", "box"),
    ],
    currentPhoto: `${UP}2026/03/WhatsApp-Image-2026-07-03-at-8.07.41-AM.jpeg`,
    photoNote: "Shop photo is a WhatsApp image. " + confirm("studio pack photo"),
  },
  {
    slug: "oil-muffin-chocolate",
    category: "cake-premixes",
    name: "Oil Muffin Chocolate",
    descriptor: "Cake premix",
    shopName: "Bakeshed Oil Muffin Chocolate Cake Premixe",
    shopUrl: P("bakeshed-oil-muffin-chocolate-cake-premixe"),
    ownLabel: "own-label",
    packSizes: [size("10 kg", "1×10 Kgs", "box")],
    currentPhoto: `${UP}2026/03/BAKESHED20OIL20MUFFIN20CHOCOLATE20CAKE20PREMIXE-scaled.jpg`,
  },
  {
    slug: "whipping-cream-whip-s",
    category: "cake-premixes",
    name: "Whip S",
    descriptor: "Whipping cream",
    shopName: "Bakeshed Whipping Cream (Whip S) (500G x 20)",
    shopUrl: P("bakeshed-whipping-cream-whip-s-500g-x-20"),
    ownLabel: "own-label",
    packSizes: [
      size("500 g", "1×10 Kgs", "pouch", "500 g × 20"),
      size("10 kg", "1×10 Kgs", "box"),
    ],
    currentPhoto: `${UP}2026/03/BAKESHED20WHIPPING20CREAM20WHIP20S2020500GC39720-scaled.jpg`,
  },
];

/* ----------------------------- Other own-label ---------------------------- */

const otherOwn: Product[] = [
  {
    slug: "caramel",
    category: "general-class",
    name: "Caramel",
    descriptor: "Bakery caramel",
    shopName: "Bakeshed Caramel",
    shopUrl: P("bakeshed-caramel"),
    ownLabel: "own-label",
    packSizes: [size("30 kg", "1×30 Kgs", "tub")],
    currentPhoto: `${UP}2026/03/BAKESHED20CARAMEL-scaled.jpg`,
  },
  {
    slug: "premium-master-fat",
    category: "general-class",
    name: "Premium Master Fat",
    descriptor: "Bakery fat",
    shopName: "Bakeshed Premium Master Fat",
    shopUrl: P("bakeshed-premium-master-fat"),
    ownLabel: "own-label",
    packSizes: [size("10 kg", "1×10 Kgs", "box")],
    currentPhoto: `${UP}2026/03/BAKESHED20PREMIUM20MASTER20FAT-scaled.jpg`,
  },
  {
    slug: "icing-sugar",
    category: "general-class",
    name: "Icing Sugar",
    descriptor: "Bakery sugar",
    shopName: "Bakeshed Icing Sugar 18Kg / (1KG x 15PCS)",
    shopUrl: P("bakeshed-icing-sugar-18kg"),
    ownLabel: "own-label",
    packSizes: [
      size("1 kg", "1×15 Kgs", "pouch", "1 kg × 15"),
      size("18 kg", "1×18 Kgs", "sack"),
    ],
    currentPhoto: `${UP}2026/03/BAKESHED20ICING20SUGAR-scaled.jpg`,
    featured: true,
  },
  {
    slug: "colour-vermicelli",
    category: "vermicelli",
    name: "Colour Vermicelli",
    descriptor: "Decoration topping",
    shopName: "Bakeshed Colour Vermicelli",
    shopUrl: P("bakeshed-colour-vermicelli"),
    ownLabel: "own-label",
    packSizes: [size("10 kg", "1×10 Kgs", "sack")],
    currentPhoto: `${UP}2026/03/BAKESHED20COLOUR20VERMICELLI-scaled.png`,
    featured: true,
  },
  {
    slug: "dark-vermicelli",
    category: "vermicelli",
    name: "Dark Vermicelli",
    descriptor: "Decoration topping",
    shopName: "Bakeshed Dark Vermicelli",
    shopUrl: P("bakeshed-dark-vermicelli"),
    ownLabel: "own-label",
    packSizes: [size("10 kg", "1×10 Kgs", "sack")],
    currentPhoto: `${UP}2026/03/BAKESHED20DARK20VERMICELLI-scaled.png`,
  },
  ...(["Vanilla", "Lemon", "Coconut"] as const).map(
    (f): Product => ({
      slug: `${f.toLowerCase()}-flavour`,
      category: "liquid-flavours",
      name: `${f} Flavour`,
      descriptor: "Liquid flavour",
      shopName: `Bakeshed ${f} Liquid Flavour`,
      shopUrl: P(`bakeshed-${f.toLowerCase()}-liquid-flavour`),
      ownLabel: "own-label",
      packSizes: [size("4.5 L", "1×4.5 Ltr", "bottle")],
      currentPhoto: `${UP}2026/03/BAKESHED20${f.toUpperCase()}20LIQUID20FLAVOUR-scaled.jpg`,
      featured: f === "Coconut",
    }),
  ),
];

/* -------- Stand-ins for categories with no Bakeshed-named product -------- */

const standIns: Product[] = [
  {
    slug: "baguette",
    category: "bread-premixes",
    name: "Baguette",
    descriptor: "Bread premix",
    shopName: "Baguette",
    shopUrl: P("baguette"),
    ownLabel: "confirm",
    packSizes: [size("10 kg", "1×10 Kgs", "sack")],
    currentPhoto: `${UP}2026/03/BAGUETTE-scaled.jpg`,
    featured: true,
  },
  {
    slug: "simsim-seeds",
    category: "seeds",
    name: "Simsim Seeds",
    descriptor: "Sesame seeds",
    shopName: "Simsim Seeds",
    shopUrl: P("simsim-seeds"),
    ownLabel: "confirm",
    packSizes: [size("25 kg", "1×25 Kgs", "sack")],
    currentPhoto: `${UP}2026/03/SIMSIM20SEEDS-scaled.jpg`,
    featured: true,
  },
  {
    slug: "potassium-sorbate",
    category: "preservatives",
    name: "Potassium Sorbate",
    descriptor: "Preservative",
    shopName: "Potassium Sorbate (800G x 12)",
    shopUrl: P("potassium-sorbate-800g-x-12"),
    ownLabel: "confirm",
    packSizes: [size("800 g", "800G x 12", "pouch", "800 g × 12")],
    currentPhoto: `${UP}2026/03/POTASSIUM20SORBATE2020800GC39712-scaled.jpg`,
    featured: true,
  },
  {
    slug: "dark-compound-chips",
    category: "chocolates",
    name: "Dark Compound Chips",
    descriptor: "Compound chocolate",
    shopName: "Dark Compound Chips",
    shopUrl: P("dark-compound-chips"),
    ownLabel: "confirm",
    packSizes: [size("4.5 kg", "1×4.5 Kgs", "box")],
    currentPhoto: `${UP}2026/03/DARK20COMPOUND20CHIPS-scaled.jpg`,
    featured: true,
  },
  {
    slug: "red-cherries",
    category: "fruits",
    name: "Red Cherries",
    descriptor: "Bakery fruit",
    shopName: "Red Cherries 5Kg",
    shopUrl: P("red-cherries-5kg"),
    ownLabel: "confirm",
    packSizes: [size("5 kg", "1×5 Kgs", "tub")],
    currentPhoto: `${UP}2026/03/RED20CHERRIES-scaled.jpg`,
    featured: true,
  },
  {
    slug: "piping-gel",
    category: "piping-gels",
    name: "Piping Gel",
    descriptor: "Decoration gel",
    shopName: "Piping Gel White",
    shopUrl: P("piping-gel-white"),
    ownLabel: "confirm",
    packSizes: [size("5 kg", "1×5 Kgs", "tub")],
    currentPhoto: `${UP}2026/03/PIPING20GEL-scaled.jpg`,
    photoNote:
      "Current photo shows a Bakeland (partner) pack. Concept shown only to demonstrate the category colour. " +
      confirm("whether Maya sells an own-label piping gel"),
    featured: true,
  },
  {
    slug: "greaseproof-paper",
    category: "baking-papers",
    name: "Greaseproof Paper",
    descriptor: "Baking paper",
    shopName: "Grease Proof Paper",
    shopUrl: P("grease-proof-paper"),
    ownLabel: "confirm",
    packSizes: [size("500 sheets", "1×500 Pcs", "box")],
    currentPhoto: `${UP}2026/03/GREASE20PROOF20PAPER-scaled.jpg`,
    featured: true,
  },
  {
    slug: "round-cake-base",
    category: "cake-bases",
    name: "Round Cake Base",
    descriptor: "Cake board",
    shopName: "Round Cakebase 10″",
    shopUrl: P("round-cakebase-10"),
    ownLabel: "confirm",
    packSizes: ["8″", "10″", "12″", "14″"].map((s) => size(s, "1 PC", "sleeve")),
    currentPhoto: `${UP}2026/03/ROUND20CAKEBASE2082C122C14_-scaled.jpg`,
    featured: true,
  },
  {
    slug: "cake-box",
    category: "cake-boxes",
    name: "Cake Box",
    descriptor: "Cake packaging",
    shopName: "Cake Box 10″",
    shopUrl: P("cake-box-10"),
    ownLabel: "confirm",
    packSizes: ["5″", "8″", "10″", "12″", "14″", "17″"].map((s) => size(s, "1 PC", "sleeve")),
    currentPhoto: `${UP}2026/03/CAKE20BOX2052C102C122C142C17-scaled.jpg`,
    featured: true,
  },
];

export const products: Product[] = [...improvers, ...sponge1kg, ...cakeOther, ...otherOwn, ...standIns];

export const productBySlug = Object.fromEntries(products.map((p) => [p.slug, p])) as Record<string, Product>;

export const productsIn = (c: CategorySlug) => products.filter((p) => p.category === c);

/** One representative product per category, for the shelf and hero line-up. */
export const shelfProducts = (): Product[] => {
  const seen = new Set<CategorySlug>();
  return products.filter((p) => p.featured && !seen.has(p.category) && seen.add(p.category));
};

export const productPath = (p: Product) => `/products/${p.category}/${p.slug}`;
