import Script from "next/script";
import { FacebookPixelScript } from "@/components/facebook/facebook-pixel-script";
import { TikTokPixelScript } from "@/components/tiktok/tiktok-pixel-script";

/**
 * Third-party pixels load after the page is interactive / idle
 * so they never compete with LCP / FCP / INP.
 * If GTM is configured, skip raw GA to avoid double-loading analytics.
 *
 * Meta Pixel lives in FacebookPixelScript (single PageView on init).
 * Ecommerce Meta events use `@/lib/facebook/events` with shared event_id.
 */
export function AnalyticsScripts() {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const loadGa = Boolean(gaId) && !gtmId;

  return (
    <>
      {gtmId && (
        <>
          <Script id="gtm" strategy="lazyOnload">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${gtmId}');`}
          </Script>
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        </>
      )}

      {loadGa && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="lazyOnload" />
          <Script id="ga" strategy="lazyOnload">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
            gtag('js',new Date());gtag('config','${gaId}');`}
          </Script>
        </>
      )}

      {/* Meta Pixel + PageView — dedicated module (no duplicate fbq init here) */}
      <FacebookPixelScript />

      {/* TikTok Pixel + PageView — runtime env via /api/tiktok/pixel */}
      <TikTokPixelScript />
    </>
  );
}

/**
 * Generic multi-pixel helper for GTM / TikTok.
 * Prefer `@/lib/facebook/events` (fbViewContent, fbPurchase, …) for Meta so
 * event_id deduplication and CAPI mirroring stay correct.
 */
export function trackEvent(event: string, data?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = window as any;
  w.dataLayer?.push({ event, ...data });
  // Meta ecommerce events are owned by lib/facebook — skip fbq here to avoid duplicates
  w.ttq?.track(event, data);
}
