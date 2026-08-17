/**
 * Google Analytics 4 / Google Ads environment resolution.
 *
 * Prefers runtime server env (EasyPanel) — NEXT_PUBLIC_* are often empty
 * when Docker builds before those vars exist.
 *
 * NEVER invent Measurement IDs or Conversion Labels — leave empty until configured.
 */

function firstNonEmpty(...values: Array<string | undefined | null>): string {
  for (const value of values) {
    if (value && value.trim()) return value.trim();
  }
  return "";
}

/**
 * GA4 Measurement ID (G-XXXXXXXX).
 * Prefer NEXT_PUBLIC_GA4_MEASUREMENT_ID; keep NEXT_PUBLIC_GA_ID as legacy alias.
 */
export function getGa4MeasurementId(): string {
  return firstNonEmpty(
    process.env.GA4_MEASUREMENT_ID,
    process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID,
    process.env.NEXT_PUBLIC_GA_ID,
  );
}

/** Google Ads Conversion ID (AW-XXXXXXXXXX). */
export function getGoogleAdsId(): string {
  return firstNonEmpty(
    process.env.GOOGLE_ADS_ID,
    process.env.NEXT_PUBLIC_GOOGLE_ADS_ID,
  );
}

/**
 * Google Ads Purchase conversion label (the part after AW-XXX/ in send_to).
 * Combined as: `${getGoogleAdsId()}/${getGoogleAdsConversionLabel()}`
 */
export function getGoogleAdsConversionLabel(): string {
  return firstNonEmpty(
    process.env.GOOGLE_ADS_CONVERSION_LABEL,
    process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL,
  );
}

/** Optional Customer ID for future Ads API / admin linking — not used for browser tags. */
export function getGoogleAdsCustomerId(): string {
  return firstNonEmpty(
    process.env.GOOGLE_ADS_CUSTOMER_ID,
    process.env.NEXT_PUBLIC_GOOGLE_ADS_CUSTOMER_ID,
  );
}

/** Google Tag Manager container ID (GTM-XXXX). Kept separate from GA4. */
export function getGtmId(): string {
  return firstNonEmpty(
    process.env.GTM_ID,
    process.env.NEXT_PUBLIC_GTM_ID,
  );
}

export function isGa4Configured(): boolean {
  return Boolean(getGa4MeasurementId());
}

export function isGoogleAdsConversionConfigured(): boolean {
  return Boolean(getGoogleAdsId() && getGoogleAdsConversionLabel());
}

export function isGtmConfigured(): boolean {
  return Boolean(getGtmId());
}

/** Full send_to for gtag conversion events, or empty if not configured. */
export function getGoogleAdsSendTo(): string {
  const id = getGoogleAdsId();
  const label = getGoogleAdsConversionLabel();
  if (!id || !label) return "";
  return `${id}/${label}`;
}

export const GOOGLE_DEFAULT_CURRENCY = "MAD";

/** Debug logs in development only (never log PII in production). */
export function isGoogleAnalyticsDebug(): boolean {
  return process.env.NODE_ENV === "development";
}
