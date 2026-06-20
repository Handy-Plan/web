import { useTranslations } from "next-intl";
import { testimonialsConfig } from "@/lib/content";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Icon from "@/components/ui/Icon";
import Reveal from "@/components/animations/Reveal";

function Stars() {
  return (
    <div className="flex gap-0.5 text-warning">
      {Array.from({ length: 5 }).map((_, i) => (
        <Icon key={i} name="star" size={18} filled />
      ))}
    </div>
  );
}

export default function Testimonials() {
  const t = useTranslations("testimonials");
  const a11y = useTranslations("a11y");
  const items = t.raw("items") as {
    quote: string;
    name: string;
    role: string;
    city: string;
  }[];

  return (
    <section className="py-24 lg:py-32">
      <Container>
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={t("title")}
          subtitle={t("subtitle")}
        />

        <Reveal stagger={0.12} className="mt-16 grid gap-6 lg:grid-cols-3">
          {testimonialsConfig.map((cfg, i) => {
            const item = items[i];
            return (
            <figure
              key={item.name}
              className="relative flex flex-col overflow-hidden rounded-[20px] border border-line bg-gradient-to-b from-fog to-surface p-7 shadow-[var(--shadow-subtle)] transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/20 hover:shadow-[var(--shadow-lift)]"
            >
              <span
                aria-hidden
                className="pointer-events-none absolute -top-4 right-5 font-serif text-8xl leading-none text-primary/10 select-none"
              >
                &rdquo;
              </span>
              <Stars />
              <blockquote className="relative mt-4 flex-1 text-pretty leading-relaxed text-graphite">
                “{item.quote}”
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t border-line pt-5">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-indigo text-sm font-bold text-white">
                  {cfg.initials}
                </span>
                <div>
                  <p className="flex items-center gap-1.5 text-sm font-bold text-ink">
                    {item.name}
                    <Icon
                      name="check"
                      size={14}
                      className="text-success"
                      aria-label={a11y("verified")}
                    />
                  </p>
                  <p className="text-sm text-slate">
                    {item.role} · {item.city}
                  </p>
                </div>
              </figcaption>
            </figure>
            );
          })}
        </Reveal>

        <Reveal className="mt-12 flex flex-col items-center gap-1">
          <div className="flex items-center gap-2">
            <Stars />
            <span className="text-2xl font-extrabold text-ink">4.8/5</span>
          </div>
          <p className="text-sm text-muted">{t("ratingLabel")}</p>
        </Reveal>
      </Container>
    </section>
  );
}
