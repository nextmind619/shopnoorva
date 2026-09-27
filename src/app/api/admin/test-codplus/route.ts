import { NextRequest, NextResponse } from "next/server";
import { sendLeadToCodplus, getCodplusConfigSummary } from "@/lib/ai/integrations/codplus";
import { getIntegrationLogs } from "@/lib/ai/integrations/logger";

function isAuthorized(request: NextRequest): boolean {
  const secret = request.headers.get("x-cron-secret") || request.nextUrl.searchParams.get("secret");
  return Boolean(secret && secret === process.env.CRON_SECRET);
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sku = request.nextUrl.searchParams.get("sku")?.trim() || "FoldableWasher";
  const orderNumber = `TEST-CODPLUS-${Date.now()}`;
  const result = await sendLeadToCodplus({
    orderNumber,
    customerName: "Test Customer NOORVA",
    phone: "+212600000000",
    city: "Casablanca",
    address: "123 Test Street",
    notes: `Codplus webhook test SKU=${sku} — safe to delete | CodPlus gift SKU ShowerFilter (test note)`,
    items: [{ sku, quantity: 1, price: 399 }],
  });

  return NextResponse.json({
    ok: result.ok,
    config: getCodplusConfigSummary(),
    result,
    testOrderNumber: orderNumber,
    recentLogs: getIntegrationLogs(5).filter((l) => l.provider === "codplus"),
  }, { status: result.ok ? 200 : 500 });
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({
    config: getCodplusConfigSummary(),
    recentLogs: getIntegrationLogs(10).filter((l) => l.provider === "codplus"),
  });
}
