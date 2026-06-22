"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { navConfig } from "@/lib/content";
import { cn } from "@/lib/cn";
import Icon from "@/components/ui/Icon";
import Logo from "@/components/ui/Logo";
import ThemeToggle from "@/components/ui/ThemeToggle";
import LocaleSwitcher from "@/components/ui/LocaleSwitcher";

export default function Navbar() {
  const t = useTranslations("nav");
  const a11y = useTranslations("a11y");
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-line/80 bg-canvas/80 shadow-[var(--shadow-subtle)] backdrop-blur-xl"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <nav className="mx-auto flex h-20 max-w-[1200px] items-center justify-between px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5" aria-label={a11y("home")}>
          <Logo />
          <span className="text-xl font-bold tracking-tight text-ink">
            HandyPlan
          </span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden items-center gap-9 lg:flex">
          {navConfig.links.map((link) => (
            <li key={link.key}>
              <a
                href={link.href}
                className="relative text-[15px] font-medium text-slate transition-colors after:absolute after:-bottom-1.5 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-300 hover:text-primary hover:after:w-full"
              >
                {t(link.key)}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-2 lg:flex">
          <LocaleSwitcher />
          <ThemeToggle />
          <Link
            href={navConfig.login.href}
            className="px-4 py-2 text-[15px] font-medium text-graphite transition-colors hover:text-primary"
          >
            {t("login")}
          </Link>
          <a
            href={navConfig.cta.href}
            className="inline-flex h-11 items-center rounded-xl bg-gradient-to-br from-primary to-indigo px-6 text-[15px] font-semibold text-white shadow-[0_4px_14px_rgba(3,105,161,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-glow)] hover:brightness-[1.05]"
          >
            {t("cta")}
          </a>
        </div>

        {/* Mobile controls */}
        <div className="-mr-2 flex items-center gap-1 lg:hidden">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex h-11 w-11 items-center justify-center rounded-lg text-ink"
            aria-label={open ? a11y("closeMenu") : a11y("openMenu")}
            aria-expanded={open}
          >
            <Icon name={open ? "close" : "menu"} size={26} />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className={cn(
          "overflow-hidden border-t border-line bg-canvas transition-[max-height,opacity] duration-300 lg:hidden",
          open ? "max-h-[520px] opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <ul className="flex flex-col gap-1 px-6 py-4">
          {navConfig.links.map((link) => (
            <li key={link.key}>
              <a
                href={link.href}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-3.5 text-base font-medium text-graphite transition-colors hover:bg-cloud"
              >
                {t(link.key)}
              </a>
            </li>
          ))}
          <li className="mt-2 flex flex-col gap-2 border-t border-line pt-4">
            <div className="flex items-center justify-between px-1 pb-1">
              <LocaleSwitcher />
            </div>
            <Link
              href={navConfig.login.href}
              onClick={() => setOpen(false)}
              className="rounded-xl border-2 border-line px-4 py-3 text-center font-semibold text-graphite"
            >
              {t("login")}
            </Link>
            <a
              href={navConfig.cta.href}
              onClick={() => setOpen(false)}
              className="rounded-xl bg-gradient-to-br from-primary to-indigo px-4 py-3 text-center font-semibold text-white shadow-[var(--shadow-soft)]"
            >
              {t("cta")}
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
}
