import { redirect } from "@/i18n/navigation";

export default async function OnboardingIndex({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  // Always start the wizard at the first step.
  redirect({ href: "/onboarding/business", locale });
}
