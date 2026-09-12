import { useTranslations } from "next-intl";
import { languagesConfig } from "@/lib/content";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/animations/Reveal";
import { cn } from "@/lib/cn";

/** German and English available; Arabic coming soon — for the business side too. */
export default function Languages() {
  const t = useTranslations("languages");
  const items = t.raw("items") as { name: string; status: string }[];

  return (
    <section className="py-24 lg:py-32">
      <Container>
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={t("title")}
          subtitle={t("subtitle")}
        />

        <Reveal
          stagger={0.1}
          className="mx-auto mt-14 grid max-w-4xl gap-4 sm:grid-cols-3"
        >
          {items.map((item, i) => {
            const { code, available: live } = languagesConfig[i];
            return (
              <div
                key={code}
                className={cn(
                  "flex flex-col items-center rounded-2xl border bg-surface px-6 py-8 text-center",
                  live
                    ? "border-primary/40 shadow-[var(--shadow-glow)]"
                    : "border-line shadow-[var(--shadow-subtle)]",
                )}
              >
                <span className="font-heading text-3xl font-bold text-ink">
                  {item.name}
                </span>
                <span
                  className={cn(
                    "mt-3 text-xs font-semibold uppercase tracking-[0.12em]",
                    live ? "text-primary" : "text-slate",
                  )}
                >
                  {item.status}
                </span>
              </div>
            );
          })}
        </Reveal>

        <Reveal className="mx-auto mt-10 max-w-3xl text-center">
          <p className="leading-relaxed text-slate">
            <span className="font-semibold text-ink">{t("whyLabel")}</span>{" "}
            {t("why")}
          </p>
          <p className="mt-4 text-xs italic text-slate">{t("source")}</p>
        </Reveal>
      </Container>
    </section>
  );
}
