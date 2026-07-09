import { aiConfig, isConfigured } from "../config";
import { logIntegration } from "./logger";

export async function sendMetaConversion(event: {
  eventName: "Purchase" | "AddToCart" | "InitiateCheckout" | "Lead";
  value?: number;
  currency?: string;
  contentIds?: string[];
  phone?: string;
  email?: string;
}): Promise<void> {
  if (!isConfigured(aiConfig.meta.accessToken) || !isConfigured(aiConfig.meta.pixelId)) {
    await logIntegration("meta", event.eventName, "ok", event, { dryRun: true });
    return;
  }

  const url = `https://graph.facebook.com/v19.0/${aiConfig.meta.pixelId}/events`;
  const payload = {
    data: [
      {
        event_name: event.eventName,
        event_time: Math.floor(Date.now() / 1000),
        action_source: "website",
        user_data: {
          ph: event.phone ? [hashHint(event.phone)] : undefined,
          em: event.email ? [hashHint(event.email)] : undefined,
        },
        custom_data: {
          value: event.value,
          currency: event.currency || "MAD",
          content_ids: event.contentIds,
        },
      },
    ],
    access_token: aiConfig.meta.accessToken,
  };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    await logIntegration("meta", event.eventName, res.ok ? "ok" : "error", event, data);
  } catch (error) {
    await logIntegration("meta", event.eventName, "error", event, {
      error: error instanceof Error ? error.message : "meta_failed",
    });
  }
}

function hashHint(value: string): string {
  // Placeholder normalized value; production should SHA-256 hash before send.
  return value.trim().toLowerCase();
}
