import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { defaultLocale } from "./i18n/config";

const intlMiddleware = createMiddleware({
  locales: ["ar"],
  defaultLocale: "ar",
  localePrefix: "always",
});

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (/^\/(fr|en)(\/|$)/.test(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.replace(/^\/(fr|en)/, `/${defaultLocale}`);
    return NextResponse.redirect(url);
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/", "/(ar|fr|en)/:path*", "/((?!api|admin|_next|_vercel|.*\\..*).*)"],
};
