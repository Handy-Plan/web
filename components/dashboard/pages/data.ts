import { getTranslations } from "next-intl/server";
import { readOnboarding, type OnboardingData } from "@/lib/onboarding";
import { getBusinessData, getCustomerData, sampleBusiness } from "@/lib/mock/dashboard";

type Locale = "en" | "de";
const asLocale = (locale: string): Locale => (locale === "de" ? "de" : "en");

/** Onboarding answers over the sample company: real values win, gaps use samples. */
function withSamples(data: OnboardingData) {
  const filled = Object.fromEntries(
    Object.entries(data).filter(([, v]) => (Array.isArray(v) ? v.length > 0 : Boolean(v))),
  ) as OnboardingData;
  return { ...sampleBusiness, ...filled };
}

export async function loadBusiness(locale: string) {
  const [onboarding, ob, t] = await Promise.all([
    readOnboarding(),
    getTranslations("onboarding"),
    getTranslations("dashboard.messages"),
  ]);
  const profile = withSamples(onboarding);
  const name = profile.businessName;
  const reply = ob("aside.previewText", { name });
  const mock = getBusinessData(
    asLocale(locale),
    { reply, confirm: (when) => t("confirmTemplate", { when }) },
    { start: profile.start, end: profile.end, days: [...profile.days] },
  );
  return { onboarding, profile, mock, reply };
}

export async function loadCustomer(locale: string) {
  const t = await getTranslations("dashboard.messages");
  return getCustomerData(asLocale(locale), { reply: "", confirm: (when) => t("confirmTemplate", { when }) });
}

/** HandyPlan's forwarding number for this business (sample). */
export const FORWARDING_NUMBER = "+49 355 2899 4410";
