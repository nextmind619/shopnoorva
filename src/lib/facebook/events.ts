/**
 * High-level Meta event helpers used across the storefront.
 *
 * Browser: fires Pixel with `eventID`.
 * Server mirror: POSTs to `/api/facebook/conversions` (token never leaves the server).
 *
 * Purchase is special: call `fbPurchase` in the browser AFTER the order is saved,
 * and send CAPI from the order pipeline with the SAME `eventId` (order number)
 * so Meta deduplicates the redundant setup.
 */

import { FACEBOOK_DEFAULT_CURRENCY } from "./config";
import {
  generateEventId,
  getEventSourceUrl,
  getFbc,
  getFbp,
  getReferrerUrl,
  trackPixelEvent,
} from "./pixel";
import type {
  FacebookCustomData,
  FacebookStandardEvent,
  FacebookUserDataInput,
} from "./types";

export type FbTrackOptions = {
  /** Force a specific event id (required for Purchase dedup with CAPI). */
  eventId?: string;
  customData?: FacebookCustomData;
  userData?: FacebookUserDataInput;
  /** When false, skip the server mirror (e.g. Purchase handled by orchestrator). */
  sendToServer?: boolean;
  eventSourceUrl?: string;
  referrerUrl?: string;
};

type ClientCapiBody = {
  eventName: FacebookStandardEvent;
  eventId: string;
  eventSourceUrl?: string;
  referrerUrl?: string;
  customData?: FacebookCustomData;
  userData?: FacebookUserDataInput;
};

/**
 * Mirror a browser event to CAPI via our API route.
 * Fire-and-forget; failures must never break checkout UX.
 */
async function mirrorToCapi(body: ClientCapiBody): Promise<void> {
  if (typeof window === "undefined") return;
  try {
    await fetch("/api/facebook/conversions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      keepalive: true,
    });
  } catch {
    /* best-effort — Pixel already captured the event */
  }
}

function withBrowserCookies(userData?: FacebookUserDataInput): FacebookUserDataInput {
  return {
    ...userData,
    fbp: userData?.fbp || getFbp(),
    fbc: userData?.fbc || getFbc(),
  };
}

function trackDual(eventName: FacebookStandardEvent, options: FbTrackOptions = {}): string {
  const eventId = options.eventId || generateEventId(eventName.toLowerCase());

  // Always attempt Pixel — no-ops until runtime bootstrap attaches window.fbq
  trackPixelEvent(eventName, options.customData, eventId);

  if (options.sendToServer !== false) {
    void mirrorToCapi({
      eventName,
      eventId,
      eventSourceUrl: options.eventSourceUrl || getEventSourceUrl(),
      referrerUrl: options.referrerUrl || getReferrerUrl(),
      customData: options.customData,
      userData: withBrowserCookies(options.userData),
    });
  }

  return eventId;
}

/** 1) PageView — usually also fired once on Pixel init; use this for SPA navigations. */
export function fbPageView(options: FbTrackOptions = {}): string {
  return trackDual("PageView", options);
}

/** 2) ViewContent — product detail pages. */
export function fbViewContent(input: {
  contentIds: string[];
  contentName?: string;
  contentCategory?: string;
  value?: number;
  currency?: string;
  eventId?: string;
  userData?: FacebookUserDataInput;
}): string {
  return trackDual("ViewContent", {
    eventId: input.eventId,
    userData: input.userData,
    customData: {
      content_ids: input.contentIds,
      content_type: "product",
      content_name: input.contentName,
      content_category: input.contentCategory,
      value: input.value,
      currency: input.currency || FACEBOOK_DEFAULT_CURRENCY,
    },
  });
}

/** 3) AddToCart — quantity / CTA toward COD order form. */
export function fbAddToCart(input: {
  contentIds: string[];
  contentName?: string;
  value?: number;
  currency?: string;
  quantity?: number;
  eventId?: string;
  userData?: FacebookUserDataInput;
}): string {
  const qty = input.quantity ?? 1;
  return trackDual("AddToCart", {
    eventId: input.eventId,
    userData: input.userData,
    customData: {
      content_ids: input.contentIds,
      content_type: "product",
      content_name: input.contentName,
      value: input.value,
      currency: input.currency || FACEBOOK_DEFAULT_CURRENCY,
      contents: input.contentIds.map((id) => ({
        id,
        quantity: qty,
        item_price: input.value,
      })),
      num_items: qty,
    },
  });
}

/** 4) InitiateCheckout — customer starts the COD form. */
export function fbInitiateCheckout(input: {
  contentIds: string[];
  value?: number;
  currency?: string;
  numItems?: number;
  eventId?: string;
  userData?: FacebookUserDataInput;
}): string {
  return trackDual("InitiateCheckout", {
    eventId: input.eventId,
    userData: input.userData,
    customData: {
      content_ids: input.contentIds,
      content_type: "product",
      value: input.value,
      currency: input.currency || FACEBOOK_DEFAULT_CURRENCY,
      num_items: input.numItems ?? 1,
      payment_method: "cod",
    },
  });
}

/**
 * 5) Purchase — call ONLY after the order is saved successfully.
 * `sendToServer` defaults to false: CAPI Purchase is sent from the order pipeline
 * with the same eventId to avoid double server events.
 */
export function fbPurchase(input: {
  eventId: string;
  contentIds: string[];
  value: number;
  currency?: string;
  orderId?: string;
  numItems?: number;
  userData?: FacebookUserDataInput;
  /** Override only for tooling; production relies on orchestrator CAPI. */
  sendToServer?: boolean;
}): string {
  return trackDual("Purchase", {
    eventId: input.eventId,
    sendToServer: input.sendToServer ?? false,
    userData: input.userData,
    customData: {
      content_ids: input.contentIds,
      content_type: "product",
      value: input.value,
      currency: input.currency || FACEBOOK_DEFAULT_CURRENCY,
      order_id: input.orderId || input.eventId,
      num_items: input.numItems ?? 1,
      payment_method: "cod",
      contents: input.contentIds.map((id) => ({
        id,
        quantity: input.numItems ?? 1,
        item_price: input.value,
      })),
    },
  });
}

/** 6) Lead — contact details captured (COD form success). */
export function fbLead(input: {
  contentIds?: string[];
  value?: number;
  currency?: string;
  eventId?: string;
  userData?: FacebookUserDataInput;
}): string {
  return trackDual("Lead", {
    eventId: input.eventId,
    userData: input.userData,
    customData: {
      content_ids: input.contentIds,
      content_type: "product",
      value: input.value,
      currency: input.currency || FACEBOOK_DEFAULT_CURRENCY,
      payment_method: "cod",
    },
  });
}

/** 7) Contact — WhatsApp / support click. */
export function fbContact(input: {
  eventId?: string;
  userData?: FacebookUserDataInput;
  contentName?: string;
} = {}): string {
  return trackDual("Contact", {
    eventId: input.eventId,
    userData: input.userData,
    customData: {
      content_name: input.contentName || "whatsapp",
    },
  });
}

/** Browser cookies to attach on the order POST for server CAPI matching. */
export function getFacebookClickIds(): { fbp?: string; fbc?: string } {
  return { fbp: getFbp(), fbc: getFbc() };
}

export { generateEventId, getFbp, getFbc, getEventSourceUrl, getReferrerUrl };
