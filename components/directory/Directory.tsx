"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";
import type { Pro } from "@/lib/mock/dashboard";
import { cn } from "@/lib/cn";
import { useIsClient } from "@/lib/useIsClient";
import Icon, { type IconName } from "@/components/ui/Icon";
import { Badge, EmptyState, StageGlow, btnIcon, btnPrimary, btnSecondary } from "@/components/dashboard/kit";
import AuthPrompt, { type PromptIntent } from "./AuthPrompt";
import FilterPanel from "./FilterPanel";
import ProCard from "./ProCard";
import { EMPTY, SORTS, activeCount, facetCounts, matches, sortPros, toQuery, type Filters } from "./filters";

const tradeIcon: Record<string, IconName> = {
  electrician: "bolt",
  plumber: "drop",
  hvac: "flame",
  carpenter: "hammer",
  painter: "brush",
  roofer: "home",
  tiler: "grid",
  locksmith: "key",
  chimneySweep: "flame",
  mechanic: "car",
};

/**
 * Public directory. Browsing and filtering are open to everyone; booking or
 * contacting opens the sign-up prompt. Filters live in the URL (shareable,
 * survive reloads) and every option shows its result count.
 */
export default function Directory({
  pros,
  trades,
  sample,
  initial,
}: {
  pros: Pro[];
  trades: readonly string[];
  sample: boolean;
  initial: Filters;
}) {
  const t = useTranslations("directory");
  const tTrades = useTranslations("onboarding.business.trades");
  const tServices = useTranslations("onboarding.hours.options");
  const tLang = useTranslations("directory.languageNames");
  const isClient = useIsClient();
  const [f, setF] = useState<Filters>(initial);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [intent, setIntent] = useState<PromptIntent>();
  const [promptOpen, setPromptOpen] = useState(false);
  const results = useRef<HTMLDivElement>(null);
  const closePrompt = useCallback(() => setPromptOpen(false), []);

  const update = (patch: Partial<Filters>) => setF((cur) => ({ ...cur, ...patch }));
  const ask = (next: PromptIntent) => {
    setIntent(next);
    setPromptOpen(true);
  };

  // Keep the URL in sync (no navigation, no server round trip).
  useEffect(() => {
    const query = toQuery(f);
    if (window.location.search !== query) window.history.replaceState(null, "", `${window.location.pathname}${query}`);
  }, [f]);

  // Phone sheet: lock page scroll, Escape closes.
  useEffect(() => {
    if (!sheetOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSheetOpen(false);
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [sheetOpen]);

  const tradeLabel = useCallback((tr: string) => tTrades(tr), [tTrades]);
  const visible = useMemo(() => sortPros(pros.filter((p) => matches(p, f, tradeLabel)), f.sort), [pros, f, tradeLabel]);
  const counts = useMemo(() => facetCounts(pros, f, tradeLabel), [pros, f, tradeLabel]);
  const extra = activeCount(f);

  // Removable chips for everything that's switched on.
  const chips: { key: string; label: string; clear: () => void }[] = [
    ...(f.q.trim() ? [{ key: "q", label: `"${f.q.trim()}"`, clear: () => update({ q: "" }) }] : []),
    ...(f.trade !== "all" ? [{ key: "trade", label: tTrades(f.trade), clear: () => update({ trade: "all" }) }] : []),
    ...(f.km ? [{ key: "km", label: t("filters.km", { km: f.km }), clear: () => update({ km: 0 }) }] : []),
    ...(f.when !== "any" ? [{ key: "when", label: t(`filters.whenOptions.${f.when}`), clear: () => update({ when: "any" }) }] : []),
    ...f.times.map((tm) => ({ key: `t-${tm}`, label: t(`filters.timeOptions.${tm}`), clear: () => update({ times: f.times.filter((x) => x !== tm) }) })),
    ...f.services.map((s) => ({ key: `s-${s}`, label: tServices(s), clear: () => update({ services: f.services.filter((x) => x !== s) }) })),
    ...f.languages.map((l) => ({ key: `l-${l}`, label: tLang(l), clear: () => update({ languages: f.languages.filter((x) => x !== l) }) })),
    ...(f.master ? [{ key: "master", label: t("filters.master"), clear: () => update({ master: false }) }] : []),
    ...(f.emergency ? [{ key: "emergency", label: t("filters.emergency"), clear: () => update({ emergency: false }) }] : []),
    ...(f.fast ? [{ key: "fast", label: t("filters.fast"), clear: () => update({ fast: false }) }] : []),
  ];
  const clearAll = () => setF({ ...EMPTY, sort: f.sort });

  const quick = [
    { key: "today", label: t("filters.whenOptions.today"), icon: "clock" as const, on: f.when === "today", toggle: () => update({ when: f.when === "today" ? "any" : "today" }) },
    { key: "emergency", label: t("filters.emergency"), icon: "alert" as const, on: f.emergency, toggle: () => update({ emergency: !f.emergency }) },
    { key: "master", label: t("filters.master"), icon: "award" as const, on: f.master, toggle: () => update({ master: !f.master }) },
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Hero search: night-blue stage */}
      <section className="relative overflow-hidden rounded-[32px] bg-[#06121f] px-5 py-8 text-white sm:px-10 sm:py-12 lg:px-14 lg:py-14">
        <StageGlow floor />
        <div className="relative max-w-3xl">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/[0.08] px-3.5 py-1.5 text-[13px] font-medium text-white/80 ring-1 ring-inset ring-white/15 backdrop-blur-xl">
            <Icon name="map-pin" size={14} className="text-sky-300" />
            {t("hero.area")}
          </p>
          <h1 className="mt-5 text-balance text-[36px] font-semibold leading-[1.03] tracking-[-0.045em] sm:text-[52px] lg:text-[64px]">{t("title")}</h1>
          <p className="mt-4 max-w-xl text-pretty text-[16px] leading-relaxed text-white/65 sm:text-[17px]">{t("subtitle")}</p>

          <form
            role="search"
            onSubmit={(e) => {
              e.preventDefault();
              results.current?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
            className="mt-8 flex items-center gap-2 rounded-full bg-surface p-1.5 pl-5 shadow-[0_20px_50px_rgba(0,0,0,0.35)] ring-1 ring-white/10"
          >
            <Icon name="search" size={20} className="shrink-0 text-muted" />
            <label htmlFor="directory-search" className="sr-only">
              {t("search")}
            </label>
            <input
              id="directory-search"
              type="search"
              value={f.q}
              onChange={(e) => update({ q: e.target.value })}
              placeholder={t("search")}
              className="h-12 min-w-0 flex-1 bg-transparent text-[16px] text-ink placeholder:text-muted focus:outline-none"
            />
            <button type="submit" className={cn(btnPrimary, "h-12 px-4 sm:px-6")}>
              <span className="hidden sm:inline">{t("hero.searchCta")}</span>
              <Icon name="arrow-right" size={17} className="sm:hidden" />
            </button>
          </form>

          <div className="mt-4 flex flex-wrap gap-2">
            {quick.map((qk) => (
              <button
                key={qk.key}
                type="button"
                onClick={qk.toggle}
                aria-pressed={qk.on}
                className={cn(
                  "inline-flex h-10 items-center gap-2 rounded-full px-4 text-[13px] font-medium ring-1 ring-inset transition-[background-color,color,transform] duration-200 active:scale-[0.96]",
                  qk.on ? "bg-white text-[#06121f] ring-white" : "bg-white/[0.06] text-white/80 ring-white/15 hover:bg-white/[0.12] hover:text-white",
                )}
              >
                <Icon name={qk.on ? "check" : qk.icon} size={14} />
                {qk.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Browse by trade */}
      <section aria-labelledby="trades-title">
        <h2 id="trades-title" className="text-[20px] font-semibold tracking-[-0.03em] text-ink">
          {t("browseTitle")}
        </h2>
        {/* Wrapping icon pills on desktop, one swipeable row on phones */}
        <div className="-mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
          {["all", ...trades].map((tr) => {
            const on = f.trade === tr;
            const n = counts.trades[tr] ?? 0;
            return (
              <button
                key={tr}
                type="button"
                onClick={() => update({ trade: on && tr !== "all" ? "all" : tr })}
                aria-pressed={on}
                className={cn(
                  "inline-flex h-12 shrink-0 items-center gap-2.5 rounded-full border pl-1.5 pr-4 text-[14px] font-medium transition-[background-color,border-color,color,transform] duration-200 active:scale-[0.97]",
                  on ? "border-ink bg-ink text-canvas" : "border-line bg-surface text-ink hover:border-ink/25",
                  !n && !on && "opacity-45",
                )}
              >
                <span className={cn("flex h-9 w-9 items-center justify-center rounded-full", on ? "bg-canvas/15 text-canvas" : "bg-primary-soft text-primary")}>
                  <Icon name={tr === "all" ? "grid" : tradeIcon[tr]} size={16} />
                </span>
                <span className="whitespace-nowrap">{tr === "all" ? t("allTrades") : tTrades(tr)}</span>
                <span className={cn("font-mono text-[12px]", on ? "text-canvas/65" : "text-muted")}>{n}</span>
              </button>
            );
          })}
        </div>
      </section>

      <div ref={results} className="grid scroll-mt-28 gap-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:items-start">
        {/* Desktop sidebar */}
        <aside aria-label={t("filters.title")} className="hidden rounded-[26px] border border-line bg-surface p-5 lg:sticky lg:top-24 lg:block lg:max-h-[calc(100svh-7rem)] lg:overflow-y-auto">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-[16px] font-semibold text-ink">{t("filters.title")}</p>
            {extra > 0 && (
              <button type="button" onClick={clearAll} className="text-[13px] font-medium text-primary hover:underline">
                {t("filters.clearAll")}
              </button>
            )}
          </div>
          <FilterPanel scope="side" filters={f} counts={counts} onChange={update} />
        </aside>

        {/* Results */}
        <div className="flex min-w-0 flex-col gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-[15px] font-semibold text-ink" aria-live="polite">
              {t("results", { count: visible.length })}
            </p>
            {sample && (
              <span title={t("sampleHint")}>
                <Badge tone="warning" icon="alert">
                  {t("sample")}
                </Badge>
              </span>
            )}
            <div className="ml-auto flex items-center gap-2">
              <button type="button" onClick={() => setSheetOpen(true)} className={cn(btnSecondary, "h-10 lg:hidden")}>
                <Icon name="sliders" size={16} />
                {t("filters.title")}
                {extra > 0 && <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 font-mono text-[11px] text-white">{extra}</span>}
              </button>
              <label className="relative">
                <span className="sr-only">{t("sort.label")}</span>
                <select
                  value={f.sort}
                  onChange={(e) => update({ sort: e.target.value as Filters["sort"] })}
                  className="h-10 cursor-pointer appearance-none rounded-full border border-line bg-surface pl-4 pr-9 text-[14px] font-medium text-graphite transition-colors hover:border-ink/25 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15"
                >
                  {SORTS.map((s) => (
                    <option key={s} value={s}>
                      {t(`sort.${s}`)}
                    </option>
                  ))}
                </select>
                <Icon name="chevron-down" size={15} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-muted" />
              </label>
            </div>
          </div>

          {chips.length > 0 && (
            <ul className="flex flex-wrap items-center gap-2" aria-label={t("filters.active")}>
              {chips.map((c) => (
                <li key={c.key}>
                  <button
                    type="button"
                    onClick={c.clear}
                    aria-label={t("filters.remove", { label: c.label })}
                    className="hp-pop inline-flex h-9 items-center gap-1.5 rounded-full bg-primary/10 pl-3.5 pr-2.5 text-[13px] font-medium text-graphite transition-colors hover:bg-primary/15"
                  >
                    {c.label}
                    <Icon name="close" size={13} className="text-primary" />
                  </button>
                </li>
              ))}
              <li>
                <button type="button" onClick={clearAll} className="h-9 px-2 text-[13px] font-medium text-slate underline-offset-4 hover:text-ink hover:underline">
                  {t("filters.clearAll")}
                </button>
              </li>
            </ul>
          )}

          {visible.length === 0 ? (
            <div className="rounded-[28px] border border-line bg-surface">
              <EmptyState
                icon="search"
                title={t("emptyTitle")}
                body={t("emptyBody")}
                action={
                  <button type="button" onClick={clearAll} className={btnSecondary}>
                    {t("filters.clearAll")}
                  </button>
                }
              />
            </div>
          ) : (
            <ul className="grid gap-4 md:grid-cols-2">
              {visible.map((p) => (
                <li key={p.id} className="min-w-0">
                  <ProCard pro={p} onBook={(k) => ask({ kind: "book", pro: p, slotIndex: k })} onContact={() => ask({ kind: "contact", pro: p })} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Phone filter sheet (portalled out of the animated page wrapper) */}
      {isClient &&
        createPortal(
          <div className={cn("fixed inset-0 z-[55] lg:hidden", !sheetOpen && "pointer-events-none")} aria-hidden={!sheetOpen}>
            <div
              onClick={() => setSheetOpen(false)}
              className={cn("absolute inset-0 bg-[#06121f]/50 backdrop-blur-[2px] transition-opacity duration-300", sheetOpen ? "opacity-100" : "opacity-0")}
            />
            <div
              role="dialog"
              aria-modal="true"
              aria-label={t("filters.title")}
              inert={!sheetOpen}
              className={cn(
                "absolute inset-x-0 bottom-0 flex max-h-[92svh] flex-col rounded-t-[28px] bg-surface shadow-[var(--shadow-float)] transition-transform ease-[var(--ease-out-expo)]",
                sheetOpen ? "translate-y-0 duration-500" : "translate-y-full duration-300",
              )}
            >
              <div className="flex items-center justify-between border-b border-line px-5 py-3">
                <p className="text-[17px] font-semibold text-ink">{t("filters.title")}</p>
                <button type="button" onClick={() => setSheetOpen(false)} aria-label={t("prompt.close")} className={btnIcon}>
                  <Icon name="close" size={20} />
                </button>
              </div>
              <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pt-5">
                <FilterPanel scope="sheet" filters={f} counts={counts} onChange={update} />
              </div>
              <div className="flex gap-2 border-t border-line bg-surface px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3">
                <button type="button" onClick={clearAll} className={cn(btnSecondary, "h-12")}>
                  {t("filters.clear")}
                </button>
                <button type="button" onClick={() => setSheetOpen(false)} className={cn(btnPrimary, "h-12 flex-1")}>
                  {t("filters.show", { count: visible.length })}
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}

      <AuthPrompt intent={intent} open={promptOpen} onClose={closePrompt} />
    </div>
  );
}
