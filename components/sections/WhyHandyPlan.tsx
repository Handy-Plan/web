"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { whyIcons } from "@/lib/content";
import Container from "@/components/ui/Container";
import Icon from "@/components/ui/Icon";
import SplitReveal from "@/components/animations/SplitReveal";
import { cn } from "@/lib/cn";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const panel = [
  "bg-surface border border-line",
  "bg-gradient-to-br from-[#0b3a55] via-[#0c4a6e] to-[#0369a1] text-white",
  "bg-ink text-canvas",
];

/** Small typographic visual per reason (no fake UI). */
function Visual({ i }: { i: number }) {
  if (i === 0)
    return (
      <div className="flex flex-col items-start gap-2 font-mono text-[18px] tracking-tight sm:text-[22px] md:gap-3 md:text-[30px]">
        <span className="rounded-2xl bg-mist px-4 py-2.5 text-ink md:px-5 md:py-3">+49 355 ••• ••12</span>
        <span className="ml-6 flex items-center gap-2 text-primary md:ml-8">
          <Icon name="arrow-right" size={22} className="rotate-90" />
        </span>
        <span className="flex items-center gap-2.5 rounded-2xl bg-primary px-4 py-2.5 font-sans font-semibold text-white md:px-5 md:py-3">
          <Icon name="message" size={24} />
          HandyPlan
        </span>
      </div>
    );
  if (i === 1)
    return (
      <div className="flex items-end gap-6">
        <div>
          <p className="font-mono text-sm opacity-60">€/mo</p>
          <p className="text-[48px] font-semibold leading-none tracking-[-0.06em] line-through decoration-white/40 decoration-2 opacity-50 sm:text-[72px] md:text-[96px]">
            49-75
          </p>
        </div>
        <p className="text-[64px] font-semibold leading-none tracking-[-0.06em] sm:text-[96px] md:text-[132px]">0</p>
      </div>
    );
  return (
    <div className="flex items-center gap-4">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-success/20 text-success sm:h-24 sm:w-24 md:h-28 md:w-28">
        <Icon name="shield" size={36} />
      </span>
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 sm:h-16 sm:w-16 md:h-20 md:w-20">
        <Icon name="euro" size={30} />
      </span>
    </div>
  );
}

/**
 * Three reasons as a sticky stack: each panel pins below the nav and the
 * next one slides over it, while the one underneath recedes (scale + dim),
 * like cards dealt onto a table.
 */
export default function WhyHandyPlan() {
  const t = useTranslations("why");
  const cards = t.raw("cards") as { title: string; body: string }[];
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const els = gsap.utils.toArray<HTMLElement>("[data-stack]");
      els.forEach((card, i) => {
        const next = els[i + 1];
        if (!next) return;
        gsap.to(card.firstElementChild, {
          scale: 0.9,
          opacity: 0.35,
          filter: "blur(2px)",
          ease: "none",
          scrollTrigger: { trigger: next, start: "top bottom", end: "top 20%", scrub: true },
        });
      });
    },
    { scope: root, dependencies: [] },
  );

  return (
    <section ref={root} id="why" className="relative py-20 sm:py-28 lg:py-36">
      <Container className="max-w-[1180px]">
        <SplitReveal className="max-w-[820px] text-balance text-[32px] font-semibold leading-[1.02] tracking-[-0.045em] text-ink sm:text-6xl lg:text-[64px]">
          {t("title")}
        </SplitReveal>
        <p className="mt-4 max-w-lg text-[17px] text-slate sm:mt-5 sm:text-lg">{t("subtitle")}</p>

        <div className="mt-10 flex flex-col gap-6 md:mt-16 md:gap-8">
          {cards.map((card, i) => (
            <div
              key={card.title}
              data-stack
              className="sticky top-[calc(5rem+var(--i)*0.75rem)] md:top-[calc(6.5rem+var(--i)*1.25rem)]"
              style={{ ["--i" as string]: i }}
            >
              <article
                className={cn(
                  // Phones: each panel must fit the screen below the nav before the
                  // next one slides over it, so no min-height and tighter spacing.
                  "grid origin-top items-center gap-7 overflow-hidden rounded-[28px] p-6 will-change-transform sm:p-8 md:min-h-[58vh] md:grid-cols-[1.1fr_1fr] md:gap-10 md:rounded-[36px] md:p-14",
                  panel[i],
                )}
              >
                <div>
                  <span
                    className={cn(
                      "flex h-12 w-12 items-center justify-center rounded-2xl",
                      i === 0 ? "bg-primary-soft text-primary" : "bg-white/10",
                    )}
                  >
                    <Icon name={whyIcons[i]} size={24} />
                  </span>
                  <h3 className={cn("mt-5 text-[28px] font-semibold leading-[1.05] tracking-[-0.04em] sm:text-[34px] md:mt-8 md:text-[52px]", i === 0 && "text-ink")}>
                    {card.title}
                  </h3>
                  <p className={cn("mt-3 max-w-[460px] text-pretty text-[16px] leading-relaxed sm:text-lg md:mt-5", i === 0 ? "text-slate" : "opacity-75")}>
                    {card.body}
                  </p>
                </div>
                <div className="flex md:justify-end">
                  <Visual i={i} />
                </div>
              </article>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
