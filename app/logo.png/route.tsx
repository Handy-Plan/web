import { ImageResponse } from "next/og";
import { logoSrc } from "@/lib/og";

export const dynamic = "force-static";

/** 512px PNG logo for structured data (Organization.logo) and the web manifest. */
export function GET() {
  return new ImageResponse(
    (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={logoSrc} width={512} height={512} alt="" />
    ),
    { width: 512, height: 512 },
  );
}
