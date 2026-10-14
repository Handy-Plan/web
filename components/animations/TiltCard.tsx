"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { cn } from "@/lib/cn";

gsap.registerPlugin(useGSAP);

/**
 * Card that tilts toward the cursor in 3D and carries a soft spotlight under
 * the pointer (see `.spotlight` in globals.css). The tilt is small (max ~7°)
 * so text stays readable; it eases home when the pointer leaves.
 */
export default function TiltCard({
  children,
  className,
  max = 7,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  max?: number;
  as?: "div" | "article" | "li";
}) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!fine) return;

      gsap.set(el, { transformPerspective: 900 });
      const rxTo = gsap.quickTo(el, "rotationX", { duration: 0.7, ease: "power3.out" });
      const ryTo = gsap.quickTo(el, "rotationY", { duration: 0.7, ease: "power3.out" });

      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        el.style.setProperty("--mx", `${px * 100}%`);
        el.style.setProperty("--my", `${py * 100}%`);
        if (reduce) return;
        ryTo((px - 0.5) * 2 * max);
        rxTo(-(py - 0.5) * 2 * max);
      };
      const leave = () => {
        rxTo(0);
        ryTo(0);
      };

      el.addEventListener("pointermove", move);
      el.addEventListener("pointerleave", leave);
      return () => {
        el.removeEventListener("pointermove", move);
        el.removeEventListener("pointerleave", leave);
      };
    },
    { scope: ref, dependencies: [max] },
  );

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Tag ref={ref as any} className={cn("spotlight relative will-change-transform", className)}>
      {children}
    </Tag>
  );
}
