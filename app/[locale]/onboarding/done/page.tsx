import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { readOnboarding } from "@/lib/onboarding";
import Icon from "@/components/ui/Icon";
import OnboardingShell from "@/components/onboarding/OnboardingShell";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "onboarding" });
  return { title: t("done.badge") };
}

export default async function OnboardingDonePage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("onboarding");
  const data = await readOnboarding();

  const services = [
    ...(data.services ?? []).map((s) => t(`services.options.${s}`)),
    ...(data.customService ? [data.customService] : []),
  ];
  const days = (data.days ?? []).map((d) => t(`availability.dayNames.${d}`));

  const rows = [
    { label: t("done.labels.business"), value: data.businessName },
    {
      label: t("done.labels.trade"),
      value: data.trade ? t(`business.trades.${data.trade}`) : undefined,
    },
    {
      label: t("done.labels.services"),
      value: services.length ? services.join(", ") : undefined,
    },
    {
      label: t("done.labels.availability"),
      value: days.length
        ? `${days.join(", ")} · ${data.start ?? ""}–${data.end ?? ""}`
        : undefined,
    },
  ].filter((r) => r.value);

  return (
    <OnboardingShell current="done">
      <section className="relative overflow-hidden rounded-3xl border border-line bg-surface p-8 text-center shadow-[var(--shadow-soft)] sm:p-10">
        {/* celebratory accents */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-16 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-primary/15 blur-3xl"
        />

        <div className="relative">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-indigo text-white shadow-[var(--shadow-glow)]">
            <Icon name="check" size={32} />
          </span>

          <span className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-success/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-success">
            <Icon name="check" size={12} />
            {t("done.badge")}
          </span>

          <h1 className="mt-4 text-balance text-3xl font-extrabold tracking-tight text-ink">
            {data.businessName
              ? t("done.title", { name: data.businessName })
              : t("done.titleNoName")}
          </h1>
          <p className="mx-auto mt-3 max-w-md text-pretty text-slate">
            {t("done.subtitle")}
          </p>

          {rows.length > 0 && (
            <div className="mx-auto mt-8 max-w-md rounded-2xl border border-line bg-mist/60 p-5 text-left">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                {t("done.summaryTitle")}
              </p>
              <dl className="mt-3 flex flex-col divide-y divide-line">
                {rows.map((r) => (
                  <div
                    key={r.label}
                    className="flex items-start justify-between gap-6 py-2.5 text-sm"
                  >
                    <dt className="shrink-0 font-medium text-slate">
                      {r.label}
                    </dt>
                    <dd className="text-right font-semibold text-ink">
                      {r.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          <div className="mt-8 flex flex-col items-center gap-3">
            <Link
              href="/"
              className="group inline-flex h-12 w-full max-w-xs items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-primary to-indigo px-7 text-[15px] font-semibold text-white shadow-[0_4px_14px_rgba(3,105,161,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-glow)] hover:brightness-[1.05] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              {t("done.cta")}
              <Icon
                name="arrow-right"
                size={18}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
            <Link
              href="/"
              className="text-sm font-medium text-slate transition-colors hover:text-primary"
            >
              {t("done.secondary")}
            </Link>
          </div>
        </div>
      </section>
    </OnboardingShell>
  );
}
