import type { MetadataRoute } from "next";
import { SITE_URL } from "@/content/brand";
import { allRoutes } from "@/content/site";

/** /sitemap.xml — every route in content/site.ts. */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return allRoutes.map((r) => ({
    url: `${SITE_URL}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}
