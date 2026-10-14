"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { CalendarDay, CalendarEvent } from "@/lib/mock/dashboard";
import { cn } from "@/lib/cn";
import Icon from "@/components/ui/Icon";
import { Badge, EmptyState, Panel, btnIcon, btnSecondary } from "../kit";

const HOUR = 56; // px per hour in the week grid

type Props = {
  weeks: CalendarDay[][];
  events: CalendarEvent[];
  workStart: number;
  workEnd: number;
  /** Weekday indexes (0 = Mon) the business works. */
  workDays: number[];
  nowMinutes: number;
};

/**
 * Week view of booked jobs inside the working hours. Desktop: a time grid
 * with a "now" line. Phones: a day strip plus that day's agenda.
 */
export default function WeekCalendar({ weeks, events, workStart, workEnd, workDays, nowMinutes }: Props) {
  const t = useTranslations("dashboard.calendar");
  const [week, setWeek] = useState(1); // 0 = last, 1 = this, 2 = next
  const [day, setDay] = useState(0); // day key (offset from today), phones only

  const days = weeks[week];
  const inWeek = (key: number) => key >= days[0].key && key <= days[6].key;
  const weekEvents = events.filter((e) => inWeek(e.dayKey));

  const gridStart = Math.floor(Math.min(workStart, ...weekEvents.map((e) => e.start)) / 60) * 60;
  const gridEnd = Math.ceil(Math.max(workEnd, ...weekEvents.map((e) => e.end)) / 60) * 60;
  const hours = Array.from({ length: (gridEnd - gridStart) / 60 }, (_, k) => gridStart / 60 + k);

  const go = (next: number) => {
    setWeek(next);
    setDay(next === 1 ? 0 : weeks[next][0].key);
  };

  const dayEvents = events.filter((e) => e.dayKey === day);
  const selectedDay = weeks.flat().find((d) => d.key === day);

  return (
    <div className="flex flex-col gap-4">
      {/* Week switcher */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center rounded-full border border-line bg-surface p-0.5">
          <button type="button" onClick={() => go(week - 1)} disabled={week === 0} aria-label={t("prevWeek")} className={cn(btnIcon, "disabled:opacity-35")}>
            <Icon name="chevron-left" size={18} />
          </button>
          <p key={week} className="hp-pop min-w-[140px] px-2 text-center text-[14px] font-semibold text-ink">
            {t(`weeks.${week}`)}
          </p>
          <button type="button" onClick={() => go(week + 1)} disabled={week === 2} aria-label={t("nextWeek")} className={cn(btnIcon, "disabled:opacity-35")}>
            <Icon name="chevron-right" size={18} />
          </button>
        </div>
        {week !== 1 && (
          <button type="button" onClick={() => go(1)} className={cn(btnSecondary, "h-10")}>
            {t("thisWeek")}
          </button>
        )}
        <p className="ml-auto hidden font-mono text-[12px] text-muted sm:block">
          {t("count", { count: weekEvents.length })}
        </p>
      </div>

      {/* Phones: day strip + agenda */}
      <div className="md:hidden">
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none]">
          {days.map((d) => {
            const n = events.filter((e) => e.dayKey === d.key).length;
            const active = d.key === day;
            return (
              <button
                key={d.key}
                type="button"
                onClick={() => setDay(d.key)}
                aria-pressed={active}
                className={cn(
                  "flex h-[68px] w-[52px] shrink-0 flex-col items-center justify-center gap-0.5 rounded-[18px] border transition-[background-color,border-color,color,transform] duration-200 active:scale-[0.95]",
                  active ? "border-ink bg-ink text-canvas" : "border-line bg-surface text-graphite",
                  !workDays.includes(d.weekdayIndex) && !active && "opacity-55",
                )}
              >
                <span className="text-[11px] font-medium">{d.weekday}</span>
                <span className="font-mono text-[17px] font-medium">{d.day}</span>
                <span className={cn("h-1 w-1 rounded-full", n ? (active ? "bg-canvas" : "bg-primary") : "bg-transparent")} />
              </button>
            );
          })}
        </div>

        <Panel className="mt-3 p-4">
          <p className="px-1 text-[14px] font-semibold text-ink">{selectedDay?.label}</p>
          {dayEvents.length === 0 ? (
            <EmptyState icon="calendar" title={t("emptyDay")} />
          ) : (
            <ul className="mt-3 flex flex-col gap-2">
              {dayEvents.map((e) => (
                <li key={e.id}>
                  <EventCard event={e} layout="row" />
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>

      {/* Desktop: week grid */}
      <Panel className="hidden overflow-hidden md:block">
        <div className="grid grid-cols-[56px_repeat(7,minmax(0,1fr))] border-b border-line">
          <span />
          {days.map((d) => (
            <div key={d.key} className={cn("border-l border-line px-2 py-3 text-center", !workDays.includes(d.weekdayIndex) && "bg-ink/[0.02]")}>
              <p className={cn("text-[12px] font-medium", d.isToday ? "text-primary" : "text-muted")}>{d.weekday}</p>
              <p
                className={cn(
                  "mx-auto mt-1 flex h-8 w-8 items-center justify-center rounded-full font-mono text-[15px]",
                  d.isToday ? "bg-primary font-semibold text-white" : "text-ink",
                )}
              >
                {d.day}
              </p>
            </div>
          ))}
        </div>

        <div className="relative grid grid-cols-[56px_repeat(7,minmax(0,1fr))]" style={{ height: hours.length * HOUR }}>
          {/* Hour labels + lines */}
          <div className="relative">
            {hours.map((h, k) => (
              <span key={h} className="absolute right-2 -translate-y-1/2 font-mono text-[11px] text-muted" style={{ top: k * HOUR }}>
                {k === 0 ? "" : `${String(h).padStart(2, "0")}:00`}
              </span>
            ))}
          </div>
          {days.map((d) => (
            <div key={d.key} className={cn("relative border-l border-line", !workDays.includes(d.weekdayIndex) && "bg-ink/[0.02]")}>
              {hours.map((h, k) => (
                <span key={h} aria-hidden className="absolute inset-x-0 h-px bg-line/70" style={{ top: k * HOUR }} />
              ))}
              {/* Outside working hours */}
              <span aria-hidden className="absolute inset-x-0 top-0 bg-ink/[0.025]" style={{ height: ((workStart - gridStart) / 60) * HOUR }} />
              <span aria-hidden className="absolute inset-x-0 bottom-0 bg-ink/[0.025]" style={{ height: ((gridEnd - workEnd) / 60) * HOUR }} />

              {events
                .filter((e) => e.dayKey === d.key)
                .map((e) => (
                  <div
                    key={e.id}
                    className="absolute inset-x-1"
                    style={{ top: ((e.start - gridStart) / 60) * HOUR + 2, height: ((e.end - e.start) / 60) * HOUR - 4 }}
                  >
                    <EventCard event={e} layout="block" />
                  </div>
                ))}

              {d.isToday && nowMinutes >= gridStart && nowMinutes <= gridEnd && (
                <div aria-hidden className="pointer-events-none absolute inset-x-0 z-[2] flex items-center" style={{ top: ((nowMinutes - gridStart) / 60) * HOUR }}>
                  <span className="-ml-1 h-2 w-2 rounded-full bg-primary" />
                  <span className="h-0.5 flex-1 bg-primary" />
                </div>
              )}
            </div>
          ))}
        </div>
      </Panel>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[12px] text-slate">
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-[4px] bg-primary/15 ring-1 ring-inset ring-primary/30" />
          {t("legendJob")}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-[4px] bg-surface-2 ring-1 ring-inset ring-line" />
          {t("legendOther")}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-[4px] bg-ink/[0.05]" />
          {t("legendClosed")}
        </span>
      </div>
    </div>
  );
}

function EventCard({ event: e, layout }: { event: CalendarEvent; layout: "block" | "row" }) {
  const t = useTranslations("dashboard.calendar");
  const body = (
    <>
      <p className={cn("truncate font-semibold text-ink", layout === "block" ? "text-[12px]" : "text-[15px]")}>{e.title}</p>
      <p className={cn("truncate text-slate", layout === "block" ? "text-[11px]" : "text-[13px]")}>{e.name}</p>
      <p className={cn("truncate font-mono text-muted", layout === "block" ? "mt-0.5 text-[10px]" : "mt-1 text-[12px]")}>{e.time}</p>
      {layout === "row" && (
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          {e.status === "now" && <Badge tone="primary" icon="clock">{t("now")}</Badge>}
          {e.status === "done" && <Badge icon="check">{t("done")}</Badge>}
          <span className="flex min-w-0 items-center gap-1 text-[12px] text-slate">
            <Icon name="map-pin" size={12} className="shrink-0" />
            <span className="truncate">{e.address}</span>
          </span>
        </div>
      )}
    </>
  );

  const cls = cn(
    "block h-full overflow-hidden text-left transition-[transform,box-shadow] duration-200",
    layout === "block" ? "rounded-[10px] px-2 py-1.5" : "rounded-[16px] px-4 py-3",
    e.fromJob ? "bg-primary/10 ring-1 ring-inset ring-primary/25" : "bg-surface-2 ring-1 ring-inset ring-line",
    e.status === "done" && "opacity-55",
    e.status === "now" && "ring-2 ring-primary",
  );

  return e.jobId ? (
    <Link href={`/dashboard/jobs?job=${e.jobId}`} title={`${e.title}, ${e.time}`} className={cn(cls, "hover:shadow-[var(--shadow-soft)] active:scale-[0.98]")}>
      {body}
    </Link>
  ) : (
    <div title={`${e.title}, ${e.time}`} className={cls}>
      {body}
    </div>
  );
}
