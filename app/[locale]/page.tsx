import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { SITE_NAME, SITE_URL, pageMeta, urlFor } from "@/lib/site";
import JsonLd from "@/components/seo/JsonLd";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SmoothScroll from "@/components/animations/SmoothScroll";
import Story from "@/components/sections/Story";
import Signals from "@/components/sections/Signals";
import Problem from "@/components/sections/Problem";
import Market from "@/components/sections/Market";
import CustomerFlow from "@/components/sections/CustomerFlow";
import WhyHandyPlan from "@/components/sections/WhyHandyPlan";
import BusinessModel from "@/components/sections/BusinessModel";
import Languages from "@/components/sections/Languages";
import FAQ from "@/components/sections/FAQ";
import FinalCTA from "@/components/sections/FinalCTA";

type Params = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return pageMeta({ locale, home: true, title: t("title"), description: t("description") });
}

/**
 * Organization + WebSite + the product (free web app) + the visible FAQ, as
 * one JSON-LD graph. Only facts the page itself states: no ratings or reviews.
 */
async function structuredData(locale: string) {
  const meta = await getTranslations({ locale, namespace: "meta" });
  const hero = await getTranslations({ locale, namespace: "hero" });
  const faq = await getTranslations({ locale, namespace: "faq" });
  const items = faq.raw("items") as { q: string; a: string }[];
  const org = `${SITE_URL}/#organization`;
  const site = `${SITE_URL}/#website`;
  const page = urlFor(locale);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": org,
        name: SITE_NAME,
        url: SITE_URL,
        logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.png`, width: 512, height: 512 },
        description: meta("ogDescription"),
        foundingLocation: { "@type": "Place", name: "Cottbus, Germany" },
        areaServed: { "@type": "Country", name: "Germany" },
      },
      {
        "@type": "WebSite",
        "@id": site,
        url: SITE_URL,
        name: SITE_NAME,
        publisher: { "@id": org },
        inLanguage: ["de-DE", "en"],
      },
      {
        "@type": "WebPage",
        "@id": `${page}#webpage`,
        url: page,
        name: meta("title"),
        description: meta("description"),
        isPartOf: { "@id": site },
        about: { "@id": `${SITE_URL}/#app` },
        inLanguage: locale === "de" ? "de-DE" : "en",
        primaryImageOfPage: `${page}/opengraph-image/card`,
      },
      {
        "@type": "WebApplication",
        "@id": `${SITE_URL}/#app`,
        name: SITE_NAME,
        url: page,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web, iOS, Android",
        description: meta("description"),
        featureList: hero.raw("bullets") as string[],
        offers: { "@type": "Offer", price: "0", priceCurrency: "EUR", description: (hero.raw("trust") as string[])[0] },
        provider: { "@id": org },
        inLanguage: ["de-DE", "en"],
      },
      {
        "@type": "FAQPage",
        "@id": `${page}#faq`,
        isPartOf: { "@id": `${page}#webpage` },
        mainEntity: items.map((it) => ({
          "@type": "Question",
          name: it.q,
          acceptedAnswer: { "@type": "Answer", text: it.a },
        })),
      },
    ],
  };
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <JsonLd data={await structuredData(locale)} />
      <SmoothScroll />
      <Navbar />
      {/* Opaque and above the footer, so the footer is uncovered like a curtain */}
      <main className="relative z-10 bg-canvas">
        <Story />
        <Signals />
        <Problem />
        <Market />
        <CustomerFlow />
        <WhyHandyPlan />
        <BusinessModel />
        <Languages />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
