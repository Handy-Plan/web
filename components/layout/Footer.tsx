import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { footerConfig } from "@/lib/content";
import Container from "@/components/ui/Container";
import Logo from "@/components/ui/Logo";

export default function Footer() {
  const t = useTranslations("footer");
  const a11y = useTranslations("a11y");

  return (
    <footer className="relative bg-footer text-white">
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"
      />
      <Container className="py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
          {/* Brand */}
          <div>
            <Link
              href="/"
              className="flex items-center gap-2.5"
              aria-label={a11y("home")}
            >
              <Logo />
              <span className="text-xl font-bold">HandyPlan</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/60">
              {t("tagline")}
            </p>
            <ul className="mt-6 flex gap-3">
              {footerConfig.socials.map((s) => (
                <li key={s}>
                  <a
                    href="#"
                    aria-label={s}
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-xs font-semibold text-white/70 transition-colors hover:bg-primary hover:text-white"
                  >
                    {s.slice(0, 2)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Link columns */}
          {footerConfig.columns.map((col) => {
            const links = t.raw(`columns.${col}.links`) as string[];
            return (
              <div key={col}>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-white">
                  {t(`columns.${col}.title`)}
                </h3>
                <ul className="mt-4 flex flex-col gap-3">
                  {links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-sm text-white/60 transition-colors hover:text-white"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-sm text-white/50">
            {t("rights", { year: String(new Date().getFullYear()) })}
          </p>
          <p className="text-sm text-white/50">{t("madeWith")}</p>
        </div>
      </Container>
    </footer>
  );
}
