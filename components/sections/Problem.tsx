import { useTranslations } from "next-intl";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Icon from "@/components/ui/Icon";
import Reveal from "@/components/animations/Reveal";
import { cn } from "@/lib/cn";

export default function Problem() {
  const t = useTranslations("problem");
  const steps = t.raw("steps") as string[];

  return (
    <section id="problem" className="scroll-mt-24 bg-mist py-24 lg:py-32">
      <Container>
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={t("title")}
          subtitle={t("subtitle")}
        />

        <div className="mt-16 grid items-start gap-6 lg:grid-cols-[1.35fr_1fr]">
          {/* How a job disappears */}
          <Reveal as="ol" stagger={0.1} className="flex flex-col gap-3">
            {steps.map((step, i) => {
              const last = i === steps.length - 1;
              return (
                <li
                  key={step}
                  className="flex items-start gap-4 rounded-2xl border border-line bg-surface p-5 shadow-[var(--shadow-subtle)]"
                >
                  <span
                    className={cn(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold",
                      last ? "bg-danger/10 text-danger" : "bg-primary-soft text-primary",
                    )}
                  >
                    {i + 1}
                  </span>
                  <p
                    className={cn(
                      "pt-1.5 leading-relaxed",
                      last ? "font-semibold text-ink" : "text-graphite",
                    )}
                  >
                    {step}
                  </p>
                </li>
              );
            })}
          </Reveal>

          {/* Our claim */}
          <Reveal className="rounded-[20px] bg-gradient-to-br from-navy to-violet p-8 text-white shadow-[var(--shadow-lift)] ring-1 ring-inset ring-white/10 lg:p-10">
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-sky-300">
              {t("claimLabel")}
            </span>
            <p className="font-heading mt-4 text-2xl font-bold leading-snug lg:text-[28px]">
              {t("claimTitle")}
            </p>
            <p className="mt-4 leading-relaxed text-white/80">{t("claimBody")}</p>
          </Reveal>
        </div>

        <Reveal stagger={0.1} className="mt-6 grid gap-4 md:grid-cols-2">
          <p className="rounded-2xl border border-line bg-surface p-5 text-sm leading-relaxed text-slate">
            <span className="font-semibold text-primary">{t("whyNowLabel")}</span>{" "}
            {t("whyNow")}
          </p>
          <p className="flex gap-3 rounded-2xl border border-warning/50 bg-surface p-5 text-sm leading-relaxed text-slate">
            <Icon
              name="alert"
              size={18}
              className="mt-0.5 shrink-0 text-amber-600 dark:text-amber-400"
            />
            <span>
              <span className="font-semibold text-ink">{t("fitLabel")}</span>{" "}
              {t("fit")}
            </span>
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
