import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { answerCustomer } from "@/lib/ai/support";
import { sendMessage } from "@/lib/ai/messaging";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

const schema = z.object({
  message: z.string().min(1).max(2000),
  channel: z.enum(["whatsapp", "email", "sms", "web"]).default("web"),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  locale: z.enum(["ar", "fr", "en"]).optional(),
  conversationId: z.string().optional(),
  autoReplyChannel: z.boolean().optional(),
});

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const limited = rateLimit(`ai-support:${ip}`, 30, 60000);
  if (!limited.success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  try {
    const body = schema.parse(await request.json());
    const result = await answerCustomer(body);

    if (body.autoReplyChannel && body.channel === "whatsapp" && body.phone) {
      await sendMessage({
        channel: "whatsapp",
        recipient: body.phone,
        body: result.reply,
        locale: body.locale,
      });
    }

    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Support failed" },
      { status: 400 }
    );
  }
}
