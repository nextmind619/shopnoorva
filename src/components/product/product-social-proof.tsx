"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ShoppingBag, Eye } from "lucide-react";

const RECENT_BUYERS = [
  { name: "ياسين", city: "الدار البيضاء", mins: 2 },
  { name: "سارة", city: "الرباط", mins: 5 },
  { name: "محمد", city: "مراكش", mins: 8 },
  { name: "أمينة", city: "طنجة", mins: 12 },
  { name: "خالد", city: "فاس", mins: 15 },
  { name: "نادية", city: "أكادير", mins: 18 },
  { name: "يوسف", city: "وجدة", mins: 22 },
  { name: "إيمان", city: "مكناس", mins: 27 },
];

export function ProductSocialProof({ productLabel }: { productLabel: string }) {
  const [viewers, setViewers] = useState(12);
  const [toastIndex, setToastIndex] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setViewers(7 + Math.floor(Math.random() * 11));
  }, []);

  useEffect(() => {
    let hideTimer: ReturnType<typeof setTimeout> | undefined;
    const show = () => {
      setToastIndex((i) => (i + 1) % RECENT_BUYERS.length);
      setVisible(true);
      hideTimer = setTimeout(() => setVisible(false), 4200);
    };
    const start = setTimeout(show, 3500);
    const interval = setInterval(show, 14000);
    return () => {
      clearTimeout(start);
      clearInterval(interval);
      if (hideTimer) clearTimeout(hideTimer);
    };
  }, []);

  const buyer = RECENT_BUYERS[toastIndex];

  return (
    <>
      <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs sm:text-sm text-emerald-100">
        <span className="inline-flex items-center gap-1.5 font-semibold">
          <Eye className="h-3.5 w-3.5" />
          {viewers} أشخاص يشاهدون هذا المنتج الآن
        </span>
      </div>

      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, y: 24, x: 12 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.35 }}
            className="fixed bottom-24 start-4 z-40 max-w-[280px] rounded-2xl border border-white/10 bg-[#12121a]/95 backdrop-blur-md shadow-2xl px-4 py-3 pointer-events-none"
            role="status"
            aria-live="polite"
          >
            <div className="flex items-start gap-3">
              <div className="shrink-0 w-9 h-9 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <ShoppingBag className="h-4 w-4 text-emerald-400" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">
                  {buyer.name} من {buyer.city}
                </p>
                <p className="text-[11px] text-white/55 leading-snug mt-0.5">
                  طلب {productLabel} منذ {buyer.mins} دقائق
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
