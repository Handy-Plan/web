"use client";

import { useCallback, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { JobCard, JobStatus, Urgency } from "@/lib/mock/dashboard";
import { cn } from "@/lib/cn";
import Icon, { type IconName } from "@/components/ui/Icon";
import DetailSheet from "../DetailSheet";
import { Badge, DetailRow, EmptyState, Initials, Segmented, btnPrimary, btnSecondary, type Tone } from "../kit";

type Filter = "all" | JobStatus;

export const urgencyTone: Record<Urgency, { tone: Tone; icon: IconName }> = {
  today: { tone: "warning", icon: "alert" },
  week: { tone: "primary", icon: "calendar" },
  flexible: { tone: "neutral", icon: "clock" },
};

export const statusTone: Record<JobStatus, { tone: Tone; icon: IconName }> = {
  new: { tone: "primary", icon: "sparkle" },
  proposed: { tone: "warning", icon: "send" },
  booked: { tone: "success", icon: "calendar-check" },
  done: { tone: "neutral", icon: "check" },
};

/**
 * Job cards: filter by status, pick one, propose a time, mark it booked.
 * Sample data only, so changes live in local state.
 */
export default function JobsBoard({
  jobs: initial,
  freeSlots,
  initialId,
}: {
  jobs: JobCard[];
  freeSlots: string[];
  initialId?: string;
}) {
  const t = useTranslations("dashboard.jobs");
  const [jobs, setJobs] = useState(initial);
  const [filter, setFilter] = useState<Filter>("all");
  const [selectedId, setSelectedId] = useState(initialId && initial.some((j) => j.id === initialId) ? initialId : initial[0]?.id);
  const [sheetOpen, setSheetOpen] = useState(Boolean(initialId));

  const counts = useMemo(() => {
    const c: Record<Filter, number> = { all: jobs.length, new: 0, proposed: 0, booked: 0, done: 0 };
    jobs.forEach((j) => c[j.status]++);
    return c;
  }, [jobs]);

  const visible = filter === "all" ? jobs : jobs.filter((j) => j.status === filter);
  const selected = jobs.find((j) => j.id === selectedId) ?? visible[0];
  const update = (id: string, patch: Partial<JobCard>) => setJobs((all) => all.map((j) => (j.id === id ? { ...j, ...patch } : j)));
  const closeSheet = useCallback(() => setSheetOpen(false), []);

  const changeFilter = (next: Filter) => {
    setFilter(next);
    const first = next === "all" ? jobs[0] : jobs.find((j) => j.status === next);
    if (first) setSelectedId(first.id);
  };

  return (
    <div className="flex flex-col gap-4">
      <Segmented
        label={t("filterLabel")}
        value={filter}
        onChange={changeFilter}
        options={(["all", "new", "proposed", "booked", "done"] as const).map((f) => ({
          value: f,
          label: t(`filters.${f}`),
          count: counts[f],
        }))}
        className="self-start"
      />

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_400px] lg:items-start">
        {visible.length === 0 ? (
          <div className="rounded-[28px] border border-line bg-surface">
            <EmptyState icon="clipboard" title={t("emptyTitle")} body={t("emptyBody")} />
          </div>
        ) : (
          <ul className="flex min-w-0 flex-col gap-3">
            {visible.map((job) => {
              const active = job.id === selected?.id;
              return (
                <li key={job.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedId(job.id);
                      setSheetOpen(true);
                    }}
                    aria-pressed={active}
                    className={cn(
                      "group w-full rounded-[22px] border bg-surface p-4 text-left transition-[border-color,box-shadow,transform] duration-300 ease-[var(--ease-out-expo)] active:scale-[0.99] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 sm:p-5",
                      active ? "border-primary shadow-[0_0_0_3px_rgb(3_105_161/0.12)] lg:border-primary" : "border-line hover:border-ink/15",
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <Initials text={job.initials} />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="truncate text-[15px] font-semibold text-ink">{job.title}</p>
                            <p className="mt-0.5 truncate text-[13px] text-slate">{job.name}</p>
                          </div>
                          <span className="shrink-0 pt-0.5 font-mono text-[12px] text-muted">{job.received}</span>
                        </div>
                        <p className="mt-2 line-clamp-2 text-pretty text-[14px] leading-relaxed text-graphite">{job.problem}</p>
                        <div className="mt-3 flex flex-wrap items-center gap-1.5">
                          <Badge key={`${job.id}-${job.status}`} {...statusTone[job.status]} className="hp-pop">
                            {t(`status.${job.status}`)}
                          </Badge>
                          <Badge {...urgencyTone[job.urgency]}>{t(`urgency.${job.urgency}`)}</Badge>
                          {job.when && job.status !== "done" && (
                            <span className="ml-auto font-mono text-[12px] text-slate">{job.when}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        {selected && (
          <DetailSheet open={sheetOpen} onClose={closeSheet} label={t("detailLabel")}>
            <JobDetail key={selected.id} job={selected} freeSlots={freeSlots} onUpdate={(patch) => update(selected.id, patch)} />
          </DetailSheet>
        )}
      </div>
    </div>
  );
}

function JobDetail({ job, freeSlots, onUpdate }: { job: JobCard; freeSlots: string[]; onUpdate: (patch: Partial<JobCard>) => void }) {
  const t = useTranslations("dashboard.jobs");
  const [slot, setSlot] = useState(freeSlots[0] ?? "");
  const [changing, setChanging] = useState(false);
  const picking = job.status === "new" || changing;
  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(job.address)}`;

  return (
    <div className="p-5 sm:p-6">
      <div className="flex items-center gap-3">
        <Initials text={job.initials} size="lg" />
        <div className="min-w-0">
          <p className="truncate text-[18px] font-semibold tracking-[-0.02em] text-ink">{job.name}</p>
          <p className="font-mono text-[13px] text-slate">{job.phone}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        <Badge key={job.status} {...statusTone[job.status]} className="hp-pop">
          {t(`status.${job.status}`)}
        </Badge>
        <Badge {...urgencyTone[job.urgency]}>{t(`urgency.${job.urgency}`)}</Badge>
        <Badge icon={job.source === "voice" ? "mic" : "message"}>{t(`source.${job.source}`)}</Badge>
      </div>

      <h3 className="mt-5 text-[22px] font-semibold leading-tight tracking-[-0.03em] text-ink">{job.title}</h3>
      <div className="mt-3 rounded-[18px] rounded-tl-[6px] bg-surface-2 px-4 py-3">
        <p className="text-[12px] font-medium text-muted">{t("callerWrote")}</p>
        <p className="mt-1 text-pretty text-[15px] leading-relaxed text-ink">{job.problem}</p>
      </div>

      <div className="mt-5 flex flex-col gap-4">
        <DetailRow icon="map-pin" label={t("address")}>
          <a href={mapsHref} target="_blank" rel="noreferrer" className="underline decoration-line underline-offset-4 transition-colors hover:decoration-primary">
            {job.address}
          </a>
        </DetailRow>
        <DetailRow icon="clock" label={t("received")}>
          {job.received} <span className="font-mono text-[13px] text-slate">({job.receivedTime})</span>
        </DetailRow>
      </div>

      <div className="mt-6 border-t border-line pt-5">
        {picking && (
          <fieldset>
            <legend className="text-[14px] font-semibold text-ink">{t("pickTime")}</legend>
            <p className="mt-1 text-[13px] text-slate">{t("pickTimeHint")}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {freeSlots.map((s) => (
                <label
                  key={s}
                  className="relative flex h-11 cursor-pointer select-none items-center rounded-full border border-line bg-surface px-4 font-mono text-[13px] text-graphite transition-[background-color,border-color,color,transform] duration-200 hover:border-ink/25 active:scale-[0.96] has-[:checked]:border-ink has-[:checked]:bg-ink has-[:checked]:text-canvas has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-primary/20"
                >
                  <input type="radio" name={`slot-${job.id}`} value={s} checked={slot === s} onChange={() => setSlot(s)} className="sr-only" />
                  {s}
                </label>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                disabled={!slot}
                onClick={() => {
                  onUpdate({ status: "proposed", when: slot });
                  setChanging(false);
                }}
                className={btnPrimary}
              >
                <Icon name="send" size={16} />
                {t("sendTime")}
              </button>
              <a href={`tel:${job.phone.replace(/\s/g, "")}`} className={btnSecondary}>
                <Icon name="phone" size={16} />
                {t("callBack")}
              </a>
            </div>
          </fieldset>
        )}

        {!picking && job.status === "proposed" && (
          <div>
            <p className="flex items-start gap-2 text-[14px] leading-relaxed text-graphite">
              <Icon name="send" size={16} className="mt-0.5 shrink-0 text-warning" />
              {t("waiting", { name: job.name.split(" ")[0], when: job.when ?? "" })}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <button type="button" onClick={() => onUpdate({ status: "booked" })} className={btnPrimary}>
                <Icon name="calendar-check" size={16} />
                {t("markBooked")}
              </button>
              <button type="button" onClick={() => setChanging(true)} className={btnSecondary}>
                {t("changeTime")}
              </button>
            </div>
          </div>
        )}

        {!picking && job.status === "booked" && (
          <div>
            <p className="flex items-start gap-2 text-[14px] leading-relaxed text-graphite">
              <Icon name="calendar-check" size={16} className="mt-0.5 shrink-0 text-success" />
              {t("bookedFor", { when: job.when ?? "" })}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <button type="button" onClick={() => onUpdate({ status: "done" })} className={btnPrimary}>
                <Icon name="check" size={16} />
                {t("markDone")}
              </button>
              <Link href="/dashboard/calendar" className={btnSecondary}>
                <Icon name="calendar" size={16} />
                {t("openCalendar")}
              </Link>
            </div>
          </div>
        )}

        {job.status === "done" && (
          <p className="flex items-start gap-2 text-[14px] leading-relaxed text-graphite">
            <svg viewBox="0 0 24 24" width={16} height={16} aria-hidden className="mt-0.5 shrink-0 text-success">
              <path d="M4.5 12.5 9 17l10.5-11" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" pathLength={1} className="hp-draw" />
            </svg>
            {t("doneNote", { when: job.when ?? job.received })}
          </p>
        )}
      </div>
    </div>
  );
}
