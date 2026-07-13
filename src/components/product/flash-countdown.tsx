"use client";

import { useEffect, useState } from "react";
import { Flame, Zap } from "lucide-react";

function calculateTimeLeft(endDate: string) {
  const diff = new Date(endDate).getTime() - Date.now();
  if (diff <= 0) return { hours: 0, minutes: 0, seconds: 0 };
  return {
    hours: Math.floor(diff / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
  };
}

const pad = (n: number) => n.toString().padStart(2, "0");

export function FlashCountdown({ endDate }: { endDate: string }) {
  // Start with a null/placeholder value so server and first client render match exactly;
  // the real countdown (which depends on Date.now()) is computed only after mount.
  const [t, setT] = useState<{ hours: number; minutes: number; seconds: number } | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial tick must run client-only (uses Date.now())
    setT(calculateTimeLeft(endDate));
    const interval = setInterval(() => setT(calculateTimeLeft(endDate)), 1000);
    return () => clearInterval(interval);
  }, [endDate]);

  const display = t ?? { hours: 0, minutes: 0, seconds: 0 };

  return (
    <div className="flex items-center gap-3 rounded-2xl bg-rose-500/10 border border-rose-500/25 px-4 py-3">
      <Flame className="h-4 w-4 text-rose-400 shrink-0" />
      <span className="text-xs font-bold text-rose-200 whitespace-nowrap">عرض محدود السعر يرتفع خلال:</span>
      <div className="flex items-center gap-1.5 ms-auto" dir="ltr">
        {[
          { val: display.hours, label: "ساعة" },
          { val: display.minutes, label: "دقيقة" },
          { val: display.seconds, label: "ثانية" },
        ].map(({ val, label }, i) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className="countdown-box rounded-lg w-10 h-11 flex flex-col items-center justify-center">
              <span className="text-sm font-bold text-white tabular-nums leading-none">{pad(val)}</span>
              <span className="text-[8px] text-rose-300 leading-none mt-0.5">{label}</span>
            </div>
            {i < 2 && <span className="text-rose-400 font-bold">:</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

export function StockScarcityBar({ stock, originalStock }: { stock: number; originalStock: number }) {
  const pct = Math.min(100, Math.max(6, Math.round((stock / Math.max(stock, originalStock)) * 100)));
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="flex items-center gap-1.5 font-bold text-orange-300">
          <Zap className="h-3.5 w-3.5" />
          باقي {stock} قطعة فقط بسعر العرض
        </span>
        <span className="text-luxury-muted">طُلب {Math.max(0, 100 - pct)}% من المخزون</span>
      </div>
      <div className="scarcity-track h-2 rounded-full overflow-hidden">
        <div className="scarcity-fill h-full rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
