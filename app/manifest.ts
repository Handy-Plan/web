import type { MetadataRoute } from "next";

/** Install/"Add to home screen" metadata; also read by some link previewers. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "HandyPlan",
    short_name: "HandyPlan",
    description: "Missed calls turned into booked jobs, for trade businesses.",
    start_url: "/",
    display: "standalone",
    background_color: "#f8fafc",
    theme_color: "#0369a1",
    icons: [
      { src: "/icon.svg", type: "image/svg+xml", sizes: "any" },
      { src: "/logo.png", type: "image/png", sizes: "512x512", purpose: "any" },
      { src: "/apple-icon", type: "image/png", sizes: "180x180" },
    ],
  };
}
