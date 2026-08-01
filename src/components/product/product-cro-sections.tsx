"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { ShoppingBag, Check, X, Sparkles, Moon, Music2, Wifi, Gift, Play } from "lucide-react";
import type { Product } from "@/types";
import { cn } from "@/lib/utils";
import { resolveProductImage } from "@/lib/product-images/resolve";
import { getProductCroContent } from "@/lib/product-cro-content";
import type { PremiumImageType } from "@/lib/product-images/types";

interface SectionProps {
  product: Product;
  onOrderClick?: () => void;
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
    { step: "1", title: "افتح العلبة", desc: "تأكد أن كل المحتويات موجودة.", imageKey: null },
    { step: "2", title: "وصّل التشغيل", desc: "استخدم الكابل المرفق على سطح ثابت.", imageKey: null },
    { step: "3", title: "فعّل الإضاءة", desc: "شغّل الجهاز واستمتع بالنتيجة.", imageKey: null },
  ];
}

export function ProductBenefitsSection({ product, onOrderClick }: SectionProps) {
  const cro = getProductCroContent(product.slug);
  const benefitBlocks =
    cro?.benefits ??
    product.benefits.slice(0, 5).map((b, i) => ({
      icon: [Sparkles, Music2, Moon, Wifi, Gift][i % 5],
      title: b.ar,
      desc: product.features?.[i]?.ar || "ميزة مختارة لتجربة أفضل.",
    }));

  return (
    <motion.section
      id="benefits"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="space-y-8 scroll-mt-24"
    >
      <div className="text-center max-w-xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">ماذا يغيّر لك؟</h2>
        <p className="text-white/55 text-sm mt-2">فوائد حقيقية — مش مجرد مواصفات</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {benefitBlocks.map((b) => (
          <div key={b.title} className="flex gap-4 rounded-2xl bg-[#12121a]/80 border border-white/8 p-5 sm:p-6">
            <div className="shrink-0 h-11 w-11 rounded-full bg-white/5 flex items-center justify-center">
              <b.icon className="h-5 w-5 text-[#818cf8]" />
            </div>
            <div>
              <p className="font-bold text-white">{b.title}</p>
              <p className="text-sm text-white/55 mt-1.5 leading-relaxed">{b.desc}</p>
            </div>
          </div>
        ))}
      </div>
      {onOrderClick && (
        <div className="text-center">
          <button
            type="button"
            onClick={onOrderClick}
            className="inline-flex items-center justify-center gap-2 h-12 px-8 rounded-full bg-[#6366f1] hover:bg-[#4f46e5] text-white font-bold text-sm"
          >
            <ShoppingBag className="h-4 w-4" />
            اطلب الآن
          </button>
        </div>
      )}
    </motion.section>
  );
}

function getVideoPoster(videoSrc: string, productSlug: string): string | undefined {
  const base = videoSrc.replace(/^.*\//, "").replace(/\.mp4$/i, "");
  if (base) return `/videos/posters/${base}.webp`;
  return resolveProductImage(productSlug, "02-premium-hero", "webp") || undefined;
}

export function ProductVideoSection({ product }: SectionProps) {
  const cro = getProductCroContent(product.slug);
  const videoSrc = cro?.videoSrc || product.videoUrl;
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [playing, setPlaying] = useState(false);
  if (!videoSrc) return null;

  const startPlayback = () => {
    const el = videoRef.current;
    if (!el) return;
    void el.play().then(() => setPlaying(true)).catch(() => {
      // Keep poster + play button if autoplay/gesture is blocked
      setPlaying(false);
    });
  };

  return (
    <motion.section
      id="video"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="space-y-5 scroll-mt-24"
    >
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white">شاهد النتيجة</h2>
        <p className="text-sm text-white/55 mt-2">الاستخدام · المزايا · الأجواء النهائية</p>
      </div>
      <div className="relative aspect-[9/16] max-h-[65vh] mx-auto w-full max-w-sm rounded-3xl overflow-hidden bg-black border border-white/10">
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          controls={playing}
          playsInline
          preload="metadata"
          poster={getVideoPoster(videoSrc, product.slug)}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => setPlaying(false)}
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
        {!playing && (
          <button
            type="button"
            onClick={startPlayback}
            className="absolute inset-0 z-10 flex items-center justify-center bg-black/25"
            aria-label="تشغيل الفيديو"
          >
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur transition-colors hover:bg-[#6366f1]/80">
              <Play className="h-7 w-7 fill-white text-white ms-0.5" />
            </span>
          </button>
        )}
      </div>
    </motion.section>
  );
}

export function ProductComparisonSection({ product }: SectionProps) {
  const cro = getProductCroContent(product.slug);
  const comparison = cro?.comparison ?? {
    oursLabel: product.name.ar,
    rows: [
      { label: "جودة مختارة", us: true as const, them: false as const },
      { label: "الدفع عند الاستلام", us: true as const, them: "نادر" },
      { label: "ضمان وخدمة", us: true as const, them: false as const },
    ],
  };

  return (
    <motion.section
      id="compare"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="space-y-6 scroll-mt-24"
    >
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white">لماذا هذا المنتج؟</h2>
        <p className="text-sm text-white/55 mt-2">مقارنة سريعة مع الإضاءة العادية</p>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-white/8 bg-[#12121a]/60">
        <table className="w-full min-w-[300px] text-sm">
          <thead>
            <tr className="border-b border-white/8 text-white/45">
              <th className="text-start py-3 px-4 font-medium">المعيار</th>
              <th className="py-3 px-3 font-bold text-[#818cf8]">{comparison.oursLabel}</th>
              <th className="py-3 px-3 font-medium">عادي</th>
            </tr>
          </thead>
          <tbody>
            {comparison.rows.map((row) => (
              <tr key={row.label} className="border-b border-white/5">
                <td className="py-3.5 px-4 text-white/75 text-start">{row.label}</td>
                <td className="py-3.5 px-3 text-center">
                  {row.us === true ? (
                    <Check className="h-5 w-5 text-emerald-400 mx-auto" />
                  ) : (
                    <span className="text-emerald-400 font-bold text-xs">{String(row.us)}</span>
                  )}
                </td>
                <td className="py-3.5 px-3 text-center">
                  {row.them === false ? (
                    <X className="h-5 w-5 text-white/20 mx-auto" />
                  ) : (
                    <span className="text-white/35 text-xs">{String(row.them)}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.section>
  );
}

export function ProductHowToSection({ product }: SectionProps) {
  const cro = getProductCroContent(product.slug);
  const howTo = cro?.howTo ?? getGenericHowTo(product);

  return (
    <motion.section
      id="howto"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="space-y-6 scroll-mt-24"
    >
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white">طريقة الاستخدام</h2>
        <p className="text-sm text-white/55 mt-2">خطوات بسيطة من أول مساء</p>
      </div>
      <ol className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {howTo.map((step) => {
          const img = step.imageKey ? resolveProductImage(product.slug, step.imageKey, "webp") : null;
          return (
            <li key={step.step} className={cn("rounded-2xl bg-[#12121a]/80 border border-white/8 overflow-hidden")}>
              {img && (
                <div className="relative aspect-[16/10] bg-[#0a0a0f]">
                  <Image src={img} alt={step.title} fill className="object-cover" sizes="(max-width:640px) 100vw, 50vw" loading="lazy" />
                </div>
              )}
              <div className="p-5 flex gap-3">
                <span className="shrink-0 h-8 w-8 rounded-full bg-[#6366f1] text-white font-black text-sm flex items-center justify-center">
                  {step.step}
                </span>
                <div>
                  <p className="font-bold text-white">{step.title}</p>
                  <p className="text-sm text-white/55 mt-1 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </motion.section>
  );
}

/** Legacy composite — prefer individual sections for page order control */
export function ProductCroSections({ product, onOrderClick }: SectionProps & { onOrderClick: () => void }) {
  return (
    <div className="space-y-14 mt-14">
      <ProductBenefitsSection product={product} onOrderClick={onOrderClick} />
      <ProductVideoSection product={product} />
      <ProductComparisonSection product={product} />
      <ProductHowToSection product={product} />
    </div>
  );
}
