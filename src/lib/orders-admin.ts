import { store, type StoredOrder } from "@/lib/ai/memory-store";

export interface AdminOrderRow {
  id: string;
  orderNumber: string;
  total: number;
  subtotal: number;
  shipping: number;
  status: string;
  paymentMethod: string;
  createdAt: string;
  items: Array<{ name: string; quantity: number; lineTotal: number }>;
  shippingAddress: {
    fullName: string;
    firstName: string;
    lastName: string;
    phone: string;
    city: string;
    address: string;
  };
  fraudScore: number;
  trackingNumber?: string;
}

function storedToAdmin(order: StoredOrder): AdminOrderRow {
  const firstName = order.firstName || "عميل";
  const lastName = order.lastName || "";

  return {
    id: order.id,
    orderNumber: order.orderNumber,
    total: order.total,
    subtotal: order.subtotal,
    shipping: order.shipping,
    status: order.status,
    paymentMethod: order.paymentMethod,
    createdAt: order.createdAt,
    items: order.items.map((item) => ({
      name: item.name,
      quantity: item.quantity,
      lineTotal: item.lineTotal,
    })),
    shippingAddress: {
      fullName: [firstName, lastName].filter(Boolean).join(" "),
      firstName,
      lastName,
      phone: order.phone,
      city: order.city,
      address: order.address,
    },
    fraudScore: order.fraudScore,
    trackingNumber: order.trackingNumber,
  };
}

export function getAdminOrders(limit?: number): AdminOrderRow[] {
  const sorted = [...store.orders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  const rows = sorted.map(storedToAdmin);
  return limit ? rows.slice(0, limit) : rows;
}

export function getAdminOrderStats() {
  const orders = store.orders;
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const pendingOrders = orders.filter((o) => o.status === "review" || o.status === "pending").length;

  return {
    totalOrders: orders.length,
    totalRevenue,
    pendingOrders,
  };
}
