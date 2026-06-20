import { useTranslations } from "next-intl";
import { stepsConfig } from "@/lib/content";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import Reveal from "@/components/animations/Reveal";

export default function HowItWorks() {
  const t = useTranslations("howItWorks");
  const items = t.raw("items") as {
    title: string;
    body: string;
    time: string;
  }[];

  return (
    <section
      id="how-it-works"
      className="scroll-mt-24 bg-gradient-to-b from-[#f5f3ff] to-white py-24 dark:from-surface-2 dark:to-canvas lg:py-32"
    >
      <Container>
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={t("title")}
          subtitle={t("subtitle")}
        />

        <div className="relative mt-16">
          {/* connecting line (desktop) */}
          <div
            aria-hidden
            className="absolute left-0 right-0 top-[44px] hidden h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent lg:block"
          />

          <Reveal stagger={0.15} className="grid gap-8 lg:grid-cols-3">
            {stepsConfig.map((s, i) => {
              const item = items[i];
              return (
              <article
                key={s.number}
                className="relative flex flex-col items-center rounded-[20px] border border-line bg-surface p-8 text-center shadow-[var(--shadow-subtle)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[var(--shadow-lift)]"
              >
                <span className="flex h-[88px] w-[88px] items-center justify-center rounded-full bg-gradient-to-br from-primary to-indigo text-3xl font-extrabold text-white shadow-[0_8px_18px_rgba(99,102,241,0.35)] ring-4 ring-surface ring-offset-2 ring-offset-primary/10">
                  {s.number}
                </span>
                <span className="mt-5 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon name={s.icon} size={24} />
                </span>
                <h3 className="mt-4 text-xl font-bold text-ink">{item.title}</h3>
                <p className="mt-2 max-w-xs leading-relaxed text-slate">
                  {item.body}
                </p>
                <span className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-cloud px-3 py-1 text-sm font-medium text-primary">
                  <Icon name="clock" size={14} />
                  {item.time}
                </span>
              </article>
              );
            })}
          </Reveal>
        </div>

        <div className="mt-12 flex justify-center">
          <Button href="#pricing" size="lg" iconAfter="arrow-right">
            {t("cta")}
          </Button>
        </div>
      </Container>
    </section>
  );
}
