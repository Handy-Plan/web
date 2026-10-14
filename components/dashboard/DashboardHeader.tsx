"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { DashboardRole } from "@/lib/content";
import { cn } from "@/lib/cn";
import Icon from "@/components/ui/Icon";
import ThemeToggle from "@/components/ui/ThemeToggle";
import LocaleSwitcher from "@/components/ui/LocaleSwitcher";
import { Avatar, type DashboardUser } from "./Sidebar";

type Props = {
  role: DashboardRole;
  title: string;
  user: DashboardUser;
  menuOpen: boolean;
  onOpenMenu: () => void;
};

export default function DashboardHeader({ role, title, user, menuOpen, onOpenMenu }: Props) {
  const t = useTranslations("dashboard");

  return (
    <header className="sticky top-0 z-30 px-3 pt-3 sm:px-4 lg:px-5">
      <div className="glass mx-auto flex h-16 w-full max-w-[1240px] items-center gap-2 rounded-[20px] pl-3 pr-2 sm:gap-3 sm:pl-5">
        <button
          type="button"
          onClick={onOpenMenu}
          aria-label={t("sidebar.open")}
          aria-expanded={menuOpen}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-ink transition-colors hover:bg-ink/5 lg:hidden"
        >
          <Icon name="menu" size={22} />
        </button>

        <p key={title} className="hp-pop min-w-0 truncate text-[17px] font-semibold tracking-[-0.02em] text-ink">{title}</p>
        {/* Everything shown comes from lib/mock until the backend exists. */}
        <span
          title={t("header.sampleHint")}
          className="hidden shrink-0 items-center gap-1 rounded-full bg-warning/15 px-2.5 py-1 text-[12px] font-medium text-graphite sm:inline-flex"
        >
          <Icon name="alert" size={12} className="text-warning" />
          {t("header.sample")}
        </span>

        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          <div className="relative hidden md:block">
            <input
              type="search"
              aria-label={t("header.search")}
              placeholder={t("header.search")}
              className="peer h-10 w-56 rounded-full border border-line bg-surface pl-10 pr-4 text-[14px] text-ink transition-[border-color,box-shadow,width] duration-300 ease-[var(--ease-out-expo)] placeholder:text-muted focus:w-80 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15 lg:w-64"
            />
            <Icon
              name="search"
              size={16}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted transition-colors peer-focus:text-primary"
            />
          </div>
          {/* Phones: the language switch lives in the drawer instead */}
          <div className="hidden sm:block">
            <LocaleSwitcher />
          </div>
          <ThemeToggle className="h-10 w-10" />
          <button
            type="button"
            aria-label={t("header.notifications")}
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-graphite transition-colors hover:bg-ink/5 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <Icon name="bell" size={20} />
          </button>
          <UserMenu role={role} user={user} />
        </div>
      </div>
    </header>
  );
}

function UserMenu({ role, user }: { role: DashboardRole; user: DashboardUser }) {
  const t = useTranslations("dashboard.header");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click or Escape.
  useEffect(() => {
    if (!open) return;
    const onPointer = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const close = () => setOpen(false);
  const itemClass =
    "flex w-full items-center gap-2.5 rounded-[12px] px-3 py-2.5 text-[14px] font-medium text-graphite transition-colors hover:bg-ink/5 hover:text-ink";

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={t("userMenu")}
        className="flex items-center gap-1.5 rounded-full p-1 transition-colors hover:bg-ink/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:pr-2"
      >
        <Avatar initials={user.initials} size="sm" />
        <Icon
          name="chevron-down"
          size={16}
          className={cn("hidden text-slate transition-transform duration-200 sm:block", open && "rotate-180")}
        />
      </button>

      {open && (
        <div
          role="menu"
          className="hp-pop absolute right-0 mt-3 w-64 origin-top-right overflow-hidden rounded-[20px] border border-line bg-surface shadow-[var(--shadow-float)]"
        >
          <div className="flex items-center gap-3 border-b border-line px-4 py-3">
            <Avatar initials={user.initials} />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-ink">{user.name}</p>
              <p className="truncate text-xs text-slate">{user.subtitle}</p>
            </div>
          </div>
          <div className="p-1.5">
            {role === "business" && (
              <Link role="menuitem" href="/dashboard/profile" onClick={close} className={itemClass}>
                <Icon name="building" size={17} className="text-slate" />
                {t("profile")}
              </Link>
            )}
            <Link role="menuitem" href="/dashboard/settings" onClick={close} className={itemClass}>
              <Icon name="gear" size={17} className="text-slate" />
              {t("settings")}
            </Link>
          </div>
          <div className="border-t border-line p-1.5">
            <Link
              role="menuitem"
              href="/login"
              onClick={close}
              className={cn(itemClass, "text-danger hover:bg-danger/10 hover:text-danger")}
            >
              <Icon name="logout" size={17} />
              {t("logout")}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
