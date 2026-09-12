import { useTranslations } from "next-intl";
import { whyIcons } from "@/lib/content";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Icon from "@/components/ui/Icon";
import Reveal from "@/components/animations/Reveal";

/** Positioning: keep your number, one job done well, fair to customers. */
export default function WhyHandyPlan() {
  const t = useTranslations("why");
  const cards = t.raw("cards") as { title: string; body: string }[];

  return (
    <section id="why" className="scroll-mt-24 py-24 lg:py-32">
      <Container>
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={t("title")}
          subtitle={t("subtitle")}
        />

        <Reveal stagger={0.1} className="mt-16 grid gap-6 md:grid-cols-3">
          {cards.map((card, i) => (
            <article
              key={card.title}
              className="rounded-[20px] border border-line bg-surface p-7 shadow-[var(--shadow-subtle)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[var(--shadow-lift)]"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-soft text-primary">
                <Icon name={whyIcons[i]} size={24} />
              </span>
              <h3 className="mt-5 text-xl font-bold text-ink">{card.title}</h3>
              <p className="mt-2.5 leading-relaxed text-slate">{card.body}</p>
            </article>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}
