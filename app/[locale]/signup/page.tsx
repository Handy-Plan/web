import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { pageMeta } from "@/lib/site";
import { safeNext } from "@/lib/auth-redirect";
import Icon from "@/components/ui/Icon";
import PasswordInput from "@/components/ui/PasswordInput";
import AuthShell from "@/components/auth/AuthShell";
import SocialButtons from "@/components/auth/SocialButtons";
import { authCheckbox, authIcon, authInput, authLabel, authSubmit } from "@/components/auth/styles";
import { signup } from "./actions";

type PageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ error?: string; name?: string; email?: string; as?: string; next?: string }>;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "signup" });
  return pageMeta({ locale, path: "/signup", title: t("title"), description: t("metaDescription"), shareDescription: t("shareDescription") });
}

/** `--i` drives the staggered entrance (see .auth-rise in globals.css). */
const i = (n: number) => ({ ["--i" as string]: n }) as React.CSSProperties;

export default async function SignupPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const { error, name, email, as, next: nextParam } = await searchParams;
  const next = safeNext(nextParam);
  // From the public directory (or ?as=customer): preselect "looking for a tradesperson".
  const role = as === "customer" || (next && as !== "business") ? "customer" : "business";
  const t = await getTranslations("signup");
  const errorKey =
    error === "required" || error === "invalidEmail" || error === "weakPassword" || error === "terms"
      ? error
      : null;

  return (
    <AuthShell
      brandSide="right"
      backHome={t("backHome")}
      brand={{
        heading: t("brand.heading"),
        subtitle: t("brand.subtitle"),
        bullets: t.raw("brand.bullets") as string[],
        note: t("brand.stat"),
      }}
    >
      <h1 style={i(0)} className="text-[40px] font-semibold leading-[1.05] tracking-[-0.045em] text-ink short:text-[30px] xshort:text-[26px]">
        {t("title")}
      </h1>
      <p style={i(1)} className="mt-2 text-[16px] text-slate short:mt-1">
        {t("subtitle")}
      </p>
      {next && (
        <p style={i(1)} className="mt-4 flex items-start gap-2.5 rounded-[14px] bg-primary/10 px-4 py-3 text-[14px] text-graphite short:mt-3">
          <Icon name="calendar-check" size={16} className="mt-0.5 shrink-0 text-primary" />
          {t("continueNotice")}
        </p>
      )}

      <div style={i(2)} className="mt-9 short:mt-5 xshort:mt-4">
        <SocialButtons label={(provider) => t("continueWith", { provider })} />
      </div>

      <div style={i(3)} className="my-7 flex items-center gap-4 short:my-4 xshort:my-3">
        <span className="h-px flex-1 bg-line" />
        <span className="text-[13px] text-muted">{t("or")}</span>
        <span className="h-px flex-1 bg-line" />
      </div>

      {errorKey && (
        <div
          role="alert"
          style={i(3)}
          className="mb-5 flex items-start gap-2.5 rounded-[14px] border border-danger/25 bg-danger/8 px-4 py-3 text-sm font-medium text-danger"
        >
          <Icon name="alert" size={16} className="mt-0.5 shrink-0" />
          {t(`errors.${errorKey}`)}
        </div>
      )}

      <form action={signup} style={i(4)} className="flex flex-col gap-5 short:gap-3 xshort:gap-2.5">
        <input type="hidden" name="locale" value={locale} />
        {next && <input type="hidden" name="next" value={next} />}

        {/* Account type: decides onboarding (business) vs. customer dashboard */}
        <fieldset className="flex flex-col gap-2 short:gap-1.5">
          <legend className={`${authLabel} mb-2 short:mb-1.5`}>{t("role.label")}</legend>
          <div className="grid grid-cols-2 gap-2.5">
            {(
              [
                { value: "business", icon: "building" },
                { value: "customer", icon: "search" },
              ] as const
            ).map((r) => (
              <label
                key={r.value}
                className="group relative flex cursor-pointer flex-col gap-2 rounded-[16px] border border-line bg-surface p-3.5 transition-[border-color,box-shadow,transform] duration-200 hover:border-ink/25 active:scale-[0.98] has-[:checked]:border-ink has-[:checked]:shadow-[0_0_0_1px_var(--color-ink)] has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-primary/20 short:p-3"
              >
                <input type="radio" name="role" value={r.value} defaultChecked={role === r.value} className="sr-only" />
                <span className="flex items-center justify-between">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-soft text-primary short:h-8 short:w-8">
                    <Icon name={r.icon} size={17} />
                  </span>
                  <span className="flex h-5 w-5 items-center justify-center rounded-full border border-line text-transparent transition-colors group-has-[:checked]:border-ink group-has-[:checked]:bg-ink group-has-[:checked]:text-canvas">
                    <Icon name="check" size={12} />
                  </span>
                </span>
                <span className="text-[14px] font-semibold leading-snug text-ink">{t(`role.${r.value}.title`)}</span>
                <span className="text-[12px] leading-snug text-slate xshort:hidden">{t(`role.${r.value}.body`)}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="flex flex-col gap-2 short:gap-1.5 xshort:gap-1">
          <label htmlFor="name" className={authLabel}>
            {t("name")}
          </label>
          <div className="relative">
            <input
              id="name"
              type="text"
              name="name"
              autoComplete="name"
              required
              defaultValue={name ?? ""}
              placeholder={t("namePlaceholder")}
              className={authInput}
            />
            <span className={authIcon}>
              <Icon name="user" size={18} />
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2 short:gap-1.5 xshort:gap-1">
          <label htmlFor="email" className={authLabel}>
            {t("email")}
          </label>
          <div className="relative">
            <input
              id="email"
              type="email"
              name="email"
              autoComplete="email"
              required
              defaultValue={email ?? ""}
              placeholder={t("emailPlaceholder")}
              className={authInput}
            />
            <span className={authIcon}>
              <Icon name="mail" size={18} />
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2 short:gap-1.5 xshort:gap-1">
          <label htmlFor="password" className={authLabel}>
            {t("password")}
          </label>
          <PasswordInput placeholder={t("passwordPlaceholder")} autoComplete="new-password" minLength={8} />
          <p className="text-[12px] text-muted xshort:-mt-0.5">{t("passwordHint")}</p>
        </div>

        <label className="flex cursor-pointer items-start gap-2.5 text-[14px] leading-snug text-graphite">
          <input type="checkbox" name="terms" required className={`${authCheckbox} mt-0.5`} />
          <span>{t("terms")}</span>
        </label>

        <button type="submit" className={`${authSubmit} mt-1`}>
          {t("submit")}
          <Icon name="arrow-right" size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
        </button>
      </form>

      <p style={i(5)} className="mt-8 short:mt-4 xshort:mt-3 text-center text-[14px] text-slate">
        {t("haveAccount")}{" "}
        <Link href={next ? { pathname: "/login", query: { next } } : "/login"} className="font-semibold text-ink underline decoration-line underline-offset-4 transition-colors hover:text-primary hover:decoration-primary">
          {t("logIn")}
        </Link>
      </p>

      <p style={i(6)} className="mt-10 short:hidden flex items-center justify-center gap-2 text-[12px] text-muted">
        <Icon name="shield" size={14} />
        {t("secure")}
      </p>
    </AuthShell>
  );
}
