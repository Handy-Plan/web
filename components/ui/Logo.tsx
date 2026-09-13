import { cn } from "@/lib/cn";

/**
 * HandyPlan mark ("Home Reply"): a message bubble shaped like a house, with a
 * tick — the job at someone's home, the instant reply, and the booked job.
 * The tick is drawn in the tile colour (no mask), so the mark renders
 * correctly even when several logos sit in hidden and visible containers.
 *
 * The `hp-logo-*` classes drive the intro animation in globals.css, which
 * plays every time a logo mounts (skipped for reduced motion).
 */
export default function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      aria-hidden="true"
      className={cn(
        "h-10 w-10 shrink-0 overflow-visible drop-shadow-[0_4px_10px_rgba(3,105,161,0.3)]",
        className,
      )}
    >
      <rect width="40" height="40" rx="12" className="hp-logo-tile fill-primary" />
      <g transform="translate(7 6.5) scale(1.0833)">
        <path
          className="hp-logo-house"
          d="M12 5 19.2 10.4V16.8H11L7 20V16.8H4.8V10.4Z"
          fill="#fff"
          stroke="#fff"
          strokeWidth="3.2"
          strokeLinejoin="round"
        />
        <path
          className="hp-logo-tick stroke-primary"
          d="m8.6 13 2.3 2.3 4.6-4.8"
          pathLength={1}
          fill="none"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}
