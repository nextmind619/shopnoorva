/**
 * GA4 + Google Ads gtag bootstrap.
 * Loads IDs at runtime so EasyPanel env works without baking NEXT_PUBLIC_* into Docker.
 * Also captures UTM / gclid on first paint for attribution.
 *
 * GTM stays separate (loaded from AnalyticsScripts when configured).
 * If GTM is present, skip GA4 pageview config here (configure GA4 inside GTM)
 * to avoid double pageviews — ecommerce still pushes to dataLayer for GTM.
 * Google Ads conversion gtag still loads when AW-ID is set.
 */

"use client";

import { useEffect } from "react";
import { captureMarketingAttribution } from "@/lib/google/attribution";
import { setGoogleConsentDefaults } from "@/lib/google/consent";
import { gtagConfig, installGtagStub } from "@/lib/google/gtag";

type GoogleConfigResponse = {
  measurementId?: string | null;
  adsId?: string | null;
  adsSendTo?: string | null;
  gtmId?: string | null;
};

function loadGtagJs(primaryId: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof document === "undefined") {
      resolve();
      return;
    }
    if (document.getElementById("google-gtag-js")) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.id = "google-gtag-js";
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(primaryId)}`;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("gtag load failed"));
    document.head.appendChild(script);
  });
}

export function GoogleAnalyticsScript() {
  installGtagStub();

  useEffect(() => {
    // Persist UTM / gclid as early as possible (even if GA IDs are empty)
    captureMarketingAttribution();

    // Consent Mode v2 defaults (no CMP yet — granted to match Meta/TikTok)
    setGoogleConsentDefaults();

    let cancelled = false;

    async function boot() {
      try {
        const res = await fetch("/api/google/config", { credentials: "same-origin" });
        if (!res.ok || cancelled) return;
        const data = (await res.json()) as GoogleConfigResponse;
        const measurementId = data.measurementId?.trim() || "";
        const adsId = data.adsId?.trim() || "";
        const gtmId = data.gtmId?.trim() || "";
        // With GTM, GA4 page hits belong in the container — still load Ads gtag if needed
        const loadGa4 = Boolean(measurementId) && !gtmId;
        const loadAds = Boolean(adsId);
        if ((!loadGa4 && !loadAds) || cancelled) return;

        const primaryId = loadGa4 ? measurementId : adsId;
        installGtagStub();
        window.gtag?.("js", new Date());

        await loadGtagJs(primaryId);
        if (cancelled) return;

        if (loadGa4) {
          gtagConfig(measurementId, {
            send_page_view: true,
            allow_enhanced_conversions: true,
          });
          document.documentElement.dataset.ga4 = measurementId;
        } else if (measurementId) {
          // Mark configured for debugging without double pageview
          document.documentElement.dataset.ga4 = measurementId;
        }

        if (loadAds) {
          gtagConfig(adsId, { allow_enhanced_conversions: true });
          document.documentElement.dataset.googleAds = adsId;
        }

        if (data.adsSendTo?.trim()) {
          document.documentElement.dataset.googleAdsSendTo = data.adsSendTo.trim();
        }
      } catch {
        /* best-effort */
      }
    }

    void boot();
    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}

/** Read Ads send_to stamped by bootstrap (client only). */
export function getClientAdsSendTo(): string | undefined {
  if (typeof document === "undefined") return undefined;
  return document.documentElement.dataset.googleAdsSendTo || undefined;
}
