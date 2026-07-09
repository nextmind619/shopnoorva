import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { saveAbandonedCart, processAbandonedCarts } from "@/lib/ai/cart-recovery";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

const saveSchema = z.object({
  sessionId: z.string().min(3),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  items: z.array(
    z.object({
      productId: z.string(),
      variantId: z.string(),
      quantity: z.number().int().positive(),
      name: z.string(),
      price: z.number().nonnegative(),
    })
  ),
  subtotal: z.number().nonnegative(),
});

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  if (!rateLimit(`ai-cart:${ip}`, 40, 60000).success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  try {
    const body = saveSchema.parse(await request.json());
    const cart = saveAbandonedCart(body);
    return NextResponse.json({ success: true, cart });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Cart save failed" },
      { status: 400 }
    );
  }
}

export async function PUT() {
  const result = await processAbandonedCarts();
  return NextResponse.json({ success: true, ...result });
}
