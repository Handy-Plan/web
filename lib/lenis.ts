import type Lenis from "lenis";

/**
 * The page's Lenis instance, when smooth scrolling is active (it's skipped
 * for touch and reduced motion). Lets UI like the mobile menu pause scrolling
 * and scroll to anchors through Lenis instead of fighting it.
 */
let instance: Lenis | null = null;

export const setLenis = (l: Lenis | null) => {
  instance = l;
};

export const getLenis = () => instance;
