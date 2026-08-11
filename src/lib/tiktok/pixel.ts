/**
 * TikTok Pixel (browser) helpers.
 * Safe to import from Client Components — guards every window access.
 */

import type { TikTokEventProperties } from "./types";

declare global {
  interface Window {
    ttq?: {
      page: () => void;
      track: (
        event: string,
        data?: Record<string, unknown>,
        options?: { event_id?: string },
      ) => void;
      load: (pixelId: string, options?: Record<string, unknown>) => void;
    };
  }
}

export function generateEventId(prefix = "tt"): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `${prefix}_${crypto.randomUUID()}`;
  }
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

/** Read TikTok click id from URL (?ttclid=) for ad attribution. */
export function getTtclid(): string | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    return new URLSearchParams(window.location.search).get("ttclid") || undefined;
  } catch {
    return undefined;
  }
}

export function getEventSourceUrl(): string | undefined {
  if (typeof window === "undefined") return undefined;
  return window.location.href;
}

function hasTtq(): boolean {
  return typeof window !== "undefined" && typeof window.ttq?.track === "function";
}

export function trackTikTokEvent(
  eventName: string,
  properties?: TikTokEventProperties,
  eventId?: string,
): string {
  const id = eventId || generateEventId(eventName.toLowerCase());

  if (!hasTtq()) return id;

  const payload =
    properties && Object.keys(properties).length > 0
      ? (properties as Record<string, unknown>)
      : undefined;

  if (payload) {
    window.ttq!.track(eventName, payload, { event_id: id });
  } else {
    window.ttq!.track(eventName, {}, { event_id: id });
  }

  return id;
}
