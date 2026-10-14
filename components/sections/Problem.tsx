"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Container from "@/components/ui/Container";
import Icon from "@/components/ui/Icon";
import Reveal from "@/components/animations/Reveal";
import SplitReveal from "@/components/animations/SplitReveal";
import ScrubText from "@/components/animations/ScrubText";
import { cn } from "@/lib/cn";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * How a job disappears, told as a timeline the reader draws by scrolling.
 * Each beat lights up as the line reaches it; the last one turns red. Then
 * the claim lands word by word.
 */
export default function Problem() {
  const t = useTranslations("problem");
  const steps = t.raw("steps") as string[];
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const line = root.current?.querySelector<HTMLElement>("[data-line]");
      const items = gsap.utils.toArray<HTMLElement>("[data-beat]");

      if (reduce) {
        items.forEach((el) => el.setAttribute("data-on", ""));
        if (line) gsap.set(line, { scaleY: 1 });
        return;
      }

      if (line) {
        gsap.fromTo(
          line,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: { trigger: "[data-timeline]", start: "top 65%", end: "bottom 60%", scrub: true },
          },
        );
      }
      items.forEach((el) => {
        ScrollTrigger.create({
          trigger: el,
          start: "top 62%",
          onEnter: () => el.setAttribute("data-on", ""),
          onLeaveBack: () => el.removeAttribute("data-on"),
        });
      });
    },
    { scope: root, dependencies: [] },
  );

  return (
    <section ref={root} id="problem" className="relative overflow-x-clip py-20 sm:py-28 lg:py-40">
      <Container className="max-w-[1180px]">
        <div className="grid gap-12 sm:gap-16 lg:grid-cols-[1fr_1.1fr] lg:gap-24">
          {/* Heading stays in view while the timeline scrolls past */}
          <div className="lg:sticky lg:top-32 lg:self-start">
            <SplitReveal className="text-balance text-[34px] font-semibold leading-[1.02] tracking-[-0.045em] text-ink sm:text-6xl lg:text-[68px]">
              {t("title")}
            </SplitReveal>
            <Reveal className="mt-6 max-w-md text-pretty text-lg leading-relaxed text-slate">
              <p>{t("subtitle")}</p>
            </Reveal>
          </div>

          <ol data-timeline className="relative flex flex-col gap-10 pl-12 sm:gap-14 md:gap-20 md:pl-16">
            <span aria-hidden className="absolute bottom-2 left-[15px] top-2 w-px bg-line md:left-[19px]" />
            <span
              aria-hidden
              data-line
              className="absolute bottom-2 left-[15px] top-2 w-px origin-top bg-gradient-to-b from-primary via-primary to-danger md:left-[19px]"
            />
            {steps.map((step, i) => {
              const last = i === steps.length - 1;
              return (
                <li key={step} data-beat className="group relative">
                  <span
                    aria-hidden
                    className={cn(
                      "absolute -left-12 top-1 flex h-[31px] w-[31px] items-center justify-center rounded-full border bg-canvas transition-all duration-700 ease-[var(--ease-spring)] md:-left-16 md:h-[39px] md:w-[39px]",
                      "scale-75 border-line text-muted group-data-[on]:scale-100",
                      last
                        ? "group-data-[on]:border-danger group-data-[on]:bg-danger group-data-[on]:text-white"
                        : "group-data-[on]:border-primary group-data-[on]:bg-primary group-data-[on]:text-white",
                    )}
                  >
                    <Icon name={last ? "phone-missed" : i === 1 ? "phone" : i === 2 ? "users" : "search"} size={16} />
                  </span>
                  <p
                    className={cn(
                      "max-w-[520px] text-pretty text-[20px] font-medium sm:text-[22px] leading-snug tracking-[-0.02em] text-muted transition-colors duration-700 md:text-[28px]",
                      last ? "group-data-[on]:text-danger" : "group-data-[on]:text-ink",
                    )}
                  >
                    {step}
                  </p>
                </li>
              );
            })}
          </ol>
        </div>

        {/* The claim */}
        <div className="mx-auto mt-24 max-w-[980px] text-center sm:mt-36 lg:mt-52">
          <ScrubText
            as="h3"
            text={t("claimTitle")}
            className="text-balance text-[44px] font-semibold leading-[1] tracking-[-0.05em] text-ink sm:text-7xl lg:text-[112px]"
          />
          <Reveal className="mx-auto mt-8 max-w-[560px]">
            <p className="text-pretty text-lg leading-relaxed text-slate md:text-xl">{t("claimBody")}</p>
          </Reveal>
        </div>

        <Reveal stagger={0.12} className="mx-auto mt-14 grid max-w-[980px] gap-4 sm:mt-20 md:grid-cols-[1.2fr_1fr]">
          <div className="flex flex-col justify-between gap-6 rounded-[28px] bg-gradient-to-br from-primary to-violet p-7 text-white md:p-9">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15">
              <Icon name="bolt" size={20} />
            </span>
            <p className="text-pretty leading-relaxed text-white/85">
              <span className="font-semibold text-white">{t("whyNowLabel")}</span> {t("whyNow")}
            </p>
          </div>
          <div className="flex flex-col justify-between gap-6 rounded-[28px] border border-line bg-surface p-7 md:p-9">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-warning/15 text-amber-600 dark:text-amber-400">
              <Icon name="alert" size={20} />
            </span>
            <p className="text-pretty leading-relaxed text-slate">
              <span className="font-semibold text-ink">{t("fitLabel")}</span> {t("fit")}
            </p>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
