import { Fragment } from "react";
import { cn } from "@/lib/cn";
import Icon from "@/components/ui/Icon";

type Props = {
  /** Translated step labels, in order. */
  steps: string[];
  /** Zero-based index of the active step. */
  current: number;
  /** Pre-formatted "Step X of N" label (mobile). */
  stepLabel: string;
};

export default function Stepper({ steps, current, stepLabel }: Props) {
  const pct = Math.round(((current + 1) / steps.length) * 100);

  return (
    <div className="mb-8">
      {/* Mobile: label + progress bar */}
      <div className="sm:hidden">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-semibold text-ink">
            {steps[current]}
          </span>
          <span className="text-sm font-medium text-muted">{stepLabel}</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-line">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary to-indigo transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Desktop: numbered stepper */}
      <ol className="hidden items-center sm:flex">
        {steps.map((label, i) => {
          const state =
            i < current ? "complete" : i === current ? "current" : "upcoming";
          return (
            <Fragment key={label}>
              <li className="flex items-center gap-2.5">
                <span
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-colors",
                    state === "complete" &&
                      "bg-gradient-to-br from-primary to-indigo text-white",
                    state === "current" &&
                      "bg-gradient-to-br from-primary to-indigo text-white ring-4 ring-primary/15",
                    state === "upcoming" &&
                      "border border-line bg-surface text-muted",
                  )}
                >
                  {state === "complete" ? (
                    <Icon name="check" size={16} />
                  ) : (
                    i + 1
                  )}
                </span>
                <span
                  className={cn(
                    "text-sm font-medium transition-colors",
                    state === "upcoming" ? "text-muted" : "text-ink",
                  )}
                >
                  {label}
                </span>
              </li>
              {i < steps.length - 1 && (
                <span
                  className={cn(
                    "mx-3 h-px flex-1 rounded-full transition-colors",
                    i < current ? "bg-primary/50" : "bg-line",
                  )}
                />
              )}
            </Fragment>
          );
        })}
      </ol>
    </div>
  );
}
