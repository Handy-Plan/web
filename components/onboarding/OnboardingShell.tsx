import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { onboardingSteps } from "@/lib/content";
import Logo from "@/components/ui/Logo";
import ThemeToggle from "@/components/ui/ThemeToggle";
import LocaleSwitcher from "@/components/ui/LocaleSwitcher";
import Stepper from "./Stepper";

/**
 * Shared frame for every onboarding screen: top bar (logo + locale/theme +
 * skip) and, for the form steps, the progress stepper. Fully server-rendered.
 *
 * Pass the zero-based step index for a form step, or "done" for the final
 * screen (hides the stepper and the skip link).
 */
export default async function OnboardingShell({
  current,
  children,
}: {
  current: number | "done";
  children: React.ReactNode;
}) {
  const t = await getTranslations("onboarding");
  const isDone = current === "done";
  const labels = onboardingSteps.map((s) => t(`steps.${s}`));

  return (
    <main className="relative min-h-svh overflow-hidden bg-canvas">
      {/* ambient accents */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 bg-gradient-to-b from-primary/8 to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/2 -z-10 h-96 w-96 -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]"
      />

      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
        <Link href="/" className="flex items-center gap-2.5">
          <Logo />
          <span className="text-xl font-bold tracking-tight text-ink">
            HandyPlan
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <LocaleSwitcher />
          <ThemeToggle />
          {!isDone && (
            <Link
              href="/onboarding/done"
              className="ml-1 hidden rounded-lg px-3 py-2 text-sm font-medium text-slate transition-colors hover:text-primary sm:block"
            >
              {t("skip")}
            </Link>
          )}
        </div>
      </header>

      <div className="mx-auto w-full max-w-xl px-6 pb-20 pt-4">
        {typeof current === "number" && (
          <Stepper
            steps={labels}
            current={current}
            stepLabel={t("stepLabel", {
              current: current + 1,
              total: onboardingSteps.length,
            })}
          />
        )}
        {children}
      </div>
    </main>
  );
}
