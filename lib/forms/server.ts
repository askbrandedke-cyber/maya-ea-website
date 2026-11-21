import "server-only";
import { countryLabel, type countries } from "./schema";

/**
 * Server helpers for /api/wholesale and /api/contact.
 * Keys live in .env.local (see .env.example and CONTENT-GUIDE.md). With no RESEND_API_KEY
 * the routes run in DRY-RUN mode: enquiries are validated and logged, nothing is sent.
 */

type Country = (typeof countries)[number];

/** Inbox per country. Unset → falls back to ENQUIRY_TO_DEFAULT. */
export function inboxFor(country: Country): string | undefined {
  const env = process.env;
  const per: Record<Country, string | undefined> = {
    KE: env.ENQUIRY_TO_KE,
    UG: env.ENQUIRY_TO_UG,
    RW: env.ENQUIRY_TO_RW,
    OTHER: undefined,
  };
  return per[country] || env.ENQUIRY_TO_DEFAULT || undefined;
}

/* ----------------------------- rate limiting ----------------------------- */
// In-memory sliding window per IP. Good enough for one region / low volume.
// On Vercel each instance has its own memory; for strict limits use Upstash (see CONTENT-GUIDE.md).
const hits = new Map<string, number[]>();
export function rateLimited(ip: string, limit = 5, windowMs = 10 * 60_000) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < windowMs);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > limit;
}

export function clientIp(req: Request) {
  return req.headers.get("x-forwarded-for")?.split(",")[0].trim() || req.headers.get("x-real-ip") || "unknown";
}

/* --------------------------------- email --------------------------------- */
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export function emailHtml(title: string, rows: [string, string][]) {
  return `<!doctype html><html><body style="font-family:Arial,sans-serif;color:#0D2036">
<h2 style="margin:0 0 12px">${esc(title)}</h2>
<table cellpadding="6" style="border-collapse:collapse">${rows
    .map(([k, v]) => `<tr><td style="font-weight:bold;vertical-align:top;border-bottom:1px solid #eee">${esc(k)}</td><td style="border-bottom:1px solid #eee;white-space:pre-wrap">${esc(v || "—")}</td></tr>`)
    .join("")}</table>
<p style="color:#666;font-size:12px">Sent from the website enquiry form.</p></body></html>`;
}

export const emailText = (title: string, rows: [string, string][]) => `${title}\n\n${rows.map(([k, v]) => `${k}: ${v || "—"}`).join("\n")}\n`;

export type SendResult = { ok: true; id: string; dryRun: boolean } | { ok: false; error: string };

export async function sendEmail(opts: { to: string | undefined; replyTo: string; subject: string; html: string; text: string }): Promise<SendResult> {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.ENQUIRY_FROM;
  if (!key || !from || !opts.to) {
    console.info(`[enquiry:dry-run] to=${opts.to ?? "(no inbox set)"} subject="${opts.subject}"\n${opts.text}`);
    return { ok: true, id: `dry-run-${Date.now()}`, dryRun: true };
  }
  const base = process.env.RESEND_API_URL || "https://api.resend.com";
  try {
    const r = await fetch(`${base}/emails`, {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to: opts.to.split(",").map((s) => s.trim()), reply_to: opts.replyTo, subject: opts.subject, html: opts.html, text: opts.text }),
      signal: AbortSignal.timeout(10_000),
    });
    const body = (await r.json().catch(() => ({}))) as { id?: string; message?: string };
    if (!r.ok) {
      console.error("[enquiry] email provider error", r.status, body.message);
      return { ok: false, error: "provider" };
    }
    return { ok: true, id: body.id ?? "sent", dryRun: false };
  } catch (e) {
    console.error("[enquiry] email send failed", e);
    return { ok: false, error: "network" };
  }
}

export const label = (c: Country, other?: string) => (c === "OTHER" ? `Other: ${other ?? ""}` : countryLabel[c]);

const MAX_BODY = 20_000;

/** Read the request body as text, giving up (null) once it exceeds `max` bytes. */
async function readLimited(req: Request, max: number): Promise<string | null> {
  if (!req.body) return "";
  const reader = req.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > max) {
      await reader.cancel();
      return null;
    }
    chunks.push(value);
  }
  const all = new Uint8Array(size);
  let off = 0;
  for (const c of chunks) {
    all.set(c, off);
    off += c.byteLength;
  }
  return new TextDecoder().decode(all);
}

/** Shared guard: method/size/content-type, honeypot, too-fast submits, rate limit. */
export async function readGuarded(req: Request): Promise<{ data: unknown } | { response: Response }> {
  const json = (status: number, body: object) => ({ response: Response.json(body, { status }) });
  if (!req.headers.get("content-type")?.includes("application/json")) return json(415, { ok: false, error: "Send JSON." });
  const len = Number(req.headers.get("content-length") ?? 0);
  if (len > MAX_BODY) return json(413, { ok: false, error: "Too large." });
  if (rateLimited(clientIp(req))) return json(429, { ok: false, error: "Too many enquiries from this connection. Please try again later or use WhatsApp." });
  // Enforce the size limit on the bytes actually received (Content-Length can be absent or wrong),
  // so oversized input never reaches JSON parsing or zod validation.
  const raw = await readLimited(req, MAX_BODY);
  if (raw === null) return json(413, { ok: false, error: "Too large." });
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return json(400, { ok: false, error: "Invalid JSON." });
  }
  const d = data as { website?: string; elapsedMs?: number };
  // Honeypot filled or submitted in under 3 s: answer "ok" so bots learn nothing, but send nothing.
  if ((d?.website ?? "") !== "" || (typeof d?.elapsedMs === "number" && d.elapsedMs < 3000)) {
    console.info("[enquiry] dropped as spam");
    return json(200, { ok: true, id: "received" });
  }
  return { data };
}
