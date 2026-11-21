import { careers } from "@/content/company";
import { Confirm } from "@/components/concept/Confirm";
import { PageHero } from "@/components/site/PageHero";
import { metaFor } from "@/lib/meta";

export const metadata = metaFor("/careers");

export default function CareersPage() {
  return (
    <>
      <PageHero crumbs={[{ name: "Careers", href: "/careers" }]} title="Careers" lead={careers.intro} />
      <div className="mx-auto max-w-3xl px-4 py-14 md:px-6 md:py-20">
        <h2 className="text-2xl font-bold tracking-tight">Current openings</h2>
        <p className="mt-3 text-lg text-ink/85">{careers.body}</p>
        <Confirm className="mt-4" text={careers.confirm} />
        <a
          href={`mailto:${careers.email}?subject=${encodeURIComponent("CV: future opportunities at Maya E.A. Limited")}`}
          className="mt-8 inline-flex min-h-12 items-center rounded-full bg-chef px-6 font-semibold text-ink"
        >
          Send your CV to {careers.email}
        </a>
      </div>
    </>
  );
}
