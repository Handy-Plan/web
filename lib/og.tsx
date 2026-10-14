import { readFile } from "node:fs/promises";
import { join } from "node:path";

/**
 * Share-card artwork (Open Graph / Twitter / WhatsApp / LinkedIn previews),
 * rendered by next/og at build time. Night-blue stage from the design
 * system; Geist is bundled in assets/fonts because next/og can't use
 * next/font.
 */

export const OG_SIZE = { width: 1200, height: 630 };

export async function ogFonts() {
  const dir = join(process.cwd(), "assets/fonts");
  const [regular, semibold, mono] = await Promise.all([
    readFile(join(dir, "Geist-Regular.ttf")),
    readFile(join(dir, "Geist-SemiBold.ttf")),
    readFile(join(dir, "GeistMono-Medium.ttf")),
  ]);
  return [
    { name: "Geist", data: regular, weight: 400 as const, style: "normal" as const },
    { name: "Geist", data: semibold, weight: 600 as const, style: "normal" as const },
    { name: "Geist Mono", data: mono, weight: 500 as const, style: "normal" as const },
  ];
}

/** The app icon (same as app/icon.svg) as a data URI for <img>. */
export const logoSrc = `data:image/svg+xml;base64,${Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="16" fill="#0369a1"/><g transform="translate(9.2 8.25) scale(1.9)"><path d="M12 5 19.2 10.4V16.8H11L7 20V16.8H4.8V10.4Z" fill="#fff" stroke="#fff" stroke-width="3.2" stroke-linejoin="round"/><path d="m8.6 13 2.3 2.3 4.6-4.8" fill="none" stroke="#0369a1" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></g></svg>`,
).toString("base64")}`;

export type ShareCopy = {
  headline: string;
  accent: string;
  tagline: string;
  missedCall: string;
  reply: string;
  jobCard: string;
  jobTitle: string;
  jobMeta: string;
  domain: string;
};

const STAGE = "#06121f";

export function ShareCard({ copy }: { copy: ShareCopy }) {
  // Longer languages (German) step the headline down so it never crowds the logo.
  const long = copy.headline.length + copy.accent.length > 55;
  const display = long ? 50 : 62;
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        background: STAGE,
        fontFamily: "Geist",
        color: "white",
        overflow: "hidden",
      }}
    >
      {/* Radial glows (one layer each: next/og handles single gradients best) */}
      <div
        style={{
          position: "absolute",
          top: -520,
          right: -380,
          width: 1100,
          height: 1100,
          display: "flex",
          backgroundImage: "radial-gradient(circle, rgba(3,105,161,0.85) 0%, rgba(3,105,161,0) 65%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -420,
          left: -360,
          width: 840,
          height: 840,
          display: "flex",
          backgroundImage: "radial-gradient(circle, rgba(56,189,248,0.26) 0%, rgba(56,189,248,0) 65%)",
        }}
      />

      {/* Left: brand + message */}
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "64px 0 60px 72px", width: 640 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoSrc} width={56} height={56} alt="" />
          <span style={{ fontSize: 32, fontWeight: 600, letterSpacing: "-0.03em" }}>HandyPlan</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: display, fontWeight: 600, lineHeight: 1.04, letterSpacing: "-0.045em" }}>{copy.headline}</span>
          <span style={{ fontSize: display, fontWeight: 600, lineHeight: 1.04, letterSpacing: "-0.045em", color: "#7dd3fc", marginTop: 6 }}>
            {copy.accent}
          </span>
          <span style={{ fontSize: long ? 23 : 26, lineHeight: 1.4, color: "rgba(255,255,255,0.68)", marginTop: long ? 20 : 26, maxWidth: 520 }}>{copy.tagline}</span>
        </div>

        <span style={{ fontFamily: "Geist Mono", fontSize: 22, color: "rgba(255,255,255,0.5)" }}>{copy.domain}</span>
      </div>

      {/* Right: the product loop, call → text → job card */}
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 18, paddingRight: 64, width: 560 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            alignSelf: "flex-start",
            padding: "12px 20px",
            borderRadius: 999,
            background: "rgba(220,38,38,0.16)",
            border: "1px solid rgba(248,113,113,0.35)",
            fontSize: 22,
            color: "#fecaca",
          }}
        >
          <span style={{ width: 12, height: 12, borderRadius: 999, background: "#f87171" }} />
          {copy.missedCall}
        </div>

        <div
          style={{
            display: "flex",
            padding: "22px 26px",
            borderRadius: "28px 28px 28px 8px",
            background: "rgba(255,255,255,0.09)",
            border: "1px solid rgba(255,255,255,0.14)",
            fontSize: 23,
            lineHeight: 1.45,
            color: "rgba(255,255,255,0.92)",
          }}
        >
          {copy.reply}
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "22px 26px",
            borderRadius: 28,
            background: "#ffffff",
            color: "#0f172a",
            boxShadow: "0 30px 60px rgba(0,0,0,0.35)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 18, color: "#64748b" }}>{copy.jobCard}</span>
            <span
              style={{
                display: "flex",
                padding: "6px 14px",
                borderRadius: 999,
                background: "#0f172a",
                color: "white",
                fontSize: 17,
                fontWeight: 600,
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path d="M4.5 12.5 9 17l10.5-11" fill="none" stroke="white" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </div>
          <span style={{ fontSize: 27, fontWeight: 600, letterSpacing: "-0.025em", marginTop: 8 }}>{copy.jobTitle}</span>
          <span style={{ fontFamily: "Geist Mono", fontSize: 18, color: "#64748b", marginTop: 8 }}>{copy.jobMeta}</span>
        </div>
      </div>
    </div>
  );
}
