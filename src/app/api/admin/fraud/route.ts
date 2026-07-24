import { NextRequest, NextResponse } from "next/server";
import {
  addToBlacklist,
  clearOrderRateLimits,
  getBlacklist,
  getFraudDashboardStats,
  getFraudLogs,
  removeFromBlacklist,
  type BlacklistType,
} from "@/lib/fraud";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const limit = Math.min(Number(searchParams.get("limit") || 100), 500);
  const type = searchParams.get("type") as BlacklistType | null;

  return NextResponse.json({
    stats: getFraudDashboardStats(),
    logs: getFraudLogs(limit),
    blacklist: type ? getBlacklist(type) : getBlacklist(),
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const action = body.action as string;

    if (action === "blacklist") {
      const entry = addToBlacklist({
        type: body.type,
        value: body.value,
        reason: body.reason || "manual",
        source: "manual",
      });
      return NextResponse.json({ success: true, entry });
    }

    if (action === "unblacklist") {
      const ok = removeFromBlacklist(body.id);
      return NextResponse.json({ success: ok });
    }

    if (action === "clear-rate-limit") {
      const removed = clearOrderRateLimits({
        phone: body.phone,
        ip: body.ip,
        fingerprint: body.fingerprint,
        deviceId: body.deviceId,
      });
      return NextResponse.json({ success: true, removed });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed" },
      { status: 400 }
    );
  }
}
