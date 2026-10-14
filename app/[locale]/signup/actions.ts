"use server";

import { redirect } from "next/navigation";
import { hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import { onboardingSteps } from "@/lib/content";
import { safeNext, setRole } from "@/lib/auth-redirect";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Server-side signup handler (progressive enhancement — works without JS).
 *
 * No backend is wired up yet, so this validates the input and either redirects
 * back to the form with an error, or simulates success by sending the user
 * home. Swap the success branch for your real account-creation logic later.
 */
export async function signup(formData: FormData): Promise<void> {
  const requested = String(formData.get("locale") ?? "");
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const terms = formData.get("terms") != null;
  const role = formData.get("role") === "customer" ? "customer" : "business";
  const next = safeNext(formData.get("next"));

  const back = (error: string) =>
    redirect(
      `/${locale}/signup?error=${error}&name=${encodeURIComponent(
        name,
      )}&email=${encodeURIComponent(email)}&as=${role}${
        next ? `&next=${encodeURIComponent(next)}` : ""
      }`,
    );

  if (!name || !email || !password) back("required");
  if (!EMAIL_RE.test(email)) back("invalidEmail");
  if (password.length < 8) back("weakPassword");
  if (!terms) back("terms");

  // TODO: create the account & session here.
  await setRole(role);

  // Customers skip the business wizard: back to the tradesperson they picked
  // in the directory, or to their dashboard.
  if (role === "customer") redirect(`/${locale}${next ?? "/dashboard"}`);

  // Businesses: go straight to the first step: redirecting to /onboarding (a prerendered
  // page that itself redirects) crashed the client on Netlify, whose cache
  // served a stale redirect for the action response.
  redirect(`/${locale}/onboarding/${onboardingSteps[0]}`);
}
