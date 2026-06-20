import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Logo from "@/components/ui/Logo";
import Icon from "@/components/ui/Icon";
import ThemeToggle from "@/components/ui/ThemeToggle";
import LocaleSwitcher from "@/components/ui/LocaleSwitcher";
import PasswordInput from "@/components/ui/PasswordInput";
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

/** Google "G" — brand colours, locale-independent. */
function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38Z"
      />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M16.37 12.78c.03 3.27 2.86 4.35 2.9 4.37-.02.07-.45 1.55-1.49 3.07-.9 1.32-1.83 2.62-3.3 2.65-1.44.03-1.9-.85-3.55-.85-1.64 0-2.16.82-3.52.88-1.42.05-2.5-1.43-3.41-2.74-1.86-2.69-3.28-7.6-1.37-10.92.95-1.64 2.64-2.68 4.48-2.71 1.39-.03 2.7.94 3.55.94.85 0 2.44-1.16 4.11-.99.7.03 2.66.28 3.92 2.13-.1.06-2.34 1.37-2.31 4.09M13.78 3.84c.75-.91 1.26-2.18 1.12-3.44-1.08.04-2.39.72-3.17 1.63-.7.8-1.31 2.09-1.15 3.32 1.21.09 2.45-.61 3.2-1.51" />
    </svg>
  );
}

const socialButton =
  "inline-flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-line bg-surface text-[15px] font-semibold text-ink shadow-[var(--shadow-subtle)] transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-[var(--shadow-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2";

export default async function LoginPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const { error, email } = await searchParams;
  const t = await getTranslations("login");
  const bullets = t.raw("brand.bullets") as string[];
  const errorKey = error === "required" || error === "invalid" ? error : null;

  return (
    <main className="min-h-svh lg:grid lg:grid-cols-[1.05fr_1fr]">
      {/* ── Brand panel (desktop only) ───────────────────────────── */}
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-primary via-indigo to-violet p-10 text-white lg:flex xl:p-14">
        {/* decorative layers */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.6) 1px, transparent 0)",
            backgroundSize: "26px 26px",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-white/10 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-24 -left-16 h-80 w-80 rounded-full bg-violet/30 blur-3xl"
        />

        {/* top: logo + back link */}
        <div className="relative flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <Logo />
            <span className="text-xl font-bold tracking-tight">HandyPlan</span>
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-white/80 ring-1 ring-inset ring-white/20 transition-colors hover:bg-white/10 hover:text-white"
          >
            <Icon name="arrow-left" size={16} />
            {t("backHome")}
          </Link>
        </div>

        {/* middle: headline + bullets */}
        <div className="relative max-w-md">
          <h2 className="text-balance text-4xl font-extrabold leading-[1.1] xl:text-5xl">
            {t("brand.heading")}
          </h2>
          <p className="mt-5 text-pretty text-lg text-white/85">
            {t("brand.subtitle")}
          </p>
          <ul className="mt-8 flex flex-col gap-4">
            {bullets.map((b) => (
              <li key={b} className="flex items-center gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/15 ring-1 ring-inset ring-white/20">
                  <Icon name="check" size={14} />
                </span>
                <span className="font-medium text-white/90">{b}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* bottom: testimonial */}
        <figure className="relative rounded-2xl bg-white/10 p-6 ring-1 ring-inset ring-white/15 backdrop-blur-sm">
          <div className="flex gap-0.5 text-white">
            {Array.from({ length: 5 }).map((_, i) => (
              <Icon key={i} name="star" size={16} filled />
            ))}
          </div>
          <blockquote className="mt-3 text-pretty leading-relaxed text-white/90">
            “{t("brand.quote")}”
          </blockquote>
          <figcaption className="mt-4 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-sm font-bold ring-1 ring-inset ring-white/20">
              AS
            </span>
            <div className="text-sm">
              <p className="font-bold">{t("brand.author")}</p>
              <p className="text-white/70">{t("brand.role")}</p>
            </div>
          </figcaption>
        </figure>
      </aside>

      {/* ── Form panel ───────────────────────────────────────────── */}
      <div className="relative flex min-h-svh flex-col bg-canvas">
        <header className="flex items-center justify-between p-6">
          <Link href="/" className="flex items-center gap-2.5 lg:hidden">
            <Logo />
            <span className="text-xl font-bold tracking-tight text-ink">
              HandyPlan
            </span>
          </Link>
          <div className="ml-auto flex items-center gap-2">
            <LocaleSwitcher />
            <ThemeToggle />
          </div>
        </header>

        <div className="flex flex-1 items-center justify-center px-6 pb-12">
          <div className="w-full max-w-md">
            <h1 className="text-3xl font-extrabold tracking-tight text-ink">
              {t("title")}
            </h1>
            <p className="mt-2 text-slate">{t("subtitle")}</p>

            {/* Social sign-in */}
            <div className="mt-8 flex flex-col gap-3">
              <button type="button" className={socialButton}>
                <GoogleIcon />
                {t("continueWith", { provider: "Google" })}
              </button>
              <button type="button" className={socialButton}>
                <AppleIcon />
                {t("continueWith", { provider: "Apple" })}
              </button>
            </div>

            {/* Divider */}
            <div className="my-6 flex items-center gap-4">
              <span className="h-px flex-1 bg-line" />
              <span className="text-xs font-medium uppercase tracking-wide text-muted">
                {t("or")}
              </span>
              <span className="h-px flex-1 bg-line" />
            </div>

            {errorKey && (
              <div
                role="alert"
                className="mb-5 flex items-start gap-2.5 rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm font-medium text-danger"
              >
                <Icon name="close" size={16} className="mt-0.5 shrink-0" />
                {t(`errors.${errorKey}`)}
              </div>
            )}

            <form action={login} className="flex flex-col gap-5">
              <input type="hidden" name="locale" value={locale} />

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="email"
                  className="text-sm font-semibold text-graphite"
                >
                  {t("email")}
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted">
                    <Icon name="mail" size={18} />
                  </span>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    autoComplete="email"
                    required
                    defaultValue={email ?? ""}
                    placeholder={t("emailPlaceholder")}
                    className="h-12 w-full rounded-xl border border-line bg-surface pl-11 pr-4 text-[15px] text-ink shadow-[var(--shadow-subtle)] transition-colors placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="text-sm font-semibold text-graphite"
                  >
                    {t("password")}
                  </label>
                  <Link
                    href="/login"
                    className="text-sm font-medium text-primary transition-colors hover:text-primary-dark"
                  >
                    {t("forgot")}
                  </Link>
                </div>
                <PasswordInput placeholder={t("passwordPlaceholder")} />
              </div>

              {/* Remember me */}
              <label className="flex w-fit cursor-pointer items-center gap-2.5 text-sm text-graphite">
                <input
                  type="checkbox"
                  name="remember"
                  className="h-4 w-4 rounded border-line text-primary accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                />
                {t("remember")}
              </label>

              <button
                type="submit"
                className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-primary to-indigo px-6 text-[15px] font-semibold text-white shadow-[0_4px_14px_rgba(99,102,241,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-glow)] hover:brightness-[1.05] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                {t("submit")}
                <Icon
                  name="arrow-right"
                  size={18}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </button>
            </form>

            <p className="mt-7 text-center text-sm text-slate">
              {t("noAccount")}{" "}
              <Link
                href="/signup"
                className="font-semibold text-primary transition-colors hover:text-primary-dark"
              >
                {t("signUp")}
              </Link>
            </p>

            <p className="mt-8 flex items-center justify-center gap-2 text-xs text-muted">
              <Icon name="shield" size={14} />
              {t("secure")}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
