/**
 * Meta Pixel bootstrap (latest fbevents.js).
 * Loads after hydration so it does not compete with LCP.
 * PageView fires once here; SPA helpers use fbPageView() for later navigations.
 */

import Script from "next/script";
import { getFacebookPixelId } from "@/lib/facebook/config";

export function FacebookPixelScript() {
  const pixelId = getFacebookPixelId();
  if (!pixelId) return null;

  // Inline bootstrap matches Meta's official snippet (pixel version 2.0).
  // Advanced matching for COD is applied per-event via CAPI + optional init upgrades.
  return (
    <Script id="facebook-pixel" strategy="afterInteractive">
      {`
!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(s)[0];s.parentNode.insertBefore(t,s)}(window,
document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init','${pixelId}');
fbq('track','PageView');
`}
    </Script>
  );
}
