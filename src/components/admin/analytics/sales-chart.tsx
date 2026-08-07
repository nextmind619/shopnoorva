"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { Maximize2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/admin/ui/card";
import { cn } from "@/lib/utils";
import type { ChartMetric, TimeSeriesPoint } from "@/types/analytics";

const METRICS: { key: ChartMetric; label: string; color: string; gradient: [string, string] }[] = [
  { key: "revenue", label: "Revenue", color: "#c8943c", gradient: ["#e0b86a", "#9a7328"] },
  { key: "orders", label: "Orders", color: "#1a2f4a", gradient: ["#3b5998", "#1a2f4a"] },
  { key: "visitors", label: "Visitors", color: "#10b981", gradient: ["#34d399", "#059669"] },
  { key: "profit", label: "Profit", color: "#8b5cf6", gradient: ["#a78bfa", "#6d28d9"] },
];

interface SalesChartProps {
  data: TimeSeriesPoint[];
}

export function SalesChart({ data }: SalesChartProps) {
  const [metric, setMetric] = useState<ChartMetric>("revenue");
  const [fullscreen, setFullscreen] = useState(false);

  const active = METRICS.find((m) => m.key === metric)!;
  const values = useMemo(() => data.map((d) => d[metric]), [data, metric]);
  const max = Math.max(...values, 1);

  const w = 800;
  const h = 280;
  const pad = { top: 20, right: 20, bottom: 40, left: 60 };
  const chartW = w - pad.left - pad.right;
  const chartH = h - pad.top - pad.bottom;

  const points = values.map((v, i) => ({
    x: pad.left + (i / (values.length - 1 || 1)) * chartW,
    y: pad.top + chartH - (v / max) * chartH,
    v,
  }));

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaPath = `${linePath} L ${points[points.length - 1]?.x ?? pad.left} ${pad.top + chartH} L ${pad.left} ${pad.top + chartH} Z`;

  return (
    <Card className={cn(fullscreen && "fixed inset-4 z-50 overflow-auto")}>
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div>
          <CardTitle>Sales Performance</CardTitle>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">Revenue, orders & traffic over time</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex rounded-xl bg-neutral-100 dark:bg-neutral-800 p-1">
            {METRICS.map((m) => (
              <button
                key={m.key}
                type="button"
                onClick={() => setMetric(m.key)}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-xs font-medium transition-all",
                  metric === m.key
                    ? "bg-white dark:bg-neutral-900 shadow-sm text-neutral-900 dark:text-white"
                    : "text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
                )}
              >
                {m.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setFullscreen((f) => !f)}
            className="rounded-lg p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            aria-label="Toggle fullscreen"
          >
            <Maximize2 className="h-4 w-4 text-neutral-500" />
          </button>
        </div>
      </CardHeader>
      <CardContent>
        <motion.div
          key={metric}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto">
            <defs>
              <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={active.gradient[0]} stopOpacity="0.35" />
                <stop offset="100%" stopColor={active.gradient[1]} stopOpacity="0.02" />
              </linearGradient>
            </defs>
            {[0, 0.25, 0.5, 0.75, 1].map((pct) => {
              const y = pad.top + chartH * (1 - pct);
              return (
                <g key={pct}>
                  <line
                    x1={pad.left}
                    y1={y}
                    x2={w - pad.right}
                    y2={y}
                    stroke="currentColor"
                    className="text-neutral-200 dark:text-neutral-800"
                    strokeDasharray="4 4"
                  />
                  <text
                    x={pad.left - 8}
                    y={y + 4}
                    textAnchor="end"
                    className="fill-neutral-400 text-[10px]"
                  >
                    {Math.round(max * pct).toLocaleString()}
                  </text>
                </g>
              );
            })}
            <motion.path
              d={areaPath}
              fill="url(#chartGrad)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            />
            <motion.path
              d={linePath}
              fill="none"
              stroke={active.color}
              strokeWidth="2.5"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
            {points.map((p, i) =>
              i % Math.ceil(points.length / 8 || 1) === 0 ? (
                <text
                  key={i}
                  x={p.x}
                  y={h - 8}
                  textAnchor="middle"
                  className="fill-neutral-400 text-[10px]"
                >
                  {data[i]?.date.slice(5)}
                </text>
              ) : null
            )}
          </svg>
        </motion.div>
      </CardContent>
    </Card>
  );
}
