import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { sendMessage, generateMessageBody } from "@/lib/ai/messaging";
import { store } from "@/lib/ai/memory-store";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

const schema = z.object({
  channel: z.enum(["whatsapp", "sms", "email"]),
  recipient: z.string().min(3),
  templateKey: z.string().optional(),
  subject: z.string().optional(),
  body: z.string().optional(),
  variables: z.record(z.string(), z.union([z.string(), z.number()])).optional(),
  locale: z.enum(["ar", "fr", "en"]).optional(),
  generateWithAi: z.boolean().optional(),
  intent: z.string().optional(),
  previewOnly: z.boolean().optional(),
});

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  if (!rateLimit(`ai-msg:${ip}`, 40, 60000).success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  try {
    const body = schema.parse(await request.json());
    if (body.previewOnly) {
      const preview = await generateMessageBody(body);
      return NextResponse.json({ success: true, preview });
    }
    const notification = await sendMessage(body);
    return NextResponse.json({ success: true, notification });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Message failed" },
      { status: 400 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    notifications: store.notifications.slice(-100).reverse(),
  });
}
