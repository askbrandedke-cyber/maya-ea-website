import { categoryBySlug } from "@/content/categories";
import { productBySlug } from "@/content/products";
import { fieldErrors, wholesaleSchema } from "@/lib/forms/schema";
import { emailHtml, emailText, inboxFor, label, readGuarded, sendEmail } from "@/lib/forms/server";

/** POST /api/wholesale — validates (zod), routes by delivery country, emails via Resend. */
export async function POST(req: Request) {
  const g = await readGuarded(req);
  if ("response" in g) return g.response;

  const parsed = wholesaleSchema.safeParse(g.data);
  if (!parsed.success) return Response.json({ ok: false, errors: fieldErrors(parsed.error) }, { status: 422 });
  const d = parsed.data;
  const product = typeof (g.data as { product?: unknown }).product === "string" ? productBySlug[(g.data as { product: string }).product] : undefined;

  const rows: [string, string][] = [
    ["Business type", d.businessType === "Other" ? `Other: ${d.businessOther}` : d.businessType],
    ["Categories", d.categories.map((c) => categoryBySlug[c as keyof typeof categoryBySlug].name).join(", ")],
    ["Products / notes", d.productsNote],
    ["Came from product page", product ? product.name : ""],
    ["Order frequency", d.frequency],
    ["Quantity per order", d.quantity],
    ["Delivery country", label(d.country, d.countryOther)],
    ["Name", d.name],
    ["Business name", d.company],
    ["Phone", d.phone],
    ["Email", d.email],
    ["Preferred contact", d.preferred],
  ];
  const subject = `Wholesale enquiry · ${label(d.country, d.countryOther)} · ${d.company}`;
  const sent = await sendEmail({
    to: inboxFor(d.country),
    replyTo: d.email,
    subject,
    html: emailHtml(subject, rows),
    text: emailText(subject, rows),
  });
  if (!sent.ok) return Response.json({ ok: false, error: "We could not send your enquiry. Please try again or contact us on WhatsApp." }, { status: 502 });
  return Response.json({ ok: true, id: sent.id, dryRun: sent.dryRun });
}
