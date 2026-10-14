"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Pro } from "@/lib/mock/dashboard";
import { cn } from "@/lib/cn";
import { useIsClient } from "@/lib/useIsClient";
import Icon from "@/components/ui/Icon";
import { Badge, EmptyState, Initials, Segmented, StageGlow, btnPrimary, btnSecondary } from "../kit";

type Pick = { proId: string; slotId: string; priority: boolean };

/**
 * Customer search: trade filter, soonest/closest sort, live free slots, and
 * the flat-fee priority match. Booking only updates local state (sample).
 */
export default function FindView({ pros, trades }: { pros: Pro[]; trades: readonly string[] }) {
  const t = useTranslations("dashboard.find");
  const tTrades = useTranslations("onboarding.business.trades");
  const locale = useLocale();
  const [trade, setTrade] = useState("all");
  const [sort, setSort] = useState<"soonest" | "closest">("soonest");
  const [query, setQuery] = useState("");
  const [pick, setPick] = useState<Pick>();
  const [booked, setBooked] = useState<Pick[]>([]);
  const isClient = useIsClient();

  const q = query.trim().toLowerCase();
  const visible = pros
    .filter((p) => trade === "all" || p.trade === trade)
    .filter((p) => !q || p.name.toLowerCase().includes(q) || tTrades(p.trade).toLowerCase().includes(q) || p.district.toLowerCase().includes(q))
    .sort((a, b) => (sort === "soonest" ? a.soonest - b.soonest : a.km - b.km));

  const pickedPro = pros.find((p) => p.id === pick?.proId);
  const pickedSlot = pickedPro?.slots.find((s) => s.id === pick?.slotId);
  const isBooked = (proId: string) => booked.find((b) => b.proId === proId);

  const priority = () => {
    const pool = trade === "all" ? pros : pros.filter((p) => p.trade === trade);
    const best = [...pool].filter((p) => !isBooked(p.id)).sort((a, b) => a.soonest - b.soonest || a.km - b.km)[0];
    if (best) setPick({ proId: best.id, slotId: best.slots[0].id, priority: true });
  };

  return (
    <div className="flex flex-col gap-5 pb-24">
      {/* Priority match: night-blue stage */}
      <section className="relative overflow-hidden rounded-[28px] bg-[#06121f] p-6 text-white sm:p-7">
        <StageGlow />
        <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl">
            <p className="flex items-center gap-2 text-[13px] font-medium text-sky-300">
              <Icon name="bolt" size={15} />
              {t("priorityLabel")}
            </p>
            <h2 className="mt-2 text-balance text-[26px] font-semibold leading-[1.08] tracking-[-0.035em] sm:text-[30px]">{t("priorityTitle")}</h2>
            <p className="mt-2 text-pretty text-[15px] leading-relaxed text-white/65">{t("priorityBody")}</p>
          </div>
          <button
            type="button"
            onClick={priority}
            className="group inline-flex h-12 shrink-0 items-center gap-2 self-start rounded-full bg-white px-5 text-[14px] font-semibold text-[#06121f] transition-[transform,background-color] duration-200 hover:bg-sky-100 active:scale-[0.97] md:self-center"
          >
            <Icon name="bolt" size={16} />
            {t("priorityCta")}
            <Icon name="arrow-right" size={15} className="transition-transform duration-300 group-hover:translate-x-0.5" />
          </button>
        </div>
      </section>

      {/* Filters */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1 sm:max-w-sm">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label={t("search")}
              placeholder={t("search")}
              className="peer h-12 w-full rounded-full border border-line bg-surface pl-11 pr-4 text-[16px] text-ink transition-[border-color,box-shadow] duration-200 placeholder:text-muted focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15"
            />
            <Icon name="search" size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted transition-colors peer-focus:text-primary" />
          </div>
          <Segmented
            label={t("sortLabel")}
            value={sort}
            onChange={setSort}
            options={[
              { value: "soonest", label: t("soonest") },
              { value: "closest", label: t("closest") },
            ]}
            className="self-start sm:ml-auto"
          />
        </div>
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0">
          {["all", ...trades].map((tr) => (
            <button
              key={tr}
              type="button"
              onClick={() => setTrade(tr)}
              aria-pressed={trade === tr}
              className={cn(
                "h-10 shrink-0 rounded-full border px-4 text-[13px] font-medium transition-[background-color,border-color,color,transform] duration-200 active:scale-[0.96]",
                trade === tr ? "border-ink bg-ink text-canvas" : "border-line bg-surface text-graphite hover:border-ink/25",
              )}
            >
              {tr === "all" ? t("allTrades") : tTrades(tr)}
            </button>
          ))}
        </div>
      </div>

      <p className="text-[13px] text-slate">{t("results", { count: visible.length })}</p>

      {visible.length === 0 ? (
        <div className="rounded-[28px] border border-line bg-surface">
          <EmptyState icon="search" title={t("emptyTitle")} body={t("emptyBody")} />
        </div>
      ) : (
        <ul className="grid gap-3 sm:gap-4 xl:grid-cols-2">
          {visible.map((p) => {
            const done = isBooked(p.id);
            const doneSlot = done && p.slots.find((s) => s.id === done.slotId);
            return (
              <li key={p.id} className={cn("rounded-[24px] border bg-surface p-5 transition-[border-color] duration-300", pick?.proId === p.id ? "border-primary" : "border-line")}>
                <div className="flex items-start gap-3">
                  <Initials text={p.initials} size="lg" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[16px] font-semibold tracking-[-0.02em] text-ink">{p.name}</p>
                    <p className="mt-0.5 text-[13px] text-slate">{tTrades(p.trade)}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-1.5">
                      <Badge icon="map-pin">
                        <span className="font-mono">{t("km", { km: p.km.toLocaleString(locale) })}</span>
                      </Badge>
                      {p.master && <Badge tone="primary" icon="award">{t("master")}</Badge>}
                    </div>
                  </div>
                </div>
                <p className="mt-3 flex items-center gap-1.5 text-[13px] text-slate">
                  <Icon name="map-pin" size={13} className="shrink-0 text-muted" />
                  {p.district}
                </p>

                {done ? (
                  <p className="hp-pop mt-4 flex items-start gap-2 rounded-[16px] bg-success/12 px-4 py-3 text-[14px] text-graphite">
                    <Icon name="calendar-check" size={16} className="mt-0.5 shrink-0 text-success" />
                    <span>
                      {t("bookedNote", { slot: doneSlot ? doneSlot.label : "" })}{" "}
                      <Link href="/dashboard/bookings" className="font-semibold text-primary underline-offset-4 hover:underline">
                        {t("seeBookings")}
                      </Link>
                    </span>
                  </p>
                ) : (
                  <div className="mt-4">
                    <p className="text-[12px] font-medium text-muted">{t("freeSlots")}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {p.slots.map((s) => {
                        const active = pick?.slotId === s.id;
                        return (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() => setPick(active ? undefined : { proId: p.id, slotId: s.id, priority: false })}
                            aria-pressed={active}
                            className={cn(
                              "h-11 rounded-full border px-4 font-mono text-[13px] transition-[background-color,border-color,color,transform] duration-200 active:scale-[0.96]",
                              active ? "border-ink bg-ink text-canvas" : "border-line bg-surface text-graphite hover:border-ink/25",
                              s.today && !active && "border-primary/40 text-primary",
                            )}
                          >
                            {s.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {/* Confirm bar: rises from the bottom while a slot is picked (portalled) */}
      {isClient &&
        createPortal(
          <div
            className={cn(
              "fixed inset-x-3 bottom-3 z-40 transition-[transform,opacity] duration-500 ease-[var(--ease-out-expo)] sm:inset-x-auto sm:right-6 sm:w-[440px] lg:bottom-6",
              pick ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-[120%] opacity-0",
            )}
            inert={!pick}
          >
            <div className="glass rounded-[24px] p-4 shadow-[var(--shadow-float)] pb-[max(1rem,env(safe-area-inset-bottom))]">
              {pickedPro && pickedSlot && (
                <>
                  <div className="flex items-start gap-3">
                    <Initials text={pickedPro.initials} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[15px] font-semibold text-ink">{pickedPro.name}</p>
                      <p className="font-mono text-[13px] text-slate">{pickedSlot.label}</p>
                    </div>
                    {pick?.priority && <Badge tone="primary" icon="bolt">{t("priorityLabel")}</Badge>}
                  </div>
                  <p className="mt-3 text-pretty text-[13px] leading-relaxed text-slate">{pick?.priority ? t("feeNote") : t("freeNote")}</p>
                  <div className="mt-3 flex gap-2">
                    <button type="button" onClick={() => setPick(undefined)} className={cn(btnSecondary, "flex-1")}>
                      {t("cancel")}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (pick) setBooked((all) => [...all, pick]);
                        setPick(undefined);
                      }}
                      className={cn(btnPrimary, "flex-1")}
                    >
                      <Icon name="check" size={16} />
                      {t("confirm")}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
