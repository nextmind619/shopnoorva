/**
 * Google Consent Mode v2 helpers.
 *
 * The storefront currently has no CMP / cookie banner — pixels load like Meta/TikTok.
 * These helpers let you wire a consent UI later without rewriting gtag bootstrap.
 *
 * Call `setGoogleConsentDefaults()` BEFORE gtag/js loads when a CMP exists.
 * Call `updateGoogleConsent(...)` after the user grants/denies.
 */

import { ensureDataLayer, installGtagStub } from "./gtag";

export type GoogleConsentState = "granted" | "denied";

export type GoogleConsentSettings = {
  ad_storage?: GoogleConsentState;
  ad_user_data?: GoogleConsentState;
  ad_personalization?: GoogleConsentState;
  analytics_storage?: GoogleConsentState;
};

const DEFAULT_GRANTED: Required<GoogleConsentSettings> = {
  ad_storage: "granted",
  ad_user_data: "granted",
  ad_personalization: "granted",
  analytics_storage: "granted",
};

/**
 * Set Consent Mode v2 defaults. Safe no-op on server.
 * When no CMP is present, defaults stay granted to match current unconditional tracking.
 */
export function setGoogleConsentDefaults(
  settings: GoogleConsentSettings = DEFAULT_GRANTED,
): void {
  if (typeof window === "undefined") return;
  installGtagStub();
  ensureDataLayer();
  window.gtag?.("consent", "default", {
    ad_storage: settings.ad_storage ?? "granted",
    ad_user_data: settings.ad_user_data ?? "granted",
    ad_personalization: settings.ad_personalization ?? "granted",
    analytics_storage: settings.analytics_storage ?? "granted",
    wait_for_update: 500,
  });
}

/** Update consent after user interaction with a CMP. */
export function updateGoogleConsent(settings: GoogleConsentSettings): void {
  if (typeof window === "undefined") return;
  installGtagStub();
  window.gtag?.("consent", "update", settings);
}
