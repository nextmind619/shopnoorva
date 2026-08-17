/**
 * High-level Google / GA4 / Google Ads event helpers for the storefront.
 *
 * Purchase MUST only be called after a successful order create.
 * Dedupes by transaction_id (order number) across refresh / thank-you revisits.
 */

import { GOOGLE_DEFAULT_CURRENCY } from "./config";
import {
  type GtagItem,
  hasPurchaseBeenTracked,
  markPurchaseTracked,
  pushAdsConversion,
  pushGaEvent,
} from "./gtag";

export type GaItemInput = {
  itemId: string;
  itemName: string;
  price: number;
  quantity?: number;
  currency?: string;
};

function toGtagItem(item: GaItemInput): GtagItem {
  return {
    item_id: item.itemId,
    item_name: item.itemName,
    price: item.price,
    quantity: item.quantity ?? 1,
    currency: item.currency || GOOGLE_DEFAULT_CURRENCY,
  };
}

/** Product detail — GA4 view_item */
export function trackViewItem(input: GaItemInput): void {
  const currency = input.currency || GOOGLE_DEFAULT_CURRENCY;
  const quantity = input.quantity ?? 1;
  pushGaEvent("view_item", {
    currency,
    value: input.price * quantity,
    items: [toGtagItem({ ...input, quantity, currency })],
  });
}

/** Add to cart — GA4 add_to_cart */
export function trackAddToCart(input: GaItemInput & { value?: number }): void {
  const currency = input.currency || GOOGLE_DEFAULT_CURRENCY;
  const quantity = input.quantity ?? 1;
  const value = input.value ?? input.price * quantity;
  pushGaEvent("add_to_cart", {
    currency,
    value,
    items: [toGtagItem({ ...input, quantity, currency })],
  });
}

/** Start checkout (COD form mount) — GA4 begin_checkout. NOT a purchase. */
export function trackBeginCheckout(input: {
  items: GaItemInput[];
  value: number;
  currency?: string;
}): void {
  const currency = input.currency || GOOGLE_DEFAULT_CURRENCY;
  pushGaEvent("begin_checkout", {
    currency,
    value: input.value,
    items: input.items.map((item) => toGtagItem({ ...item, currency })),
  });
}

export type TrackPurchaseInput = {
  /** Real order number — used as transaction_id and for dedupe */
  transactionId: string;
  value: number;
  currency?: string;
  items: GaItemInput[];
  /** Google Ads send_to (AW-XXX/label). Empty = skip Ads conversion. */
  adsSendTo?: string;
  /** Optional Enhanced Conversions — only real checkout values */
  email?: string;
  phone?: string;
};

/**
 * Prepare Enhanced Conversions user_data when email/phone exist.
 * Prefer setting before the conversion event. gtag hashes unhashed values.
 */
function setEnhancedConversionsUserData(input: {
  email?: string;
  phone?: string;
}): void {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;

  const userData: Record<string, string> = {};
  if (input.email?.trim()) {
    userData.email = input.email.trim().toLowerCase();
  }
  if (input.phone?.trim()) {
    // Keep digits / leading + for E.164-style phone
    userData.phone_number = input.phone.replace(/[^\d+]/g, "");
  }
  if (Object.keys(userData).length === 0) return;

  try {
    window.gtag("set", "user_data", userData);
  } catch {
    /* best-effort */
  }
}

/**
 * Purchase — call ONLY after order is saved successfully.
 * Fires GA4 `purchase` + optional Google Ads `conversion`.
 * Safe to call again: duplicate transaction_id is ignored.
 */
export function trackPurchase(input: TrackPurchaseInput): boolean {
  const transactionId = input.transactionId?.trim();
  if (!transactionId) return false;

  if (hasPurchaseBeenTracked(transactionId)) {
    if (process.env.NODE_ENV === "development") {
      console.info("[Analytics] purchase skipped (duplicate)", transactionId);
    }
    return false;
  }

  const currency = input.currency || GOOGLE_DEFAULT_CURRENCY;
  const items = input.items.map((item) => toGtagItem({ ...item, currency }));

  // Enhanced Conversions before conversion / purchase events
  setEnhancedConversionsUserData({
    email: input.email,
    phone: input.phone,
  });

  pushGaEvent("purchase", {
    transaction_id: transactionId,
    value: input.value,
    currency,
    items,
  });

  if (input.adsSendTo) {
    pushAdsConversion({
      sendTo: input.adsSendTo,
      value: input.value,
      currency,
      transactionId,
    });
  }

  markPurchaseTracked(transactionId);
  return true;
}

export {
  captureMarketingAttribution,
  getStoredAttribution,
  isGoogleAttribution,
} from "./attribution";
