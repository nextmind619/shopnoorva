import { NextRequest, NextResponse } from "next/server";
import { dispatchOrderFulfillment } from "@/lib/ai/orchestrator";
import { loadRecentOrdersFromDb } from "@/lib/ai/integrations/db-orders";
import { store, type StoredOrder } from "@/lib/ai/memory-store";
import { aiConfig } from "@/lib/ai/config";
import { formatOrderProductsForMessage } from "@/lib/ai/messaging";

function isAuthorized(request: NextRequest): boolean {
  const secret = request.headers.get("x-cron-secret") || request.nextUrl.searchParams.get("secret");
  return Boolean(secret && secret === process.env.CRON_SECRET);
}

function toLeadPayload(order: StoredOrder) {
  return {
    orderNumber: order.orderNumber,
    customerName: [order.firstName, order.lastName].filter(Boolean).join(" ") || "Client",
    phone: order.phone,
    city: order.city,
    address: order.address,
    items: order.items.map((item, index, arr) => ({
      sku: item.sku,
      quantity: item.quantity,
      price:
        arr.length === 1
          ? order.total
          : index === 0
            ? item.lineTotal + order.shipping - order.discount
            : item.lineTotal,
    })),
  };
}

async function findOrder(orderNumber: string): Promise<StoredOrder | undefined> {
  const fromMemory = store.orders.find((o) => o.orderNumber === orderNumber);
  if (fromMemory) return fromMemory;
  const fromDb = await loadRecentOrdersFromDb(80);
  return fromDb.find((o) => o.orderNumber === orderNumber);
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as {
    orderNumber?: string;
    order?: Partial<StoredOrder> & { customerName?: string };
  };
  const orderNumber = body.orderNumber || request.nextUrl.searchParams.get("order") || "";

  let order = orderNumber ? await findOrder(orderNumber) : undefined;

  if (!order && body.order?.orderNumber && body.order.phone && body.order.items?.length) {
    const nameParts = (body.order.customerName || "").trim().split(/\s+/);
    order = {
      id: body.order.id || `replay-${body.order.orderNumber}`,
      orderNumber: body.order.orderNumber,
      firstName: body.order.firstName || nameParts[0] || "عميل",
      lastName: body.order.lastName || nameParts.slice(1).join(" "),
      phone: body.order.phone,
      city: body.order.city || "",
      address: body.order.address || body.order.city || "",
      items: body.order.items,
      subtotal: body.order.subtotal ?? body.order.total ?? 0,
      shipping: body.order.shipping ?? 0,
      discount: body.order.discount ?? 0,
      total: body.order.total ?? 0,
      paymentMethod: body.order.paymentMethod || "cod",
      status: "confirmed",
      fraudScore: body.order.fraudScore ?? 0,
      fraudFlags: [],
      isDuplicate: false,
      createdAt: body.order.createdAt || new Date().toISOString(),
    };
  }

  if (!order) {
    return NextResponse.json({ error: "Order not found", orderNumber }, { status: 404 });
  }

  const customerName = [order.firstName, order.lastName].filter(Boolean).join(" ") || "عميل";
  const fulfillment = await dispatchOrderFulfillment(order, toLeadPayload(order), customerName, {
    name: customerName,
    store: aiConfig.brand.name,
    order: order.orderNumber,
    products: formatOrderProductsForMessage(order.items),
    total: order.total,
    eta: "24-48 ساعة",
    payment: "الدفع عند الاستلام",
  });

  return NextResponse.json({
    ok: Boolean(
      fulfillment.sheets?.ok && fulfillment.codplus?.ok && fulfillment.whatsappAdmin?.ok
    ),
    orderNumber: order.orderNumber,
    fulfillment,
  });
}

export async function GET(request: NextRequest) {
  return POST(request);
}
