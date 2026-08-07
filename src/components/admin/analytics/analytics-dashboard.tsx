"use client";

import { motion } from "motion/react";
import { formatPrice } from "@/lib/utils";
import { AnalyticsSkeleton } from "@/components/admin/ui/skeleton";
import { KpiCard } from "@/components/admin/analytics/kpi-card";
import { SalesChart } from "@/components/admin/analytics/sales-chart";
import { TrafficSources } from "@/components/admin/analytics/traffic-sources";
import {
  AbandonedCartsPanel, AiInsightsPanel, AnalyticsHeader, CustomersPanel, DeviceAnalytics,
  FunnelChart, LiveVisitorsPanel, MarketingPerformance, NotificationsPanel, PixelTracking,
  TopProductsTable, WorldMapPanel,
} from "@/components/admin/analytics/analytics-panels";
import { exportAnalyticsCsv, useAnalytics } from "@/hooks/admin/use-analytics";
import type { DatePreset } from "@/types/analytics";
import { useState } from "react";

export function AnalyticsDashboard() {
  const [preset, setPreset] = useState<DatePreset>("7d");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const [activeKpi, setActiveKpi] = useState<string | null>(null);
  const { data, loading, error, refresh } = useAnalytics({ preset, from: customFrom, to: customTo, refreshInterval: 30000 });

  if (loading && !data) return <AnalyticsSkeleton />;
  if (error && !data) return <div className="p-8 text-center"><p className="text-red-600">{error}</p><button type="button" onClick={refresh} className="mt-4 text-sm underline">Retry</button></div>;
  if (!data) return null;

  const kpis = [
    { key: "revenue", label: "Revenue", metric: data.kpis.revenue, format: (n: number) => formatPrice(n, "en") },
    { key: "orders", label: "Orders", metric: data.kpis.orders },
    { key: "conversion", label: "Conversion Rate", metric: data.kpis.conversionRate, suffix: "%" },
    { key: "aov", label: "Average Order Value", metric: data.kpis.averageOrderValue, format: (n: number) => formatPrice(n, "en") },
    { key: "visitors", label: "Visitors", metric: data.kpis.visitors },
    { key: "sessions", label: "Sessions", metric: data.kpis.sessions },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 md:p-8 lg:p-10 space-y-8 max-w-[1600px] mx-auto">
      <AnalyticsHeader preset={preset} onPresetChange={(p) => setPreset(p as DatePreset)} onRefresh={refresh} onExportCsv={() => exportAnalyticsCsv(data)} loading={loading} customFrom={customFrom} customTo={customTo} onCustomChange={(from, to) => { setCustomFrom(from); setCustomTo(to); }} />
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpis.map((k, i) => (<KpiCard key={k.key} label={k.label} metric={k.metric} format={k.format} suffix={k.suffix} index={i} active={activeKpi === k.key} onClick={() => setActiveKpi(k.key === activeKpi ? null : k.key)} />))}
      </div>
      <SalesChart data={data.timeSeries} />
      <div className="grid lg:grid-cols-2 gap-6"><TrafficSources sources={data.trafficSources} /><FunnelChart steps={data.funnel} /></div>
      <section className="space-y-4"><h2 className="text-lg font-semibold">Marketing Performance</h2><MarketingPerformance platforms={data.marketing} /></section>
      <div className="grid lg:grid-cols-3 gap-6"><div className="lg:col-span-2"><PixelTracking pixels={data.pixels} /></div><LiveVisitorsPanel visitors={data.liveVisitors} /></div>
      <div className="grid lg:grid-cols-2 gap-6"><WorldMapPanel countries={data.countries} /><AiInsightsPanel insights={data.insights} /></div>
      <TopProductsTable products={data.topProducts} />
      <div className="grid lg:grid-cols-3 gap-6"><CustomersPanel data={data.customers} /><AbandonedCartsPanel data={data.abandonedCarts} /><NotificationsPanel notifications={data.notifications} /></div>
      <DeviceAnalytics devices={data.devices} os={data.operatingSystems} />
    </motion.div>
  );
}
