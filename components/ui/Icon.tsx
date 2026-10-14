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
  | "arrow-left"
  | "server"
  | "award"
  | "phone-missed"
  | "message"
  | "clipboard"
  | "calendar-check"
  | "search"
  | "compare"
  | "bolt"
  | "globe"
  | "graduation"
  | "alert"
  | "target"
  | "euro"
  | "home"
  | "gear"
  | "building"
  | "logout"
  | "panel"
  | "chevron-down"
  | "chevron-left"
  | "chevron-right"
  | "user"
  | "map-pin"
  | "send"
  | "mic"
  | "note"
  | "phone-out"
  | "ban"
  | "copy"
  | "drop"
  | "flame"
  | "hammer"
  | "brush"
  | "grid"
  | "key"
  | "car"
  | "wrench"
  | "sliders"
  | "languages";

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
    <path d="M11 3.5c.6 3.6 2.4 5.4 6 6-3.6.6-5.4 2.4-6 6-.6-3.6-2.4-5.4-6-6 3.6-.6 5.4-2.4 6-6ZM18.5 14.5c.3 1.4 1 2.1 2.5 2.5-1.5.4-2.2 1.1-2.5 2.5-.3-1.4-1-2.1-2.5-2.5 1.5-.4 2.2-1.1 2.5-2.5Z" />
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
  server: (
    <>
      <rect x="3" y="4" width="18" height="7" rx="2" />
      <rect x="3" y="13" width="18" height="7" rx="2" />
      <path d="M7 7.5h.01M7 16.5h.01" />
    </>
  ),
  award: (
    <>
      <circle cx="12" cy="9" r="5.5" />
      <path d="M8.5 13.7 7 21l5-2.8 5 2.8-1.5-7.3" />
    </>
  ),
  "phone-missed": (
    <>
      <path d="M3 5.5C3 4.1 4.1 3 5.5 3H7l1.5 4.5L7 9c.8 1.7 2.3 3.2 4 4l1.5-1.5L17 13v1.5c0 1.4-1.1 2.5-2.5 2.5C8.6 17 3 11.4 3 5.5Z" />
      <path d="m15.5 3.5 5 5M20.5 3.5l-5 5" />
    </>
  ),
  message: (
    <>
      <path d="M20 15a2 2 0 0 1-2 2H9l-5 4V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v9Z" />
      <path d="M8 8.5h8M8 12h5" />
    </>
  ),
  clipboard: (
    <>
      <path d="M9 4.5H7a2 2 0 0 0-2 2V19a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6.5a2 2 0 0 0-2-2h-2" />
      <rect x="9" y="2.5" width="6" height="4" rx="1" />
      <path d="M8.5 11h7M8.5 15h5" />
    </>
  ),
  "calendar-check": (
    <>
      <rect x="3" y="4.5" width="18" height="16" rx="2.5" />
      <path d="M3 9h18M8 2.5v4M16 2.5v4M9 14.5l2 2 4-4" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m20 20-4.4-4.4" />
    </>
  ),
  compare: (
    <>
      <rect x="3.5" y="4" width="7" height="16" rx="1.5" />
      <rect x="13.5" y="4" width="7" height="16" rx="1.5" />
      <path d="M6 8h2M16 8h2" />
    </>
  ),
  bolt: <path d="M13 2.5 4.5 13.5H12l-1 8 8.5-11H12l1-8Z" />,
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9M12 3c-2.5 2.6-3.8 5.6-3.8 9s1.3 6.4 3.8 9" />
    </>
  ),
  graduation: (
    <>
      <path d="M2.5 9 12 4.5 21.5 9 12 13.5 2.5 9Z" />
      <path d="M6.5 11.2v4.3c0 1.5 2.5 3 5.5 3s5.5-1.5 5.5-3v-4.3M21.5 9v5" />
    </>
  ),
  alert: (
    <>
      <path d="M12 3.5 2.5 20h19L12 3.5Z" />
      <path d="M12 10v4.5M12 17.5h.01" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4.5" />
      <path d="M12 12h.01" />
    </>
  ),
  euro: <path d="M18 7a6.5 6.5 0 1 0 0 10M4.5 10.5h8M4.5 13.5h8" />,
  home: <path d="M3.5 10.5 12 3.5l8.5 7V20a1 1 0 0 1-1 1h-5v-6h-5v6h-5a1 1 0 0 1-1-1v-9.5Z" />,
  gear: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z" />
    </>
  ),
  building: (
    <>
      <rect x="4" y="3" width="16" height="18" rx="1.5" />
      <path d="M9 21v-4h6v4M8 7h2M14 7h2M8 11h2M14 11h2" />
    </>
  ),
  logout: <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />,
  panel: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2.5" />
      <path d="M9 4v16" />
    </>
  ),
  "chevron-down": <path d="m6 9 6 6 6-6" />,
  "chevron-left": <path d="m15 6-6 6 6 6" />,
  "chevron-right": <path d="m9 6 6 6-6 6" />,
  "map-pin": (
    <>
      <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  send: <path d="M20.5 3.5 10 14M20.5 3.5 14 20.5l-4-6.5-6.5-4 17-6.5Z" />,
  mic: (
    <>
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21" />
    </>
  ),
  note: (
    <>
      <path d="M5 4.5A1.5 1.5 0 0 1 6.5 3h11A1.5 1.5 0 0 1 19 4.5V15l-6 6H6.5A1.5 1.5 0 0 1 5 19.5v-15Z" />
      <path d="M13 21v-4.5a1.5 1.5 0 0 1 1.5-1.5H19M8.5 8h7M8.5 11.5h4" />
    </>
  ),
  "phone-out": (
    <>
      <path d="M3 5.5C3 4.1 4.1 3 5.5 3H7l1.5 4.5L7 9c.8 1.7 2.3 3.2 4 4l1.5-1.5L17 13v1.5c0 1.4-1.1 2.5-2.5 2.5C8.6 17 3 11.4 3 5.5Z" />
      <path d="M15 3h6v6M21 3l-6.5 6.5" />
    </>
  ),
  ban: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m5.6 5.6 12.8 12.8" />
    </>
  ),
  drop: <path d="M12 3.5s-6 6.6-6 11a6 6 0 0 0 12 0c0-4.4-6-11-6-11Z" />,
  flame: <path d="M12 21c-3.9 0-6.5-2.7-6.5-6.3 0-3.7 3-5.8 3.8-9.2 2 1.4 3 3.3 3 5.2 1-.9 1.6-2 1.8-3.2 2.3 1.9 4.4 4.5 4.4 7.3 0 3.5-2.6 6.2-6.5 6.2Z" />,
  hammer: (
    <>
      <path d="M13.5 6.5 4 16a2.1 2.1 0 0 0 3 3l9.5-9.5" />
      <path d="m12 5 2.5-2.5L21 9l-2.5 2.5L12 5Z" />
    </>
  ),
  brush: (
    <>
      <path d="M18.5 3.5 10 12" />
      <path d="M9.5 12.5c-2.5-.2-4.5 1.5-4.5 4 0 1.7-1 2.6-2 3 3.6 1.4 8.5 0 8.5-4 0-1.1-.7-2.4-2-3Z" />
      <path d="m16.5 2.5 5 5" />
    </>
  ),
  grid: (
    <>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
    </>
  ),
  key: (
    <>
      <circle cx="8" cy="15" r="4.5" />
      <path d="m11.2 11.8 9.3-9.3M17 6l2.5 2.5M14.5 8.5 16.5 10.5" />
    </>
  ),
  car: (
    <>
      <path d="M4 16.5V12l2-5.5h12L20 12v4.5" />
      <path d="M3 16.5h18v2H3zM4 12h16" />
      <circle cx="7.5" cy="14.5" r="0.6" />
      <circle cx="16.5" cy="14.5" r="0.6" />
    </>
  ),
  wrench: <path d="M14.5 6.5a4 4 0 0 0 5.2 5.2l-8.6 8.6a2.1 2.1 0 0 1-3-3l8.6-8.6a4 4 0 0 0-2.2-2.2Zm0 0L18 3a4 4 0 0 0-3.5 3.5Z" />,
  sliders: <path d="M4 7h10M18 7h2M4 17h4M12 17h8M14 4.5v5M8 14.5v5" />,
  languages: (
    <>
      <path d="M3.5 5.5h9M8 3.5v2M10.5 5.5c-.8 3.5-3 6.2-6.5 8M6 9c1 1.8 2.6 3.2 4.5 4" />
      <path d="m12 20.5 4-9 4 9M13.5 17.5h5" />
    </>
  ),
  copy: (
    <>
      <rect x="8.5" y="8.5" width="12" height="12" rx="2.5" />
      <path d="M15.5 8.5V6a2.5 2.5 0 0 0-2.5-2.5H6A2.5 2.5 0 0 0 3.5 6v7A2.5 2.5 0 0 0 6 15.5h2.5" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c0-3.6 3.1-6 7-6s7 2.4 7 6" />
    </>
  ),
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
