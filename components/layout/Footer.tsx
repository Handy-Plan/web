import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { navConfig } from "@/lib/content";
import Container from "@/components/ui/Container";
import Logo from "@/components/ui/Logo";

const headingClass = "text-sm font-semibold uppercase tracking-wide text-white";
const linkClass = "text-sm text-white/60 transition-colors hover:text-white";

export default function Footer() {
  const t = useTranslations("footer");
  const nav = useTranslations("nav");
  const a11y = useTranslations("a11y");
  const legalLinks = t.raw("legalLinks") as string[];

  return (
    <footer className="relative bg-footer text-white">
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"
      />
      <Container className="py-16">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr]">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
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
          </div>

          {/* Page sections */}
          <div>
            <h3 className={headingClass}>{t("explore")}</h3>
            <ul className="mt-4 flex flex-col gap-3">
              {navConfig.links.map((link) => (
                <li key={link.key}>
                  <a href={link.href} className={linkClass}>
                    {nav(link.key)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal (pages not built yet) */}
          <div>
            <h3 className={headingClass}>{t("legal")}</h3>
            <ul className="mt-4 flex flex-col gap-3">
              {legalLinks.map((label) => (
                <li key={label}>
                  <a href="#" className={linkClass}>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
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
