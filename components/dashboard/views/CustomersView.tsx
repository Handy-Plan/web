"use client";

import { useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { CustomerEntry } from "@/lib/mock/dashboard";
import { cn } from "@/lib/cn";
import Icon from "@/components/ui/Icon";
import DetailSheet from "../DetailSheet";
import { Badge, DetailRow, EmptyState, Initials, btnPrimary, btnSecondary } from "../kit";
import { statusTone } from "./JobsBoard";

/** Searchable customer list with a detail panel (history, notes, contact). */
export default function CustomersView({ customers }: { customers: CustomerEntry[] }) {
  const t = useTranslations("dashboard.customers");
  const tJobs = useTranslations("dashboard.jobs");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(customers[0]?.id);
  const [sheetOpen, setSheetOpen] = useState(false);
  const closeSheet = useCallback(() => setSheetOpen(false), []);

  const q = query.trim().toLowerCase();
  const visible = q
    ? customers.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.address.toLowerCase().includes(q) ||
          (/\d/.test(q) && c.phone.replace(/\s/g, "").includes(q.replace(/\s/g, ""))),
      )
    : customers;
  const selected = customers.find((c) => c.id === selectedId) ?? visible[0];

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start">
      <div className="flex min-w-0 flex-col gap-4">
        <div className="relative max-w-md">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label={t("search")}
            placeholder={t("search")}
            className="peer h-12 w-full rounded-full border border-line bg-surface pl-11 pr-4 text-[16px] text-ink transition-[border-color,box-shadow] duration-200 placeholder:text-muted focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15"
          />
          <Icon name="search" size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted transition-colors peer-focus:text-primary" />
        </div>

        <div className="overflow-hidden rounded-[28px] border border-line bg-surface">
          {visible.length === 0 ? (
            <EmptyState icon="users" title={t("noMatch", { query })} />
          ) : (
            <>
              <div className="hidden grid-cols-[minmax(0,1.6fr)_minmax(0,1.4fr)_88px_110px] gap-4 border-b border-line px-6 py-3 text-[12px] font-medium text-muted md:grid">
                <span>{t("cols.name")}</span>
                <span>{t("cols.address")}</span>
                <span className="text-right">{t("cols.jobs")}</span>
                <span className="text-right">{t("cols.last")}</span>
              </div>
              <ul className="divide-y divide-line">
                {visible.map((c) => {
                  const active = c.id === selected?.id;
                  return (
                    <li key={c.id}>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedId(c.id);
                          setSheetOpen(true);
                        }}
                        aria-pressed={active}
                        className={cn(
                          "grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-3.5 text-left transition-colors focus-visible:bg-primary/5 focus-visible:outline-none sm:px-6 md:grid-cols-[minmax(0,1.6fr)_minmax(0,1.4fr)_88px_110px]",
                          active ? "lg:bg-primary/[0.06]" : "hover:bg-ink/[0.02]",
                        )}
                      >
                        <span className="flex min-w-0 items-center gap-3">
                          <Initials text={c.initials} />
                          <span className="min-w-0">
                            <span className="flex items-center gap-2">
                              <span className="truncate text-[15px] font-medium text-ink">{c.name}</span>
                              {c.isNew && <Badge tone="primary">{t("new")}</Badge>}
                            </span>
                            <span className="mt-0.5 block truncate font-mono text-[12px] text-slate">{c.phone}</span>
                          </span>
                        </span>
                        <span className="hidden truncate text-[14px] text-graphite md:block">{c.address}</span>
                        <span className="hidden text-right font-mono text-[14px] tabular-nums text-ink md:block">{c.jobs}</span>
                        <span className="text-right font-mono text-[12px] text-muted">
                          {c.last}
                          {c.open > 0 && (
                            <span className="mt-1 block font-sans text-[12px] font-medium text-primary">{t("openCount", { count: c.open })}</span>
                          )}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </div>
      </div>

      {selected && (
        <DetailSheet open={sheetOpen} onClose={closeSheet} label={t("detailLabel")}>
          <div key={selected.id} className="auth-rise p-5 sm:p-6">
            <div style={{ ["--i" as string]: 0 }} className="flex items-center gap-3">
              <Initials text={selected.initials} size="lg" />
              <div className="min-w-0">
                <p className="truncate text-[18px] font-semibold tracking-[-0.02em] text-ink">{selected.name}</p>
                <p className="text-[13px] text-slate">{t("jobsTotal", { count: selected.jobs })}</p>
              </div>
            </div>

            <div style={{ ["--i" as string]: 1 }} className="mt-5 flex flex-wrap gap-2">
              <a href={`tel:${selected.phone.replace(/\s/g, "")}`} className={cn(btnPrimary, "h-10")}>
                <Icon name="phone" size={15} />
                {t("call")}
              </a>
              <Link href="/dashboard/messages" className={cn(btnSecondary, "h-10")}>
                <Icon name="message" size={15} />
                {t("message")}
              </Link>
            </div>

            <div style={{ ["--i" as string]: 2 }} className="mt-6 flex flex-col gap-4">
              <DetailRow icon="phone" label={t("phone")}>
                <span className="font-mono text-[14px]">{selected.phone}</span>
              </DetailRow>
              <DetailRow icon="map-pin" label={t("cols.address")}>
                {selected.address}
              </DetailRow>
              {selected.note && (
                <DetailRow icon="note" label={t("note")}>
                  <span className="text-pretty">{selected.note}</span>
                </DetailRow>
              )}
            </div>

            <div style={{ ["--i" as string]: 3 }} className="mt-6 border-t border-line pt-5">
              <p className="text-[14px] font-semibold text-ink">{t("history")}</p>
              <ol className="relative mt-4 flex flex-col gap-4 before:absolute before:bottom-2 before:left-[5px] before:top-2 before:w-px before:bg-line">
                {selected.history.map((h, k) => (
                  <li key={k} className="relative flex gap-3 pl-6">
                    <span
                      className={cn(
                        "absolute left-0 top-1.5 h-[11px] w-[11px] rounded-full ring-4 ring-surface",
                        h.status === "past" || h.status === "done" ? "bg-line" : "bg-primary",
                      )}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[14px] font-medium text-ink">{h.title}</p>
                      <p className="mt-0.5 font-mono text-[12px] text-muted">{h.date}</p>
                    </div>
                    {h.status !== "past" && (
                      <Badge {...statusTone[h.status]} className="self-start">
                        {tJobs(`status.${h.status}`)}
                      </Badge>
                    )}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </DetailSheet>
      )}
    </div>
  );
}
