import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import ThemeSync from "@/components/ui/ThemeSync";
import "../globals.css";

// Geist for display and body (tight, engineered grotesk), Geist Mono for
// figures, times and phone numbers.
const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

// Runs before paint to apply the saved/system theme — prevents a flash of
// the wrong theme. Mirrors the logic in ThemeToggle.
const themeScript = `(function(){try{var s=localStorage.getItem('theme');var d=s?s==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.classList.toggle('dark',d);}catch(e){}})();`;

// Pre-render both locales at build time.
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });

  return {
    metadataBase: new URL("https://handyplan.netlify.app"),
    title: {
      default: t("title"),
      template: "%s · HandyPlan",
    },
    description: t("description"),
    keywords: [
      "Handwerk",
      "Handwerksbetrieb",
      "verpasste Anrufe",
      "missed calls",
      "Erreichbarkeit",
      "job intake",
      "Cottbus",
    ],
    alternates: {
      languages: { en: "/en", de: "/de" },
    },
    openGraph: {
      title: t("title"),
      description: t("ogDescription"),
      type: "website",
      locale,
      siteName: "HandyPlan",
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("ogDescription"),
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  // Enable static rendering for this locale.
  setRequestLocale(locale);

  return (
    <html
      lang={locale}
      className={`${geist.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      {/* Browser extensions (e.g. Grammarly) add attributes to <body> before
          React hydrates; don't report those as mismatches. */}
      <body className="bg-canvas text-ink antialiased" suppressHydrationWarning>
        <ThemeSync />
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
