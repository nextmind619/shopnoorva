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
import {
  ttAddToCart,
  ttInitiateCheckout,
  ttSubmitForm,
  ttViewContent,
} from "@/lib/tiktok/events";
import {
  trackAddToCart,
  trackBeginCheckout,
  trackViewItem,
} from "@/lib/google/events";

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
      ttViewContent({
        contentIds: [productId],
        contentName,
        value,
        currency,
      });
      if (value != null) {
        trackViewItem({
          itemId: productId,
          itemName: contentName || productId,
          price: value,
          quantity: 1,
          currency,
        });
      }
    });
  }, [productId, contentName, contentCategory, value, currency]);

  useEffect(() => {
    if (quantity === qtyRef.current) return;
    qtyRef.current = quantity;
    // Quantity change on a COD PDP ≈ add / update cart intent
    const cartValue = value != null ? value * quantity : undefined;
    fbAddToCart({
      contentIds: [productId],
      contentName,
      value: cartValue,
      currency,
      quantity,
    });
    ttAddToCart({
      contentIds: [productId],
      contentName,
      value: cartValue,
      currency,
      quantity,
    });
    if (value != null) {
      trackAddToCart({
        itemId: productId,
        itemName: contentName || productId,
        price: value,
        quantity,
        value: cartValue,
        currency,
      });
    }
  }, [quantity, productId, contentName, value, currency]);

  return null;
}

/** Fires InitiateCheckout once when the COD order form mounts / is focused. */
export function FacebookCheckoutTracker({
  productId,
  contentName,
  value,
  currency = "MAD",
  numItems = 1,
}: {
  productId: string;
  contentName?: string;
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
      ttInitiateCheckout({
        contentIds: [productId],
        value,
        currency,
        numItems,
      });
      if (value != null) {
        const unitPrice = numItems > 0 ? value / numItems : value;
        trackBeginCheckout({
          items: [
            {
              itemId: productId,
              itemName: contentName || productId,
              price: unitPrice,
              quantity: numItems,
              currency,
            },
          ],
          value,
          currency,
        });
      }
      // First engagement with checkout also counts as AddToCart for COD funnels
      once(`cart:${productId}`, () => {
        fbAddToCart({
          contentIds: [productId],
          value,
          currency,
          quantity: numItems,
        });
        ttAddToCart({
          contentIds: [productId],
          value,
          currency,
          quantity: numItems,
        });
        if (value != null) {
          const unitPrice = numItems > 0 ? value / numItems : value;
          trackAddToCart({
            itemId: productId,
            itemName: contentName || productId,
            price: unitPrice,
            quantity: numItems,
            value,
            currency,
          });
        }
      });
    });
  }, [productId, contentName, value, currency, numItems]);

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
        ttSubmitForm({
          eventId: `lead_${orderNumber}`,
          contentIds,
          value,
        });
      }
    });
  }, [orderNumber, value, contentIds, phone, firstName]);

  return null;
}
