"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { ShoppingBag, Check, X, Sparkles, Moon, Music2, Wifi, Gift } from "lucide-react";
import type { Product } from "@/types";
import { formatPriceNumber, calculateDiscount, cn } from "@/lib/utils";
import { resolveProductImage } from "@/lib/product-images/resolve";
import type { PremiumImageType } from "@/lib/product-images/types";
import { getProductCroContent } from "@/lib/product-cro-content";

interface ProductCroSectionsProps {
  product: Product;
  onOrderClick: () => void;
}

function MidCta({
  product,
  onOrderClick,
  label,
}: {
  product: Product;
  onOrderClick: () => void;
  label: string;
}) {
  const price = product.variants[0]?.price ?? product.price;
  const compare = product.variants[0]?.compareAtPrice ?? product.compareAtPrice;
  const discount = calculateDiscount(price, compare);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      className="my-8 rounded-[1.75rem] border border-[#6366f1]/40 bg-gradient-to-l from-[#1a1a24] via-[#12121a] to-[#1e1b4b] p-5 sm:p-7 text-center"
    >
      <p className="text-sm text-white/70 mb-2">{label}</p>
      <div className="flex flex-wrap items-center justify-center gap-3 mb-4">
        <span className="text-3xl font-black tabular-nums text-white">
          {formatPriceNumber(price, "ar")}
          <span className="text-sm font-bold text-white/60 ms-1">درهم</span>
        </span>
        {compare && compare > price && (
          <span className="text-base text-white/40 line-through tabular-nums">
            {formatPriceNumber(compare, "ar")}
          </span>
        )}
        {discount > 0 && (
          <span className="bg-red-600 text-white text-xs font-black px-3 py-1 rounded-full">
            وفّر {discount}%
          </span>
        )}
      </div>
      <button
        type="button"
        onClick={onOrderClick}
        className="inline-flex items-center justify-center gap-2 h-12 px-8 rounded-xl bg-[#6366f1] hover:bg-[#4f46e5] text-white font-bold text-sm shadow-lg shadow-indigo-500/25 active:scale-[0.98] transition-all"
      >
        <ShoppingBag className="h-4 w-4" />
        اطلب الآن — الدفع عند الاستلام
      </button>
    </motion.div>
  );
}

function getGenericHowTo(product: Product): {
  step: string;
  title: string;
  desc: string;
  imageKey: PremiumImageType | null;
}[] {
  const text = product.howToUse?.ar || "";
  const parts = text.split(/[.。؟!]\s+/).filter(Boolean).slice(0, 4);
  if (parts.length >= 2) {
    return parts.map((p, i) => ({
      step: String(i + 1),
      title: `الخطوة ${i + 1}`,
      desc: p.trim(),
      imageKey: null,
    }));
  }
  return [
    { step: "1", title: "افتح العلبة", desc: "تأكد أن كل المحتويات موجودة حسب القائمة.", imageKey: null },
    { step: "2", title: "وصّل التشغيل", desc: "استخدم الكابل المرفق واترك الجهاز على سطح ثابت.", imageKey: null },
    { step: "3", title: "فعّل الإضاءة", desc: "شغّل الجهاز في غرفة مناسبة واستمتع بالنتيجة.", imageKey: null },
  ];
}

function fallbackComparison(name: string) {
  return {
    oursLabel: name,
    rows: [
      { label: "جودة مختارة بعناية", us: true as const, them: false as const },
      { label: "تجربة جاهزة من أول تشغيل", us: true as const, them: false as const },
      { label: "الدفع عند الاستلام", us: true as const, them: "نادر" },
      { label: "توصيل لجميع المدن", us: true as const, them: "محدود" },
      { label: "ضمان وخدمة واتساب", us: true as const, them: false as const },
    ],
  };
}

export function ProductCroSections({ product, onOrderClick }: ProductCroSectionsProps) {
  const cro = getProductCroContent(product.slug);
  const howTo = cro?.howTo ?? getGenericHowTo(product);
  const comparison = cro?.comparison ?? fallbackComparison(product.name.ar);
  const benefitBlocks =
    cro?.benefits ??
    product.benefits.slice(0, 5).map((b, i) => ({
      icon: [Sparkles, Music2, Moon, Wifi, Gift][i % 5],
      title: b.ar,
      desc: product.features?.[i]?.ar || "ميزة مختارة بعناية لتجربة أفضل كل يوم.",
    }));
  const videoSrc = cro?.videoSrc || product.videoUrl;
  const ctaLabels = cro?.midCtaLabels ?? [
    "جاهز تطلب دابا؟",
    "السعر واضح — والطلب في دقيقة",
    "باش ما تتردّدش — الدفع غير ملي يوصلك",
  ];

  return (
    <div className="space-y-10 mt-10">
      {videoSrc && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-[2rem] overflow-hidden border border-white/10 bg-[#12121a]"
        >
          <div className="px-6 pt-6 pb-3 text-center">
            <p className="text-[10px] font-bold tracking-[0.25em] text-[#6366f1] uppercase mb-2">شاهد النتيجة</p>
            <h2 className="text-xl sm:text-2xl font-bold text-white">كيف يبدو في غرفتك؟</h2>
            <p className="text-sm text-white/60 mt-2">طريقة الاستخدام · أهم المزايا · الأجواء النهائية</p>
          </div>
          <div className="relative aspect-[9/16] max-h-[70vh] mx-auto w-full max-w-md bg-black">
            <video
              className="absolute inset-0 h-full w-full object-cover"
              controls
              playsInline
              preload="metadata"
              poster={resolveProductImage(product.slug, "02-premium-hero", "webp") || undefined}
            >
              <source src={videoSrc} type="video/mp4" />
            </video>
          </div>
        </motion.section>
      )}

      <MidCta product={product} onOrderClick={onOrderClick} label={ctaLabels[0]} />

      {product.problem && product.problemSolution && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-[2rem] border border-white/10 bg-[#1a1a24] p-7 sm:p-10"
        >
          <p className="text-[10px] font-bold tracking-[0.25em] text-[#6366f1] uppercase mb-3">المشكلة والحل</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight mb-6">
            {product.problem.ar}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { t: "ما المشكلة؟", d: product.problem.ar },
              {
                t: "لماذا تحدث؟",
                d: product.problemCause?.ar || "لأن الإضاءة العادية ما كتعطيش أجواء ولا تجربة متكاملة.",
              },
              { t: "كيف يحلها المنتج؟", d: product.problemSolution.ar },
            ].map((block) => (
              <div key={block.t} className="rounded-2xl bg-[#12121a] border border-white/10 p-5">
                <p className="text-xs font-bold text-[#6366f1] mb-2">{block.t}</p>
                <p className="text-sm text-white/75 leading-relaxed">{block.d}</p>
              </div>
            ))}
          </div>
        </motion.section>
      )}

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-[2rem] border border-white/10 bg-[#1a1a24] p-7 sm:p-10"
      >
        <h2 className="text-xl sm:text-2xl font-bold text-white text-center mb-8">ماذا يغيّر لك فعلاً؟</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {benefitBlocks.map((b) => (
            <div key={b.title} className="flex gap-4 rounded-2xl bg-[#12121a] border border-white/10 p-5">
              <div className="shrink-0 h-11 w-11 rounded-xl bg-[#6366f1]/15 flex items-center justify-center">
                <b.icon className="h-5 w-5 text-[#818cf8]" />
              </div>
              <div>
                <p className="font-bold text-white text-sm sm:text-base">{b.title}</p>
                <p className="text-xs sm:text-sm text-white/60 mt-1.5 leading-relaxed">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      <MidCta product={product} onOrderClick={onOrderClick} label={ctaLabels[1]} />

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-[2rem] border border-white/10 bg-[#1a1a24] p-7 sm:p-10 overflow-hidden"
      >
        <h2 className="text-xl sm:text-2xl font-bold text-white text-center mb-2">لماذا يختار العملاء هذا المنتج؟</h2>
        <p className="text-sm text-white/55 text-center mb-6">مقارنة سريعة مع الإضاءة التقليدية</p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[320px] text-sm">
            <thead>
              <tr className="border-b border-white/10 text-white/50">
                <th className="text-start py-3 px-2 font-medium">المعيار</th>
                <th className="py-3 px-2 font-bold text-[#818cf8]">{comparison.oursLabel}</th>
                <th className="py-3 px-2 font-medium">إضاءة عادية</th>
              </tr>
            </thead>
            <tbody>
              {comparison.rows.map((row) => (
                <tr key={row.label} className="border-b border-white/5">
                  <td className="py-3.5 px-2 text-white/80 text-start">{row.label}</td>
                  <td className="py-3.5 px-2 text-center">
                    {row.us === true ? (
                      <Check className="h-5 w-5 text-emerald-400 mx-auto" />
                    ) : (
                      <span className="text-emerald-400 font-bold text-xs">{String(row.us)}</span>
                    )}
                  </td>
                  <td className="py-3.5 px-2 text-center">
                    {row.them === false ? (
                      <X className="h-5 w-5 text-white/25 mx-auto" />
                    ) : (
                      <span className="text-white/40 text-xs font-medium">{String(row.them)}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-[2rem] border border-white/10 bg-[#1a1a24] p-7 sm:p-10"
      >
        <h2 className="text-xl sm:text-2xl font-bold text-white text-center mb-2">طريقة الاستخدام</h2>
        <p className="text-sm text-white/55 text-center mb-8">خطوات بسيطة — والنتيجة من أول مساء</p>
        <ol className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {howTo.map((step) => {
            const img = step.imageKey != null ? resolveProductImage(product.slug, step.imageKey, "webp") : null;
            return (
              <li
                key={step.step}
                className={cn("rounded-2xl bg-[#12121a] border border-white/10 overflow-hidden", img && "flex flex-col")}
              >
                {img && (
                  <div className="relative aspect-[16/10] bg-[#0a0a0f]">
                    <Image
                      src={img}
                      alt={step.title}
                      fill
                      className="object-cover"
                      sizes="(max-width:640px) 100vw, 50vw"
                      loading="lazy"
                    />
                  </div>
                )}
                <div className="p-5 flex gap-3">
                  <span className="shrink-0 h-9 w-9 rounded-full bg-[#6366f1] text-white font-black text-sm flex items-center justify-center">
                    {step.step}
                  </span>
                  <div>
                    <p className="font-bold text-white">{step.title}</p>
                    <p className="text-sm text-white/60 mt-1 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </motion.section>

      <MidCta product={product} onOrderClick={onOrderClick} label={ctaLabels[2]} />
    </div>
  );
}
