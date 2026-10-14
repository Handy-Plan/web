import { ImageResponse } from "next/og";
import { logoSrc } from "@/lib/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Home-screen icon for iOS (PNG; iOS ignores SVG icons). */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <img src={logoSrc} width={180} height={180} alt="" style={{ borderRadius: 0 }} />
    ),
    size,
  );
}
