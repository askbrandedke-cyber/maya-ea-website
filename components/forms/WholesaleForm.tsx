"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { categories, categoryBySlug } from "@/content/categories";
import { bakeOptions } from "@/content/finder";
import { offices } from "@/content/contacts";
import { productBySlug } from "@/content/products";
import { CategoryIcon, WhatsAppIcon } from "@/components/site/icons";
import { chatLink, officeByCode } from "@/lib/whatsapp";
import {
  businessTypes,
  contactMethods,
  countries,
  countryLabel,
  fieldErrors,
  frequencies,
  wholesaleSteps,
} from "@/lib/forms/schema";
import { ChoiceGroup, Honeypot, TextField } from "./fields";

type State = {
  businessType?: (typeof businessTypes)[number];
  businessOther: string;
  categories: string[];
  productsNote: string;
  frequency?: (typeof frequencies)[number];
  quantity: string;
  country?: (typeof countries)[number];
  countryOther: string;
  name: string;
  company: string;
  phone: string;
  email: string;
  preferred?: (typeof contactMethods)[number];
  consent: boolean;
  product?: string;
};

const EMPTY: State = { businessOther: "", categories: [], productsNote: "", quantity: "", countryOther: "", name: "", company: "", phone: "", email: "", consent: false };
const STORE = "maya-wholesale-v1";
const STEPS = [
  { key: "business", title: "Your business" },
  { key: "products", title: "Products" },
  { key: "volume", title: "Volume & delivery" },
  { key: "contact", title: "Contact details" },
] as const;

export function WholesaleForm() {
  const [s, setS] = useState<State>(EMPTY);
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "failed">("idle");
  const [serverMsg, setServerMsg] = useState("");
  const [honey, setHoney] = useState("");
  const [dryRun, setDryRun] = useState(false);
  const shownAt = useRef(Date.now());
  const heading = useRef<HTMLHeadingElement>(null);
  const summary = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);

  // Restore saved progress, then apply prefill from the URL (?country=&category=&product=&bake=)
  useEffect(() => {
    let next = { ...EMPTY };
    let savedStep = 0;
    try {
      const saved = JSON.parse(sessionStorage.getItem(STORE) ?? "null");
      if (saved?.s) {
        next = { ...next, ...saved.s, consent: false };
        savedStep = Math.min(saved.step ?? 0, 3);
      }
    } catch {}
    const q = new URLSearchParams(window.location.search);
    const country = q.get("country");
    if (country && (countries as readonly string[]).includes(country)) next.country = country as State["country"];
    const add = (slugs: string[]) => (next.categories = [...new Set([...next.categories, ...slugs.filter((x) => x in categoryBySlug)])]);
    const cat = q.get("category");
    if (cat) add([cat]);
    const bake = bakeOptions.find((b) => b.id === q.get("bake"));
    if (bake) add([...bake.categories]);
    const product = q.get("product");
    if (product && productBySlug[product]) {
      next.product = product;
      add([productBySlug[product].category]);
      if (!next.productsNote) next.productsNote = productBySlug[product].name;
    }
    setS(next);
    setStep(savedStep);
  }, []);

  useEffect(() => {
    if (status === "done") return;
    try {
      sessionStorage.setItem(STORE, JSON.stringify({ s: { ...s, consent: false }, step }));
    } catch {}
  }, [s, step, status]);

  useEffect(() => {
    if (firstRender.current) return void (firstRender.current = false);
    heading.current?.focus();
  }, [step, status]);

  const set = <K extends keyof State>(k: K, v: State[K]) => {
    setS((p) => ({ ...p, [k]: v }));
    if (errors[k as string]) setErrors((e) => ({ ...e, [k]: "" }));
  };

  const validate = (i: number) => {
    const schema = wholesaleSteps[STEPS[i].key];
    const r = schema.safeParse(s);
    if (r.success) return setErrors({}), true;
    setErrors(fieldErrors(r.error));
    requestAnimationFrame(() => summary.current?.focus());
    return false;
  };

  const next = () => validate(step) && setStep((x) => x + 1);

  const submit = async () => {
    if (!validate(3)) return;
    setStatus("sending");
    setServerMsg("");
    try {
      const r = await fetch("/api/wholesale", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...s, website: honey, elapsedMs: Date.now() - shownAt.current }),
      });
      const body = await r.json().catch(() => ({}));
      if (r.ok && body.ok) {
        setDryRun(!!body.dryRun);
        setStatus("done");
        try {
          sessionStorage.removeItem(STORE);
        } catch {}
        return;
      }
      if (r.status === 422 && body.errors) {
        setErrors(body.errors);
        const firstBad = STEPS.findIndex((st) => Object.keys(body.errors).some((k) => stepOf(k) === st.key));
        if (firstBad >= 0) setStep(firstBad);
        setStatus("idle");
        return;
      }
      setServerMsg(body.error ?? "Something went wrong.");
      setStatus("failed");
    } catch {
      setServerMsg("No connection. Your answers are saved on this device. Please try again, or contact us on WhatsApp.");
      setStatus("failed");
    }
  };

  const office = s.country && s.country !== "OTHER" ? officeByCode[s.country] : undefined;
  const errList = Object.entries(errors).filter(([, v]) => v);

  if (status === "done") {
    const chat = office && chatLink(office, "my wholesale enquiry");
    return (
      <div className="rounded-3xl bg-white p-6 ring-1 ring-line md:p-10">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#0B6E4F]">Enquiry sent</p>
        <h2 ref={heading} tabIndex={-1} className="mt-2 text-3xl font-bold tracking-tight outline-none">
          Thank you, {s.name.split(" ")[0]}.
        </h2>
        <p className="mt-3 max-w-xl text-lg text-ink/80">
          Your enquiry has gone to our {office ? `${office.country} team` : "sales team"}. We will reply by {s.preferred?.toLowerCase() ?? "email"}.
        </p>
        {dryRun && (
          <p className="mt-4 rounded-xl bg-cream p-3 text-sm">
            Proposal build: email sending is not configured, so this enquiry was validated and logged but not emailed. See CONTENT-GUIDE.md → Forms.
          </p>
        )}
        <div className="mt-6 flex flex-wrap gap-3">
          {chat?.kind === "whatsapp" && (
            <a href={chat.href} target="_blank" rel="noopener" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[#0B6E4F] px-5 font-semibold text-white">
              <WhatsAppIcon className="size-5" /> Faster? WhatsApp the {office!.country} team
            </a>
          )}
          <Link href="/products" className="inline-flex min-h-12 items-center rounded-full px-5 font-semibold ring-1 ring-ink/25">
            Back to products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        if (step < 3) next();
        else submit();
      }}
      className="relative rounded-3xl bg-white p-5 ring-1 ring-line md:p-10"
    >
      <Honeypot value={honey} onChange={setHoney} />
      <ol className="grid grid-cols-4 gap-2" aria-label="Progress">
        {STEPS.map((st, i) => (
          <li key={st.key} aria-current={i === step ? "step" : undefined}>
            <span className={`block h-1.5 rounded-full ${i < step ? "bg-navy" : i === step ? "bg-chef" : "bg-line"}`} />
            <span className={`mt-2 hidden text-xs font-semibold sm:block ${i === step ? "text-ink" : "text-ink/75"}`}>
              {i + 1}. {st.title}
            </span>
            <span className="sr-only">
              Step {i + 1} of 4: {st.title}
              {i < step ? ", done" : ""}
            </span>
          </li>
        ))}
      </ol>

      <h2 ref={heading} tabIndex={-1} className="mt-8 text-2xl font-bold tracking-tight outline-none md:text-3xl">
        <span className="sr-only">Step {step + 1} of 4: </span>
        {STEPS[step].title}
      </h2>

      {errList.length > 0 && (
        <div ref={summary} tabIndex={-1} role="alert" className="mt-5 rounded-2xl border-[1.5px] border-placeholder bg-[#FFF5F5] p-4 text-sm text-placeholder outline-none">
          <p className="font-bold">Please check {errList.length === 1 ? "this field" : `these ${errList.length} fields`}:</p>
          <ul className="mt-1 list-disc pl-5">
            {errList.map(([k, v]) => (
              <li key={k}>{v}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-6 grid gap-6">
        {step === 0 && (
          <>
            <ChoiceGroup
              name="businessType"
              legend="What type of business are you?"
              options={businessTypes.map((v) => ({ value: v, label: v }))}
              value={s.businessType}
              onChange={(v) => set("businessType", v as State["businessType"])}
              error={errors.businessType}
              columns={3}
            />
            {s.businessType === "Other" && (
              <TextField id="businessOther" label="Your business type" value={s.businessOther} onChange={(v) => set("businessOther", v)} error={errors.businessOther} maxLength={80} />
            )}
          </>
        )}

        {step === 1 && (
          <>
            <ChoiceGroup
              name="categories"
              legend="Which products do you need? Choose all that apply."
              multiple
              columns={3}
              options={categories.map((c) => ({ value: c.slug, label: c.name }))}
              value={s.categories}
              onChange={(v) => set("categories", v as string[])}
              error={errors.categories}
              render={(o) => {
                const c = categoryBySlug[o.value as keyof typeof categoryBySlug];
                return (
                  <span className="flex items-center gap-2">
                    <span className="flex size-7 items-center justify-center rounded-lg" style={{ background: c.colour, color: c.ink }}>
                      <CategoryIcon name={c.icon} className="size-4" strokeWidth={9} />
                    </span>
                    {o.label}
                  </span>
                );
              }}
            />
            <TextField
              id="productsNote"
              label="Specific products or brands"
              optional
              hint="For example: Volume Plus 10 kg, red velvet premix, 12-inch cake boxes."
              value={s.productsNote}
              onChange={(v) => set("productsNote", v)}
              error={errors.productsNote}
              maxLength={500}
              multiline
            />
          </>
        )}

        {step === 2 && (
          <>
            <ChoiceGroup
              name="frequency"
              legend="How often would you order?"
              options={frequencies.map((v) => ({ value: v, label: v }))}
              value={s.frequency}
              onChange={(v) => set("frequency", v as State["frequency"])}
              error={errors.frequency}
            />
            <TextField
              id="quantity"
              label="Approximate quantity per order"
              optional
              hint="In your own words, e.g. 20 sacks of improver, 200 kg of premix, 500 cake boxes."
              value={s.quantity}
              onChange={(v) => set("quantity", v)}
              error={errors.quantity}
              maxLength={120}
            />
            <ChoiceGroup
              name="country"
              legend="Delivery country"
              options={countries.map((v) => ({ value: v, label: countryLabel[v] }))}
              value={s.country}
              onChange={(v) => set("country", v as State["country"])}
              error={errors.country}
            />
            {s.country === "OTHER" && (
              <TextField id="countryOther" label="Which country?" value={s.countryOther} onChange={(v) => set("countryOther", v)} error={errors.countryOther} autoComplete="country-name" maxLength={60} />
            )}
          </>
        )}

        {step === 3 && (
          <>
            <div className="grid gap-5 md:grid-cols-2">
              <TextField id="name" label="Your name" value={s.name} onChange={(v) => set("name", v)} error={errors.name} autoComplete="name" required maxLength={80} />
              <TextField id="company" label="Business name" value={s.company} onChange={(v) => set("company", v)} error={errors.company} autoComplete="organization" required maxLength={120} />
              <TextField
                id="phone"
                label="Phone (with country code)"
                type="tel"
                inputMode="tel"
                hint="We may reply on WhatsApp to this number."
                value={s.phone}
                onChange={(v) => set("phone", v)}
                error={errors.phone}
                autoComplete="tel"
                required
                maxLength={22}
              />
              <TextField id="email" label="Email" type="email" value={s.email} onChange={(v) => set("email", v)} error={errors.email} autoComplete="email" required maxLength={160} />
            </div>
            <ChoiceGroup
              name="preferred"
              legend="How should we contact you?"
              columns={3}
              options={contactMethods.map((v) => ({ value: v, label: v }))}
              value={s.preferred}
              onChange={(v) => set("preferred", v as State["preferred"])}
              error={errors.preferred}
            />
            <div>
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={s.consent}
                  onChange={(e) => set("consent", e.target.checked)}
                  aria-invalid={!!errors.consent}
                  aria-describedby={errors.consent ? "consent-err" : undefined}
                  className="mt-0.5 size-6 shrink-0 accent-[#0D2036]"
                />
                <span>
                  I agree that Maya E.A. Limited may use these details to reply to my enquiry, as described in the{" "}
                  <Link href="/privacy" target="_blank" className="font-semibold text-navy underline underline-offset-4">
                    privacy notice
                  </Link>
                  .
                </span>
              </label>
              {errors.consent && (
                <p id="consent-err" className="mt-1.5 text-sm font-semibold text-placeholder">
                  {errors.consent}
                </p>
              )}
            </div>
          </>
        )}
      </div>

      {status === "failed" && (
        <div role="alert" className="mt-6 rounded-2xl bg-[#FFF5F5] p-4 text-sm text-placeholder ring-1 ring-placeholder">
          <p className="font-bold">{serverMsg}</p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {offices.map((o) => {
              const c = chatLink(o, "wholesale pricing");
              return (
                <li key={o.countryCode}>
                  <a href={c.href} target="_blank" rel="noopener" className="inline-flex min-h-11 items-center rounded-full bg-white px-3 font-semibold text-ink ring-1 ring-line">
                    {c.kind === "whatsapp" ? "WhatsApp" : "Call"} {o.country}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <div className="mt-8 flex flex-col-reverse gap-3 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
        {step > 0 ? (
          <button type="button" onClick={() => (setErrors({}), setStep((x) => x - 1))} className="min-h-12 rounded-full px-5 font-semibold text-navy ring-1 ring-navy/25 hover:bg-cream">
            ← Back
          </button>
        ) : (
          <span />
        )}
        <button
          type="submit"
          disabled={status === "sending"}
          className="min-h-12 rounded-full bg-chef px-7 font-semibold text-ink hover:bg-chef-tint disabled:cursor-wait disabled:opacity-70"
        >
          {step < 3 ? `Continue to ${STEPS[step + 1].title.toLowerCase()}` : status === "sending" ? "Sending…" : "Send enquiry"}
        </button>
      </div>
      <p className="mt-4 text-xs text-ink/75">Your answers are kept on this device until you send them, so you can leave and come back.</p>
    </form>
  );
}

const FIELD_STEP: Record<string, (typeof STEPS)[number]["key"]> = {
  businessType: "business",
  businessOther: "business",
  categories: "products",
  productsNote: "products",
  frequency: "volume",
  quantity: "volume",
  country: "volume",
  countryOther: "volume",
};
function stepOf(field: string) {
  return FIELD_STEP[field] ?? "contact";
}
