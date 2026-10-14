import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { tradeOptions } from "@/lib/content";
import { getDirectory } from "@/lib/mock/dashboard";
import { noIndex, pageMeta } from "@/lib/site";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Icon from "@/components/ui/Icon";
import Directory from "@/components/directory/Directory";
import { fromParams } from "@/components/directory/filters";
import { StageGlow, rise } from "@/components/dashboard/kit";

type Params = { params: Promise<{ locale: string }> };
type PageProps = Params & { searchParams: Promise<Record<string, string | string[] | undefined>> };

/**
 * Listings are sample data until businesses sign up. While that's true the
 * page stays out of search results and the sitemap, and shows a "Sample
 * listings" badge. Flip to false once real profiles are loaded.
 */
const SAMPLE_LISTINGS = true;

// Free slots are relative to "now" ("Today, 15:00"), so render per request.
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "directory" });
  return {
    ...pageMeta({
      locale,
      path: "/handwerker",
      title: t("metaTitle"),
      description: t("metaDescription"),
      shareDescription: t("shareDescription"),
    }),
    ...(SAMPLE_LISTINGS && { robots: noIndex }),
  };
}

export default async function DirectoryPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("directory");
  const pros = getDirectory(locale === "de" ? "de" : "en");
  const trades = tradeOptions.filter((x) => x !== "other");
  // Filters come from the URL, so shared/bookmarked links open filtered.
  const query = await searchParams;
  const initial = fromParams((key) => {
    const v = query[key];
    return Array.isArray(v) ? v[0] : v;
  }, trades);

  return (
    <>
      <Navbar />
      <main className="relative z-10 min-h-[100dvh] bg-canvas pb-24 pt-24 md:pt-28">
        <div className="auth-rise mx-auto flex max-w-[1180px] flex-col gap-8 px-4 sm:px-6">
          <div style={rise(0)}>
            <Directory pros={pros} trades={trades} sample={SAMPLE_LISTINGS} initial={initial} />
          </div>

          {/* For tradespeople: get listed */}
          <section style={rise(1)} className="relative mt-6 overflow-hidden rounded-[32px] bg-[#06121f] p-7 text-white sm:p-10">
            <StageGlow floor />
            <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="max-w-xl">
                <p className="flex items-center gap-2 text-[13px] font-medium text-sky-300">
                  <Icon name="building" size={15} />
                  {t("listed.label")}
                </p>
                <h2 className="mt-3 text-balance text-[28px] font-semibold leading-[1.08] tracking-[-0.035em] sm:text-[36px]">{t("listed.title")}</h2>
                <p className="mt-3 text-pretty text-[16px] leading-relaxed text-white/65">{t("listed.body")}</p>
              </div>
              <Link
                href={{ pathname: "/signup", query: { as: "business" } }}
                className="group inline-flex h-12 shrink-0 items-center gap-2 self-start rounded-full bg-white px-6 text-[15px] font-semibold text-[#06121f] transition-[transform,background-color] duration-200 hover:bg-sky-100 active:scale-[0.97] md:self-center"
              >
                {t("listed.cta")}
                <Icon name="arrow-right" size={16} className="transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
