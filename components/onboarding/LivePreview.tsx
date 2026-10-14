"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
// Type-only: lib/onboarding reads cookies (server-only) at runtime.
import type { OnboardingData } from "@/lib/onboarding";
import {
  employeeOptions,
  serviceOptions,
  serviceRadiusOptions,
  tradeOptions,
  weekdays,
  type OnboardingStep,
} from "@/lib/content";
import Icon from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

type Step = OnboardingStep | "done";

const isOneOf = <T extends string>(value: string | undefined, allowed: readonly T[]): value is T =>
  value !== undefined && (allowed as readonly string[]).includes(value);

/** Marker swapped for the highlighted business name inside the message. */
const SLOT = "\u0000";

/** Read the wizard form into the same shape as the saved data. */
function readForm(form: HTMLFormElement): Partial<OnboardingData> {
  const fd = new FormData(form);
  const str = (k: string) => (fd.has(k) ? String(fd.get(k) ?? "").trim() : undefined);
  const out: Partial<OnboardingData> = {};
  for (const k of [
    "businessName",
    "trade",
    "employees",
    "mobile",
    "emergencyPhone",
    "city",
    "serviceRadius",
    "start",
    "end",
    "customService",
  ] as const) {
    if (form.elements.namedItem(k)) out[k] = str(k);
  }
  // Checkbox groups: present on the page → take the current selection.
  if (form.querySelector('[name="days"]')) out.days = fd.getAll("days").map(String);
  if (form.querySelector('[name="services"]')) out.services = fd.getAll("services").map(String);
  // Radio groups with nothing picked aren't in FormData; clear explicitly.
  for (const k of ["employees", "serviceRadius"] as const) {
    if (form.querySelector(`[name="${k}"]`) && !fd.has(k)) out[k] = undefined;
  }
  return out;
}

/**
 * Right-hand stage of the onboarding wizard: the caller's phone showing the
 * exact text HandyPlan will send, plus a floating card for whatever the
 * current step adds (trade, service radius, working week). It listens to the
 * form's input events, so the preview changes as the person types; the form
 * itself stays a plain server-action form.
 */
export default function LivePreview({
  step,
  formId,
  initial,
  compact = false,
}: {
  step: Step;
  formId?: string;
  initial: OnboardingData;
  /** Mobile: just the message, no phone or floating cards. */
  compact?: boolean;
}) {
  const t = useTranslations("onboarding");
  const [live, setLive] = useState<OnboardingData>(initial);

  useEffect(() => {
    if (!formId) return;
    const form = document.getElementById(formId) as HTMLFormElement | null;
    if (!form) return;
    const sync = () => setLive({ ...initial, ...readForm(form) });
    form.addEventListener("input", sync);
    form.addEventListener("change", sync);
    return () => {
      form.removeEventListener("input", sync);
      form.removeEventListener("change", sync);
    };
  }, [formId, initial]);

  const name = live.businessName || t("aside.namePlaceholder");
  const initials =
    (live.businessName || "HP")
      .split(/\s+/)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase())
      .join("") || "HP";

  const [before, after = ""] = t("aside.previewText", { name: SLOT }).split(SLOT);
  const message = (
    <p className="text-[14px] leading-snug">
      {before}
      <span key={name} className="hp-flash rounded-[4px] font-semibold">
        {name}
      </span>
      {after}
      {live.emergencyPhone && (
        <span className="mt-2 block font-semibold">
          {t("aside.previewEmergency", { phone: live.emergencyPhone })}
        </span>
      )}
    </p>
  );

  if (compact) {
    return (
      <div className="rounded-[22px] bg-[#06121f] p-4 text-white">
        <p className="flex items-center gap-2 text-[12px] font-medium text-white/55">
          <Icon name="message" size={14} />
          {t("aside.previewTitle")}
        </p>
        <div className="mt-3 rounded-[18px] rounded-tl-[6px] bg-white/10 px-4 py-3 ring-1 ring-white/10">{message}</div>
      </div>
    );
  }

  return (
    <div className="relative mx-auto h-[600px] w-[min(520px,100%)] [perspective:1600px]">
      {/* Phone */}
      <div
        className="absolute left-1/2 top-1/2 h-[560px] w-[278px]"
        style={{ transform: "translate(-50%, -50%) rotateY(-14deg) rotateX(6deg)" }}
      >
        {/* Float lives on an inner layer so it can't override the tilt above */}
        <div className="hp-bob h-full w-full">
        <div className="relative h-full w-full rounded-[48px] bg-gradient-to-b from-[#4a5059] to-[#2a2e35] p-[7px] shadow-[0_50px_100px_-30px_rgba(0,0,0,0.75)]">
          <div className="relative flex h-full w-full flex-col overflow-hidden rounded-[42px] bg-[#05070b] text-white">
            {/* Status bar */}
            <div className="flex items-center justify-between px-6 pt-3.5 text-[12px] font-semibold">
              <span>09:42</span>
              <span className="h-[26px] w-[88px] rounded-full bg-black ring-1 ring-white/5" />
              <span className="flex items-center gap-1">
                <span className="h-[9px] w-[18px] rounded-[3px] border border-white/60 p-[1px]">
                  <span className="block h-full w-[70%] rounded-[1px] bg-white" />
                </span>
              </span>
            </div>

            {/* Thread header: the caller sees the business */}
            <div className="flex flex-col items-center border-b border-white/10 pb-3 pt-3">
              <span
                key={`initials-${initials}`}
                className="hp-pop flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-b from-[#1786bf] to-[#0369a1] text-[15px] font-semibold"
              >
                {initials}
              </span>
              <p key={`name-${name}`} className="hp-flash mt-1.5 max-w-[200px] truncate rounded px-1 text-[12px] font-medium">
                {name}
              </p>
            </div>

            <div className="flex flex-1 flex-col gap-3 px-3.5 pt-4">
              <p className="flex items-center justify-center gap-1.5 text-[11px] text-white/45">
                <Icon name="phone-missed" size={12} className="text-[#ff453a]" />
                09:42
              </p>
              <div className="max-w-[88%] self-start rounded-[18px] rounded-bl-[6px] bg-[#26262a] px-3.5 py-2.5">{message}</div>
              <p className="ml-1 text-[10px] text-white/35">{t("aside.previewTitle")}</p>
            </div>
            <span className="mx-auto mb-2 h-[4px] w-[110px] rounded-full bg-white/80" />
          </div>
        </div>
        </div>
      </div>

      {/* Floating card per step */}
      <div className="absolute inset-0">
        {step === "business" && <BusinessCard live={live} />}
        {step === "contact" && <ContactCard live={live} />}
        {step === "hours" && <HoursCard live={live} />}
        {step === "done" && (
          <Float className="right-0 top-12">
            <div className="flex items-center gap-2.5 rounded-full bg-white/12 py-2 pl-2 pr-4 ring-1 ring-white/20 backdrop-blur-xl">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-success text-white">
                <Icon name="check" size={16} />
              </span>
              <span className="text-[14px] font-semibold text-white">{t("done.badge")}</span>
            </div>
          </Float>
        )}
      </div>
    </div>
  );
}

function Float({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("hp-rise-in absolute", className)}>{children}</div>;
}

const glassCard =
  "rounded-[22px] bg-white/[0.08] p-4 text-white ring-1 ring-white/15 backdrop-blur-xl shadow-[0_30px_60px_-20px_rgba(0,0,0,0.6)]";

function BusinessCard({ live }: { live: OnboardingData }) {
  const t = useTranslations("onboarding");
  const trade = isOneOf(live.trade, tradeOptions) ? t(`business.trades.${live.trade}`) : null;
  const team = isOneOf(live.employees, employeeOptions) ? t(`business.employeeOptions.${live.employees}`) : null;
  if (!trade && !team) return null;
  return (
    <Float className="-right-2 bottom-16">
      <div className={cn(glassCard, "flex flex-col gap-2")}>
        {trade && (
          <span key={trade} className="hp-pop flex items-center gap-2 text-[14px] font-semibold">
            <Icon name="building" size={16} className="text-sky-300" />
            {trade}
          </span>
        )}
        {team && (
          <span key={team} className="hp-pop flex items-center gap-2 text-[13px] text-white/75">
            <Icon name="users" size={15} className="text-sky-300" />
            {team}
          </span>
        )}
      </div>
    </Float>
  );
}

function ContactCard({ live }: { live: OnboardingData }) {
  const t = useTranslations("onboarding");
  const radius = isOneOf(live.serviceRadius, serviceRadiusOptions) ? live.serviceRadius : null;
  const ringScale = { "10": 0.45, "25": 0.65, "50": 0.85, "100": 1 } as const;
  return (
    <>
      {live.mobile && (
        <Float className="-left-2 top-16">
          <div className={cn(glassCard, "py-3")}>
            <p className="text-[11px] text-white/55">{t("done.labels.mobile")}</p>
            <p key={live.mobile} className="hp-flash mt-0.5 rounded font-mono text-[14px]">
              {live.mobile}
            </p>
          </div>
        </Float>
      )}
      {(radius || live.city) && (
        <Float className="-right-2 bottom-10">
          <div className={cn(glassCard, "w-[200px]")}>
            <div className="relative mx-auto flex h-[120px] w-[120px] items-center justify-center">
              {[1, 0.7, 0.4].map((s) => (
                <span key={s} className="absolute inset-0 rounded-full border border-sky-300/25" style={{ transform: `scale(${s})` }} />
              ))}
              <span
                className="absolute inset-0 rounded-full bg-sky-400/20 ring-1 ring-sky-300/60 transition-transform duration-700 ease-[var(--ease-spring)]"
                style={{ transform: `scale(${radius ? ringScale[radius] : 0.2})` }}
              />
              <span className="relative flex h-7 w-7 items-center justify-center rounded-full bg-primary text-white shadow-[0_0_0_4px_rgba(56,189,248,0.25)]">
                <Icon name="home" size={14} />
              </span>
            </div>
            <p className="mt-3 text-center text-[13px] font-semibold">
              {[live.city, radius ? t(`contact.radiusOptions.${radius}`) : null].filter(Boolean).join(" · ")}
            </p>
          </div>
        </Float>
      )}
    </>
  );
}

function HoursCard({ live }: { live: OnboardingData }) {
  const t = useTranslations("onboarding");
  const days = live.days ?? [];
  const services = [
    ...(live.services ?? []).filter((s) => isOneOf(s, serviceOptions)).map((s) => t(`hours.options.${s}`)),
    ...(live.customService ? [live.customService] : []),
  ];
  return (
    <Float className="-right-2 bottom-8">
      <div className={cn(glassCard, "w-[248px]")}>
        <div className="grid grid-cols-7 gap-1">
          {weekdays.map((d) => {
            const on = days.includes(d);
            return (
              <span
                key={d}
                className={cn(
                  "flex h-8 items-center justify-center rounded-[8px] text-[10px] font-semibold transition-all duration-500 ease-[var(--ease-spring)]",
                  on ? "scale-100 bg-primary text-white" : "scale-90 bg-white/5 text-white/40",
                )}
              >
                {t(`hours.dayNames.${d}`).slice(0, 2)}
              </span>
            );
          })}
        </div>
        {live.start && live.end && (
          <p className="mt-3 flex items-center gap-2 font-mono text-[14px]">
            <Icon name="clock" size={15} className="text-sky-300" />
            {live.start} - {live.end}
          </p>
        )}
        {services.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {services.slice(0, 4).map((s) => (
              <span key={s} className="hp-pop rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-medium">
                {s}
              </span>
            ))}
            {services.length > 4 && (
              <span className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-medium">+{services.length - 4}</span>
            )}
          </div>
        )}
      </div>
    </Float>
  );
}
