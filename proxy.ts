import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// Next.js 16 "proxy" convention (formerly middleware). next-intl's handler
// works unchanged here — it negotiates the locale and rewrites/redirects.
export default createMiddleware(routing);

export const config = {
  // Match all pathnames except API routes, Next internals, and static files.
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
