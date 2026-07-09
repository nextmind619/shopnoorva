"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "motion/react";
import { Check, Home, ShoppingBag, Phone } from "lucide-react";
import { formatPriceNumber, cn } from "@/lib/utils";

const STEPS = [
  { num: "①", title: "مراجعة الطلب" },
  { num: "②", title: "الاتصال بك لتأكيد الطلب" },
  { num: "③", title: "تجهيز الطلب" },
  { num: "④", title: "الشحن" },
  { num: "⑤", title: "التوصيل والدفع عند الاستلام" },
];

export function ThankYouClient() {
  const searchParams = useSearchParams();

  const orderNumber = searchParams.get("order") || "—";
  const customerName = searchParams.get("name") || "—";
  const phone = searchParams.get("phone") || "—";
  const address = searchParams.get("address") || "—";
  const product = searchParams.get("product") || "—";
  const total = searchParams.get("total") ? Number(searchParams.get("total")) : null;

  return (
    <div className="min-h-screen bg-luxury-bg text-luxury-black pt-24 pb-16 px-4" dir="rtl">
      <div className="max-w-lg mx-auto">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 18, delay: 0.1 }}
          className="w-28 h-28 rounded-full bg-emerald-50 border-4 border-emerald-200 flex items-center justify-center mx-auto mb-8 shadow-soft"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.35, type: "spring", stiffness: 300 }}
          >
            <Check className="h-14 w-14 text-emerald-600 stroke-[2.5]" />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-2xl sm:text-3xl font-bold leading-tight">
            🎉 تم استلام طلبك بنجاح
          </h1>
          <p className="text-luxury-muted mt-4 leading-relaxed text-sm sm:text-base">
            شكراً لثقتك في <span className="font-bold text-luxury-black">NOORVA</span>.
            <br />
            لقد توصلنا بطلبك وسيتم التواصل معك هاتفياً خلال وقت قصير لتأكيد الطلب.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-10 bg-white rounded-2xl border border-black/5 p-5 sm:p-6 shadow-soft"
        >
          <p className="text-xs font-bold text-luxury-gold tracking-wider mb-4">مراحل طلبك</p>
          <div className="space-y-3">
            {STEPS.map((step, i) => (
              <div key={step.num} className="flex items-center gap-3">
                <span
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0",
                    i === 0 ? "bg-luxury-gold text-luxury-black" : "bg-luxury-bg text-luxury-muted"
                  )}
                >
                  {step.num}
                </span>
                <span className={cn("text-sm", i === 0 ? "font-bold" : "text-luxury-muted")}>{step.title}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6 bg-white rounded-2xl border border-black/5 p-5 sm:p-6 shadow-soft space-y-3 text-sm"
        >
          <p className="text-xs font-bold text-luxury-gold tracking-wider mb-2">معلومات الطلب</p>
          <Row label="رقم الطلب" value={orderNumber} highlight />
          <Row label="اسم العميل" value={customerName} />
          <Row label="رقم الهاتف" value={phone} dir="ltr" />
          <Row label="العنوان" value={address} />
          <Row label="المنتج" value={product} />
          {total !== null && !Number.isNaN(total) && (
            <Row label="الإجمالي" value={`${formatPriceNumber(total, "ar")} درهم مغربي`} highlight />
          )}
          <div className="flex justify-between items-center pt-3 border-t border-black/8">
            <span className="text-luxury-muted">طريقة الدفع</span>
            <span className="font-bold text-sm">الدفع عند الاستلام</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-6 rounded-2xl bg-luxury-black/5 border border-luxury-gold/20 p-5 flex gap-3"
        >
          <Phone className="h-5 w-5 text-luxury-gold shrink-0 mt-0.5" />
          <p className="text-sm text-luxury-muted leading-relaxed">
            يرجى إبقاء هاتفك متاحاً لأن فريقنا سيتواصل معك لتأكيد الطلب.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-8 flex flex-col sm:flex-row gap-3"
        >
          <Link
            href="/ar"
            className="flex-1 h-13 rounded-full bg-luxury-black text-luxury-bg font-bold text-sm flex items-center justify-center gap-2 hover:bg-luxury-black/90 transition-all active:scale-[0.98]"
          >
            <Home className="h-4 w-4" />
            العودة إلى الصفحة الرئيسية
          </Link>
          <Link
            href="/ar/products"
            className="flex-1 h-13 rounded-full border-2 border-luxury-black font-bold text-sm flex items-center justify-center gap-2 hover:bg-luxury-black hover:text-luxury-bg transition-all active:scale-[0.98]"
          >
            <ShoppingBag className="h-4 w-4" />
            تصفح المزيد من المنتجات
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

function Row({ label, value, highlight, dir }: { label: string; value: string; highlight?: boolean; dir?: string }) {
  return (
    <div className="flex justify-between items-start gap-4">
      <span className="text-luxury-muted shrink-0">{label}</span>
      <span className={cn("font-medium text-end", highlight && "text-luxury-gold font-bold")} dir={dir}>
        {value}
      </span>
    </div>
  );
}
