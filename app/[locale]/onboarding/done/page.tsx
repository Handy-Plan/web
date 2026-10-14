import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import {
  employeeOptions,
  serviceOptions,
  serviceRadiusOptions,
  tradeOptions,
  weekdays,
} from "@/lib/content";
import { isOneOf, profileChecklist, readOnboarding } from "@/lib/onboarding";
import Icon from "@/components/ui/Icon";
import OnboardingShell from "@/components/onboarding/OnboardingShell";
import LivePreview from "@/components/onboarding/LivePreview";

/** `--i` drives the staggered entrance (see .auth-rise in globals.css). */
const i = (n: number) => ({ ["--i" as string]: n }) as React.CSSProperties;

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

  const { missing, percent } = profileChecklist(data);

  const services = [
    ...(data.services ?? [])
      .filter((s) => isOneOf(s, serviceOptions))
      .map((s) => t(`hours.options.${s}`)),
    ...(data.customService ? [data.customService] : []),
  ];
  const days = (data.days ?? [])
    .filter((d) => isOneOf(d, weekdays))
    .map((d) => t(`hours.dayNames.${d}`));
  const address = [
    data.street,
    [data.postcode, data.city].filter(Boolean).join(" "),
  ]
    .filter(Boolean)
    .join(", ");

  const rows = [
    { label: t("done.labels.business"), value: data.businessName },
    {
      label: t("done.labels.trade"),
      value: isOneOf(data.trade, tradeOptions)
        ? t(`business.trades.${data.trade}`)
        : undefined,
    },
    {
      label: t("done.labels.employees"),
      value: isOneOf(data.employees, employeeOptions)
        ? t(`business.employeeOptions.${data.employees}`)
        : undefined,
    },
    { label: t("done.labels.phone"), value: data.phone },
    { label: t("done.labels.mobile"), value: data.mobile },
    { label: t("done.labels.emergency"), value: data.emergencyPhone },
    { label: t("done.labels.address"), value: address || undefined },
    {
      label: t("done.labels.radius"),
      value: isOneOf(data.serviceRadius, serviceRadiusOptions)
        ? t(`contact.radiusOptions.${data.serviceRadius}`)
        : undefined,
    },
    { label: t("done.labels.website"), value: data.website },
    {
      label: t("done.labels.hours"),
      value: days.length
        ? `${days.join(", ")}${data.start && data.end ? ` · ${data.start} - ${data.end}` : ""}`
        : undefined,
    },
    {
      label: t("done.labels.services"),
      value: services.length ? services.join(", ") : undefined,
    },
  ].filter((r) => r.value);

  return (
    <OnboardingShell current="done" stage={<LivePreview step="done" initial={data} />}>
      <section className="auth-rise flex flex-col pb-10">
        {/* Check that draws itself */}
        <span
          style={i(0)}
          className="flex h-16 w-16 items-center justify-center rounded-full bg-success text-white shadow-[0_18px_40px_-10px_rgba(16,185,129,0.6)]"
        >
          <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="m5 12.5 4.5 4.5L19 7.5" pathLength={1} className="hp-draw" />
          </svg>
        </span>

        <p style={i(1)} className="mt-6 text-[13px] font-semibold text-success">
          {t("done.badge")}
        </p>
        <h1
          style={i(2)}
          className="mt-2 text-balance text-[32px] font-semibold leading-[1.05] tracking-[-0.045em] text-ink sm:text-[44px]"
        >
          {data.businessName ? t("done.title", { name: data.businessName }) : t("done.titleNoName")}
        </h1>
        <p style={i(3)} className="mt-3 text-pretty text-[16px] leading-relaxed text-slate">
          {t("done.subtitle")}
        </p>

        {/* Phones: the message callers will now get */}
        <div style={i(4)} className="mt-6 lg:hidden">
          <LivePreview step="done" initial={data} compact />
        </div>

        {/* Profile completeness */}
        <div style={i(4)} className="mt-8">
          <p className="text-[14px] font-semibold text-ink">{t("done.progress", { percent })}</p>
          <div
            className="mt-2.5 h-[6px] w-full overflow-hidden rounded-full bg-line"
            role="progressbar"
            aria-valuenow={percent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={t("done.progress", { percent })}
          >
            <div className="hp-fill h-full rounded-full bg-primary" style={{ width: `${percent}%` }} />
          </div>
        </div>

        {missing.length > 0 && (
          <div style={i(5)} className="mt-8">
            <p className="text-[13px] font-medium text-slate">{t("done.missingTitle")}</p>
            <ul className="mt-3 flex flex-col gap-2">
              {missing.map((item) => (
                <li key={item.key}>
                  <Link
                    href={`/onboarding/${item.step}`}
                    className="group flex items-center justify-between gap-4 rounded-[16px] border border-dashed border-line px-4 py-3.5 text-[15px] transition-colors hover:border-primary/50 hover:bg-primary-soft/40"
                  >
                    <span className="flex items-center gap-3 font-medium text-graphite">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full border border-line text-muted">
                        <Icon name="plus" size={13} />
                      </span>
                      {t(`done.missing.${item.key}`)}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[13px] font-semibold text-primary">
                      {t("done.add")}
                      <Icon name="arrow-right" size={14} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {rows.length > 0 && (
          <div style={i(6)} className="mt-8 rounded-[22px] border border-line bg-surface p-5">
            <div className="flex items-center justify-between">
              <p className="text-[13px] font-medium text-slate">{t("done.summaryTitle")}</p>
              <Link href="/onboarding/business" className="text-[13px] font-semibold text-primary transition-colors hover:text-primary-dark">
                {t("done.edit")}
              </Link>
            </div>
            <dl className="mt-3 flex flex-col divide-y divide-line">
              {rows.map((r) => (
                <div key={r.label} className="flex items-start justify-between gap-6 py-2.5 text-[14px]">
                  <dt className="shrink-0 text-slate">{r.label}</dt>
                  <dd className="break-words text-right font-medium text-ink">{r.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}

        <div style={i(7)} className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link
            href="/dashboard"
            className="group inline-flex h-[52px] items-center justify-center gap-2 rounded-full bg-ink px-7 text-[15px] font-semibold text-canvas transition-[transform,background-color] duration-200 hover:bg-primary hover:text-white active:scale-[0.97]"
          >
            {t("done.cta")}
            <Icon name="arrow-right" size={17} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
          <Link href="/" className="inline-flex h-[52px] items-center justify-center px-4 text-[14px] font-medium text-slate transition-colors hover:text-ink">
            {t("done.secondary")}
          </Link>
        </div>
      </section>
    </OnboardingShell>
  );
}
