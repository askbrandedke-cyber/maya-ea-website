import { Breadcrumbs, type Crumb } from "./Breadcrumbs";

/** Standard dark page header: breadcrumbs, H1, lead. */
export function PageHero({ crumbs, eyebrow, title, lead }: { crumbs: Crumb[]; eyebrow?: string; title: string; lead?: string }) {
  return (
    <section className="bg-ink text-white">
      <div className="mx-auto max-w-7xl px-4 pb-10 pt-8 md:px-6 md:pb-14">
        <Breadcrumbs tone="dark" items={crumbs} />
        {eyebrow && <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-chef">{eyebrow}</p>}
        <h1 className={`${eyebrow ? "mt-2" : "mt-5"} max-w-4xl text-balance text-4xl font-bold tracking-tight md:text-5xl`}>{title}</h1>
        {lead && <p className="mt-4 max-w-2xl text-lg text-white/85">{lead}</p>}
      </div>
    </section>
  );
}
