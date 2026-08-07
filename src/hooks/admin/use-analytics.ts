"use client";

import { useCallback, useEffect, useState } from "react";
import type { AnalyticsDashboardData, DatePreset } from "@/types/analytics";

interface UseAnalyticsOptions {
  preset?: DatePreset;
  from?: string;
  to?: string;
  refreshInterval?: number;
}

export function useAnalytics({
  preset = "7d",
  from,
  to,
  refreshInterval = 30000,
}: UseAnalyticsOptions = {}) {
  const [data, setData] = useState<AnalyticsDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const params = new URLSearchParams({ preset });
      if (preset === "custom" && from && to) {
        params.set("from", from);
        params.set("to", to);
      }
      const res = await fetch(`/api/admin/analytics?${params}`);
      if (!res.ok) throw new Error("Failed to load analytics");
      const json = await res.json();
      setData(json.data);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [preset, from, to]);

  useEffect(() => {
    setLoading(true);
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (!refreshInterval) return;
    const id = setInterval(fetchData, refreshInterval);
    return () => clearInterval(id);
  }, [fetchData, refreshInterval]);

  return { data, loading, error, refresh: fetchData };
}

export function exportAnalyticsCsv(data: AnalyticsDashboardData) {
  const rows = [
    ["Metric", "Value", "Previous", "Change %"],
    ["Revenue", data.kpis.revenue.value, data.kpis.revenue.previousValue, data.kpis.revenue.changePercent],
    ["Orders", data.kpis.orders.value, data.kpis.orders.previousValue, data.kpis.orders.changePercent],
    ["Conversion Rate", data.kpis.conversionRate.value, data.kpis.conversionRate.previousValue, data.kpis.conversionRate.changePercent],
    ["AOV", data.kpis.averageOrderValue.value, data.kpis.averageOrderValue.previousValue, data.kpis.averageOrderValue.changePercent],
    ["Visitors", data.kpis.visitors.value, data.kpis.visitors.previousValue, data.kpis.visitors.changePercent],
    ["Sessions", data.kpis.sessions.value, data.kpis.sessions.previousValue, data.kpis.sessions.changePercent],
    [],
    ["Date", "Revenue", "Orders", "Visitors"],
    ...data.timeSeries.map((p) => [p.date, p.revenue, p.orders, p.visitors]),
  ];
  const csv = rows.map((r) => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `noorva-analytics-${data.range.preset}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
