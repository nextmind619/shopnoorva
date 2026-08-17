/**
 * First-party UTM / gclid capture for Google & YouTube Ads attribution.
 * Persists across Landing → Product → Cart → Checkout → Order via cookie.
 */

export type MarketingAttribution = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  gclid?: string;
  landingPath?: string;
  capturedAt?: string;
};

const COOKIE_NAME = "nv_attr";
const COOKIE_MAX_AGE_SEC = 90 * 24 * 60 * 60;
const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;

function readCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`));
  return match?.[1] ? decodeURIComponent(match[1]) : undefined;
}

function writeCookie(name: string, value: string): void {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${COOKIE_MAX_AGE_SEC}; SameSite=Lax`;
}

function parseAttribution(raw: string | undefined): MarketingAttribution | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as MarketingAttribution;
    if (!parsed || typeof parsed !== "object") return null;
    return parsed;
  } catch {
    return null;
  }
}

/** Read persisted attribution (browser only). */
export function getStoredAttribution(): MarketingAttribution | null {
  return parseAttribution(readCookie(COOKIE_NAME));
}

/**
 * Capture UTM + gclid from the current URL when present.
 * First-touch wins for campaign fields; gclid is refreshed when a new click arrives.
 */
export function captureMarketingAttribution(): MarketingAttribution | null {
  if (typeof window === "undefined") return null;

  let params: URLSearchParams;
  try {
    params = new URLSearchParams(window.location.search);
  } catch {
    return getStoredAttribution();
  }

  const incoming: MarketingAttribution = {};
  for (const key of UTM_KEYS) {
    const value = params.get(key)?.trim();
    if (value) incoming[key] = value;
  }
  const gclid = params.get("gclid")?.trim();
  if (gclid) incoming.gclid = gclid;

  const hasIncoming = Object.keys(incoming).length > 0;
  if (!hasIncoming) return getStoredAttribution();

  const existing = getStoredAttribution() || {};
  const merged: MarketingAttribution = {
    ...existing,
    ...incoming,
    landingPath: existing.landingPath || `${window.location.pathname}${window.location.search}`,
    capturedAt: existing.capturedAt || new Date().toISOString(),
  };

  try {
    writeCookie(COOKIE_NAME, JSON.stringify(merged));
  } catch {
    /* best-effort */
  }

  return merged;
}

/** Whether attribution looks like Google / YouTube paid or organic Google traffic. */
export function isGoogleAttribution(attr?: MarketingAttribution | null): boolean {
  if (!attr) return false;
  if (attr.gclid) return true;
  const source = (attr.utm_source || "").toLowerCase();
  const medium = (attr.utm_medium || "").toLowerCase();
  if (/google|youtube|adwords|googleads/.test(source)) return true;
  if (source === "yt" || source === "youtu.be") return true;
  if (/cpc|ppc|paid|display|video/.test(medium) && /google|youtube|yt/.test(source)) return true;
  return false;
}

/**
 * Classify platform from stored order attribution (server-safe, no DOM).
 * Returns "google" | other platform keys | null when unknown.
 */
export function platformFromAttribution(
  attr?: MarketingAttribution | null,
): "facebook" | "instagram" | "tiktok" | "google" | null {
  if (!attr) return null;
  if (isGoogleAttribution(attr)) return "google";

  const source = (attr.utm_source || "").toLowerCase();
  const combined = `${source} ${attr.utm_medium || ""} ${attr.utm_campaign || ""}`.toLowerCase();

  if (/fbclid|facebook|fb\.com|meta/.test(combined) || attr.utm_source === "fb") return "facebook";
  if (/instagram|ig/.test(combined)) return "instagram";
  if (/tiktok|ttclid|bytedance/.test(combined)) return "tiktok";
  return null;
}
