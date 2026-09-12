import { Fragment } from "react";
import { useTranslations } from "next-intl";
import Icon from "@/components/ui/Icon";

const cardRows = ["name", "address", "problem"] as const;

/**
 * Pure-CSS product mockup of the core flow: missed call → automatic SMS →
 * customer reply → job card with one-tap booking. No image asset, themable.
 */
export default function MissedCallMockup() {
  const t = useTranslations("mockup");
  const slots = t.raw("slots") as string[];

  return (
    <div className="relative mx-auto w-full max-w-md">
      <div className="overflow-hidden rounded-[28px] border border-line bg-surface shadow-[var(--shadow-float)]">
        {/* Missed call */}
        <div className="flex items-center gap-3 border-b border-line bg-fog px-5 py-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-danger/10 text-danger">
            <Icon name="phone-missed" size={20} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-ink">{t("missedCall")}</p>
            <p className="text-xs text-slate">{t("missedTime")}</p>
          </div>
          <span className="text-xs font-medium tabular-nums text-slate">
            +49 355 ••• ••12
          </span>
        </div>

        <div className="flex flex-col gap-3 p-5">
          {/* Automatic SMS to the caller */}
          <div className="max-w-[88%] self-end">
            <p className="mb-1 flex items-center justify-end gap-1 text-[11px] font-semibold text-primary">
              <Icon name="message" size={12} />
              {t("autoReplyLabel")}
            </p>
            <p className="rounded-2xl rounded-br-md bg-primary px-4 py-2.5 text-sm leading-snug text-white">
              {t("autoReply")}
            </p>
          </div>

          {/* Customer's reply */}
          <p className="max-w-[80%] self-start rounded-2xl rounded-bl-md bg-cloud px-4 py-2.5 text-sm leading-snug text-graphite">
            {t("customerReply")}
          </p>

          {/* Job card */}
          <div className="mt-1 rounded-2xl border border-line border-l-[3px] border-l-primary bg-surface p-4 shadow-[var(--shadow-subtle)]">
            <div className="mb-3 flex items-center justify-between gap-2">
              <p className="flex items-center gap-2 text-sm font-semibold text-ink">
                <Icon name="clipboard" size={16} className="text-primary" />
                {t("jobCard")}
              </p>
              <span className="inline-flex items-center gap-1 rounded-md bg-warning/15 px-2 py-0.5 text-[11px] font-semibold text-amber-700 dark:text-amber-300">
                <Icon name="alert" size={11} />
                {t("labels.urgency")}: {t("values.urgency")}
              </span>
            </div>
            <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 text-xs">
              {cardRows.map((row) => (
                <Fragment key={row}>
                  <dt className="text-slate">{t(`labels.${row}`)}</dt>
                  <dd className="truncate font-medium text-ink">
                    {t(`values.${row}`)}
                  </dd>
                </Fragment>
              ))}
            </dl>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {slots.map((slot, i) => (
                <span
                  key={slot}
                  className={
                    i === 0
                      ? "rounded-lg bg-primary-soft px-2.5 py-1.5 text-xs font-semibold text-primary ring-1 ring-primary/30"
                      : "rounded-lg bg-cloud px-2.5 py-1.5 text-xs font-medium text-slate"
                  }
                >
                  {slot}
                </span>
              ))}
              <span className="ml-auto rounded-lg bg-primary px-3.5 py-1.5 text-xs font-semibold text-white">
                {t("book")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating confirmation */}
      <div className="absolute -bottom-6 -left-6 hidden items-center gap-3 rounded-2xl border border-line bg-surface p-4 shadow-[var(--shadow-lift)] sm:flex">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/10 text-success">
          <Icon name="calendar-check" size={20} />
        </span>
        <div>
          <p className="text-xs font-semibold text-ink">{t("booked")}</p>
          <p className="text-[11px] text-slate">{t("bookedSub")}</p>
        </div>
      </div>
    </div>
  );
}
