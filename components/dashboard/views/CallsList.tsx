"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { CallEntry, CallOutcome } from "@/lib/mock/dashboard";
import { cn } from "@/lib/cn";
import Icon, { type IconName } from "@/components/ui/Icon";
import { Badge, EmptyState, Initials, Panel, Segmented, btnIcon, type Tone } from "../kit";

type Filter = "all" | CallOutcome;

const outcomeTone: Record<CallOutcome, { tone: Tone; icon: IconName }> = {
  job: { tone: "success", icon: "clipboard" },
  waiting: { tone: "warning", icon: "message" },
  calledBack: { tone: "neutral", icon: "phone-out" },
};

/** Missed calls grouped by day, filterable by what happened next. */
export default function CallsList({ calls }: { calls: CallEntry[] }) {
  const t = useTranslations("dashboard.calls");
  const [filter, setFilter] = useState<Filter>("all");
  const [calledBack, setCalledBack] = useState<string[]>([]);

  const outcomeOf = (c: CallEntry): CallOutcome => (calledBack.includes(c.id) ? "calledBack" : c.outcome);
  const visible = calls.filter((c) => filter === "all" || outcomeOf(c) === filter);
  const count = (f: Filter) => (f === "all" ? calls.length : calls.filter((c) => outcomeOf(c) === f).length);

  const groups = (["today", "yesterday", "earlier"] as const)
    .map((g) => ({ key: g, items: visible.filter((c) => c.group === g) }))
    .filter((g) => g.items.length > 0);

  return (
    <div className="flex flex-col gap-4">
      <Segmented
        label={t("filterLabel")}
        value={filter}
        onChange={setFilter}
        options={(["all", "job", "waiting", "calledBack"] as const).map((f) => ({ value: f, label: t(`filters.${f}`), count: count(f) }))}
        className="self-start"
      />

      <Panel className="overflow-clip">
        {groups.length === 0 && <EmptyState icon="phone-missed" title={t("empty")} />}
        {groups.map((g) => (
          <div key={g.key}>
            <p className="sticky top-[84px] z-[1] border-b border-line bg-surface/90 px-5 py-2.5 text-[12px] font-medium text-muted backdrop-blur-xl sm:px-6">
              {g.key === "earlier" ? t("earlier") : g.items[0].dayLabel}
            </p>
            <ul className="divide-y divide-line">
              {g.items.map((c) => {
                const outcome = outcomeOf(c);
                return (
                  <li key={c.id} className="flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-ink/[0.02] sm:gap-4 sm:px-6">
                    {c.name ? (
                      <Initials text={c.initials} />
                    ) : (
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-danger/10 text-danger">
                        <Icon name="phone-missed" size={17} />
                      </span>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[15px] font-medium text-ink">{c.name ?? t("unknown")}</p>
                      <p className="mt-0.5 flex flex-wrap items-center gap-x-2 text-[13px] text-slate">
                        <span className="font-mono">{c.phone}</span>
                        <span className="hidden font-mono text-muted sm:inline">{t("rang", { seconds: c.ringSec })}</span>
                      </p>
                      {c.jobTitle && <p className="mt-1 truncate text-[13px] text-graphite sm:hidden">{c.jobTitle}</p>}
                    </div>

                    <div className="hidden min-w-0 max-w-[240px] flex-1 md:block">
                      {c.jobTitle && <p className="truncate text-[14px] text-graphite">{c.jobTitle}</p>}
                      {c.viaVoice && (
                        <p className="mt-0.5 flex items-center gap-1 text-[12px] text-muted">
                          <Icon name="mic" size={12} />
                          {t("viaVoice")}
                        </p>
                      )}
                    </div>

                    <div className="flex shrink-0 flex-col items-end gap-1.5">
                      <span className="font-mono text-[12px] text-muted">{c.time}</span>
                      <Badge key={outcome} {...outcomeTone[outcome]} className={cn(calledBack.includes(c.id) && "hp-pop")}>
                        {t(`outcome.${outcome}`)}
                      </Badge>
                    </div>

                    <div className="flex w-10 shrink-0 justify-end">
                      {c.jobId ? (
                        <Link href={`/dashboard/jobs?job=${c.jobId}`} aria-label={t("openJob")} title={t("openJob")} className={btnIcon}>
                          <Icon name="chevron-right" size={18} />
                        </Link>
                      ) : outcome === "waiting" ? (
                        <a
                          href={`tel:${c.phone.replace(/\s/g, "")}`}
                          onClick={() => setCalledBack((ids) => [...ids, c.id])}
                          aria-label={t("callBack")}
                          title={t("callBack")}
                          className={cn(btnIcon, "text-primary hover:text-primary")}
                        >
                          <Icon name="phone" size={18} />
                        </a>
                      ) : null}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </Panel>
    </div>
  );
}
