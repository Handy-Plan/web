import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { dashboardNav, type DashboardRole } from "@/lib/content";
import { readRole } from "@/lib/session";
import {
  AiPage,
  CalendarPage,
  CallsPage,
  CustomersPage,
  JobsPage,
  MessagesPage,
  ProfilePage,
  SettingsPage,
} from "@/components/dashboard/pages/BusinessPages";
import {
  BookingsPage,
  CustomerMessagesPage,
  CustomerSettingsPage,
  FindPage,
} from "@/components/dashboard/pages/CustomerPages";

type PageProps = {
  params: Promise<{ locale: string; section: string }>;
  searchParams: Promise<{ job?: string; pro?: string; slot?: string }>;
};

type Render = (args: { locale: string; job?: string; pro?: string; slot?: string }) => React.ReactNode;

/** Which page each nav item renders, per dashboard. */
const pages: Record<DashboardRole, Record<string, Render>> = {
  business: {
    jobs: ({ locale, job }) => <JobsPage locale={locale} jobId={job} />,
    calls: ({ locale }) => <CallsPage locale={locale} />,
    calendar: ({ locale }) => <CalendarPage locale={locale} />,
    customers: ({ locale }) => <CustomersPage locale={locale} />,
    messages: ({ locale }) => <MessagesPage locale={locale} />,
    profile: ({ locale }) => <ProfilePage locale={locale} />,
    ai: ({ locale }) => <AiPage locale={locale} />,
    settings: ({ locale }) => <SettingsPage locale={locale} />,
  },
  customer: {
    find: ({ locale, pro, slot }) => <FindPage locale={locale} pro={pro} slot={slot} />,
    bookings: ({ locale }) => <BookingsPage locale={locale} />,
    messages: ({ locale }) => <CustomerMessagesPage locale={locale} />,
    settings: () => <CustomerSettingsPage />,
  },
};

/** The nav item for this section, if the current role has it. */
async function findSection(section: string) {
  const role = await readRole();
  const item = dashboardNav[role]
    .flatMap((group) => group.items)
    .find((it) => it.key === section && it.key !== "overview");
  const render = item ? pages[role][item.key] : undefined;
  return item && render ? { item, render } : undefined;
}

export async function generateMetadata({ params }: { params: PageProps["params"] }): Promise<Metadata> {
  const { locale, section } = await params;
  const found = await findSection(section);
  if (!found) return {};
  const t = await getTranslations({ locale, namespace: "dashboard" });
  return { title: t(`nav.${found.item.key}`) };
}

export default async function DashboardSectionPage({ params, searchParams }: PageProps) {
  const { locale, section } = await params;
  setRequestLocale(locale);

  const found = await findSection(section);
  if (!found) notFound();
  const { job, pro, slot } = await searchParams;

  return found.render({ locale, job, pro, slot });
}
