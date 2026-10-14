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
  /** Pre-formatted "Step X of N" label. */
  stepLabel: string;
};

/**
 * Segmented progress: one bar per step. Done steps are full, the current
 * one fills in as the page arrives, upcoming ones are empty tracks. Each
 * label links back to its step.
 */
export default function Stepper({ steps, hrefs, current, stepLabel }: Props) {
  return (
    <nav aria-label={stepLabel}>
      <p className="mb-3 text-[13px] font-medium text-slate">{stepLabel}</p>
      <ol className="grid gap-2" style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}>
        {steps.map((label, i) => {
          const state = i < current ? "complete" : i === current ? "current" : "upcoming";
          const href = hrefs?.[i];
          const inner = (
            <>
              <span className="relative block h-[5px] overflow-hidden rounded-full bg-line">
                {state !== "upcoming" && (
                  <span
                    className={cn("absolute inset-0 rounded-full bg-primary", state === "current" && "hp-fill")}
                  />
                )}
              </span>
              <span
                className={cn(
                  "mt-2.5 flex items-center gap-1.5 text-[13px] font-medium transition-colors",
                  state === "upcoming" ? "text-muted" : "text-ink",
                )}
              >
                {state === "complete" ? (
                  <Icon name="check" size={13} className="text-primary" />
                ) : (
                  <span className="font-mono text-[11px] text-muted">{i + 1}</span>
                )}
                <span className="truncate">{label}</span>
              </span>
            </>
          );
          return (
            <li key={label}>
              {href && state !== "current" ? (
                <Link
                  href={href}
                  className="block rounded-md transition-opacity hover:opacity-75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  {inner}
                </Link>
              ) : (
                <span className="block" aria-current={state === "current" ? "step" : undefined}>
                  {inner}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
