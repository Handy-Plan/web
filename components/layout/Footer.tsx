"use client";

import { useRef } from "react";
import { useLocale, useTranslations } from "next-intl";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { Link, usePathname } from "@/i18n/navigation";
import { navConfig } from "@/lib/content";
import Logo from "@/components/ui/Logo";
import Icon from "@/components/ui/Icon";
import LocaleSwitcher from "@/components/ui/LocaleSwitcher";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

const linkClass =
  "group inline-flex items-center gap-1.5 text-[15px] text-white/60 transition-colors duration-200 hover:text-white";

/**
 * Curtain footer: on desktop it sits underneath the page (sticky at the
 * bottom) and is uncovered as the last section scrolls away. The giant
 * wordmark rises letter by letter, scrubbed to the reveal, and the glow
 * behind it follows the cursor.
 */
export default function Footer() {
  const t = useTranslations("footer");
  const nav = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const sectionHref = (hash: string) => (pathname === "/" ? hash : `/${locale}${hash}`);
  const a11y = useTranslations("a11y");
  const legalLinks = t.raw("legalLinks") as string[];
  const root = useRef<HTMLElement>(null);
  const mark = useRef<HTMLParagraphElement>(null);
  const glow = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el || !mark.current) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const split = SplitText.create(mark.current, { type: "chars" });
      gsap.fromTo(
        split.chars,
        { yPercent: 95, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          ease: "power3.out",
          stagger: 0.05,
          scrollTrigger: { trigger: el, start: "top 85%", end: "bottom bottom", scrub: 0.8 },
        },
      );

      const g = glow.current;
      if (g && window.matchMedia("(hover: hover)").matches) {
        const xTo = gsap.quickTo(g, "x", { duration: 1.2, ease: "power3.out" });
        const yTo = gsap.quickTo(g, "y", { duration: 1.2, ease: "power3.out" });
        const move = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          xTo(e.clientX - r.left - r.width / 2);
          yTo(e.clientY - r.top - r.height / 2);
        };
        el.addEventListener("pointermove", move);
        return () => {
          el.removeEventListener("pointermove", move);
          split.revert();
        };
      }
      return () => split.revert();
    },
    { scope: root, dependencies: [] },
  );

  const toTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer ref={root} className="relative z-0 overflow-hidden bg-footer text-white lg:sticky lg:bottom-0">
      {/* Cursor-following glow */}
      <div
        ref={glow}
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -ml-[300px] -mt-[300px] h-[600px] w-[600px] rounded-full bg-primary/25 blur-[140px]"
      />
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      <div className="relative mx-auto max-w-[1180px] px-6 pt-16 md:pt-20 lg:px-8 lg:pt-24">
        <div className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-[1.4fr_1fr_1fr_auto] md:gap-14">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center justify-between">
              <Link href="/" className="inline-flex items-center gap-2.5" aria-label={a11y("home")}>
                <Logo className="h-9 w-9" />
                <span className="text-[19px] font-semibold tracking-[-0.03em]">HandyPlan</span>
              </Link>
              {/* Phones: back-to-top sits beside the logo instead of its own row */}
              <button
                type="button"
                onClick={toTop}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-white/15 text-white/70 active:scale-90 md:hidden"
                aria-label={t("backToTop")}
              >
                <Icon name="arrow-right" size={18} className="-rotate-90" />
              </button>
            </div>
            <p className="mt-6 max-w-[340px] text-pretty text-[20px] md:text-[22px] font-medium leading-snug tracking-[-0.02em] text-white/85">
              {t("tagline")}
            </p>
            <Link
              href={navConfig.cta.href}
              className="mt-8 inline-flex h-12 items-center gap-2 rounded-[14px] bg-white px-5 text-[15px] font-semibold text-[#0f172a] transition-[transform,background-color] duration-200 hover:bg-sky-100 active:scale-[0.97]"
            >
              {nav("cta")}
              <Icon name="arrow-right" size={16} />
            </Link>
          </div>

          <nav aria-label={t("explore")}>
            <h3 className="text-sm font-medium text-white/40">{t("explore")}</h3>
            <ul className="mt-5 flex flex-col gap-3.5">
              {navConfig.links.map((link) => (
                <li key={link.key}>
                  <a href={sectionHref(link.href)} className={linkClass}>
                    {nav(link.key)}
                    <Icon
                      name="arrow-right"
                      size={14}
                      className="-translate-x-1 opacity-0 transition-[opacity,transform] duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                    />
                  </a>
                </li>
              ))}
              {navConfig.pages.map((page) => (
                <li key={page.key}>
                  <Link href={page.href} className={linkClass}>
                    {nav(page.key)}
                    <Icon
                      name="arrow-right"
                      size={14}
                      className="-translate-x-1 opacity-0 transition-[opacity,transform] duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h3 className="text-sm font-medium text-white/40">{t("legal")}</h3>
            <ul className="mt-5 flex flex-col gap-3.5">
              {legalLinks.map((label) => (
                <li key={label}>
                  <a href="#" className={linkClass}>
                    {label}
                  </a>
                </li>
              ))}
              <li>
                <Link href={navConfig.login.href} className={linkClass}>
                  {nav("login")}
                </Link>
              </li>
            </ul>
          </div>

          <div className="hidden items-start md:flex md:justify-end">
            <button
              type="button"
              onClick={toTop}
              className="group flex h-14 w-14 items-center justify-center rounded-full border border-white/15 text-white/70 transition-[border-color,color,transform] duration-300 hover:border-white/40 hover:text-white active:scale-90"
              aria-label={t("backToTop")}
              title={t("backToTop")}
            >
              <Icon name="arrow-right" size={20} className="-rotate-90 transition-transform duration-300 group-hover:-translate-y-1" />
            </button>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-5 border-t md:mt-16 border-white/10 pt-7 sm:flex-row sm:items-center">
          <p className="text-sm text-white/45">{t("rights", { year: String(new Date().getFullYear()) })}</p>
          <div className="flex items-center gap-5">
            <div className="[&_*]:!border-white/10 [&>div]:!bg-white/5">
              <LocaleSwitcher />
            </div>
          </div>
        </div>
      </div>

      {/* Giant wordmark, cropped by the page edge */}
      <p
        ref={mark}
        aria-hidden
        className="relative -mb-[0.2em] mt-6 select-none whitespace-nowrap text-center text-[18.5vw] font-semibold leading-[0.9] tracking-[-0.07em] text-white/90"
        style={{
          // Mask (not background-clip) so the per-letter transforms still fade.
          maskImage: "linear-gradient(180deg, black 0%, transparent 88%)",
          WebkitMaskImage: "linear-gradient(180deg, black 0%, transparent 88%)",
        }}
      >
        HandyPlan
      </p>
    </footer>
  );
}
