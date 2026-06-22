import { Fragment } from "react";
import { useTranslations } from "next-intl";
import { trustBarIcons } from "@/lib/content";
import Container from "@/components/ui/Container";
import Icon from "@/components/ui/Icon";
import Reveal from "@/components/animations/Reveal";

/**
 * "Trust & Authority" credential strip shown under the hero.
 * Adapted from a 21st.dev / Magic MCP component to use HandyPlan's design
 * tokens, Icon set, and i18n (server-rendered, no client deps).
 */
export default function TrustBar() {
  const t = useTranslations("trustBar");
  const items = t.raw("items") as { label: string; sublabel: string }[];

  return (
    <section className="border-b border-line bg-canvas">
      <Container>
        <Reveal className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 py-5 lg:gap-x-10">
          {items.map((item, i) => (
            <Fragment key={item.label}>
              <div className="group flex items-center gap-2.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary ring-1 ring-inset ring-primary/15 transition-colors duration-300 group-hover:ring-primary/30">
                  <Icon name={trustBarIcons[i]} size={18} />
                </span>
                <div className="flex flex-col leading-tight">
                  <span className="text-sm font-semibold text-ink">
                    {item.label}
                  </span>
                  <span className="text-xs text-slate">{item.sublabel}</span>
                </div>
              </div>
              {i < items.length - 1 && (
                <span
                  aria-hidden
                  className="hidden h-9 w-px bg-line sm:block"
                />
              )}
            </Fragment>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}
