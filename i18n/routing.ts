import { defineRouting } from "next-intl/routing";

/**
 * Single source of truth for supported locales.
 * Adding a language = add its code here + create messages/<code>.json.
 */
export const routing = defineRouting({
  locales: ["en", "de"],
  defaultLocale: "en",
  // Auto-detect from the Accept-Language header on first visit, then the
  // chosen locale is remembered via the NEXT_LOCALE cookie.
  localeDetection: true,
  // Always prefix the path with the locale (/en, /de).
  localePrefix: "always",
});

export type Locale = (typeof routing.locales)[number];
