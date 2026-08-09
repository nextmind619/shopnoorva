import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { defaultLocale } from "./i18n/config";
import { evaluateVisitor, readTrustCookie } from "@/lib/security";
import { SECURITY_CONFIG } from "@/lib/security/config";
import { SITE_DOMAIN, SITE_URL } from "@/lib/site";

const intlMiddleware = createMiddleware({
  locales: ["ar"],
  defaultLocale: "ar",
  localePrefix: "always",
});

const IMAGE_EXT = /\.(png|jpe?g|webp|gif|avif|svg|ico)$/i;
/** Video/audio must bypass trust scoring — range requests would trip velocity & block playback. */
const MEDIA_EXT = /\.(mp4|webm|mp3|ogg|wav|m4a)$/i;
const STATIC_EXT = /\.(css|js|mjs|map|woff2?|ttf|eot|txt|xml|json|webmanifest)$/i;

/** Meta / TikTok crawlers must reach the real homepage for ad preview + domain verification. */
const AD_PLATFORM_CRAWLER_UA =
  /facebookexternalhit|Facebot|meta-externalagent|meta-externalads|FacebookBot|Bytespider|TikTokSpider|Bytedance|musical_ly|TikTok/i;

function clientIp(request: NextRequest): string {
  return (
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

function isAllowedAssetReferer(referer: string | null): boolean {
  if (!referer) return false;
  try {
    const host = new URL(referer).hostname.replace(/^www\./, "");
    const siteHost = new URL(SITE_URL).hostname.replace(/^www\./, "");
    if (host === siteHost || host === SITE_DOMAIN || host.endsWith(`.${SITE_DOMAIN}`)) return true;
    // Same-site preview / localhost
    if (host === "localhost" || host === "127.0.0.1") return true;
  } catch {
    return false;
  }
  return false;
}

function applySecurityHeaders(res: NextResponse): NextResponse {
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.headers.set("Cross-Origin-Resource-Policy", "same-site");
  res.headers.set("X-Permitted-Cross-Domain-Policies", "none");
  return res;
}

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Always allow access-denied, security APIs, and Next internals
  if (
    pathname.startsWith("/access-denied") ||
    pathname.startsWith("/api/security") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/admin")
  ) {
    return applySecurityHeaders(NextResponse.next());
  }

  // Let Meta / TikTok verify the domain / scrape OG without anti-spy blocking
  if (AD_PLATFORM_CRAWLER_UA.test(request.headers.get("user-agent") || "")) {
    if (/^\/(fr|en)(\/|$)/.test(pathname)) {
      const url = request.nextUrl.clone();
      url.pathname = pathname.replace(/^\/(fr|en)/, `/${defaultLocale}`);
      return applySecurityHeaders(NextResponse.redirect(url));
    }
    if (pathname.startsWith("/api")) {
      return applySecurityHeaders(NextResponse.next());
    }
    return applySecurityHeaders(intlMiddleware(request));
  }

  // --- Hotlink protection for images ---
  if (IMAGE_EXT.test(pathname)) {
    const referer = request.headers.get("referer");
    const secFetchSite = request.headers.get("sec-fetch-site");
    // Allow same-origin navigations and empty referer from top-level app (some browsers)
    const ok =
      secFetchSite === "same-origin" ||
      secFetchSite === "same-site" ||
      isAllowedAssetReferer(referer) ||
      // First-party <img> sometimes omits referer with strict policy — allow no-referer only for same site navigations
      (!referer && secFetchSite === "none" && request.headers.get("sec-fetch-dest") === "image");

    // Block clear cross-site hotlinks
    if (referer && !isAllowedAssetReferer(referer) && secFetchSite === "cross-site") {
      return new NextResponse("Hotlinking forbidden", { status: 403 });
    }
    if (!ok && referer && !isAllowedAssetReferer(referer)) {
      return new NextResponse("Hotlinking forbidden", { status: 403 });
    }
    return applySecurityHeaders(NextResponse.next());
  }

  // --- Hotlink protection for video/audio (same rules as images; never trust-score) ---
  if (MEDIA_EXT.test(pathname)) {
    const referer = request.headers.get("referer");
    const secFetchSite = request.headers.get("sec-fetch-site");
    const ok =
      secFetchSite === "same-origin" ||
      secFetchSite === "same-site" ||
      isAllowedAssetReferer(referer) ||
      (!referer &&
        (secFetchSite === "none" || !secFetchSite) &&
        (request.headers.get("sec-fetch-dest") === "video" ||
          request.headers.get("sec-fetch-dest") === "audio" ||
          request.headers.get("sec-fetch-dest") === "empty"));

    if (referer && !isAllowedAssetReferer(referer) && secFetchSite === "cross-site") {
      return new NextResponse("Hotlinking forbidden", { status: 403 });
    }
    if (!ok && referer && !isAllowedAssetReferer(referer)) {
      return new NextResponse("Hotlinking forbidden", { status: 403 });
    }
    return applySecurityHeaders(NextResponse.next());
  }

  // Pass through non-image static assets without trust scoring (avoid false crawl signals)
  if (STATIC_EXT.test(pathname)) {
    return applySecurityHeaders(NextResponse.next());
  }

  // Skip intl for non-page assets without extension already handled
  if (pathname.startsWith("/api")) {
    return applySecurityHeaders(NextResponse.next());
  }

  if (/^\/(fr|en)(\/|$)/.test(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.replace(/^\/(fr|en)/, `/${defaultLocale}`);
    return NextResponse.redirect(url);
  }

  // --- Visitor trust evaluation (pages only) ---
  const ip = clientIp(request);
  const ua = request.headers.get("user-agent") || "";
  const referer = request.headers.get("referer") || "";
  const acceptLanguage = request.headers.get("accept-language") || "";
  const trustCookie = request.cookies.get(SECURITY_CONFIG.challenge.cookieName)?.value;
  const trust = readTrustCookie(trustCookie);

  const previewToken = process.env.SECURITY_PREVIEW_TOKEN?.trim();
  const previewQuery = request.nextUrl.searchParams.get(SECURITY_CONFIG.previewQueryParam);
  const previewCookie = request.cookies.get(SECURITY_CONFIG.previewCookie)?.value;
  const ownerPreview =
    Boolean(previewToken) &&
    (previewQuery === previewToken || previewCookie === previewToken);

  const evaluation = evaluateVisitor({
    ip,
    userAgent: ua,
    referer,
    acceptLanguage,
    pathname,
    searchParams: request.nextUrl.searchParams,
    headers: {
      "user-agent": ua,
      accept: request.headers.get("accept"),
      "accept-language": acceptLanguage,
      "sec-ch-ua": request.headers.get("sec-ch-ua"),
      via: request.headers.get("via"),
      forwarded: request.headers.get("forwarded"),
      "cf-ipcountry": request.headers.get("cf-ipcountry"),
    },
    challengePassed: trust.valid && trust.score >= SECURITY_CONFIG.bands.allowMin,
    priorScore: trust.valid ? trust.score : undefined,
  });

  // Soft bump for Cloudflare Morocco country when present
  if (request.headers.get("cf-ipcountry") === "MA" && evaluation.decision === "block" && evaluation.score >= 30) {
    evaluation.decision = "challenge";
  }

  if (evaluation.decision === "block" && !ownerPreview) {
    const denied = NextResponse.redirect(new URL("/access-denied", request.url));
    return applySecurityHeaders(denied);
  }

  const intlResponse = intlMiddleware(request);
  const res = applySecurityHeaders(intlResponse);

  if (ownerPreview && previewToken) {
    res.cookies.set(SECURITY_CONFIG.previewCookie, previewToken, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      secure: process.env.NODE_ENV === "production",
    });
  }

  if (evaluation.decision === "challenge") {
    res.cookies.set("nv_need_ch", "1", {
      httpOnly: false,
      sameSite: "lax",
      path: "/",
      maxAge: 600,
    });
    res.headers.set("X-NV-Challenge", "1");
  }

  // Expose soft score for debugging in non-production
  if (process.env.NODE_ENV !== "production") {
    res.headers.set("X-NV-Trust", String(evaluation.score));
  }

  return res;
}

export const config = {
  matcher: [
    "/",
    "/access-denied",
    "/(ar|fr|en)/:path*",
    "/((?!api/admin|_next|_vercel).*)",
  ],
};
