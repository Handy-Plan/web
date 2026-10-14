import { useTranslations } from "next-intl";
import { marketStatsConfig } from "@/lib/content";
import Container from "@/components/ui/Container";
import Counter from "@/components/animations/Counter";
import Reveal from "@/components/animations/Reveal";
import SplitReveal from "@/components/animations/SplitReveal";
import TiltCard from "@/components/animations/TiltCard";
import { cn } from "@/lib/cn";

/** Bento placement per stat (order matches market.items). */
// Phones: big stat full-width, the two middle stats share a row, last full-width.
const cells = [
  "col-span-2 bg-gradient-to-br from-primary via-indigo to-violet text-white min-h-[220px] lg:min-h-[360px]",
  "col-span-1 bg-surface border border-line",
  "col-span-1 bg-surface border border-line",
  "col-span-2 bg-ink text-canvas",
];

/** Sourced market figures as an asymmetric bento; numbers count up on view. */
export default function Market() {
  const t = useTranslations("market");
  const items = t.raw("items") as { suffix: string; label: string }[];

  return (
    <section className="relative py-20 sm:py-28 lg:py-36">
      <Container className="max-w-[1180px]">
        <SplitReveal className="max-w-[760px] text-balance text-[34px] font-semibold leading-[1.02] tracking-[-0.045em] text-ink sm:text-6xl lg:text-[64px]">
          {t("title")}
        </SplitReveal>
        <Reveal className="mt-5 max-w-lg text-lg text-slate">
          <p>{t("subtitle")}</p>
        </Reveal>

        <Reveal stagger={0.1} y={48} className="mt-10 grid grid-cols-2 gap-3 sm:mt-14 sm:gap-4 lg:grid-cols-3">
          {marketStatsConfig.map((s, i) => {
            const dark = i === 0 || i === 3;
            return (
              <TiltCard
                key={items[i].label}
                max={4}
                className={cn(
                  "flex flex-col justify-between overflow-hidden rounded-[24px] p-5 sm:rounded-[32px] sm:p-8 md:p-10",
                  cells[i],
                  i === 1 || i === 2 ? "lg:col-span-1" : "lg:col-span-2",
                )}
              >
                {i === 0 && (
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 opacity-30"
                    style={{
                      backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.55) 1px, transparent 0)",
                      backgroundSize: "26px 26px",
                      maskImage: "radial-gradient(ellipse 70% 80% at 85% 20%, black, transparent)",
                      WebkitMaskImage: "radial-gradient(ellipse 70% 80% at 85% 20%, black, transparent)",
                    }}
                  />
                )}
                <span
                  className={cn(
                    "relative block font-semibold tabular-nums leading-none tracking-[-0.06em]",
                    i === 0
                      ? "text-[72px] sm:text-[96px] md:text-[132px]"
                      : i === 3
                        ? "text-[56px] sm:text-[64px] md:text-[80px]"
                        : "text-[34px] min-[400px]:text-[40px] sm:text-[64px] md:text-[80px]",
                    !dark && "text-ink",
                  )}
                >
                  <Counter value={s.value} prefix={s.prefix} suffix={items[i].suffix} />
                </span>
                <span
                  className={cn(
                    "relative mt-6 max-w-[320px] text-pretty text-[13px] leading-relaxed sm:mt-10 sm:text-[15px]",
                    i === 0 ? "text-white/85" : i === 3 ? "opacity-70" : "text-slate",
                  )}
                >
                  {items[i].label}
                </span>
              </TiltCard>
            );
          })}
        </Reveal>

        <p className="mt-8 max-w-3xl text-xs leading-relaxed text-muted">{t("source")}</p>
      </Container>
    </section>
  );
}
