// Locale routing (Next 16 `proxy` convention). Redirects non-prefixed paths to
// /{locale}/… based on the NEXT_LOCALE cookie, then Accept-Language, else Dutch.
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { LOCALES, DEFAULT_LOCALE, LOCALE_COOKIE } from "@/lib/i18n/config";

function pickLocale(req: NextRequest): string {
  const cookie = req.cookies.get(LOCALE_COOKIE)?.value;
  if (cookie === "nl" || cookie === "en") return cookie;
  const first = (req.headers.get("accept-language") || "").toLowerCase().split(",")[0] || "";
  if (first.startsWith("en")) return "en";
  return DEFAULT_LOCALE;
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const current = LOCALES.find((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`));
  if (current) {
    const res = NextResponse.next();
    if (req.cookies.get(LOCALE_COOKIE)?.value !== current) {
      res.cookies.set(LOCALE_COOKIE, current, { path: "/", maxAge: 31536000, sameSite: "lax" });
    }
    return res;
  }
  const locale = pickLocale(req);
  req.nextUrl.pathname = pathname === "/" ? `/${locale}` : `/${locale}${pathname}`;
  const res = NextResponse.redirect(req.nextUrl);
  res.cookies.set(LOCALE_COOKIE, locale, { path: "/", maxAge: 31536000, sameSite: "lax" });
  return res;
}

export const config = {
  // Skip API, Next internals, metadata/feed routes, and any file with an extension.
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|icon.svg|sitemap.xml|robots.txt|feed.xml|.*\\..*).*)",
  ],
};
