"use client";

import { useRef, type ElementType } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { cn } from "@/lib/cn";

gsap.registerPlugin(useGSAP, SplitText);

type Props = {
  children: React.ReactNode;
  className?: string;
  as?: ElementType;
  /** "load" plays on mount (hero), "scroll" when the heading enters view. */
  trigger?: "scroll" | "load";
  delay?: number;
};

/**
 * Headline reveal: each rendered line rises out of its own mask. Lines are
 * measured after fonts load and re-split on resize (autoSplit), so the
 * breaks always match what the reader sees. Text stays real text for SEO
 * and screen readers (SplitText adds aria-label to the parent).
 */
export default function SplitReveal({
  children,
  className,
  as,
  trigger = "scroll",
  delay = 0,
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const Tag = (as ?? "h2") as "h2";

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      let played = false;
      const split = SplitText.create(el, {
        type: "lines",
        mask: "lines",
        linesClass: "split-line-inner",
        autoSplit: true,
        onSplit(self) {
          // Re-splits after the first play must not replay the entrance.
          if (played) return;
          return gsap.from(self.lines, {
            yPercent: 110,
            rotate: 2,
            duration: 1.25,
            ease: "expo.out",
            stagger: 0.09,
            delay,
            scrollTrigger:
              trigger === "scroll"
                ? { trigger: el, start: "top 86%", once: true }
                : undefined,
            onComplete: () => {
              played = true;
            },
          });
        },
      });

      return () => split.revert();
    },
    { scope: ref, dependencies: [] },
  );

  return (
    <Tag ref={ref as React.Ref<HTMLHeadingElement>} className={cn(className)}>
      {children}
    </Tag>
  );
}
