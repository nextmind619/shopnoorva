import { NextRequest, NextResponse } from "next/server";
import { answerCustomer } from "@/lib/ai/support";
import { sendMessage } from "@/lib/ai/messaging";
import { logIntegration } from "@/lib/ai/integrations/logger";

/**
 * Evolution API WhatsApp inbound webhook.
 * Auto-answers customers via OpenAI + sends reply through Evolution.
 */
export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    await logIntegration("evolution", "inbound_webhook", "ok", payload);

    const phone =
      payload?.data?.key?.remoteJid?.replace("@s.whatsapp.net", "") ||
      payload?.sender ||
      payload?.phone;

    const message =
      payload?.data?.message?.conversation ||
      payload?.data?.message?.extendedTextMessage?.text ||
      payload?.message ||
      payload?.text;

    if (!phone || !message) {
      return NextResponse.json({ success: true, ignored: true });
    }

    const result = await answerCustomer({
      channel: "whatsapp",
      phone: String(phone),
      message: String(message),
    });

    await sendMessage({
      channel: "whatsapp",
      recipient: String(phone),
      body: result.reply,
    });

    return NextResponse.json({
      success: true,
      conversationId: result.conversationId,
      reply: result.reply,
    });
  } catch (error) {
    await logIntegration("evolution", "inbound_webhook", "error", {}, {
      error: error instanceof Error ? error.message : "webhook_failed",
    });
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
  }
}
