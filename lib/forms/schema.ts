import { z } from "zod";
import { categories } from "@/content/categories";

/** Shared by the browser (step validation) and the API routes (authoritative validation). */

export const businessTypes = ["Commercial bakery", "Café", "Food manufacturer", "Wholesaler", "Supermarket chain", "Other"] as const;
export const frequencies = ["One-off order", "Weekly", "Monthly", "Not sure yet"] as const;
export const countries = ["KE", "UG", "RW", "OTHER"] as const;
export const countryLabel: Record<(typeof countries)[number], string> = { KE: "Kenya", UG: "Uganda", RW: "Rwanda", OTHER: "Other" };
export const contactMethods = ["WhatsApp", "Phone", "Email"] as const;

const categorySlugs = categories.map((c) => c.slug) as [string, ...string[]];
const trimmed = (min: number, max: number, msg: string) => z.string({ required_error: msg, invalid_type_error: msg }).trim().min(min, msg).max(max, `Keep this under ${max} characters.`);
const phone = z
  .string({ required_error: "Enter your phone number." })
  .trim()
  .regex(/^\+?[0-9][0-9 ()-]{6,19}$/, "Enter a phone number with country code, e.g. +254 712 345 678.");

/** Anti-spam fields carried by every form. */
const antiSpam = {
  /** Honeypot: hidden from people; bots fill it. Must stay empty. */
  website: z.string().max(0).optional().default(""),
  /** Milliseconds since the form was shown; set by the client. */
  elapsedMs: z.number().int().nonnegative().optional().default(0),
};

export const wholesaleSteps = {
  business: z
    .object({
      businessType: z.enum(businessTypes, { errorMap: () => ({ message: "Choose your business type." }) }),
      businessOther: z.string().trim().max(80).optional().default(""),
    })
    .refine((d) => d.businessType !== "Other" || d.businessOther.length >= 2, { path: ["businessOther"], message: "Tell us your business type." }),
  products: z.object({
    categories: z.array(z.enum(categorySlugs), { required_error: "Choose at least one product category." }).min(1, "Choose at least one product category.").max(14),
    productsNote: z.string().trim().max(500, "Keep this under 500 characters.").optional().default(""),
  }),
  volume: z
    .object({
      frequency: z.enum(frequencies, { errorMap: () => ({ message: "Choose how often you would order." }) }),
      quantity: z.string().trim().max(120, "Keep this under 120 characters.").optional().default(""),
      country: z.enum(countries, { errorMap: () => ({ message: "Choose the delivery country." }) }),
      countryOther: z.string().trim().max(60).optional().default(""),
    })
    .refine((d) => d.country !== "OTHER" || d.countryOther.length >= 2, { path: ["countryOther"], message: "Tell us the country." }),
  contact: z.object({
    name: trimmed(2, 80, "Enter your name."),
    company: trimmed(2, 120, "Enter your business name."),
    phone,
    email: z.string({ required_error: "Enter your email address." }).trim().email("Enter a valid email address.").max(160),
    preferred: z.enum(contactMethods, { errorMap: () => ({ message: "Choose how we should contact you." }) }),
    consent: z.literal(true, { errorMap: () => ({ message: "Please agree so we can reply to you." }) }),
  }),
};

export const wholesaleSchema = z
  .object({
    ...wholesaleSteps.business.innerType().shape,
    ...wholesaleSteps.products.shape,
    ...wholesaleSteps.volume.innerType().shape,
    ...wholesaleSteps.contact.shape,
    ...antiSpam,
  })
  .superRefine((d, ctx) => {
    if (d.businessType === "Other" && d.businessOther.length < 2) ctx.addIssue({ code: "custom", path: ["businessOther"], message: "Tell us your business type." });
    if (d.country === "OTHER" && d.countryOther.length < 2) ctx.addIssue({ code: "custom", path: ["countryOther"], message: "Tell us the country." });
  });

export const contactSchema = z.object({
  name: trimmed(2, 80, "Enter your name."),
  email: z.string({ required_error: "Enter your email address." }).trim().email("Enter a valid email address.").max(160),
  country: z.enum(countries, { errorMap: () => ({ message: "Choose your country." }) }),
  message: trimmed(10, 1000, "Write at least 10 characters."),
  consent: z.literal(true, { errorMap: () => ({ message: "Please agree so we can reply to you." }) }),
  ...antiSpam,
});

export type WholesaleInput = z.input<typeof wholesaleSchema>;
export type Wholesale = z.output<typeof wholesaleSchema>;
export type Contact = z.output<typeof contactSchema>;

/** Flatten zod issues to { field: message } (first message per field). */
export function fieldErrors(err: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const i of err.issues) {
    const k = i.path.join(".") || "_form";
    out[k] ??= i.message;
  }
  return out;
}
