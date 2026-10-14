import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { onboardingSteps } from "@/lib/content";
import Logo from "@/components/ui/Logo";
import Icon from "@/components/ui/Icon";
import ThemeToggle from "@/components/ui/ThemeToggle";
import LocaleSwitcher from "@/components/ui/LocaleSwitcher";
import Stepper from "./Stepper";

/**
 * Shared frame for every onboarding screen, in the same split layout as
 * login/signup: the form on the left (its own scroll area on desktop, so
 * the page itself never scrolls) and a night-blue stage on the right with
 * the live preview of what callers will receive.
 *
 * Pass the zero-based step index for a form step, or "done" for the final
 * screen (hides the stepper and the "finish later" link).
 */
export default async function OnboardingShell({
  current,
  stage,
  note,
  children,
}: {
  current: number | "done";
  /** Right-hand stage content (desktop only). */
  stage?: React.ReactNode;
  /** Short note under the stage, e.g. "Why we ask". */
  note?: { title: string; body: string };
  children: React.ReactNode;
}) {
  const t = await getTranslations("onboarding");
  const isDone = current === "done";

  return (
    <main className="min-h-svh bg-canvas lg:grid lg:h-svh lg:grid-cols-[1fr_1.05fr] lg:overflow-hidden lg:p-3">
      {/* ── Form side ─────────────────────────────────────────── */}
      <div className="relative flex min-h-svh flex-col lg:min-h-0">
        <header className="flex items-center justify-between gap-3 px-5 py-4 md:px-8 lg:py-5">
          <Link href="/" className="flex items-center gap-2.5">
            <Logo className="h-9 w-9" />
            <span className="hp-wordmark text-[19px] font-semibold tracking-[-0.03em] text-ink">HandyPlan</span>
          </Link>
          <div className="flex items-center gap-2">
            <LocaleSwitcher />
            <ThemeToggle className="h-10 w-10" />
            {!isDone && (
              <Link
                href="/onboarding/done"
                className="ml-1 hidden items-center gap-1.5 rounded-full border border-line px-4 py-2 text-[13px] font-medium text-graphite transition-colors hover:border-ink/25 hover:text-ink sm:inline-flex"
              >
                {t("skip")}
                <Icon name="arrow-right" size={14} />
              </Link>
            )}
          </div>
        </header>

        {/* Own scroll area on desktop; normal flow on phones */}
        <div className="flex flex-1 flex-col lg:min-h-0 lg:overflow-y-auto">
          <div className="mx-auto flex w-full max-w-[560px] flex-1 flex-col px-5 pb-6 pt-2 md:px-8 lg:pt-6">
            {typeof current === "number" && (
              <div className="auth-rise mb-8">
                <div style={{ ["--i" as string]: 0 }}>
                  <Stepper
                    steps={onboardingSteps.map((s) => t(`steps.${s}`))}
                    hrefs={onboardingSteps.map((s) => `/onboarding/${s}`)}
                    current={current}
                    stepLabel={t("stepLabel", { current: current + 1, total: onboardingSteps.length })}
                  />
                </div>
              </div>
            )}
            {children}
          </div>
        </div>
      </div>

      {/* ── Stage (desktop) ───────────────────────────────────── */}
      <aside className="relative hidden min-h-0 flex-col overflow-hidden rounded-[32px] bg-[#06121f] p-10 text-white lg:flex xl:p-12">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(80% 50% at 70% 0%, rgba(3,105,161,0.55), transparent 70%), radial-gradient(60% 45% at 20% 100%, rgba(56,189,248,0.2), transparent 70%)",
          }}
        />
        <div aria-hidden className="pointer-events-none absolute inset-x-[-30%] bottom-[-8%] h-[34%] opacity-50">
          <div className="hp-floor absolute inset-0 [--color-primary:#38bdf8]" />
        </div>

        {/* Stage scales down on short screens so it never collides with the note */}
        <div className="relative min-h-0 flex-1">
          <div className="absolute left-1/2 top-1/2 w-[520px] max-w-full -translate-x-1/2 -translate-y-1/2 short:scale-[0.82] xshort:scale-[0.7]">
            {stage}
          </div>
        </div>

        {note && (
          <div className="auth-rise relative">
            <div
              style={{ ["--i" as string]: 3 }}
              className="flex gap-3 rounded-[20px] bg-white/[0.06] p-4 ring-1 ring-inset ring-white/10"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sky-400/15 text-sky-300">
                <Icon name="target" size={17} />
              </span>
              <div>
                <p className="text-[14px] font-semibold">{note.title}</p>
                <p className="mt-1 text-pretty text-[14px] leading-relaxed text-white/65">{note.body}</p>
              </div>
            </div>
          </div>
        )}
      </aside>
    </main>
  );
}
