"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { DashboardNavGroup, DashboardRole } from "@/lib/content";
import { cn } from "@/lib/cn";
import Icon from "@/components/ui/Icon";
import Logo from "@/components/ui/Logo";

export type DashboardUser = { name: string; subtitle: string; initials: string };

const DOTS_ON_BLUE = {
  backgroundImage:
    "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.6) 1px, transparent 0)",
  backgroundSize: "20px 20px",
};

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

/** Sidebar contents, shared by the desktop rail and the mobile drawer. */
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
      <div
        className={cn(
          "flex h-16 shrink-0 items-center gap-2.5 border-b border-line",
          collapsed ? "justify-center px-2" : "px-5",
        )}
      >
        <Link
          href="/dashboard"
          onClick={onNavigate}
          className="flex items-center gap-2.5"
          aria-label="HandyPlan"
        >
          <Logo />
          {!collapsed && (
            <span className="hp-wordmark text-lg font-bold tracking-tight text-ink">HandyPlan</span>
          )}
        </Link>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label={t("sidebar.close")}
            className="ml-auto flex h-9 w-9 items-center justify-center rounded-lg text-slate transition-colors hover:bg-cloud hover:text-ink"
          >
            <Icon name="close" size={20} />
          </button>
        )}
      </div>

      {/* Navigation + AI card scroll together on short screens */}
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
      <nav
        aria-label={t("nav.label")}
        className={cn("py-4", collapsed ? "px-2" : "px-3")}
      >
        {groups.map((group) => (
          <div key={group.key} className="mb-5 last:mb-0">
            {collapsed ? (
              <div aria-hidden className="mx-auto mb-2 h-px w-8 bg-line" />
            ) : (
              <p className="mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate">
                {t(`groups.${group.key}`)}
              </p>
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
                        "group relative flex h-10 items-center gap-3 rounded-xl text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                        collapsed ? "justify-center" : "px-3",
                        active
                          ? "bg-primary-soft text-primary"
                          : "text-graphite hover:bg-cloud hover:text-ink",
                      )}
                    >
                      {active && !collapsed && (
                        <span
                          aria-hidden
                          className="absolute -left-3 bottom-2 top-2 w-1 rounded-r-full bg-primary"
                        />
                      )}
                      <Icon
                        name={item.icon}
                        size={20}
                        className={cn(
                          "shrink-0 transition-colors",
                          active ? "text-primary" : "text-slate group-hover:text-ink",
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

      {/* Paid AI features (business only) */}
      {role === "business" && !collapsed && (
        <div className="mt-auto px-3 pb-3">
          <Link
            href="/dashboard/ai"
            onClick={onNavigate}
            title={t("sidebar.upgradeBody")}
            className="group relative flex items-center gap-3 overflow-hidden rounded-xl bg-gradient-to-br from-primary via-indigo to-violet px-3 py-2.5 text-white transition-shadow duration-200 hover:shadow-[var(--shadow-glow)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-25"
              style={DOTS_ON_BLUE}
            />
            <span className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/15 ring-1 ring-inset ring-white/25">
              <Icon name="sparkle" size={16} filled />
            </span>
            <span className="relative min-w-0 flex-1">
              <span className="block truncate text-sm font-semibold">
                {t("sidebar.upgradeTitle")}
              </span>
              <span className="block truncate text-xs text-white/80">
                {t("sidebar.upgradeCta")}
              </span>
            </span>
            <Icon
              name="arrow-right"
              size={16}
              className="relative shrink-0 transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </Link>
        </div>
      )}
      </div>

      {/* Collapse toggle (desktop rail only) */}
      {onToggleCollapse && (
        <div className={cn("shrink-0 border-t border-line py-3", collapsed ? "px-2" : "px-3")}>
          <button
            type="button"
            onClick={onToggleCollapse}
            aria-label={collapsed ? t("sidebar.expand") : t("sidebar.collapse")}
            title={collapsed ? t("sidebar.expand") : undefined}
            className={cn(
              "flex h-10 w-full items-center gap-3 rounded-xl text-sm font-medium text-slate transition-colors hover:bg-cloud hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
              collapsed ? "justify-center" : "px-3",
            )}
          >
            <Icon name="panel" size={20} className="shrink-0" />
            {!collapsed && <span>{t("sidebar.collapse")}</span>}
          </button>
        </div>
      )}
    </div>
  );
}

export function Avatar({
  initials,
  size = "md",
}: {
  initials: string;
  size?: "sm" | "md";
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-indigo font-bold text-white",
        size === "sm" ? "h-8 w-8 text-xs" : "h-9 w-9 text-sm",
      )}
    >
      {initials || <Icon name="user" size={size === "sm" ? 16 : 18} />}
    </span>
  );
}
