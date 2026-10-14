"use client";

import { Fragment, useRef } from "react";
import { useTranslations } from "next-intl";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import Icon from "@/components/ui/Icon";

gsap.registerPlugin(useGSAP);

/**
 * The product loop as a floating stack of cards (missed call → auto reply →
 * job card → booked), tilted in 3D. The whole stack leans toward the cursor
 * and each card shifts by its own depth, so the layers separate like real
 * objects. Same cards and copy as the landing page story.
 */
export default function AuthShowcase() {
  const t = useTranslations("mockup");
  const slots = t.raw("slots") as string[];
  const stage = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = stage.current;
      if (!el) return;
      const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!fine || reduce) return;

      const rx = gsap.quickTo(el, "rotationX", { duration: 1.1, ease: "power3.out" });
      const ry = gsap.quickTo(el, "rotationY", { duration: 1.1, ease: "power3.out" });
      const layers = gsap.utils.toArray<HTMLElement>("[data-depth]").map((node) => ({
        d: Number(node.dataset.depth),
        x: gsap.quickTo(node, "x", { duration: 1.2, ease: "power3.out" }),
        y: gsap.quickTo(node, "y", { duration: 1.2, ease: "power3.out" }),
      }));

      const move = (e: PointerEvent) => {
        const px = e.clientX / window.innerWidth - 0.5;
        const py = e.clientY / window.innerHeight - 0.5;
        rx(14 - py * 10);
        ry(-16 + px * 14);
        layers.forEach((l) => {
          l.x(px * l.d * 40);
          l.y(py * l.d * 30);
        });
      };
      window.addEventListener("pointermove", move, { passive: true });
      return () => window.removeEventListener("pointermove", move);
    },
    { scope: stage, dependencies: [] },
  );

  // Each card: outer div runs the CSS entrance (it owns `transform` while
  // animating), inner [data-depth] div takes the GSAP parallax offset.
  const rows = ["name", "address", "problem"] as const;

  return (
    <div className="relative mx-auto h-[400px] w-full max-w-[460px] [perspective:1400px]">
      <div
        ref={stage}
        className="auth-rise relative h-full w-full [transform-style:preserve-3d]"
        style={{ transform: "rotateX(14deg) rotateY(-16deg)" }}
      >
        {/* Missed call */}
        <div className="absolute left-0 top-2 w-[300px]" style={{ ["--i" as string]: 2 }}>
          <div data-depth="0.6">
          <div className="hp-bob flex items-center gap-3 rounded-[22px] bg-white/10 p-3.5 ring-1 ring-white/15 backdrop-blur-xl">
            <span className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-[#ff453a] text-white">
              <Icon name="phone-missed" size={19} />
            </span>
            <div className="min-w-0">
              <p className="text-[14px] font-semibold text-white">{t("missedCall")}</p>
              <p className="truncate text-[12px] text-white/60">{t("missedTime")}</p>
            </div>
          </div>
          </div>
        </div>

        {/* Auto reply */}
        <div className="absolute right-0 top-[92px] w-[290px]" style={{ ["--i" as string]: 3 }}>
          <div data-depth="1">
          <div className="hp-bob [animation-delay:-2s]">
            <p className="mb-1.5 text-right text-[11px] font-medium text-sky-300">{t("autoReplyLabel")}</p>
            <p className="rounded-[20px] rounded-br-[6px] bg-[#0a84ff] px-4 py-3 text-[14px] leading-snug text-white shadow-[0_20px_50px_-15px_rgba(10,132,255,0.7)]">
              {t("autoReply")}
            </p>
          </div>
          </div>
        </div>

        {/* Job card */}
        <div className="absolute left-6 top-[214px] w-[330px]" style={{ ["--i" as string]: 4 }}>
          <div data-depth="1.6">
          <div className="hp-bob rounded-[24px] bg-white p-5 text-[#0f172a] shadow-[0_40px_80px_-24px_rgba(0,0,0,0.65)] [animation-delay:-4s]">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-[13px] font-semibold text-[#0369a1]">{t("jobCard")}</p>
              <span className="rounded-full bg-[#fef3c7] px-2.5 py-0.5 text-[11px] font-semibold text-[#92400e]">
                {t("values.urgency")}
              </span>
            </div>
            <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-[13px]">
              {rows.map((r) => (
                <Fragment key={r}>
                  <dt className="text-[#64748b]">{t(`labels.${r}`)}</dt>
                  <dd className="truncate font-medium">{t(`values.${r}`)}</dd>
                </Fragment>
              ))}
            </dl>
            <div className="mt-4 flex items-center gap-2">
              <span className="rounded-[10px] bg-[#e0f2fe] px-2.5 py-1.5 text-[11px] font-semibold text-[#0369a1] ring-1 ring-[#0369a1]/30">
                {slots[0]}
              </span>
              <span className="ml-auto rounded-[10px] bg-[#0369a1] px-3.5 py-1.5 text-[11px] font-semibold text-white">
                {t("book")}
              </span>
            </div>
          </div>
          </div>
        </div>

        {/* Booked */}
        <div className="absolute -bottom-3 -right-6" style={{ ["--i" as string]: 5 }}>
          <div data-depth="2.2">
          <div className="hp-bob flex items-center gap-2.5 rounded-full bg-white/12 py-2 pl-2 pr-4 ring-1 ring-white/20 backdrop-blur-xl [animation-delay:-1s]">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-success text-white">
              <Icon name="check" size={16} />
            </span>
            <span className="text-[14px] font-semibold text-white">{t("booked")}</span>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}
