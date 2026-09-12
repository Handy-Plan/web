import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";
import Icon from "@/components/ui/Icon";

type Props = {
  /** Translated step labels, in order. */
  steps: string[];
  /** Optional links per step, so people can jump between steps freely. */
  hrefs?: string[];
  /** Zero-based index of the active step. */
  current: number;
  /** Pre-formatted "Step X of N" label (mobile). */
  stepLabel: string;
};

/** Progress stepper, styled to sit on the blue onboarding header band. */
export default function Stepper({ steps, hrefs, current, stepLabel }: Props) {
  const pct = Math.round(((current + 1) / steps.length) * 100);

  return (
    <div className="mb-8">
      {/* Mobile: label + progress bar */}
      <div className="sm:hidden">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-semibold text-white">
            {steps[current]}
          </span>
          <span className="text-sm font-medium text-white/80">{stepLabel}</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/25">
          <div
            className="h-full rounded-full bg-white transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Desktop: numbered stepper */}
      <ol className="hidden items-center sm:flex">
        {steps.map((label, i) => {
          const state =
            i < current ? "complete" : i === current ? "current" : "upcoming";
          const href = hrefs?.[i];
          const content = (
            <>
              <span
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-colors",
                  state === "complete" &&
                    "bg-white/20 text-white ring-1 ring-inset ring-white/40",
                  state === "current" && "bg-white text-primary ring-4 ring-white/25",
                  state === "upcoming" && "text-white/85 ring-1 ring-inset ring-white/40",
                )}
              >
                {state === "complete" ? <Icon name="check" size={16} /> : i + 1}
              </span>
              <span
                className={cn(
                  "text-sm font-medium",
                  state === "upcoming" ? "text-white/80" : "text-white",
                )}
              >
                {label}
              </span>
            </>
          );

          return [
            <li key={label}>
              {href && state !== "current" ? (
                <Link
                  href={href}
                  className="flex items-center gap-2.5 rounded-full pr-2 transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  {content}
                </Link>
              ) : (
                <span
                  className="flex items-center gap-2.5"
                  aria-current={state === "current" ? "step" : undefined}
                >
                  {content}
                </span>
              )}
            </li>,
            i < steps.length - 1 && (
              <li
                key={`${label}-line`}
                aria-hidden
                className={cn(
                  "mx-3 h-px flex-1 rounded-full",
                  i < current ? "bg-white/70" : "bg-white/30",
                )}
              />
            ),
          ];
        })}
      </ol>
    </div>
  );
}
