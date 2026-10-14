"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { setLenis } from "@/lib/lenis";

gsap.registerPlugin(ScrollTrigger);

/**
 * Inertial page scroll for the landing page (Lenis), driven by GSAP's ticker
 * so every ScrollTrigger scrub reads the same smoothed position on the same
 * frame. Skipped entirely for reduced motion and coarse (touch) pointers,
 * where native momentum scrolling is already right.
 */
export default function SmoothScroll() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (reduce || coarse) return;

    const lenis = new Lenis({
      lerp: 0.1,
      wheelMultiplier: 1,
      // Anchor offset comes from `scroll-padding-top` on <html>, which Lenis
      // already honours; adding one here would double it.
      anchors: true,
    });

    setLenis(lenis);
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      setLenis(null);
      lenis.destroy();
    };
  }, []);

  return null;
}
