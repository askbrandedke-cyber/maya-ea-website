"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { contactSchema, countries, countryLabel, fieldErrors } from "@/lib/forms/schema";
import { ChoiceGroup, Honeypot, TextField } from "./fields";

export function ContactForm() {
  const [v, setV] = useState({ name: "", email: "", country: undefined as (typeof countries)[number] | undefined, message: "", consent: false });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "failed">("idle");
  const [msg, setMsg] = useState("");
  const [honey, setHoney] = useState("");
  const shownAt = useRef(Date.now());
  const top = useRef<HTMLDivElement>(null);
  const set = <K extends keyof typeof v>(k: K, val: (typeof v)[K]) => (setV((p) => ({ ...p, [k]: val })), setErrors((e) => ({ ...e, [k]: "" })));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const r = contactSchema.safeParse(v);
    if (!r.success) {
      setErrors(fieldErrors(r.error));
      requestAnimationFrame(() => top.current?.focus());
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...v, website: honey, elapsedMs: Date.now() - shownAt.current }),
      });
      const body = await res.json().catch(() => ({}));
      if (res.ok && body.ok) return setStatus("done");
      if (body.errors) setErrors(body.errors);
      setMsg(body.error ?? "Please check the form.");
      setStatus("failed");
    } catch {
      setMsg("No connection. Please try again, or call or WhatsApp us using the numbers on this page.");
      setStatus("failed");
    }
  };

  if (status === "done")
    return (
      <div ref={top} tabIndex={-1} role="status" className="rounded-3xl bg-white p-8 ring-1 ring-line outline-none">
        <h2 className="text-2xl font-bold">Message sent</h2>
        <p className="mt-2 text-ink/80">Thank you. The {v.country && v.country !== "OTHER" ? `${countryLabel[v.country]} ` : ""}team will reply by email.</p>
      </div>
    );

  const errList = Object.values(errors).filter(Boolean);
  return (
    <form noValidate onSubmit={submit} className="relative grid gap-5 rounded-3xl bg-white p-6 ring-1 ring-line md:p-8">
      <Honeypot value={honey} onChange={setHoney} />
      <h2 className="text-2xl font-bold">Send us a message</h2>
      <div ref={top} tabIndex={-1} className="outline-none" role={errList.length || status === "failed" ? "alert" : undefined}>
        {(errList.length > 0 || status === "failed") && (
          <div className="rounded-2xl border-[1.5px] border-placeholder bg-[#FFF5F5] p-4 text-sm text-placeholder">
            <p className="font-bold">{status === "failed" ? msg : "Please check the form:"}</p>
            {errList.length > 0 && (
              <ul className="mt-1 list-disc pl-5">
                {errList.map((m) => (
                  <li key={m}>{m}</li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <TextField id="c-name" label="Name" value={v.name} onChange={(x) => set("name", x)} error={errors.name} autoComplete="name" required maxLength={80} />
        <TextField id="c-email" label="Email" type="email" value={v.email} onChange={(x) => set("email", x)} error={errors.email} autoComplete="email" required maxLength={160} />
      </div>
      <ChoiceGroup
        name="c-country"
        legend="Your country (so your message goes to the right team)"
        options={countries.map((c) => ({ value: c, label: countryLabel[c] }))}
        value={v.country}
        onChange={(x) => set("country", x as (typeof countries)[number])}
        error={errors.country}
      />
      <TextField id="c-message" label="Message" value={v.message} onChange={(x) => set("message", x)} error={errors.message} required maxLength={1000} multiline />
      <label className="flex cursor-pointer items-start gap-3">
        <input type="checkbox" checked={v.consent} onChange={(e) => set("consent", e.target.checked)} aria-invalid={!!errors.consent} className="mt-0.5 size-6 shrink-0 accent-[#0D2036]" />
        <span>
          I agree that Maya E.A. Limited may use these details to reply, as described in the{" "}
          <Link href="/privacy" target="_blank" className="font-semibold text-navy underline underline-offset-4">
            privacy notice
          </Link>
          .
        </span>
      </label>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button type="submit" disabled={status === "sending"} className="min-h-12 rounded-full bg-ink px-7 font-semibold text-white hover:bg-navy disabled:opacity-70">
          {status === "sending" ? "Sending…" : "Send message"}
        </button>
        <Link href="/wholesale" className="font-semibold text-navy underline underline-offset-4">
          Ordering in bulk? Request wholesale pricing →
        </Link>
      </div>
    </form>
  );
}
