"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Thread } from "@/lib/mock/dashboard";
import { cn } from "@/lib/cn";
import Icon from "@/components/ui/Icon";
import { EmptyState, Initials, btnIcon } from "../kit";

/**
 * Inbox: conversation list + thread. Desktop shows both side by side; phones
 * show the list, then the thread with a back button. Sending only appends to
 * local state (sample data).
 */
export default function MessagesView({ threads: initial, role }: { threads: Thread[]; role: "business" | "customer" }) {
  const t = useTranslations("dashboard.messages");
  const [threads, setThreads] = useState(initial);
  const [activeId, setActiveId] = useState(initial[0]?.id);
  const [mobileThread, setMobileThread] = useState(false);
  const [draft, setDraft] = useState("");
  const scroller = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLTextAreaElement>(null);

  const active = threads.find((th) => th.id === activeId);

  // Keep the newest message in view when switching threads or sending.
  useEffect(() => {
    const el = scroller.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [activeId, active?.messages.length, mobileThread]);

  const open = (id: string) => {
    setActiveId(id);
    setMobileThread(true);
    setDraft("");
    setThreads((all) => all.map((th) => (th.id === id ? { ...th, unread: 0 } : th)));
  };

  const send = () => {
    const text = draft.trim();
    if (!text || !active) return;
    setThreads((all) =>
      all.map((th) =>
        th.id === active.id
          ? {
              ...th,
              preview: text,
              last: t("justNow"),
              messages: [...th.messages, { id: `${th.id}-${th.messages.length}`, from: "me", text, time: t("justNow") }],
            }
          : th,
      ),
    );
    setDraft("");
    input.current?.focus();
  };

  const quick = role === "business" ? (["onWay", "callSoon", "photo"] as const) : (["thanks", "parking", "reschedule"] as const);

  return (
    <div className="grid overflow-hidden rounded-[28px] border border-line bg-surface lg:h-[calc(100svh-212px)] lg:min-h-[520px] lg:grid-cols-[340px_minmax(0,1fr)]">
      {/* Conversation list */}
      <div className={cn("min-h-0 flex-col border-line lg:flex lg:border-r", mobileThread ? "hidden" : "flex")}>
        <ul className="min-h-0 flex-1 divide-y divide-line overflow-y-auto">
          {threads.map((th) => {
            const isActive = th.id === activeId;
            return (
              <li key={th.id}>
                <button
                  type="button"
                  onClick={() => open(th.id)}
                  aria-current={isActive ? "true" : undefined}
                  className={cn(
                    "flex w-full items-start gap-3 px-5 py-4 text-left transition-colors focus-visible:bg-primary/5 focus-visible:outline-none",
                    isActive ? "lg:bg-primary/[0.06]" : "hover:bg-ink/[0.02]",
                  )}
                >
                  <Initials text={th.initials} />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-baseline justify-between gap-2">
                      <span className={cn("truncate text-[15px] text-ink", th.unread ? "font-semibold" : "font-medium")}>{th.name}</span>
                      <span className="shrink-0 font-mono text-[11px] text-muted">{th.last}</span>
                    </span>
                    <span className="mt-0.5 block truncate text-[12px] text-slate">{th.subtitle}</span>
                    <span className="mt-1 flex items-center gap-2">
                      <span className={cn("line-clamp-1 flex-1 text-[13px]", th.unread ? "text-ink" : "text-slate")}>{th.preview}</span>
                      {th.unread > 0 && (
                        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 font-mono text-[11px] font-medium text-white">
                          <span className="sr-only">{t("unread")}</span>
                          {th.unread}
                        </span>
                      )}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Thread */}
      <div className={cn("min-h-0 flex-col lg:flex", mobileThread ? "flex" : "hidden")}>
        {!active ? (
          <EmptyState icon="message" title={t("empty")} />
        ) : (
          <>
            <div className="flex items-center gap-3 border-b border-line px-3 py-3 sm:px-5">
              <button type="button" onClick={() => setMobileThread(false)} aria-label={t("back")} className={cn(btnIcon, "lg:hidden")}>
                <Icon name="arrow-left" size={19} />
              </button>
              <Initials text={active.initials} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[15px] font-semibold text-ink">{active.name}</p>
                <p className="truncate text-[12px] text-slate">{active.subtitle}</p>
              </div>
              {role === "business" && active.jobId && (
                <Link href={`/dashboard/jobs?job=${active.jobId}`} className="hidden h-9 items-center gap-1.5 rounded-full border border-line px-3 text-[13px] font-medium text-graphite transition-colors hover:border-ink/25 hover:text-ink sm:inline-flex">
                  <Icon name="clipboard" size={14} />
                  {t("openJob")}
                </Link>
              )}
            </div>

            <div ref={scroller} key={active.id} className="auth-rise h-[60svh] min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-6 lg:h-auto" aria-live="polite">
              <div className="flex flex-col gap-3">
                {active.messages.map((m, k) =>
                  m.from === "auto" ? (
                    <div key={m.id} style={{ ["--i" as string]: Math.min(k, 6) }} className="mx-auto max-w-[460px] text-center">
                      <p className="flex items-center justify-center gap-1.5 text-[11px] font-medium text-muted">
                        <Icon name="sparkle" size={12} className="text-primary" />
                        {t(role === "business" ? "autoBusiness" : "autoCustomer")}
                        <span className="font-mono">{m.time}</span>
                      </p>
                      <p className="mt-1.5 rounded-[16px] border border-dashed border-line px-4 py-2.5 text-pretty text-[14px] leading-relaxed text-graphite">{m.text}</p>
                    </div>
                  ) : (
                    <div key={m.id} style={{ ["--i" as string]: Math.min(k, 6) }} className={cn("flex max-w-[82%] flex-col", m.from === "me" ? "items-end self-end" : "items-start")}>
                      <p
                        className={cn(
                          "text-pretty rounded-[20px] px-4 py-2.5 text-[15px] leading-relaxed",
                          m.from === "me" ? "rounded-br-[6px] bg-ink text-canvas" : "rounded-bl-[6px] bg-surface-2 text-ink",
                        )}
                      >
                        {m.text}
                      </p>
                      <span className="mt-1 px-1 font-mono text-[11px] text-muted">{m.time}</span>
                    </div>
                  ),
                )}
              </div>
            </div>

            <div className="border-t border-line p-3 sm:p-4">
              <div className="mb-2.5 flex gap-1.5 overflow-x-auto [scrollbar-width:none]">
                {quick.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => {
                      setDraft(t(`quick.${q}`));
                      input.current?.focus();
                    }}
                    className="h-9 shrink-0 rounded-full border border-line px-3 text-[13px] text-graphite transition-[border-color,color,transform] duration-200 hover:border-ink/25 hover:text-ink active:scale-[0.96]"
                  >
                    {t(`quick.${q}`)}
                  </button>
                ))}
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  send();
                }}
                className="flex items-end gap-2"
              >
                <label htmlFor="message-draft" className="sr-only">
                  {t("placeholder")}
                </label>
                <textarea
                  id="message-draft"
                  ref={input}
                  rows={1}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      send();
                    }
                  }}
                  placeholder={t("placeholder")}
                  className="max-h-32 min-h-12 flex-1 resize-none rounded-[22px] border border-line bg-surface-2 px-4 py-3 text-[16px] leading-snug text-ink transition-[border-color,box-shadow] duration-200 [field-sizing:content] placeholder:text-muted focus:border-primary focus:bg-surface focus:outline-none focus:ring-4 focus:ring-primary/15"
                />
                <button
                  type="submit"
                  disabled={!draft.trim()}
                  aria-label={t("send")}
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-ink text-canvas transition-[transform,background-color,opacity] duration-200 hover:bg-primary hover:text-white active:scale-[0.94] disabled:opacity-35"
                >
                  <Icon name="send" size={18} />
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
