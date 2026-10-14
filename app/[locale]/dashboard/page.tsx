import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { readRole } from "@/lib/session";
import BusinessOverview from "@/components/dashboard/pages/BusinessOverview";
import { CustomerOverview } from "@/components/dashboard/pages/CustomerPages";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "dashboard" });
  return { title: t("nav.overview") };
}

export default async function DashboardOverview({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const role = await readRole();
  return role === "customer" ? <CustomerOverview locale={locale} /> : <BusinessOverview locale={locale} />;
}
