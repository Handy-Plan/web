/**
 * Non-translatable structure & configuration.
 *
 * All user-facing copy lives in `messages/<locale>.json` and is read via
 * next-intl. This file keeps only locale-independent data — icons, accent
 * keys, numeric values, prices, hrefs and ordering — which components zip
 * together with the translated strings (by array index / key).
 *
 * Keep the order of these arrays in sync with the matching arrays in the
 * message files.
 */

import type { IconName } from "@/components/ui/Icon";

export const navConfig = {
  links: [
    { key: "features", href: "#features" },
    { key: "howItWorks", href: "#how-it-works" },
    { key: "pricing", href: "#pricing" },
    { key: "faq", href: "#faq" },
  ],
  cta: { href: "#pricing" },
  login: { href: "/login" },
} as const;

export type StatConfig = { value: number; suffix: string; decimals?: number };

export const statsConfig: readonly StatConfig[] = [
  { value: 10000, suffix: "+" },
  { value: 500, suffix: "+" },
  { value: 40, suffix: "%" },
  { value: 4.8, suffix: "/5", decimals: 1 },
];

export type ProblemAccent = "danger" | "warning";

export const problemsConfig: readonly {
  icon: IconName;
  accent: ProblemAccent;
}[] = [
  { icon: "phone", accent: "danger" },
  { icon: "calendar", accent: "warning" },
  { icon: "clock", accent: "danger" },
];

export const featuresConfig: readonly { icon: IconName }[] = [
  { icon: "widget" },
  { icon: "calendar" },
  { icon: "mobile" },
  { icon: "bell" },
  { icon: "users" },
  { icon: "invoice" },
];

export const stepsConfig: readonly { number: string; icon: IconName }[] = [
  { number: "1", icon: "signup" },
  { number: "2", icon: "setup" },
  { number: "3", icon: "rocket" },
];

export const testimonialsConfig: readonly { initials: string }[] = [
  { initials: "MW" },
  { initials: "AS" },
  { initials: "TM" },
];

export type PlanInterval = "monthly" | "yearly";

export const pricingConfig = {
  plans: [
    { monthly: 19, yearly: 190, featured: false },
    { monthly: 39, yearly: 390, featured: true },
    { monthly: 79, yearly: 790, featured: false },
  ],
} as const;

/** Footer column keys (match `footer.columns.*` in messages) + brand socials. */
export const footerConfig = {
  columns: ["product", "resources", "company", "legal"] as const,
  socials: ["LinkedIn", "Facebook", "Instagram", "YouTube"] as const,
};
