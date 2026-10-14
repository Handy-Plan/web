import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { tradeOptions } from "@/lib/content";
import Icon from "@/components/ui/Icon";
import { Badge, Initials, PageHeader, Panel, PanelTitle, StageGlow, rise } from "../kit";
import FindView from "../views/FindView";
import BookingsView from "../views/BookingsView";
import MessagesView from "../views/MessagesView";
import SettingsView from "../views/SettingsView";
import { FORWARDING_NUMBER, loadCustomer } from "./data";

type Props = { locale: string };

/** Title from the nav label, subtitle from `intro` (customer variants differ). */
async function intro(nav: string, key = nav) {
  const t = await getTranslations("dashboard");
  return { title: t(`nav.${nav}`), subtitle: t(`intro.${key}`) };
}

export async function CustomerOverview({ locale }: Props) {
  const t = await getTranslations("dashboard.customerHome");
  const tb = await getTranslations("dashboard.bookings");
  const tTrades = await getTranslations("onboarding.business.trades");
  const data = await loadCustomer(locale);
  const next = data.bookings.find((b) => b.status === "confirmed");
  const pending = data.bookings.filter((b) => b.status === "requested");
  const unread = data.threads.reduce((n, th) => n + th.unread, 0);
  const nearby = data.pros.slice(0, 3);

  return (
    <div className="auth-rise flex flex-col gap-5 sm:gap-6">
      <div style={rise(0)} className="pt-2">
        <p className="font-mono text-[12px] text-muted">{data.today}</p>
        <h1 className="mt-2 text-[32px] font-semibold leading-[1.05] tracking-[-0.045em] text-ink sm:text-[44px]">{t("greeting", { name: data.name })}</h1>
        <p className="mt-2 text-[16px] text-slate">{t("subtitle")}</p>
      </div>

      {/* Next visit */}
      <section style={rise(1)} className="relative overflow-hidden rounded-[28px] bg-[#06121f] p-6 text-white sm:p-8 lg:p-10">
        <StageGlow floor />
        <div className="relative grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-center lg:gap-12">
          {next ? (
            <div>
              <p className="flex items-center gap-2 text-[13px] font-medium text-white/60">
                <Icon name="calendar-check" size={15} className="text-sky-300" />
                {t("nextTitle")}
              </p>
              <p className="mt-3 text-balance text-[30px] font-semibold leading-[1.05] tracking-[-0.04em] sm:text-[38px]">{next.when}</p>
              <div className="mt-5 flex items-center gap-3">
                <Initials text={next.initials} />
                <div className="min-w-0">
                  <p className="truncate text-[15px] font-semibold">{next.pro}</p>
                  <p className="truncate text-[13px] text-white/60">{next.title}</p>
                </div>
              </div>
              <div className="mt-6 flex flex-wrap gap-2.5">
                <Link
                  href="/dashboard/messages"
                  className="group inline-flex h-11 items-center gap-2 rounded-full bg-white px-5 text-[14px] font-semibold text-[#06121f] transition-[transform,background-color] duration-200 hover:bg-sky-100 active:scale-[0.97]"
                >
                  <Icon name="message" size={16} />
                  {tb("message")}
                </Link>
                <Link
                  href="/dashboard/bookings"
                  className="inline-flex h-11 items-center gap-2 rounded-full px-4 text-[14px] font-medium text-white/75 ring-1 ring-inset ring-white/15 transition-colors hover:bg-white/10 hover:text-white"
                >
                  {t("allBookings")}
                </Link>
              </div>
            </div>
          ) : (
            <p className="text-[18px] font-semibold">{t("noNext")}</p>
          )}

          <Link
            href="/dashboard/find"
            className="group flex flex-col gap-3 rounded-[22px] bg-white/[0.06] p-5 ring-1 ring-inset ring-white/10 transition-[background-color,transform] duration-300 hover:bg-white/[0.1] active:scale-[0.98] lg:p-6"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-sky-400/15 text-sky-300 ring-1 ring-inset ring-sky-300/25">
              <Icon name="search" size={19} />
            </span>
            <span className="text-[17px] font-semibold">{t("findTitle")}</span>
            <span className="text-pretty text-[14px] leading-relaxed text-white/60">{t("findBody")}</span>
            <span className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-sky-300">
              {t("findCta")}
              <Icon name="arrow-right" size={14} className="transition-transform duration-300 group-hover:translate-x-0.5" />
            </span>
          </Link>
        </div>
      </section>

      <div style={rise(2)} className="grid gap-5 sm:gap-6 xl:grid-cols-2">
        <Panel className="overflow-hidden">
          <PanelTitle className="px-6 pt-6">{t("todoTitle")}</PanelTitle>
          <ul className="mt-3 divide-y divide-line">
            {pending.map((b) => (
              <li key={b.id}>
                <Link href="/dashboard/bookings" className="group flex items-center gap-3 px-6 py-3.5 transition-colors hover:bg-ink/[0.02]">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-warning/15 text-warning">
                    <Icon name="clock" size={17} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[15px] font-medium text-ink">{t("confirmTodo", { pro: b.pro })}</p>
                    <p className="mt-0.5 truncate font-mono text-[12px] text-slate">{b.when}</p>
                  </div>
                  <Icon name="chevron-right" size={18} className="shrink-0 text-muted" />
                </Link>
              </li>
            ))}
            {unread > 0 && (
              <li>
                <Link href="/dashboard/messages" className="group flex items-center gap-3 px-6 py-3.5 transition-colors hover:bg-ink/[0.02]">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary">
                    <Icon name="message" size={17} />
                  </span>
                  <p className="min-w-0 flex-1 truncate text-[15px] font-medium text-ink">{t("unread", { count: unread })}</p>
                  <Icon name="chevron-right" size={18} className="shrink-0 text-muted" />
                </Link>
              </li>
            )}
          </ul>
        </Panel>

        <Panel className="overflow-hidden">
          <PanelTitle
            className="px-6 pt-6"
            action={
              <Link href="/dashboard/find" className="group inline-flex h-10 items-center gap-1 text-[13px] font-semibold text-primary">
                {t("seeAll")}
                <Icon name="arrow-right" size={14} className="transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
            }
          >
            {t("nearbyTitle")}
          </PanelTitle>
          <ul className="mt-3 divide-y divide-line">
            {nearby.map((p) => (
              <li key={p.id} className="flex items-center gap-3 px-6 py-3.5">
                <Initials text={p.initials} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[15px] font-medium text-ink">{p.name}</p>
                  <p className="mt-0.5 truncate text-[13px] text-slate">
                    {tTrades(p.trade)} <span className="font-mono text-muted">· {p.km.toLocaleString(locale)} km</span>
                  </p>
                </div>
                <Badge tone={p.slots[0].today ? "primary" : "neutral"} icon="clock">
                  <span className="font-mono">{p.slots[0].label}</span>
                </Badge>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}

export async function FindPage({ locale, pro, slot }: Props & { pro?: string; slot?: string }) {
  const data = await loadCustomer(locale);
  // Show the chosen tradesperson first when coming back from the directory.
  const pros = pro ? [...data.pros].sort((a, b) => Number(b.id === pro) - Number(a.id === pro)) : data.pros;
  return (
    <div className="auth-rise flex flex-col gap-6">
      <PageHeader style={rise(0)} {...await intro("find")} />
      <div style={rise(1)}>
        <FindView
          pros={pros}
          trades={tradeOptions.filter((x) => x !== "other")}
          initialPro={pro}
          initialSlot={slot !== undefined && /^\d+$/.test(slot) ? Number(slot) : undefined}
        />
      </div>
    </div>
  );
}

export async function BookingsPage({ locale }: Props) {
  const data = await loadCustomer(locale);
  return (
    <div className="auth-rise flex flex-col gap-6">
      <PageHeader style={rise(0)} {...await intro("bookings")} />
      <div style={rise(1)}>
        <BookingsView bookings={data.bookings} />
      </div>
    </div>
  );
}

export async function CustomerMessagesPage({ locale }: Props) {
  const data = await loadCustomer(locale);
  return (
    <div className="auth-rise flex flex-col gap-6">
      <PageHeader style={rise(0)} {...await intro("messages", "customerMessages")} />
      <div style={rise(1)}>
        <MessagesView threads={data.threads} role="customer" />
      </div>
    </div>
  );
}

export async function CustomerSettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="auth-rise">
        <PageHeader {...await intro("settings", "customerSettings")} />
      </div>
      <SettingsView role="customer" forwardingNumber={FORWARDING_NUMBER} replyText="" email="sabine.kowalski@web.de" />
    </div>
  );
}
