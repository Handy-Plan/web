import { useTranslations } from "next-intl";
import { marketStatsConfig } from "@/lib/content";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Counter from "@/components/animations/Counter";
import Reveal from "@/components/animations/Reveal";

/** Sourced market figures — the businesses HandyPlan would actually serve. */
export default function Market() {
  const t = useTranslations("market");
  const items = t.raw("items") as { suffix: string; label: string }[];

  return (
    <section className="relative border-y border-line bg-fog py-20 lg:py-24">
      {/* gradient hairline accents */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/25 to-transparent"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/25 to-transparent"
      />
      <Container>
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={t("title")}
          subtitle={t("subtitle")}
        />

        <Reveal
          stagger={0.12}
          className="mt-14 grid grid-cols-2 gap-y-10 lg:grid-cols-4 lg:gap-y-0 lg:divide-x lg:divide-line"
        >
          {marketStatsConfig.map((s, i) => (
            <div
              key={items[i].label}
              className="flex flex-col items-center px-3 text-center lg:px-6"
            >
              <span className="bg-gradient-to-br from-ink to-graphite bg-clip-text text-4xl font-extrabold tracking-tight text-transparent lg:text-5xl">
                <Counter value={s.value} prefix={s.prefix} suffix={items[i].suffix} />
              </span>
              <span className="mt-2 text-sm font-medium text-slate">
                {items[i].label}
              </span>
            </div>
          ))}
        </Reveal>

        <p className="mt-12 text-center text-xs italic text-slate">{t("source")}</p>
      </Container>
    </section>
  );
}
