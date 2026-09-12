import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { dashboardNav } from "@/lib/content";
import { readRole } from "@/lib/session";
import SectionPlaceholder from "@/components/dashboard/SectionPlaceholder";

type PageProps = { params: Promise<{ locale: string; section: string }> };

/** The nav item for this section, if the current role has it. */
async function findSection(section: string) {
  const role = await readRole();
  return dashboardNav[role]
    .flatMap((group) => group.items)
    .find((item) => item.key === section && item.key !== "overview");
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, section } = await params;
  const item = await findSection(section);
  if (!item) return {};
  const t = await getTranslations({ locale, namespace: "dashboard" });
  return { title: t(`nav.${item.key}`) };
}

export default async function DashboardSectionPage({ params }: PageProps) {
  const { locale, section } = await params;
  setRequestLocale(locale);

  const item = await findSection(section);
  if (!item) notFound();

  return <SectionPlaceholder section={item.key} icon={item.icon} />;
}
