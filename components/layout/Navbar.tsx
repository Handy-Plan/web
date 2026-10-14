"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Link } from "@/i18n/navigation";
import { navConfig } from "@/lib/content";
import { cn } from "@/lib/cn";
import { getLenis } from "@/lib/lenis";
import Icon from "@/components/ui/Icon";
import Logo from "@/components/ui/Logo";
import ThemeToggle from "@/components/ui/ThemeToggle";
import LocaleSwitcher from "@/components/ui/LocaleSwitcher";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * Floating glass navigation. Transparent over the hero, it condenses into a
 * frosted pill once the page scrolls, tucks away while reading downward and
 * slides back the moment the reader scrolls up (driven by ScrollTrigger,
 * not a raw scroll listener).
 *
 * Below `lg` the menu is a full-screen sheet that grows out of the menu
 * button as a circle (clip-path), then the links rise out of their masks one
 * by one. Closing plays it back into the button, faster.
 */
export default function Navbar() {
  const t = useTranslations("nav");
  const a11y = useTranslations("a11y");
  const footer = useTranslations("footer");
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const bar = useRef<HTMLElement>(null);
  const sheet = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const firstRun = useRef(true);
  /** Section to scroll to once the close animation has finished. */
  const pending = useRef<string | null>(null);

  const scrollToPending = () => {
    const href = pending.current;
    pending.current = null;
    const target = href ? document.querySelector<HTMLElement>(href) : null;
    if (!target) return;
    history.replaceState(null, "", href);
    const lenis = getLenis();
    if (lenis) {
      // Lenis caches the page height; re-measure before a long jump.
      lenis.resize();
      lenis.scrollTo(target); // honours scroll-padding-top on <html>
      return;
    }
    const pad = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
    const top = target.getBoundingClientRect().top + window.scrollY - pad;
    window.scrollTo({ top, behavior: "smooth" });
  };

  useGSAP(() => {
    const el = bar.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const show = gsap.quickTo(el, "yPercent", { duration: 0.5, ease: "power3.out" });

    ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate(self) {
        const y = self.scroll();
        setScrolled(y > 24);
        if (reduce) return;
        show(self.direction === 1 && y > 600 ? -140 : 0);
      },
    });
  }, []);

  // Open / close choreography for the mobile sheet.
  useGSAP(
    () => {
      const el = sheet.current;
      const btn = toggle.current;
      if (!el || !btn) return;
      if (firstRun.current) {
        firstRun.current = false;
        return;
      }

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      // Make sure the bar (and its button, the circle's origin) is on screen.
      if (open) gsap.set(bar.current, { yPercent: 0 });
      const r = btn.getBoundingClientRect();
      const x = r.left + r.width / 2;
      const y = r.top + r.height / 2;
      const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
      const items = el.querySelectorAll("[data-item]");
      const foot = el.querySelectorAll("[data-foot]");
      gsap.killTweensOf([el, items, foot]);

      if (reduce) {
        gsap.set(el, { autoAlpha: open ? 1 : 0, clipPath: "none" });
        gsap.set([items, foot], { clearProps: "all" });
        if (!open) requestAnimationFrame(scrollToPending);
        return;
      }

      if (open) {
        gsap
          .timeline()
          .set(el, { autoAlpha: 1 })
          .fromTo(
            el,
            { clipPath: `circle(0px at ${x}px ${y}px)` },
            { clipPath: `circle(${radius}px at ${x}px ${y}px)`, duration: 0.85, ease: "expo.inOut" },
          )
          .fromTo(
            items,
            { yPercent: 115, rotate: 3 },
            { yPercent: 0, rotate: 0, duration: 0.9, ease: "expo.out", stagger: 0.07 },
            0.35,
          )
          .fromTo(
            foot,
            { y: 24, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.7, ease: "expo.out", stagger: 0.06 },
            0.55,
          );
      } else {
        gsap
          .timeline()
          .to([...items, ...foot], { y: -18, autoAlpha: 0, duration: 0.25, ease: "power2.in", stagger: 0.02 })
          .to(el, { clipPath: `circle(0px at ${x}px ${y}px)`, duration: 0.6, ease: "expo.inOut" }, 0.1)
          .set(el, { autoAlpha: 0 })
          .set([items, foot], { clearProps: "transform,opacity,visibility" })
          // Page scroll is unlocked by now; go to the tapped section.
          .call(scrollToPending);
      }
    },
    { dependencies: [open] },
  );

  // Lock page scroll while open (pause Lenis too); Escape closes.
  useEffect(() => {
    if (!open) return;
    const lenis = getLenis();
    lenis?.stop();
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      lenis?.start();
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Section links: close first; the close timeline then scrolls there.
  const go = (href: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    pending.current = href;
    setOpen(false);
  };

  return (
    <>
      <header ref={bar} className="fixed inset-x-0 top-0 z-50 px-3 pt-3 md:px-6 md:pt-4">
        <nav
          className={cn(
            "mx-auto flex h-16 max-w-[1180px] items-center justify-between rounded-[22px] pl-4 pr-2 transition-[background-color,box-shadow,backdrop-filter] duration-500 ease-[var(--ease-out-expo)] md:pl-5",
            open ? "bg-transparent" : scrolled ? "glass" : "bg-transparent",
          )}
        >
          <Link href="/" className="flex items-center gap-2.5" aria-label={a11y("home")} onClick={() => setOpen(false)}>
            <Logo className="h-9 w-9" />
            <span className="hp-wordmark text-[19px] font-semibold tracking-[-0.03em] text-ink">HandyPlan</span>
          </Link>

          {/* Desktop links */}
          <ul className="hidden items-center gap-1 lg:flex">
            {navConfig.links.map((link) => (
              <li key={link.key}>
                <a
                  href={link.href}
                  className="rounded-full px-4 py-2 text-[14px] font-medium text-slate transition-colors duration-200 hover:bg-ink/5 hover:text-ink"
                >
                  {t(link.key)}
                </a>
              </li>
            ))}
          </ul>

          <div className="hidden items-center gap-1.5 lg:flex">
            <LocaleSwitcher />
            <ThemeToggle />
            <Link
              href={navConfig.login.href}
              className="px-3 py-2 text-[14px] font-medium text-graphite transition-colors hover:text-primary"
            >
              {t("login")}
            </Link>
            <Link
              href={navConfig.cta.href}
              className="inline-flex h-11 items-center gap-1.5 rounded-[14px] bg-ink px-5 text-[14px] font-semibold text-canvas transition-[transform,background-color] duration-200 hover:bg-primary hover:text-white active:scale-[0.97]"
            >
              {t("cta")}
              <Icon name="arrow-right" size={16} />
            </Link>
          </div>

          {/* Mobile controls */}
          <div className="flex items-center gap-1 lg:hidden">
            <ThemeToggle />
            <button
              ref={toggle}
              type="button"
              onClick={() => setOpen((v) => !v)}
              className={cn(
                "relative flex h-11 w-11 items-center justify-center rounded-full transition-colors duration-300 active:scale-90",
                open ? "bg-ink text-canvas" : "text-ink",
              )}
              aria-label={open ? a11y("closeMenu") : a11y("openMenu")}
              aria-expanded={open}
              aria-controls="mobile-menu"
            >
              {/* Two bars that cross into an X */}
              <span
                aria-hidden
                className={cn(
                  "absolute h-[2px] w-5 rounded-full bg-current transition-transform duration-500 ease-[var(--ease-spring)]",
                  open ? "translate-y-0 rotate-45" : "-translate-y-[4px]",
                )}
              />
              <span
                aria-hidden
                className={cn(
                  "absolute h-[2px] rounded-full bg-current transition-[transform,width] duration-500 ease-[var(--ease-spring)]",
                  open ? "w-5 translate-y-0 -rotate-45" : "w-3.5 translate-x-[3px] translate-y-[4px]",
                )}
              />
            </button>
          </div>
        </nav>
      </header>

      {/* Full-screen mobile menu (sibling of the header so `fixed` is viewport-relative) */}
      <div
        ref={sheet}
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label={a11y("openMenu")}
        className="invisible fixed inset-0 z-40 flex flex-col overflow-y-auto bg-canvas lg:hidden"
      >
        {/* Ambient light */}
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -right-24 -top-24 h-[420px] w-[420px] rounded-full bg-primary/25 blur-[110px]" />
          <div className="absolute -bottom-32 -left-20 h-[360px] w-[360px] rounded-full bg-sky-400/15 blur-[110px]" />
          <div
            className="bg-dot-grid absolute inset-0 opacity-50"
            style={{
              maskImage: "radial-gradient(ellipse 80% 60% at 80% 10%, black, transparent)",
              WebkitMaskImage: "radial-gradient(ellipse 80% 60% at 80% 10%, black, transparent)",
            }}
          />
        </div>

        <nav className="relative flex flex-1 flex-col px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-28">
          <ul className="flex flex-col">
            {navConfig.links.map((link, i) => (
              <li key={link.key} className="overflow-hidden border-b border-line">
                <a
                  data-item
                  href={link.href}
                  onClick={go(link.href)}
                  className="group flex items-center gap-4 py-5 active:opacity-70"
                >
                  <span className="w-6 font-mono text-[12px] text-muted">{String(i + 1).padStart(2, "0")}</span>
                  <span className="flex-1 text-[38px] font-semibold leading-none tracking-[-0.045em] text-ink min-[400px]:text-[42px]">
                    {t(link.key)}
                  </span>
                  <span className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-ink transition-colors duration-300 group-active:border-primary group-active:bg-primary group-active:text-white">
                    <Icon name="arrow-right" size={18} className="-rotate-45" />
                  </span>
                </a>
              </li>
            ))}
          </ul>

          <div className="mt-auto pt-10">
            <div data-foot>
              <LocaleSwitcher />
            </div>
            <div data-foot className="mt-5 grid grid-cols-2 gap-3">
              <Link
                href={navConfig.login.href}
                onClick={() => setOpen(false)}
                className="flex h-14 items-center justify-center rounded-[16px] border border-line bg-surface text-[16px] font-semibold text-ink active:scale-[0.98]"
              >
                {t("login")}
              </Link>
              <Link
                href={navConfig.cta.href}
                onClick={() => setOpen(false)}
                className="flex h-14 items-center justify-center gap-2 rounded-[16px] bg-primary text-[16px] font-semibold text-white shadow-[var(--shadow-glow)] active:scale-[0.98]"
              >
                {t("cta")}
                <Icon name="arrow-right" size={18} />
              </Link>
            </div>
            <p data-foot className="mt-5 text-pretty text-[14px] leading-relaxed text-slate">
              {footer("tagline")}
            </p>
          </div>
        </nav>
      </div>
    </>
  );
}
