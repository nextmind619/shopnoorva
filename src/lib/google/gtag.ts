/**
 * Low-level gtag / dataLayer helpers (browser only).
 */

import { isGoogleAnalyticsDebug } from "./config";

export type GtagItem = {
  item_id: string;
  item_name: string;
  price?: number;
  quantity?: number;
  currency?: string;
};

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function ensureDataLayer(): void {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
}

/** Install gtag stub so events can queue before gtag/js loads. */
export function installGtagStub(): void {
  if (typeof window === "undefined") return;
  ensureDataLayer();
  if (typeof window.gtag === "function") return;
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer!.push(args);
  };
}

export function hasGtag(): boolean {
  return typeof window !== "undefined" && typeof window.gtag === "function";
}

export function debugAnalytics(event: string, payload?: Record<string, unknown>): void {
  if (!isGoogleAnalyticsDebug() || typeof console === "undefined") return;
  // Never log email/phone — strip enhanced conversion fields
  const safe = payload
    ? Object.fromEntries(
        Object.entries(payload).filter(
          ([k]) => !/email|phone|user_data|sha256/i.test(k),
        ),
      )
    : undefined;
  console.info(`[Analytics] ${event}`, safe ?? "");
}

/**
 * Fire a GA4 event via gtag + mirror to dataLayer for GTM.
 */
export function pushGaEvent(eventName: string, params?: Record<string, unknown>): void {
  if (typeof window === "undefined") return;
  ensureDataLayer();

  const payload = { ...(params || {}) };
  debugAnalytics(eventName, payload);

  window.dataLayer!.push({ event: eventName, ...payload });

  if (hasGtag()) {
    window.gtag!("event", eventName, payload);
  }
}

/** Configure a measurement / ads ID (call after gtag/js loads). */
export function gtagConfig(targetId: string, config?: Record<string, unknown>): void {
  if (!hasGtag() || !targetId) return;
  window.gtag!("config", targetId, config || {});
}

/**
 * Google Ads conversion event (Purchase).
 * Requires AW-ID + conversion label configured; no-ops otherwise.
 */
export function pushAdsConversion(input: {
  sendTo: string;
  value: number;
  currency: string;
  transactionId: string;
}): void {
  if (!input.sendTo || !hasGtag()) return;
  const params = {
    send_to: input.sendTo,
    value: input.value,
    currency: input.currency,
    transaction_id: input.transactionId,
  };
  debugAnalytics("conversion", params);
  window.gtag!("event", "conversion", params);
}

const PURCHASE_PREFIX = "ga_purchase_";

/** Returns true if this transaction_id already fired a purchase (dedupe). */
export function hasPurchaseBeenTracked(transactionId: string): boolean {
  if (typeof window === "undefined" || !transactionId) return false;
  const key = `${PURCHASE_PREFIX}${transactionId}`;
  try {
    if (sessionStorage.getItem(key)) return true;
    if (localStorage.getItem(key)) return true;
  } catch {
    /* ignore */
  }
  return false;
}

/** Mark purchase as sent so refresh / thank-you revisit cannot double-count. */
export function markPurchaseTracked(transactionId: string): void {
  if (typeof window === "undefined" || !transactionId) return;
  const key = `${PURCHASE_PREFIX}${transactionId}`;
  try {
    sessionStorage.setItem(key, "1");
    localStorage.setItem(key, "1");
  } catch {
    /* ignore */
  }
}

/**
 * SHA-256 hex digest for Enhanced Conversions (browser SubtleCrypto).
 * Returns undefined if hashing is unavailable.
 */
export async function sha256Hex(value: string): Promise<string | undefined> {
  const normalized = value.trim().toLowerCase();
  if (!normalized) return undefined;
  if (typeof crypto === "undefined" || !crypto.subtle) return undefined;
  try {
    const data = new TextEncoder().encode(normalized);
    const hash = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(hash))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  } catch {
    return undefined;
  }
}
