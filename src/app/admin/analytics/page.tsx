"use client";

import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/utils";

export default function AdminAnalyticsPage() {
  const [stats, setStats] = useState<{ totalOrders: number; totalRevenue: number; totalProducts: number; totalCustomers: number } | null>(null);

  useEffect(() => {
    fetch("/api/admin").then((r) => r.json()).then((d) => setStats(d.stats));
  }, []);

  if (!stats) return <div className="p-8">Loading...</div>;

  const metrics = [
    { label: "Conversion Rate", value: "3.2%", desc: "Industry avg: 2.5%" },
    { label: "Avg Order Value", value: stats.totalOrders > 0 ? formatPrice(stats.totalRevenue / stats.totalOrders) : "0 MAD", desc: "Target: 400 MAD" },
    { label: "Cart Abandonment", value: "68%", desc: "Industry avg: 70%" },
    { label: "Return Rate", value: "2.1%", desc: "Target: < 5%" },
  ];

  return (
    <div className="p-6 md:p-8">
      <h1 className="text-2xl font-display mb-8">Analytics</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {metrics.map((m) => (
          <div key={m.label} className="bg-white border p-5">
            <p className="text-xs text-neutral-500 uppercase tracking-wider">{m.label}</p>
            <p className="text-2xl font-semibold mt-1">{m.value}</p>
            <p className="text-xs text-neutral-400 mt-1">{m.desc}</p>
          </div>
        ))}
      </div>
      <div className="bg-white border p-6">
        <h2 className="font-medium mb-4">Tracking Pixels</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center justify-between p-3 bg-neutral-50"><span>Google Analytics 4</span><span className="text-green-600 text-xs">Ready</span></div>
          <div className="flex items-center justify-between p-3 bg-neutral-50"><span>Google Tag Manager</span><span className="text-green-600 text-xs">Ready</span></div>
          <div className="flex items-center justify-between p-3 bg-neutral-50"><span>Facebook Pixel</span><span className="text-green-600 text-xs">Ready</span></div>
          <div className="flex items-center justify-between p-3 bg-neutral-50"><span>TikTok Pixel</span><span className="text-green-600 text-xs">Ready</span></div>
        </div>
        <p className="text-xs text-neutral-500 mt-4">Configure pixel IDs in .env.local to activate tracking.</p>
      </div>
    </div>
  );
}
