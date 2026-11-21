import Link from "next/link";
import { team } from "@/content/company";
import { Confirm } from "@/components/concept/Confirm";
import { PageHero } from "@/components/site/PageHero";
import { metaFor } from "@/lib/meta";

export const metadata = metaFor("/team");
const initials = (n: string) => n.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0]).join("");

function Group({ id, title, people }: { id: string; title: string; people: { name: string; role: string }[] }) {
  return (
    <section aria-labelledby={id} className="mt-12 first:mt-0">
      <h2 id={id} className="text-2xl font-bold tracking-tight">
        {title}
      </h2>
      <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {people.map((p) => (
          <li key={p.name} className="rounded-2xl bg-white p-5 ring-1 ring-line">
            <span aria-hidden className="flex size-14 items-center justify-center rounded-full bg-navy text-lg font-bold text-chef">
              {initials(p.name)}
            </span>
            <h3 className="mt-4 font-semibold">{p.name}</h3>
            <p className="text-sm text-ink/80">{p.role}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function TeamPage() {
  return (
    <>
      <PageHero crumbs={[{ name: "Team", href: "/team" }]} title="Our team" lead="The board and senior management of Maya E.A. Limited." />
      <div className="mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-20">
        <Group id="board" title="Board of directors" people={team.board} />
        <Group id="mgmt" title="Senior management" people={team.management} />
        <Confirm className="mt-6" text={team.confirm} />
        <p className="mt-10">
          Want to join us?{" "}
          <Link href="/careers" className="font-semibold text-navy underline underline-offset-4">
            See careers
          </Link>
          .
        </p>
      </div>
    </>
  );
}
