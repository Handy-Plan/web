import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Icon, { type IconName } from "@/components/ui/Icon";

/** Empty state for dashboard sections that don't have real content yet. */
export default async function SectionPlaceholder({
  section,
  icon,
}: {
  section: string;
  icon: IconName;
}) {
  const t = await getTranslations("dashboard");

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center rounded-3xl border border-dashed border-line bg-surface/60 px-6 py-16 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-soft text-primary">
        <Icon name={icon} size={26} />
      </span>
      <h1 className="mt-5 text-2xl font-extrabold tracking-tight text-ink">
        {t(`nav.${section}`)}
      </h1>
      <p className="mt-2 max-w-md text-pretty text-slate">{t(`placeholder.${section}`)}</p>
      <p className="mt-1 text-sm font-medium text-slate">{t("placeholder.empty")}</p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        {section === "profile" && (
          <Link
            href="/onboarding/business"
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-white shadow-[0_4px_14px_rgba(3,105,161,0.3)] transition-all hover:-translate-y-0.5 hover:bg-primary-dark"
          >
            <Icon name="building" size={16} />
            {t("placeholder.editProfile")}
          </Link>
        )}
        {section !== "overview" && (
          <Link
            href="/dashboard"
            className="inline-flex h-10 items-center gap-1.5 rounded-xl px-3 text-sm font-semibold text-slate transition-colors hover:text-primary"
          >
            <Icon name="arrow-left" size={16} />
            {t("placeholder.back")}
          </Link>
        )}
      </div>
    </div>
  );
}
