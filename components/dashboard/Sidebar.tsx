"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { DashboardNavGroup, DashboardRole } from "@/lib/content";
import { cn } from "@/lib/cn";
import Icon from "@/components/ui/Icon";
import Logo from "@/components/ui/Logo";
import LocaleSwitcher from "@/components/ui/LocaleSwitcher";

export type DashboardUser = { name: string; subtitle: string; initials: string };

type Props = {
  role: DashboardRole;
  groups: DashboardNavGroup[];
  activeKey?: string;
  /** Icon-only rail (desktop). */
  collapsed?: boolean;
  /** Called after a link is followed (closes the mobile drawer). */
  onNavigate?: () => void;
  /** Shows a close button (mobile drawer). */
  onClose?: () => void;
  /** Shows the collapse toggle (desktop rail). */
  onToggleCollapse?: () => void;
};

/**
 * Sidebar contents, shared by the floating desktop rail and the mobile
 * drawer. Active item is an ink pill (same language as primary buttons);
 * the AI upsell is a small night-blue stage card.
 */
export default function Sidebar({
  role,
  groups,
  activeKey,
  collapsed = false,
  onNavigate,
  onClose,
  onToggleCollapse,
}: Props) {
  const t = useTranslations("dashboard");

  return (
    <div className="flex h-full flex-col">
      {/* Brand */}
      <div className={cn("flex h-[68px] shrink-0 items-center gap-2.5", collapsed ? "justify-center px-2" : "px-5")}>
        <Link href="/dashboard" onClick={onNavigate} className="flex items-center gap-2.5" aria-label="HandyPlan">
          <Logo className="h-9 w-9" />
          {!collapsed && (
            <span className="hp-wordmark text-[18px] font-semibold tracking-[-0.03em] text-ink">HandyPlan</span>
          )}
        </Link>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label={t("sidebar.close")}
            className="ml-auto flex h-10 w-10 items-center justify-center rounded-full text-slate transition-colors hover:bg-ink/5 hover:text-ink"
          >
            <Icon name="close" size={20} />
          </button>
        )}
      </div>

      {/* Navigation + AI card scroll together on short screens */}
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        <nav aria-label={t("nav.label")} className={cn("pb-4 pt-1", collapsed ? "px-2.5" : "px-3")}>
          {groups.map((group) => (
            <div key={group.key} className="mb-5 last:mb-0">
              {collapsed ? (
                <div aria-hidden className="mx-auto mb-2 h-px w-6 bg-line" />
              ) : (
                <p className="mb-1.5 px-3 text-[12px] font-medium text-muted">{t(`groups.${group.key}`)}</p>
              )}
              <ul className="flex flex-col gap-0.5">
                {group.items.map((item) => {
                  const active = item.key === activeKey;
                  const label = t(`nav.${item.key}`);
                  return (
                    <li key={item.key}>
                      <Link
                        href={item.href}
                        onClick={onNavigate}
                        aria-current={active ? "page" : undefined}
                        aria-label={collapsed ? label : undefined}
                        title={collapsed ? label : undefined}
                        className={cn(
                          "group relative flex h-10 items-center gap-3 rounded-[12px] text-[14px] font-medium transition-[background-color,color,transform] duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                          collapsed ? "justify-center" : "px-3",
                          active ? "bg-ink text-canvas" : "text-graphite hover:bg-ink/5 hover:text-ink",
                        )}
                      >
                        <Icon
                          name={item.icon}
                          size={19}
                          className={cn(
                            "shrink-0 transition-colors",
                            active ? "text-canvas" : "text-slate group-hover:text-ink",
                          )}
                        />
                        {!collapsed && <span className="truncate">{label}</span>}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Paid AI features (business only): a small night-blue stage */}
        {role === "business" && !collapsed && (
          <div className="mt-auto px-3 pb-3">
            <Link
              href="/dashboard/ai"
              onClick={onNavigate}
              className="group relative block overflow-hidden rounded-[20px] bg-[#06121f] p-4 text-white transition-transform duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "radial-gradient(90% 70% at 100% 0%, rgba(3,105,161,0.6), transparent 70%), radial-gradient(70% 60% at 0% 100%, rgba(56,189,248,0.18), transparent 70%)",
                }}
              />
              <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-sky-400/15 text-sky-300 ring-1 ring-inset ring-sky-300/25">
                <Icon name="sparkle" size={17} filled />
              </span>
              <span className="relative mt-3 block text-[14px] font-semibold">{t("sidebar.upgradeTitle")}</span>
              <span className="relative mt-1 block text-[12px] leading-relaxed text-white/60">
                {t("sidebar.upgradeBody")}
              </span>
              <span className="relative mt-3 inline-flex items-center gap-1.5 text-[12px] font-semibold text-sky-300">
                {t("sidebar.upgradeCta")}
                <Icon name="arrow-right" size={13} className="transition-transform duration-200 group-hover:translate-x-0.5" />
              </span>
            </Link>
          </div>
        )}
      </div>

      {/* Mobile drawer: language switch (hidden from the cramped header) */}
      {onClose && (
        <div className="shrink-0 border-t border-line px-5 py-3">
          <LocaleSwitcher />
        </div>
      )}

      {/* Collapse toggle (desktop rail only) */}
      {onToggleCollapse && (
        <div className={cn("shrink-0 border-t border-line py-2.5", collapsed ? "px-2.5" : "px-3")}>
          <button
            type="button"
            onClick={onToggleCollapse}
            aria-label={collapsed ? t("sidebar.expand") : t("sidebar.collapse")}
            title={collapsed ? t("sidebar.expand") : undefined}
            className={cn(
              "flex h-10 w-full items-center gap-3 rounded-[12px] text-[14px] font-medium text-slate transition-colors hover:bg-ink/5 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
              collapsed ? "justify-center" : "px-3",
            )}
          >
            <Icon name="panel" size={19} className={cn("shrink-0 transition-transform duration-300", collapsed && "rotate-180")} />
            {!collapsed && <span>{t("sidebar.collapse")}</span>}
          </button>
        </div>
      )}
    </div>
  );
}

export function Avatar({ initials, size = "md" }: { initials: string; size?: "sm" | "md" }) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-primary font-semibold text-white",
        size === "sm" ? "h-8 w-8 text-[12px]" : "h-10 w-10 text-[14px]",
      )}
    >
      {initials || <Icon name="user" size={size === "sm" ? 16 : 18} />}
    </span>
  );
}
