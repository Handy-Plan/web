import { useTranslations } from "next-intl";
import { businessModelConfig } from "@/lib/content";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Icon from "@/components/ui/Icon";
import Reveal from "@/components/animations/Reveal";
import { cn } from "@/lib/cn";

type Side = { label: string; title: string; points: string[]; note: string };

/** Freemium: the core product is free; AI features and priority match are paid. */
export default function BusinessModel() {
  const t = useTranslations("model");

  return (
    <section id="model" className="scroll-mt-24 bg-mist py-24 lg:py-32">
      <Container>
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={t("title")}
          subtitle={t("subtitle")}
        />

        <Reveal
          stagger={0.1}
          className="mx-auto mt-16 grid max-w-5xl items-stretch gap-6 lg:grid-cols-2"
        >
          {businessModelConfig.map((cfg) => {
            const side = t.raw(cfg.key) as Side;
            return (
              <article
                key={cfg.key}
                className={cn(
                  "flex flex-col rounded-3xl border bg-surface p-8 lg:p-10",
                  cfg.featured
                    ? "border-primary/30 shadow-[var(--shadow-glow)] ring-1 ring-primary/10"
                    : "border-line shadow-[var(--shadow-subtle)]",
                )}
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-soft text-primary">
                    <Icon name={cfg.icon} size={22} />
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">
                    {side.label}
                  </span>
                </div>

                <h3 className="mt-6 text-2xl font-bold text-ink">{side.title}</h3>

                <ul className="mt-6 flex flex-1 flex-col gap-3">
                  {side.points.map((point) => (
                    <li key={point} className="flex items-start gap-2.5 text-graphite">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success/15 text-success">
                        <Icon name="check" size={12} />
                      </span>
                      {point}
                    </li>
                  ))}
                </ul>

                <p className="mt-8 border-t border-line pt-5 text-sm italic leading-relaxed text-slate">
                  {side.note}
                </p>
              </article>
            );
          })}
        </Reveal>
      </Container>
    </section>
  );
}
