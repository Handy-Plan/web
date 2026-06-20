"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

type Props = {
  value: number;
  suffix?: string;
  decimals?: number;
  className?: string;
};

/** Counts up to `value` when scrolled into view (IntersectionObserver-driven). */
export default function Counter({
  value,
  suffix = "",
  decimals = 0,
  className,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      const format = (n: number) =>
        decimals > 0
          ? n.toFixed(decimals)
          : Math.round(n).toLocaleString("en-US");

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
      0{suffix}
    </span>
  );
}
