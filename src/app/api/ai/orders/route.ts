import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { processIncomingOrder, getAiDashboard } from "@/lib/ai/orchestrator";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

const schema = z.object({
  phone: z.string().min(8),
  email: z.string().email().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  city: z.string().min(2),
  address: z.string().min(5),
  paymentMethod: z.string().optional(),
  discount: z.number().optional(),
  cartId: z.string().optional(),
  locale: z.enum(["ar", "fr", "en"]).optional(),
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
  if (!rateLimit(`ai-orders:${ip}`, 10, 60000).success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  try {
    const body = schema.parse(await request.json());
    const result = await processIncomingOrder(body);
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
