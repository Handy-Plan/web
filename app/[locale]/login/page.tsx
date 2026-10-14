import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Icon from "@/components/ui/Icon";
import PasswordInput from "@/components/ui/PasswordInput";
import AuthShell from "@/components/auth/AuthShell";
import SocialButtons from "@/components/auth/SocialButtons";
import { authCheckbox, authIcon, authInput, authLabel, authSubmit } from "@/components/auth/styles";
import { login } from "./actions";

type PageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ error?: string; email?: string }>;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "nav" });
  return { title: t("login") };
}

/** `--i` drives the staggered entrance (see .auth-rise in globals.css). */
const i = (n: number) => ({ ["--i" as string]: n }) as React.CSSProperties;

export default async function LoginPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const { error, email } = await searchParams;
  const t = await getTranslations("login");
  const errorKey = error === "required" || error === "invalid" ? error : null;

  return (
    <AuthShell
      backHome={t("backHome")}
      brand={{
        heading: t("brand.heading"),
        subtitle: t("brand.subtitle"),
        bullets: t.raw("brand.bullets") as string[],
        note: t("brand.note"),
      }}
    >
      <h1 style={i(0)} className="text-[40px] font-semibold leading-[1.05] tracking-[-0.045em] text-ink short:text-[30px] xshort:text-[26px]">
        {t("title")}
      </h1>
      <p style={i(1)} className="mt-2 text-[16px] text-slate short:mt-1">
        {t("subtitle")}
      </p>

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

      <form action={login} style={i(4)} className="flex flex-col gap-5 short:gap-3 xshort:gap-2.5">
        <input type="hidden" name="locale" value={locale} />

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
          <div className="flex items-center justify-between">
            <label htmlFor="password" className={authLabel}>
              {t("password")}
            </label>
            <Link href="/login" className="text-[13px] font-medium text-primary transition-colors hover:text-primary-dark">
              {t("forgot")}
            </Link>
          </div>
          <PasswordInput placeholder={t("passwordPlaceholder")} />
        </div>

        <label className="flex w-fit cursor-pointer items-center gap-2.5 text-[14px] text-graphite">
          <input type="checkbox" name="remember" className={authCheckbox} />
          {t("remember")}
        </label>

        <button type="submit" className={`${authSubmit} mt-1`}>
          {t("submit")}
          <Icon name="arrow-right" size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
        </button>
      </form>

      <p style={i(5)} className="mt-8 short:mt-4 xshort:mt-3 text-center text-[14px] text-slate">
        {t("noAccount")}{" "}
        <Link href="/signup" className="font-semibold text-ink underline decoration-line underline-offset-4 transition-colors hover:text-primary hover:decoration-primary">
          {t("signUp")}
        </Link>
      </p>

      <p style={i(6)} className="mt-10 short:hidden flex items-center justify-center gap-2 text-[12px] text-muted">
        <Icon name="shield" size={14} />
        {t("secure")}
      </p>
    </AuthShell>
  );
}
