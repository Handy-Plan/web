import { useLocale, useTranslations } from "next-intl";
import { craftsmanFlowIcons, customerFlowIcons, navConfig } from "@/lib/content";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import Icon, { type IconName } from "@/components/ui/Icon";
import Reveal from "@/components/animations/Reveal";
import { cn } from "@/lib/cn";

type Step = { title: string; body: string };

function Flow({
  label,
  steps,
  icons,
  featured,
}: {
  label: string;
  steps: Step[];
  icons: readonly IconName[];
  featured: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-[24px] border bg-surface p-7 lg:p-9",
        featured
          ? "border-primary/30 shadow-[var(--shadow-glow)] ring-1 ring-primary/10"
          : "border-line shadow-[var(--shadow-subtle)]",
      )}
    >
      <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">
        {label}
      </h3>
      <Reveal as="ol" stagger={0.1} className="mt-7 flex flex-col gap-7">
        {steps.map((step, i) => (
          <li key={step.title} className="relative flex gap-4">
            {/* connector to the next step */}
            {i < steps.length - 1 && (
              <span
                aria-hidden
                className="absolute bottom-[-24px] left-[21px] top-12 w-px bg-line"
              />
            )}
            <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-indigo text-white shadow-[0_6px_14px_rgba(3,105,161,0.28)]">
              <Icon name={icons[i]} size={20} />
            </span>
            <div>
              <h4 className="flex items-baseline gap-2 text-lg font-bold text-ink">
                <span className="text-sm font-semibold text-slate">{i + 1}</span>
                {step.title}
              </h4>
              <p className="mt-1 leading-relaxed text-slate">{step.body}</p>
            </div>
          </li>
        ))}
      </Reveal>
    </div>
  );
}

export default function HowItWorks() {
  const t = useTranslations("howItWorks");
  const nav = useTranslations("nav");
  const locale = useLocale();

  return (
    <section
      id="how-it-works"
      className="scroll-mt-24 bg-gradient-to-b from-primary-soft/50 to-canvas py-24 lg:py-32"
    >
      <Container>
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={t("title")}
          subtitle={t("subtitle")}
        />

        <div className="mt-16 grid gap-6 lg:grid-cols-2">
          <Flow
            label={t("craftsmanLabel")}
            steps={t.raw("craftsman") as Step[]}
            icons={craftsmanFlowIcons}
            featured
          />
          <Flow
            label={t("customerLabel")}
            steps={t.raw("customer") as Step[]}
            icons={customerFlowIcons}
            featured={false}
          />
        </div>

        <p className="mx-auto mt-10 max-w-2xl text-center text-sm italic leading-relaxed text-slate">
          {t("footnote")}
        </p>

        <div className="mt-10 flex justify-center">
          <Button
            href={`/${locale}${navConfig.cta.href}`}
            size="lg"
            iconAfter="arrow-right"
          >
            {nav("cta")}
          </Button>
        </div>
      </Container>
    </section>
  );
}
