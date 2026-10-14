import type { Metadata } from "next";
import { cookies } from "next/headers";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { dashboardNav, tradeOptions } from "@/lib/content";
import { isOneOf, readOnboarding } from "@/lib/onboarding";
import { readRole } from "@/lib/session";
import { noIndex } from "@/lib/site";
import DashboardShell from "@/components/dashboard/DashboardShell";

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "dashboard" });
  return { title: t("meta"), robots: noIndex };
}

function initialsOf(name: string) {
  const letters = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
  return letters || "HP";
}

export default async function DashboardLayout({ children, params }: LayoutProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [role, data, store] = await Promise.all([readRole(), readOnboarding(), cookies()]);
  const t = await getTranslations("dashboard");
  const onboarding = await getTranslations("onboarding");

  const name =
    role === "business" && data.businessName ? data.businessName : t("header.yourAccount");
  const subtitle =
    role === "business" && isOneOf(data.trade, tradeOptions)
      ? onboarding(`business.trades.${data.trade}`)
      : t(`roles.${role}`);

  return (
    <DashboardShell
      role={role}
      groups={dashboardNav[role]}
      user={{
        name,
        subtitle,
        // No company name yet → the avatar shows a person icon instead of "YA".
        initials:
          role === "business" && data.businessName ? initialsOf(data.businessName) : "",
      }}
      initialCollapsed={store.get("hp_sidebar")?.value === "collapsed"}
    >
      {children}
    </DashboardShell>
  );
}
