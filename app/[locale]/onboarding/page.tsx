import { redirect } from "@/i18n/navigation";
import { onboardingSteps } from "@/lib/content";

// Never prerender this redirect: a cached, static redirect page broke
// client-side navigation into onboarding on Netlify.
export const dynamic = "force-dynamic";

export default async function OnboardingIndex({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  // Always start the wizard at the first step.
  redirect({ href: `/onboarding/${onboardingSteps[0]}`, locale });
}
