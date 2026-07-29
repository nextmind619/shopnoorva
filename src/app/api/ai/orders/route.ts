import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { processIncomingOrder, getAiDashboard } from "@/lib/ai/orchestrator";
import { getClientIp } from "@/lib/rate-limit";
import { normalizeMoroccanPhoneLocal, validateMoroccanPhone } from "@/lib/fraud";

const schema = z.object({
  phone: z.string().min(8),
  email: z.string().email().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  city: z.string().min(2),
  address: z.string().min(1),
  paymentMethod: z.string().optional(),
  discount: z.number().optional(),
  cartId: z.string().optional(),
  locale: z.enum(["ar", "fr", "en"]).optional(),
  honeypot: z.string().optional(),
  formFillMs: z.number().optional(),
  device: z.record(z.string(), z.unknown()).optional(),
  items: z
    .array(
      z.object({
        productId: z.string(),
        variantId: z.string(),
        quantity: z.number().int().positive(),
      })
    )
    .min(1),
});

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);

  try {
    const body = schema.parse(await request.json());
    const phoneCheck = validateMoroccanPhone(body.phone);
    if (!phoneCheck.valid) {
      return NextResponse.json(
        { success: false, blocked: true, reason: "Invalid Moroccan phone", reasons: phoneCheck.reasons },
        { status: 422 }
      );
    }

    const headers: Record<string, string | null | undefined> = {
      "user-agent": request.headers.get("user-agent"),
      "accept-language": request.headers.get("accept-language"),
      "sec-ch-ua": request.headers.get("sec-ch-ua"),
      via: request.headers.get("via"),
      forwarded: request.headers.get("forwarded"),
      "x-forwarded-for": request.headers.get("x-forwarded-for"),
    };

    const result = await processIncomingOrder({
      ...body,
      phone: normalizeMoroccanPhoneLocal(body.phone) || phoneCheck.normalized,
      ip,
      userAgent: headers["user-agent"] || undefined,
      acceptLanguage: headers["accept-language"] || undefined,
      honeypot: body.honeypot,
      formFillMs: body.formFillMs,
      device: body.device as import("@/lib/fraud").DeviceSignals | undefined,
      headers,
    });
    if (!result.success) {
      return NextResponse.json(result, { status: 422 });
    }
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Order processing failed" },
      { status: 400 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ success: true, dashboard: getAiDashboard() });
}
