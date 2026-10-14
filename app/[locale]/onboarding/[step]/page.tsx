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
import LivePreview from "@/components/onboarding/LivePreview";
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

const FORM_ID = "onboarding-form";

const fieldInput =
  "peer h-[52px] w-full rounded-[14px] border border-line bg-surface px-4 text-[16px] text-ink transition-[border-color,box-shadow] duration-200 placeholder:text-muted hover:border-ink/20 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15";

/** Same input with room for a leading icon (see <IconInput>). */
const iconInput = `${fieldInput} pl-11`;

const chip =
  "relative flex h-11 cursor-pointer select-none items-center justify-center gap-1.5 rounded-full border border-line bg-surface px-4 text-[14px] font-medium text-graphite transition-[background-color,border-color,color,transform] duration-200 hover:border-ink/25 active:scale-[0.96] has-[:checked]:border-ink has-[:checked]:bg-ink has-[:checked]:text-canvas has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-primary/20";

/** `--i` drives the staggered entrance (see .auth-rise in globals.css). */
const i = (n: number) => ({ ["--i" as string]: n }) as React.CSSProperties;

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
      stage={<LivePreview step={current} formId={FORM_ID} initial={data} />}
      note={{ title: t("aside.whyTitle"), body: t(`aside.why.${current}`) }}
    >
      <section className="auth-rise flex flex-1 flex-col">
        <span
          style={i(1)}
          className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-soft text-primary"
        >
          <Icon name={icon} size={22} />
        </span>
        <h1
          style={i(2)}
          className="mt-5 text-balance text-[32px] font-semibold leading-[1.05] tracking-[-0.045em] text-ink sm:text-[40px]"
        >
          {t(`${current}.title`)}
        </h1>
        <p style={i(3)} className="mt-3 text-pretty text-[16px] leading-relaxed text-slate">
          {t(`${current}.subtitle`)}
        </p>
        <p style={i(3)} className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-medium text-slate">
          <Icon name="check" size={13} className="text-success" />
          {t("laterNote")}
        </p>

        {/* Phones: the live preview sits above the fields */}
        <div style={i(4)} className="mt-6 lg:hidden">
          <LivePreview step={current} formId={FORM_ID} initial={data} compact />
        </div>

        {error && (
          <div
            role="alert"
            style={i(4)}
            className="mt-6 flex items-start gap-2.5 rounded-[14px] border border-danger/25 bg-danger/8 px-4 py-3 text-sm font-medium text-danger"
          >
            <Icon name="alert" size={16} className="mt-0.5 shrink-0" />
            {t(`errors.${current}`)}
          </div>
        )}

        <form id={FORM_ID} action={action} style={i(5)} className="mt-8 flex flex-1 flex-col">
          <input type="hidden" name="locale" value={locale} />
          <input type="hidden" name="step" value={current} />

          {current === "business" && <BusinessFields data={data} />}
          {current === "contact" && <ContactFields data={data} />}
          {current === "hours" && <HoursFields data={data} />}

          {/* Action bar: pinned to the bottom of the scroll area */}
          <div className="sticky bottom-0 z-10 -mx-5 mt-auto border-t border-line bg-canvas/85 px-5 py-4 backdrop-blur-xl md:-mx-8 md:px-8">
            <div className="flex items-center gap-2">
              {index > 0 && (
                <Link
                  href={`/onboarding/${onboardingSteps[index - 1]}`}
                  aria-label={t("back")}
                  className="inline-flex h-12 items-center justify-center gap-1.5 rounded-full border border-line px-4 text-[14px] font-medium text-graphite transition-colors hover:border-ink/25 hover:text-ink"
                >
                  <Icon name="arrow-left" size={16} />
                  <span className="hidden sm:inline">{t("back")}</span>
                </Link>
              )}
              <button
                type="submit"
                formAction={skipStep}
                formNoValidate
                className="ml-auto inline-flex h-12 items-center justify-center whitespace-nowrap rounded-full px-4 text-[14px] font-medium text-slate transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                {t("skipStep")}
              </button>
              <button
                type="submit"
                className="group inline-flex h-12 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-ink px-6 text-[15px] font-semibold text-canvas transition-[transform,background-color] duration-200 hover:bg-primary hover:text-white active:scale-[0.97] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/30"
              >
                {last ? t("finish") : t("continue")}
                <Icon name="arrow-right" size={17} className="transition-transform duration-300 group-hover:translate-x-1" />
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
    <div className="flex flex-col gap-2">
      <label htmlFor={htmlFor} className="flex items-center gap-2 text-[13px] font-medium text-graphite">
        {label}
        {hint && <span className="text-[12px] font-normal text-muted">{hint}</span>}
      </label>
      {children}
      {description && <p className="text-[12px] leading-relaxed text-slate">{description}</p>}
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
  grid = false,
}: {
  /** Equal-width 7-column grid (weekdays) instead of wrapping pills. */
  grid?: boolean;
  legend: string;
  hint?: string;
  name: string;
  type: "radio" | "checkbox";
  options: { value: string; label: string }[];
  isChecked: (value: string) => boolean;
}) {
  return (
    <fieldset>
      <legend className="mb-3 flex items-center gap-2 text-[13px] font-medium text-graphite">
        {legend}
        {hint && <span className="text-[12px] font-normal text-muted">{hint}</span>}
      </legend>
      <div className={grid ? "grid grid-cols-7 gap-1.5" : "flex flex-wrap gap-2"}>
        {options.map((option) => (
          <label key={option.value} className={grid ? chip.replace("rounded-full", "rounded-[12px]").replace("px-4", "px-0") : chip}>
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

/** Input with a leading icon that turns brand-blue on focus. */
function IconInput({ icon, ...props }: { icon: IconName } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="relative">
      <input {...props} className={iconInput} />
      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted transition-colors duration-200 peer-focus:text-primary">
        <Icon name={icon} size={18} />
      </span>
    </div>
  );
}

/* ── Step 1: business ────────────────────────────────────────── */

async function BusinessFields({ data }: { data: OnboardingData }) {
  const t = await getTranslations("onboarding");
  return (
    <div className="flex flex-col gap-6 pb-10">
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
        <div className="relative">
        <select
          id="trade"
          name="trade"
          defaultValue={data.trade ?? ""}
          className={`${fieldInput} cursor-pointer appearance-none pr-11`}
        >
          <option value="">{t("business.tradePlaceholder")}</option>
          {tradeOptions.map((key) => (
            <option key={key} value={key}>
              {t(`business.trades.${key}`)}
            </option>
          ))}
        </select>
          <Icon
            name="chevron-down"
            size={18}
            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted"
          />
        </div>
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
    <div className="flex flex-col gap-6 pb-10">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label={t("contact.phone")}
          hint={optional}
          description={t("contact.phoneHint")}
          htmlFor="phone"
        >
          <IconInput icon="phone"
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            maxLength={30}
            defaultValue={data.phone ?? ""}
            placeholder={t("contact.phonePlaceholder")}
            
          />
        </Field>
        <Field
          label={t("contact.mobile")}
          hint={optional}
          description={t("contact.mobileHint")}
          htmlFor="mobile"
        >
          <IconInput icon="mobile"
            id="mobile"
            name="mobile"
            type="tel"
            maxLength={30}
            defaultValue={data.mobile ?? ""}
            placeholder={t("contact.mobilePlaceholder")}
            
          />
        </Field>
      </div>

      <Field
        label={t("contact.emergency")}
        hint={optional}
        description={t("contact.emergencyHint")}
        htmlFor="emergencyPhone"
      >
        <IconInput icon="alert"
          id="emergencyPhone"
          name="emergencyPhone"
          type="tel"
          maxLength={30}
          defaultValue={data.emergencyPhone ?? ""}
          placeholder={t("contact.emergencyPlaceholder")}
          
        />
      </Field>

      <fieldset>
        <legend className="mb-2 flex items-center gap-2 text-[13px] font-medium text-graphite">
          {t("contact.address")}
          <span className="text-[12px] font-normal text-muted">{optional}</span>
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
    <div className="flex flex-col gap-6 pb-10">
      <ChipGroup
        legend={t("hours.days")}
        name="days"
        type="checkbox"
        grid
        options={weekdays.map((day) => ({
          value: day,
          label: t(`hours.dayNames.${day}`),
        }))}
        isChecked={(day) => (data.days ?? WEEKDAYS_DEFAULT).includes(day)}
      />

      <fieldset>
        <legend className="mb-2 text-[13px] font-medium text-graphite">{t("hours.hours")}</legend>
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
