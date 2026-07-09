import { NextRequest, NextResponse } from "next/server";
import { createShipment, trackShipment, syncPendingShipments } from "@/lib/ai/shipments";
import { store } from "@/lib/ai/memory-store";

export async function GET(request: NextRequest) {
  const tracking = request.nextUrl.searchParams.get("tracking");
  if (tracking) {
    return NextResponse.json(trackShipment(tracking));
  }
  return NextResponse.json({
    shipments: store.orders
      .filter((o) => o.trackingNumber)
      .map((o) => ({
        orderNumber: o.orderNumber,
        trackingNumber: o.trackingNumber,
        status: o.status,
        city: o.city,
      })),
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  if (body.sync) {
    const count = await syncPendingShipments();
    return NextResponse.json({ success: true, synced: count });
  }

  const order = store.orders.find((o) => o.orderNumber === body.orderNumber || o.id === body.orderId);
  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

  const shipment = await createShipment(order);
  return NextResponse.json({ success: true, shipment, order });
}
