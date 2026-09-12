import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import {
  onboardingSteps,
  tradeOptions,
  employeeOptions,
  serviceRadiusOptions,
  serviceOptions,
  weekdays,
  type OnboardingStep,
} from "@/lib/content";
import { readOnboarding, type OnboardingData } from "@/lib/onboarding";
import Icon, { type IconName } from "@/components/ui/Icon";
import OnboardingShell from "@/components/onboarding/OnboardingShell";
import StepAside from "@/components/onboarding/StepAside";
import { saveBusiness, saveContact, saveHours, skipStep } from "../actions";

type PageProps = {
  params: Promise<{ locale: string; step: string }>;
  searchParams: Promise<{ error?: string }>;
};

const meta: Record<
  OnboardingStep,
  { icon: IconName; action: (fd: FormData) => Promise<void>; last?: boolean }
> = {
  business: { icon: "setup", action: saveBusiness },
  contact: { icon: "phone", action: saveContact },
  hours: { icon: "calendar", action: saveHours, last: true },
};

const WEEKDAYS_DEFAULT = ["mon", "tue", "wed", "thu", "fri"];

const fieldInput =
  "h-12 w-full rounded-xl border border-line bg-surface px-4 text-[15px] text-ink shadow-[var(--shadow-subtle)] transition-colors placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25";

const chip =
  "flex h-11 min-w-12 cursor-pointer items-center justify-center rounded-xl border border-line bg-surface px-4 text-sm font-semibold text-graphite shadow-[var(--shadow-subtle)] transition-all hover:border-primary/40 has-[:checked]:border-primary has-[:checked]:bg-primary has-[:checked]:text-white has-[:checked]:shadow-[0_4px_12px_rgba(3,105,161,0.3)] has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary/40";

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
    <OnboardingShell
      current={index}
      aside={
        <StepAside
          step={current}
          businessName={data.businessName}
          emergencyPhone={data.emergencyPhone}
        />
      }
    >
      <section className="rounded-3xl border border-line bg-surface p-7 shadow-[var(--shadow-soft)] sm:p-9">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-indigo text-white shadow-[0_8px_18px_rgba(3,105,161,0.3)]">
          <Icon name={icon} size={24} />
        </span>
        <h1 className="mt-5 text-2xl font-extrabold tracking-tight text-ink">
          {t(`${current}.title`)}
        </h1>
        <p className="mt-2 text-slate">{t(`${current}.subtitle`)}</p>
        <p className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-slate">
          <Icon name="check" size={13} className="text-success" />
          {t("laterNote")}
        </p>

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
          <input type="hidden" name="step" value={current} />

          {current === "business" && <BusinessFields data={data} />}
          {current === "contact" && <ContactFields data={data} />}
          {current === "hours" && <HoursFields data={data} />}

          <div className="mt-9 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
            {index > 0 ? (
              <Link
                href={`/onboarding/${onboardingSteps[index - 1]}`}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold text-slate transition-colors hover:text-primary"
              >
                <Icon name="arrow-left" size={16} />
                {t("back")}
              </Link>
            ) : (
              <span className="hidden sm:block" />
            )}
            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center">
              <button
                type="submit"
                formAction={skipStep}
                formNoValidate
                className="inline-flex h-12 items-center justify-center rounded-xl px-5 text-sm font-semibold text-slate transition-colors hover:bg-cloud hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                {t("skipStep")}
              </button>
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
          </div>
        </form>
      </section>
    </OnboardingShell>
  );
}

/* ── Building blocks ─────────────────────────────────────────── */

function Field({
  label,
  hint,
  description,
  htmlFor,
  children,
}: {
  label: string;
  /** Short note next to the label, e.g. "optional". */
  hint?: string;
  /** Helper text under the input. */
  description?: string;
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
        {hint && <span className="text-xs font-normal text-slate">({hint})</span>}
      </label>
      {children}
      {description && <p className="text-xs text-slate">{description}</p>}
    </div>
  );
}

function ChipGroup({
  legend,
  hint,
  name,
  type,
  options,
  isChecked,
}: {
  legend: string;
  hint?: string;
  name: string;
  type: "radio" | "checkbox";
  options: { value: string; label: string }[];
  isChecked: (value: string) => boolean;
}) {
  return (
    <fieldset>
      <legend className="mb-2.5 text-sm font-semibold text-graphite">
        {legend}{" "}
        {hint && <span className="text-xs font-normal text-slate">({hint})</span>}
      </legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <label key={option.value} className={chip}>
            <input
              type={type}
              name={name}
              value={option.value}
              defaultChecked={isChecked(option.value)}
              className="sr-only"
            />
            {option.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

/* ── Step 1: business ────────────────────────────────────────── */

async function BusinessFields({ data }: { data: OnboardingData }) {
  const t = await getTranslations("onboarding");
  return (
    <div className="flex flex-col gap-6">
      <Field
        label={t("business.name")}
        description={t("business.nameHint")}
        htmlFor="businessName"
      >
        <input
          id="businessName"
          name="businessName"
          type="text"
          required
          maxLength={80}
          autoComplete="organization"
          defaultValue={data.businessName ?? ""}
          placeholder={t("business.namePlaceholder")}
          className={fieldInput}
        />
      </Field>

      <Field label={t("business.trade")} hint={t("optional")} htmlFor="trade">
        <select
          id="trade"
          name="trade"
          defaultValue={data.trade ?? ""}
          className={`${fieldInput} cursor-pointer`}
        >
          <option value="">{t("business.tradePlaceholder")}</option>
          {tradeOptions.map((key) => (
            <option key={key} value={key}>
              {t(`business.trades.${key}`)}
            </option>
          ))}
        </select>
      </Field>

      <ChipGroup
        legend={t("business.employees")}
        hint={t("optional")}
        name="employees"
        type="radio"
        options={employeeOptions.map((key) => ({
          value: key,
          label: t(`business.employeeOptions.${key}`),
        }))}
        isChecked={(value) => data.employees === value}
      />
    </div>
  );
}

/* ── Step 2: contact & location ──────────────────────────────── */

async function ContactFields({ data }: { data: OnboardingData }) {
  const t = await getTranslations("onboarding");
  const optional = t("optional");
  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label={t("contact.phone")}
          hint={optional}
          description={t("contact.phoneHint")}
          htmlFor="phone"
        >
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            maxLength={30}
            defaultValue={data.phone ?? ""}
            placeholder={t("contact.phonePlaceholder")}
            className={fieldInput}
          />
        </Field>
        <Field
          label={t("contact.mobile")}
          hint={optional}
          description={t("contact.mobileHint")}
          htmlFor="mobile"
        >
          <input
            id="mobile"
            name="mobile"
            type="tel"
            maxLength={30}
            defaultValue={data.mobile ?? ""}
            placeholder={t("contact.mobilePlaceholder")}
            className={fieldInput}
          />
        </Field>
      </div>

      <Field
        label={t("contact.emergency")}
        hint={optional}
        description={t("contact.emergencyHint")}
        htmlFor="emergencyPhone"
      >
        <input
          id="emergencyPhone"
          name="emergencyPhone"
          type="tel"
          maxLength={30}
          defaultValue={data.emergencyPhone ?? ""}
          placeholder={t("contact.emergencyPlaceholder")}
          className={fieldInput}
        />
      </Field>

      <fieldset>
        <legend className="mb-2.5 text-sm font-semibold text-graphite">
          {t("contact.address")}{" "}
          <span className="text-xs font-normal text-slate">({optional})</span>
        </legend>
        <div className="flex flex-col gap-3">
          <input
            name="street"
            type="text"
            aria-label={t("contact.street")}
            autoComplete="street-address"
            maxLength={100}
            defaultValue={data.street ?? ""}
            placeholder={t("contact.streetPlaceholder")}
            className={fieldInput}
          />
          <div className="grid grid-cols-[1fr_2fr] gap-3">
            <input
              name="postcode"
              type="text"
              inputMode="numeric"
              pattern="[0-9]{5}"
              maxLength={5}
              aria-label={t("contact.postcode")}
              autoComplete="postal-code"
              defaultValue={data.postcode ?? ""}
              placeholder={t("contact.postcodePlaceholder")}
              className={fieldInput}
            />
            <input
              name="city"
              type="text"
              aria-label={t("contact.city")}
              autoComplete="address-level2"
              maxLength={60}
              defaultValue={data.city ?? ""}
              placeholder={t("contact.cityPlaceholder")}
              className={fieldInput}
            />
          </div>
        </div>
      </fieldset>

      <ChipGroup
        legend={t("contact.radius")}
        hint={optional}
        name="serviceRadius"
        type="radio"
        options={serviceRadiusOptions.map((key) => ({
          value: key,
          label: t(`contact.radiusOptions.${key}`),
        }))}
        isChecked={(value) => data.serviceRadius === value}
      />

      <Field label={t("contact.website")} hint={optional} htmlFor="website">
        <input
          id="website"
          name="website"
          type="text"
          inputMode="url"
          autoComplete="url"
          maxLength={100}
          defaultValue={data.website ?? ""}
          placeholder={t("contact.websitePlaceholder")}
          className={fieldInput}
        />
      </Field>
    </div>
  );
}

/* ── Step 3: hours & services ────────────────────────────────── */

async function HoursFields({ data }: { data: OnboardingData }) {
  const t = await getTranslations("onboarding");
  return (
    <div className="flex flex-col gap-6">
      <ChipGroup
        legend={t("hours.days")}
        name="days"
        type="checkbox"
        options={weekdays.map((day) => ({
          value: day,
          label: t(`hours.dayNames.${day}`),
        }))}
        isChecked={(day) => (data.days ?? WEEKDAYS_DEFAULT).includes(day)}
      />

      <fieldset>
        <legend className="mb-2.5 text-sm font-semibold text-graphite">
          {t("hours.hours")}
        </legend>
        <div className="grid grid-cols-2 gap-4">
          <Field label={t("hours.from")} htmlFor="start">
            <input
              id="start"
              name="start"
              type="time"
              defaultValue={data.start ?? "07:00"}
              className={`${fieldInput} cursor-pointer`}
            />
          </Field>
          <Field label={t("hours.to")} htmlFor="end">
            <input
              id="end"
              name="end"
              type="time"
              defaultValue={data.end ?? "17:00"}
              className={`${fieldInput} cursor-pointer`}
            />
          </Field>
        </div>
      </fieldset>

      <ChipGroup
        legend={t("hours.services")}
        hint={t("optional")}
        name="services"
        type="checkbox"
        options={serviceOptions.map((key) => ({
          value: key,
          label: t(`hours.options.${key}`),
        }))}
        isChecked={(key) => Boolean(data.services?.includes(key))}
      />

      <Field label={t("hours.customLabel")} hint={t("optional")} htmlFor="customService">
        <input
          id="customService"
          name="customService"
          type="text"
          maxLength={60}
          defaultValue={data.customService ?? ""}
          placeholder={t("hours.customPlaceholder")}
          className={fieldInput}
        />
      </Field>
    </div>
  );
}
