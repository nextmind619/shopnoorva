import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/ai/memory-store";

export async function GET(request: NextRequest) {
  const orderNumber = request.nextUrl.searchParams.get("order");
  const phone = request.nextUrl.searchParams.get("phone");

  if (!orderNumber || !phone) {
    return NextResponse.json({ found: false });
  }

  const normalizedPhone = phone.replace(/\s/g, "");
  const order = store.orders.find(
    (o) =>
      o.orderNumber.toUpperCase() === orderNumber.toUpperCase() &&
      o.phone.replace(/\s/g, "") === normalizedPhone
  );

  if (!order) {
    return NextResponse.json({ found: false });
  }

  return NextResponse.json({
    found: true,
    orderNumber: order.orderNumber,
    status: order.status,
    total: order.total,
    trackingNumber: order.trackingNumber,
    createdAt: order.createdAt,
  });
}
