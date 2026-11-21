import type { Metadata } from "next";
import { allRoutes } from "@/content/site";

/** Routes with a co-located opengraph-image.tsx (packaging, category and product pages). */
const hasOwnOgImage = (path: string) => path === "/packaging" || /^\/products\/[^/]+/.test(path);

/** Metadata for a route defined in content/site.ts (single source of truth). */
export function metaFor(path: string, extra: Partial<Metadata> = {}): Metadata {
  const r = allRoutes.find((x) => x.path === path);
  if (!r) throw new Error(`No route meta for ${path} — add it to content/site.ts`);
  return {
    title: r.title,
    description: r.description,
    alternates: { canonical: path },
    openGraph: {
      title: r.title,
      description: r.description,
      url: path,
      // Routes with their own opengraph-image file must not set images here (metadata would win over the file).
      ...(hasOwnOgImage(path) ? {} : { images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: r.title }] }),
    },
    ...extra,
  };
}
