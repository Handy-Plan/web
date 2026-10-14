import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { urlFor } from "@/lib/site";

/** Indexable pages, each with its language alternates (hreflang). */
const pages: { path: string; priority: number; changeFrequency: "weekly" | "monthly" }[] = [
  { path: "", priority: 1, changeFrequency: "weekly" },
  { path: "/signup", priority: 0.6, changeFrequency: "monthly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return pages.flatMap(({ path, priority, changeFrequency }) =>
    routing.locales.map((locale) => ({
      url: urlFor(locale, path),
      lastModified,
      changeFrequency,
      priority: locale === "de" ? priority : Math.max(0.1, priority - 0.1),
      alternates: {
        languages: Object.fromEntries(routing.locales.map((l) => [l, urlFor(l, path)])),
      },
    })),
  );
}
