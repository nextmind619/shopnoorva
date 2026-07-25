/**
 * Meta Conversions API endpoint.
 *
 * Browser helpers POST here so the access token never reaches the UI.
 * Hashes email / phone / names / city / state / country with SHA-256,
 * and enriches with client IP + User-Agent from the request.
 */

import { NextRequest, NextResponse } from "next/server";
import { sendFacebookConversion } from "@/lib/facebook/conversions";
import { getClientIp } from "@/lib/rate-limit";
import { rateLimit } from "@/lib/rate-limit";
import type { FacebookCustomData, FacebookStandardEvent, FacebookUserDataInput } from "@/lib/facebook/types";

const ALLOWED_EVENTS = new Set<FacebookStandardEvent>([
  "PageView",
  "ViewContent",
  "AddToCart",
  "InitiateCheckout",
  "Purchase",
  "Lead",
  "Contact",
]);

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const limited = rateLimit(`fb-capi:${ip}`, 60, 60_000);
  if (!limited.success) {
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }

  try {
    const body = (await request.json()) as {
      eventName?: string;
      eventId?: string;
      eventSourceUrl?: string;
      referrerUrl?: string;
      customData?: FacebookCustomData;
      userData?: FacebookUserDataInput;
      eventTime?: number;
    };

    if (!body.eventName || !ALLOWED_EVENTS.has(body.eventName as FacebookStandardEvent)) {
      return NextResponse.json({ ok: false, error: "invalid_event" }, { status: 400 });
    }

    if (!body.eventId || typeof body.eventId !== "string" || body.eventId.length > 128) {
      return NextResponse.json({ ok: false, error: "invalid_event_id" }, { status: 400 });
    }

    const userAgent = request.headers.get("user-agent") || undefined;
    // Prefer explicit referrer from client; fall back to HTTP Referer
    const referrerUrl =
      body.referrerUrl || request.headers.get("referer") || undefined;

    const result = await sendFacebookConversion(
      {
        eventName: body.eventName as FacebookStandardEvent,
        eventId: body.eventId,
        eventSourceUrl: body.eventSourceUrl,
        referrerUrl,
        customData: body.customData,
        userData: body.userData,
        eventTime: body.eventTime,
        actionSource: "website",
      },
      {
        requestUserData: {
          clientIpAddress: ip,
          clientUserAgent: userAgent,
        },
      },
    );

    // Never return access token or raw PII
    return NextResponse.json({
      ok: result.ok,
      eventsReceived: result.eventsReceived,
      dryRun: result.dryRun,
      // Surface error message only — no secrets
      error: result.error,
    });
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_payload" }, { status: 400 });
  }
}

/** Health check — does not leak whether the token is set. */
export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "facebook-conversions-api",
  });
}
