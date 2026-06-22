import { cn } from "@/lib/cn";

/** HandyPlan mark: a calendar with an embedded wrench/check. */
export default function Logo({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-indigo shadow-[0_4px_12px_rgba(3,105,161,0.35)]",
        className,
      )}
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect
          x="3"
          y="4.5"
          width="18"
          height="16"
          rx="3"
          stroke="white"
          strokeWidth="1.8"
        />
        <path d="M3 9h18" stroke="white" strokeWidth="1.8" />
        <path
          d="M8 2.5v4M16 2.5v4"
          stroke="white"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path
          d="m8.5 14.5 2.2 2.2 4.8-5"
          stroke="white"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}
