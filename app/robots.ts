import type { MetadataRoute } from "next";
import { SITE_URL } from "@/content/brand";
import { allowIndexing } from "@/content/site";

/** /robots.txt — blocks everything until NEXT_PUBLIC_ALLOW_INDEXING=true (proposal builds stay private). */
export default function robots(): MetadataRoute.Robots {
  if (!allowIndexing) return { rules: [{ userAgent: "*", disallow: "/" }] };
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/"] }],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
