import { cn } from "@/lib/cn";

export type ScreenCopy = {
  missedCall: string;
  missedTime: string;
  autoReplyLabel: string;
  autoReply: string;
  customerReply: string;
  jobCard: string;
  labels: { name: string; address: string; problem: string; urgency: string };
  values: { name: string; address: string; problem: string; urgency: string };
  slots: string[];
  book: string;
  booked: string;
  bookedSub: string;
  /** Locale-formatted lock-screen date and "now" label. */
  date: string;
  now: string;
};

/** CSS-pixel size of the screen DOM; PhoneModel maps it onto the glass. */
export const SCREEN_PX = { w: 360, h: 764 } as const;

const NUMBER = "+49 355 ••• ••12";

/**
 * The live UI rendered onto the phone's glass (real DOM projected into 3D, so
 * it stays sharp at any camera distance). Each story beat is a layer that
 * crossfades in when `step` reaches it.
 *
 *   0 incoming call · 1 missed call · 2 text thread · 3 job card · 4 booked
 */
export default function PhoneScreen({ step, copy }: { step: number; copy: ScreenCopy }) {
  const layer = (from: number, to = from) =>
    cn(
      "absolute inset-0 flex flex-col transition-[opacity,transform,filter] duration-700 ease-[var(--ease-out-expo)]",
      step >= from && step <= to
        ? "opacity-100 translate-y-0 scale-100 blur-0"
        : step < from
          ? "pointer-events-none opacity-0 translate-y-6 scale-[0.98] blur-[6px]"
          : "pointer-events-none opacity-0 -translate-y-6 scale-[1.02] blur-[6px]",
    );

  return (
    <div
      className="relative overflow-hidden rounded-[46px] bg-[#05070b] font-sans text-white antialiased select-none"
      style={{ width: SCREEN_PX.w, height: SCREEN_PX.h }}
    >
      {/* Wallpaper */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 70% at 20% 0%, #0b5f8f 0%, transparent 60%), radial-gradient(90% 60% at 100% 100%, #0c3b5c 0%, transparent 65%), linear-gradient(180deg, #071422 0%, #04070c 100%)",
        }}
      />

      {/* Status bar + island */}
      <div className="relative z-10 flex items-center justify-between px-8 pt-[18px] text-[15px] font-semibold tabular-nums">
        <span>09:42</span>
        <span className="h-[34px] w-[118px] rounded-full bg-black" />
        <span className="flex items-center gap-1.5">
          <span className="flex items-end gap-[2px]">
            {[5, 7, 9, 11].map((h) => (
              <span key={h} className="w-[3px] rounded-sm bg-white" style={{ height: h }} />
            ))}
          </span>
          <span className="ml-1 h-[12px] w-[24px] rounded-[4px] border border-white/60 p-[1.5px]">
            <span className="block h-full w-[70%] rounded-[2px] bg-white" />
          </span>
        </span>
      </div>

      <div className="relative flex-1" style={{ height: SCREEN_PX.h - 52 }}>
        {/* 0 · Incoming call */}
        <div className={layer(0)}>
          <div className="mt-20 flex flex-col items-center text-center">
            <p className="font-mono text-[30px] font-medium tracking-tight">{NUMBER}</p>
            <p className="mt-2 text-[15px] text-white/60">Cottbus</p>
          </div>
          <div className="mt-auto mb-28 flex justify-around px-10">
            <span className="relative flex h-[76px] w-[76px] items-center justify-center rounded-full bg-[#ff3b30]">
              <PhoneGlyph className="rotate-[135deg]" />
            </span>
            <span className="relative flex h-[76px] w-[76px] items-center justify-center">
              <span className="hp-ring absolute inset-0 rounded-full bg-[#30d158]/50" />
              <span className="hp-ring hp-ring-delay absolute inset-0 rounded-full bg-[#30d158]/40" />
              <span className="relative flex h-full w-full items-center justify-center rounded-full bg-[#30d158]">
                <PhoneGlyph />
              </span>
            </span>
          </div>
        </div>

        {/* 1 · Missed call (lock screen) */}
        <div className={layer(1)}>
          <div className="mt-10 text-center">
            <p className="text-[19px] font-medium text-white/75">{copy.date}</p>
            <p className="text-[96px] font-semibold leading-none tracking-[-0.04em]">09:42</p>
          </div>
          <div className="mx-4 mt-10 rounded-[26px] bg-white/14 p-4 backdrop-blur-xl ring-1 ring-white/10">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-[12px] bg-[#ff3b30]">
                <PhoneGlyph missed />
              </span>
              <div className="min-w-0 flex-1">
                <p className="flex justify-between text-[15px] font-semibold">
                  {copy.missedCall}
                  <span className="text-[13px] font-normal text-white/55">{copy.now}</span>
                </p>
                <p className="truncate font-mono text-[14px] text-white/75">{NUMBER}</p>
              </div>
            </div>
          </div>
          <div className="mx-4 mt-2.5 rounded-[26px] bg-white/10 p-4 backdrop-blur-xl ring-1 ring-white/10">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-[12px] bg-[#0369a1]">
                <BubbleGlyph />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[15px] font-semibold">HandyPlan</p>
                <p className="truncate text-[14px] text-white/75">{copy.autoReplyLabel}</p>
              </div>
            </div>
          </div>
        </div>

        {/* 2 · Text thread */}
        <div className={cn(layer(2), "bg-[#05070b]")}>
          <div className="flex flex-col items-center border-b border-white/10 pb-3 pt-2">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-b from-[#7d8794] to-[#4b535e] text-[17px] font-semibold">
              KN
            </span>
            <p className="mt-1 font-mono text-[12px] text-white/70">{NUMBER}</p>
          </div>
          <div className="flex flex-1 flex-col gap-3 px-4 pt-5">
            <p className="text-center text-[11px] text-white/45">{copy.missedTime}</p>
            <div
              className={cn(
                "max-w-[82%] self-end transition-all delay-200 duration-700 ease-[var(--ease-spring)]",
                step >= 2 ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
              )}
            >
              <p className="mb-1 text-right text-[11px] font-medium text-[#64c3ff]">
                {copy.autoReplyLabel}
              </p>
              <p className="rounded-[20px] rounded-br-[6px] bg-[#0a84ff] px-4 py-2.5 text-[15px] leading-snug">
                {copy.autoReply}
              </p>
            </div>
            <div
              className={cn(
                "hp-typing flex w-[64px] gap-1 self-start rounded-[20px] bg-[#26262a] px-4 py-3.5 transition-opacity duration-300",
                step === 2 ? "opacity-100 delay-700" : "opacity-0",
              )}
            >
              <span className="h-2 w-2 rounded-full bg-white/70" />
              <span className="h-2 w-2 rounded-full bg-white/70" />
              <span className="h-2 w-2 rounded-full bg-white/70" />
            </div>
            <p
              className={cn(
                "-mt-[52px] max-w-[80%] self-start rounded-[20px] rounded-bl-[6px] bg-[#26262a] px-4 py-2.5 text-[15px] leading-snug transition-all duration-700 ease-[var(--ease-spring)]",
                step === 2 ? "translate-y-0 opacity-100 delay-[1600ms]" : "translate-y-4 opacity-0",
              )}
            >
              {copy.customerReply}
            </p>
          </div>
        </div>

        {/* 3 · Job card in the app (its twin lifts off the glass in 3D) */}
        <div className={cn(layer(3), "bg-[#f4f6f9] text-[#0f172a]")}>
          <div className="px-5 pt-3">
            <p className="text-[13px] font-semibold text-[#0369a1]">HandyPlan</p>
            <p className="text-[30px] font-bold tracking-[-0.03em]">{copy.jobCard}</p>
          </div>
          <div className="mx-4 mt-4 rounded-[22px] bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,0.08)]">
            <JobRows copy={copy} />
          </div>
          <div className="mx-4 mt-3 space-y-2.5 opacity-40">
            <div className="h-16 rounded-[18px] bg-white" />
            <div className="h-16 rounded-[18px] bg-white" />
          </div>
        </div>

        {/* 4 · Booked */}
        <div className={cn(layer(4, 9), "items-center bg-[#f4f6f9] text-[#0f172a]")}>
          <div className="mt-28 flex h-[112px] w-[112px] items-center justify-center rounded-full bg-[#10b981] shadow-[0_18px_40px_rgba(16,185,129,0.4)]">
            <svg viewBox="0 0 24 24" className="h-14 w-14" fill="none" stroke="white" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
              <path
                d="m5 12.5 4.5 4.5L19 7.5"
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={step >= 4 ? 0 : 1}
                style={{ transition: "stroke-dashoffset 700ms cubic-bezier(0.16,1,0.3,1) 250ms" }}
              />
            </svg>
          </div>
          <p className="mt-7 text-[30px] font-bold tracking-[-0.03em]">{copy.booked}</p>
          <p className="mt-1.5 max-w-[240px] text-center text-[15px] text-[#64748b]">{copy.bookedSub}</p>
          <div className="mt-8 w-[280px] rounded-[20px] bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,0.08)]">
            <p className="text-[12px] font-semibold uppercase tracking-wide text-[#0369a1]">{copy.slots[0]}</p>
            <p className="mt-1 text-[16px] font-semibold">{copy.values.name}</p>
            <p className="text-[14px] text-[#64748b]">{copy.values.address}</p>
          </div>
        </div>
      </div>

      {/* Home indicator */}
      <span
        className={cn(
          "absolute bottom-2.5 left-1/2 h-[5px] w-[134px] -translate-x-1/2 rounded-full transition-colors duration-700",
          step >= 3 ? "bg-black/80" : "bg-white/85",
        )}
      />
    </div>
  );
}

/** Job details, shared by the in-screen card and the floating 3D card. */
export function JobRows({ copy, large = false }: { copy: ScreenCopy; large?: boolean }) {
  const rows = ["name", "address", "problem"] as const;
  return (
    <div className={cn("text-[#0f172a]", large ? "text-[15px]" : "text-[13px]")}>
      <div className="mb-3 flex items-center justify-between">
        <span className="rounded-full bg-[#fef3c7] px-2.5 py-1 text-[11px] font-semibold text-[#92400e]">
          {copy.labels.urgency}: {copy.values.urgency}
        </span>
        <span className="font-mono text-[11px] text-[#64748b]">09:43</span>
      </div>
      <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5">
        {rows.map((r) => (
          <div key={r} className="contents">
            <dt className="text-[#64748b]">{copy.labels[r]}</dt>
            <dd className="truncate font-medium">{copy.values[r]}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-4 flex items-center gap-2">
        {copy.slots.map((s, i) => (
          <span
            key={s}
            className={cn(
              "rounded-[10px] px-2.5 py-1.5 text-[11px] font-semibold",
              i === 0 ? "bg-[#e0f2fe] text-[#0369a1] ring-1 ring-[#0369a1]/30" : "bg-[#f1f5f9] text-[#64748b]",
            )}
          >
            {s}
          </span>
        ))}
        <span className="ml-auto rounded-[10px] bg-[#0369a1] px-3.5 py-1.5 text-[11px] font-semibold text-white">
          {copy.book}
        </span>
      </div>
    </div>
  );
}

function PhoneGlyph({ className, missed = false }: { className?: string; missed?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className={cn("h-7 w-7", missed && "h-6 w-6", className)} fill="white">
      <path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1l-2.3 2.2Z" />
    </svg>
  );
}

function BubbleGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="white">
      <path d="M12 3.5c-5 0-9 3.3-9 7.5 0 2.3 1.2 4.3 3.1 5.7L5.5 20l3.9-2.1c.8.2 1.7.3 2.6.3 5 0 9-3.3 9-7.5S17 3.5 12 3.5Z" />
    </svg>
  );
}
