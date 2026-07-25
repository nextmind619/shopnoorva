/**
 * Facebook / Meta environment resolution.
 *
 * Prefers the new env names from the integration brief, with fallbacks to
 * legacy names already used in this codebase so production keeps working.
 *
 * NEVER expose FACEBOOK_ACCESS_TOKEN / META_ACCESS_TOKEN to the client.
 */

function firstNonEmpty(...values: Array<string | undefined | null>): string {
  for (const value of values) {
    if (value && value.trim()) return value.trim();
  }
  return "";
}

/** Public Pixel / Dataset ID (safe for the browser). */
export function getFacebookPixelId(): string {
  return firstNonEmpty(
    process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID,
    process.env.NEXT_PUBLIC_FB_PIXEL_ID,
    // Dataset ID can equal Pixel ID for web events
    process.env.FACEBOOK_DATASET_ID,
  );
}

/** Dataset ID for CAPI (defaults to Pixel ID). */
export function getFacebookDatasetId(): string {
  return firstNonEmpty(process.env.FACEBOOK_DATASET_ID, getFacebookPixelId());
}

/**
 * Server-only access token. Call only from Route Handlers / Server Components / Node.
 */
export function getFacebookAccessToken(): string {
  return firstNonEmpty(
    process.env.FACEBOOK_ACCESS_TOKEN,
    process.env.META_ACCESS_TOKEN,
  );
}

/** Optional Events Manager test code (server-only). */
export function getFacebookTestEventCode(): string {
  return firstNonEmpty(process.env.FACEBOOK_TEST_EVENT_CODE);
}

export function isFacebookPixelConfigured(): boolean {
  return Boolean(getFacebookPixelId());
}

export function isFacebookCapiConfigured(): boolean {
  return Boolean(getFacebookDatasetId() && getFacebookAccessToken());
}

/** Graph API version used by Conversions API (keep current with Meta docs). */
export const FACEBOOK_GRAPH_API_VERSION = "v25.0";

export const FACEBOOK_DEFAULT_CURRENCY = "MAD";
export const FACEBOOK_DEFAULT_COUNTRY = "ma";
