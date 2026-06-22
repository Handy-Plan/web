import { cookies } from "next/headers";

/**
 * Server-side onboarding state, persisted in an httpOnly cookie so the whole
 * wizard stays server-rendered (no client store). Swap this for your database
 * once accounts are real — the read/write shape stays the same.
 */
export type OnboardingData = {
  businessName?: string;
  trade?: string;
  phone?: string;
  services?: string[];
  customService?: string;
  days?: string[];
  start?: string;
  end?: string;
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
    maxAge: 60 * 60 * 24, // 1 day
  });
}

/** Clear onboarding state (e.g. after completion). Call only from a Server Action. */
export async function clearOnboarding() {
  const store = await cookies();
  store.delete(COOKIE);
}
