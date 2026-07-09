import { aiConfig, isConfigured } from "../config";
import { logIntegration } from "./logger";
import type { DailyAnalytics } from "../memory-store";

/**
 * Google Sheets sync.
 * Uses Apps Script / n8n webhook bridge when service account is not embedded.
 * For EasyPanel: set GOOGLE_SHEETS_WEBHOOK to an n8n or Apps Script endpoint.
 */
export async function syncAnalyticsToSheets(analytics: DailyAnalytics): Promise<void> {
  const webhook = process.env.GOOGLE_SHEETS_WEBHOOK || "";
  const row = [
    analytics.day,
    analytics.ordersCount,
    analytics.revenue,
    analytics.aov,
    analytics.abandonedCarts,
    analytics.recoveredCarts,
    analytics.recoveryRevenue,
    analytics.fakeOrdersBlocked,
    analytics.duplicatesBlocked,
    analytics.messagesSent,
    analytics.aiReplies,
  ];

  if (!isConfigured(webhook) && !isConfigured(aiConfig.googleSheets.spreadsheetId)) {
    await logIntegration("google_sheets", "sync_daily_dry_run", "ok", { row });
    return;
  }

  const target = isConfigured(webhook)
    ? webhook
    : `${aiConfig.n8n.webhookBase}/google-sheets-sync`;

  try {
    const res = await fetch(target, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        spreadsheetId: aiConfig.googleSheets.spreadsheetId,
        sheet: "DailyAnalytics",
        values: [row],
      }),
    });
    await logIntegration("google_sheets", "sync_daily", res.ok ? "ok" : "error", { row });
  } catch (error) {
    await logIntegration("google_sheets", "sync_daily", "error", { row }, {
      error: error instanceof Error ? error.message : "sheets_failed",
    });
  }
}

export async function appendOrderToSheets(order: {
  orderNumber: string;
  phone: string;
  city: string;
  total: number;
  status: string;
}): Promise<void> {
  const webhook = process.env.GOOGLE_SHEETS_WEBHOOK || `${aiConfig.n8n.webhookBase}/google-sheets-orders`;
  try {
    await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sheet: "Orders",
        values: [[order.orderNumber, order.phone, order.city, order.total, order.status, new Date().toISOString()]],
      }),
    });
    await logIntegration("google_sheets", "append_order", "ok", order);
  } catch {
    await logIntegration("google_sheets", "append_order", "error", order);
  }
}
