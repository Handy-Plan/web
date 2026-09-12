"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { useLocale } from "next-intl";

gsap.registerPlugin(useGSAP);

type Props = {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
};

/** Counts up to `value` when scrolled into view (IntersectionObserver-driven). */
export default function Counter({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  className,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const locale = useLocale();

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      // Locale-aware grouping: 9,000 (en) vs 9.000 (de).
      const format = (n: number) =>
        prefix +
        (decimals > 0
          ? n.toLocaleString(locale, {
              minimumFractionDigits: decimals,
              maximumFractionDigits: decimals,
            })
          : Math.round(n).toLocaleString(locale));

      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reduce || typeof IntersectionObserver === "undefined") {
        el.textContent = format(value) + suffix;
        return;
      }

      const run = () => {
        const obj = { n: 0 };
        gsap.to(obj, {
          n: value,
          duration: 2,
          ease: "power2.out",
          onUpdate: () => {
            el.textContent = format(obj.n) + suffix;
          },
        });
      };

      const io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              run();
              io.disconnect();
              break;
            }
          }
        },
        { threshold: 0.3 },
      );

      io.observe(el);
      return () => io.disconnect();
    },
    { scope: ref, dependencies: [] },
  );

  return (
    <span ref={ref} className={className}>
      {prefix}0{suffix}
    </span>
  );
}
