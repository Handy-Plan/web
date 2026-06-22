"use client";

import { useEffect, useLayoutEffect } from "react";
import { usePathname } from "next/navigation";

// useLayoutEffect on the client, useEffect during SSR (avoids the SSR warning).
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

function applyTheme() {
  try {
    const stored = localStorage.getItem("theme");
    const dark = stored
      ? stored === "dark"
      : window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.classList.toggle("dark", dark);
  } catch {
    /* ignore */
  }
}

/**
 * Keeps the `.dark` class on <html> in sync with the saved/system theme.
 *
 * The class is applied before paint by the inline script in the root layout,
 * but that layout re-renders <html> on navigation (e.g. switching locale),
 * which resets its className and drops `.dark`. We re-assert the theme after
 * every navigation — via a layout effect so it happens before the browser
 * paints, with no flash.
 *
 * Uses next/navigation's usePathname (the full, locale-prefixed path) so that
 * a pure locale change (same logical page) still re-triggers the sync.
 */
export default function ThemeSync() {
  const pathname = usePathname();

  useIsomorphicLayoutEffect(() => {
    applyTheme();
  }, [pathname]);

  // Follow OS changes until the user makes an explicit choice.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      if (!localStorage.getItem("theme")) applyTheme();
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return null;
}
