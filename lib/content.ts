/**
 * Non-translatable structure & configuration.
 *
 * All user-facing copy lives in `messages/<locale>.json` and is read via
 * next-intl. This file keeps only locale-independent data — icons, numeric
 * values, hrefs and ordering — which components zip together with the
 * translated strings (by array index / key).
 *
 * Keep the order of these arrays in sync with the matching arrays in the
 * message files.
 */

import type { IconName } from "@/components/ui/Icon";

export const navConfig = {
  links: [
    { key: "problem", href: "#problem" },
    { key: "howItWorks", href: "#how-it-works" },
    { key: "model", href: "#model" },
    { key: "faq", href: "#faq" },
  ],
  /** Locale-relative routes — render with the i18n Link or prefix the locale. */
  /** Separate pages shown next to the section links. */
  pages: [{ key: "directory", href: "/handwerker" }],
  cta: { href: "/signup" },
  login: { href: "/login" },
} as const;

/** Trust bar credential icons (order matches trustBar.items in messages). */
export const trustBarIcons: readonly IconName[] = [
  "shield",
  "server",
  "globe",
];

export type StatConfig = { value: number; prefix?: string };

/** Market figures (order matches market.items; suffixes are per-locale). */
export const marketStatsConfig: readonly StatConfig[] = [
  { value: 9000 },
  { value: 45000 },
  { value: 1, prefix: "~" },
  { value: 62 },
];

/** Icons for the two "How it works" flows (order matches the message arrays). */
export const craftsmanFlowIcons: readonly IconName[] = [
  "phone-missed",
  "message",
  "clipboard",
  "calendar-check",
];

export const customerFlowIcons: readonly IconName[] = [
  "search",
  "compare",
  "bolt",
  "check",
];

/** "Why HandyPlan" card icons (order matches why.cards). */
export const whyIcons: readonly IconName[] = ["phone", "target", "shield"];

/** Pricing cards (keys match `model.*` in messages). */
export const businessModelConfig: readonly {
  key: "free" | "paid";
  icon: IconName;
  featured: boolean;
}[] = [
  { key: "free", icon: "check", featured: true },
  { key: "paid", icon: "sparkle", featured: false },
];

/** Language tiles (order matches languages.items). */
export const languagesConfig = [
  { code: "de", available: true },
  { code: "en", available: true },
  { code: "ar", available: false },
] as const;

/* ── Dashboard ───────────────────────────────────────────────────
   One shell for both roles; each role gets its own sidebar navigation.
   Section pages live at /dashboard/<key>; labels are `dashboard.nav.<key>`. */
export type DashboardRole = "business" | "customer";
export type DashboardNavItem = { key: string; href: string; icon: IconName };
export type DashboardNavGroup = { key: string; items: DashboardNavItem[] };

const navItem = (key: string, icon: IconName): DashboardNavItem => ({
  key,
  icon,
  href: key === "overview" ? "/dashboard" : `/dashboard/${key}`,
});

export const dashboardNav: Record<DashboardRole, DashboardNavGroup[]> = {
  business: [
    {
      key: "work",
      items: [
        navItem("overview", "home"),
        navItem("jobs", "clipboard"),
        navItem("calls", "phone-missed"),
        navItem("calendar", "calendar"),
        navItem("customers", "users"),
        navItem("messages", "message"),
      ],
    },
    {
      key: "account",
      items: [
        navItem("profile", "building"),
        navItem("ai", "sparkle"),
        navItem("settings", "gear"),
      ],
    },
  ],
  customer: [
    {
      key: "main",
      items: [
        navItem("overview", "home"),
        navItem("find", "search"),
        navItem("bookings", "calendar-check"),
        navItem("messages", "message"),
      ],
    },
    { key: "account", items: [navItem("settings", "gear")] },
  ],
};

/* ── Onboarding wizard ───────────────────────────────────────────
   Ordered steps + the option keys for each step. Labels live in the
   `onboarding` message namespace, keyed by these same strings. */
export const onboardingSteps = ["business", "contact", "hours"] as const;
export type OnboardingStep = (typeof onboardingSteps)[number];

export const tradeOptions = [
  "electrician",
  "plumber",
  "hvac",
  "carpenter",
  "painter",
  "roofer",
  "tiler",
  "locksmith",
  "chimneySweep",
  "mechanic",
  "other",
] as const;

/** Team-size buckets for "How many people work in your business?". */
export const employeeOptions = [
  "solo",
  "2to5",
  "6to10",
  "11to20",
  "21to50",
  "over50",
] as const;

/** Service-area radius in km. */
export const serviceRadiusOptions = ["10", "25", "50", "100"] as const;

export const serviceOptions = [
  "consultation",
  "installation",
  "repair",
  "maintenance",
  "inspection",
  "emergency",
] as const;

export const weekdays = [
  "mon",
  "tue",
  "wed",
  "thu",
  "fri",
  "sat",
  "sun",
] as const;
