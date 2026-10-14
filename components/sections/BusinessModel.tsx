import { useLocale, useTranslations } from "next-intl";
import { businessModelConfig, navConfig } from "@/lib/content";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import Reveal from "@/components/animations/Reveal";
import SplitReveal from "@/components/animations/SplitReveal";
import TiltCard from "@/components/animations/TiltCard";
import { cn } from "@/lib/cn";

type Side = { label: string; title: string; points: string[]; note: string };

/** Freemium: the core product is free; AI features and priority match are paid. */
export default function BusinessModel() {
  const t = useTranslations("model");
  const nav = useTranslations("nav");
  const locale = useLocale();

  return (
    <section id="model" className="relative overflow-hidden py-20 sm:py-28 lg:py-40">
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/3 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-primary/10 blur-[140px]" />
      <Container className="relative max-w-[1180px]">
        <div className="mx-auto max-w-[760px] text-center">
          <span className="text-sm font-semibold uppercase tracking-[0.14em] text-primary">{t("eyebrow")}</span>
          <SplitReveal className="mt-4 text-balance text-[34px] font-semibold leading-[1.02] tracking-[-0.045em] text-ink sm:text-6xl lg:text-[68px]">
            {t("title")}
          </SplitReveal>
          <Reveal className="mx-auto mt-5 max-w-lg text-lg text-slate">
            <p>{t("subtitle")}</p>
          </Reveal>
        </div>

        <Reveal stagger={0.12} y={56} className="mx-auto mt-10 grid max-w-[1000px] gap-4 sm:mt-16 sm:gap-5 lg:grid-cols-[1.08fr_1fr]">
          {businessModelConfig.map((cfg) => {
            const side = t.raw(cfg.key) as Side;
            const free = cfg.featured;
            return (
              <TiltCard
                key={cfg.key}
                as="article"
                max={5}
                className={cn(
                  "flex flex-col overflow-hidden rounded-[28px] p-6 sm:rounded-[36px] sm:p-8 lg:p-11",
                  free
                    ? "bg-surface shadow-[var(--shadow-float)] ring-1 ring-primary/25"
                    : "border border-line bg-surface/50",
                )}
              >
                <div className="relative flex items-center justify-between">
                  <span className={cn("text-sm font-semibold", free ? "text-primary" : "text-slate")}>{side.label}</span>
                  <span className={cn("flex h-11 w-11 items-center justify-center rounded-2xl", free ? "bg-primary text-white" : "bg-cloud text-slate")}>
                    <Icon name={cfg.icon} size={20} />
                  </span>
                </div>

                <p className="relative mt-6 text-[60px] font-semibold leading-none tracking-[-0.06em] text-ink sm:mt-8 sm:text-[72px] lg:text-[88px]">
                  {free ? "€0" : <Icon name="sparkle" size={60} className="text-primary" />}
                </p>
                <h3 className="relative mt-5 text-2xl font-semibold tracking-[-0.03em] text-ink">{side.title}</h3>

                <ul className="relative mt-7 flex flex-1 flex-col gap-3.5">
                  {side.points.map((point) => (
                    <li key={point} className="flex items-start gap-3 text-graphite">
                      <span className={cn("mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full", free ? "bg-primary text-white" : "bg-cloud text-slate")}>
                        <Icon name="check" size={12} />
                      </span>
                      {point}
                    </li>
                  ))}
                </ul>

                <p className="relative mt-8 border-t border-line pt-5 text-sm leading-relaxed text-slate">{side.note}</p>
                {free && (
                  <div className="relative mt-7">
                    <Button href={`/${locale}${navConfig.cta.href}`} size="lg" iconAfter="arrow-right" full>
                      {nav("cta")}
                    </Button>
                  </div>
                )}
              </TiltCard>
            );
          })}
        </Reveal>
      </Container>
    </section>
  );
}
