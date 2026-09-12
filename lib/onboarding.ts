import { cookies } from "next/headers";
import type { OnboardingStep } from "@/lib/content";

/**
 * Server-side onboarding state, persisted in an httpOnly cookie so the whole
 * wizard stays server-rendered (no client store). Swap this for your database
 * once accounts are real — the read/write shape stays the same.
 */
export type OnboardingData = {
  // Step 1 — business
  businessName?: string;
  trade?: string;
  employees?: string;
  // Step 2 — contact & location
  phone?: string;
  mobile?: string;
  emergencyPhone?: string;
  street?: string;
  postcode?: string;
  city?: string;
  serviceRadius?: string;
  website?: string;
  // Step 3 — hours & services
  days?: string[];
  start?: string;
  end?: string;
  services?: string[];
  customService?: string;
};

const COOKIE = "hp_onboarding";

export async function readOnboarding(): Promise<OnboardingData> {
  const store = await cookies();
  const raw = store.get(COOKIE)?.value;
  if (!raw) return {};
  try {
    return JSON.parse(raw) as OnboardingData;
  } catch {
    return {};
  }
}

/** Merge a patch into the saved onboarding data. Call only from a Server Action. */
export async function saveOnboarding(patch: Partial<OnboardingData>) {
  const store = await cookies();
  const current = await readOnboarding();
  store.set(COOKIE, JSON.stringify({ ...current, ...patch }), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days, so skipped details can be added later
  });
}

/** Clear onboarding state (e.g. after completion). Call only from a Server Action. */
export async function clearOnboarding() {
  const store = await cookies();
  store.delete(COOKIE);
}

/** Guards translation lookups against stale or hand-edited cookie values. */
export function isOneOf<T extends string>(
  value: string | undefined,
  allowed: readonly T[],
): value is T {
  return value !== undefined && (allowed as readonly string[]).includes(value);
}

const filled = (value?: string | string[]) =>
  Array.isArray(value) ? value.length > 0 : Boolean(value);

/** Profile completeness: what's filled in, and which step adds the rest. */
export function profileChecklist(data: OnboardingData) {
  const items: { key: string; step: OnboardingStep; done: boolean }[] = [
    { key: "business", step: "business", done: filled(data.businessName) && filled(data.trade) },
    { key: "employees", step: "business", done: filled(data.employees) },
    { key: "phones", step: "contact", done: filled(data.phone) || filled(data.mobile) },
    { key: "address", step: "contact", done: filled(data.postcode) && filled(data.city) },
    { key: "hours", step: "hours", done: filled(data.days) },
    { key: "services", step: "hours", done: filled(data.services) || filled(data.customService) },
  ];
  const missing = items.filter((item) => !item.done);
  const percent = Math.round(((items.length - missing.length) / items.length) * 100);
  return { items, missing, percent };
}
