/**
 * Meta Pixel (browser) helpers.
 * Safe to import from Client Components — guards every window/document access.
 *
 * Pixel snippet version follows Meta's current fbevents.js bootstrap (n.version='2.0').
 * Always pass the same `eventId` to the browser and CAPI for deduplication.
 */

import type { FacebookCustomData, FacebookStandardEvent } from "./types";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbq?: (...args: unknown[]) => void;
  }
}

/** Cryptographically strong-ish unique id for browser ↔ server event matching. */
export function generateEventId(prefix = "fb"): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `${prefix}_${crypto.randomUUID()}`;
  }
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

/** Read Meta `_fbp` cookie (browser id). */
export function getFbp(): string | undefined {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie.match(/(?:^|;\s*)_fbp=([^;]+)/);
  return match?.[1] ? decodeURIComponent(match[1]) : undefined;
}

/**
 * Read Meta `_fbc` cookie, or synthesize from `fbclid` query param when present.
 * Format: fb.1.<timestamp>.<fbclid>
 */
export function getFbc(): string | undefined {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie.match(/(?:^|;\s*)_fbc=([^;]+)/);
  if (match?.[1]) return decodeURIComponent(match[1]);

  try {
    const fbclid = new URLSearchParams(window.location.search).get("fbclid");
    if (fbclid) {
      const value = `fb.1.${Date.now()}.${fbclid}`;
      // Persist so subsequent CAPI calls keep the click id
      document.cookie = `_fbc=${encodeURIComponent(value)}; path=/; max-age=${90 * 24 * 60 * 60}; SameSite=Lax`;
      return value;
    }
  } catch {
    /* ignore */
  }
  return undefined;
}

export function getEventSourceUrl(): string | undefined {
  if (typeof window === "undefined") return undefined;
  return window.location.href;
}

export function getReferrerUrl(): string | undefined {
  if (typeof document === "undefined") return undefined;
  return document.referrer || undefined;
}

function hasFbq(): boolean {
  return typeof window !== "undefined" && typeof window.fbq === "function";
}

/**
 * Fire a standard Pixel event with optional eventID (4th fbq argument).
 * Meta uses eventID + event name to dedupe against CAPI event_id + event_name.
 */
export function trackPixelEvent(
  eventName: FacebookStandardEvent,
  customData?: FacebookCustomData,
  eventId?: string,
): string {
  const id = eventId || generateEventId(eventName.toLowerCase());

  if (!hasFbq()) return id;

  const payload = customData && Object.keys(customData).length > 0 ? customData : undefined;
  if (payload) {
    window.fbq!("track", eventName, payload, { eventID: id });
  } else {
    window.fbq!("track", eventName, {}, { eventID: id });
  }

  return id;
}

/** Advanced Matching init data (Meta hashes plain values in the browser). */
export type PixelAdvancedMatching = {
  em?: string;
  ph?: string;
  fn?: string;
  ln?: string;
  ct?: string;
  st?: string;
  country?: string;
  external_id?: string;
};

export function initPixel(pixelId: string, advancedMatching?: PixelAdvancedMatching): void {
  if (!hasFbq() || !pixelId) return;
  if (advancedMatching && Object.keys(advancedMatching).length > 0) {
    window.fbq!("init", pixelId, advancedMatching);
  } else {
    window.fbq!("init", pixelId);
  }
}
