import { cn } from "@/lib/cn";
import Icon, { type IconName } from "@/components/ui/Icon";

/**
 * Small building blocks shared by every dashboard page. No hooks here, so
 * they render on the server and inside client views alike.
 */

/** `--i` drives the staggered entrance (see .auth-rise in globals.css). */
export const rise = (n: number) => ({ ["--i" as string]: n }) as React.CSSProperties;

export const btnPrimary =
  "group inline-flex h-11 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-ink px-5 text-[14px] font-semibold text-canvas transition-[transform,background-color] duration-200 hover:bg-primary hover:text-white active:scale-[0.97] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/30 disabled:pointer-events-none disabled:opacity-45";

export const btnSecondary =
  "inline-flex h-11 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full border border-line bg-surface px-4 text-[14px] font-medium text-graphite transition-[border-color,color,transform] duration-200 hover:border-ink/25 hover:text-ink active:scale-[0.97] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20";

export const btnIcon =
  "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-slate transition-[background-color,color,transform] duration-200 hover:bg-ink/5 hover:text-ink active:scale-[0.94] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary";

export const fieldInput =
  "h-12 w-full rounded-[14px] border border-line bg-surface px-4 text-[16px] text-ink transition-[border-color,box-shadow] duration-200 placeholder:text-muted hover:border-ink/20 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15";

export const fieldLabel = "text-[13px] font-medium text-graphite";

/** Night-blue stage background (stays dark in both themes). */
export function StageGlow({ floor = false }: { floor?: boolean }) {
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(70% 70% at 85% 0%, rgba(3,105,161,0.55), transparent 70%), radial-gradient(50% 60% at 0% 100%, rgba(56,189,248,0.16), transparent 70%)",
        }}
      />
      {floor && (
        <div aria-hidden className="pointer-events-none absolute inset-x-[-20%] bottom-[-22%] h-[48%] opacity-25">
          <div className="hp-floor absolute inset-0 [--color-primary:#38bdf8]" />
        </div>
      )}
    </>
  );
}

export function PageHeader({
  title,
  subtitle,
  eyebrow,
  actions,
  style,
}: {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  actions?: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div style={style} className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {eyebrow && <p className="font-mono text-[12px] text-muted">{eyebrow}</p>}
        <h1 className={cn("text-balance text-[32px] font-semibold leading-[1.05] tracking-[-0.045em] text-ink sm:text-[44px]", eyebrow && "mt-2")}>
          {title}
        </h1>
        {subtitle && <p className="mt-2 max-w-2xl text-pretty text-[16px] leading-relaxed text-slate">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2.5">{actions}</div>}
    </div>
  );
}

export function Panel({
  className,
  children,
  style,
  as: Tag = "section",
}: {
  className?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
  as?: "section" | "div" | "article" | "aside";
}) {
  return (
    <Tag style={style} className={cn("rounded-[28px] border border-line bg-surface", className)}>
      {children}
    </Tag>
  );
}

export function PanelTitle({ children, action, className }: { children: React.ReactNode; action?: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex items-center justify-between gap-3", className)}>
      <h2 className="text-[18px] font-semibold tracking-[-0.02em] text-ink">{children}</h2>
      {action}
    </div>
  );
}

export type Tone = "neutral" | "primary" | "success" | "warning" | "danger";

const toneBg: Record<Tone, string> = {
  neutral: "bg-ink/[0.06]",
  primary: "bg-primary/10",
  success: "bg-success/12",
  warning: "bg-warning/15",
  danger: "bg-danger/10",
};

const toneIcon: Record<Tone, string> = {
  neutral: "text-slate",
  primary: "text-primary",
  success: "text-success",
  warning: "text-warning",
  danger: "text-danger",
};

/** Status chip: tinted pill, coloured icon, readable text (never colour alone). */
export function Badge({ tone = "neutral", icon, children, className }: { tone?: Tone; icon?: IconName; children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex h-6 shrink-0 items-center gap-1 whitespace-nowrap rounded-full px-2.5 text-[12px] font-medium text-graphite",
        toneBg[tone],
        className,
      )}
    >
      {icon && <Icon name={icon} size={13} className={toneIcon[tone]} />}
      {children}
    </span>
  );
}

/** Initials avatar for people and companies (empty initials → person glyph). */
export function Initials({ text, size = "md", tone = "soft" }: { text: string; size?: "sm" | "md" | "lg"; tone?: "soft" | "ink" }) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full font-semibold",
        tone === "soft" ? "bg-primary-soft text-primary" : "bg-ink text-canvas",
        size === "sm" && "h-8 w-8 text-[11px]",
        size === "md" && "h-10 w-10 text-[13px]",
        size === "lg" && "h-14 w-14 text-[17px]",
      )}
    >
      {text || <Icon name="user" size={size === "lg" ? 22 : 17} />}
    </span>
  );
}

/** Switch with a real checkbox underneath (keyboard + screen readers). */
export function Toggle({
  checked,
  onChange,
  label,
  className,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
  className?: string;
}) {
  return (
    <label className={cn("relative inline-flex h-11 w-[52px] shrink-0 cursor-pointer items-center justify-center", className)}>
      <input
        type="checkbox"
        role="switch"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        aria-label={label}
        className="peer sr-only"
      />
      <span className="h-7 w-12 rounded-full bg-line transition-colors duration-200 peer-checked:bg-primary peer-focus-visible:ring-4 peer-focus-visible:ring-primary/25" />
      <span className="pointer-events-none absolute left-1 top-1/2 h-6 w-6 -translate-y-1/2 translate-x-0.5 rounded-full bg-white shadow-[0_1px_3px_rgba(15,23,42,0.25)] transition-transform duration-300 ease-[var(--ease-spring)] peer-checked:translate-x-[22px]" />
    </label>
  );
}

/** Segmented filter (tabs). Controlled; pass counts to show them. */
export function Segmented<T extends string>({
  value,
  onChange,
  options,
  label,
  className,
}: {
  value: T;
  onChange: (next: T) => void;
  options: { value: T; label: string; count?: number }[];
  label: string;
  className?: string;
}) {
  return (
    <div role="tablist" aria-label={label} className={cn("flex max-w-full gap-1 overflow-x-auto rounded-full bg-ink/[0.05] p-1 [scrollbar-width:none]", className)}>
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(o.value)}
            className={cn(
              "inline-flex h-9 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 text-[13px] font-medium transition-[background-color,color,box-shadow] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
              active ? "bg-surface text-ink shadow-[var(--shadow-subtle)]" : "text-slate hover:text-ink",
            )}
          >
            {o.label}
            {o.count !== undefined && (
              <span className={cn("font-mono text-[11px] tabular-nums", active ? "text-primary" : "text-muted")}>{o.count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

/** Small honest empty state inside a panel or list. */
export function EmptyState({ icon, title, body, action }: { icon: IconName; title: string; body?: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center px-6 py-12 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-soft text-primary">
        <Icon name={icon} size={22} />
      </span>
      <p className="mt-4 text-[16px] font-semibold tracking-[-0.02em] text-ink">{title}</p>
      {body && <p className="mt-1 max-w-sm text-pretty text-[14px] leading-relaxed text-slate">{body}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

/** Label/value row for detail panels. */
export function DetailRow({ icon, label, children }: { icon: IconName; label: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-3">
      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-2 text-slate">
        <Icon name={icon} size={16} />
      </span>
      <div className="min-w-0">
        <p className="text-[12px] text-muted">{label}</p>
        <div className="mt-0.5 text-[15px] text-ink">{children}</div>
      </div>
    </div>
  );
}
