import type { Metadata } from "next";
import { routing, type Locale } from "@/i18n/routing";

/**
 * Site-wide SEO settings. Set NEXT_PUBLIC_SITE_URL (e.g. on Netlify) once the
 * site moves to its own domain; canonical URLs, hreflang, the sitemap and
 * share cards all follow it.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://handyplan.netlify.app").replace(/\/$/, "");

export const SITE_NAME = "HandyPlan";

/** Open Graph locale codes (language_TERRITORY). */
export const ogLocale: Record<Locale, string> = { en: "en_US", de: "de_DE" };

/** Absolute URL for a locale + path ("" = the locale's home page). */
export const urlFor = (locale: string, path = "") => `${SITE_URL}/${locale}${path}`;

/**
 * canonical + hreflang alternates + Open Graph url/locale for one page, so
 * every indexable page tells search engines and link previews the same story.
 * `x-default` points at "/", which picks the language from the browser.
 */
export function pageMeta({
  locale,
  path = "",
  title,
  description,
  shareDescription = description,
  home = false,
}: {
  locale: string;
  path?: string;
  title?: string;
  description?: string;
  /** Shorter text for link previews (they cut off around 125 characters). */
  shareDescription?: string;
  /** Home page: use the title as is (no "· HandyPlan" template). */
  home?: boolean;
}): Metadata {
  // Share cards don't apply the title template, so add the brand here.
  const shareTitle = title && (home ? title : `${title} · ${SITE_NAME}`);
  const languages = Object.fromEntries(routing.locales.map((l) => [l, urlFor(l, path)]));
  return {
    ...(title && { title: home ? { absolute: title } : title }),
    ...(description && { description }),
    alternates: {
      canonical: urlFor(locale, path),
      languages: { ...languages, "x-default": `${SITE_URL}${path ? `/${routing.defaultLocale}${path}` : "/"}` },
    },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      url: urlFor(locale, path),
      locale: ogLocale[locale as Locale] ?? ogLocale.en,
      alternateLocale: routing.locales.filter((l) => l !== locale).map((l) => ogLocale[l]),
      ...(shareTitle && { title: shareTitle }),
      ...(shareDescription && { description: shareDescription }),
    },
    twitter: {
      card: "summary_large_image",
      ...(shareTitle && { title: shareTitle }),
      ...(shareDescription && { description: shareDescription }),
    },
  };
}

/** For app pages that must never show up in search (dashboard, wizard, login). */
export const noIndex: Metadata["robots"] = { index: false, follow: false, nocache: true };
