import { cn } from "@/lib/cn";
import Reveal from "@/components/animations/Reveal";

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  light = false,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: string;
  align?: "center" | "left";
  light?: boolean;
}) {
  return (
    <Reveal
      stagger={0.08}
      className={cn(
        "flex max-w-2xl flex-col gap-4",
        align === "center" ? "mx-auto items-center text-center" : "items-start text-left",
      )}
    >
      {eyebrow && (
        <span
          className={cn(
            "inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.12em]",
            light
              ? "bg-white/10 text-white/80 ring-1 ring-white/15"
              : "bg-primary-soft text-primary ring-1 ring-primary/10",
          )}
        >
          <span
            className={cn(
              "h-1.5 w-1.5 rounded-full",
              light ? "bg-white/70" : "bg-primary",
            )}
          />
          {eyebrow}
        </span>
      )}
      <h2
        className={cn(
          "text-balance text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-[44px] lg:leading-[1.1]",
          light ? "text-white" : "text-ink",
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            "text-pretty text-lg leading-relaxed",
            light ? "text-white/80" : "text-slate",
          )}
        >
          {subtitle}
        </p>
      )}
    </Reveal>
  );
}
