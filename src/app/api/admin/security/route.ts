import { NextRequest, NextResponse } from "next/server";
import {
  addSecurityBlacklist,
  getSecurityBlacklist,
  getSecurityLogs,
  getSecurityStats,
} from "@/lib/security";

export async function GET() {
  return NextResponse.json({
    stats: getSecurityStats(),
    logs: getSecurityLogs(150),
    blacklist: getSecurityBlacklist(),
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (body.action === "blacklist") {
      const entry = addSecurityBlacklist({
        type: body.type || "ip",
        value: body.value,
        reason: body.reason || "manual",
        source: "manual",
      });
      return NextResponse.json({ success: true, entry });
    }
    return NextResponse.json({ error: "unknown_action" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "failed" }, { status: 400 });
  }
}
