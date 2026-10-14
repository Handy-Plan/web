import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Icon, { type IconName } from "@/components/ui/Icon";

/** `--i` drives the staggered entrance (see .auth-rise in globals.css). */
const i = (n: number) => ({ ["--i" as string]: n }) as React.CSSProperties;

/**
 * Empty state for dashboard sections without real content yet: page title,
 * what will live here, and ghost rows that show the shape of the content to
 * come (skeleton shapes only, never fake data).
 */
export default async function SectionPlaceholder({ section, icon }: { section: string; icon: IconName }) {
  const t = await getTranslations("dashboard");

  return (
    <div className="auth-rise flex flex-col gap-6 pt-2">
      <div style={i(0)}>
        <h1 className="text-[32px] font-semibold leading-[1.05] tracking-[-0.045em] text-ink sm:text-[44px]">
          {t(`nav.${section}`)}
        </h1>
        <p className="mt-2 max-w-xl text-pretty text-[16px] leading-relaxed text-slate">{t(`placeholder.${section}`)}</p>
      </div>

      <section
        style={i(1)}
        className="relative overflow-hidden rounded-[28px] border border-line bg-surface px-6 pb-12 pt-6 sm:px-8"
      >
        {/* Ghost rows, fading out downwards */}
        <ul
          aria-hidden
          className="flex flex-col divide-y divide-line"
          style={{
            maskImage: "linear-gradient(to bottom, black 10%, transparent 95%)",
            WebkitMaskImage: "linear-gradient(to bottom, black 10%, transparent 95%)",
          }}
        >
          {[0, 1, 2, 3].map((k) => (
            <li key={k} className="flex items-center gap-4 py-4">
              <span className="h-10 w-10 shrink-0 rounded-full bg-surface-2" />
              <span className="flex flex-1 flex-col gap-2">
                <span className="h-2.5 rounded-full bg-line" style={{ width: `${48 - k * 6}%` }} />
                <span className="h-2 rounded-full bg-cloud" style={{ width: `${30 + k * 5}%` }} />
              </span>
              <span className="hidden h-7 w-20 rounded-full bg-surface-2 sm:block" />
            </li>
          ))}
        </ul>

        {/* Message over the ghosts */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-soft text-primary shadow-[0_0_0_8px_var(--color-canvas)]">
            <Icon name={icon} size={24} />
          </span>
          <p className="mt-4 text-[17px] font-semibold tracking-[-0.02em] text-ink">{t("placeholder.empty")}</p>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
            {section === "profile" && (
              <Link
                href="/onboarding/business"
                className="group inline-flex h-11 items-center gap-2 rounded-full bg-ink px-5 text-[14px] font-semibold text-canvas transition-[transform,background-color] duration-200 hover:bg-primary hover:text-white active:scale-[0.97]"
              >
                <Icon name="building" size={16} />
                {t("placeholder.editProfile")}
              </Link>
            )}
            {section !== "overview" && (
              <Link
                href="/dashboard"
                className="inline-flex h-11 items-center gap-1.5 rounded-full border border-line bg-surface px-4 text-[14px] font-medium text-graphite transition-colors hover:border-ink/25 hover:text-ink"
              >
                <Icon name="arrow-left" size={15} />
                {t("placeholder.back")}
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
