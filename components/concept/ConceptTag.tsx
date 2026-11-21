import { CONCEPT_TAG } from "@/content/brand";

/**
 * Mandatory label for every concept pack (PACKAGING-SYSTEM.md §8).
 * Always rendered as real text so it is readable by screen readers and in screenshots.
 */
export function ConceptTag({ tone = "dark", className = "" }: { tone?: "dark" | "light"; className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold leading-none ${
        tone === "dark" ? "bg-night/90 text-white ring-1 ring-white/15" : "bg-white text-ink ring-1 ring-ink/15"
      } ${className}`}
    >
      <span className="size-2.5 shrink-0 rounded-[3px] bg-chef ring-1 ring-ink/20" aria-hidden />
      {CONCEPT_TAG}
    </span>
  );
}

/** Wraps any concept pack visual; the tag cannot be omitted. */
export function ConceptFrame({
  children,
  className = "",
  tagPosition = "bottom-left",
  tone = "dark",
}: {
  children: React.ReactNode;
  className?: string;
  tagPosition?: "bottom-left" | "top-left" | "bottom-center";
  tone?: "dark" | "light";
}) {
  const pos = {
    "bottom-left": "bottom-3 left-3",
    "top-left": "top-3 left-3",
    "bottom-center": "bottom-3 left-1/2 -translate-x-1/2",
  }[tagPosition];
  return (
    <figure className={`relative ${className}`}>
      {children}
      <figcaption className={`pointer-events-none absolute z-10 ${pos}`}>
        <ConceptTag tone={tone} />
      </figcaption>
    </figure>
  );
}
