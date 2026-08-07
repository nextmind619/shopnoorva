"use client";

import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/admin/ui/card";
import type { TrafficSourceItem } from "@/types/analytics";

interface TrafficSourcesProps {
  sources: TrafficSourceItem[];
}

function PieChart({ sources }: { sources: TrafficSourceItem[] }) {
  const total = sources.reduce((s, x) => s + x.visitors, 0) || 1;
  let angle = -90;
  const r = 70;
  const cx = 90;
  const cy = 90;

  const slices = sources.map((s) => {
    const pct = s.visitors / total;
    const sweep = pct * 360;
    const start = angle;
    angle += sweep;
    const startRad = (start * Math.PI) / 180;
    const endRad = ((start + sweep) * Math.PI) / 180;
    const x1 = cx + r * Math.cos(startRad);
    const y1 = cy + r * Math.sin(startRad);
    const x2 = cx + r * Math.cos(endRad);
    const y2 = cy + r * Math.sin(endRad);
    const large = sweep > 180 ? 1 : 0;
    const d = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`;
    return { ...s, d };
  });

  return (
    <svg width={180} height={180} className="shrink-0">
      {slices.map((slice, i) => (
        <motion.path
          key={slice.source}
          d={slice.d}
          fill={slice.color}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.05 }}
        />
      ))}
      <circle cx={cx} cy={cy} r={40} className="fill-white dark:fill-neutral-900" />
      <text x={cx} y={cy} textAnchor="middle" className="fill-neutral-900 dark:fill-white text-sm font-semibold">
        {total.toLocaleString()}
      </text>
    </svg>
  );
}

export function TrafficSources({ sources }: TrafficSourcesProps) {
  const max = Math.max(...sources.map((s) => s.visitors), 1);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Traffic Sources</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col lg:flex-row items-center gap-8">
          <PieChart sources={sources} />
          <div className="flex-1 w-full space-y-4">
            {sources.map((s, i) => (
              <div key={s.source}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                    <span className="text-sm font-medium">{s.label}</span>
                  </div>
                  <span className="text-sm text-neutral-500">{s.percentage}%</span>
                </div>
                <div className="h-2 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: s.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${(s.visitors / max) * 100}%` }}
                    transition={{ duration: 0.8, delay: i * 0.05 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
