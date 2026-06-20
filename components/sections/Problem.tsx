import { useTranslations } from "next-intl";
import { problemsConfig } from "@/lib/content";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Icon from "@/components/ui/Icon";
import Reveal from "@/components/animations/Reveal";
import { cn } from "@/lib/cn";

const accentMap = {
  danger: { border: "border-l-danger", icon: "bg-danger/10 text-danger" },
  warning: { border: "border-l-warning", icon: "bg-warning/10 text-warning" },
} as const;

export default function Problem() {
  const t = useTranslations("problem");
  const items = t.raw("items") as { title: string; body: string }[];

  return (
    <section className="bg-mist py-24 lg:py-32">
      <Container>
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={t("title")}
          subtitle={t("subtitle")}
        />

        <Reveal
          stagger={0.12}
          className="mt-16 grid gap-6 md:grid-cols-3"
        >
          {problemsConfig.map((p, i) => {
            const accent = accentMap[p.accent];
            const item = items[i];
            return (
              <article
                key={item.title}
                className={cn(
                  "group rounded-[20px] border border-line border-l-[4px] bg-surface p-7 shadow-[var(--shadow-subtle)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[var(--shadow-lift)]",
                  accent.border,
                )}
              >
                <span
                  className={cn(
                    "flex h-14 w-14 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110",
                    accent.icon,
                  )}
                >
                  <Icon name={p.icon} size={28} />
                </span>
                <h3 className="mt-5 text-xl font-bold text-ink">{item.title}</h3>
                <p className="mt-3 leading-relaxed text-slate">{item.body}</p>
              </article>
            );
          })}
        </Reveal>

        <Reveal className="mt-12 flex justify-center">
          <p className="inline-flex items-center gap-2 rounded-full bg-surface px-5 py-2.5 text-lg font-medium italic text-slate shadow-[var(--shadow-subtle)] ring-1 ring-line">
            {t("closing")}
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
