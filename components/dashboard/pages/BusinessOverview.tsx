import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { profileChecklist } from "@/lib/onboarding";
import Icon, { type IconName } from "@/components/ui/Icon";
import { Badge, Initials, Panel, PanelTitle, StageGlow, rise } from "../kit";
import { statusTone, urgencyTone } from "../views/JobsBoard";
import { loadBusiness } from "./data";

const ROW = 36; // px per hour on the "today" timeline

export default async function BusinessOverview({ locale }: { locale: string }) {
  const t = await getTranslations("dashboard.overview");
  const tJobs = await getTranslations("dashboard.jobs");
  const ob = await getTranslations("onboarding");
  const { onboarding, profile, mock } = await loadBusiness(locale);
  const { percent, missing } = profileChecklist(onboarding);
  const nextStep = missing[0]?.step ?? "business";
  const s = mock.stats;

  const stats: { key: string; icon: IconName; value: string; note: string; href: string }[] = [
    { key: "missed", icon: "phone-missed", value: String(s.missedToday), note: t("statNotes.missed", { count: s.jobsFromCallsToday }), href: "/dashboard/calls" },
    { key: "cards", icon: "clipboard", value: String(s.openCards), note: t("statNotes.cards", { count: s.needTime }), href: "/dashboard/jobs" },
    { key: "booked", icon: "calendar-check", value: String(s.bookedWeek), note: s.nextBooked ? t("statNotes.booked", { when: s.nextBooked }) : t("noData"), href: "/dashboard/calendar" },
    { key: "reply", icon: "clock", value: t("seconds", { count: s.replySeconds }), note: t("statNotes.reply"), href: "/dashboard/settings" },
  ];

  // Today's timeline inside the working hours (stretched to fit any event).
  const from = Math.floor(Math.min(Number(profile.start.slice(0, 2)), ...mock.todayEvents.map((e) => e.start / 60)));
  const to = Math.ceil(Math.max(Number(profile.end.slice(0, 2)), from + 1, ...mock.todayEvents.map((e) => e.end / 60)));
  const ticks = Array.from({ length: to - from + 1 }, (_, k) => `${String(from + k).padStart(2, "0")}:00`);
  const latest = mock.jobs.filter((j) => j.status === "new" || j.status === "proposed").slice(0, 4);

  const R = 38;
  const C = 2 * Math.PI * R;

  return (
    <div className="auth-rise flex flex-col gap-5 sm:gap-6">
      <div style={rise(0)} className="pt-2">
        <p className="font-mono text-[12px] text-muted">{mock.today}</p>
        <h1 className="mt-2 text-[32px] font-semibold leading-[1.05] tracking-[-0.045em] text-ink sm:text-[44px]">
          {onboarding.businessName ? t("greeting") : t("greetingNoName")}
        </h1>
        <p className="mt-2 text-[16px] text-slate">{t("subtitle")}</p>
      </div>

      {/* Hero: newest job card + profile completeness (night-blue stage) */}
      <section style={rise(1)} className="relative overflow-hidden rounded-[28px] bg-[#06121f] p-6 text-white sm:p-8 lg:p-10">
        <StageGlow floor />
        <div className="relative grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-center lg:gap-12">
          <div>
            <p className="flex items-center gap-2 text-[13px] font-medium text-white/60">
              <span className="relative flex h-2 w-2">
                <span className="hp-ring absolute inset-0 rounded-full bg-sky-300" />
                <span className="relative h-2 w-2 rounded-full bg-sky-300" />
              </span>
              {t("newestTitle", { ago: mock.jobs[0].received })}
            </p>
            <div className="mt-4 max-w-[520px] rounded-[22px] rounded-tl-[6px] bg-white/[0.08] px-5 py-4 ring-1 ring-white/12 backdrop-blur-xl">
              <div className="flex items-center justify-between gap-3">
                <p className="truncate text-[15px] font-semibold">{mock.jobs[0].name}</p>
                <span className="shrink-0 rounded-full bg-amber-300/15 px-2.5 py-0.5 text-[12px] font-medium text-amber-200 ring-1 ring-inset ring-amber-200/25">
                  {tJobs(`urgency.${mock.jobs[0].urgency}`)}
                </span>
              </div>
              <p className="mt-2 text-pretty text-[15px] leading-relaxed text-white/80 sm:text-[16px]">{mock.jobs[0].problem}</p>
              <p className="mt-3 flex items-center gap-1.5 text-[13px] text-white/55">
                <Icon name="map-pin" size={13} />
                {mock.jobs[0].address}
              </p>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-2.5">
              <Link
                href={`/dashboard/jobs?job=${mock.jobs[0].id}`}
                className="group inline-flex h-11 items-center gap-2 rounded-full bg-white px-5 text-[14px] font-semibold text-[#06121f] transition-[transform,background-color] duration-200 hover:bg-sky-100 active:scale-[0.97]"
              >
                <Icon name="calendar-check" size={16} />
                {t("pickTime")}
                <Icon name="arrow-right" size={15} className="transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
              <a
                href={`tel:${mock.jobs[0].phone.replace(/\s/g, "")}`}
                className="inline-flex h-11 items-center gap-2 rounded-full px-4 text-[14px] font-medium text-white/75 ring-1 ring-inset ring-white/15 transition-colors hover:bg-white/10 hover:text-white"
              >
                <Icon name="phone" size={15} />
                {tJobs("callBack")}
              </a>
            </div>
          </div>

          <div className="flex items-center gap-5 rounded-[22px] bg-white/[0.05] p-5 ring-1 ring-inset ring-white/10 lg:flex-col lg:items-start lg:p-6">
            <div className="relative h-[92px] w-[92px] shrink-0">
              <svg viewBox="0 0 92 92" className="h-full w-full -rotate-90" aria-hidden>
                <circle cx="46" cy="46" r={R} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="7" />
                <circle
                  cx="46"
                  cy="46"
                  r={R}
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="7"
                  strokeLinecap="round"
                  strokeDasharray={C}
                  strokeDashoffset={C * (1 - percent / 100)}
                  className="hp-ring-fill"
                  style={{ ["--ring-c" as string]: C }}
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center font-mono text-[18px] font-medium">{percent}%</span>
            </div>
            <div className="min-w-0">
              <p className="text-[16px] font-semibold">{percent < 100 ? t("setupTitle") : ob("done.progress", { percent })}</p>
              {percent < 100 ? (
                <>
                  <p className="mt-1 text-pretty text-[14px] leading-relaxed text-white/60">{t("setupBody", { percent })}</p>
                  <Link href={`/onboarding/${nextStep}`} className="group mt-3 inline-flex items-center gap-1.5 text-[14px] font-semibold text-sky-300">
                    {t("setupCta")}
                    <Icon name="arrow-right" size={14} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                  </Link>
                </>
              ) : (
                <p className="mt-1 flex items-center gap-1.5 text-[14px] text-white/60">
                  <Icon name="check" size={14} className="text-success" />
                  {profile.businessName}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <div style={rise(2)} className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        {stats.map((st) => (
          <Link
            key={st.key}
            href={st.href}
            className="group rounded-[22px] border border-line bg-surface p-4 transition-[border-color,transform] duration-300 ease-[var(--ease-out-expo)] hover:-translate-y-0.5 hover:border-ink/15 active:scale-[0.98] sm:p-5"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-soft text-primary">
                <Icon name={st.icon} size={17} />
              </span>
              <Icon name="arrow-right" size={15} className="-rotate-45 text-muted opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100" />
            </div>
            <p className="mt-5 text-[40px] font-semibold leading-none tracking-[-0.05em] text-ink tabular-nums sm:text-[44px]">{st.value}</p>
            <p className="mt-2 text-[13px] font-medium text-graphite">{t(`stats.${st.key}`)}</p>
            <p className="mt-0.5 truncate text-[12px] text-muted">{st.note}</p>
          </Link>
        ))}
      </div>

      <div style={rise(3)} className="grid gap-5 sm:gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        {/* Job cards waiting for a time */}
        <Panel className="overflow-hidden">
          <PanelTitle
            className="px-6 pt-6"
            action={
              <Link href="/dashboard/jobs" className="group inline-flex h-10 items-center gap-1 text-[13px] font-semibold text-primary">
                {t("viewAll")}
                <Icon name="arrow-right" size={14} className="transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
            }
          >
            {t("jobsTitle")}
          </PanelTitle>
          <ul className="mt-3 divide-y divide-line">
            {latest.map((j) => (
              <li key={j.id}>
                <Link href={`/dashboard/jobs?job=${j.id}`} className="group flex items-center gap-3 px-6 py-3.5 transition-colors hover:bg-ink/[0.02]">
                  <Initials text={j.initials} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[15px] font-medium text-ink">{j.title}</p>
                    <p className="mt-0.5 truncate text-[13px] text-slate">
                      {j.name} <span className="font-mono text-muted">· {j.received}</span>
                    </p>
                  </div>
                  <div className="hidden shrink-0 gap-1.5 sm:flex">
                    <Badge {...urgencyTone[j.urgency]}>{tJobs(`urgency.${j.urgency}`)}</Badge>
                    <Badge {...statusTone[j.status]}>{tJobs(`status.${j.status}`)}</Badge>
                  </div>
                  <Icon name="chevron-right" size={18} className="shrink-0 text-muted transition-transform duration-300 group-hover:translate-x-0.5" />
                </Link>
              </li>
            ))}
          </ul>
        </Panel>

        {/* Today */}
        <Panel className="p-6">
          <div className="flex items-baseline justify-between">
            <h2 className="text-[18px] font-semibold tracking-[-0.02em] text-ink">{t("todayTitle")}</h2>
            <Link href="/dashboard/calendar" className="font-mono text-[12px] text-muted transition-colors hover:text-primary">
              {ticks[0]} - {ticks[ticks.length - 1]}
            </Link>
          </div>
          <div className="relative mt-5" style={{ height: (ticks.length - 1) * ROW + 12 }}>
            <ol aria-hidden className="absolute inset-0">
              {ticks.map((h, k) => (
                <li key={h} className="absolute inset-x-0 flex items-center gap-3" style={{ top: k * ROW }}>
                  <span className="w-11 shrink-0 -translate-y-px font-mono text-[11px] text-muted">{h}</span>
                  <span className="h-px flex-1 bg-line" />
                </li>
              ))}
            </ol>
            {mock.todayEvents.length === 0 ? (
              <div className="absolute inset-0 left-14 flex items-center justify-center">
                <p className="flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 text-[13px] font-medium text-slate">
                  <Icon name="calendar" size={15} className="text-muted" />
                  {t("todayEmpty")}
                </p>
              </div>
            ) : (
              <ul className="absolute inset-y-0 left-14 right-0">
                {mock.todayEvents.map((e) => (
                  <li
                    key={e.id}
                    className="absolute inset-x-0 py-0.5"
                    style={{ top: ((e.start - from * 60) / 60) * ROW + 6, height: Math.max(((e.end - e.start) / 60) * ROW, 30) }}
                  >
                    <div
                      className={
                        "flex h-full flex-col justify-center overflow-hidden rounded-[12px] px-3 " +
                        (e.fromJob ? "bg-primary/10 ring-1 ring-inset ring-primary/25" : "bg-surface-2 ring-1 ring-inset ring-line") +
                        (e.status === "done" ? " opacity-55" : "") +
                        (e.status === "now" ? " ring-2 ring-primary" : "")
                      }
                    >
                      <p className="truncate text-[13px] font-semibold text-ink">{e.title}</p>
                      <p className="truncate font-mono text-[11px] text-slate">
                        {e.time} · {e.name}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Panel>
      </div>
    </div>
  );
}
