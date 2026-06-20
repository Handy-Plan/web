"use client";

import { useRef, type ElementType } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { cn } from "@/lib/cn";

gsap.registerPlugin(useGSAP);

type Props = {
  children: React.ReactNode;
  className?: string;
  /** Stagger between direct children (seconds). 0 = animate the wrapper itself. */
  stagger?: number;
  /** Vertical travel distance in px. */
  y?: number;
  /** Initial delay (seconds). */
  delay?: number;
  /** "scroll" reveals when scrolled into view; "load" plays on mount. */
  trigger?: "scroll" | "load";
  as?: ElementType;
  id?: string;
};

/**
 * Server-content-friendly animation wrapper. Children render on the server;
 * this client island only attaches the GSAP entrance animation.
 *
 * Uses an IntersectionObserver (not ScrollTrigger) to fire the reveal — it
 * always triggers when the element enters the viewport and can never leave
 * content stuck at opacity:0. useGSAP runs in a layout effect, so the hidden
 * start state is applied before paint (no flash).
 */
export default function Reveal({
  children,
  className,
  stagger = 0,
  y = 28,
  delay = 0,
  trigger = "scroll",
  as,
  id,
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const Tag = (as ?? "div") as ElementType;

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      const targets = stagger ? gsap.utils.toArray(el.children) : el;

      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      // Always-visible fallbacks: reduced motion or no observer support.
      if (reduce || typeof IntersectionObserver === "undefined") {
        gsap.set(targets, { autoAlpha: 1, y: 0 });
        return;
      }

      // Hidden start state (applied before paint).
      gsap.set(targets, { autoAlpha: 0, y });

      const reveal = () =>
        gsap.to(targets, {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          delay,
          ease: "power3.out",
          stagger: stagger || undefined,
          overwrite: true,
        });

      if (trigger === "load") {
        reveal();
        return;
      }

      const io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              reveal();
              io.disconnect();
              break;
            }
          }
        },
        // Fire when the element's top reaches ~88% of the viewport height.
        { threshold: 0, rootMargin: "0px 0px -12% 0px" },
      );

      io.observe(el);
      return () => io.disconnect();
    },
    { scope: ref, dependencies: [] },
  );

  return (
    <Tag ref={ref} id={id} data-reveal className={cn(className)}>
      {children}
    </Tag>
  );
}
