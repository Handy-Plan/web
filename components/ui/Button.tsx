import Link from "next/link";
import { cn } from "@/lib/cn";
import Icon, { type IconName } from "./Icon";

type Variant = "primary" | "secondary" | "ghost" | "white";
type Size = "md" | "lg";

const base =
  "group inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-300 ease-[var(--ease-out-expo)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 active:scale-[0.98]";

const variants: Record<Variant, string> = {
  primary:
    "bg-gradient-to-br from-primary to-indigo text-white shadow-[0_4px_14px_rgba(3,105,161,0.35)] hover:-translate-y-0.5 hover:shadow-[var(--shadow-glow)] hover:brightness-[1.05]",
  secondary:
    "border border-line bg-surface text-graphite shadow-[var(--shadow-subtle)] hover:border-primary/40 hover:text-primary hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)]",
  ghost: "text-graphite hover:bg-cloud",
  white:
    "bg-white text-primary shadow-[var(--shadow-soft)] hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]",
};

const sizes: Record<Size, string> = {
  md: "h-12 px-6 text-[15px]",
  lg: "h-14 px-8 text-base",
};

type Props = {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
  iconBefore?: IconName;
  iconAfter?: IconName;
  full?: boolean;
};

export default function Button({
  href,
  children,
  variant = "primary",
  size = "md",
  className,
  iconBefore,
  iconAfter,
  full,
}: Props) {
  return (
    <Link
      href={href}
      className={cn(base, variants[variant], sizes[size], full && "w-full", className)}
    >
      {iconBefore && <Icon name={iconBefore} size={18} />}
      {children}
      {iconAfter && (
        <Icon
          name={iconAfter}
          size={18}
          className="transition-transform duration-300 group-hover:translate-x-1"
        />
      )}
    </Link>
  );
}
