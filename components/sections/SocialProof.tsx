import { useTranslations } from "next-intl";
import { statsConfig } from "@/lib/content";
import Container from "@/components/ui/Container";
import Counter from "@/components/animations/Counter";
import Reveal from "@/components/animations/Reveal";

export default function SocialProof() {
  const t = useTranslations("stats");
  const labels = t.raw("items") as string[];

  return (
    <section className="relative border-y border-line bg-fog py-16">
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
        <Reveal
          stagger={0.12}
          className="grid grid-cols-2 gap-y-10 lg:grid-cols-4 lg:gap-y-0 lg:divide-x lg:divide-line"
        >
          {statsConfig.map((s, i) => (
            <div
              key={labels[i]}
              className="flex flex-col items-center text-center lg:px-6"
            >
              <span className="bg-gradient-to-br from-ink to-graphite bg-clip-text text-4xl font-extrabold tracking-tight text-transparent lg:text-5xl">
                <Counter
                  value={s.value}
                  suffix={s.suffix}
                  decimals={s.decimals ?? 0}
                />
              </span>
              <span className="mt-2 text-sm font-medium text-slate">
                {labels[i]}
              </span>
            </div>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}
