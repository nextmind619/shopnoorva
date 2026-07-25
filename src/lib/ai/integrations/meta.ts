/**
 * Legacy AI integration wrapper — delegates to the professional CAPI module.
 * Keeps orchestrator imports stable while guaranteeing SHA-256 hashing,
 * event_id dedup, IP/UA/fbp/fbc, and Graph API v25.
 */

import { logIntegration } from "./logger";
import { sendFacebookConversion } from "@/lib/facebook/conversions";
import type { FacebookStandardEvent } from "@/lib/facebook/types";

export async function sendMetaConversion(event: {
  eventName: "Purchase" | "AddToCart" | "InitiateCheckout" | "Lead" | "Contact" | "ViewContent" | "PageView";
  eventId?: string;
  value?: number;
  currency?: string;
  contentIds?: string[];
  orderId?: string;
  phone?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  city?: string;
  state?: string;
  country?: string;
  clientIpAddress?: string;
  clientUserAgent?: string;
  fbp?: string;
  fbc?: string;
  eventSourceUrl?: string;
  referrerUrl?: string;
}): Promise<void> {
  const eventId =
    event.eventId ||
    (event.orderId ? `purchase_${event.orderId}` : `meta_${event.eventName}_${Date.now()}`);

  try {
    const result = await sendFacebookConversion({
      eventName: event.eventName as FacebookStandardEvent,
      eventId,
      eventSourceUrl: event.eventSourceUrl,
      referrerUrl: event.referrerUrl,
      customData: {
        value: event.value,
        currency: event.currency || "MAD",
        content_ids: event.contentIds,
        content_type: "product",
        order_id: event.orderId,
        payment_method: "cod",
      },
      userData: {
        phone: event.phone,
        email: event.email,
        firstName: event.firstName,
        lastName: event.lastName,
        city: event.city,
        state: event.state,
        country: event.country || "ma",
        clientIpAddress: event.clientIpAddress,
        clientUserAgent: event.clientUserAgent,
        fbp: event.fbp,
        fbc: event.fbc,
        externalId: event.phone || event.email,
      },
    });

    await logIntegration(
      "meta",
      event.eventName,
      result.ok ? "ok" : "error",
      { ...event, eventId },
      result,
    );
  } catch (error) {
    await logIntegration("meta", event.eventName, "error", event, {
      error: error instanceof Error ? error.message : "meta_failed",
    });
  }
}
