import { NextRequest, NextResponse } from "next/server";
import { getOrders } from "@/data/products";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { processIncomingOrder } from "@/lib/ai/orchestrator";
import type { PaymentMethod, ShippingAddress } from "@/types";

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const { success } = rateLimit(`order:${ip}`, 5, 60000);

  if (!success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  try {
    const body = await request.json();
    const {
      items,
      shippingAddress,
      paymentMethod,
      couponCode,
      discount,
      cartId,
    } = body as {
      items: { productId: string; variantId: string; quantity: number }[];
      shippingAddress: ShippingAddress;
      paymentMethod: PaymentMethod;
      couponCode?: string;
      discount?: number;
      cartId?: string;
    };

    if (!items?.length || !shippingAddress?.phone || !shippingAddress?.address) {
      return NextResponse.json({ error: "Invalid order data" }, { status: 400 });
    }

    const result = await processIncomingOrder({
      phone: shippingAddress.phone,
      email: shippingAddress.email,
      firstName: shippingAddress.firstName,
      lastName: shippingAddress.lastName,
      city: shippingAddress.city,
      address: shippingAddress.address,
      paymentMethod,
      items,
      discount,
      cartId,
      locale: "fr",
    });

    if (!result.success || !result.order) {
      return NextResponse.json(
        {
          success: false,
          blocked: result.blocked,
          error: result.reason || "Order blocked by AI fraud system",
        },
        { status: 422 }
      );
    }

    return NextResponse.json({
      success: true,
      orderNumber: result.order.orderNumber,
      orderId: result.order.id,
      invoiceUrl: result.invoiceUrl,
      upsell: result.upsell,
      trackingNumber: result.order.trackingNumber,
      fraudScore: result.order.fraudScore,
      couponCode,
    });
  } catch {
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ orders: getOrders() });
}
