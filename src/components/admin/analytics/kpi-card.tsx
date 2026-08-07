"use client";

import { motion } from "motion/react";
import { TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatedNumber } from "./animated-number";
import type { TrendMetric } from "@/types/analytics";

interface KpiCardProps {
  label: string;
  metric: TrendMetric;
  format?: (n: number) => string;
  prefix?: string;
  suffix?: string;
  index?: number;
  active?: boolean;
  onClick?: () => void;
}

function MiniSparkline({ data, positive }: { data: number[]; positive: boolean }) {
  if (!data.length) return null;
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  const w = 80;
  const h = 32;
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1 || 1)) * w;
      const y = h - ((v - min) / range) * h;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg width={w} height={h} className="overflow-visible">
      <defs>
        <linearGradient id={`spark-${positive ? "up" : "down"}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={positive ? "#10b981" : "#ef4444"} stopOpacity="0.3" />
          <stop offset="100%" stopColor={positive ? "#10b981" : "#ef4444"} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline
        fill="none"
        stroke={positive ? "#10b981" : "#ef4444"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
}

export function KpiCard({
  label,
  metric,
  format,
  prefix = "",
  suffix = "",
  index = 0,
  active,
  onClick,
}: KpiCardProps) {
  const positive = metric.changePercent >= 0;

  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      onClick={onClick}
      className={cn(
        "group relative w-full text-left rounded-2xl border bg-white p-5 shadow-[0_8px_32px_rgba(26,22,18,0.06)] transition-all duration-300",
        "dark:bg-neutral-900 dark:border-neutral-800 dark:shadow-[0_8px_32px_rgba(0,0,0,0.35)]",
        "hover:shadow-[0_16px_48px_rgba(26,22,18,0.1)] dark:hover:shadow-[0_16px_48px_rgba(0,0,0,0.45)]",
        active && "ring-2 ring-gold/50 border-gold/30",
        onClick && "cursor-pointer"
      )}
    >
      <p className="text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white">
        {prefix}
        <AnimatedNumber value={metric.value} format={format} />
        {suffix}
      </p>
      <div className="mt-3 flex items-center justify-between">
        <span
          className={cn(
            "inline-flex items-center gap-1 text-xs font-medium",
            positive ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
          )}
        >
          {positive ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
          {positive ? "+" : ""}
          {metric.changePercent}%
        </span>
        <MiniSparkline data={metric.sparkline} positive={positive} />
      </div>
      <p className="mt-2 text-[11px] text-neutral-400 dark:text-neutral-500">
        vs {format ? format(metric.previousValue) : metric.previousValue.toLocaleString()} prev. period
      </p>
    </motion.button>
  );
}
