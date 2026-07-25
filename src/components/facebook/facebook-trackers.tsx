/**
 * Client trackers for product / checkout / thank-you surfaces.
 * Dedupes within the session so React Strict Mode / remounts do not double-fire.
 */

"use client";

import { useEffect, useRef } from "react";
import {
  fbAddToCart,
  fbInitiateCheckout,
  fbLead,
  fbPageView,
  fbViewContent,
} from "@/lib/facebook/events";

const fired = new Set<string>();

function once(key: string, run: () => void) {
  if (typeof window === "undefined") return;
  const storageKey = `fb_once_${key}`;
  try {
    if (sessionStorage.getItem(storageKey)) return;
    sessionStorage.setItem(storageKey, "1");
  } catch {
    if (fired.has(key)) return;
    fired.add(key);
  }
  run();
}

/** Product detail — ViewContent (+ optional AddToCart when quantity is chosen). */
export function FacebookProductTracker({
  productId,
  contentName,
  contentCategory,
  value,
  currency = "MAD",
  quantity = 1,
}: {
  productId: string;
  contentName?: string;
  contentCategory?: string;
  value?: number;
  currency?: string;
  quantity?: number;
}) {
  const qtyRef = useRef(quantity);

  useEffect(() => {
    once(`view:${productId}`, () => {
      fbViewContent({
        contentIds: [productId],
        contentName,
        contentCategory,
        value,
        currency,
      });
    });
  }, [productId, contentName, contentCategory, value, currency]);

  useEffect(() => {
    if (quantity === qtyRef.current) return;
    qtyRef.current = quantity;
    // Quantity change on a COD PDP ≈ add / update cart intent
    fbAddToCart({
      contentIds: [productId],
      contentName,
      value: value != null ? value * quantity : undefined,
      currency,
      quantity,
    });
  }, [quantity, productId, contentName, value, currency]);

  return null;
}

/** Fires InitiateCheckout once when the COD order form mounts / is focused. */
export function FacebookCheckoutTracker({
  productId,
  value,
  currency = "MAD",
  numItems = 1,
}: {
  productId: string;
  value?: number;
  currency?: string;
  numItems?: number;
}) {
  useEffect(() => {
    once(`checkout:${productId}`, () => {
      fbInitiateCheckout({
        contentIds: [productId],
        value,
        currency,
        numItems,
      });
      // First engagement with checkout also counts as AddToCart for COD funnels
      once(`cart:${productId}`, () => {
        fbAddToCart({
          contentIds: [productId],
          value,
          currency,
          quantity: numItems,
        });
      });
    });
  }, [productId, value, currency, numItems]);

  return null;
}

/** Thank-you page — PageView only (Purchase already fired after order save). */
export function FacebookThankYouTracker({
  orderNumber,
  value,
  contentIds,
  phone,
  firstName,
}: {
  orderNumber?: string;
  value?: number;
  contentIds?: string[];
  phone?: string;
  firstName?: string;
}) {
  useEffect(() => {
    once(`thanks:${orderNumber || "anon"}`, () => {
      fbPageView({
        eventId: orderNumber ? `pageview_thanks_${orderNumber}` : undefined,
      });
      // Lead confirms contact capture without re-sending Purchase
      if (orderNumber) {
        fbLead({
          eventId: `lead_${orderNumber}`,
          contentIds,
          value,
          userData: {
            phone,
            firstName,
            country: "ma",
          },
        });
      }
    });
  }, [orderNumber, value, contentIds, phone, firstName]);

  return null;
}
