import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * Everything may be crawled. App pages (dashboard, onboarding, login) carry
 * `noindex` instead of a Disallow: a blocked URL can't show Google its
 * noindex and may still be listed from links.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
