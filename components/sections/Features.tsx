import { useTranslations } from "next-intl";
import { featuresConfig } from "@/lib/content";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Icon from "@/components/ui/Icon";
import Reveal from "@/components/animations/Reveal";

export default function Features() {
  const t = useTranslations("features");
  const items = t.raw("items") as {
    title: string;
    body: string;
    points: string[];
  }[];

  return (
    <section id="features" className="scroll-mt-24 py-24 lg:py-32">
      <Container>
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={t("title")}
          subtitle={t("subtitle")}
        />

        <Reveal
          stagger={0.08}
          className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {featuresConfig.map((f, i) => {
            const item = items[i];
            return (
            <article
              key={item.title}
              className="group relative overflow-hidden rounded-[20px] border border-line bg-surface p-7 shadow-[var(--shadow-subtle)] transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-[var(--shadow-glow)]"
            >
              {/* hover glow */}
              <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-primary/0 blur-2xl transition-colors duration-500 group-hover:bg-primary/10" />
              {/* top accent line on hover */}
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px scale-x-0 bg-gradient-to-r from-transparent via-primary/50 to-transparent transition-transform duration-500 group-hover:scale-x-100" />

              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-indigo text-white shadow-[0_8px_18px_rgba(3,105,161,0.3)] transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3">
                <Icon name={f.icon} size={26} />
              </span>

              <h3 className="mt-5 text-xl font-bold text-ink">{item.title}</h3>
              <p className="mt-2.5 leading-relaxed text-slate">{item.body}</p>

              <ul className="mt-5 flex flex-col gap-2 border-t border-line/70 pt-5">
                {item.points.map((pt) => (
                  <li key={pt} className="flex items-center gap-2 text-sm text-graphite">
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-success/15 text-success">
                      <Icon name="check" size={11} />
                    </span>
                    {pt}
                  </li>
                ))}
              </ul>
            </article>
            );
          })}
        </Reveal>
      </Container>
    </section>
  );
}
