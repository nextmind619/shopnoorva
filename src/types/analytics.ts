export type DatePreset = "today" | "yesterday" | "7d" | "30d" | "90d" | "custom";

export interface DateRange {
  preset: DatePreset;
  from: string;
  to: string;
  label: string;
}

export interface TrendMetric {
  value: number;
  previousValue: number;
  changePercent: number;
  sparkline: number[];
}

export interface KpiMetrics {
  revenue: TrendMetric;
  orders: TrendMetric;
  conversionRate: TrendMetric;
  averageOrderValue: TrendMetric;
  visitors: TrendMetric;
  sessions: TrendMetric;
}

export interface TimeSeriesPoint {
  date: string;
  revenue: number;
  orders: number;
  visitors: number;
  profit: number;
  conversionRate: number;
}

export type ChartMetric = "revenue" | "orders" | "visitors" | "profit";

export interface TrafficSourceItem {
  source: string;
  label: string;
  visitors: number;
  percentage: number;
  color: string;
}

export interface MarketingPlatformMetrics {
  platform: string;
  label: string;
  spend: number;
  revenue: number;
  orders: number;
  roas: number;
  cpa: number;
  cpc: number;
  ctr: number;
  cpm: number;
  color: string;
}

export interface FunnelStep {
  key: string;
  label: string;
  count: number;
  dropOffRate: number;
}

export type PixelStatus = "connected" | "disconnected" | "warning";

export interface PixelConfig {
  id: string;
  name: string;
  pixelId: string | null;
  status: PixelStatus;
  lastEvent: string | null;
  lastEventAt: string | null;
}

export interface LiveVisitor {
  id: string;
  page: string;
  country: string;
  device: "desktop" | "tablet" | "mobile";
  since: string;
}

export interface CountryMetric {
  country: string;
  countryCode: string;
  visitors: number;
  orders: number;
  revenue: number;
}

export interface TopProductRow {
  id: string;
  sku: string;
  name: string;
  image: string | null;
  views: number;
  addToCart: number;
  conversionRate: number;
  revenue: number;
  profit: number;
  stock: number;
}

export interface CustomerMetrics {
  newCustomers: number;
  returningCustomers: number;
  repeatRate: number;
  lifetimeValue: number;
  averageOrders: number;
}

export interface AbandonedCartMetrics {
  total: number;
  recovered: number;
  recoveryRate: number;
  revenueLost: number;
  revenueRecovered: number;
}

export interface DeviceBreakdown {
  desktop: number;
  mobile: number;
  tablet: number;
}

export interface OsBreakdown {
  chrome: number;
  safari: number;
  edge: number;
  firefox: number;
  other: number;
}

export interface AnalyticsInsight {
  id: string;
  type: "positive" | "negative" | "neutral" | "recommendation";
  title: string;
  description: string;
}

export interface AnalyticsNotification {
  id: string;
  type: "error" | "warning" | "success" | "info";
  title: string;
  message: string;
  createdAt: string;
}

export interface AnalyticsDashboardData {
  range: DateRange;
  generatedAt: string;
  kpis: KpiMetrics;
  timeSeries: TimeSeriesPoint[];
  trafficSources: TrafficSourceItem[];
  marketing: MarketingPlatformMetrics[];
  funnel: FunnelStep[];
  pixels: PixelConfig[];
  liveVisitors: LiveVisitor[];
  countries: CountryMetric[];
  topProducts: TopProductRow[];
  customers: CustomerMetrics;
  abandonedCarts: AbandonedCartMetrics;
  devices: DeviceBreakdown;
  operatingSystems: OsBreakdown;
  insights: AnalyticsInsight[];
  notifications: AnalyticsNotification[];
}
