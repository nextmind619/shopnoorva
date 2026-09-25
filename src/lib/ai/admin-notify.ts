import { aiConfig } from "./config";
import { sendMessage } from "./messaging";
import type { StoredOrder } from "./memory-store";

export async function notifyAdminNewOrder(
  order: StoredOrder,
  customerName: string
): Promise<void> {
  const products = order.items
    .map((item) => `${item.name} × ${item.quantity}`)
    .join(" | ");

  const record = await sendMessage({
    channel: "whatsapp",
    recipient: aiConfig.brand.adminWhatsApp,
    templateKey: "admin_new_order",
    variables: {
      order: order.orderNumber,
      name: customerName,
      phone: order.phone,
      city: order.city,
      address: order.address,
      products,
      total: order.total,
    },
    locale: "ar",
    relatedType: "order",
    relatedId: order.id,
  });
  if (record.status === "failed") {
    throw new Error(record.error || "whatsapp_admin_failed");
  }
}

/** Alert admin when WhatsApp support needs a human. */
export async function notifyAdminEscalation(input: {
  phone: string;
  customerMessage: string;
  aiReply?: string;
  reason?: string;
  conversationId?: string;
}): Promise<void> {
  const body = [
    "🚨 *تصعيد دعم واتساب — NOORVA*",
    "",
    `📱 الزبون: ${input.phone}`,
    input.conversationId ? `💬 المحادثة: ${input.conversationId}` : null,
    input.reason ? `⚠️ السبب: ${input.reason}` : null,
    "",
    `📩 رسالة الزبون:\n${input.customerMessage.slice(0, 500)}`,
    input.aiReply ? `\n🤖 رد البوت:\n${input.aiReply.slice(0, 400)}` : null,
    "",
    "✅ جاوب الزبون من نفس رقم واتساب المتجر دابا",
  ]
    .filter(Boolean)
    .join("\n");

  await sendMessage({
    channel: "whatsapp",
    recipient: aiConfig.brand.adminWhatsApp,
    body,
    locale: "ar",
    relatedType: "support_escalation",
    relatedId: input.conversationId,
  });
}
