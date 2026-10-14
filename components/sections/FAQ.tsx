"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { navConfig } from "@/lib/content";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import Reveal from "@/components/animations/Reveal";
import SplitReveal from "@/components/animations/SplitReveal";
import { cn } from "@/lib/cn";

/**
 * FAQ as a two-column editorial layout: the heading and a CTA stay pinned on
 * the left while the questions scroll on the right. The open row grows
 * (grid-rows 0fr → 1fr), its answer rises in, a brand bar draws down its
 * edge and the plus turns into a minus.
 */
export default function FAQ() {
  const t = useTranslations("faq");
  const nav = useTranslations("nav");
  const cta = useTranslations("finalCta");
  const locale = useLocale();
  const faqs = t.raw("items") as { q: string; a: string }[];
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="relative py-20 sm:py-28 lg:py-40">
      <Container className="max-w-[1180px]">
        <div className="grid gap-10 sm:gap-14 lg:grid-cols-[0.9fr_1.4fr] lg:gap-20">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <SplitReveal className="text-balance text-[34px] font-semibold leading-[1.02] tracking-[-0.045em] text-ink sm:text-6xl lg:text-[64px]">
              {t("title")}
            </SplitReveal>
            <Reveal className="mt-8 hidden lg:block">
              <div className="rounded-[28px] border border-line bg-surface p-7">
                <p className="text-[15px] leading-relaxed text-slate">{cta("subtitle")}</p>
                <div className="mt-6">
                  <Button href={`/${locale}${navConfig.cta.href}`} iconAfter="arrow-right">
                    {nav("cta")}
                  </Button>
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal as="ul" stagger={0.06} y={20} className="border-t border-line">
            {faqs.map((item, i) => {
              const isOpen = open === i;
              const id = `faq-${i}`;
              return (
                <li key={item.q} className="relative border-b border-line">
                  {/* Brand bar on the open row */}
                  <span
                    aria-hidden
                    className={cn(
                      "absolute -left-px top-0 h-full w-[2px] origin-top bg-primary transition-transform duration-700 ease-[var(--ease-out-expo)]",
                      isOpen ? "scale-y-100" : "scale-y-0",
                    )}
                  />
                  <h3>
                    <button
                      type="button"
                      id={`${id}-q`}
                      aria-controls={`${id}-a`}
                      aria-expanded={isOpen}
                      onClick={() => setOpen(isOpen ? null : i)}
                      className="group flex w-full items-center gap-4 py-6 pl-4 pr-0 text-left sm:gap-5 sm:py-7 sm:pl-5 sm:pr-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary md:gap-8 md:py-8 md:pl-7"
                    >
                      <span className="hidden w-7 shrink-0 font-mono text-sm sm:block tabular-nums text-muted transition-colors duration-300 group-hover:text-primary">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span
                        className={cn(
                          "flex-1 text-[18px] font-medium sm:text-[19px] leading-snug tracking-[-0.02em] transition-[color,transform] duration-500 ease-[var(--ease-out-expo)] md:text-[24px]",
                          isOpen ? "text-ink" : "text-graphite group-hover:translate-x-1.5 group-hover:text-ink",
                        )}
                      >
                        {item.q}
                      </span>
                      <span
                        aria-hidden
                        className={cn(
                          "relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition-[background-color,border-color,transform] duration-500 ease-[var(--ease-spring)] group-active:scale-90",
                          isOpen ? "rotate-180 border-primary bg-primary" : "border-line group-hover:border-ink/30",
                        )}
                      >
                        <span className={cn("absolute h-[1.5px] w-4 rounded-full", isOpen ? "bg-white" : "bg-ink")} />
                        <span
                          className={cn(
                            "absolute h-4 w-[1.5px] rounded-full transition-transform duration-500 ease-[var(--ease-out-expo)]",
                            isOpen ? "scale-y-0 bg-white" : "bg-ink",
                          )}
                        />
                      </span>
                    </button>
                  </h3>
                  <div
                    id={`${id}-a`}
                    role="region"
                    aria-labelledby={`${id}-q`}
                    className={cn(
                      "grid transition-[grid-template-rows] duration-700 ease-[var(--ease-out-expo)]",
                      isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                    )}
                  >
                    <div className="overflow-hidden">
                      <p
                        className={cn(
                          "max-w-[620px] pb-7 pl-4 pr-12 text-pretty text-[16px] sm:pb-8 sm:pl-[68px] sm:pr-14 sm:text-[17px] leading-relaxed text-slate transition-[opacity,transform,filter] duration-700 ease-[var(--ease-out-expo)] md:pl-[88px]",
                          isOpen ? "translate-y-0 opacity-100 blur-0 delay-100" : "-translate-y-3 opacity-0 blur-[4px]",
                        )}
                      >
                        {item.a}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
