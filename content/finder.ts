import type { CategorySlug } from "./types";

/**
 * Product Finder rules. Each mapping is traceable to a category description on
 * mayaealtd.com/products (quoted in `why`). No new product claims are made here.
 */
export const bakeOptions = [
  {
    id: "bread",
    label: "Bread & buns",
    categories: ["bread-improvers", "bread-premixes", "seeds", "preservatives", "baking-papers"],
    why: "Improvers for volume, softness and shelf life; premixes for baguettes and specialty breads; seeds for multigrain breads.",
  },
  {
    id: "cakes",
    label: "Cakes, sponges & muffins",
    categories: ["cake-premixes", "general-class", "liquid-flavours", "fruits", "baking-papers"],
    why: "Sponge, muffin and celebration-cake premixes; cocoa, fats and sugar; flavours; fruit inclusions; cake cases.",
  },
  {
    id: "decorated",
    label: "Decorated & celebration cakes",
    categories: ["piping-gels", "chocolates", "vermicelli", "cake-bases", "cake-boxes", "general-class"],
    why: "Piping gels, compound chocolates and vermicelli for finishing; cake bases and boxes for presentation and transport.",
  },
  {
    id: "doughnuts",
    label: "Doughnuts & pastries",
    categories: ["vermicelli", "chocolates", "general-class", "fruits", "baking-papers"],
    why: "Vermicelli toppings for doughnuts; chocolate for coating and filling; core fats and sugars; fruit for buns.",
  },
  {
    id: "manufacturing",
    label: "Other food production",
    categories: ["preservatives", "general-class", "liquid-flavours", "seeds", "chocolates"],
    why: "Shelf-life support ingredients, everyday production ingredients, flavours, seeds and compound chocolate.",
  },
] as const satisfies readonly { id: string; label: string; categories: CategorySlug[]; why: string }[];

export const scaleOptions = [
  { id: "small", label: "Small batch or home bakery", wholesale: false },
  { id: "commercial", label: "Commercial bakery or café", wholesale: true },
  { id: "manufacturer", label: "Food manufacturer", wholesale: true },
  { id: "trade", label: "Wholesaler or supermarket", wholesale: true },
] as const;

export const countryOptions = [
  { id: "KE", label: "Kenya" },
  { id: "UG", label: "Uganda" },
  { id: "RW", label: "Rwanda" },
  { id: "OTHER", label: "Somewhere else" },
] as const;

export type BakeId = (typeof bakeOptions)[number]["id"];
export type ScaleId = (typeof scaleOptions)[number]["id"];
export type CountryId = (typeof countryOptions)[number]["id"];
