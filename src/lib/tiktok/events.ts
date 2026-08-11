/**
 * High-level TikTok event helpers for the storefront.
 *
 * Browser: fires Pixel via ttq.track with event_id.
 * Server mirror: sendTikTokEvent from the order pipeline with the SAME event_id
 * so TikTok deduplicates Pixel + Events API.
 */

import { TIKTOK_DEFAULT_CURRENCY } from "./config";
import { generateEventId, trackTikTokEvent } from "./pixel";
import type { TikTokEventProperties } from "./types";

function productContents(input: {
  contentIds: string[];
  contentName?: string;
  quantity?: number;
  value?: number;
}) {
  const qty = input.quantity ?? 1;
  const unitPrice =
    input.value != null && qty > 0 ? input.value / qty : input.value;

  return input.contentIds.map((id) => ({
    content_id: id,
    content_type: "product" as const,
    content_name: input.contentName,
    quantity: qty,
    price: unitPrice,
  }));
}

/** Product detail pages. */
export function ttViewContent(input: {
  contentIds: string[];
  contentName?: string;
  value?: number;
  currency?: string;
  eventId?: string;
}): string {
  return trackTikTokEvent(
    "ViewContent",
    {
      contents: productContents(input),
      value: input.value,
      currency: input.currency || TIKTOK_DEFAULT_CURRENCY,
    },
    input.eventId,
  );
}

/** Quantity / CTA toward COD order form. */
export function ttAddToCart(input: {
  contentIds: string[];
  contentName?: string;
  value?: number;
  currency?: string;
  quantity?: number;
  eventId?: string;
}): string {
  return trackTikTokEvent(
    "AddToCart",
    {
      contents: productContents(input),
      value: input.value,
      currency: input.currency || TIKTOK_DEFAULT_CURRENCY,
    },
    input.eventId,
  );
}

/** Customer starts the COD form. */
export function ttInitiateCheckout(input: {
  contentIds: string[];
  value?: number;
  currency?: string;
  numItems?: number;
  eventId?: string;
}): string {
  return trackTikTokEvent(
    "InitiateCheckout",
    {
      contents: productContents({
        ...input,
        quantity: input.numItems ?? 1,
      }),
      value: input.value,
      currency: input.currency || TIKTOK_DEFAULT_CURRENCY,
    },
    input.eventId,
  );
}

/**
 * Call ONLY after the order is saved successfully.
 * Server CompletePayment uses the same eventId for deduplication.
 */
export function ttCompletePayment(input: {
  eventId: string;
  contentIds: string[];
  value: number;
  currency?: string;
  orderId?: string;
  numItems?: number;
  eventIdOverride?: never;
}): string {
  const properties: TikTokEventProperties = {
    contents: productContents({
      contentIds: input.contentIds,
      quantity: input.numItems ?? 1,
      value: input.value,
    }),
    value: input.value,
    currency: input.currency || TIKTOK_DEFAULT_CURRENCY,
    order_id: input.orderId || input.eventId,
  };

  return trackTikTokEvent("CompletePayment", properties, input.eventId);
}

/** Contact details captured on thank-you (COD lead). */
export function ttSubmitForm(input: {
  contentIds?: string[];
  value?: number;
  currency?: string;
  eventId?: string;
}): string {
  return trackTikTokEvent(
    "SubmitForm",
    {
      contents: input.contentIds
        ? productContents({ contentIds: input.contentIds, value: input.value })
        : undefined,
      value: input.value,
      currency: input.currency || TIKTOK_DEFAULT_CURRENCY,
    },
    input.eventId || generateEventId("submitform"),
  );
}

export { generateEventId, getTtclid, getEventSourceUrl } from "./pixel";
