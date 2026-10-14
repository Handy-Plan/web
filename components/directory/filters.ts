import type { Pro, ProSlot } from "@/lib/mock/dashboard";

/**
 * Directory filter model: matching, per-option counts ("how many results if I
 * pick this") and the URL encoding, so a filtered view can be shared and
 * survives a reload. Pure functions, no React.
 */

export const WHEN = ["any", "today", "tomorrow", "week", "weekend"] as const;
export const TIMES = ["morning", "afternoon", "evening"] as const;
export const SERVICES = ["repair", "installation", "maintenance", "inspection", "consultation", "emergency"] as const;
export const LANGUAGES = ["de", "en", "pl", "ar", "ru"] as const;
export const SORTS = ["soonest", "closest", "replies"] as const;
export const MAX_KM = 25; // slider end = any distance
export const FAST_REPLY = 60; // minutes

export type When = (typeof WHEN)[number];
export type Sort = (typeof SORTS)[number];

export type Filters = {
  q: string;
  trade: string;
  /** 0 = any distance */
  km: number;
  when: When;
  times: string[];
  services: string[];
  languages: string[];
  master: boolean;
  emergency: boolean;
  fast: boolean;
  sort: Sort;
};

export const EMPTY: Filters = {
  q: "",
  trade: "all",
  km: 0,
  when: "any",
  times: [],
  services: [],
  languages: [],
  master: false,
  emergency: false,
  fast: false,
  sort: "soonest",
};

type Group = "q" | "trade" | "km" | "when" | "times" | "services" | "languages" | "master" | "emergency" | "fast";

const inTime = (s: ProSlot, time: string) =>
  time === "morning" ? s.minutes < 12 * 60 : time === "afternoon" ? s.minutes >= 12 * 60 && s.minutes < 17 * 60 : s.minutes >= 17 * 60;

const inWhen = (s: ProSlot, when: When) =>
  when === "any" ||
  (when === "today" && s.offset === 0) ||
  (when === "tomorrow" && s.offset === 1) ||
  (when === "week" && s.offset <= 6) ||
  (when === "weekend" && s.weekend && s.offset <= 6);

/** Does `p` pass every filter except `skip` (used for option counts)? */
export function matches(p: Pro, f: Filters, tradeLabel: (t: string) => string, skip?: Group) {
  const q = f.q.trim().toLowerCase();
  if (skip !== "q" && q && ![p.name, p.district, p.about, tradeLabel(p.trade)].some((v) => v.toLowerCase().includes(q))) return false;
  if (skip !== "trade" && f.trade !== "all" && p.trade !== f.trade) return false;
  if (skip !== "km" && f.km && p.km > f.km) return false;
  if (skip !== "master" && f.master && !p.master) return false;
  if (skip !== "emergency" && f.emergency && !p.emergency) return false;
  if (skip !== "fast" && f.fast && p.replyMinutes > FAST_REPLY) return false;
  // Services: must offer all picked. Languages: speaks any picked.
  if (skip !== "services" && !f.services.every((s) => p.services.includes(s))) return false;
  if (skip !== "languages" && f.languages.length && !f.languages.some((l) => p.languages.includes(l))) return false;
  // Availability: one slot has to fit both the day and a picked time of day.
  const when = skip === "when" ? "any" : f.when;
  const times = skip === "times" ? [] : f.times;
  if (when !== "any" || times.length) {
    return p.slots.some((s) => inWhen(s, when) && (!times.length || times.some((t) => inTime(s, t))));
  }
  return true;
}

export function sortPros(list: Pro[], sort: Sort) {
  return [...list].sort((a, b) =>
    sort === "closest" ? a.km - b.km : sort === "replies" ? a.replyMinutes - b.replyMinutes : a.soonest - b.soonest,
  );
}

/** Result count for every option of every group, given the other filters. */
export function facetCounts(pros: Pro[], f: Filters, tradeLabel: (t: string) => string) {
  // Results if this option were added on top of everything else that's on.
  const count = (patch: Partial<Filters>) => pros.filter((p) => matches(p, { ...f, ...patch }, tradeLabel)).length;
  const without = (group: Group) => pros.filter((p) => matches(p, f, tradeLabel, group));

  const byTrade = without("trade");
  const trades: Record<string, number> = { all: byTrade.length };
  byTrade.forEach((p) => (trades[p.trade] = (trades[p.trade] ?? 0) + 1));

  return {
    trades,
    when: Object.fromEntries(WHEN.map((w) => [w, without("when").filter((p) => matches(p, { ...f, when: w }, tradeLabel)).length])),
    times: Object.fromEntries(TIMES.map((t) => [t, without("times").filter((p) => matches(p, { ...f, times: [t] }, tradeLabel)).length])),
    services: Object.fromEntries(
      SERVICES.map((s) => [s, count({ services: f.services.includes(s) ? f.services : [...f.services, s] })]),
    ),
    languages: Object.fromEntries(LANGUAGES.map((l) => [l, without("languages").filter((p) => p.languages.includes(l)).length])),
    master: count({ master: true }),
    emergency: count({ emergency: true }),
    fast: count({ fast: true }),
  };
}

/** How many filters (beyond search + trade) are switched on. */
export const activeCount = (f: Filters) =>
  Number(f.km > 0) + Number(f.when !== "any") + f.times.length + f.services.length + f.languages.length + Number(f.master) + Number(f.emergency) + Number(f.fast);

/* ── URL encoding ───────────────────────────────────────── */

const list = (v?: string | null, allowed?: readonly string[]) =>
  (v ?? "")
    .split(",")
    .filter(Boolean)
    .filter((x) => !allowed || allowed.includes(x));

export function fromParams(get: (key: string) => string | null | undefined, trades: readonly string[]): Filters {
  const km = Number(get("km"));
  const when = get("when");
  const sort = get("sort");
  const trade = get("trade");
  return {
    q: (get("q") ?? "").slice(0, 80),
    trade: trade && trades.includes(trade) ? trade : "all",
    km: Number.isFinite(km) && km > 0 && km < MAX_KM ? Math.round(km) : 0,
    when: (WHEN as readonly string[]).includes(when ?? "") ? (when as When) : "any",
    times: list(get("time"), TIMES),
    services: list(get("svc"), SERVICES),
    languages: list(get("lang"), LANGUAGES),
    master: get("master") === "1",
    emergency: get("emergency") === "1",
    fast: get("fast") === "1",
    sort: (SORTS as readonly string[]).includes(sort ?? "") ? (sort as Sort) : "soonest",
  };
}

export function toQuery(f: Filters) {
  const p = new URLSearchParams();
  if (f.q.trim()) p.set("q", f.q.trim());
  if (f.trade !== "all") p.set("trade", f.trade);
  if (f.km) p.set("km", String(f.km));
  if (f.when !== "any") p.set("when", f.when);
  if (f.times.length) p.set("time", f.times.join(","));
  if (f.services.length) p.set("svc", f.services.join(","));
  if (f.languages.length) p.set("lang", f.languages.join(","));
  if (f.master) p.set("master", "1");
  if (f.emergency) p.set("emergency", "1");
  if (f.fast) p.set("fast", "1");
  if (f.sort !== "soonest") p.set("sort", f.sort);
  const s = p.toString();
  return s ? `?${s}` : "";
}
