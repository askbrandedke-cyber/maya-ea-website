"use client";

/** Small accessible form primitives shared by the wholesale and contact forms. */

export function FieldError({ id, msg }: { id: string; msg?: string }) {
  return msg ? (
    <p id={id} className="mt-1.5 text-sm font-semibold text-placeholder">
      {msg}
    </p>
  ) : null;
}

export function TextField({
  id,
  label,
  value,
  onChange,
  error,
  hint,
  type = "text",
  autoComplete,
  inputMode,
  required,
  optional,
  maxLength,
  multiline,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  hint?: string;
  type?: string;
  autoComplete?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  required?: boolean;
  optional?: boolean;
  maxLength?: number;
  multiline?: boolean;
}) {
  const describedBy = [hint && `${id}-hint`, error && `${id}-err`].filter(Boolean).join(" ") || undefined;
  const cls = `w-full rounded-2xl bg-white px-4 text-base ring-1 focus:outline-none focus:ring-2 ${error ? "ring-placeholder focus:ring-placeholder" : "ring-line focus:ring-navy"}`;
  return (
    <div>
      <label htmlFor={id} className="font-semibold">
        {label}
        {optional && <span className="font-normal text-ink/75"> (optional)</span>}
      </label>
      {hint && (
        <p id={`${id}-hint`} className="text-sm text-ink/75">
          {hint}
        </p>
      )}
      {multiline ? (
        <textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          required={required}
          maxLength={maxLength}
          rows={4}
          className={`${cls} mt-2 py-3`}
        />
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          autoComplete={autoComplete}
          inputMode={inputMode}
          required={required}
          maxLength={maxLength}
          className={`${cls} mt-2 min-h-12`}
        />
      )}
      {maxLength && multiline && (
        <p className="mt-1 text-right text-xs text-ink/75" aria-hidden>
          {value.length}/{maxLength}
        </p>
      )}
      <FieldError id={`${id}-err`} msg={error} />
    </div>
  );
}

/** Radio or checkbox cards inside a fieldset with legend. */
export function ChoiceGroup<T extends string>({
  name,
  legend,
  options,
  value,
  onChange,
  error,
  multiple,
  columns = 2,
  render,
}: {
  name: string;
  legend: string;
  options: readonly { value: T; label: string }[];
  value: T | T[] | undefined;
  onChange: (v: T | T[]) => void;
  error?: string;
  multiple?: boolean;
  columns?: 2 | 3;
  render?: (o: { value: T; label: string }) => React.ReactNode;
}) {
  const selected = (v: T) => (multiple ? ((value as T[] | undefined) ?? []).includes(v) : value === v);
  const toggle = (v: T) => {
    if (!multiple) return onChange(v);
    const cur = (value as T[] | undefined) ?? [];
    onChange(cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v]);
  };
  return (
    <fieldset aria-invalid={!!error} aria-describedby={error ? `${name}-err` : undefined}>
      <legend className="font-semibold">{legend}</legend>
      <div className={`mt-3 grid gap-2.5 ${columns === 3 ? "sm:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-2"}`}>
        {options.map((o) => {
          const on = selected(o.value);
          return (
            <label
              key={o.value}
              className={`flex min-h-13 cursor-pointer items-center gap-3 rounded-2xl px-4 py-3 font-medium ring-1 transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-navy ${
                on ? "bg-ink text-white ring-ink" : "bg-white ring-line hover:ring-navy"
              }`}
            >
              <input type={multiple ? "checkbox" : "radio"} name={name} value={o.value} checked={on} onChange={() => toggle(o.value)} className="sr-only" />
              <span aria-hidden className={`flex size-5 shrink-0 items-center justify-center ring-2 ${multiple ? "rounded-md" : "rounded-full"} ${on ? "bg-chef ring-chef" : "ring-ink/30"}`}>
                {on && (
                  <svg viewBox="0 0 16 16" className="size-3.5 text-ink" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="m3 8 3.5 3.5L13 5" />
                  </svg>
                )}
              </span>
              {render ? render(o) : o.label}
            </label>
          );
        })}
      </div>
      <FieldError id={`${name}-err`} msg={error} />
    </fieldset>
  );
}

/** Off-screen honeypot. People never see or reach it; bots fill it. */
export function Honeypot({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div aria-hidden className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden">
      <label>
        Website (leave empty)
        <input type="text" name="website" tabIndex={-1} autoComplete="off" value={value} onChange={(e) => onChange(e.target.value)} />
      </label>
    </div>
  );
}
