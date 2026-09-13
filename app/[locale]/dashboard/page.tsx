import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { profileChecklist, readOnboarding } from "@/lib/onboarding";
import { readRole } from "@/lib/session";
import Icon, { type IconName } from "@/components/ui/Icon";
import SectionPlaceholder from "@/components/dashboard/SectionPlaceholder";

type PageProps = { params: Promise<{ locale: string }> };

// No backend yet: every figure starts empty rather than showing made-up numbers.
const stats: { key: string; icon: IconName; value: string }[] = [
  { key: "missed", icon: "phone-missed", value: "0" },
  { key: "cards", icon: "clipboard", value: "0" },
  { key: "booked", icon: "calendar-check", value: "0" },
  { key: "reply", icon: "clock", value: "–" },
];

const card = "rounded-2xl border border-line bg-surface shadow-[var(--shadow-subtle)]";

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
  const data = await readOnboarding();
  const { percent, missing } = profileChecklist(data);
  const nextStep = missing[0]?.step ?? "business";

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
          {/* Short on purpose: long company names made this heading wrap. */}
          {data.businessName ? t("greeting") : t("greetingNoName")}
        </h1>
        <p className="mt-1.5 text-slate">{t("subtitle")}</p>
      </div>

      {/* Finish profile */}
      {percent < 100 && (
        <section className="rounded-2xl border border-primary/25 bg-primary-soft/50 p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-indigo text-white shadow-[0_6px_14px_rgba(3,105,161,0.28)]">
                <Icon name="building" size={22} />
              </span>
              <div>
                <h2 className="text-base font-bold text-ink">{t("setupTitle")}</h2>
                <p className="mt-1 max-w-xl text-sm text-slate">{t("setupBody", { percent })}</p>
                <div className="mt-3 h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-line">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-indigo"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            </div>
            <Link
              href={`/onboarding/${nextStep}`}
              className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-white shadow-[0_4px_14px_rgba(3,105,161,0.3)] transition-all hover:-translate-y-0.5 hover:bg-primary-dark"
            >
              {t("setupCta")}
              <Icon name="arrow-right" size={16} />
            </Link>
          </div>
        </section>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        {stats.map((s) => (
          <div key={s.key} className={`${card} p-4 sm:p-5`}>
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-slate">{t(`stats.${s.key}`)}</p>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
                <Icon name={s.icon} size={18} />
              </span>
            </div>
            <p className="mt-3 text-3xl font-extrabold tracking-tight text-ink">{s.value}</p>
            <p className="mt-1 text-xs text-slate">{t("noData")}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        {/* Latest job cards */}
        <section className={card}>
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <h2 className="text-base font-bold text-ink">{t("jobsTitle")}</h2>
            <Link
              href="/dashboard/jobs"
              className="text-sm font-semibold text-primary transition-colors hover:text-primary-dark"
            >
              {t("viewAll")}
            </Link>
          </div>
          <div className="flex flex-col items-center px-6 py-14 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-soft text-primary">
              <Icon name="clipboard" size={26} />
            </span>
            <h3 className="mt-4 text-lg font-bold text-ink">{t("jobsEmptyTitle")}</h3>
            <p className="mt-1.5 max-w-sm text-pretty text-sm text-slate">{t("jobsEmptyBody")}</p>
            <Link
              href="/dashboard/settings"
              className="mt-5 inline-flex h-10 items-center gap-2 rounded-xl border border-line bg-surface px-4 text-sm font-semibold text-graphite shadow-[var(--shadow-subtle)] transition-colors hover:border-primary/40 hover:text-primary"
            >
              <Icon name="phone" size={16} />
              {t("jobsEmptyCta")}
            </Link>
          </div>
        </section>

        {/* Today */}
        <section className={card}>
          <div className="border-b border-line px-5 py-4">
            <h2 className="text-base font-bold text-ink">{t("todayTitle")}</h2>
          </div>
          <div className="flex flex-col items-center px-6 py-14 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cloud text-slate">
              <Icon name="calendar" size={22} />
            </span>
            <p className="mt-3 text-sm text-slate">{t("todayEmpty")}</p>
          </div>
        </section>
      </div>
    </div>
  );
}
