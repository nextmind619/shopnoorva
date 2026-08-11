import {
  getTikTokAccessToken,
  getTikTokPixelId,
  getTikTokTestEventCode,
  isTikTokEventsApiConfigured,
} from "@/lib/tiktok/config";
import { logIntegration } from "./logger";

export async function sendTikTokEvent(event: {
  event: "CompletePayment" | "AddToCart" | "InitiateCheckout" | "ViewContent" | "SubmitForm";
  eventId: string;
  value?: number;
  currency?: string;
  contentIds?: string[];
  orderId?: string;
  clientIpAddress?: string;
  clientUserAgent?: string;
  eventSourceUrl?: string;
  ttclid?: string;
}): Promise<void> {
  if (!isTikTokEventsApiConfigured()) {
    await logIntegration("tiktok", event.event, "ok", event, { dryRun: true });
    return;
  }

  const testEventCode = getTikTokTestEventCode();

  try {
    const res = await fetch("https://business-api.tiktok.com/open_api/v1.3/event/track/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Token": getTikTokAccessToken(),
      },
      body: JSON.stringify({
        pixel_code: getTikTokPixelId(),
        event: event.event,
        event_id: event.eventId,
        timestamp: new Date().toISOString(),
        ...(testEventCode ? { test_event_code: testEventCode } : {}),
        context: {
          ip: event.clientIpAddress,
          user_agent: event.clientUserAgent,
          page: event.eventSourceUrl ? { url: event.eventSourceUrl } : undefined,
          ad: event.ttclid ? { callback: event.ttclid } : undefined,
        },
        properties: {
          currency: event.currency || "MAD",
          value: event.value,
          order_id: event.orderId,
          contents: event.contentIds?.map((id) => ({
            content_id: id,
            content_type: "product",
          })),
        },
      }),
    });
    const data = await res.json().catch(() => ({}));
    await logIntegration("tiktok", event.event, res.ok ? "ok" : "error", event, data);
  } catch (error) {
    await logIntegration("tiktok", event.event, "error", event, {
      error: error instanceof Error ? error.message : "tiktok_failed",
    });
  }
}
