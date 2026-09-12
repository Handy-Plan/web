"use server";

import { redirect } from "next/navigation";
import { hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import {
  employeeOptions,
  onboardingSteps,
  serviceOptions,
  serviceRadiusOptions,
  tradeOptions,
  weekdays,
  type OnboardingStep,
} from "@/lib/content";
import { saveOnboarding } from "@/lib/onboarding";

const POSTCODE_RE = /^\d{5}$/;
const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;

function resolveLocale(formData: FormData): string {
  const requested = String(formData.get("locale") ?? "");
  return hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;
}

/** Trimmed text, capped so the cookie stays small; undefined when empty. */
function text(formData: FormData, key: string, max: number): string | undefined {
  const value = String(formData.get(key) ?? "").trim().slice(0, max);
  return value || undefined;
}

/** The submitted value, but only if it is one of the allowed options. */
function oneOf<T extends string>(
  formData: FormData,
  key: string,
  allowed: readonly T[],
): T | undefined {
  const value = String(formData.get(key) ?? "");
  return (allowed as readonly string[]).includes(value) ? (value as T) : undefined;
}

function manyOf<T extends string>(
  formData: FormData,
  key: string,
  allowed: readonly T[],
): T[] {
  return formData
    .getAll(key)
    .map(String)
    .filter((v): v is T => (allowed as readonly string[]).includes(v));
}

function nextStep(step: OnboardingStep): OnboardingStep | "done" {
  return onboardingSteps[onboardingSteps.indexOf(step) + 1] ?? "done";
}

function goTo(locale: string, step: OnboardingStep | "done", error = false): never {
  redirect(`/${locale}/onboarding/${step}${error ? "?error=1" : ""}`);
}

export async function saveBusiness(formData: FormData): Promise<void> {
  const locale = resolveLocale(formData);
  const businessName = text(formData, "businessName", 80);

  // The name is the only required detail: it goes into the caller's SMS.
  if (!businessName) goTo(locale, "business", true);

  await saveOnboarding({
    businessName,
    trade: oneOf(formData, "trade", tradeOptions),
    employees: oneOf(formData, "employees", employeeOptions),
  });
  goTo(locale, nextStep("business"));
}

export async function saveContact(formData: FormData): Promise<void> {
  const locale = resolveLocale(formData);
  const postcode = text(formData, "postcode", 10);
  const postcodeValid = !postcode || POSTCODE_RE.test(postcode);

  // Save everything that's valid first, so nothing is lost on an error.
  await saveOnboarding({
    phone: text(formData, "phone", 30),
    mobile: text(formData, "mobile", 30),
    emergencyPhone: text(formData, "emergencyPhone", 30),
    street: text(formData, "street", 100),
    postcode: postcodeValid ? postcode : undefined,
    city: text(formData, "city", 60),
    serviceRadius: oneOf(formData, "serviceRadius", serviceRadiusOptions),
    website: text(formData, "website", 100),
  });

  if (!postcodeValid) goTo(locale, "contact", true);
  goTo(locale, nextStep("contact"));
}

export async function saveHours(formData: FormData): Promise<void> {
  const locale = resolveLocale(formData);
  const start = String(formData.get("start") ?? "");
  const end = String(formData.get("end") ?? "");

  await saveOnboarding({
    days: manyOf(formData, "days", weekdays),
    start: TIME_RE.test(start) ? start : undefined,
    end: TIME_RE.test(end) ? end : undefined,
    services: manyOf(formData, "services", serviceOptions),
    customService: text(formData, "customService", 60),
  });
  // TODO: persist the collected profile to the account here.
  goTo(locale, "done");
}

/** "Skip this step": move on without saving anything. */
export async function skipStep(formData: FormData): Promise<void> {
  const locale = resolveLocale(formData);
  const step = oneOf(formData, "step", onboardingSteps);
  goTo(locale, step ? nextStep(step) : "done");
}
