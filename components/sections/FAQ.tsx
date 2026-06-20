"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Icon from "@/components/ui/Icon";
import Reveal from "@/components/animations/Reveal";
import { cn } from "@/lib/cn";

export default function FAQ() {
  const t = useTranslations("faq");
  const faqs = t.raw("items") as { q: string; a: string }[];
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="scroll-mt-24 py-24 lg:py-32">
      <Container className="max-w-3xl">
        <SectionHeading eyebrow={t("eyebrow")} title={t("title")} />

        <Reveal stagger={0.06} className="mt-12 flex flex-col gap-2">
          {faqs.map((item, i) => {
            const isOpen = open === i;
            return (
              <div
                key={item.q}
                className={cn(
                  "rounded-2xl border px-5 transition-colors duration-300",
                  isOpen
                    ? "border-primary/20 bg-primary-soft/50"
                    : "border-transparent hover:bg-mist",
                )}
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 py-5 text-left"
                  aria-expanded={isOpen}
                >
                  <span
                    className={cn(
                      "text-lg font-semibold transition-colors",
                      isOpen ? "text-primary" : "text-ink",
                    )}
                  >
                    {item.q}
                  </span>
                  <span
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-300",
                      isOpen
                        ? "rotate-45 bg-primary text-white"
                        : "bg-cloud text-slate",
                    )}
                  >
                    <Icon name="plus" size={18} />
                  </span>
                </button>
                <div
                  className={cn(
                    "grid transition-all duration-300 ease-[var(--ease-out-expo)]",
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="pb-5 pr-12 leading-relaxed text-slate">
                      {item.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </Reveal>
      </Container>
    </section>
  );
}
