"use client";

import { useRef } from "react";
import { useLocale, useTranslations } from "next-intl";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { navConfig } from "@/lib/content";
import Icon from "@/components/ui/Icon";
import Magnetic from "@/components/animations/Magnetic";
import SplitReveal from "@/components/animations/SplitReveal";
import { Link } from "@/i18n/navigation";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * Closing call to action. The panel opens out from an inset card to nearly
 * full-bleed as it scrolls in (scrubbed), over a perspective floor that
 * runs toward the horizon. Phone-ring ripples pulse out from behind the
 * button, echoing the missed call the page started with.
 */
export default function FinalCTA() {
  const t = useTranslations("finalCta");
  const locale = useLocale();
  const trust = t.raw("trust") as string[];
  const root = useRef<HTMLElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.fromTo(
        panel.current,
        { scale: 0.86, borderRadius: 56, y: 60 },
        {
          scale: 1,
          borderRadius: 32,
          y: 0,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top bottom", end: "top 15%", scrub: true },
        },
      );
      gsap.fromTo(
        "[data-floor]",
        { yPercent: 30, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top 80%", end: "top 20%", scrub: true },
        },
      );
    },
    { scope: root, dependencies: [] },
  );

  return (
    <section ref={root} className="px-3 py-20 md:px-5 lg:py-28">
      <div
        ref={panel}
        className="relative mx-auto flex min-h-[86dvh] max-w-[1480px] flex-col items-center justify-center overflow-hidden rounded-[32px] bg-[#06121f] px-6 py-24 text-center text-white will-change-transform"
      >
        {/* Sky glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(70% 55% at 50% 0%, rgba(3,105,161,0.55), transparent 70%), radial-gradient(50% 40% at 50% 100%, rgba(56,189,248,0.25), transparent 70%)",
          }}
        />

        {/* Perspective floor */}
        <div aria-hidden data-floor className="pointer-events-none absolute inset-x-[-25%] bottom-[-6%] h-[42%] opacity-70">
          <div className="hp-floor absolute inset-0 [--color-primary:#38bdf8]" />
        </div>

        {/* Horizon line */}
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-[64%] h-px bg-gradient-to-r from-transparent via-sky-300/40 to-transparent" />

        <div className="relative max-w-[920px]">
          <SplitReveal className="text-balance text-[44px] font-semibold leading-[0.98] tracking-[-0.05em] sm:text-7xl lg:text-[104px]">
            {t("title")}
          </SplitReveal>
          <p className="mx-auto mt-7 max-w-[520px] text-pretty text-lg leading-relaxed text-white/70 md:text-xl">
            {t("subtitle")}
          </p>

          <div className="relative mt-12 inline-flex">
            {/* Ring echo behind the button */}
            <span aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <span className="hp-ring-soft absolute h-full w-full rounded-full bg-sky-400/25" />
              <span className="hp-ring-soft absolute h-full w-full rounded-full bg-sky-400/20 [animation-delay:1.1s]" />
            </span>
            <Magnetic strength={0.35}>
              <Link
                href={navConfig.cta.href}
                locale={locale}
                className="group relative inline-flex h-16 items-center gap-3 rounded-full bg-white pl-8 pr-2 text-lg font-semibold text-[#06121f] shadow-[0_20px_60px_-10px_rgba(56,189,248,0.55)] transition-transform duration-200 active:scale-[0.97]"
              >
                {t("cta")}
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0369a1] text-white transition-transform duration-500 ease-[var(--ease-spring)] group-hover:rotate-[-45deg]">
                  <Icon name="arrow-right" size={20} />
                </span>
              </Link>
            </Magnetic>
          </div>

          <ul className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {trust.map((item) => (
              <li key={item} className="flex items-center gap-2 text-[15px] font-medium text-white/75">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-sky-400/20 text-sky-300">
                  <Icon name="check" size={12} />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
