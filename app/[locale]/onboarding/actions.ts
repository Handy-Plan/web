"use server";

import { redirect } from "next/navigation";
import { hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import { saveOnboarding } from "@/lib/onboarding";

function resolveLocale(formData: FormData): string {
  const requested = String(formData.get("locale") ?? "");
  return hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;
}

export async function saveBusiness(formData: FormData): Promise<void> {
  const locale = resolveLocale(formData);
  const businessName = String(formData.get("businessName") ?? "").trim();
  const trade = String(formData.get("trade") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();

  if (!businessName || !trade) {
    redirect(`/${locale}/onboarding/business?error=1`);
  }

  await saveOnboarding({ businessName, trade, phone });
  redirect(`/${locale}/onboarding/services`);
}

export async function saveServices(formData: FormData): Promise<void> {
  const locale = resolveLocale(formData);
  const services = formData.getAll("services").map(String);
  const customService = String(formData.get("customService") ?? "").trim();

  if (services.length === 0 && !customService) {
    redirect(`/${locale}/onboarding/services?error=1`);
  }

  await saveOnboarding({ services, customService });
  redirect(`/${locale}/onboarding/availability`);
}

export async function saveAvailability(formData: FormData): Promise<void> {
  const locale = resolveLocale(formData);
  const days = formData.getAll("days").map(String);
  const start = String(formData.get("start") ?? "");
  const end = String(formData.get("end") ?? "");

  if (days.length === 0) {
    redirect(`/${locale}/onboarding/availability?error=1`);
  }

  await saveOnboarding({ days, start, end });
  // TODO: persist the collected profile to the account here.
  redirect(`/${locale}/onboarding/done`);
}
