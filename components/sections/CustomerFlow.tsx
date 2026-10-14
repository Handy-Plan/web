"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { customerFlowIcons } from "@/lib/content";
import Icon from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type Step = { title: string; body: string };

const tone = [
  "bg-surface border border-line",
  "bg-primary-soft",
  "bg-gradient-to-br from-primary to-violet text-white",
  "bg-ink text-canvas",
];

/**
 * The customer side of the flow. On desktop the section pins and vertical
 * scroll pans a track of cards sideways; each card tilts slightly as it
 * crosses the centre. Below `lg` the same markup becomes a vertical stack
 * of compact cards that rise in as they enter the viewport.
 */
export default function CustomerFlow() {
  const t = useTranslations("howItWorks");
  const steps = t.raw("customer") as Step[];
  const wrap = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const el = track.current!;
        const distance = () => el.scrollWidth - window.innerWidth;
        const pan = gsap.to(el, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: wrap.current,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });
        gsap.utils.toArray<HTMLElement>("[data-card]").forEach((card) => {
          gsap.fromTo(
            card,
            { rotateY: -14, z: -120, opacity: 0.4 },
            {
              rotateY: 0,
              z: 0,
              opacity: 1,
              ease: "power2.out",
              scrollTrigger: {
                trigger: card,
                containerAnimation: pan,
                start: "left 100%",
                end: "left 45%",
                scrub: true,
              },
            },
          );
        });
      });
      mm.add("(max-width: 1023px) and (prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>("[data-card]").forEach((card) => {
          gsap.from(card, {
            y: 48,
            opacity: 0,
            duration: 1,
            ease: "expo.out",
            scrollTrigger: { trigger: card, start: "top 88%", once: true },
          });
        });
      });
      return () => mm.revert();
    },
    { scope: wrap, dependencies: [] },
  );

  return (
    <section ref={wrap} id="customers" className="relative overflow-x-clip bg-mist py-20 sm:py-24 lg:flex lg:h-[100dvh] lg:items-center lg:overflow-hidden lg:py-0">
      <div
        ref={track}
        className="mx-auto flex max-w-[640px] flex-col gap-4 px-5 sm:px-6 lg:mx-0 lg:max-w-none lg:flex-row lg:gap-6 lg:px-[max(2rem,calc((100vw-1180px)/2))] lg:[perspective:1400px]"
      >
        {/* Intro panel */}
        <div className="mb-6 flex flex-col justify-center lg:mb-0 lg:w-[460px] lg:shrink-0 lg:pr-10">
          <span className="text-sm font-semibold uppercase tracking-[0.14em] text-primary">{t("customerLabel")}</span>
          <h2 className="mt-3 text-balance text-[34px] font-semibold leading-[1.02] tracking-[-0.045em] text-ink sm:text-5xl lg:text-[60px]">
            {t("title")}
          </h2>
          <p className="mt-4 max-w-sm text-pretty text-[17px] leading-relaxed text-slate sm:text-lg lg:mt-5">{t("subtitle")}</p>
        </div>

        {steps.map((s, i) => (
          <article
            key={s.title}
            data-card
            className={cn(
              "relative flex min-h-[230px] flex-col justify-between gap-10 overflow-hidden rounded-[28px] p-7 sm:p-8 lg:h-[min(520px,62vh)] lg:w-[400px] lg:shrink-0 lg:gap-0 lg:rounded-[32px] lg:p-10",
              tone[i],
            )}
          >
            <span
              aria-hidden
              className={cn(
                "pointer-events-none absolute -right-4 -top-8 text-[160px] font-semibold lg:-right-6 lg:-top-10 lg:text-[220px] leading-none tracking-[-0.08em]",
                i === 2 ? "text-white/10" : i === 3 ? "text-canvas/10" : "text-ink/[0.05]",
              )}
            >
              {i + 1}
            </span>
            <span
              className={cn(
                "relative flex h-12 w-12 items-center justify-center rounded-2xl lg:h-14 lg:w-14",
                // Card 4 sits on `bg-ink`, which flips light in dark mode, so it
                // keeps the solid brand tile rather than a translucent white one.
                i === 2 ? "bg-white/15 text-white" : "bg-primary text-white",
              )}
            >
              <Icon name={customerFlowIcons[i]} size={26} />
            </span>
            <div className="relative">
              <h3 className={cn("text-[26px] font-semibold leading-tight tracking-[-0.035em] lg:text-[30px]", i < 2 && "text-ink")}>{s.title}</h3>
              <p className={cn("mt-3 text-pretty leading-relaxed", i >= 2 ? "opacity-80" : "text-slate")}>{s.body}</p>
            </div>
          </article>
        ))}

        {/* Outro: what's next. box-content: the trailing page gutter (pr) is
            added to the 360px text column instead of eating into it, which
            squeezed the text to a sliver on wide screens. */}
        <div className="mt-4 flex items-center lg:mt-0 lg:box-content lg:w-[360px] lg:shrink-0 lg:pl-8 lg:pr-[max(2rem,calc((100vw-1180px)/2))]">
          <p className="text-pretty text-lg leading-relaxed text-slate lg:text-[22px] lg:leading-snug lg:tracking-[-0.015em] lg:text-graphite">
            <Icon name="sparkle" size={20} className="mb-3 block text-primary" />
            {t("footnote")}
          </p>
        </div>
      </div>
    </section>
  );
}
