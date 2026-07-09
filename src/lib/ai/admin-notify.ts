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

  await sendMessage({
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
}
