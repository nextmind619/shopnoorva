"use client";

import {
  Package,
  Truck,
  ShieldCheck,
  RotateCcw,
  BadgeCheck,
  MapPin,
  Headphones,
} from "lucide-react";
import type { Product } from "@/types";
import { motion } from "motion/react";

interface ProductTrustBlocksProps {
  product: Product;
}

export function ProductTrustBlocks({ product }: ProductTrustBlocksProps) {
  const boxItems = product.packageIncludes?.length
    ? product.packageIncludes
    : [];

  return (
    <div className="space-y-8 mt-12">
      {/* قصة المنتج — سرد تحريري أصلي */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-48px" }}
        transition={{ duration: 0.5 }}
        className="bg-[#1a1a24] rounded-[2rem] border border-white/10 p-8 sm:p-10"
      >
        <p className="text-[10px] font-bold tracking-[0.25em] text-[#6366f1] uppercase mb-3">
          التجربة
        </p>
        <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight mb-4">
          سقف غرفتك… يتحوّل لمجرة هادئة
        </h2>
        <div className="space-y-4 text-white/70 leading-relaxed text-base max-w-3xl">
          <p>
            بدل إضاءة عادية تضيّع الأجواء، هاد البروجيكتور كيملأ السقف والجدران بأورورا متحركة،
            نجوم دقيقة، وقمر هلالي واضح — مثالي قبل النوم، للديكور، أو لسهرة هادئة مع موسيقى من هاتفك.
          </p>
          <p>
            التصميم الأبيض الهندسي كيبان أنيق فوق الطاولة أو الكومودينو، والريموت كيعطيك التحكم من السرير:
            الألوان، السطوع، السرعة، ومؤقت الإيقاف التلقائي.
          </p>
        </div>
      </motion.section>

      {/* محتوى العلبة */}
      {boxItems.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-48px" }}
          transition={{ duration: 0.5 }}
          className="bg-[#1a1a24] rounded-[2rem] border border-white/10 p-8 sm:p-10"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-white/5 p-3 rounded-xl">
              <Package className="h-6 w-6 text-[#6366f1]" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">شنو كاين فالعلبة؟</h2>
              <p className="text-sm text-white/55 mt-1">كلشي جاهز من أول تشغيل — بلا مشتريات إضافية</p>
            </div>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {boxItems.map((item, i) => (
              <li
                key={i}
                className="flex items-center gap-3 bg-[#12121a] rounded-2xl border border-white/10 px-4 py-3.5"
              >
                <BadgeCheck className="h-5 w-5 text-emerald-400 shrink-0" />
                <span className="text-sm font-medium text-white">{item.ar}</span>
              </li>
            ))}
          </ul>
        </motion.section>
      )}

      {/* التوصيل */}
      <motion.section
        id="delivery"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-48px" }}
        transition={{ duration: 0.5 }}
        className="bg-[#1a1a24] rounded-[2rem] border border-white/10 p-8 sm:p-10"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-white/5 p-3 rounded-xl">
            <Truck className="h-6 w-6 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">التوصيل فجميع مدن المغرب</h2>
            <p className="text-sm text-white/55 mt-1">تتبّع طلبك بسهولة — والدفع غير ملي يوصلك</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { icon: MapPin, title: "المدن الكبرى", desc: "24–48 ساعة (الدار البيضاء، الرباط، مراكش، فاس، طنجة…)" },
            { icon: Truck, title: "باقي المدن", desc: "2–4 أيام عمل حسب المنطقة" },
            { icon: Headphones, title: "تتبع ودعم", desc: "إشعار بالواتساب + صفحة تتبع الطلب" },
          ].map((item) => (
            <div key={item.title} className="bg-[#12121a] rounded-2xl border border-white/10 p-5">
              <item.icon className="h-5 w-5 text-[#6366f1] mb-3" />
              <p className="text-sm font-bold text-white">{item.title}</p>
              <p className="text-xs text-white/55 mt-2 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* الضمان */}
      <motion.section
        id="guarantee"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-48px" }}
        transition={{ duration: 0.5 }}
        className="bg-[#1a1a24] rounded-[2rem] border border-white/10 p-8 sm:p-10"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-white/5 p-3 rounded-xl">
            <ShieldCheck className="h-6 w-6 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">ضمان راحتك</h2>
            <p className="text-sm text-white/55 mt-1">طلب آمن — بلا مخاطرة</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            {
              icon: RotateCcw,
              title: "استبدال خلال 7 أيام",
              desc: "إلا كان عيب مصنعي، كنبدّلوه بسرعة عبر واتساب.",
            },
            {
              icon: ShieldCheck,
              title: `ضمان ${product.warrantyMonths || 12} شهر`,
              desc: "تغطية على عيوب التصنيع طيلة مدة الضمان.",
            },
            {
              icon: BadgeCheck,
              title: "الدفع عند الاستلام",
              desc: "ما كتدفع والو دابا. خلّص كاش ملي تشوف الطلب قدامك.",
            },
            {
              icon: Package,
              title: "تغليف محمي",
              desc: "شحنة مؤمّنة باش يوصلك المنتج سليم 100%.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="flex items-start gap-4 bg-[#12121a] rounded-2xl border border-white/10 p-5"
            >
              <div className="shrink-0 bg-emerald-500/10 p-2.5 rounded-xl">
                <item.icon className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">{item.title}</p>
                <p className="text-xs text-white/55 mt-1.5 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.section>
    </div>
  );
}
