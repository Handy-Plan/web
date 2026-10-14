import { ImageResponse } from "next/og";
import { hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import { OG_SIZE, ShareCard, ogFonts } from "@/lib/og";
import { SITE_URL } from "@/lib/site";

export const size = OG_SIZE;
export const contentType = "image/png";

type Params = { params: Promise<{ locale: string }> };

/**
 * Share copy straight from the message file: image routes run outside the
 * request scope next-intl's getTranslations() relies on.
 */
async function shareCopy(params: Params["params"]) {
  const { locale } = await params;
  const lang = hasLocale(routing.locales, locale) ? locale : routing.defaultLocale;
  const messages = (await import(`../../messages/${lang}.json`)).default as { share: Record<string, string> };
  return messages.share;
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateImageMetadata({ params }: Params) {
  const share = await shareCopy(params);
  return [{ id: "card", alt: share.alt, size: OG_SIZE, contentType }];
}

/** Link preview for every page under /[locale]. */
export default async function Image({ params }: Params) {
  const s = await shareCopy(params);
  return new ImageResponse(
    (
      <ShareCard
        copy={{
          headline: s.headline,
          accent: s.accent,
          tagline: s.tagline,
          missedCall: s.missedCall,
          reply: s.reply,
          jobCard: s.jobCard,
          jobTitle: s.jobTitle,
          jobMeta: s.jobMeta,
          domain: SITE_URL.replace(/^https?:\/\//, ""),
        }}
      />
    ),
    { ...OG_SIZE, fonts: await ogFonts() },
  );
}
