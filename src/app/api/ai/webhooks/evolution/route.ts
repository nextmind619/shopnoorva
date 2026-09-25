import { NextRequest, NextResponse } from "next/server";
import { answerCustomer, findOpenConversationByPhone } from "@/lib/ai/support";
import { sendMessage } from "@/lib/ai/messaging";
import { notifyAdminEscalation } from "@/lib/ai/admin-notify";
import { logIntegration } from "@/lib/ai/integrations/logger";

/** Dedup Evolution retries (same WhatsApp message id). */
const recentMessageIds = new Map<string, number>();

function alreadyHandled(messageId: string): boolean {
  const now = Date.now();
  for (const [id, ts] of recentMessageIds) {
    if (now - ts > 180_000) recentMessageIds.delete(id);
  }
  if (!messageId) return false;
  if (recentMessageIds.has(messageId)) return true;
  recentMessageIds.set(messageId, now);
  return false;
}

function extractInbound(payload: Record<string, unknown>) {
  const data = (payload?.data || payload) as Record<string, unknown>;
  const key = (data?.key || {}) as Record<string, unknown>;
  const message = (data?.message || {}) as Record<string, unknown>;
  const extended = (message?.extendedTextMessage || {}) as Record<string, unknown>;
  const image = (message?.imageMessage || {}) as Record<string, unknown>;
  const video = (message?.videoMessage || {}) as Record<string, unknown>;
  const audio = (message?.audioMessage || {}) as Record<string, unknown>;

  const remoteJid = String(key?.remoteJid || data?.remoteJid || payload?.sender || payload?.phone || "");
  const fromMe = Boolean(key?.fromMe);
  const messageId = String(key?.id || data?.id || "");
  const text = String(
    message?.conversation ||
      extended?.text ||
      image?.caption ||
      video?.caption ||
      data?.message ||
      data?.text ||
      payload?.message ||
      payload?.text ||
      ""
  ).trim();

  const phone = remoteJid
    .replace(/@.+$/, "")
    .replace(/\D/g, "");

  const isGroup = remoteJid.includes("@g.us");
  const isStatus = remoteJid.includes("status@broadcast") || remoteJid === "status@broadcast";
  const hasMediaOnly = !text && Boolean(message?.imageMessage || message?.videoMessage || message?.audioMessage || message?.documentMessage || message?.stickerMessage);

  return {
    phone,
    text: hasMediaOnly ? "[رسالة صوتية/صورة — المرجو الكتابة]" : text,
    fromMe,
    messageId,
    isGroup,
    isStatus,
    pushName: String(data?.pushName || ""),
    event: String(payload?.event || data?.event || ""),
  };
}

/**
 * Evolution API WhatsApp inbound webhook.
 * Auto-answers customers in Moroccan Darija via OpenAI + Evolution send.
 * Escalates sensitive cases to ADMIN_WHATSAPP and pauses AI on that thread.
 */
export async function POST(request: NextRequest) {
  try {
    const payload = (await request.json()) as Record<string, unknown>;
    await logIntegration("evolution", "inbound_webhook", "ok", {
      event: payload?.event,
      instance: payload?.instance,
    });

    const inbound = extractInbound(payload);

    // Ignore non-customer noise
    if (inbound.fromMe || inbound.isGroup || inbound.isStatus || !inbound.phone) {
      return NextResponse.json({ success: true, ignored: true, reason: "noise" });
    }

    // Only process message upsert style events when event is present
    const event = inbound.event.toLowerCase();
    if (event && !event.includes("upsert") && !event.includes("message")) {
      return NextResponse.json({ success: true, ignored: true, reason: "event" });
    }

    if (!inbound.text) {
      return NextResponse.json({ success: true, ignored: true, reason: "empty" });
    }

    if (alreadyHandled(inbound.messageId)) {
      return NextResponse.json({ success: true, ignored: true, reason: "duplicate" });
    }

    const existing = findOpenConversationByPhone(inbound.phone);

    // Human takeover: if already escalated, forward new message to admin only
    if (existing?.status === "escalated") {
      await notifyAdminEscalation({
        phone: inbound.phone,
        customerMessage: inbound.text,
        reason: "متابعة بعد التصعيد — البوت موقف",
        conversationId: existing.id,
      }).catch(() => undefined);

      return NextResponse.json({
        success: true,
        paused: true,
        conversationId: existing.id,
      });
    }

    const result = await answerCustomer({
      channel: "whatsapp",
      phone: inbound.phone,
      message: inbound.text,
      conversationId: existing?.id,
    });

    await sendMessage({
      channel: "whatsapp",
      recipient: inbound.phone,
      body: result.reply,
      locale: "ar",
    });

    if (result.escalate) {
      await notifyAdminEscalation({
        phone: inbound.phone,
        customerMessage: inbound.text,
        aiReply: result.reply,
        reason: result.escalateReason || "تصعيد تلقائي",
        conversationId: result.conversationId,
      }).catch(() => undefined);
    }

    return NextResponse.json({
      success: true,
      conversationId: result.conversationId,
      escalate: result.escalate,
      reply: result.reply,
    });
  } catch (error) {
    await logIntegration("evolution", "inbound_webhook", "error", {}, {
      error: error instanceof Error ? error.message : "webhook_failed",
    });
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
  }
}
