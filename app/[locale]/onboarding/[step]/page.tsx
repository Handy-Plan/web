import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import {
  onboardingSteps,
  tradeOptions,
  serviceOptions,
  weekdays,
  type OnboardingStep,
} from "@/lib/content";
import { readOnboarding, type OnboardingData } from "@/lib/onboarding";
import Icon, { type IconName } from "@/components/ui/Icon";
import OnboardingShell from "@/components/onboarding/OnboardingShell";
import { saveBusiness, saveServices, saveAvailability } from "../actions";

type PageProps = {
  params: Promise<{ locale: string; step: string }>;
  searchParams: Promise<{ error?: string }>;
};

const meta: Record<
  OnboardingStep,
  { icon: IconName; action: (fd: FormData) => Promise<void>; last?: boolean }
> = {
  business: { icon: "setup", action: saveBusiness },
  services: { icon: "widget", action: saveServices },
  availability: { icon: "calendar", action: saveAvailability, last: true },
};

const fieldInput =
  "h-12 w-full rounded-xl border border-line bg-surface px-4 text-[15px] text-ink shadow-[var(--shadow-subtle)] transition-colors placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25";

export function generateStaticParams() {
  return onboardingSteps.map((step) => ({ step }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; step: string }>;
}): Promise<Metadata> {
  const { locale, step } = await params;
  if (!onboardingSteps.includes(step as OnboardingStep)) return {};
  const t = await getTranslations({ locale, namespace: "onboarding" });
  return { title: t(`${step as OnboardingStep}.title`) };
}

export default async function OnboardingStepPage({
  params,
  searchParams,
}: PageProps) {
  const { locale, step } = await params;
  if (!onboardingSteps.includes(step as OnboardingStep)) notFound();
  const current = step as OnboardingStep;
  setRequestLocale(locale);

  const { error } = await searchParams;
  const t = await getTranslations("onboarding");
  const data = await readOnboarding();
  const index = onboardingSteps.indexOf(current);
  const { icon, action, last } = meta[current];

  return (
    <OnboardingShell current={index}>
      <section className="rounded-3xl border border-line bg-surface p-7 shadow-[var(--shadow-soft)] sm:p-9">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-indigo text-white shadow-[0_8px_18px_rgba(3,105,161,0.3)]">
          <Icon name={icon} size={24} />
        </span>
        <h1 className="mt-5 text-2xl font-extrabold tracking-tight text-ink">
          {t(`${current}.title`)}
        </h1>
        <p className="mt-2 text-slate">{t(`${current}.subtitle`)}</p>

        {error && (
          <div
            role="alert"
            className="mt-6 flex items-start gap-2.5 rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm font-medium text-danger"
          >
            <Icon name="close" size={16} className="mt-0.5 shrink-0" />
            {t(`errors.${current}`)}
          </div>
        )}

        <form action={action} className="mt-7">
          <input type="hidden" name="locale" value={locale} />

          {current === "business" && <BusinessFields data={data} />}
          {current === "services" && <ServicesFields data={data} />}
          {current === "availability" && <AvailabilityFields data={data} />}

          <div className="mt-9 flex items-center justify-between gap-4">
            {index > 0 ? (
              <Link
                href={`/onboarding/${onboardingSteps[index - 1]}`}
                className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold text-slate transition-colors hover:text-primary"
              >
                <Icon name="arrow-left" size={16} />
                {t("back")}
              </Link>
            ) : (
              <span />
            )}
            <button
              type="submit"
              className="group inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-primary to-indigo px-7 text-[15px] font-semibold text-white shadow-[0_4px_14px_rgba(3,105,161,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-glow)] hover:brightness-[1.05] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              {last ? t("finish") : t("continue")}
              <Icon
                name="arrow-right"
                size={18}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </button>
          </div>
        </form>
      </section>
    </OnboardingShell>
  );
}

/* ── Step fields (each an async server component) ────────────── */

function Field({
  label,
  hint,
  htmlFor,
  children,
}: {
  label: string;
  hint?: string;
  htmlFor?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={htmlFor}
        className="flex items-center gap-2 text-sm font-semibold text-graphite"
      >
        {label}
        {hint && (
          <span className="text-xs font-normal text-muted">({hint})</span>
        )}
      </label>
      {children}
    </div>
  );
}

async function BusinessFields({ data }: { data: OnboardingData }) {
  const t = await getTranslations("onboarding");
  return (
    <div className="flex flex-col gap-5">
      <Field label={t("business.name")} htmlFor="businessName">
        <input
          id="businessName"
          name="businessName"
          type="text"
          required
          defaultValue={data.businessName ?? ""}
          placeholder={t("business.namePlaceholder")}
          className={fieldInput}
        />
      </Field>

      <Field label={t("business.trade")} htmlFor="trade">
        <select
          id="trade"
          name="trade"
          required
          defaultValue={data.trade ?? ""}
          className={`${fieldInput} cursor-pointer`}
        >
          <option value="" disabled>
            {t("business.tradePlaceholder")}
          </option>
          {tradeOptions.map((key) => (
            <option key={key} value={key}>
              {t(`business.trades.${key}`)}
            </option>
          ))}
        </select>
      </Field>

      <Field
        label={t("business.phone")}
        hint={t("business.phoneOptional")}
        htmlFor="phone"
      >
        <input
          id="phone"
          name="phone"
          type="tel"
          defaultValue={data.phone ?? ""}
          placeholder={t("business.phonePlaceholder")}
          className={fieldInput}
        />
      </Field>
    </div>
  );
}

async function ServicesFields({ data }: { data: OnboardingData }) {
  const t = await getTranslations("onboarding");
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3">
        <span className="text-sm font-semibold text-graphite">
          {t("services.hint")}
        </span>
        <div className="grid gap-3 sm:grid-cols-2">
          {serviceOptions.map((key) => (
            <label
              key={key}
              className="flex cursor-pointer items-center gap-3 rounded-xl border border-line bg-surface px-4 py-3 text-sm font-medium text-graphite shadow-[var(--shadow-subtle)] transition-all hover:border-primary/30 has-[:checked]:border-primary has-[:checked]:bg-primary-soft has-[:checked]:text-primary"
            >
              <input
                type="checkbox"
                name="services"
                value={key}
                defaultChecked={data.services?.includes(key)}
                className="peer sr-only"
              />
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-line text-transparent transition-colors peer-checked:border-primary peer-checked:bg-primary peer-checked:text-white">
                <Icon name="check" size={12} />
              </span>
              {t(`services.options.${key}`)}
            </label>
          ))}
        </div>
      </div>

      <Field label={t("services.customLabel")} htmlFor="customService">
        <input
          id="customService"
          name="customService"
          type="text"
          defaultValue={data.customService ?? ""}
          placeholder={t("services.customPlaceholder")}
          className={fieldInput}
        />
      </Field>
    </div>
  );
}

async function AvailabilityFields({ data }: { data: OnboardingData }) {
  const t = await getTranslations("onboarding");
  const isChecked = (day: string) =>
    data.days
      ? data.days.includes(day)
      : ["mon", "tue", "wed", "thu", "fri"].includes(day);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <span className="text-sm font-semibold text-graphite">
          {t("availability.days")}
        </span>
        <div className="flex flex-wrap gap-2">
          {weekdays.map((day) => (
            <label
              key={day}
              className="flex h-11 min-w-12 cursor-pointer items-center justify-center rounded-xl border border-line bg-surface px-3 text-sm font-semibold text-graphite shadow-[var(--shadow-subtle)] transition-all hover:border-primary/30 has-[:checked]:border-primary has-[:checked]:bg-gradient-to-br has-[:checked]:from-primary has-[:checked]:to-indigo has-[:checked]:text-white"
            >
              <input
                type="checkbox"
                name="days"
                value={day}
                defaultChecked={isChecked(day)}
                className="sr-only"
              />
              {t(`availability.dayNames.${day}`)}
            </label>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <span className="text-sm font-semibold text-graphite">
          {t("availability.hours")}
        </span>
        <div className="grid grid-cols-2 gap-4">
          <Field label={t("availability.from")} htmlFor="start">
            <input
              id="start"
              name="start"
              type="time"
              defaultValue={data.start ?? "08:00"}
              className={`${fieldInput} cursor-pointer`}
            />
          </Field>
          <Field label={t("availability.to")} htmlFor="end">
            <input
              id="end"
              name="end"
              type="time"
              defaultValue={data.end ?? "17:00"}
              className={`${fieldInput} cursor-pointer`}
            />
          </Field>
        </div>
      </div>
    </div>
  );
}
