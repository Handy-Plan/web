import { Link } from "@/i18n/navigation";
import Logo from "@/components/ui/Logo";
import Icon from "@/components/ui/Icon";
import ThemeToggle from "@/components/ui/ThemeToggle";
import LocaleSwitcher from "@/components/ui/LocaleSwitcher";
import AuthShowcase from "./AuthShowcase";
import { cn } from "@/lib/cn";

type Brand = {
  heading: string;
  subtitle: string;
  bullets: string[];
  note: string;
};

/**
 * Split layout shared by login and signup. The brand panel (desktop only)
 * is the same night-blue stage as the landing page's closing CTA: sky glow,
 * a perspective floor, and the floating product cards. The form side stays
 * plain and quiet so the fields carry the page.
 */
export default function AuthShell({
  brand,
  backHome,
  brandSide = "left",
  children,
}: {
  brand: Brand;
  backHome: string;
  brandSide?: "left" | "right";
  children: React.ReactNode;
}) {
  return (
    <main
      className={cn(
        // Desktop: exactly one screen tall, never a page scroll.
        "min-h-svh bg-canvas lg:grid lg:h-svh lg:overflow-hidden lg:p-3",
        brandSide === "left" ? "lg:grid-cols-[1.05fr_1fr]" : "lg:grid-cols-[1fr_1.05fr]",
      )}
    >
      {/* ── Brand panel ─────────────────────────────────────────── */}
      <aside
        className={cn(
          "relative hidden min-h-0 flex-col overflow-hidden rounded-[32px] bg-[#06121f] p-10 text-white short:p-8 lg:flex xl:p-12 xl:short:p-9",
          brandSide === "right" && "lg:order-2",
        )}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(80% 50% at 30% 0%, rgba(3,105,161,0.55), transparent 70%), radial-gradient(60% 45% at 80% 100%, rgba(56,189,248,0.22), transparent 70%)",
          }}
        />
        <div aria-hidden className="pointer-events-none absolute inset-x-[-30%] bottom-[-8%] h-[38%] opacity-60">
          <div className="hp-floor absolute inset-0 [--color-primary:#38bdf8]" />
        </div>

        <div className="relative flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <Logo className="h-9 w-9" />
            <span className="hp-wordmark text-[19px] font-semibold tracking-[-0.03em]">HandyPlan</span>
          </Link>
          <Link
            href="/"
            className="group inline-flex items-center gap-1.5 rounded-full bg-white/8 px-4 py-2 text-[13px] font-medium text-white/80 ring-1 ring-inset ring-white/15 transition-colors hover:bg-white/15 hover:text-white"
          >
            <Icon name="arrow-left" size={15} className="transition-transform duration-300 group-hover:-translate-x-0.5" />
            {backHome}
          </Link>
        </div>

        {/* The stack is 400px tall; it's centred in whatever height is left and
            scaled down on short screens so it never runs into the copy. */}
        <div className="relative my-4 min-h-0 flex-1">
          <div className="absolute left-1/2 top-1/2 w-[460px] -translate-x-1/2 -translate-y-1/2 [@media(max-height:900px)]:scale-[0.78] [@media(max-height:760px)]:scale-[0.64]">
            <AuthShowcase />
          </div>
        </div>

        <div className="auth-rise relative">
          <h2 style={{ ["--i" as string]: 1 }} className="max-w-[520px] text-balance text-[38px] font-semibold leading-[1.02] tracking-[-0.045em] xl:text-[46px]">
            {brand.heading}
          </h2>
          <p style={{ ["--i" as string]: 2 }} className="mt-4 max-w-[440px] [@media(max-height:760px)]:hidden text-pretty text-[17px] leading-relaxed text-white/65">
            {brand.subtitle}
          </p>
          <ul style={{ ["--i" as string]: 3 }} className="mt-7 flex flex-wrap gap-2 short:mt-5">
            {brand.bullets.map((b) => (
              <li key={b} className="flex items-center gap-2 rounded-full bg-white/8 py-1.5 pl-1.5 pr-3.5 text-[13px] font-medium text-white/85 ring-1 ring-inset ring-white/10">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-sky-400/20 text-sky-300">
                  <Icon name="check" size={11} />
                </span>
                {b}
              </li>
            ))}
          </ul>
          <p style={{ ["--i" as string]: 4 }} className="mt-7 flex items-center gap-2 border-t border-white/10 pt-5 text-[13px] text-white/50 short:mt-5 short:pt-4">
            <Icon name="shield" size={15} />
            {brand.note}
          </p>
        </div>
      </aside>

      {/* ── Form panel ──────────────────────────────────────────── */}
      <div className="relative flex min-h-svh flex-col lg:min-h-0">
        <header className="flex items-center justify-between p-5 md:p-6 lg:absolute lg:inset-x-0 lg:top-0 lg:z-10 lg:p-4">
          <Link href="/" className="flex items-center gap-2.5 lg:invisible">
            <Logo className="h-9 w-9" />
            <span className="hp-wordmark text-[19px] font-semibold tracking-[-0.03em] text-ink">HandyPlan</span>
          </Link>
          <div className="flex items-center gap-2">
            <LocaleSwitcher />
            <ThemeToggle />
          </div>
        </header>

        {/* Safety valve for extremely short windows: only the form scrolls */}
        <div className="flex flex-1 flex-col px-5 pb-8 md:px-6 lg:min-h-0 lg:overflow-y-auto lg:py-4">
          {/* m-auto (not items-center) so overflow can never clip the top */}
          <div className="auth-rise m-auto w-full max-w-[420px]">{children}</div>
        </div>
      </div>
    </main>
  );
}
