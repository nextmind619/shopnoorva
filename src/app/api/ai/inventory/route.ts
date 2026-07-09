import { NextResponse } from "next/server";
import {
  predictBestSellers,
  predictDemand,
  autoReorderProducts,
  generateInventoryNarrative,
} from "@/lib/ai/inventory";
import { store } from "@/lib/ai/memory-store";

export async function GET() {
  const predictions = predictDemand();
  const bestSellers = predictBestSellers();
  const narrative = await generateInventoryNarrative();

  return NextResponse.json({
    success: true,
    inventory: store.inventory,
    predictions,
    bestSellers,
    stockAlerts: store.stockAlerts,
    purchaseOrders: store.purchaseOrders,
    narrative,
  });
}

export async function POST() {
  const result = await autoReorderProducts();
  return NextResponse.json({ success: true, ...result });
}
