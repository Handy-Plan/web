"use client";

import { useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useLocale, useTranslations } from "next-intl";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { navConfig } from "@/lib/content";
import { cn } from "@/lib/cn";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import Magnetic from "@/components/animations/Magnetic";
import SplitReveal from "@/components/animations/SplitReveal";
import type { ScreenCopy } from "@/components/three/PhoneScreen";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const PhoneStage = dynamic(() => import("@/components/three/PhoneStage"), { ssr: false });

type Step = { title: string; body: string };

/** Beats after the hero; the total scroll length is (BEATS + 1) screens. */
const BEATS = 5;

/**
 * Hero + "how it works" as one pinned, scroll-driven film. A single 3D phone
 * stays on stage while the camera moves between five shots: it rings, the
 * call is missed, the caller gets a text, a job card lifts off the glass,
 * and the job is booked. The copy for each beat swaps alongside.
 */
export default function Story() {
  const t = useTranslations("hero");
  const how = useTranslations("howItWorks");
  const all = useTranslations();
  const locale = useLocale();
  const steps = how.raw("craftsman") as Step[];

  const root = useRef<HTMLElement>(null);
  const heroCopy = useRef<HTMLDivElement>(null);
  const rail = useRef<HTMLDivElement>(null);
  const progress = useRef(0);
  const [step, setStep] = useState(0);

  const copy = useMemo<ScreenCopy>(
    () => ({
      ...(all.raw("mockup") as Omit<ScreenCopy, "date" | "now">),
      date: new Intl.DateTimeFormat(locale, { weekday: "long", day: "numeric", month: "long" }).format(new Date()),
      now: new Intl.RelativeTimeFormat(locale, { numeric: "auto" }).format(0, "second"),
    }),
    [all, locale],
  );

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;

      ScrollTrigger.create({
        trigger: el,
        start: "top top",
        end: "bottom bottom",
        onUpdate(self) {
          progress.current = self.progress;
          const next = Math.min(4, Math.round(self.progress * BEATS));
          setStep((prev) => (prev === next ? prev : next));
          if (rail.current) rail.current.style.setProperty("--p", String(Math.min(1, Math.max(0, (self.progress * BEATS - 0.5) / 3.5))));
        },
      });

      // Hero copy drifts up and out of focus as the camera moves in.
      if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.to(heroCopy.current, {
          yPercent: -18,
          autoAlpha: 0,
          filter: "blur(10px)",
          ease: "none",
          scrollTrigger: { trigger: el, start: "top top", end: "+=55%", scrub: true },
        });
      }
    },
    { scope: root, dependencies: [] },
  );

  return (
    <section
      ref={root}
      aria-label={how("craftsmanLabel")}
      className="relative"
      style={{ height: `${(BEATS + 1) * 100}vh` }}
    >
      {/* Anchor for "How it works": the first beat after the hero */}
      <span id="how-it-works" aria-hidden className="absolute left-0 top-[100vh]" />

      <div className="sticky top-0 h-[100dvh] overflow-hidden">
        {/* Ambient light behind the handset */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute right-[-10%] top-[8%] h-[80vmin] w-[80vmin] rounded-full bg-primary/25 blur-[140px] dark:bg-primary/30 max-md:left-1/2 max-md:right-auto max-md:-translate-x-1/2" />
          <div className="absolute bottom-[-20%] left-[-10%] h-[60vmin] w-[60vmin] rounded-full bg-sky-300/20 blur-[120px] dark:bg-sky-500/10" />
          <div
            className="bg-dot-grid absolute inset-0 opacity-60 dark:opacity-30"
            style={{
              maskImage: "radial-gradient(ellipse 60% 55% at 70% 45%, black, transparent)",
              WebkitMaskImage: "radial-gradient(ellipse 60% 55% at 70% 45%, black, transparent)",
            }}
          />
        </div>

        <PhoneStage progress={progress} step={step} copy={copy} className="absolute inset-0" />

        {/* Readability scrim for the copy (mobile sits over the phone) */}
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 z-[8] h-[48%] bg-gradient-to-t from-canvas from-40% via-canvas/80 to-transparent md:hidden" />

        <div className="pointer-events-none relative z-10 mx-auto flex h-full w-full max-w-[1280px] items-end px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] md:items-center md:px-10 md:pb-0">
          {/* Hero */}
          <div ref={heroCopy} className="pointer-events-auto absolute inset-x-5 bottom-[max(1.5rem,env(safe-area-inset-bottom))] max-w-[620px] md:inset-x-10 md:bottom-auto md:top-1/2 md:-translate-y-1/2">
            {/* Hidden on phones: the phone + headline already say it, and the
                space goes to the 3D handset above the copy. */}
            <span className="glass hidden items-center gap-2 rounded-full px-3.5 py-1.5 text-[13px] font-medium text-graphite md:inline-flex">
              <Icon name="phone-missed" size={14} className="text-primary" />
              {t("badge")}
            </span>
            <SplitReveal
              as="h1"
              trigger="load"
              delay={0.15}
              className="text-balance text-[32px] font-semibold leading-[1.04] tracking-[-0.045em] text-ink min-[400px]:text-[36px] sm:text-[48px] md:mt-5 md:text-[54px] lg:text-[64px]"
            >
              {t("titleLead")} <span className="text-primary">{t("titleAccent")}</span>
            </SplitReveal>
            <p className="mt-4 max-w-[480px] text-pretty text-[15px] leading-relaxed text-slate sm:text-[17px] md:mt-6 lg:text-lg">
              {t("subtitle")}
            </p>
            <div className="mt-6 flex items-center gap-1 md:mt-8 md:gap-3">
              <Magnetic>
                <Button
                  href={`/${locale}${navConfig.cta.href}`}
                  size="lg"
                  iconAfter="arrow-right"
                  className="whitespace-nowrap max-md:h-[52px] max-md:px-6 max-md:text-[15px]"
                >
                  {t("primaryCta")}
                </Button>
              </Magnetic>
              <a
                href="#how-it-works"
                className="group inline-flex h-[52px] items-center gap-1.5 whitespace-nowrap max-[399px]:hidden rounded-xl px-3 text-[15px] font-semibold text-graphite transition-colors hover:text-primary md:h-14 md:gap-2 md:px-5 md:text-base"
              >
                {t("secondaryCta")}
                <Icon name="chevron-down" size={18} className="transition-transform duration-300 group-hover:translate-y-0.5" />
              </a>
            </div>
          </div>

          {/* Beats */}
          <div className="relative w-full max-w-[460px] md:min-h-[260px]">
            {steps.map((s, i) => {
              const active = step === i + 1;
              return (
                <div
                  key={s.title}
                  aria-hidden={!active}
                  className={cn(
                    "absolute inset-x-0 bottom-0 transition-[opacity,transform,filter] duration-[900ms] ease-[var(--ease-out-expo)] md:bottom-auto md:top-1/2",
                    active
                      ? "opacity-100 blur-0 md:-translate-y-1/2"
                      : step > i + 1
                        ? "pointer-events-none -translate-y-10 opacity-0 blur-md md:-translate-y-[calc(50%+40px)]"
                        : "pointer-events-none translate-y-10 opacity-0 blur-md md:-translate-y-[calc(50%-40px)]",
                  )}
                >
                  <h2 className="text-[34px] font-semibold leading-[1.05] tracking-[-0.04em] text-ink sm:text-5xl lg:text-[60px]">
                    {s.title}
                  </h2>
                  <p className="mt-4 max-w-[380px] text-pretty text-[17px] leading-relaxed text-slate lg:text-lg">
                    {s.body}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Progress rail */}
        <div
          ref={rail}
          aria-hidden
          className={cn(
            "absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 items-center gap-3 transition-opacity duration-500 md:flex",
            step === 0 ? "opacity-0" : "opacity-100",
          )}
          style={{ ["--p" as string]: 0 }}
        >
          <span className="text-xs font-medium text-slate">{how("craftsmanLabel")}</span>
          <span className="relative h-[3px] w-48 overflow-hidden rounded-full bg-line">
            <span className="absolute inset-0 origin-left scale-x-[var(--p)] rounded-full bg-primary" />
          </span>
        </div>
      </div>
    </section>
  );
}
