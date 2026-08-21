import { products } from "@/data/products";
import { store } from "@/lib/ai/memory-store";
import { securityStore } from "@/lib/security/store";
import {
  dayKeysInRange,
  getPreviousRange,
  isWithinRange,
  resolveDateRange,
} from "@/lib/analytics/date-range";
import { parseBrowser, parseDevice } from "@/lib/analytics/device";
import {
  classifyTrafficSource,
  platformFromSource,
  trafficSourceColor,
  trafficSourceLabel,
} from "@/lib/analytics/traffic";
import { generateInsights } from "@/lib/analytics/insights";
import {
  getGa4MeasurementId,
  getGtmId,
} from "@/lib/google/config";
import { platformFromAttribution } from "@/lib/google/attribution";
import type { StoredOrder } from "@/lib/ai/memory-store";
import type {
  AnalyticsDashboardData,
  AnalyticsNotification,
  DatePreset,
  FunnelStep,
  KpiMetrics,
  MarketingPlatformMetrics,
  PixelConfig,
  PixelStatus,
  TimeSeriesPoint,
  TrendMetric,
  TrafficSourceItem,
} from "@/types/analytics";

const MOROCCO_CITIES = new Set([
  "casablanca", "casa", "rabat", "marrakech", "marrakesh", "fes", "fès", "fez",
  "tangier", "tanger", "agadir", "meknes", "meknès", "oujda", "kenitra", "tétouan",
  "tetouan", "salé", "sale", "temara", "mohammedia", "el jadida", "nador", "settat",
]);

function trend(current: number, previous: number, sparkline: number[]): TrendMetric {
  const changePercent =
    previous === 0 ? (current > 0 ? 100 : 0) : Math.round(((current - previous) / previous) * 1000) / 10;
  return { value: current, previousValue: previous, changePercent, sparkline };
}

function ordersInRange(from: string, to: string) {
  return store.orders.filter(
    (o) => isWithinRange(o.createdAt, from, to) && o.status !== "cancelled"
  );
}

function logsInRange(from: string, to: string) {
  return securityStore.logs.filter(
    (l) => isWithinRange(l.createdAt, from, to) && l.decision !== "block"
  );
}

function estimateProfit(_revenue: number): number {
  return 0;
}

function getPixelStatus(envValue: string | undefined): PixelStatus {
  if (!envValue?.trim()) return "disconnected";
  return "connected";
}

function buildPixels(): PixelConfig[] {
  const ga4Id = getGa4MeasurementId();
  const gtmId = getGtmId();

  const configs = [
    { id: "facebook", name: "Facebook Pixel", envKey: process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID },
    { id: "tiktok", name: "TikTok Pixel", envKey: process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID },
    { id: "ga4", name: "Google Analytics 4", envKey: ga4Id },
    { id: "gtm", name: "Google Tag Manager", envKey: gtmId },
    { id: "snap", name: "Snap Pixel", envKey: process.env.NEXT_PUBLIC_SNAP_PIXEL_ID },
    { id: "pinterest", name: "Pinterest Pixel", envKey: process.env.NEXT_PUBLIC_PINTEREST_PIXEL_ID },
  ];

  const recentLog = securityStore.logs[0];

  return configs.map((c) => {
    const status = getPixelStatus(c.envKey);
    // GA4 + GTM both configured can double-count if tags overlap — warn, keep separate
    const warning = c.id === "ga4" && gtmId && ga4Id ? "warning" : status;
    return {
      id: c.id,
      name: c.name,
      pixelId: c.envKey?.trim() || null,
      status: warning === "warning" ? "warning" : status,
      lastEvent: recentLog ? "PageView" : null,
      lastEventAt: recentLog?.createdAt ?? null,
    };
  });
}

function buildTimeSeries(from: string, to: string): TimeSeriesPoint[] {
  return dayKeysInRange(from, to).map((day) => {
    const dayStart = `${day}T00:00:00.000Z`;
    const dayEnd = `${day}T23:59:59.999Z`;
    const dayOrders = ordersInRange(dayStart, dayEnd);
    const revenue = dayOrders.reduce((s, o) => s + o.total, 0);
    const visitors = new Set(logsInRange(dayStart, dayEnd).map((l) => l.ip)).size;
    const orders = dayOrders.length;
    return {
      date: day,
      revenue,
      orders,
      visitors,
      profit: estimateProfit(revenue),
      conversionRate: visitors ? Math.round((orders / visitors) * 1000) / 10 : 0,
    };
  });
}

function buildKpis(from: string, to: string, previous: { from: string; to: string }): KpiMetrics {
  const currentOrders = ordersInRange(from, to);
  const prevOrders = ordersInRange(previous.from, previous.to);
  const currentLogs = logsInRange(from, to);
  const prevLogs = logsInRange(previous.from, previous.to);

  const revenue = currentOrders.reduce((s, o) => s + o.total, 0);
  const prevRevenue = prevOrders.reduce((s, o) => s + o.total, 0);
  const orders = currentOrders.length;
  const prevOrdersCount = prevOrders.length;
  const visitors = new Set(currentLogs.map((l) => l.ip)).size;
  const prevVisitors = new Set(prevLogs.map((l) => l.ip)).size;
  const sessions = currentLogs.length;
  const prevSessions = prevLogs.length;
  const aov = orders ? Math.round(revenue / orders) : 0;
  const prevAov = prevOrdersCount ? Math.round(prevRevenue / prevOrdersCount) : 0;
  const conversion = visitors ? Math.round((orders / visitors) * 1000) / 10 : 0;
  const prevConversion = prevVisitors ? Math.round((prevOrdersCount / prevVisitors) * 1000) / 10 : 0;

  const series = buildTimeSeries(from, to);

  return {
    revenue: trend(revenue, prevRevenue, series.map((p) => p.revenue)),
    orders: trend(orders, prevOrdersCount, series.map((p) => p.orders)),
    conversionRate: trend(conversion, prevConversion, series.map((p) => p.conversionRate)),
    averageOrderValue: trend(aov, prevAov, series.map((p) => (p.orders ? Math.round(p.revenue / p.orders) : 0))),
    visitors: trend(visitors, prevVisitors, series.map((p) => p.visitors)),
    sessions: trend(sessions, prevSessions, series.map((p) => p.visitors)),
  };
}

function buildTrafficSources(from: string, to: string): TrafficSourceItem[] {
  const logs = logsInRange(from, to);
  const counts = new Map<string, number>();

  for (const log of logs) {
    let params: URLSearchParams | undefined;
    try {
      const url = new URL(log.pathname.startsWith("http") ? log.pathname : `https://x${log.pathname}`);
      params = url.searchParams;
    } catch {
      params = undefined;
    }
    const source = classifyTrafficSource(log.referer, params);
    counts.set(source, (counts.get(source) || 0) + 1);
  }

  const total = logs.length || 1;
  const order = ["facebook", "instagram", "tiktok", "google", "direct", "organic", "email", "other"];

  return order
    .filter((s) => counts.has(s))
    .map((source) => ({
      source,
      label: trafficSourceLabel(source),
      visitors: counts.get(source) || 0,
      percentage: Math.round(((counts.get(source) || 0) / total) * 1000) / 10,
      color: trafficSourceColor(source),
    }))
    .sort((a, b) => b.visitors - a.visitors);
}

function resolveOrderPlatform(order: StoredOrder, logs: ReturnType<typeof logsInRange>): string | null {
  // Prefer first-party attribution stored on the order (UTM / gclid)
  const fromAttr = platformFromAttribution(order.attribution || null);
  if (fromAttr) return fromAttr;

  if (order.attribution?.utm_source) {
    const params = new URLSearchParams();
    params.set("utm_source", order.attribution.utm_source);
    if (order.attribution.gclid) params.set("gclid", order.attribution.gclid);
    const source = classifyTrafficSource("", params);
    const platform = platformFromSource(source);
    if (platform) return platform;
  }

  // Fallback: IP/time window match against security visitor logs (legacy)
  const matchingLog = logs.find(
    (l) => l.ip && isWithinRange(order.createdAt, l.createdAt, order.createdAt),
  );
  if (!matchingLog) return null;

  let params: URLSearchParams | undefined;
  try {
    const url = new URL(
      matchingLog.pathname.startsWith("http") ? matchingLog.pathname : `https://x${matchingLog.pathname}`,
    );
    params = url.searchParams;
  } catch {
    params = undefined;
  }

  return platformFromSource(classifyTrafficSource(matchingLog.referer, params));
}

function buildMarketing(from: string, to: string): MarketingPlatformMetrics[] {
  const logs = logsInRange(from, to);
  const platformOrders = new Map<string, { revenue: number; orders: number; clicks: number }>();

  for (const log of logs) {
    let params: URLSearchParams | undefined;
    try {
      const url = new URL(log.pathname.startsWith("http") ? log.pathname : `https://x${log.pathname}`);
      params = url.searchParams;
    } catch {
      params = undefined;
    }
    const source = classifyTrafficSource(log.referer, params);
    const platform = platformFromSource(source);
    if (!platform) continue;
    const prev = platformOrders.get(platform) || { revenue: 0, orders: 0, clicks: 0 };
    prev.clicks += 1;
    platformOrders.set(platform, prev);
  }

  for (const order of ordersInRange(from, to)) {
    const platform = resolveOrderPlatform(order, logs);
    if (!platform) continue;
    const prev = platformOrders.get(platform) || { revenue: 0, orders: 0, clicks: 0 };
    prev.revenue += order.total;
    prev.orders += 1;
    platformOrders.set(platform, prev);
  }

  const defs: Array<{ platform: string; label: string; color: string }> = [
    { platform: "facebook", label: "Facebook", color: "#1877F2" },
    { platform: "instagram", label: "Instagram", color: "#E4405F" },
    { platform: "tiktok", label: "TikTok", color: "#000000" },
    { platform: "google", label: "Google", color: "#4285F4" },
  ];

  return defs.map(({ platform, label, color }) => {
    const data = platformOrders.get(platform) || { revenue: 0, orders: 0, clicks: 0 };
    // Spend stays 0 until Google Ads API / manual spend is connected — never invent spend
    const spend = 0;
    return {
      platform,
      label,
      spend,
      revenue: data.revenue,
      orders: data.orders,
      roas: spend > 0 ? Math.round((data.revenue / spend) * 100) / 100 : 0,
      cpa: data.orders > 0 && spend > 0 ? Math.round(spend / data.orders) : 0,
      cpc: data.clicks > 0 && spend > 0 ? Math.round((spend / data.clicks) * 100) / 100 : 0,
      ctr: data.clicks > 0 ? Math.round((data.orders / data.clicks) * 1000) / 10 : 0,
      cpm: data.clicks > 0 && spend > 0 ? Math.round((spend / data.clicks) * 1000) : 0,
      color,
    };
  });
}

function buildFunnel(from: string, to: string): FunnelStep[] {
  const logs = logsInRange(from, to);
  const visitors = new Set(logs.map((l) => l.ip)).size;
  const productViews = logs.filter((l) => /\/(ar|fr|en)\/product|\/product/.test(l.pathname)).length;
  const addToCart = store.carts.filter((c) => isWithinRange(c.createdAt, from, to)).length;
  const checkout = store.orders.filter(
    (o) => isWithinRange(o.createdAt, from, to)
  ).length;
  const purchases = ordersInRange(from, to).length;

  const steps = [
    { key: "visitors", label: "Visitors", count: visitors },
    { key: "productViews", label: "Product Views", count: Math.max(productViews, addToCart) },
    { key: "addToCart", label: "Add To Cart", count: addToCart },
    { key: "checkout", label: "Checkout", count: checkout },
    { key: "purchase", label: "Purchase", count: purchases },
  ];

  return steps.map((step, i) => {
    const prev = i === 0 ? step.count : steps[i - 1].count;
    const dropOffRate = prev > 0 ? Math.round(((prev - step.count) / prev) * 1000) / 10 : 0;
    return { ...step, dropOffRate: i === 0 ? 0 : dropOffRate };
  });
}

function buildNotifications(pixels: PixelConfig[]): AnalyticsNotification[] {
  const notifications: AnalyticsNotification[] = [];
  const now = new Date().toISOString();

  for (const pixel of pixels.filter((p) => p.status === "disconnected")) {
    notifications.push({
      id: `pixel-${pixel.id}`,
      type: "error",
      title: `${pixel.name} disconnected`,
      message: "Configure the pixel ID in environment variables to enable tracking.",
      createdAt: now,
    });
  }

  const lowStock = products.filter((p) => p.stock < 20);
  if (lowStock.length) {
    notifications.push({
      id: "low-stock",
      type: "warning",
      title: "Low stock alert",
      message: `${lowStock.length} product(s) below 20 units — ${lowStock[0].name.en}.`,
      createdAt: now,
    });
  }

  const abandoned = store.carts.filter((c) => !c.recovered);
  if (abandoned.length >= 3) {
    notifications.push({
      id: "cart-abandon",
      type: "warning",
      title: "High cart abandonment",
      message: `${abandoned.length} active abandoned carts need recovery.`,
      createdAt: now,
    });
  }

  const todayOrders = ordersInRange(
    new Date(new Date().setHours(0, 0, 0, 0)).toISOString(),
    new Date().toISOString()
  );
  if (todayOrders.length >= 5) {
    notifications.push({
      id: "sales-spike",
      type: "success",
      title: "Sales spike detected",
      message: `${todayOrders.length} orders today — above your daily average.`,
      createdAt: now,
    });
  }

  return notifications;
}

export function getAnalyticsDashboard(
  preset: DatePreset = "7d",
  fromParam?: string | null,
  toParam?: string | null
): AnalyticsDashboardData {
  const range = resolveDateRange(preset, fromParam, toParam);
  const previous = getPreviousRange(range);
  const kpis = buildKpis(range.from, range.to, previous);
  const timeSeries = buildTimeSeries(range.from, range.to);
  const trafficSources = buildTrafficSources(range.from, range.to);
  const marketing = buildMarketing(range.from, range.to);
  const funnel = buildFunnel(range.from, range.to);
  const pixels = buildPixels();

  const fiveMinAgo = Date.now() - 5 * 60 * 1000;
  const liveVisitors = securityStore.logs
    .filter((l) => new Date(l.createdAt).getTime() >= fiveMinAgo && l.decision !== "block")
    .slice(0, 20)
    .map((l) => ({
      id: l.id,
      page: l.pathname || "/",
      country: "Morocco",
      device: parseDevice(l.userAgent),
      since: l.createdAt,
    }));

  const countryMap = new Map<string, { visitors: number; orders: number; revenue: number }>();
  countryMap.set("MA", { visitors: 0, orders: 0, revenue: 0 });

  for (const log of logsInRange(range.from, range.to)) {
    const entry = countryMap.get("MA")!;
    entry.visitors += 1;
  }

  for (const order of ordersInRange(range.from, range.to)) {
    const city = order.city.toLowerCase();
    const code = MOROCCO_CITIES.has(city) || city ? "MA" : "INT";
    const entry = countryMap.get(code) || { visitors: 0, orders: 0, revenue: 0 };
    entry.orders += 1;
    entry.revenue += order.total;
    countryMap.set(code, entry);
  }

  const countries = Array.from(countryMap.entries()).map(([countryCode, data]) => ({
    country: countryCode === "MA" ? "Morocco" : "International",
    countryCode,
    ...data,
  }));

  const productStats = new Map<string, { views: number; addToCart: number; revenue: number; units: number }>();
  for (const log of logsInRange(range.from, range.to)) {
    const match = log.pathname.match(/\/product\/([^/?]+)/);
    if (!match) continue;
    const slug = match[1];
    const prev = productStats.get(slug) || { views: 0, addToCart: 0, revenue: 0, units: 0 };
    prev.views += 1;
    productStats.set(slug, prev);
  }

  for (const cart of store.carts.filter((c) => isWithinRange(c.createdAt, range.from, range.to))) {
    for (const item of cart.items) {
      const product = products.find((p) => p.id === item.productId);
      if (!product) continue;
      const prev = productStats.get(product.slug) || { views: 0, addToCart: 0, revenue: 0, units: 0 };
      prev.addToCart += item.quantity;
      productStats.set(product.slug, prev);
    }
  }

  for (const order of ordersInRange(range.from, range.to)) {
    for (const item of order.items) {
      const product = products.find((p) => p.sku === item.sku);
      const slug = product?.slug || item.sku;
      const prev = productStats.get(slug) || { views: 0, addToCart: 0, revenue: 0, units: 0 };
      prev.revenue += item.lineTotal;
      prev.units += item.quantity;
      productStats.set(slug, prev);
    }
  }

  const topProducts = products
    .map((p) => {
      const stats = productStats.get(p.slug) || { views: 0, addToCart: 0, revenue: 0, units: 0 };
      const conversionRate = stats.views ? Math.round((stats.units / stats.views) * 1000) / 10 : 0;
      return {
        id: p.id,
        sku: p.sku,
        name: p.name.en,
        image: p.images[0]?.url ?? null,
        views: stats.views,
        addToCart: stats.addToCart,
        conversionRate,
        revenue: stats.revenue,
        profit: estimateProfit(stats.revenue),
        stock: p.stock,
      };
    })
    .filter((p) => p.revenue > 0 || p.views > 0)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 10);

  const phonesInRange = new Set<string>();
  const phoneCounts = new Map<string, number>();
  for (const order of ordersInRange(range.from, range.to)) {
    phonesInRange.add(order.phone);
    phoneCounts.set(order.phone, (phoneCounts.get(order.phone) || 0) + 1);
  }
  const allTimePhones = new Set(store.orders.map((o) => o.phone));
  const newCustomers = [...phonesInRange].filter((p) => {
    const firstOrder = store.orders.find((o) => o.phone === p);
    return firstOrder && isWithinRange(firstOrder.createdAt, range.from, range.to);
  }).length;
  const returningCustomers = [...phonesInRange].filter((p) => allTimePhones.has(p)).length - newCustomers;
  const repeatCustomers = [...phoneCounts.values()].filter((c) => c > 1).length;
  const repeatRate = phonesInRange.size ? Math.round((repeatCustomers / phonesInRange.size) * 1000) / 10 : 0;
  const totalCustomerRevenue = ordersInRange(range.from, range.to).reduce((s, o) => s + o.total, 0);
  const ltv = phonesInRange.size ? Math.round(totalCustomerRevenue / phonesInRange.size) : 0;
  const avgOrders = phonesInRange.size
    ? Math.round((ordersInRange(range.from, range.to).length / phonesInRange.size) * 10) / 10
    : 0;

  const cartsInRange = store.carts.filter((c) => isWithinRange(c.createdAt, range.from, range.to));
  const recovered = cartsInRange.filter((c) => c.recovered);
  const revenueLost = cartsInRange.filter((c) => !c.recovered).reduce((s, c) => s + c.subtotal, 0);
  const revenueRecovered = recovered.reduce((s, c) => s + c.subtotal, 0);

  const deviceCounts = { desktop: 0, mobile: 0, tablet: 0 };
  const osCounts = { chrome: 0, safari: 0, edge: 0, firefox: 0, other: 0 };
  for (const log of logsInRange(range.from, range.to)) {
    deviceCounts[parseDevice(log.userAgent)] += 1;
    osCounts[parseBrowser(log.userAgent)] += 1;
  }

  const insights = generateInsights({ kpis, trafficSources, marketing, funnel, countries, timeSeries });
  const notifications = buildNotifications(pixels);

  return {
    range,
    generatedAt: new Date().toISOString(),
    kpis,
    timeSeries,
    trafficSources,
    marketing,
    funnel,
    pixels,
    liveVisitors,
    countries,
    topProducts,
    customers: {
      newCustomers: Math.max(newCustomers, 0),
      returningCustomers: Math.max(returningCustomers, 0),
      repeatRate,
      lifetimeValue: ltv,
      averageOrders: avgOrders,
    },
    abandonedCarts: {
      total: cartsInRange.length,
      recovered: recovered.length,
      recoveryRate: cartsInRange.length ? Math.round((recovered.length / cartsInRange.length) * 1000) / 10 : 0,
      revenueLost,
      revenueRecovered,
    },
    devices: deviceCounts,
    operatingSystems: osCounts,
    insights,
    notifications,
  };
}
