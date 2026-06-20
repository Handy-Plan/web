"use client";

import { useLocale, useTranslations } from "next-intl";
import { useTransition } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/cn";

/**
 * Segmented language switcher. Navigates to the same pathname under the chosen
 * locale; next-intl's middleware persists the choice via the NEXT_LOCALE cookie.
 * Scales automatically to any locales listed in `routing.locales`.
 */
export default function LocaleSwitcher({ className }: { className?: string }) {
  const active = useLocale();
  const t = useTranslations("localeSwitcher");
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const select = (locale: string) => {
    if (locale === active) return;
    startTransition(() => {
      router.replace(pathname, { locale });
    });
  };

  return (
    <div
      role="group"
      aria-label={t("label")}
      className={cn(
        "inline-flex items-center rounded-lg border border-line bg-surface-2 p-0.5 text-xs font-semibold",
        isPending && "opacity-60",
        className,
      )}
    >
      {routing.locales.map((locale) => {
        const isActive = locale === active;
        return (
          <button
            key={locale}
            type="button"
            onClick={() => select(locale)}
            aria-pressed={isActive}
            className={cn(
              "rounded-md px-2.5 py-1 uppercase tracking-wide transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
              isActive
                ? "bg-surface text-primary shadow-[var(--shadow-subtle)]"
                : "text-slate hover:text-ink",
            )}
          >
            {locale}
          </button>
        );
      })}
    </div>
  );
}
