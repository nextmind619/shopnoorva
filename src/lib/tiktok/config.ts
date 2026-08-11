/**
 * TikTok Pixel / Events API environment resolution.
 *
 * Prefers runtime server env (EasyPanel) — NEXT_PUBLIC_* are often empty
 * when Docker builds before those vars exist.
 *
 * NEVER expose TIKTOK_ACCESS_TOKEN to the client.
 */

function firstNonEmpty(...values: Array<string | undefined | null>): string {
  for (const value of values) {
    if (value && value.trim()) return value.trim();
  }
  return "";
}

/** Public Pixel ID (safe for the browser). */
export function getTikTokPixelId(): string {
  return firstNonEmpty(
    process.env.TIKTOK_PIXEL_ID,
    process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID,
  );
}

/** Server-only access token for Events API. */
export function getTikTokAccessToken(): string {
  return firstNonEmpty(process.env.TIKTOK_ACCESS_TOKEN);
}

/** Optional Events Manager test code (server-only). */
export function getTikTokTestEventCode(): string {
  return firstNonEmpty(process.env.TIKTOK_TEST_EVENT_CODE);
}

export function isTikTokPixelConfigured(): boolean {
  return Boolean(getTikTokPixelId());
}

export function isTikTokEventsApiConfigured(): boolean {
  return Boolean(getTikTokPixelId() && getTikTokAccessToken());
}

export const TIKTOK_DEFAULT_CURRENCY = "MAD";
