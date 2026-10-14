"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/cn";
import Icon, { type IconName } from "@/components/ui/Icon";
import LocaleSwitcher from "@/components/ui/LocaleSwitcher";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { Badge, Panel, Toggle, btnPrimary, btnSecondary, fieldLabel, rise } from "../kit";

const SMS_LIMIT = 160;

type Props = {
  role: "business" | "customer";
  forwardingNumber: string;
  replyText: string;
  email: string;
};

const notifyKeys = {
  business: ["newJob", "replies", "summary"],
  customer: ["confirmations", "reminders", "replies"],
} as const;

/** Account settings. Sample only: changes stay in this browser tab. */
export default function SettingsView({ role, forwardingNumber, replyText, email }: Props) {
  const t = useTranslations("dashboard.settings");
  const [copied, setCopied] = useState(false);
  const [tested, setTested] = useState(false);
  const [reply, setReply] = useState(replyText);
  const [savedReply, setSavedReply] = useState(replyText);
  const [notify, setNotify] = useState<Record<string, boolean>>({ newJob: true, replies: true, summary: false, confirmations: true, reminders: true });
  const [savedKey, setSavedKey] = useState<string>();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const code = `**61*${forwardingNumber.replace(/\s/g, "")}*11*20#`;
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked: the code stays visible to type by hand */
    }
  };

  let n = 0;
  return (
    <div className="auth-rise flex max-w-3xl flex-col gap-5">
      {role === "business" && (
        <>
          <Section style={rise(++n)} icon="phone" title={t("forwarding.title")} body={t("forwarding.body")}>
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="success" icon="check">{t("forwarding.active")}</Badge>
              <span className="text-[13px] text-slate">{t("forwarding.since")}</span>
            </div>
            <ol className="mt-5 flex flex-col gap-4">
              {(["step1", "step2", "step3"] as const).map((s, k) => (
                <li key={s} className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface-2 font-mono text-[12px] text-graphite">{k + 1}</span>
                  <div className="min-w-0 flex-1 pt-0.5">
                    <p className="text-pretty text-[14px] leading-relaxed text-graphite">{t(`forwarding.${s}`)}</p>
                    {s === "step2" && (
                      <div className="mt-2.5 flex flex-wrap items-center gap-2">
                        <code className="rounded-[12px] bg-surface-2 px-3 py-2 font-mono text-[14px] text-ink">{code}</code>
                        <button type="button" onClick={copy} className={cn(btnSecondary, "h-10")}>
                          <Icon name={copied ? "check" : "copy"} size={15} className={copied ? "text-success" : undefined} />
                          <span key={String(copied)} className="hp-pop">{copied ? t("copied") : t("copy")}</span>
                        </button>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ol>
            <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-line pt-5">
              <button type="button" onClick={() => setTested(true)} className={btnSecondary}>
                <Icon name="phone-missed" size={16} />
                {t("forwarding.test")}
              </button>
              {tested && (
                <p className="hp-pop flex items-center gap-1.5 text-[13px] text-graphite">
                  <Icon name="check" size={15} className="text-success" />
                  {t("forwarding.tested")}
                </p>
              )}
            </div>
          </Section>

          <Section style={rise(++n)} icon="message" title={t("reply.title")} body={t("reply.body")}>
            <label htmlFor="reply-text" className={fieldLabel}>
              {t("reply.label")}
            </label>
            <textarea
              id="reply-text"
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              rows={3}
              className="mt-2 w-full resize-y rounded-[14px] border border-line bg-surface px-4 py-3 text-[16px] leading-relaxed text-ink transition-[border-color,box-shadow] duration-200 hover:border-ink/20 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15"
            />
            <div className="mt-2 flex items-center justify-between gap-3 text-[12px]">
              <span className={cn("font-mono", reply.length > SMS_LIMIT ? "text-danger" : "text-muted")}>
                {reply.length} / {SMS_LIMIT}
              </span>
              {reply.length > SMS_LIMIT && <span className="text-danger">{t("reply.tooLong")}</span>}
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <button
                type="button"
                disabled={reply === savedReply || !reply.trim()}
                onClick={() => {
                  setSavedReply(reply);
                  setSavedKey("reply");
                }}
                className={btnPrimary}
              >
                {t("save")}
              </button>
              {reply !== replyText && (
                <button type="button" onClick={() => setReply(replyText)} className={btnSecondary}>
                  {t("reply.reset")}
                </button>
              )}
              {savedKey === "reply" && reply === savedReply && (
                <span className="hp-pop flex items-center gap-1.5 text-[13px] text-graphite">
                  <Icon name="check" size={15} className="text-success" />
                  {t("saved")}
                </span>
              )}
            </div>
          </Section>
        </>
      )}

      <Section style={rise(++n)} icon="bell" title={t("notifications.title")}>
        <ul className="-my-2 divide-y divide-line">
          {notifyKeys[role].map((k) => (
            <li key={k} className="flex items-center gap-4 py-2">
              <div className="min-w-0 flex-1">
                <p className="text-[15px] font-medium text-ink">{t(`notifications.${k}.title`)}</p>
                <p className="mt-0.5 text-[13px] text-slate">{t(`notifications.${k}.body`)}</p>
              </div>
              {savedKey === k && <Icon key={`${k}-${notify[k]}`} name="check" size={15} className="hp-pop text-success" aria-label={t("saved")} />}
              <Toggle
                checked={Boolean(notify[k])}
                onChange={(v) => {
                  setNotify((all) => ({ ...all, [k]: v }));
                  setSavedKey(k);
                }}
                label={t(`notifications.${k}.title`)}
              />
            </li>
          ))}
        </ul>
      </Section>

      <Section style={rise(++n)} icon="globe" title={t("display.title")}>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4">
            <p className="text-[15px] font-medium text-ink">{t("display.language")}</p>
            <LocaleSwitcher />
          </div>
          <div className="flex items-center justify-between gap-4 border-t border-line pt-4">
            <p className="text-[15px] font-medium text-ink">{t("display.theme")}</p>
            <ThemeToggle className="h-11 w-11 border border-line" />
          </div>
        </div>
      </Section>

      <Section style={rise(++n)} icon="lock" title={t("account.title")}>
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[12px] text-muted">{t("account.email")}</p>
              <p className="mt-0.5 text-[15px] text-ink">{email}</p>
            </div>
            <button type="button" className={btnSecondary}>
              {t("account.password")}
            </button>
          </div>

          <div className="rounded-[20px] border border-danger/25 p-4">
            <p className="text-[15px] font-medium text-ink">{t("account.deleteTitle")}</p>
            <p className="mt-0.5 text-pretty text-[13px] leading-relaxed text-slate">{t("account.deleteBody")}</p>
            {confirmDelete ? (
              <div className="hp-pop mt-3 flex flex-wrap items-center gap-2">
                <p className="w-full text-[13px] font-medium text-danger" role="alert">
                  {t("account.deleteConfirm")}
                </p>
                <button type="button" onClick={() => setConfirmDelete(false)} className={btnSecondary}>
                  {t("account.cancel")}
                </button>
                <button
                  type="button"
                  disabled
                  title={t("account.deleteSample")}
                  className="inline-flex h-11 items-center gap-2 rounded-full bg-danger px-5 text-[14px] font-semibold text-white disabled:opacity-60"
                >
                  {t("account.deleteNow")}
                </button>
                <p className="w-full text-[12px] text-muted">{t("account.deleteSample")}</p>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="mt-3 inline-flex h-10 items-center gap-2 rounded-full border border-danger/30 px-4 text-[13px] font-semibold text-danger transition-colors hover:bg-danger/10"
              >
                {t("account.delete")}
              </button>
            )}
          </div>
        </div>
      </Section>
    </div>
  );
}

function Section({
  icon,
  title,
  body,
  children,
  style,
}: {
  icon: IconName;
  title: string;
  body?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <Panel style={style} className="p-5 sm:p-6">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary-soft text-primary">
          <Icon name={icon} size={18} />
        </span>
        <div className="min-w-0 pt-0.5">
          <h2 className="text-[17px] font-semibold tracking-[-0.02em] text-ink">{title}</h2>
          {body && <p className="mt-1 text-pretty text-[14px] leading-relaxed text-slate">{body}</p>}
        </div>
      </div>
      <div className="mt-5">{children}</div>
    </Panel>
  );
}
