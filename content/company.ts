import { confirm } from "./confirm";

/** Verbatim (or lightly trimmed) from mayaealtd.com About / Team / Press / Careers, captured 16 Nov 2026. */

export const story = [
  "Maya East Africa Limited was established in Kenya in 2009 to improve access to bakery ingredients and food-production inputs for commercial customers. What began with a narrower baking-input focus has grown into a wider regional supply operation.",
  "The business expanded to Uganda in 2016 as Best Ingredients Africa Limited and later to Rwanda in 2024, strengthening its ability to serve customers across East Africa with local market coverage and closer support.",
  "Today Maya supports bakeries, wholesalers, supermarket chains and food manufacturers with ingredients, premixes, technical support and a clearer route to supply across the region.",
];

/** Sorted by year (the live site lists 2016 before 2015). */
export const milestones = [
  { year: 2009, title: "Company founded", text: "Maya E.A Limited established in Kenya to bridge the gap in access to high-quality bakery ingredients." },
  { year: 2015, title: "Product line growth", text: "Expanded beyond yeast to comprehensive bakery solutions." },
  { year: 2016, title: "Uganda expansion", text: "Expanded to Uganda as Best Ingredients Africa Limited." },
  { year: 2018, title: "Regional partnerships", text: "Established partnerships with international suppliers from Europe, the Middle East and Asia." },
  { year: 2020, title: "Technical support", text: "Enhanced technical support with international baking experts and an in-house team." },
  { year: 2024, title: "Rwanda operations", text: "Opened operations in Rwanda (MAYA E.A Limited) serving Eastern Congo and Burundi." },
];

/** About-page wording, as the brief asks. The home page uses slightly different wording (see PLACEHOLDERS.md). */
export const mission =
  "To supply bakery ingredients and food-production inputs with the consistency, responsiveness and support customers need to run better operations.";
export const vision = "To remain a trusted East African partner for bakery ingredients, premixes and food additives across regional markets.";
export const missionConfirm = confirm("official mission wording: the About page says “responsiveness and support”, the home page says “service and technical support”");

export const values = [
  { name: "Quality", text: "We focus on consistent ingredients and product performance that customers can rely on in daily production." },
  { name: "Innovation", text: "We keep improving our range to match how bakeries and food manufacturers actually work in the region." },
  { name: "Customer focus", text: "We help customers choose products that fit their recipes, production targets and business model." },
  { name: "Integrity", text: "Our work is guided by dependable supply, transparent communication and long-term trust." },
  { name: "Sustainability", text: "We support more efficient production choices and practical ingredient use across our customer base." },
  { name: "Teamwork", text: "We work as one regional team across Kenya, Uganda and Rwanda to support customers better." },
  { name: "Safety", text: "Safety and food-quality requirements remain central to the products we supply and the standards we maintain." },
];
export const valuesConfirm = confirm("which set of values is official: About lists these 7; the home page lists a different 7");

export const expertise = [
  { name: "Bread improvers & yeast", text: "Solutions for volume, softness, fermentation support and more consistent bread output." },
  { name: "Cake premixes", text: "Sponge, muffin and celebration-cake premixes for faster, repeatable production." },
  { name: "Chocolates & toppings", text: "Compound chocolates, decoration items and supporting bakery inclusions." },
  { name: "Flavours & colours", text: "Selected flavour and colour options for cakes, fillings and bakery finishing." },
  { name: "Additives & preservatives", text: "Functional ingredients that help support shelf life, quality and processing needs." },
  { name: "Packaging & consumables", text: "Cake boxes, papers, bases and other practical items used around daily production." },
];

export const customers = ["Commercial bakeries", "Cafés", "Food manufacturers", "Wholesalers", "Supermarket chains"];

/** Supplier partners shown on mayaealtd.com/about. */
export const partners = [
  { name: "Bakeland", country: "Egypt", logo: "/partners/bakeland.webp" },
  { name: "Özgür Tarım", country: "Turkey", logo: "/partners/ozgur-tarim.webp" },
  { name: "Vandemoortele", country: "Belgium", logo: "/partners/vandemoortele.webp" },
  { name: "Goldenpack", country: "Egypt", logo: "/partners/goldenpack.webp" },
  { name: "Niacet", country: "Netherlands", logo: "/partners/niacet.webp" },
  { name: "Angel", country: "Egypt", logo: "/partners/angel-logo.webp" },
  { name: "Maesindo", country: "Indonesia", logo: undefined },
];
export const partnersConfirm = confirm("Maya has permission to show these partner logos (and Angel's country: listed as Egypt)");

export const team = {
  board: [
    { name: "Abdirahman Musa Noor", role: "Board Member" },
    { name: "Ahmed Mohamed Noor", role: "Board Member" },
    { name: "Mohamed Musa Noor", role: "Board Member" },
  ],
  management: [
    { name: "Abdullahi Hassan Mohamed", role: "Country Director" },
    { name: "Tuyisenge Pierre", role: "Sales Manager" },
    { name: "Ingabire Aline", role: "Head Customer Service" },
    { name: "Irakoze Wivine", role: "Testing Lab Manager" },
  ],
  confirm: confirm("team photos (optional) and which country each manager is based in"),
};

export const press = [
  {
    title: "Regional food additives manufacturer Maya East Africa enters Rwandan market",
    outlet: "The New Times (Rwanda)",
    date: "2026-02-12",
    place: "Kigali, Rwanda",
    summary:
      "Coverage of Maya E.A. Limited's expansion into Rwanda and the company's continued regional growth in bakery ingredients and food-production inputs.",
    url: "https://www.newtimes.co.rw/article/25984/news/featured/featured-regional-food-additives-manufacturer-maya-east-africa-enters-rwandan-market",
    image: "/press/new-times-rwanda.webp",
  },
];

export const careers = {
  intro: "Join our team and build a sustainable legacy in the East African food industry.",
  body: "We are currently updating our careers page with new opportunities. Please check back later or send your CV to info@mayaealtd.com for future consideration.",
  email: "info@mayaealtd.com",
  confirm: confirm("current open roles, if any"),
};
