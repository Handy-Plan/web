import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { profileChecklist, readOnboarding } from "@/lib/onboarding";
import { readRole } from "@/lib/session";
import Icon, { type IconName } from "@/components/ui/Icon";
import SectionPlaceholder from "@/components/dashboard/SectionPlaceholder";

type PageProps = { params: Promise<{ locale: string }> };

// No backend yet: every figure starts empty rather than showing made-up numbers.
const stats: { key: string; icon: IconName; value: string; href: string }[] = [
  { key: "missed", icon: "phone-missed", value: "0", href: "/dashboard/calls" },
  { key: "cards", icon: "clipboard", value: "0", href: "/dashboard/jobs" },
  { key: "booked", icon: "calendar-check", value: "0", href: "/dashboard/calendar" },
  { key: "reply", icon: "clock", value: "-", href: "/dashboard/messages" },
];

/** `--i` drives the staggered entrance (see .auth-rise in globals.css). */
const i = (n: number) => ({ ["--i" as string]: n }) as React.CSSProperties;

/** Whole hours between two "HH:MM" strings, inclusive, for the day timeline. */
function hourTicks(start = "07:00", end = "17:00") {
  const from = Number(start.slice(0, 2));
  const to = Math.max(from + 1, Number(end.slice(0, 2)));
  return Array.from({ length: to - from + 1 }, (_, k) => `${String(from + k).padStart(2, "0")}:00`);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "dashboard" });
  return { title: t("nav.overview") };
}

export default async function DashboardOverview({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const role = await readRole();
  if (role === "customer") return <SectionPlaceholder section="overview" icon="home" />;

  const t = await getTranslations("dashboard.overview");
  const ob = await getTranslations("onboarding");
  const data = await readOnboarding();
  const { percent, missing } = profileChecklist(data);
  const nextStep = missing[0]?.step ?? "business";
  const today = new Intl.DateTimeFormat(locale, { weekday: "long", day: "numeric", month: "long" }).format(new Date());
  const name = data.businessName || ob("aside.namePlaceholder");
  const ticks = hourTicks(data.start, data.end);

  // Profile ring geometry
  const R = 38;
  const C = 2 * Math.PI * R;

  return (
    <div className="auth-rise flex flex-col gap-5 sm:gap-6">
      {/* Greeting */}
      <div style={i(0)} className="pt-2">
        <p className="font-mono text-[12px] text-muted">{today}</p>
        <h1 className="mt-2 text-[32px] font-semibold leading-[1.05] tracking-[-0.045em] text-ink sm:text-[44px]">
          {/* Short on purpose: long company names made this heading wrap. */}
          {data.businessName ? t("greeting") : t("greetingNoName")}
        </h1>
        <p className="mt-2 text-[16px] text-slate">{t("subtitle")}</p>
      </div>

      {/* Hero: what callers get + profile completeness (night-blue stage) */}
      <section
        style={i(1)}
        className="relative overflow-hidden rounded-[28px] bg-[#06121f] p-6 text-white sm:p-8 lg:p-10"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(70% 70% at 85% 0%, rgba(3,105,161,0.55), transparent 70%), radial-gradient(50% 60% at 0% 100%, rgba(56,189,248,0.16), transparent 70%)",
          }}
        />
        <div aria-hidden className="pointer-events-none absolute inset-x-[-20%] bottom-[-22%] h-[48%] opacity-25">
          <div className="hp-floor absolute inset-0 [--color-primary:#38bdf8]" />
        </div>

        <div className="relative grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-center lg:gap-12">
          {/* Caller message */}
          <div>
            <p className="flex items-center gap-2 text-[13px] font-medium text-white/60">
              <Icon name="message" size={15} className="text-sky-300" />
              {ob("aside.previewTitle")}
            </p>
            <div className="mt-4 max-w-[520px] rounded-[22px] rounded-tl-[6px] bg-white/[0.08] px-5 py-4 ring-1 ring-white/12 backdrop-blur-xl">
              <p className="text-pretty text-[15px] leading-relaxed sm:text-[16px]">
                {ob("aside.previewText", { name })}
                {data.emergencyPhone && (
                  <span className="mt-2 block font-semibold">
                    {ob("aside.previewEmergency", { phone: data.emergencyPhone })}
                  </span>
                )}
              </p>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-2.5">
              <Link
                href="/dashboard/settings"
                className="group inline-flex h-11 items-center gap-2 rounded-full bg-white px-5 text-[14px] font-semibold text-[#06121f] transition-[transform,background-color] duration-200 hover:bg-sky-100 active:scale-[0.97]"
              >
                <Icon name="phone" size={16} />
                {t("jobsEmptyCta")}
                <Icon name="arrow-right" size={15} className="transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/dashboard/profile"
                className="inline-flex h-11 items-center gap-2 rounded-full px-4 text-[14px] font-medium text-white/75 ring-1 ring-inset ring-white/15 transition-colors hover:bg-white/10 hover:text-white"
              >
                {ob("done.edit")}
              </Link>
            </div>
          </div>

          {/* Profile completeness */}
          <div className="flex items-center gap-5 rounded-[22px] bg-white/[0.05] p-5 ring-1 ring-inset ring-white/10 lg:flex-col lg:items-start lg:p-6">
            <div className="relative h-[92px] w-[92px] shrink-0">
              <svg viewBox="0 0 92 92" className="h-full w-full -rotate-90" aria-hidden>
                <circle cx="46" cy="46" r={R} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="7" />
                <circle
                  cx="46"
                  cy="46"
                  r={R}
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="7"
                  strokeLinecap="round"
                  strokeDasharray={C}
                  strokeDashoffset={C * (1 - percent / 100)}
                  className="hp-ring-fill"
                  style={{ ["--ring-c" as string]: C }}
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center font-mono text-[18px] font-medium">
                {percent}%
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-[16px] font-semibold">
                {percent < 100 ? t("setupTitle") : ob("done.progress", { percent })}
              </p>
              {percent < 100 ? (
                <>
                  <p className="mt-1 text-pretty text-[14px] leading-relaxed text-white/60">{t("setupBody", { percent })}</p>
                  <Link
                    href={`/onboarding/${nextStep}`}
                    className="group mt-3 inline-flex items-center gap-1.5 text-[14px] font-semibold text-sky-300"
                  >
                    {t("setupCta")}
                    <Icon name="arrow-right" size={14} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                  </Link>
                </>
              ) : (
                <p className="mt-1 flex items-center gap-1.5 text-[14px] text-white/60">
                  <Icon name="check" size={14} className="text-success" />
                  {name}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <div style={i(2)} className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        {stats.map((s) => (
          <Link
            key={s.key}
            href={s.href}
            className="group rounded-[22px] border border-line bg-surface p-4 transition-[border-color,transform] duration-300 ease-[var(--ease-out-expo)] hover:-translate-y-0.5 hover:border-ink/15 sm:p-5"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-soft text-primary">
                <Icon name={s.icon} size={17} />
              </span>
              <Icon
                name="arrow-right"
                size={15}
                className="-rotate-45 text-muted opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100"
              />
            </div>
            <p className="mt-5 text-[40px] font-semibold leading-none tracking-[-0.05em] text-ink tabular-nums sm:text-[44px]">
              {s.value}
            </p>
            <p className="mt-2 text-[13px] font-medium text-graphite">{t(`stats.${s.key}`)}</p>
            <p className="mt-0.5 text-[12px] text-muted">{t("noData")}</p>
          </Link>
        ))}
      </div>

      <div style={i(3)} className="grid gap-5 sm:gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        {/* Latest job cards */}
        <section className="overflow-hidden rounded-[28px] border border-line bg-surface">
          <div className="flex items-center justify-between px-6 pt-6">
            <h2 className="text-[18px] font-semibold tracking-[-0.02em] text-ink">{t("jobsTitle")}</h2>
            <Link
              href="/dashboard/jobs"
              className="group inline-flex items-center gap-1 text-[13px] font-semibold text-primary"
            >
              {t("viewAll")}
              <Icon name="arrow-right" size={14} className="transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="relative flex flex-col items-center px-6 pb-10 pt-8 text-center">
            {/* Ghost job cards: shows the shape of what will arrive, not fake data */}
            <div aria-hidden className="relative h-[132px] w-full max-w-[340px]">
              {[2, 1, 0].map((k) => (
                <div
                  key={k}
                  className="absolute inset-x-0 mx-auto rounded-[18px] border border-line bg-surface-2 p-4 text-left"
                  style={{
                    top: k * 14,
                    transform: `scale(${1 - k * 0.06})`,
                    opacity: 1 - k * 0.3,
                    zIndex: 3 - k,
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="h-2.5 w-24 rounded-full bg-line" />
                    <span className="h-5 w-14 rounded-full bg-warning/20" />
                  </div>
                  <div className="mt-3 space-y-2">
                    <span className="block h-2 w-40 rounded-full bg-line" />
                    <span className="block h-2 w-28 rounded-full bg-line" />
                  </div>
                  <div className="mt-3 flex gap-2">
                    <span className="h-6 w-16 rounded-[8px] bg-primary-soft" />
                    <span className="ml-auto h-6 w-12 rounded-[8px] bg-primary/30" />
                  </div>
                </div>
              ))}
            </div>
            <h3 className="mt-6 text-[18px] font-semibold tracking-[-0.02em] text-ink">{t("jobsEmptyTitle")}</h3>
            <p className="mt-1.5 max-w-sm text-pretty text-[14px] leading-relaxed text-slate">{t("jobsEmptyBody")}</p>
            <Link
              href="/dashboard/settings"
              className="group mt-5 inline-flex h-11 items-center gap-2 rounded-full bg-ink px-5 text-[14px] font-semibold text-canvas transition-[transform,background-color] duration-200 hover:bg-primary hover:text-white active:scale-[0.97]"
            >
              <Icon name="phone" size={16} />
              {t("jobsEmptyCta")}
            </Link>
          </div>
        </section>

        {/* Today: the working day as a timeline (from onboarding hours) */}
        <section className="rounded-[28px] border border-line bg-surface p-6">
          <div className="flex items-baseline justify-between">
            <h2 className="text-[18px] font-semibold tracking-[-0.02em] text-ink">{t("todayTitle")}</h2>
            <p className="font-mono text-[12px] text-muted">
              {ticks[0]} - {ticks[ticks.length - 1]}
            </p>
          </div>
          <div className="relative mt-5">
            <ol aria-hidden className="flex flex-col">
              {ticks.map((h) => (
                <li key={h} className="flex h-9 items-start gap-3">
                  <span className="w-11 shrink-0 -translate-y-1.5 font-mono text-[11px] text-muted">{h}</span>
                  <span className="h-px flex-1 bg-line" />
                </li>
              ))}
            </ol>
            <div className="absolute inset-0 left-14 flex items-center justify-center">
              <p className="flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 text-[13px] font-medium text-slate">
                <Icon name="calendar" size={15} className="text-muted" />
                {t("todayEmpty")}
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
