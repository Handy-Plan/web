"use server";

import { redirect } from "next/navigation";
import { hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Server-side login handler (progressive enhancement — works without JS).
 *
 * There's no auth backend wired up yet, so this validates the input and either
 * redirects back to the form with an error, or simulates success by sending the
 * user home. Swap the success branch for your real session creation later.
 */
export async function login(formData: FormData): Promise<void> {
  const requested = String(formData.get("locale") ?? "");
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const back = (error: string) =>
    redirect(
      `/${locale}/login?error=${error}&email=${encodeURIComponent(email)}`,
    );

  if (!email || !password) back("required");
  if (!EMAIL_RE.test(email) || password.length < 6) back("invalid");

  // TODO: verify credentials & create a session here.
  redirect(`/${locale}`);
}
