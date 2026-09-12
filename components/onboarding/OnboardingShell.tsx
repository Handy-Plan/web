import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { onboardingSteps } from "@/lib/content";
import Logo from "@/components/ui/Logo";
import ThemeToggle from "@/components/ui/ThemeToggle";
import LocaleSwitcher from "@/components/ui/LocaleSwitcher";
import Stepper from "./Stepper";

const DOTS_ON_BLUE = {
  backgroundImage:
    "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.6) 1px, transparent 0)",
  backgroundSize: "26px 26px",
};

const FADE_DOWN = "linear-gradient(to bottom, black, transparent 75%)";

/**
 * Shared frame for every onboarding screen: a blue, dotted header band (same
 * look as the signup brand panel) holding the top bar and progress stepper,
 * with the form cards overlapping its lower edge. Fully server-rendered.
 *
 * Pass the zero-based step index for a form step, or "done" for the final
 * screen (hides the stepper and the skip link).
 */
export default async function OnboardingShell({
  current,
  aside,
  children,
}: {
  current: number | "done";
  /** Optional side panel, shown next to the form on large screens. */
  aside?: React.ReactNode;
  children: React.ReactNode;
}) {
  const t = await getTranslations("onboarding");
  const isDone = current === "done";
  const labels = onboardingSteps.map((s) => t(`steps.${s}`));

  const stepper = typeof current === "number" && (
    <Stepper
      steps={labels}
      hrefs={onboardingSteps.map((s) => `/onboarding/${s}`)}
      current={current}
      stepLabel={t("stepLabel", {
        current: current + 1,
        total: onboardingSteps.length,
      })}
    />
  );

  return (
    <main className="relative min-h-svh overflow-hidden bg-canvas">
      {/* Blue header band with dots + glows, mirroring the signup panel */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[300px] overflow-hidden rounded-b-[40px] bg-gradient-to-bl from-primary via-indigo to-violet sm:h-[320px]"
      >
        <div className="absolute inset-0 opacity-25" style={DOTS_ON_BLUE} />
        <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-28 -right-16 h-80 w-80 rounded-full bg-violet/40 blur-3xl" />
      </div>

      {/* Faint dot grid on the rest of the page, fading out downwards */}
      <div
        aria-hidden
        className="bg-dot-grid pointer-events-none absolute inset-x-0 bottom-0 top-[300px] sm:top-[320px]"
        style={{ maskImage: FADE_DOWN, WebkitMaskImage: FADE_DOWN }}
      />

      <header className="relative mx-auto flex max-w-5xl items-center justify-between gap-3 px-6 py-6">
        <Link href="/" className="flex items-center gap-2.5 text-white">
          {/* white ring so the blue logo tile stands out on the blue band */}
          <span className="rounded-[14px] ring-2 ring-white/35">
            <Logo />
          </span>
          <span className="text-xl font-bold tracking-tight">HandyPlan</span>
        </Link>
        <div className="flex items-center gap-2">
          {/* Light pill so the shared controls keep their normal colors */}
          <div className="flex items-center gap-1 rounded-2xl bg-surface p-1 shadow-[var(--shadow-soft)]">
            <LocaleSwitcher />
            <ThemeToggle className="h-9 w-9" />
          </div>
          {!isDone && (
            <Link
              href="/onboarding/done"
              className="hidden rounded-lg px-3 py-2 text-sm font-medium text-white/90 ring-1 ring-inset ring-white/25 transition-colors hover:bg-white/10 hover:text-white sm:block"
            >
              {t("skip")}
            </Link>
          )}
        </div>
      </header>

      {aside ? (
        <div className="relative mx-auto grid w-full max-w-5xl items-start gap-8 px-6 pb-20 pt-4 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="min-w-0">
            {stepper}
            {children}
          </div>
          <aside className="hidden lg:sticky lg:top-8 lg:mt-[68px] lg:block">
            {aside}
          </aside>
        </div>
      ) : (
        <div className="relative mx-auto w-full max-w-xl px-6 pb-20 pt-4">
          {stepper}
          {children}
        </div>
      )}
    </main>
  );
}
