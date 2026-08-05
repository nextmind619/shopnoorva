import { JWT } from "google-auth-library";
import { aiConfig, isConfigured } from "../config";
import { logIntegration } from "./logger";
import { getGoogleSheetsConfigSummary, isGoogleSheetsConfigured, resolveGoogleServiceAccount } from "./google-auth";
import type { DailyAnalytics } from "../memory-store";

const SHEETS_SCOPE = "https://www.googleapis.com/auth/spreadsheets";
const SHEETS_BASE = "https://sheets.googleapis.com/v4/spreadsheets";

/** Codplus-compatible leads sheet headers (matches existing spreadsheet). */
export const LEADS_HEADERS = [
  "👤 Customer",
  "📞 Phone",
  "🏙️ City",
  "📍 Address",
  "💰 Price",
  "🔢 Qty",
  "🏷️ SKU",
  "🗒️ Note",
] as const;

export interface SheetOrderLineItem {
  sku: string;
  quantity: number;
  price: number;
}

export interface SheetOrderInput {
  orderNumber: string;
  customerName: string;
  phone: string;
  city: string;
  address: string;
  notes?: string;
  items: SheetOrderLineItem[];
}

function orderMarker(orderNumber: string): string {
  return `NOORVA:${orderNumber}`;
}

function isSheetsApiConfigured(): boolean {
  return isGoogleSheetsConfigured();
}

function encodeRange(sheetName: string, range: string): string {
  const quoted = `'${sheetName.replace(/'/g, "''")}'`;
  return `${quoted}!${range}`;
}

function itemToRow(order: SheetOrderInput, item: SheetOrderLineItem): string[] {
  const noteParts = [orderMarker(order.orderNumber)];
  if (order.notes?.trim()) noteParts.push(order.notes.trim());

  return [
    order.customerName,
    order.phone,
    order.city,
    order.address,
    String(item.price),
    String(item.quantity),
    item.sku,
    noteParts.join(" | "),
  ];
}

let sheetsClient: JWT | null = null;

function getSheetsAuthClient(): JWT {
  if (!sheetsClient) {
    const creds = resolveGoogleServiceAccount();
    if (!creds) {
      throw new Error("Google service account credentials are not configured");
    }
    sheetsClient = new JWT({
      email: creds.email,
      key: creds.privateKey,
      scopes: [SHEETS_SCOPE],
    });
  }
  return sheetsClient;
}

async function sheetsFetch<T>(
  path: string,
  init?: RequestInit & { method?: "GET" | "POST" | "PUT" }
): Promise<T> {
  const client = getSheetsAuthClient();
  const token = await client.getAccessToken();
  if (!token.token) {
    throw new Error("Failed to obtain Google Sheets access token");
  }

  const res = await fetch(`${SHEETS_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token.token}`,
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });

  const body = await res.text();
  let parsed: unknown = null;
  if (body) {
    try {
      parsed = JSON.parse(body);
    } catch {
      parsed = body;
    }
  }

  if (!res.ok) {
    const message =
      typeof parsed === "object" && parsed && "error" in parsed
        ? JSON.stringify((parsed as { error: unknown }).error)
        : body || res.statusText;
    throw new Error(`Google Sheets API ${res.status}: ${message}`);
  }

  return parsed as T;
}

async function ensureOrderSheetExists(spreadsheetId: string, sheetName: string): Promise<void> {
  const meta = await sheetsFetch<{ sheets?: Array<{ properties?: { title?: string } }> }>(
    `/${spreadsheetId}?fields=sheets.properties.title`
  );

  const exists = meta.sheets?.some((sheet) => sheet.properties?.title === sheetName);
  if (exists) return;

  await sheetsFetch(`/${spreadsheetId}:batchUpdate`, {
    method: "POST",
    body: JSON.stringify({
      requests: [{ addSheet: { properties: { title: sheetName } } }],
    }),
  });
}

async function ensureLeadsHeaders(spreadsheetId: string, sheetName: string): Promise<void> {
  const range = encodeRange(sheetName, "1:1");
  const current = await sheetsFetch<{ values?: string[][] }>(
    `/${spreadsheetId}/values/${encodeURIComponent(range)}`
  );

  const firstCell = current.values?.[0]?.[0]?.trim();
  if (firstCell) return;

  await sheetsFetch(`/${spreadsheetId}/values/${encodeURIComponent(range)}?valueInputOption=RAW`, {
    method: "PUT",
    body: JSON.stringify({ values: [LEADS_HEADERS] }),
  });
}

async function orderIdExists(
  spreadsheetId: string,
  sheetName: string,
  orderNumber: string
): Promise<boolean> {
  const range = encodeRange(sheetName, "H2:H");
  const result = await sheetsFetch<{ values?: string[][] }>(
    `/${spreadsheetId}/values/${encodeURIComponent(range)}`
  );

  const marker = orderMarker(orderNumber);
  return (result.values || []).flat().some((value) => String(value).includes(marker));
}

async function appendOrderRowViaApi(order: SheetOrderInput): Promise<void> {
  const spreadsheetId = aiConfig.googleSheets.spreadsheetId;
  const sheetName = aiConfig.googleSheets.orderSheetName;

  await ensureOrderSheetExists(spreadsheetId, sheetName);
  await ensureLeadsHeaders(spreadsheetId, sheetName);

  if (await orderIdExists(spreadsheetId, sheetName, order.orderNumber)) {
    await logIntegration("google_sheets", "append_order", "ok", order, {
      skipped: "duplicate",
      orderNumber: order.orderNumber,
    });
    return;
  }

  const rows = order.items.map((item) => itemToRow(order, item));
  if (!rows.length) return;

  const range = encodeRange(sheetName, "A:H");
  await sheetsFetch(
    `/${spreadsheetId}/values/${encodeURIComponent(range)}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
    {
      method: "POST",
      body: JSON.stringify({ values: rows }),
    }
  );
}

async function appendOrderRowViaWebhook(order: SheetOrderInput): Promise<void> {
  const webhook =
    process.env.GOOGLE_SHEETS_WEBHOOK || `${aiConfig.n8n.webhookBase}/google-sheets-orders`;

  const rows = order.items.map((item) => itemToRow(order, item));
  const res = await fetch(webhook, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      spreadsheetId: aiConfig.googleSheets.spreadsheetId,
      sheet: aiConfig.googleSheets.orderSheetName,
      values: rows,
    }),
  });

  if (!res.ok) {
    throw new Error(`Google Sheets webhook failed: ${res.status} ${res.statusText}`);
  }
}

/**
 * Google Sheets sync.
 * Uses the Google Sheets API with a service account when configured.
 * Falls back to an n8n / Apps Script webhook when credentials are absent.
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

/**
 * Append a confirmed order to the Codplus-compatible leads sheet.
 * Non-blocking for the order pipeline: failures are logged and swallowed.
 */
export async function appendOrderToSheets(order: SheetOrderInput): Promise<{
  ok: boolean;
  skipped?: string;
  error?: string;
}> {
  if (!isSheetsApiConfigured() && !isConfigured(process.env.GOOGLE_SHEETS_WEBHOOK || "")) {
    await logIntegration("google_sheets", "append_order_dry_run", "ok", order, {
      reason: "missing_credentials",
    });
    return { ok: false, skipped: "missing_credentials" };
  }

  try {
    if (isSheetsApiConfigured()) {
      await appendOrderRowViaApi(order);
    } else {
      await appendOrderRowViaWebhook(order);
    }

    await logIntegration("google_sheets", "append_order", "ok", order);
    return { ok: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "sheets_append_failed";
    console.error("[google-sheets] append order failed:", message, { orderNumber: order.orderNumber });
    await logIntegration("google_sheets", "append_order", "error", order, { error: message });
    return { ok: false, error: message };
  }
}

export async function diagnoseGoogleSheets(): Promise<Record<string, unknown>> {
  const summary = getGoogleSheetsConfigSummary();
  if (!summary.configured) {
    return { ...summary, step: "config", ok: false, error: "Google Sheets credentials not configured" };
  }

  try {
    const client = getSheetsAuthClient();
    const token = await client.getAccessToken();
    if (!token.token) {
      return { ...summary, step: "token", ok: false, error: "Failed to obtain access token" };
    }

    const spreadsheetId = aiConfig.googleSheets.spreadsheetId;
    const sheetName = aiConfig.googleSheets.orderSheetName;
    const meta = await sheetsFetch<{ sheets?: Array<{ properties?: { title?: string } }> }>(
      `/${spreadsheetId}?fields=sheets.properties.title`
    );
    const sheetExists = meta.sheets?.some((sheet) => sheet.properties?.title === sheetName);
    if (!sheetExists) {
      return {
        ...summary,
        step: "sheet",
        ok: false,
        error: `Sheet tab "${sheetName}" not found`,
        availableSheets: meta.sheets?.map((s) => s.properties?.title).filter(Boolean),
      };
    }

    const headerRange = encodeRange(sheetName, "1:1");
    const headers = await sheetsFetch<{ values?: string[][] }>(
      `/${spreadsheetId}/values/${encodeURIComponent(headerRange)}`
    );

    return {
      ...summary,
      step: "ready",
      ok: true,
      headers: headers.values?.[0] || [],
      message: "Google Sheets connection is working",
    };
  } catch (error) {
    return {
      ...summary,
      step: "api",
      ok: false,
      error: error instanceof Error ? error.message : "diagnose_failed",
    };
  }
}
