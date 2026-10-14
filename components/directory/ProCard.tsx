"use client";

import { useLocale, useTranslations } from "next-intl";
import type { Pro } from "@/lib/mock/dashboard";
import { cn } from "@/lib/cn";
import Icon from "@/components/ui/Icon";
import { Badge, Initials, btnPrimary, btnSecondary } from "@/components/dashboard/kit";

const SLOTS_SHOWN = 4;

/** One tradesperson in the directory. Booking/contacting goes through `onAsk`. */
export default function ProCard({
  pro: p,
  onBook,
  onContact,
}: {
  pro: Pro;
  onBook: (slotIndex: number) => void;
  onContact: () => void;
}) {
  const t = useTranslations("directory.card");
  const tTrades = useTranslations("onboarding.business.trades");
  const tServices = useTranslations("onboarding.hours.options");
  const locale = useLocale();
  const next = p.slots[0];
  const reply = p.replyMinutes < 60 ? t("repliesMin", { m: p.replyMinutes }) : t("repliesHour", { h: Math.round(p.replyMinutes / 60) });

  return (
    <article className="group/card flex h-full min-w-0 flex-col rounded-[26px] border border-line bg-surface p-5 transition-[border-color,box-shadow,transform] duration-300 ease-[var(--ease-out-expo)] hover:-translate-y-0.5 hover:border-ink/15 hover:shadow-[var(--shadow-soft)] sm:p-6">
      {/* Identity */}
      <div className="flex items-start gap-3.5">
        <Initials text={p.initials} size="lg" />
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-[18px] font-semibold tracking-[-0.025em] text-ink">{p.name}</h2>
          <p className="mt-0.5 truncate text-[13px] text-slate">
            {tTrades(p.trade)} <span className="text-muted">· {t("since", { year: p.founded })}</span>
          </p>
        </div>
      </div>

      {/* Next free slot: the one thing customers compare first */}
      {next && (
        <button
          type="button"
          onClick={() => onBook(0)}
          className={cn(
            "mt-4 flex items-center gap-3 rounded-[18px] px-4 py-3 text-left transition-[background-color,transform] duration-200 active:scale-[0.99]",
            next.today ? "bg-primary/10 hover:bg-primary/15" : "bg-surface-2 hover:bg-ink/[0.06]",
          )}
        >
          <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-full", next.today ? "bg-primary text-white" : "bg-surface text-slate")}>
            <Icon name="calendar-check" size={16} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[12px] text-slate">{t("nextFree")}</span>
            <span className={cn("block truncate font-mono text-[15px] font-medium", next.today ? "text-primary" : "text-ink")}>{next.label}</span>
          </span>
          <Icon name="arrow-right" size={16} className="shrink-0 text-muted transition-transform duration-300 group-hover/card:translate-x-0.5" />
        </button>
      )}

      {/* Facts */}
      <div className="mt-4 flex flex-wrap gap-1.5">
        <Badge icon="map-pin">
          <span className="font-mono">{t("km", { km: p.km.toLocaleString(locale) })}</span>
        </Badge>
        {p.master && (
          <Badge tone="primary" icon="award">
            {t("master")}
          </Badge>
        )}
        {p.emergency && (
          <Badge tone="warning" icon="alert">
            {t("emergency")}
          </Badge>
        )}
        <Badge tone={p.replyMinutes <= 60 ? "success" : "neutral"} icon="message">
          {reply}
        </Badge>
      </div>

      <p className="mt-4 text-pretty text-[14px] leading-relaxed text-graphite">{p.about}</p>

      <dl className="mt-3 grid gap-1.5 text-[13px]">
        <div className="flex items-center gap-2 text-slate">
          <dt className="sr-only">{t("area")}</dt>
          <Icon name="home" size={14} className="shrink-0 text-muted" />
          <dd className="truncate">{p.district}</dd>
        </div>
        <div className="flex items-center gap-2 text-slate">
          <dt className="sr-only">{t("languages")}</dt>
          <Icon name="languages" size={14} className="shrink-0 text-muted" />
          <dd className="flex gap-1">
            {p.languages.map((l) => (
              <span key={l} className="rounded-[6px] bg-surface-2 px-1.5 py-0.5 font-mono text-[11px] uppercase text-graphite">
                {l}
              </span>
            ))}
          </dd>
        </div>
        <div className="flex items-start gap-2 text-slate">
          <dt className="sr-only">{t("services")}</dt>
          <Icon name="wrench" size={14} className="mt-0.5 shrink-0 text-muted" />
          <dd className="text-pretty">{p.services.map((s) => tServices(s)).join(", ")}</dd>
        </div>
      </dl>

      {/* More slots + contact */}
      <div className="mt-auto pt-5">
        {p.slots.length > 1 && (
          <>
            <p className="text-[12px] font-medium text-muted">{t("moreTimes")}</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {p.slots.slice(1, SLOTS_SHOWN).map((s, k) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => onBook(k + 1)}
                  aria-label={t("bookSlot", { slot: s.label, name: p.name })}
                  className="h-10 rounded-full border border-line bg-surface px-3 font-mono text-[12px] text-graphite transition-[background-color,border-color,color,transform] duration-200 hover:border-ink hover:bg-ink hover:text-canvas active:scale-[0.96]"
                >
                  {s.label}
                </button>
              ))}
              {p.slots.length > SLOTS_SHOWN && (
                <span className="flex h-10 items-center px-1 text-[12px] text-muted">{t("moreSlots", { count: p.slots.length - SLOTS_SHOWN })}</span>
              )}
            </div>
          </>
        )}
        <div className="mt-4 flex gap-2 border-t border-line pt-4">
          <button type="button" onClick={() => onBook(0)} className={cn(btnPrimary, "flex-1")}>
            <Icon name="calendar-check" size={16} />
            {t("book")}
          </button>
          <button type="button" onClick={onContact} className={btnSecondary} aria-label={t("contactLabel", { name: p.name })}>
            <Icon name="message" size={16} />
            <span className="hidden sm:inline">{t("contact")}</span>
          </button>
        </div>
      </div>
    </article>
  );
}
