"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/cn";
import Icon, { type IconName } from "@/components/ui/Icon";
import { Badge, Panel, StageGlow, Toggle, rise } from "../kit";

const extras: { key: string; icon: IconName }[] = [
  { key: "scheduling", icon: "calendar" },
  { key: "voiceNotes", icon: "mic" },
  { key: "summary", icon: "note" },
];

const transcript = ["agent1", "caller1", "agent2", "caller2", "agent3", "caller3", "agent4"] as const;

/** Paid AI add-ons: the calling agent (with a sample call) and what's next. */
export default function AiFeatures({ businessName }: { businessName: string }) {
  const t = useTranslations("dashboard.ai");
  const [agentOn, setAgentOn] = useState(false);
  const [notify, setNotify] = useState<string[]>([]);

  return (
    <div className="auth-rise flex flex-col gap-5 sm:gap-6">
      {/* Calling agent: night-blue stage */}
      <section style={rise(1)} className="relative overflow-hidden rounded-[28px] bg-[#06121f] p-6 text-white sm:p-8 lg:p-10">
        <StageGlow floor />
        <div className="relative grid gap-8 lg:grid-cols-[1fr_1.05fr] lg:items-center lg:gap-12">
          <div>
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-sky-400/15 text-sky-300 ring-1 ring-inset ring-sky-300/25">
              <Icon name="sparkle" size={20} filled />
            </span>
            <h2 className="mt-5 text-balance text-[30px] font-semibold leading-[1.05] tracking-[-0.04em] sm:text-[36px]">{t("agentTitle")}</h2>
            <p className="mt-3 max-w-md text-pretty text-[15px] leading-relaxed text-white/65 sm:text-[16px]">{t("agentBody")}</p>

            <ul className="mt-6 flex flex-col gap-2.5">
              {(["announce", "noRecording", "emergency"] as const).map((k) => (
                <li key={k} className="flex items-start gap-2.5 text-[14px] text-white/80">
                  <Icon name="check" size={16} className="mt-0.5 shrink-0 text-sky-300" />
                  {t(`rules.${k}`)}
                </li>
              ))}
            </ul>

            <div className="mt-7 flex flex-wrap items-center gap-3 rounded-[20px] bg-white/[0.06] p-3 pl-4 ring-1 ring-inset ring-white/10">
              <div className="min-w-0 flex-1">
                <p className="text-[14px] font-semibold">{t("agentToggle")}</p>
                <p key={String(agentOn)} className="hp-pop mt-0.5 text-[13px] text-white/60">
                  {agentOn ? t("agentOnNote") : t("agentOffNote")}
                </p>
              </div>
              <Toggle checked={agentOn} onChange={setAgentOn} label={t("agentToggle")} />
            </div>
          </div>

          {/* Sample call */}
          <div className="rounded-[24px] bg-white/[0.05] p-4 ring-1 ring-inset ring-white/10 sm:p-5">
            <div className="flex items-center justify-between gap-3">
              <p className="flex items-center gap-2 text-[13px] font-medium text-white/60">
                <Icon name="phone" size={14} className="text-sky-300" />
                {t("sampleCall")}
              </p>
              <span className="font-mono text-[12px] text-white/45">01:12</span>
            </div>
            <ol className="mt-4 flex flex-col gap-2">
              {transcript.map((line, k) => {
                const agent = line.startsWith("agent");
                return (
                  <li
                    key={line}
                    style={{ animationDelay: `${300 + k * 120}ms` }}
                    className={cn("hp-rise-in flex max-w-[88%] flex-col", agent ? "items-start" : "items-end self-end")}
                  >
                    <span className="mb-1 px-1 text-[11px] text-white/45">{agent ? t("agent") : t("caller")}</span>
                    <span
                      className={cn(
                        "text-pretty rounded-[18px] px-3.5 py-2 text-[14px] leading-relaxed",
                        agent ? "rounded-tl-[6px] bg-white/[0.1] ring-1 ring-inset ring-white/10" : "rounded-tr-[6px] bg-sky-300 text-[#06121f]",
                      )}
                    >
                      {t(`transcript.${line}`, { name: businessName })}
                    </span>
                  </li>
                );
              })}
            </ol>
            <p
              style={{ animationDelay: `${300 + transcript.length * 120}ms` }}
              className="hp-rise-in mt-4 flex items-center gap-2 rounded-[14px] bg-success/15 px-3 py-2 text-[13px] font-medium text-white"
            >
              <Icon name="clipboard" size={15} className="text-success" />
              {t("cardCreated")}
            </p>
          </div>
        </div>
      </section>

      {/* More add-ons */}
      <div style={rise(2)}>
        <h2 className="text-[20px] font-semibold tracking-[-0.03em] text-ink">{t("moreTitle")}</h2>
        <p className="mt-1 text-[14px] text-slate">{t("moreBody")}</p>
      </div>
      <div style={rise(3)} className="grid gap-3 sm:gap-4 md:grid-cols-3">
        {extras.map((x) => {
          const on = notify.includes(x.key);
          return (
            <Panel key={x.key} as="article" className="flex flex-col p-5">
              <div className="flex items-start justify-between gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-soft text-primary">
                  <Icon name={x.icon} size={20} />
                </span>
                <Badge icon="clock">{t("soon")}</Badge>
              </div>
              <h3 className="mt-4 text-[16px] font-semibold tracking-[-0.02em] text-ink">{t(`extras.${x.key}.title`)}</h3>
              <p className="mt-1.5 flex-1 text-pretty text-[14px] leading-relaxed text-slate">{t(`extras.${x.key}.body`)}</p>
              <button
                type="button"
                onClick={() => setNotify((all) => (on ? all.filter((k) => k !== x.key) : [...all, x.key]))}
                aria-pressed={on}
                className={cn(
                  "mt-5 inline-flex h-10 items-center justify-center gap-2 self-start rounded-full px-4 text-[13px] font-semibold transition-[background-color,color,transform,border-color] duration-200 active:scale-[0.96]",
                  on ? "bg-ink text-canvas" : "border border-line text-graphite hover:border-ink/25 hover:text-ink",
                )}
              >
                <Icon name={on ? "check" : "bell"} size={15} />
                <span key={String(on)} className="hp-pop">
                  {on ? t("notifyOn") : t("notify")}
                </span>
              </button>
            </Panel>
          );
        })}
      </div>

      <Panel style={rise(4)} className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:gap-4 sm:p-6">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary-soft text-primary">
          <Icon name="euro" size={20} />
        </span>
        <div>
          <p className="text-[15px] font-semibold text-ink">{t("pricingTitle")}</p>
          <p className="mt-0.5 text-pretty text-[14px] leading-relaxed text-slate">{t("pricingBody")}</p>
        </div>
      </Panel>
    </div>
  );
}
