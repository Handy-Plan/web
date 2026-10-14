"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/cn";
import Icon, { type IconName } from "@/components/ui/Icon";
import { Toggle } from "@/components/dashboard/kit";
import { LANGUAGES, MAX_KM, SERVICES, TIMES, WHEN, type Filters, type facetCounts } from "./filters";

type Counts = ReturnType<typeof facetCounts>;

/**
 * All filter groups, used by the desktop sidebar and the phone sheet. Every
 * option shows how many results it would give; options that would give none
 * are dimmed (still selectable, so nothing feels locked).
 */
export default function FilterPanel({
  filters: f,
  counts,
  onChange,
  scope,
}: {
  /** Keeps radio groups separate when the panel is rendered twice (sidebar + sheet). */
  scope: string;
  filters: Filters;
  counts: Counts;
  onChange: (patch: Partial<Filters>) => void;
}) {
  const t = useTranslations("directory.filters");
  const tServices = useTranslations("onboarding.hours.options");
  const tLang = useTranslations("directory.languageNames");
  const toggleIn = (list: string[], v: string) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

  return (
    <div className="flex flex-col divide-y divide-line">
      {/* Distance */}
      <Group title={t("distance")} icon="map-pin" first>
        <div className="flex items-baseline justify-between">
          <span className="text-[13px] text-slate">{t("upTo")}</span>
          <span key={f.km} className="hp-pop font-mono text-[15px] font-medium text-ink">
            {f.km ? t("km", { km: f.km }) : t("anyDistance")}
          </span>
        </div>
        <input
          type="range"
          min={1}
          max={MAX_KM}
          step={1}
          value={f.km || MAX_KM}
          onChange={(e) => {
            const v = Number(e.target.value);
            onChange({ km: v >= MAX_KM ? 0 : v });
          }}
          aria-label={t("distance")}
          aria-valuetext={f.km ? t("km", { km: f.km }) : t("anyDistance")}
          className="mt-3 h-11 w-full cursor-pointer accent-[var(--color-primary)]"
        />
        <div className="-mt-1 flex justify-between font-mono text-[11px] text-muted">
          <span>1 km</span>
          <span>{t("anyDistance")}</span>
        </div>
      </Group>

      {/* When */}
      <Group title={t("when")} icon="calendar">
        <div className="flex flex-wrap gap-2">
          {WHEN.map((w) => (
            <Choice
              key={w}
              type="radio"
              name={`${scope}-when`}
              checked={f.when === w}
              onChange={() => onChange({ when: w })}
              label={t(`whenOptions.${w}`)}
              count={counts.when[w]}
            />
          ))}
        </div>
      </Group>

      {/* Time of day */}
      <Group title={t("time")} icon="clock">
        <div className="grid grid-cols-3 gap-2">
          {TIMES.map((tm) => (
            <label
              key={tm}
              className={cn(
                "relative flex cursor-pointer flex-col items-center gap-0.5 rounded-[14px] border px-2 py-2.5 text-center transition-[background-color,border-color,color,transform] duration-200 active:scale-[0.97] has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-primary/20",
                f.times.includes(tm) ? "border-ink bg-ink text-canvas" : "border-line bg-surface text-graphite hover:border-ink/25",
                !counts.times[tm] && !f.times.includes(tm) && "opacity-45",
              )}
            >
              <input type="checkbox" className="sr-only" checked={f.times.includes(tm)} onChange={() => onChange({ times: toggleIn(f.times, tm) })} />
              <span className="text-[13px] font-medium">{t(`timeOptions.${tm}`)}</span>
              <span className={cn("font-mono text-[10px]", f.times.includes(tm) ? "text-canvas/70" : "text-muted")}>{t(`timeHints.${tm}`)}</span>
            </label>
          ))}
        </div>
      </Group>

      {/* Services */}
      <Group title={t("services")} icon="wrench">
        <div className="flex flex-col gap-1">
          {SERVICES.map((s) => (
            <Check
              key={s}
              checked={f.services.includes(s)}
              onChange={() => onChange({ services: toggleIn(f.services, s) })}
              label={tServices(s)}
              count={counts.services[s]}
            />
          ))}
        </div>
      </Group>

      {/* Languages */}
      <Group title={t("languages")} icon="languages">
        <div className="flex flex-wrap gap-2">
          {LANGUAGES.map((l) => (
            <Choice
              key={l}
              type="checkbox"
              checked={f.languages.includes(l)}
              onChange={() => onChange({ languages: toggleIn(f.languages, l) })}
              label={tLang(l)}
              count={counts.languages[l]}
            />
          ))}
        </div>
      </Group>

      {/* Qualities */}
      <Group title={t("more")} icon="sliders">
        <div className="flex flex-col gap-3">
          {(
            [
              { key: "master", icon: "award" },
              { key: "emergency", icon: "alert" },
              { key: "fast", icon: "bolt" },
            ] as const
          ).map((o) => (
            <div key={o.key} className={cn("flex items-center gap-3", !counts[o.key] && !f[o.key] && "opacity-45")}>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary">
                <Icon name={o.icon} size={16} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[14px] font-medium text-ink">
                  {t(o.key)} <span className="font-mono text-[12px] font-normal text-muted">{counts[o.key]}</span>
                </p>
                <p className="text-[12px] leading-snug text-slate">{t(`${o.key}Hint`)}</p>
              </div>
              <Toggle checked={f[o.key]} onChange={(v) => onChange({ [o.key]: v })} label={t(o.key)} />
            </div>
          ))}
        </div>
      </Group>
    </div>
  );
}

function Group({ title, icon, first, children }: { title: string; icon: IconName; first?: boolean; children: React.ReactNode }) {
  return (
    <details open className={cn("group/acc", first ? "pb-5" : "py-5")}>
      <summary className="flex cursor-pointer list-none items-center gap-2.5 rounded-[10px] text-[14px] font-semibold text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary [&::-webkit-details-marker]:hidden">
        <Icon name={icon} size={16} className="text-slate" />
        <span className="flex-1">{title}</span>
        <Icon name="chevron-down" size={16} className="text-muted transition-transform duration-300 group-open/acc:rotate-180" />
      </summary>
      <div className="mt-4">{children}</div>
    </details>
  );
}

function Choice({
  type,
  name,
  checked,
  onChange,
  label,
  count,
  className,
}: {
  type: "radio" | "checkbox";
  name?: string;
  checked: boolean;
  onChange: () => void;
  label: string;
  count: number;
  className?: string;
}) {
  return (
    <label
      className={cn(
        "relative flex h-10 cursor-pointer select-none items-center justify-between gap-2 rounded-full border px-3.5 text-[13px] font-medium transition-[background-color,border-color,color,transform] duration-200 active:scale-[0.97] has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-primary/20",
        checked ? "border-ink bg-ink text-canvas" : "border-line bg-surface text-graphite hover:border-ink/25",
        !count && !checked && "opacity-45",
        className,
      )}
    >
      <input type={type} name={name} checked={checked} onChange={onChange} className="sr-only" />
      <span className="truncate">{label}</span>
      <span className={cn("font-mono text-[11px]", checked ? "text-canvas/70" : "text-muted")}>{count}</span>
    </label>
  );
}

function Check({ checked, onChange, label, count }: { checked: boolean; onChange: () => void; label: string; count: number }) {
  return (
    <label
      className={cn(
        "group/check flex min-h-11 cursor-pointer items-center gap-3 rounded-[12px] px-2 transition-colors hover:bg-ink/[0.03] has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary",
        !count && !checked && "opacity-45",
      )}
    >
      <input type="checkbox" checked={checked} onChange={onChange} className="peer sr-only" />
      <span
        aria-hidden
        className="flex h-5 w-5 shrink-0 items-center justify-center rounded-[6px] border border-line bg-surface text-transparent transition-colors duration-200 peer-checked:border-ink peer-checked:bg-ink peer-checked:text-canvas"
      >
        <Icon name="check" size={13} />
      </span>
      <span className="flex-1 text-[14px] text-graphite">{label}</span>
      <span className="font-mono text-[12px] text-muted">{count}</span>
    </label>
  );
}
