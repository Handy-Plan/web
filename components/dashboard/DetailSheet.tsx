"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/cn";
import { useIsClient } from "@/lib/useIsClient";
import Icon from "@/components/ui/Icon";
import { btnIcon } from "./kit";

/**
 * Detail view for a selected list item. Desktop: a sticky side panel next to
 * the list (always visible). Below `lg`: a bottom sheet over a dimming scrim,
 * rising from the list it belongs to and leaving the same way; Escape or the
 * scrim closes it.
 */
export default function DetailSheet({
  open,
  onClose,
  label,
  children,
}: {
  open: boolean;
  onClose: () => void;
  label: string;
  children: React.ReactNode;
}) {
  const t = useTranslations("dashboard.common");
  const panel = useRef<HTMLDivElement>(null);
  const isClient = useIsClient();

  // Mobile only: lock scroll + Escape while the sheet is open.
  useEffect(() => {
    if (!open || window.matchMedia("(min-width: 1024px)").matches) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    panel.current?.focus({ preventScroll: true });
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <>
      {/* Desktop side panel */}
      <aside aria-label={label} className="hidden lg:block">
        <div className="sticky top-[100px] max-h-[calc(100svh-120px)] overflow-y-auto rounded-[28px] border border-line bg-surface">
          {children}
        </div>
      </aside>

      {/* Mobile sheet (portalled: see useIsClient) */}
      {isClient &&
        createPortal(
          <div className={cn("fixed inset-0 z-50 lg:hidden", !open && "pointer-events-none")} aria-hidden={!open}>
            <div
              onClick={onClose}
              className={cn(
                "absolute inset-0 bg-[#06121f]/45 backdrop-blur-[2px] transition-opacity duration-300",
                open ? "opacity-100" : "opacity-0",
              )}
            />
            <div
              ref={panel}
              role="dialog"
              aria-modal="true"
              aria-label={label}
              tabIndex={-1}
              inert={!open}
              className={cn(
                "absolute inset-x-0 bottom-0 max-h-[88svh] overflow-y-auto overscroll-contain rounded-t-[28px] bg-surface pb-[env(safe-area-inset-bottom)] shadow-[var(--shadow-float)] outline-none transition-transform ease-[var(--ease-out-expo)]",
                open ? "translate-y-0 duration-500" : "translate-y-full duration-300",
              )}
            >
              <div className="sticky top-0 z-10 flex items-center justify-between bg-surface/90 px-4 pb-1 pt-2 backdrop-blur-xl">
                <span aria-hidden className="mx-auto h-1.5 w-10 rounded-full bg-line" />
                <button type="button" onClick={onClose} aria-label={t("close")} className={cn(btnIcon, "absolute right-2 top-1")}>
                  <Icon name="close" size={20} />
                </button>
              </div>
              {children}
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
