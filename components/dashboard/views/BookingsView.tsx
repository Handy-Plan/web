"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Booking } from "@/lib/mock/dashboard";
import { cn } from "@/lib/cn";
import Icon, { type IconName } from "@/components/ui/Icon";
import { Badge, EmptyState, Initials, Segmented, btnPrimary, btnSecondary, type Tone } from "../kit";

const statusTone: Record<Booking["status"], { tone: Tone; icon: IconName }> = {
  confirmed: { tone: "success", icon: "calendar-check" },
  requested: { tone: "warning", icon: "clock" },
  done: { tone: "neutral", icon: "check" },
  cancelled: { tone: "danger", icon: "ban" },
};

const upcoming = (b: Booking) => b.status === "confirmed" || b.status === "requested";

/** The customer's bookings: upcoming (confirm, cancel) and past (book again). */
export default function BookingsView({ bookings: initial }: { bookings: Booking[] }) {
  const t = useTranslations("dashboard.bookings");
  const tTrades = useTranslations("onboarding.business.trades");
  const [bookings, setBookings] = useState(initial);
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");
  const [cancelId, setCancelId] = useState<string>();

  const visible = bookings.filter((b) => (tab === "upcoming" ? upcoming(b) : !upcoming(b)));
  const setStatus = (id: string, status: Booking["status"]) => setBookings((all) => all.map((b) => (b.id === id ? { ...b, status } : b)));

  return (
    <div className="flex flex-col gap-4">
      <Segmented
        label={t("tabsLabel")}
        value={tab}
        onChange={setTab}
        options={[
          { value: "upcoming", label: t("upcoming"), count: bookings.filter(upcoming).length },
          { value: "past", label: t("past"), count: bookings.filter((b) => !upcoming(b)).length },
        ]}
        className="self-start"
      />

      {visible.length === 0 ? (
        <div className="rounded-[28px] border border-line bg-surface">
          <EmptyState
            icon="calendar-check"
            title={t("empty")}
            action={
              <Link href="/dashboard/find" className={btnPrimary}>
                <Icon name="search" size={16} />
                {t("find")}
              </Link>
            }
          />
        </div>
      ) : (
        <ul className="grid gap-3 sm:gap-4 lg:grid-cols-2">
          {visible.map((b) => (
            <li key={b.id} className="flex min-w-0 flex-col rounded-[24px] border border-line bg-surface p-5">
              <div className="flex items-start gap-3">
                <Initials text={b.initials} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[15px] font-semibold text-ink">{b.pro}</p>
                  <p className="text-[13px] text-slate">{tTrades(b.trade)}</p>
                </div>
                <Badge key={b.status} {...statusTone[b.status]} className="hp-pop">
                  {t(`status.${b.status}`)}
                </Badge>
              </div>

              <p className="mt-4 text-[17px] font-semibold tracking-[-0.02em] text-ink">{b.title}</p>
              <div className="mt-2 flex flex-col gap-1.5 text-[14px] text-graphite">
                <p className="flex flex-wrap items-center gap-2">
                  <Icon name="calendar" size={15} className="shrink-0 text-muted" />
                  <span className={cn("font-mono text-[13px]", b.status === "cancelled" && "line-through text-muted")}>{b.when}</span>
                  {b.priority && <Badge tone="primary" icon="bolt">{t("priority")}</Badge>}
                </p>
                <p className="flex min-w-0 items-center gap-2">
                  <Icon name="map-pin" size={15} className="shrink-0 text-muted" />
                  <span className="truncate">{b.address}</span>
                </p>
              </div>

              <div className="mt-5 flex flex-1 flex-wrap items-end gap-2 border-t border-line pt-4">
                {b.status === "requested" && (
                  <>
                    <p className="w-full text-[13px] text-slate">{t("requestedNote", { pro: b.pro })}</p>
                    <button type="button" onClick={() => setStatus(b.id, "confirmed")} className={cn(btnPrimary, "h-10")}>
                      <Icon name="check" size={15} />
                      {t("confirmTime")}
                    </button>
                    <Link href="/dashboard/messages" className={cn(btnSecondary, "h-10")}>
                      {t("askOther")}
                    </Link>
                  </>
                )}
                {b.status === "confirmed" &&
                  (cancelId === b.id ? (
                    <div className="hp-pop flex w-full flex-wrap items-center gap-2">
                      <p className="w-full text-[13px] font-medium text-danger" role="alert">
                        {t("cancelConfirm")}
                      </p>
                      <button type="button" onClick={() => setCancelId(undefined)} className={cn(btnSecondary, "h-10")}>
                        {t("keep")}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setStatus(b.id, "cancelled");
                          setCancelId(undefined);
                        }}
                        className="inline-flex h-10 items-center rounded-full bg-danger px-4 text-[13px] font-semibold text-white transition-transform active:scale-[0.97]"
                      >
                        {t("cancelYes")}
                      </button>
                    </div>
                  ) : (
                    <>
                      <Link href="/dashboard/messages" className={cn(btnSecondary, "h-10")}>
                        <Icon name="message" size={15} />
                        {t("message")}
                      </Link>
                      <button type="button" onClick={() => setCancelId(b.id)} className="inline-flex h-10 items-center rounded-full px-3 text-[13px] font-medium text-danger transition-colors hover:bg-danger/10">
                        {t("cancel")}
                      </button>
                    </>
                  ))}
                {!upcoming(b) && (
                  <Link href="/dashboard/find" className={cn(btnSecondary, "h-10")}>
                    <Icon name="search" size={15} />
                    {t("again")}
                  </Link>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
