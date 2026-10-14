import Image, { generateImageMetadata, generateStaticParams } from "./opengraph-image";
import { OG_SIZE } from "@/lib/og";

// Same artwork as the Open Graph card (X/Twitter reads its own tag).
export const size = OG_SIZE;
export const contentType = "image/png";
export { generateImageMetadata, generateStaticParams };
export default Image;
