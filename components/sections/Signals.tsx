import { useTranslations } from "next-intl";
import { trustBarIcons } from "@/lib/content";
import Icon, { type IconName } from "@/components/ui/Icon";

/**
 * Credentials strip under the story: one slow marquee (the only one on the
 * page). Content is duplicated once so the loop is seamless; the copy is
 * hidden from screen readers.
 */
export default function Signals() {
  const bar = useTranslations("trustBar");
  const hero = useTranslations("hero");
  const items: { label: string; icon: IconName }[] = [
    ...(bar.raw("items") as { label: string }[]).map((it, i) => ({ label: it.label, icon: trustBarIcons[i] })),
    ...(hero.raw("trust") as string[]).map((label) => ({ label, icon: "check" as IconName })),
  ];

  const row = (hidden: boolean) => (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
      {items.map((it) => (
        <li key={it.label} className="flex items-center gap-3 px-8 text-[15px] font-medium text-graphite md:px-12 md:text-lg">
          <Icon name={it.icon} size={20} className="text-primary" />
          <span className="whitespace-nowrap">{it.label}</span>
        </li>
      ))}
    </ul>
  );

  return (
    <section className="marquee relative overflow-hidden border-y border-line bg-surface/60 py-6 md:py-8">
      <div
        style={{
          maskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
          WebkitMaskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
        }}
      >
        <div className="marquee-track flex w-max">
          {row(false)}
          {row(true)}
        </div>
      </div>
    </section>
  );
}
