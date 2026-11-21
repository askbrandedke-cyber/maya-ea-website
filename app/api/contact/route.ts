import { contactSchema, fieldErrors } from "@/lib/forms/schema";
import { emailHtml, emailText, inboxFor, label, readGuarded, sendEmail } from "@/lib/forms/server";

/** POST /api/contact — general message, routed by country. */
export async function POST(req: Request) {
  const g = await readGuarded(req);
  if ("response" in g) return g.response;
  const parsed = contactSchema.safeParse(g.data);
  if (!parsed.success) return Response.json({ ok: false, errors: fieldErrors(parsed.error) }, { status: 422 });
  const d = parsed.data;
  const rows: [string, string][] = [
    ["Name", d.name],
    ["Email", d.email],
    ["Country", label(d.country)],
    ["Message", d.message],
  ];
  const subject = `Website message · ${label(d.country)} · ${d.name}`;
  const sent = await sendEmail({ to: inboxFor(d.country), replyTo: d.email, subject, html: emailHtml(subject, rows), text: emailText(subject, rows) });
  if (!sent.ok) return Response.json({ ok: false, error: "We could not send your message. Please try again or contact us on WhatsApp." }, { status: 502 });
  return Response.json({ ok: true, id: sent.id, dryRun: sent.dryRun });
}
