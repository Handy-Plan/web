import { useTranslations } from "next-intl";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import Reveal from "@/components/animations/Reveal";

export default function FinalCTA() {
  const t = useTranslations("finalCta");
  const trust = t.raw("trust") as string[];

  return (
    <section className="px-6 py-20 lg:py-28">
      <Container className="px-0">
        <Reveal
          y={40}
          className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-primary via-indigo to-violet px-6 py-20 text-center shadow-[var(--shadow-float)] ring-1 ring-inset ring-white/15 lg:px-16 lg:py-24"
        >
          {/* decorative pattern */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.5) 1px, transparent 0)",
              backgroundSize: "28px 28px",
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-white/10 blur-3xl"
          />

          <div className="relative mx-auto max-w-2xl">
            <h2 className="text-balance text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
              {t("title")}
            </h2>
            <p className="mx-auto mt-5 max-w-lg text-pretty text-lg text-white/85">
              {t("subtitle")}
            </p>

            <div className="mt-9 flex justify-center">
              <Button
                href="#"
                size="lg"
                variant="white"
                iconAfter="arrow-right"
              >
                {t("cta")}
              </Button>
            </div>

            <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              {trust.map((t) => (
                <li
                  key={t}
                  className="flex items-center gap-1.5 text-sm font-medium text-white/85"
                >
                  <Icon name="check" size={16} />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
