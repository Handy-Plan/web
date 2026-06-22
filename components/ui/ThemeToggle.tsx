"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/cn";
import Icon from "./Icon";

/**
 * Light/Dark theme toggle.
 *
 * The active theme lives as a `.dark` class on <html>, applied before paint by
 * the inline script in the root layout. This button flips it and persists the
 * explicit choice in localStorage. The sun/moon glyphs are swapped purely via
 * the `dark:` variant, so there's no hydration mismatch and no flash.
 */
export default function ThemeToggle({ className }: { className?: string }) {
  const t = useTranslations("a11y");

  // System-preference following lives centrally in <ThemeSync>.
  const toggle = () => {
    const isDark = document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={t("toggleTheme")}
      title={t("toggleTheme")}
      className={cn(
        "flex h-11 w-11 items-center justify-center rounded-xl text-graphite transition-colors hover:bg-cloud hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
        className,
      )}
    >
      <Icon name="sun" size={20} className="dark:hidden" />
      <Icon name="moon" size={20} className="hidden dark:block" />
    </button>
  );
}
