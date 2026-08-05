import { NextRequest, NextResponse } from "next/server";
import { appendOrderToSheets, diagnoseGoogleSheets } from "@/lib/ai/integrations/google-sheets";
import { getGoogleSheetsConfigSummary } from "@/lib/ai/integrations/google-auth";
import { getIntegrationLogs } from "@/lib/ai/integrations/logger";

function isAuthorized(request: NextRequest): boolean {
  const secret = request.headers.get("x-cron-secret") || request.nextUrl.searchParams.get("secret");
  return Boolean(secret && secret === process.env.CRON_SECRET);
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const mode = request.nextUrl.searchParams.get("mode") || "append";
  const orderNumber = `TEST-${Date.now()}`;

  const diagnosis = await diagnoseGoogleSheets();
  if (mode === "diagnose") {
    return NextResponse.json({
      config: getGoogleSheetsConfigSummary(),
      diagnosis,
      recentLogs: getIntegrationLogs(10).filter((l) => l.provider === "google_sheets"),
    });
  }

  const appendResult = await appendOrderToSheets({
    orderNumber,
    customerName: "Test Customer NOORVA",
    phone: "+212600000000",
    city: "Casablanca",
    address: "123 Test Street",
    notes: "Sheets diagnostic test — safe to delete",
    items: [{ sku: "Portable-air-cooler", quantity: 1, price: 199 }],
  });

  const recentLogs = getIntegrationLogs(5).filter((l) => l.provider === "google_sheets");
  const lastLog = recentLogs[0];

  return NextResponse.json({
    ok: appendResult.ok,
    config: getGoogleSheetsConfigSummary(),
    diagnosis,
    appendResult,
    testOrderNumber: orderNumber,
    lastLog,
    recentLogs,
  }, { status: appendResult.ok ? 200 : 500 });
}

export async function GET(request: NextRequest) {
  return POST(request);
}
