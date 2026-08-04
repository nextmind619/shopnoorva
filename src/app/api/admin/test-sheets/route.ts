import { NextRequest, NextResponse } from "next/server";
import { appendOrderToSheets } from "@/lib/ai/integrations/google-sheets";
import { isGoogleSheetsConfigured } from "@/lib/ai/integrations/google-auth";
import { getIntegrationLogs } from "@/lib/ai/integrations/logger";
import { aiConfig } from "@/lib/ai/config";

export async function POST(request: NextRequest) {
  const secret = request.headers.get("x-cron-secret") || request.nextUrl.searchParams.get("secret");
  if (!secret || secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const orderNumber = `TEST-${Date.now()}`;

  try {
    await appendOrderToSheets({
      orderNumber,
      customerName: "Test Customer NOORVA",
      phone: "+212600000000",
      city: "Casablanca",
      address: "123 Test Street",
      notes: "Sheets diagnostic test — safe to delete",
      items: [{ sku: "Portable-air-cooler", quantity: 1, price: 199 }],
    });

    const logs = getIntegrationLogs(5).filter((l) => l.provider === "google_sheets");

    return NextResponse.json({
      ok: true,
      configured: isGoogleSheetsConfigured(),
      spreadsheetId: aiConfig.googleSheets.spreadsheetId,
      sheet: aiConfig.googleSheets.orderSheetName,
      testOrderNumber: orderNumber,
      recentLogs: logs,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        configured: isGoogleSheetsConfigured(),
        error: error instanceof Error ? error.message : "test_failed",
        recentLogs: getIntegrationLogs(5).filter((l) => l.provider === "google_sheets"),
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return POST(request);
}
