import { useTranslations } from "next-intl";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import Reveal from "@/components/animations/Reveal";
import CalendarMockup from "@/components/sections/CalendarMockup";

export default function Hero() {
  const t = useTranslations("hero");
  const bullets = t.raw("bullets") as string[];
  const trust = t.raw("trust") as string[];

  return (
    <section className="relative overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-28">
      {/* Ambient background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        <div className="absolute -top-40 left-1/2 h-[640px] w-[640px] -translate-x-1/2 rounded-full bg-gradient-to-br from-primary/20 to-indigo/10 blur-[120px]" />
        <div className="absolute right-0 top-1/3 h-80 w-80 rounded-full bg-indigo/10 blur-[100px]" />
        <div className="absolute -left-20 bottom-0 h-72 w-72 rounded-full bg-violet/10 blur-[110px]" />
        <div
          className="bg-dot-grid absolute inset-0 opacity-[0.5]"
          style={{
            maskImage:
              "radial-gradient(ellipse 80% 60% at 50% 30%, black, transparent)",
            WebkitMaskImage:
              "radial-gradient(ellipse 80% 60% at 50% 30%, black, transparent)",
          }}
        />
      </div>

      <Container className="grid items-center gap-16 lg:grid-cols-[1.05fr_1fr]">
        {/* Copy */}
        <Reveal trigger="load" stagger={0.1} className="flex flex-col items-start">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-surface/70 px-4 py-1.5 text-sm font-medium text-primary shadow-[var(--shadow-subtle)] backdrop-blur-sm ring-1 ring-inset ring-white/40 dark:ring-white/10">
            <Icon name="sparkle" size={15} filled className="text-indigo" />
            {t("badge")}
          </span>

          <h1 className="mt-6 text-balance text-[40px] font-extrabold leading-[1.05] tracking-tight text-ink sm:text-5xl lg:text-[64px]">
            {t("titleLead")}{" "}
            <span className="text-gradient">{t("titleAccent")}</span>
          </h1>

          <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-slate lg:text-xl">
            {t("subtitle")}
          </p>

          <ul className="mt-8 flex flex-col gap-3.5">
            {bullets.map((b) => (
              <li key={b} className="flex items-center gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-success/15 text-success">
                  <Icon name="check" size={14} />
                </span>
                <span className="font-medium text-graphite">{b}</span>
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Button href="#pricing" size="lg" iconAfter="arrow-right">
              {t("primaryCta")}
            </Button>
            <Button
              href="#how-it-works"
              size="lg"
              variant="secondary"
              iconBefore="play"
            >
              {t("secondaryCta")}
            </Button>
          </div>

          <ul className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-line/70 pt-6">
            {trust.map((item) => (
              <li
                key={item}
                className="flex items-center gap-1.5 text-sm font-medium text-slate"
              >
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-success/15 text-success">
                  <Icon name="check" size={11} />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </Reveal>

        {/* Visual */}
        <Reveal trigger="load" delay={0.2} y={40} className="relative">
          <div className="animate-float-slow">
            <CalendarMockup />
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
