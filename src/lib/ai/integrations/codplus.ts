import { aiConfig, isConfigured } from "../config";
import { logIntegration } from "./logger";
import { collapseCodplusLeadItems } from "./codplus-sku";

export interface CodplusLeadInput {
  orderNumber: string;
  customerName: string;
  phone: string;
  city: string;
  address: string;
  notes?: string;
  items: Array<{ sku: string; quantity: number; price: number }>;
}

function buildLeadPayload(lead: CodplusLeadInput) {
  const collapsed = collapseCodplusLeadItems(lead.items);
  const noteParts = [`NOORVA:${lead.orderNumber}`];
  if (lead.notes?.trim()) noteParts.push(lead.notes.trim());
  noteParts.push(...collapsed.extraNotes);
  const note = noteParts.join(" | ");

  return {
    customer: lead.customerName,
    customer_name: lead.customerName,
    name: lead.customerName,
    phone: lead.phone,
    city: lead.city,
    address: lead.address,
    price: collapsed.price,
    amount: collapsed.price,
    quantity: collapsed.quantity,
    qty: collapsed.quantity,
    sku: collapsed.sku,
    products: collapsed.products,
    items: collapsed.products,
    note,
    notes: note,
    external_id: lead.orderNumber,
    source: "noorva",
  };
}

export function isCodplusConfigured(): boolean {
  return (
    isConfigured(process.env.CODPLUS_WEBHOOK_URL || "") &&
    isConfigured(process.env.CODPLUS_WEBHOOK_TOKEN || "")
  );
}

export async function sendLeadToCodplus(lead: CodplusLeadInput): Promise<{
  ok: boolean;
  skipped?: string;
  error?: string;
  response?: unknown;
}> {
  const webhookUrl = process.env.CODPLUS_WEBHOOK_URL || "";
  const webhookToken = process.env.CODPLUS_WEBHOOK_TOKEN || "";

  if (!isConfigured(webhookUrl) || !isConfigured(webhookToken)) {
    await logIntegration("codplus", "send_lead_dry_run", "ok", lead, {
      reason: "missing_codplus_webhook_config",
    });
    return { ok: false, skipped: "missing_codplus_webhook_config" };
  }

  if (!lead.items.length) {
    await logIntegration("codplus", "send_lead", "ok", lead, { skipped: "empty_items" });
    return { ok: true, skipped: "empty_items" };
  }

  try {
    const payload = buildLeadPayload(lead);
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${webhookToken}`,
        "X-Webhook-Token": webhookToken,
        "X-Codplus-Webhook-Token": webhookToken,
      },
      body: JSON.stringify({
        ...payload,
        webhook_token: webhookToken,
      }),
    });

    const body = await res.text();
    let parsed: unknown = body;
    try {
      parsed = body ? JSON.parse(body) : null;
    } catch {
      /* keep text */
    }

    if (!res.ok) {
      throw new Error(`Codplus webhook ${res.status}: ${typeof parsed === "string" ? parsed : JSON.stringify(parsed)}`);
    }

    await logIntegration("codplus", "send_lead", "ok", lead, { response: parsed });
    return { ok: true, response: parsed };
  } catch (error) {
    const message = error instanceof Error ? error.message : "codplus_send_failed";
    console.error("[codplus] send lead failed:", message, { orderNumber: lead.orderNumber });
    await logIntegration("codplus", "send_lead", "error", lead, { error: message });
    return { ok: false, error: message };
  }
}

export function getCodplusConfigSummary() {
  return {
    webhookUrl: process.env.CODPLUS_WEBHOOK_URL || null,
    webhookTokenLoaded: isConfigured(process.env.CODPLUS_WEBHOOK_TOKEN || ""),
    configured: isCodplusConfigured(),
    siteUrl: aiConfig.brand.siteUrl,
  };
}
