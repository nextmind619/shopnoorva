import { NextRequest, NextResponse } from "next/server";
import { getAdminOrders } from "@/lib/orders-admin";
import { getClientIp } from "@/lib/rate-limit";
import { processIncomingOrder } from "@/lib/ai/orchestrator";
import { normalizeMoroccanPhoneLocal, validateMoroccanPhone } from "@/lib/fraud";
import type { DeviceSignals } from "@/lib/fraud";
import type { PaymentMethod, ShippingAddress } from "@/types";

function collectHeaders(request: NextRequest): Record<string, string | null | undefined> {
  return {
    "user-agent": request.headers.get("user-agent"),
    "accept-language": request.headers.get("accept-language"),
    "sec-ch-ua": request.headers.get("sec-ch-ua"),
    "sec-ch-ua-mobile": request.headers.get("sec-ch-ua-mobile"),
    "sec-ch-ua-platform": request.headers.get("sec-ch-ua-platform"),
    via: request.headers.get("via"),
    forwarded: request.headers.get("forwarded"),
    "x-forwarded-for": request.headers.get("x-forwarded-for"),
    "x-real-ip": request.headers.get("x-real-ip"),
  };
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);

  try {
    const body = await request.json();
    const {
      items,
      shippingAddress,
      couponCode,
      discount,
      cartId,
      device,
      honeypot,
      formFillMs,
      meta,
    } = body as {
      items: { productId: string; variantId: string; quantity: number }[];
      shippingAddress: ShippingAddress;
      paymentMethod: PaymentMethod;
      couponCode?: string;
      discount?: number;
      cartId?: string;
      device?: DeviceSignals;
      honeypot?: string;
      formFillMs?: number;
      meta?: {
        fbp?: string;
        fbc?: string;
        eventSourceUrl?: string;
        referrerUrl?: string;
      };
    };

    if (!items?.length || !shippingAddress?.phone || !shippingAddress?.address) {
      return NextResponse.json({ error: "Invalid order data" }, { status: 400 });
    }

    if (!shippingAddress.fullName?.trim()) {
      return NextResponse.json({ error: "Full name is required" }, { status: 400 });
    }

    const phoneCheck = validateMoroccanPhone(shippingAddress.phone);
    if (!phoneCheck.valid) {
      return NextResponse.json(
        {
          success: false,
          blocked: true,
          error: "Invalid Moroccan phone number",
          reasons: phoneCheck.reasons,
        },
        { status: 422 }
      );
    }

    const normalizedPhone =
      normalizeMoroccanPhoneLocal(shippingAddress.phone) || phoneCheck.normalized;

    const nameParts = shippingAddress.fullName.trim().split(/\s+/);
    const firstName = nameParts[0] || "Client";
    const lastName = nameParts.slice(1).join(" ") || "";
    const headers = collectHeaders(request);

    const result = await processIncomingOrder({
      phone: normalizedPhone,
      email: shippingAddress.email,
      firstName,
      lastName,
      city: shippingAddress.city,
      address: shippingAddress.address,
      notes: shippingAddress.notes,
      paymentMethod: "cod",
      items,
      discount,
      cartId,
      locale: (body as { locale?: string }).locale || "ar",
      ip,
      userAgent: headers["user-agent"] || undefined,
      acceptLanguage: headers["accept-language"] || undefined,
      honeypot,
      formFillMs,
      device,
      headers,
      meta,
    });

    if (!result.success || !result.order) {
      return NextResponse.json(
        {
          success: false,
          blocked: result.blocked,
          error: result.reason || "Order blocked by anti-fraud system",
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
  return NextResponse.json({ orders: getAdminOrders() });
}
