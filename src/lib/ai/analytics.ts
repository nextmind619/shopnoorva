import { store, type DailyAnalytics } from "./memory-store";
import { generateText } from "./openai";
import { predictBestSellers, predictDemand } from "./inventory";
import { uploadTextObject } from "./integrations/minio";
import { syncAnalyticsToSheets } from "./integrations/google-sheets";
import { triggerN8n } from "./integrations/n8n";

function dayKey(date = new Date()): string {
  return date.toISOString().slice(0, 10);
}

export async function generateDailyAnalytics(date = new Date()): Promise<{
  analytics: DailyAnalytics;
  report: string;
  reportUrl?: string;
}> {
  const day = dayKey(date);
  const start = new Date(`${day}T00:00:00.000Z`).getTime();
  const end = start + 24 * 60 * 60 * 1000;

  const dayOrders = store.orders.filter((o) => {
    const t = new Date(o.createdAt).getTime();
    return t >= start && t < end && o.status !== "cancelled";
  });
  const blocked = store.orders.filter((o) => {
    const t = new Date(o.createdAt).getTime();
    return t >= start && t < end && (o.status === "cancelled" || o.isDuplicate);
  });

  const revenue = dayOrders.reduce((s, o) => s + o.total, 0);
  const abandoned = store.carts.filter((c) => {
    const t = new Date(c.createdAt).getTime();
    return t >= start && t < end;
  });
  const recovered = abandoned.filter((c) => c.recovered);
  const recoveryRevenue = recovered.reduce((s, c) => s + c.subtotal, 0);

  const productMap = new Map<string, { sku: string; name: string; units: number; revenue: number }>();
  for (const order of dayOrders) {
    for (const item of order.items) {
      const prev = productMap.get(item.sku) || {
        sku: item.sku,
        name: item.name,
        units: 0,
        revenue: 0,
      };
      prev.units += item.quantity;
      prev.revenue += item.lineTotal;
      productMap.set(item.sku, prev);
    }
  }

  const analytics: DailyAnalytics = {
    day,
    ordersCount: dayOrders.length,
    revenue,
    aov: dayOrders.length ? Math.round(revenue / dayOrders.length) : 0,
    abandonedCarts: abandoned.length,
    recoveredCarts: recovered.length,
    recoveryRevenue,
    fakeOrdersBlocked: blocked.filter((o) => o.fraudScore >= 70 && !o.isDuplicate).length,
    duplicatesBlocked: blocked.filter((o) => o.isDuplicate).length,
    messagesSent: store.notifications.filter((n) => {
      const t = new Date(n.createdAt).getTime();
      return t >= start && t < end && n.status === "sent";
    }).length,
    aiReplies: store.conversations.reduce((count, c) => {
      return (
        count +
        c.messages.filter((m) => {
          const t = new Date(m.createdAt).getTime();
          return m.aiGenerated && t >= start && t < end;
        }).length
      );
    }, 0),
    topProducts: Array.from(productMap.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5),
  };

  const existingIdx = store.daily.findIndex((d) => d.day === day);
  if (existingIdx >= 0) store.daily[existingIdx] = analytics;
  else store.daily.push(analytics);

  const report = await generateText(
    "You are NOORVA analytics AI. Write a crisp daily executive report in French with bullets and next actions.",
    JSON.stringify({
      analytics,
      bestSellerForecast: predictBestSellers(5),
      stockWatch: predictDemand().filter((p) => p.action !== "ok").slice(0, 5),
    })
  );

  const reportUrl = await uploadTextObject(
    `reports/daily/${day}.md`,
    `# NOORVA Daily Report — ${day}\n\n${report}\n\n\`\`\`json\n${JSON.stringify(analytics, null, 2)}\n\`\`\`\n`,
    "text/markdown"
  );

  await syncAnalyticsToSheets(analytics);
  await triggerN8n("daily-analytics", { analytics, reportUrl });

  return { analytics, report, reportUrl };
}

export async function generateMonthlyAnalytics(date = new Date()): Promise<{
  month: string;
  summary: {
    ordersCount: number;
    revenue: number;
    aov: number;
    recoveryRate: number;
    fraudRate: number;
  };
  bestSellers: ReturnType<typeof predictBestSellers>;
  stockPredictions: ReturnType<typeof predictDemand>;
  report: string;
  reportUrl?: string;
}> {
  const month = `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-01`;
  const monthPrefix = month.slice(0, 7);

  const monthOrders = store.orders.filter((o) => o.createdAt.startsWith(monthPrefix));
  const valid = monthOrders.filter((o) => o.status !== "cancelled");
  const revenue = valid.reduce((s, o) => s + o.total, 0);
  const abandoned = store.carts.filter((c) => c.createdAt.startsWith(monthPrefix));
  const recovered = abandoned.filter((c) => c.recovered);
  const fraudish = monthOrders.filter((o) => o.fraudScore >= 70 || o.isDuplicate);

  const summary = {
    ordersCount: valid.length,
    revenue,
    aov: valid.length ? Math.round(revenue / valid.length) : 0,
    recoveryRate: abandoned.length ? Math.round((recovered.length / abandoned.length) * 100) : 0,
    fraudRate: monthOrders.length ? Math.round((fraudish.length / monthOrders.length) * 100) : 0,
  };

  const bestSellers = predictBestSellers(8);
  const stockPredictions = predictDemand();

  const report = await generateText(
    "You are NOORVA monthly analytics AI. Produce a board-ready monthly report in French.",
    JSON.stringify({ month: monthPrefix, summary, bestSellers, stockPredictions: stockPredictions.slice(0, 10) })
  );

  const reportUrl = await uploadTextObject(
    `reports/monthly/${monthPrefix}.md`,
    `# NOORVA Monthly Report — ${monthPrefix}\n\n${report}`,
    "text/markdown"
  );

  await triggerN8n("monthly-analytics", { month: monthPrefix, summary, reportUrl });

  return { month: monthPrefix, summary, bestSellers, stockPredictions, report, reportUrl };
}
