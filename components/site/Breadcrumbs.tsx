import Link from "next/link";
import { SITE_URL } from "@/content/brand";
import { JsonLd } from "@/lib/jsonld";

export type Crumb = { name: string; href: string };

/** Visible breadcrumb trail + BreadcrumbList JSON-LD. Last item is the current page. */
export function Breadcrumbs({ items, tone = "light" }: { items: Crumb[]; tone?: "light" | "dark" }) {
  const all = [{ name: "Home", href: "/" }, ...items];
  return (
    <>
      <nav aria-label="Breadcrumb" className="text-sm">
        <ol className={`flex flex-wrap items-center gap-x-2 gap-y-1 ${tone === "dark" ? "text-white" : "text-ink"}`}>
          {all.map((c, i) => (
            <li key={c.href} className="flex items-center gap-2">
              {i > 0 && <span aria-hidden>›</span>}
              {i === all.length - 1 ? (
                <span aria-current="page" className={`font-semibold ${tone === "dark" ? "text-white" : "text-ink"}`}>
                  {c.name}
                </span>
              ) : (
                <Link href={c.href} className="inline-flex min-h-6 items-center underline-offset-4 hover:underline">
                  {c.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: all.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, item: `${SITE_URL}${c.href}` })),
        }}
      />
    </>
  );
}
