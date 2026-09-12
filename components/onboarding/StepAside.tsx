import { getTranslations } from "next-intl/server";
import type { OnboardingStep } from "@/lib/content";
import Icon from "@/components/ui/Icon";

/**
 * Desktop side panel for the onboarding steps: a preview of the SMS callers
 * will get (built from what's saved so far) and a short "why we ask" note.
 */
export default async function StepAside({
  step,
  businessName,
  emergencyPhone,
}: {
  step: OnboardingStep;
  businessName?: string;
  emergencyPhone?: string;
}) {
  const t = await getTranslations("onboarding.aside");
  const name = businessName || t("namePlaceholder");

  return (
    <div className="flex flex-col gap-4">
      {/* What callers receive */}
      <div className="overflow-hidden rounded-3xl border border-line bg-surface shadow-[var(--shadow-soft)]">
        <div className="flex items-center gap-2 border-b border-line bg-fog px-5 py-3.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-soft text-primary">
            <Icon name="message" size={15} />
          </span>
          <p className="text-sm font-semibold text-ink">{t("previewTitle")}</p>
        </div>
        <div className="flex flex-col gap-3 p-5">
          <div className="self-end rounded-2xl rounded-br-md bg-primary px-4 py-3 text-sm leading-snug text-white">
            {t("previewText", { name })}
            {emergencyPhone && (
              <span className="mt-2 block font-semibold">
                {t("previewEmergency", { phone: emergencyPhone })}
              </span>
            )}
          </div>
          <p className="text-xs leading-relaxed text-slate">{t("previewNote")}</p>
        </div>
      </div>

      {/* Why we ask */}
      <div className="rounded-3xl border border-dashed border-primary/40 bg-primary-soft/40 p-5">
        <p className="flex items-center gap-2 text-sm font-semibold text-ink">
          <Icon name="target" size={16} className="text-primary" />
          {t("whyTitle")}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-slate">{t(`why.${step}`)}</p>
      </div>
    </div>
  );
}
