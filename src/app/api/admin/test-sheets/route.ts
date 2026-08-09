import { NextRequest, NextResponse } from "next/server";
import { appendOrderToSheets, diagnoseGoogleSheets } from "@/lib/ai/integrations/google-sheets";
import { getGoogleSheetsConfigSummary } from "@/lib/ai/integrations/google-auth";
import { getIntegrationLogs } from "@/lib/ai/integrations/logger";
import { store } from "@/lib/ai/memory-store";

function isAuthorized(request: NextRequest): boolean {
  const secret = request.headers.get("x-cron-secret") || request.nextUrl.searchParams.get("secret");
  return Boolean(secret && secret === process.env.CRON_SECRET);
}

function orderToSheetPayload(order: (typeof store.orders)[number]) {
  const noteParts: string[] = [];
  if (order.isDuplicate) noteParts.push("[DUPLICATE]");

  return {
    orderNumber: order.orderNumber,
    customerName: [order.firstName, order.lastName].filter(Boolean).join(" ") || "Client",
    phone: order.phone,
    city: order.city,
    address: order.address,
    notes: noteParts.length ? noteParts.join(" ") : undefined,
    items: order.items.map((item, index, arr) => ({
      sku: item.sku,
      quantity: item.quantity,
      price:
        arr.length === 1
          ? order.total
          : index === 0
            ? item.lineTotal + order.shipping - order.discount
            : item.lineTotal,
    })),
  };
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const mode = request.nextUrl.searchParams.get("mode") || "append";
  const resyncOrderNumber = request.nextUrl.searchParams.get("resync");
  const orderNumber = resyncOrderNumber || `TEST-${Date.now()}`;

  const diagnosis = await diagnoseGoogleSheets();
  if (mode === "diagnose") {
    return NextResponse.json({
      config: getGoogleSheetsConfigSummary(),
      diagnosis,
      recentLogs: getIntegrationLogs(10).filter((l) => l.provider === "google_sheets"),
    });
  }

  let appendResult;
  if (resyncOrderNumber) {
    const order = store.orders.find((o) => o.orderNumber === resyncOrderNumber);
    if (!order) {
      return NextResponse.json({ error: "Order not found in memory store", orderNumber: resyncOrderNumber }, { status: 404 });
    }
    if (order.status !== "confirmed" && order.status !== "review") {
      return NextResponse.json({ error: "Order status not eligible for sheet sync", status: order.status }, { status: 400 });
    }
    appendResult = await appendOrderToSheets(orderToSheetPayload(order));
  } else {
    appendResult = await appendOrderToSheets({
      orderNumber,
      customerName: "Test Customer NOORVA",
      phone: "+212600000000",
      city: "Casablanca",
      address: "123 Test Street",
      notes: "Sheets diagnostic test — safe to delete",
      items: [{ sku: "Portable-air-cooler", quantity: 1, price: 199 }],
    });
  }

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
