"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Pro } from "@/lib/mock/dashboard";
import { cn } from "@/lib/cn";
import { useIsClient } from "@/lib/useIsClient";
import Icon from "@/components/ui/Icon";
import { Initials, btnIcon, btnPrimary, btnSecondary } from "@/components/dashboard/kit";

export type PromptIntent = { kind: "book" | "contact"; pro: Pro; slotIndex?: number };

/**
 * "Sign up or log in to continue". Booking and contacting need an account, so
 * the directory asks here and then redirects to signup/login with a `next`
 * path that brings the person straight back to this tradesperson (and slot)
 * in their dashboard. Desktop: centred dialog; phones: bottom sheet.
 */
export default function AuthPrompt({
  intent,
  open,
  onClose,
}: {
  /** Kept after closing so the content stays put during the exit animation. */
  intent?: PromptIntent;
  open: boolean;
  onClose: () => void;
}) {
  const t = useTranslations("directory.prompt");
  const isClient = useIsClient();
  const primary = useRef<HTMLAnchorElement>(null);

  // Focus the main action, Escape closes, page scroll locked, focus returns.
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    primary.current?.focus({ preventScroll: true });
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      previous?.focus?.({ preventScroll: true });
    };
  }, [open, onClose]);

  if (!isClient) return null;

  const pro = intent?.pro;
  const slot = intent?.slotIndex !== undefined ? pro?.slots[intent.slotIndex] : undefined;
  const next = pro
    ? `/dashboard/find?pro=${pro.id}${intent?.slotIndex !== undefined ? `&slot=${intent.slotIndex}` : ""}`
    : "/dashboard/find";

  return createPortal(
    <div className={cn("fixed inset-0 z-[60] flex items-end justify-center sm:items-center sm:p-6", !open && "pointer-events-none")} aria-hidden={!open}>
      <div
        onClick={onClose}
        className={cn("absolute inset-0 bg-[#06121f]/55 backdrop-blur-[3px] transition-opacity duration-300", open ? "opacity-100" : "opacity-0")}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-prompt-title"
        inert={!open}
        className={cn(
          "relative w-full max-w-[440px] rounded-t-[28px] bg-surface p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] shadow-[var(--shadow-float)] transition-[transform,opacity] ease-[var(--ease-out-expo)] sm:rounded-[28px] sm:p-7",
          open ? "translate-y-0 opacity-100 duration-500 sm:scale-100" : "translate-y-full opacity-0 duration-300 sm:translate-y-4 sm:scale-95",
        )}
      >
        <button type="button" onClick={onClose} aria-label={t("close")} className={cn(btnIcon, "absolute right-3 top-3")}>
          <Icon name="close" size={20} />
        </button>

        {pro && (
          <>
            <div className="flex items-center gap-3 pr-10">
              <Initials text={pro.initials} size="lg" />
              <div className="min-w-0">
                <p className="truncate text-[16px] font-semibold text-ink">{pro.name}</p>
                {slot ? (
                  <p className="mt-0.5 flex items-center gap-1.5 font-mono text-[13px] text-primary">
                    <Icon name="calendar" size={14} />
                    {slot.label}
                  </p>
                ) : (
                  <p className="mt-0.5 text-[13px] text-slate">{pro.district}</p>
                )}
              </div>
            </div>

            <h2 id="auth-prompt-title" className="mt-6 text-balance text-[26px] font-semibold leading-[1.1] tracking-[-0.035em] text-ink">
              {intent?.kind === "book" ? t("bookTitle") : t("contactTitle", { name: pro.name })}
            </h2>
            <p className="mt-2 text-pretty text-[15px] leading-relaxed text-slate">{t("body")}</p>

            <div className="mt-6 flex flex-col gap-2.5">
              <Link ref={primary} href={{ pathname: "/signup", query: { next, as: "customer" } }} className={cn(btnPrimary, "h-12 w-full")}>
                {t("signup")}
                <Icon name="arrow-right" size={16} className="transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
              <Link href={{ pathname: "/login", query: { next } }} className={cn(btnSecondary, "h-12 w-full")}>
                {t("login")}
              </Link>
            </div>
            <p className="mt-4 flex items-center justify-center gap-1.5 text-[12px] text-muted">
              <Icon name="shield" size={13} />
              {t("note")}
            </p>
          </>
        )}
      </div>
    </div>,
    document.body,
  );
}
