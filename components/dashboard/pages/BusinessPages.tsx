import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { employeeOptions, serviceOptions, tradeOptions, weekdays } from "@/lib/content";
import { isOneOf } from "@/lib/onboarding";
import { berlinNowMinutes } from "@/lib/mock/dashboard";
import { cn } from "@/lib/cn";
import Icon, { type IconName } from "@/components/ui/Icon";
import { Initials, PageHeader, Panel, StageGlow, btnSecondary, rise } from "../kit";
import JobsBoard from "../views/JobsBoard";
import CallsList from "../views/CallsList";
import WeekCalendar from "../views/WeekCalendar";
import CustomersView from "../views/CustomersView";
import MessagesView from "../views/MessagesView";
import AiFeatures from "../views/AiFeatures";
import SettingsView from "../views/SettingsView";
import { FORWARDING_NUMBER, loadBusiness } from "./data";

type Props = { locale: string };

async function intro(key: string) {
  const t = await getTranslations("dashboard");
  return { title: t(`nav.${key}`), subtitle: t(`intro.${key}`) };
}

export async function JobsPage({ locale, jobId }: Props & { jobId?: string }) {
  const { mock } = await loadBusiness(locale);
  return (
    <div className="auth-rise flex flex-col gap-6">
      <PageHeader style={rise(0)} {...await intro("jobs")} />
      <div style={rise(1)}>
        <JobsBoard jobs={mock.jobs} freeSlots={mock.freeSlots} initialId={jobId} />
      </div>
    </div>
  );
}

export async function CallsPage({ locale }: Props) {
  const t = await getTranslations("dashboard.calls");
  const { mock } = await loadBusiness(locale);
  const s = mock.stats;
  const share = s.callsWeek ? Math.round((s.callsToJobs / s.callsWeek) * 100) : 0;
  const tiles: { icon: IconName; value: string; label: string; note: string }[] = [
    { icon: "phone-missed", value: String(s.callsWeek), label: t("summary.week"), note: t("summary.weekNote") },
    { icon: "clipboard", value: `${share}%`, label: t("summary.jobs"), note: t("summary.jobsNote", { count: s.callsToJobs }) },
    { icon: "message", value: String(s.waiting), label: t("summary.waiting"), note: t("summary.waitingNote") },
  ];

  return (
    <div className="auth-rise flex flex-col gap-6">
      <PageHeader style={rise(0)} {...await intro("calls")} />
      <div style={rise(1)} className="grid grid-cols-3 gap-2 sm:gap-4">
        {tiles.map((x) => (
          <div key={x.label} className="min-w-0 rounded-[22px] border border-line bg-surface p-3.5 sm:p-5">
            <div className="flex items-center gap-2 text-[12px] font-medium leading-tight text-graphite sm:text-[13px]">
              <span className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary sm:flex">
                <Icon name={x.icon} size={15} />
              </span>
              {x.label}
            </div>
            <p className="mt-3 text-[28px] font-semibold leading-none tracking-[-0.05em] text-ink tabular-nums sm:mt-4 sm:text-[36px]">{x.value}</p>
            <p className="mt-1.5 hidden text-[12px] text-muted sm:block">{x.note}</p>
          </div>
        ))}
      </div>
      <div style={rise(2)}>
        <CallsList calls={mock.calls} />
      </div>
    </div>
  );
}

export async function CalendarPage({ locale }: Props) {
  const { mock, profile } = await loadBusiness(locale);
  const toMin = (s: string) => Number(s.slice(0, 2)) * 60 + Number(s.slice(3, 5));
  const workDays = profile.days.map((d) => weekdays.indexOf(d as (typeof weekdays)[number])).filter((n) => n >= 0);
  return (
    <div className="auth-rise flex flex-col gap-6">
      <PageHeader
        style={rise(0)}
        {...await intro("calendar")}
        actions={
          <Link href="/onboarding/hours" className={btnSecondary}>
            <Icon name="clock" size={16} />
            <span className="font-mono text-[13px]">
              {profile.start} - {profile.end}
            </span>
          </Link>
        }
      />
      <div style={rise(1)}>
        <WeekCalendar
          weeks={mock.weeks}
          events={mock.events}
          workStart={toMin(profile.start)}
          workEnd={toMin(profile.end)}
          workDays={workDays}
          nowMinutes={berlinNowMinutes()}
        />
      </div>
    </div>
  );
}

export async function CustomersPage({ locale }: Props) {
  const t = await getTranslations("dashboard.customers");
  const { mock } = await loadBusiness(locale);
  return (
    <div className="auth-rise flex flex-col gap-6">
      <PageHeader style={rise(0)} {...await intro("customers")} eyebrow={t("count", { count: mock.customers.length })} />
      <div style={rise(1)}>
        <CustomersView customers={mock.customers} />
      </div>
    </div>
  );
}

export async function MessagesPage({ locale }: Props) {
  const { mock } = await loadBusiness(locale);
  return (
    <div className="auth-rise flex flex-col gap-6">
      <PageHeader style={rise(0)} {...await intro("messages")} />
      <div style={rise(1)}>
        <MessagesView threads={mock.threads} role="business" />
      </div>
    </div>
  );
}

export async function AiPage({ locale }: Props) {
  const { profile } = await loadBusiness(locale);
  return (
    <div className="flex flex-col gap-6">
      <div className="auth-rise">
        <PageHeader {...await intro("ai")} />
      </div>
      <AiFeatures businessName={profile.businessName} />
    </div>
  );
}

export async function SettingsPage({ locale }: Props) {
  const { reply } = await loadBusiness(locale);
  return (
    <div className="flex flex-col gap-6">
      <div className="auth-rise">
        <PageHeader {...await intro("settings")} />
      </div>
      <SettingsView role="business" forwardingNumber={FORWARDING_NUMBER} replyText={reply} email="info@elektro-krueger.de" />
    </div>
  );
}

export async function ProfilePage({ locale }: Props) {
  const t = await getTranslations("dashboard.profile");
  const ob = await getTranslations("onboarding");
  const { profile, reply } = await loadBusiness(locale);

  const trade = isOneOf(profile.trade, tradeOptions) ? ob(`business.trades.${profile.trade}`) : profile.trade;
  const team = isOneOf(profile.employees, employeeOptions) ? ob(`business.employeeOptions.${profile.employees}`) : profile.employees;
  const services = profile.services.filter((s): s is (typeof serviceOptions)[number] => isOneOf(s, serviceOptions));
  const custom = "customService" in profile ? profile.customService : undefined;

  const sections: { key: string; step: string; icon: IconName; rows: { label: string; value?: string; mono?: boolean }[] }[] = [
    {
      key: "company",
      step: "business",
      icon: "building",
      rows: [
        { label: t("fields.name"), value: profile.businessName },
        { label: t("fields.trade"), value: trade },
        { label: t("fields.team"), value: team },
        { label: t("fields.website"), value: profile.website },
      ],
    },
    {
      key: "contact",
      step: "contact",
      icon: "phone",
      rows: [
        { label: t("fields.phone"), value: profile.phone, mono: true },
        { label: t("fields.mobile"), value: profile.mobile, mono: true },
        { label: t("fields.emergency"), value: profile.emergencyPhone, mono: true },
        { label: t("fields.address"), value: [profile.street, `${profile.postcode} ${profile.city}`.trim()].filter(Boolean).join(", ") },
        { label: t("fields.radius"), value: profile.serviceRadius ? t("km", { km: profile.serviceRadius }) : undefined },
      ],
    },
  ];

  return (
    <div className="auth-rise flex flex-col gap-6">
      <PageHeader style={rise(0)} {...await intro("profile")} />

      <div style={rise(1)} className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
        <div className="flex flex-col gap-5">
          {sections.map((sec) => (
            <Panel key={sec.key} className="p-5 sm:p-6">
              <SectionHead icon={sec.icon} title={t(`sections.${sec.key}`)} href={`/onboarding/${sec.step}`} edit={t("edit")} />
              <dl className="mt-5 grid gap-x-6 gap-y-4 sm:grid-cols-2">
                {sec.rows.map((r) => (
                  <div key={r.label} className="min-w-0">
                    <dt className="text-[12px] text-muted">{r.label}</dt>
                    <dd className={cn("mt-0.5 truncate text-[15px]", r.value ? "text-ink" : "text-muted", r.mono && r.value && "font-mono text-[14px]")}>
                      {r.value || t("notSet")}
                    </dd>
                  </div>
                ))}
              </dl>
            </Panel>
          ))}

          <Panel className="p-5 sm:p-6">
            <SectionHead icon="calendar" title={t("sections.hours")} href="/onboarding/hours" edit={t("edit")} />
            <p className="mt-5 text-[12px] text-muted">{t("fields.days")}</p>
            <ul className="mt-2 flex flex-wrap gap-1.5">
              {weekdays.map((d) => {
                const on = profile.days.includes(d);
                return (
                  <li
                    key={d}
                    className={cn(
                      "flex h-10 w-12 items-center justify-center rounded-full text-[13px] font-medium",
                      on ? "bg-ink text-canvas" : "border border-line text-muted line-through decoration-muted/60",
                    )}
                  >
                    {ob(`hours.dayNames.${d}`)}
                  </li>
                );
              })}
            </ul>
            <p className="mt-5 text-[12px] text-muted">{t("fields.hours")}</p>
            <p className="mt-0.5 font-mono text-[15px] text-ink">
              {profile.start} - {profile.end}
            </p>
            <p className="mt-5 text-[12px] text-muted">{t("fields.services")}</p>
            <ul className="mt-2 flex flex-wrap gap-1.5">
              {services.map((s) => (
                <li key={s} className="rounded-full bg-primary-soft px-3 py-1.5 text-[13px] font-medium text-primary">
                  {ob(`hours.options.${s}`)}
                </li>
              ))}
              {custom && <li className="rounded-full bg-primary-soft px-3 py-1.5 text-[13px] font-medium text-primary">{custom}</li>}
            </ul>
          </Panel>
        </div>

        {/* What callers see */}
        <aside className="relative overflow-hidden rounded-[28px] bg-[#06121f] p-6 text-white lg:sticky lg:top-[100px]">
          <StageGlow floor />
          <div className="relative">
            <p className="flex items-center gap-2 text-[13px] font-medium text-white/60">
              <Icon name="message" size={15} className="text-sky-300" />
              {ob("aside.previewTitle")}
            </p>
            <div className="mt-4 rounded-[22px] rounded-tl-[6px] bg-white/[0.08] px-5 py-4 ring-1 ring-white/12 backdrop-blur-xl">
              <p className="text-pretty text-[15px] leading-relaxed">
                {reply}
                {profile.emergencyPhone && (
                  <span className="mt-2 block font-semibold">{ob("aside.previewEmergency", { phone: profile.emergencyPhone })}</span>
                )}
              </p>
            </div>
            <div className="mt-6 flex items-center gap-3">
              <Initials text={profile.businessName.slice(0, 2).toUpperCase()} tone="ink" />
              <div className="min-w-0">
                <p className="truncate text-[15px] font-semibold">{profile.businessName}</p>
                <p className="truncate text-[13px] text-white/60">{trade}</p>
              </div>
            </div>
            <Link
              href="/dashboard/settings"
              className="mt-6 inline-flex h-11 items-center gap-2 rounded-full px-4 text-[14px] font-medium text-white/80 ring-1 ring-inset ring-white/15 transition-colors hover:bg-white/10 hover:text-white"
            >
              <Icon name="gear" size={15} />
              {t("editReply")}
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}

function SectionHead({ icon, title, href, edit }: { icon: IconName; title: string; href: string; edit: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary-soft text-primary">
        <Icon name={icon} size={18} />
      </span>
      <h2 className="flex-1 text-[17px] font-semibold tracking-[-0.02em] text-ink">{title}</h2>
      <Link href={href} className={cn(btnSecondary, "h-10")}>
        <Icon name="signup" size={15} />
        {edit}
      </Link>
    </div>
  );
}
