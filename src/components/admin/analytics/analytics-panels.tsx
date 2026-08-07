"use client";

import { motion } from "motion/react";
import { Copy, RefreshCw, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/admin/ui/card";
import { Badge } from "@/components/admin/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import type {
  AbandonedCartMetrics, AnalyticsInsight, AnalyticsNotification, CountryMetric,
  CustomerMetrics, DeviceBreakdown, FunnelStep, LiveVisitor, MarketingPlatformMetrics,
  OsBreakdown, PixelConfig, TopProductRow,
} from "@/types/analytics";

export function MarketingPerformance({ platforms }: { platforms: MarketingPlatformMetrics[] }) {
  return (
    <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {platforms.map((p, i) => (
        <motion.div key={p.platform} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
          <Card className="overflow-hidden">
            <div className="h-1" style={{ backgroundColor: p.color }} />
            <CardContent className="pt-5 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">{p.label}</h4>
                <Badge variant={p.revenue > 0 ? "success" : "default"}>ROAS {p.roas > 0 ? `${p.roas}x` : "—"}</Badge>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><p className="text-neutral-500 text-xs">Spend</p><p className="font-medium">{formatPrice(p.spend, "en")}</p></div>
                <div><p className="text-neutral-500 text-xs">Revenue</p><p className="font-medium">{formatPrice(p.revenue, "en")}</p></div>
                <div><p className="text-neutral-500 text-xs">Orders</p><p className="font-medium">{p.orders}</p></div>
                <div><p className="text-neutral-500 text-xs">CPA</p><p className="font-medium">{p.cpa > 0 ? formatPrice(p.cpa, "en") : "—"}</p></div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}

export function FunnelChart({ steps }: { steps: FunnelStep[] }) {
  const max = steps[0]?.count || 1;
  return (
    <Card><CardHeader><CardTitle>Ecommerce Funnel</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        {steps.map((step, i) => (
          <div key={step.key}>
            <div className="flex justify-between text-sm mb-1"><span className="font-medium">{step.label}</span><span>{step.count.toLocaleString()}</span></div>
            <div className="h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
              <motion.div className="h-full rounded-xl bg-gradient-to-r from-gold/80 to-gold" initial={{ width: 0 }} animate={{ width: `${(step.count / max) * 100}%` }} transition={{ duration: 0.7, delay: i * 0.08 }} />
            </div>
            {i > 0 && step.dropOffRate > 0 && <p className="text-xs text-red-500 mt-1">↓ {step.dropOffRate}% drop-off</p>}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function PixelTracking({ pixels }: { pixels: PixelConfig[] }) {
  const sv = (s: PixelConfig["status"]) => s === "connected" ? "success" : s === "warning" ? "warning" : "error";
  return (
    <Card><CardHeader><CardTitle>Tracking Center</CardTitle></CardHeader>
      <CardContent className="grid sm:grid-cols-2 gap-3">
        {pixels.map((p) => (
          <div key={p.id} className="rounded-xl border dark:border-neutral-800 p-4 space-y-2">
            <div className="flex justify-between"><span className="font-medium text-sm">{p.name}</span><Badge variant={sv(p.status)}>{p.status}</Badge></div>
            <p className="text-xs font-mono truncate text-neutral-500">{p.pixelId || "Not configured"}</p>
            <div className="flex gap-2">
              {p.pixelId && <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => navigator.clipboard.writeText(p.pixelId!)}><Copy className="h-3 w-3 mr-1" />Copy</Button>}
              <Button size="sm" variant="ghost" className="h-8 text-xs"><Zap className="h-3 w-3 mr-1" />Test</Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function LiveVisitorsPanel({ visitors }: { visitors: LiveVisitor[] }) {
  return (
    <Card><CardHeader><CardTitle className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />Live Visitors <Badge variant="success">{visitors.length}</Badge></CardTitle></CardHeader>
      <CardContent className="space-y-2 max-h-64 overflow-auto">
        {visitors.length === 0 ? <p className="text-sm text-neutral-500 text-center py-4">No active visitors.</p> : visitors.map((v) => (
          <div key={v.id} className="flex justify-between rounded-lg bg-neutral-50 dark:bg-neutral-800/50 px-3 py-2 text-sm">
            <div><p className="font-medium truncate max-w-[160px]">{v.page}</p><p className="text-xs text-neutral-500">{v.country} · {v.device}</p></div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function WorldMapPanel({ countries }: { countries: CountryMetric[] }) {
  const max = Math.max(...countries.map((c) => c.visitors), 1);
  return (
    <Card><CardHeader><CardTitle>Visitors by Country</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        {countries.map((c) => (
          <div key={c.countryCode}>
            <div className="flex justify-between text-sm mb-1"><span>{c.country}</span><span className="text-neutral-500">{c.visitors} · {formatPrice(c.revenue, "en")}</span></div>
            <div className="h-2 rounded-full bg-neutral-100 dark:bg-neutral-800"><div className="h-full rounded-full bg-gold" style={{ width: `${(c.visitors / max) * 100}%` }} /></div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function TopProductsTable({ products }: { products: TopProductRow[] }) {
  return (
    <Card><CardHeader><CardTitle>Top Products</CardTitle></CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="w-full text-sm"><thead><tr className="text-left text-xs text-neutral-500 border-b"><th className="pb-3">Product</th><th className="pb-3">Views</th><th className="pb-3">ATC</th><th className="pb-3">Conv.</th><th className="pb-3">Revenue</th><th className="pb-3">Stock</th></tr></thead>
          <tbody>{products.map((p) => (
            <tr key={p.id} className="border-b last:border-0 dark:border-neutral-800/50">
              <td className="py-3"><div className="flex items-center gap-2">{p.image && <img src={p.image} alt="" className="h-8 w-8 rounded object-cover" />}<span className="font-medium truncate max-w-[140px]">{p.name}</span></div></td>
              <td className="py-3">{p.views}</td><td className="py-3">{p.addToCart}</td><td className="py-3">{p.conversionRate}%</td><td className="py-3">{formatPrice(p.revenue, "en")}</td>
              <td className="py-3"><Badge variant={p.stock < 20 ? "warning" : "default"}>{p.stock}</Badge></td>
            </tr>
          ))}</tbody>
        </table>
      </CardContent>
    </Card>
  );
}

export function CustomersPanel({ data }: { data: CustomerMetrics }) {
  const items = [{ label: "New", value: data.newCustomers }, { label: "Returning", value: data.returningCustomers }, { label: "Repeat Rate", value: `${data.repeatRate}%` }, { label: "LTV", value: formatPrice(data.lifetimeValue, "en") }, { label: "Avg Orders", value: data.averageOrders }];
  return (
    <Card><CardHeader><CardTitle>Customers</CardTitle></CardHeader>
      <CardContent className="grid grid-cols-2 gap-3">{items.map((item) => (
        <div key={item.label} className="rounded-xl bg-neutral-50 dark:bg-neutral-800/50 p-3"><p className="text-xs text-neutral-500">{item.label}</p><p className="text-lg font-semibold">{item.value}</p></div>
      ))}</CardContent>
    </Card>
  );
}

export function AbandonedCartsPanel({ data }: { data: AbandonedCartMetrics }) {
  return (
    <Card><CardHeader><CardTitle>Abandoned Carts</CardTitle></CardHeader>
      <CardContent className="grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-neutral-50 dark:bg-neutral-800/50 p-3"><p className="text-xs text-neutral-500">Total</p><p className="text-xl font-semibold">{data.total}</p></div>
        <div className="rounded-xl bg-neutral-50 dark:bg-neutral-800/50 p-3"><p className="text-xs text-neutral-500">Recovered</p><p className="text-xl font-semibold">{data.recovered}</p></div>
        <div className="rounded-xl bg-neutral-50 dark:bg-neutral-800/50 p-3"><p className="text-xs text-neutral-500">Recovery</p><p className="text-xl font-semibold">{data.recoveryRate}%</p></div>
        <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/30 p-3"><p className="text-xs">Recovered Rev.</p><p className="text-lg font-semibold">{formatPrice(data.revenueRecovered, "en")}</p></div>
      </CardContent>
    </Card>
  );
}

export function DeviceAnalytics({ devices, os }: { devices: DeviceBreakdown; os: OsBreakdown }) {
  const dt = devices.desktop + devices.mobile + devices.tablet || 1;
  const ot = os.chrome + os.safari + os.edge + os.firefox + os.other || 1;
  return (
    <Card><CardHeader><CardTitle>Device Analytics</CardTitle></CardHeader>
      <CardContent className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">{(["desktop", "mobile", "tablet"] as const).map((d) => (
          <div key={d}><div className="flex justify-between text-sm capitalize"><span>{d}</span><span>{Math.round((devices[d] / dt) * 100)}%</span></div>
            <div className="h-2 rounded-full bg-neutral-100 dark:bg-neutral-800"><div className="h-full rounded-full bg-navy" style={{ width: `${(devices[d] / dt) * 100}%` }} /></div></div>
        ))}</div>
        <div className="space-y-2">{(["chrome", "safari", "edge", "firefox"] as const).map((b) => (
          <div key={b}><div className="flex justify-between text-sm capitalize"><span>{b}</span><span>{Math.round((os[b] / ot) * 100)}%</span></div>
            <div className="h-2 rounded-full bg-neutral-100 dark:bg-neutral-800"><div className="h-full rounded-full bg-gold" style={{ width: `${(os[b] / ot) * 100}%` }} /></div></div>
        ))}</div>
      </CardContent>
    </Card>
  );
}

export function AiInsightsPanel({ insights }: { insights: AnalyticsInsight[] }) {
  return (
    <Card className="border-gold/20"><CardHeader><CardTitle>AI Insights</CardTitle></CardHeader>
      <CardContent className="space-y-2">{insights.map((ins, i) => (
        <motion.div key={ins.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="rounded-xl border dark:border-neutral-700 p-3">
          <p className="font-medium text-sm">{ins.title}</p><p className="text-xs text-neutral-500 mt-1">{ins.description}</p>
        </motion.div>
      ))}</CardContent>
    </Card>
  );
}

export function NotificationsPanel({ notifications }: { notifications: AnalyticsNotification[] }) {
  const v = (t: AnalyticsNotification["type"]) => ({ error: "error", warning: "warning", success: "success", info: "info" }[t] as "error" | "warning" | "success" | "info");
  return (
    <Card><CardHeader><CardTitle>Alerts</CardTitle></CardHeader>
      <CardContent className="space-y-2">{notifications.length === 0 ? <p className="text-sm text-neutral-500">All clear.</p> : notifications.map((n) => (
        <div key={n.id} className="flex gap-2 rounded-xl border dark:border-neutral-800 p-3"><Badge variant={v(n.type)}>{n.type}</Badge><div><p className="text-sm font-medium">{n.title}</p><p className="text-xs text-neutral-500">{n.message}</p></div></div>
      ))}</CardContent>
    </Card>
  );
}

export function AnalyticsHeader({ preset, onPresetChange, onRefresh, onExportCsv, loading, customFrom, customTo, onCustomChange }: {
  preset: string; onPresetChange: (p: string) => void; onRefresh: () => void; onExportCsv: () => void; loading?: boolean;
  customFrom?: string; customTo?: string; onCustomChange?: (from: string, to: string) => void;
}) {
  const presets = ["today", "yesterday", "7d", "30d", "90d", "custom"];
  const labels: Record<string, string> = { today: "Today", yesterday: "Yesterday", "7d": "Last 7 Days", "30d": "Last 30 Days", "90d": "Last 90 Days", custom: "Custom" };
  return (
    <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
      <div><h1 className="text-3xl font-display tracking-tight">Analytics</h1><p className="text-sm text-neutral-500 mt-1">Real-time ecommerce intelligence</p></div>
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex flex-wrap rounded-xl bg-white dark:bg-neutral-900 border dark:border-neutral-800 p-1">
          {presets.map((p) => (<button key={p} type="button" onClick={() => onPresetChange(p)} className={`rounded-lg px-3 py-1.5 text-xs font-medium ${preset === p ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900" : "text-neutral-500"}`}>{labels[p]}</button>))}
        </div>
        {preset === "custom" && onCustomChange && (<><input type="date" value={customFrom || ""} onChange={(e) => onCustomChange(e.target.value, customTo || "")} className="rounded-lg border px-2 py-1 text-xs dark:bg-neutral-900" /><input type="date" value={customTo || ""} onChange={(e) => onCustomChange(customFrom || "", e.target.value)} className="rounded-lg border px-2 py-1 text-xs dark:bg-neutral-900" /></>)}
        <Button variant="outline" size="sm" onClick={onExportCsv}>Export CSV</Button>
        <Button variant="outline" size="sm" onClick={onRefresh} disabled={loading}><RefreshCw className={`h-3.5 w-3.5 mr-1 ${loading ? "animate-spin" : ""}`} />Refresh</Button>
      </div>
    </div>
  );
}
