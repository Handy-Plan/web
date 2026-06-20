import type { SVGProps } from "react";

/**
 * Lightweight inline icon set (stroke-based, 24x24 grid).
 * Server-renderable — no client JS. `currentColor` inherits text color.
 */

export type IconName =
  | "phone"
  | "calendar"
  | "clock"
  | "widget"
  | "mobile"
  | "bell"
  | "users"
  | "invoice"
  | "signup"
  | "setup"
  | "rocket"
  | "check"
  | "arrow-right"
  | "play"
  | "star"
  | "shield"
  | "plus"
  | "menu"
  | "close"
  | "sparkle"
  | "sun"
  | "moon"
  | "mail"
  | "lock"
  | "eye"
  | "eye-off"
  | "arrow-left";

const paths: Record<IconName, React.ReactNode> = {
  phone: (
    <path d="M3 5.5C3 4.1 4.1 3 5.5 3H7l1.5 4.5L7 9c.8 1.7 2.3 3.2 4 4l1.5-1.5L17 13v1.5c0 1.4-1.1 2.5-2.5 2.5C8.6 17 3 11.4 3 5.5Z" />
  ),
  calendar: (
    <>
      <rect x="3" y="4.5" width="18" height="16" rx="2.5" />
      <path d="M3 9h18M8 2.5v4M16 2.5v4" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  widget: (
    <>
      <rect x="3.5" y="4" width="17" height="13" rx="2" />
      <path d="M3.5 8h17M7 20.5h10M12 17v3.5" />
    </>
  ),
  mobile: (
    <>
      <rect x="7" y="2.5" width="10" height="19" rx="2.5" />
      <path d="M11 18.5h2" />
    </>
  ),
  bell: (
    <path d="M6 9a6 6 0 1 1 12 0c0 5 2 6 2 6H4s2-1 2-6ZM10 20a2 2 0 0 0 4 0" />
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3.5 19c0-3 2.5-5 5.5-5s5.5 2 5.5 5M16 5.2a3 3 0 0 1 0 5.6M17 14c2.4.3 4 2.2 4 5" />
    </>
  ),
  invoice: (
    <>
      <path d="M6 2.5h8l4 4V21a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1Z" />
      <path d="M13.5 2.5V7H18M8.5 12h7M8.5 16h5" />
    </>
  ),
  signup: (
    <>
      <path d="M16 4.5 19.5 8 9 18.5l-4 1 1-4L16 4.5Z" />
      <path d="M14 6.5 17.5 10" />
    </>
  ),
  setup: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2.5v3M12 18.5v3M21.5 12h-3M5.5 12h-3M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1M18.4 18.4l-2.1-2.1M7.7 7.7 5.6 5.6" />
    </>
  ),
  rocket: (
    <path d="M5 14c0-5 4-10.5 9-11 .5 5-.5 9-5 11l-4 .5L5 14Zm0 0-2 4 4-2m6.5-9.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
  ),
  check: <path d="M4.5 12.5 9 17l10.5-11" />,
  "arrow-right": <path d="M4.5 12h15M13 5.5 19.5 12 13 18.5" />,
  play: <path d="M7 4.5 19 12 7 19.5V4.5Z" />,
  star: (
    <path d="m12 3 2.6 5.5 6 .8-4.4 4.2 1.1 6L12 16.8 6.7 19.5l1.1-6L3.4 9.3l6-.8L12 3Z" />
  ),
  shield: <path d="M12 3 5 5.5V11c0 5 3 8 7 9.5 4-1.5 7-4.5 7-9.5V5.5L12 3Zm-2 8.5L11.5 13 15 9" />,
  plus: <path d="M12 5v14M5 12h14" />,
  menu: <path d="M3.5 7h17M3.5 12h17M3.5 17h17" />,
  close: <path d="M5.5 5.5 18.5 18.5M18.5 5.5 5.5 18.5" />,
  sparkle: (
    <path d="M12 3v6m0 6v6m6-9h-6m-6 0H0M12 9l1.8 1.2L15 12l-1.2 1.8L12 15l-1.8-1.2L9 12l1.2-1.8L12 9Z" />
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5v2.5M12 19v2.5M21.5 12H19M5 12H2.5M18.4 5.6l-1.8 1.8M7.4 16.6l-1.8 1.8M18.4 18.4l-1.8-1.8M7.4 7.4 5.6 5.6" />
    </>
  ),
  moon: <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z" />,
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="m4 7.5 8 5.5 8-5.5" />
    </>
  ),
  lock: (
    <>
      <rect x="4.5" y="10.5" width="15" height="10" rx="2.5" />
      <path d="M8 10.5V7a4 4 0 0 1 8 0v3.5" />
    </>
  ),
  eye: (
    <>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  "eye-off": (
    <>
      <path d="M3 3l18 18" />
      <path d="M10.6 6.1A9.8 9.8 0 0 1 12 6c6 0 9.5 6 9.5 6a16.4 16.4 0 0 1-2.6 3.2M6.2 7.8A16.2 16.2 0 0 0 2.5 12S6 18 12 18a9.5 9.5 0 0 0 3.2-.6" />
      <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
    </>
  ),
  "arrow-left": <path d="M19.5 12h-15M11 5.5 4.5 12 11 18.5" />,
};

type Props = SVGProps<SVGSVGElement> & {
  name: IconName;
  size?: number;
  filled?: boolean;
};

export default function Icon({
  name,
  size = 24,
  filled = false,
  ...props
}: Props) {
  const node = paths[name];
  const isFilled = filled || name === "star" || name === "play";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={isFilled ? "currentColor" : "none"}
      stroke={isFilled ? "none" : "currentColor"}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {node}
    </svg>
  );
}
