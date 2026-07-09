import { products } from "@/data/products";
import { store, uid, type PurchaseOrder, type StockAlert } from "./memory-store";
import { generateText } from "./openai";
import { sendMessage } from "./messaging";
import { aiConfig } from "./config";

export interface DemandPrediction {
  sku: string;
  name: string;
  currentStock: number;
  soldProxy: number;
  predictedDemand30d: number;
  daysOfCover: number;
  reorderPoint: number;
  suggestedReorderQty: number;
  action: "ok" | "watch" | "reorder";
}

export function predictDemand(): DemandPrediction[] {
  return products.map((p) => {
    const currentStock = store.inventory[p.sku] ?? p.stock;
    // Use soldCount as historical signal; normalize to ~30d proxy
    const soldProxy = Math.max(5, Math.round(p.soldCount / 24));
    const trendBoost = p.isTrending || p.isTikTokViral ? 1.35 : 1;
    const predictedDemand30d = Math.round(soldProxy * trendBoost);
    const reorderPoint = Math.max(15, Math.round(predictedDemand30d * 0.35));
    const daysOfCover =
      predictedDemand30d > 0 ? Math.round((currentStock / predictedDemand30d) * 30) : 999;
    const suggestedReorderQty = Math.max(
      20,
      Math.round(predictedDemand30d * aiConfig.automation.lowStockMultiplier - currentStock)
    );

    let action: DemandPrediction["action"] = "ok";
    if (currentStock <= reorderPoint) action = "reorder";
    else if (daysOfCover < 20) action = "watch";

    return {
      sku: p.sku,
      name: p.name.fr,
      currentStock,
      soldProxy,
      predictedDemand30d,
      daysOfCover,
      reorderPoint,
      suggestedReorderQty: Math.max(0, suggestedReorderQty),
      action,
    };
  });
}

export function predictBestSellers(limit = 5): Array<{
  sku: string;
  name: string;
  score: number;
  reason: string;
}> {
  return products
    .map((p) => {
      const stock = store.inventory[p.sku] ?? p.stock;
      let score = p.soldCount * 0.4 + p.rating * 80 + p.reviewCount * 0.05;
      if (p.isBestSeller) score += 200;
      if (p.isTrending) score += 150;
      if (p.isTikTokViral) score += 180;
      if (stock < 30) score -= 80;

      const reasons = [];
      if (p.isTikTokViral) reasons.push("TikTok viral");
      if (p.isTrending) reasons.push("trending");
      if (p.isBestSeller) reasons.push("bestseller");
      reasons.push(`${p.soldCount} lifetime units`);

      return {
        sku: p.sku,
        name: p.name.fr,
        score: Math.round(score),
        reason: reasons.join(" · "),
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

export async function autoReorderProducts(): Promise<{
  alerts: StockAlert[];
  purchaseOrders: PurchaseOrder[];
}> {
  const predictions = predictDemand();
  const alerts: StockAlert[] = [];
  const purchaseOrders: PurchaseOrder[] = [];

  for (const pred of predictions.filter((p) => p.action === "reorder")) {
    const existingOpen = store.stockAlerts.find(
      (a) => a.sku === pred.sku && a.status === "open"
    );
    if (existingOpen) continue;

    const alert: StockAlert = {
      id: uid("alert"),
      sku: pred.sku,
      productName: pred.name,
      currentStock: pred.currentStock,
      reorderPoint: pred.reorderPoint,
      suggestedQty: pred.suggestedReorderQty,
      status: "open",
      autoPoCreated: false,
      createdAt: new Date().toISOString(),
    };
    store.stockAlerts.push(alert);
    alerts.push(alert);

    const po: PurchaseOrder = {
      id: uid("po"),
      poNumber: `PO-${Date.now().toString(36).toUpperCase()}`,
      sku: pred.sku,
      quantity: pred.suggestedReorderQty,
      status: "draft",
      createdAt: new Date().toISOString(),
    };
    store.purchaseOrders.push(po);
    purchaseOrders.push(po);
    alert.autoPoCreated = true;
    alert.status = "ordered";
    po.status = "sent";

    // Simulate inbound stock replenishment booking (not received yet)
    await sendMessage({
      channel: "email",
      recipient: "ops@shopnoorva.shop",
      subject: `Auto reorder ${pred.sku}`,
      body: `Purchase order ${po.poNumber} created for ${pred.name}: ${po.quantity} units. Current stock: ${pred.currentStock}.`,
      intent: "internal purchase order notification",
      generateWithAi: true,
    });
  }

  return { alerts, purchaseOrders };
}

export async function generateInventoryNarrative(): Promise<string> {
  const predictions = predictDemand();
  const best = predictBestSellers(5);
  return generateText(
    "You are NOORVA inventory AI. Write a concise ops briefing in French.",
    JSON.stringify({ predictions: predictions.slice(0, 8), bestSellers: best })
  );
}

export function decrementStock(sku: string, qty: number): void {
  if (store.inventory[sku] === undefined) store.inventory[sku] = 100;
  store.inventory[sku] = Math.max(0, store.inventory[sku] - qty);
}
