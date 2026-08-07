import type {
  AnalyticsInsight,
  CountryMetric,
  FunnelStep,
  KpiMetrics,
  MarketingPlatformMetrics,
  TimeSeriesPoint,
  TrafficSourceItem,
} from "@/types/analytics";

interface InsightInput {
  kpis: KpiMetrics;
  trafficSources: TrafficSourceItem[];
  marketing: MarketingPlatformMetrics[];
  funnel: FunnelStep[];
  countries: CountryMetric[];
  timeSeries: TimeSeriesPoint[];
}

export function generateInsights(input: InsightInput): AnalyticsInsight[] {
  const insights: AnalyticsInsight[] = [];
  let id = 0;
  const nextId = () => `insight-${++id}`;

  const { kpis, trafficSources, marketing, funnel, countries, timeSeries } = input;

  if (kpis.revenue.changePercent !== 0) {
    insights.push({
      id: nextId(),
      type: kpis.revenue.changePercent > 0 ? "positive" : "negative",
      title:
        kpis.revenue.changePercent > 0
          ? `Revenue increased ${Math.abs(kpis.revenue.changePercent)}%`
          : `Revenue decreased ${Math.abs(kpis.revenue.changePercent)}%`,
      description: `Compared to the previous period (${kpis.revenue.previousValue.toLocaleString()} → ${kpis.revenue.value.toLocaleString()} MAD).`,
    });
  }

  const fb = marketing.find((m) => m.platform === "facebook");
  const tt = marketing.find((m) => m.platform === "tiktok");
  if (fb && tt && (fb.revenue > 0 || tt.revenue > 0)) {
    const leader = tt.revenue > fb.revenue ? "TikTok" : "Facebook";
    const laggard = tt.revenue > fb.revenue ? "Facebook" : "TikTok";
    if (Math.abs(tt.revenue - fb.revenue) > 0) {
      insights.push({
        id: nextId(),
        type: "neutral",
        title: `${leader} is outperforming ${laggard}`,
        description: `${leader} drove ${Math.max(tt.revenue, fb.revenue).toLocaleString()} MAD vs ${Math.min(tt.revenue, fb.revenue).toLocaleString()} MAD in attributed revenue.`,
      });
    }
  }

  if (timeSeries.length >= 4) {
    const evening = timeSeries.filter((p) => {
      const hour = new Date(p.date).getHours();
      return hour >= 19;
    });
    const daytime = timeSeries.filter((p) => {
      const hour = new Date(p.date).getHours();
      return hour < 19;
    });
    const eveningConv =
      evening.reduce((s, p) => s + p.conversionRate, 0) / (evening.length || 1);
    const dayConv =
      daytime.reduce((s, p) => s + p.conversionRate, 0) / (daytime.length || 1);
    if (dayConv > 0 && eveningConv < dayConv * 0.85) {
      insights.push({
        id: nextId(),
        type: "negative",
        title: "Conversion drops in late hours",
        description: "Evening conversion rate trails daytime performance — review checkout UX after 7 PM.",
      });
    }
  }

  const topCountry = countries.sort((a, b) => b.visitors - a.visitors)[0];
  if (topCountry && topCountry.visitors > 0) {
    insights.push({
      id: nextId(),
      type: "neutral",
      title: `Most visitors are from ${topCountry.country}`,
      description: `${topCountry.visitors.toLocaleString()} visitors and ${topCountry.orders} orders in this period.`,
    });
  }

  const topSource = trafficSources[0];
  if (topSource && topSource.percentage > 30) {
    insights.push({
      id: nextId(),
      type: "recommendation",
      title: `Scale ${topSource.label} acquisition`,
      description: `${topSource.label} accounts for ${topSource.percentage}% of traffic — consider increasing budget by 20%.`,
    });
  }

  const cartStep = funnel.find((f) => f.key === "addToCart");
  const purchaseStep = funnel.find((f) => f.key === "purchase");
  if (cartStep && purchaseStep && cartStep.count > 0) {
    const cartToPurchase = Math.round((purchaseStep.count / cartStep.count) * 100);
    if (cartToPurchase < 40) {
      insights.push({
        id: nextId(),
        type: "recommendation",
        title: "Improve cart-to-purchase flow",
        description: `Only ${cartToPurchase}% of carts convert — enable recovery messages and simplify checkout.`,
      });
    }
  }

  if (kpis.conversionRate.changePercent < -5) {
    insights.push({
      id: nextId(),
      type: "negative",
      title: "Conversion rate declining",
      description: `Down ${Math.abs(kpis.conversionRate.changePercent)}% vs previous period. Review landing pages and ad targeting.`,
    });
  }

  return insights.slice(0, 6);
}
