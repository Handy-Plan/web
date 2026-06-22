"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { pricingConfig, type PlanInterval } from "@/lib/content";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Icon from "@/components/ui/Icon";
import Reveal from "@/components/animations/Reveal";
import { cn } from "@/lib/cn";

export default function Pricing() {
  const t = useTranslations("pricing");
  const plans = t.raw("plans") as {
    name: string;
    tagline: string;
    cta: string;
    features: string[];
  }[];
  const trust = t.raw("trust") as string[];

  const [interval, setInterval] = useState<PlanInterval>("monthly");
  const yearly = interval === "yearly";

  return (
    <section id="pricing" className="scroll-mt-24 bg-mist py-24 lg:py-32">
      <Container>
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={t("title")}
          subtitle={t("note")}
        />

        {/* Toggle */}
        <Reveal className="mt-10 flex items-center justify-center">
          <div className="inline-flex items-center gap-1 rounded-full border border-line bg-surface p-1 shadow-[var(--shadow-subtle)]">
            <button
              type="button"
              onClick={() => setInterval("monthly")}
              className={cn(
                "rounded-full px-5 py-2 text-sm font-semibold transition-all duration-300",
                !yearly ? "bg-primary text-white shadow-sm" : "text-slate hover:text-ink",
              )}
            >
              {t("monthly")}
            </button>
            <button
              type="button"
              onClick={() => setInterval("yearly")}
              className={cn(
                "flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition-all duration-300",
                yearly ? "bg-primary text-white shadow-sm" : "text-slate hover:text-ink",
              )}
            >
              {t("yearly")}
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-xs font-bold",
                  yearly ? "bg-white/20 text-white" : "bg-success/15 text-success",
                )}
              >
                {t("save")}
              </span>
            </button>
          </div>
        </Reveal>

        {/* Plans */}
        <Reveal
          stagger={0.1}
          className="mt-12 grid items-stretch gap-6 lg:grid-cols-3"
        >
          {pricingConfig.plans.map((cfg, i) => {
            const plan = plans[i];
            const price = yearly ? Math.round(cfg.yearly / 12) : cfg.monthly;
            return (
              <article
                key={plan.name}
                className={cn(
                  "relative flex flex-col rounded-3xl border bg-surface p-8 transition-all duration-300",
                  cfg.featured
                    ? "border-primary/30 shadow-[var(--shadow-glow)] ring-1 ring-primary/10 lg:-translate-y-3 lg:scale-[1.02]"
                    : "border-line shadow-[var(--shadow-subtle)] hover:-translate-y-1.5 hover:border-primary/20 hover:shadow-[var(--shadow-lift)]",
                )}
              >
                {cfg.featured && (
                  <span className="absolute -top-3.5 left-1/2 inline-flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-gradient-to-br from-primary to-indigo px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-white shadow-[var(--shadow-soft)]">
                    <Icon name="sparkle" size={12} filled />
                    {t("mostPopular")}
                  </span>
                )}

                <span className="inline-flex w-fit rounded-lg bg-cloud px-3 py-1 text-xs font-semibold text-slate">
                  {plan.tagline}
                </span>

                <div className="mt-5 flex items-end gap-1">
                  <span className="text-5xl font-extrabold tracking-tight text-ink">
                    €{price}
                  </span>
                  <span className="mb-1.5 text-slate">{t("perMonth")}</span>
                </div>
                <p className="mt-1 text-sm text-muted">
                  {yearly
                    ? t("billedYearly", { amount: cfg.yearly })
                    : t("orBilledYearly", { amount: cfg.yearly })}
                </p>

                <Link
                  href="#"
                  className={cn(
                    "mt-7 flex h-12 items-center justify-center rounded-xl text-[15px] font-semibold transition-all duration-300 active:scale-[0.98]",
                    cfg.featured
                      ? "bg-primary text-white shadow-[0_4px_14px_rgba(3,105,161,0.35)] hover:-translate-y-0.5 hover:bg-primary-dark hover:shadow-[var(--shadow-glow)]"
                      : "border-2 border-primary text-primary hover:bg-primary hover:text-white",
                  )}
                >
                  {plan.cta}
                </Link>

                <ul className="mt-7 flex flex-1 flex-col gap-3">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2.5 text-sm text-graphite">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success/15 text-success">
                        <Icon name="check" size={12} />
                      </span>
                      {feat}
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </Reveal>

        <Reveal className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {trust.map((item) => (
            <span key={item} className="flex items-center gap-1.5 text-sm text-muted">
              <Icon name="check" size={15} className="text-success" />
              {item}
            </span>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}
