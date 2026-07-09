import { aiConfig, isConfigured } from "../config";
import { logIntegration } from "./logger";

export async function sendTikTokEvent(event: {
  event: "CompletePayment" | "AddToCart" | "InitiateCheckout";
  value?: number;
  currency?: string;
  contentIds?: string[];
}): Promise<void> {
  if (!isConfigured(aiConfig.tiktok.accessToken) || !isConfigured(aiConfig.tiktok.pixelId)) {
    await logIntegration("tiktok", event.event, "ok", event, { dryRun: true });
    return;
  }

  try {
    const res = await fetch("https://business-api.tiktok.com/open_api/v1.3/event/track/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Token": aiConfig.tiktok.accessToken,
      },
      body: JSON.stringify({
        pixel_code: aiConfig.tiktok.pixelId,
        event: event.event,
        event_id: `nrv_${Date.now()}`,
        timestamp: new Date().toISOString(),
        properties: {
          currency: event.currency || "MAD",
          value: event.value,
          contents: event.contentIds?.map((id) => ({ content_id: id })),
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
