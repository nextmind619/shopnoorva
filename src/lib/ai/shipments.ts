import { store, type StoredOrder } from "./memory-store";
import { sendMessage } from "./messaging";
import { triggerN8n } from "./integrations/n8n";

const CARRIERS = ["Amana", "Chronopost MA", "Cathedis", "Jibli"];

export async function createShipment(order: StoredOrder): Promise<{
  trackingNumber: string;
  carrier: string;
  estimatedDelivery: string;
}> {
  const carrier = CARRIERS[Math.floor(Math.random() * CARRIERS.length)];
  const trackingNumber = `NRV${Date.now().toString().slice(-10)}`;
  const eta = new Date(Date.now() + (["Casablanca", "Rabat", "Marrakech"].includes(order.city) ? 2 : 4) * 86400000)
    .toISOString()
    .slice(0, 10);

  order.trackingNumber = trackingNumber;
  order.status = order.status === "cancelled" || order.status === "review" ? order.status : "shipped";

  await sendMessage({
    channel: "whatsapp",
    recipient: order.phone,
    templateKey: "shipped",
    variables: {
      order: order.orderNumber,
      tracking: trackingNumber,
      city: order.city,
    },
    locale: "fr",
  });

  if (order.email) {
    await sendMessage({
      channel: "email",
      recipient: order.email,
      templateKey: "shipped",
      variables: {
        order: order.orderNumber,
        tracking: trackingNumber,
        city: order.city,
      },
      locale: "fr",
      generateWithAi: true,
      intent: "shipment tracking email",
    });
  }

  await triggerN8n("shipment-created", {
    orderNumber: order.orderNumber,
    trackingNumber,
    carrier,
    estimatedDelivery: eta,
  });

  return { trackingNumber, carrier, estimatedDelivery: eta };
}

export function trackShipment(trackingNumber: string): {
  found: boolean;
  orderNumber?: string;
  status?: string;
  events?: Array<{ at: string; status: string; detail: string }>;
} {
  const order = store.orders.find((o) => o.trackingNumber === trackingNumber);
  if (!order) return { found: false };

  const created = new Date(order.createdAt).getTime();
  const ageH = (Date.now() - created) / 3600000;
  const events = [
    { at: order.createdAt, status: "confirmed", detail: "Order confirmed by NOORVA AI" },
    { at: new Date(created + 2 * 3600000).toISOString(), status: "packed", detail: "Packed in Casablanca hub" },
  ];
  if (ageH > 6) {
    events.push({
      at: new Date(created + 6 * 3600000).toISOString(),
      status: "in_transit",
      detail: `In transit to ${order.city}`,
    });
  }
  if (ageH > 36) {
    events.push({
      at: new Date(created + 36 * 3600000).toISOString(),
      status: "out_for_delivery",
      detail: "Out for delivery",
    });
  }

  return {
    found: true,
    orderNumber: order.orderNumber,
    status: order.status,
    events,
  };
}

export async function syncPendingShipments(): Promise<number> {
  const pending = store.orders.filter(
    (o) => ["confirmed", "processing"].includes(o.status) && !o.trackingNumber
  );
  for (const order of pending.slice(0, 20)) {
    await createShipment(order);
  }
  return pending.length;
}
