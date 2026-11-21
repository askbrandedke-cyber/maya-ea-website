import Link from "next/link";
import { ArrowRight } from "@/components/site/icons";
import { Reveal } from "@/components/motion/Reveal";

export function SectionHeading({
  id,
  eyebrow,
  title,
  lead,
  action,
  tone = "light",
}: {
  id: string;
  eyebrow: string;
  title: string;
  lead?: string;
  action?: { href: string; label: string };
  tone?: "light" | "dark";
}) {
  const dark = tone === "dark";
  return (
    <Reveal className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        <p className={`text-xs font-bold uppercase tracking-[0.2em] ${dark ? "text-chef" : "text-navy"}`}>{eyebrow}</p>
        <h2 id={id} className={`mt-3 text-balance text-3xl font-bold tracking-tight md:text-[2.6rem] md:leading-[1.1] ${dark ? "text-white" : "text-ink"}`}>
          {title}
        </h2>
        {lead && <p className={`mt-4 text-lg leading-relaxed ${dark ? "text-white/75" : "text-ink/70"}`}>{lead}</p>}
      </div>
      {action && (
        <Link
          href={action.href}
          className={`group inline-flex min-h-11 shrink-0 items-center gap-2 font-semibold underline-offset-4 hover:underline ${dark ? "text-chef" : "text-navy"}`}
        >
          {action.label}
          <ArrowRight className="size-5 transition group-hover:translate-x-0.5" />
        </Link>
      )}
    </Reveal>
  );
}
