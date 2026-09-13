"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import type { DashboardNavGroup, DashboardRole } from "@/lib/content";
import { cn } from "@/lib/cn";
import Sidebar, { type DashboardUser } from "./Sidebar";
import DashboardHeader from "./DashboardHeader";

const COLLAPSE_COOKIE = "hp_sidebar";

type Props = {
  role: DashboardRole;
  groups: DashboardNavGroup[];
  user: DashboardUser;
  /** Read server-side from the cookie, so the rail renders at the right width. */
  initialCollapsed: boolean;
  children: React.ReactNode;
};

/**
 * App frame for both dashboards (business and customer): a collapsible
 * desktop sidebar, an off-canvas drawer on mobile, and a sticky header.
 * The role only changes which navigation groups are passed in.
 */
export default function DashboardShell({
  role,
  groups,
  user,
  initialCollapsed,
  children,
}: Props) {
  const t = useTranslations("dashboard");
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(initialCollapsed);
  const [mobileOpen, setMobileOpen] = useState(false);

  const active = groups
    .flatMap((group) => group.items)
    .find((item) =>
      item.href === "/dashboard"
        ? pathname === "/dashboard"
        : pathname === item.href || pathname.startsWith(`${item.href}/`),
    );

  // While the drawer is open: lock page scroll, close on Escape.
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [mobileOpen]);

  const toggleCollapsed = () => {
    const next = !collapsed;
    setCollapsed(next);
    document.cookie = `${COLLAPSE_COOKIE}=${next ? "collapsed" : "expanded"}; path=/; max-age=31536000; samesite=lax`;
  };
  const closeMobile = () => setMobileOpen(false);

  return (
    <div className="min-h-svh bg-canvas">
      {/* Desktop rail */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 hidden border-r border-line bg-surface transition-[width] duration-300 ease-[var(--ease-out-expo)] lg:block",
          collapsed ? "w-[76px]" : "w-[264px]",
        )}
      >
        <Sidebar
          role={role}
          groups={groups}
          activeKey={active?.key}
          collapsed={collapsed}
          onToggleCollapse={toggleCollapsed}
        />
      </aside>

      {/* Mobile drawer */}
      <div className={cn("fixed inset-0 z-50 lg:hidden", !mobileOpen && "pointer-events-none")}>
        <div
          aria-hidden
          onClick={closeMobile}
          className={cn(
            "absolute inset-0 bg-navy/50 backdrop-blur-sm transition-opacity duration-300",
            mobileOpen ? "opacity-100" : "opacity-0",
          )}
        />
        <aside
          inert={!mobileOpen}
          className={cn(
            "absolute inset-y-0 left-0 w-[280px] max-w-[85vw] bg-surface shadow-[var(--shadow-float)] transition-transform duration-300 ease-[var(--ease-out-expo)]",
            mobileOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <Sidebar
            role={role}
            groups={groups}
            activeKey={active?.key}
            onNavigate={closeMobile}
            onClose={closeMobile}
          />
        </aside>
      </div>

      {/* Content */}
      <div
        className={cn(
          "flex min-h-svh flex-col transition-[padding] duration-300 ease-[var(--ease-out-expo)]",
          collapsed ? "lg:pl-[76px]" : "lg:pl-[264px]",
        )}
      >
        <DashboardHeader
          role={role}
          title={active ? t(`nav.${active.key}`) : t("meta")}
          user={user}
          menuOpen={mobileOpen}
          onOpenMenu={() => setMobileOpen(true)}
        />
        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
