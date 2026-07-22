"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  Star,
  ChevronLeft,
  Shield,
  Truck,
  RotateCcw,
  MessageCircle,
  Banknote,
  ShoppingBag,
  BadgeCheck,
  Minus,
  Plus,
} from "lucide-react";
import type { Product } from "@/types";
import { useRecentlyViewedStore } from "@/lib/store/recently-viewed-store";
import { trackEvent } from "@/components/analytics/analytics-scripts";
import { products, getProductById, getReviewsForProduct } from "@/data/products";
import { formatPriceNumber, calculateDiscount, cn } from "@/lib/utils";
import { resolveProductHero } from "@/lib/product-images/resolve";
import { getProductCroContent } from "@/lib/product-cro-content";
import { PremiumProductGallery } from "@/components/product/product-gallery-premium";

const ProductOrderForm = dynamic(
  () => import("@/components/product/product-order-form").then((m) => m.ProductOrderForm),
  { ssr: true, loading: () => <div className="min-h-[420px]" aria-hidden /> }
);
const ProductLandingSections = dynamic(
  () => import("@/components/product/product-landing-sections").then((m) => m.ProductLandingSections),
  { ssr: true }
);
const ProductTrustBlocks = dynamic(
  () => import("@/components/product/product-trust-blocks").then((m) => m.ProductTrustBlocks),
  { ssr: true }
);
const ProductBenefitsSection = dynamic(
  () => import("@/components/product/product-cro-sections").then((m) => m.ProductBenefitsSection),
  { ssr: true }
);
const ProductVideoSection = dynamic(
  () => import("@/components/product/product-cro-sections").then((m) => m.ProductVideoSection),
  { ssr: true }
);
const ProductComparisonSection = dynamic(
  () => import("@/components/product/product-cro-sections").then((m) => m.ProductComparisonSection),
  { ssr: true }
);
const ProductHowToSection = dynamic(
  () => import("@/components/product/product-cro-sections").then((m) => m.ProductHowToSection),
  { ssr: true }
);
const TRUST_BADGES = [
  { icon: Banknote, label: "الدفع عند الاستلام" },
  { icon: Truck, label: "شحن سريع" },
  { icon: Shield, label: "ضمان الجودة" },
  { icon: MessageCircle, label: "خدمة عملاء" },
] as const;

function getBenefitHeadline(product: Product): { title: string; subtitle: string } {
  const cro = getProductCroContent(product.slug);
  if (cro?.headline) return cro.headline;
  if (product.problemSolution) {
    return { title: product.problemSolution.ar, subtitle: product.shortDescription.ar };
  }
  return { title: product.name.ar, subtitle: product.shortDescription.ar };
}

function getProductFaqs(product: Product) {
  const warranty = product.warrantyMonths || 12;
  const delivery =
    `24-48 ساعة للمدن الكبرى، 2-4 أيام لباقي المدن. ضمان ${warranty} شهر واستبدال خلال 7 أيام عند وجود عيب.`;

  if (product.slug === "bluetooth-star-projector") {
    return [
      { q: "هل يوجد الدفع عند الاستلام؟", a: "نعم، الدفع عند الاستلام فقط. تطلب بلا بطاقة بنكية وتخلّص كاش ملي يوصلك الطلب." },
      { q: "كم وضع إضاءة فيه؟", a: "حتى 21 وضع إسقاط مع ألوان LED أحمر/أخضر/أزرق/أبيض وتركيبات موجات ونجوم." },
      { q: "واش فيه بلوتوث وموسيقى؟", a: "نعم، سبيكر بلوتوث مدمج. تقدّر توصل الهاتف أو تستعمل USB / بطاقة TF حسب الجهاز." },
      { q: "كيفاش كيخدم المؤقت؟", a: "من الريموت تقدّر تختار مؤقت إيقاف تلقائي 1 ساعة أو 2 ساعة — مناسب قبل النوم." },
      { q: "شنو الطاقة وشنو في العلبة؟", a: "الطاقة عبر USB DC 5V (6W تقريباً). العلبة فيها البروجيكتور، الريموت، كابل USB، ودليل. بطاريات الريموت 2×AAA غير مشمولة." },
      { q: "كم مدة التوصيل وهل فيه ضمان؟", a: delivery },
    ];
  }
  if (product.slug === "northern-lights-galaxy-projector") {
    return [
      { q: "هل يوجد الدفع عند الاستلام؟", a: "نعم، الدفع عند الاستلام فقط. تطلب بلا بطاقة بنكية وتخلّص كاش ملي يوصلك الطلب." },
      { q: "شنو الفرق ديال هاد البروجيكتور؟", a: "جسم أبيض هندسي متعدد الأوجه يعرض أورورا شمالية مع نجوم وقمر هلالي، مع سبيكر بلوتوث وريموت أبيض." },
      { q: "واش فيه بلوتوث؟", a: "نعم، سبيكر بلوتوث مدمج لتشغيل الموسيقى من الهاتف." },
      { q: "كيفاش كيخدم المؤقت؟", a: "من الريموت الأبيض تقدّر تختار مؤقت إيقاف 1 ساعة أو 2 ساعة." },
      { q: "شنو كاين في العلبة؟", a: "البروجيكتور، الريموت الأبيض، كابل USB/Type-C، ودليل الاستخدام." },
      { q: "كم مدة التوصيل وهل فيه ضمان؟", a: delivery },
    ];
  }
  if (product.slug === "rabbit-carousel-night-light") {
    return [
      { q: "هل يوجد الدفع عند الاستلام؟", a: "نعم، الدفع عند الاستلام فقط. تطلبين بلا بطاقة بنكية وتخلّصي كاش ملي يوصلك الطلب." },
      { q: "واش الأرانب كيدورو؟", a: "نعم، كاروسيل دوّار 360° مع تماثيل أرانب باش يخلق أجواء سحرية قبل النوم." },
      { q: "شحال ديال أفلام الإسقاط؟", a: "6 أفلام قابلة للتبديل: سماء نجوم، عالم المحيط، أرض الديناصورات، عيد ميلاد سعيد، خيال تحت الماء، وغابة الحيوانات." },
      { q: "كيفاش كيشتغل؟", a: "تشغيل عبر USB — تقدري توصّليه بالشاحن أو باور بانك أو اللابتوب. فيه 5 ألوان LED وتعديل سطوع." },
      { q: "كيفاش نبدّل فيلم الإسقاط؟", a: "انزعي غطاء المصباح، دوّري كأس الإضاءة، بدّلي قرص الفيلم، ثم أعيدي التركيب — ثواني فقط." },
      { q: "شنو كاين فالعلبة؟", a: "مصباح الكاروسيل الوردي، 6 أقراص أفلام إسقاط، ودليل الاستخدام." },
      { q: "كم مدة التوصيل وهل فيه ضمان؟", a: delivery },
    ];
  }
  return [
    { q: "هل يوجد الدفع عند الاستلام؟", a: "نعم، الدفع عند الاستلام فقط. تطلب بلا بطاقة بنكية وتخلّص كاش ملي يوصلك الطلب." },
    { q: "شنو كيعطي هاد البروجيكتور؟", a: "إسقاط مجرة ونجوم HD من خوذة رائد الفضاء، مع سبيكر بلوتوث 5.0 مدمج باش تشغّل موسيقاك من الهاتف في نفس الوقت." },
    { q: "واش صعيب التشغيل؟", a: "لا. وصّل Type-C، شغّل الجهاز، اربط البلوتوث، وتحكّم بالريموت. أغلب العملاء كيشغّلوه في أقل من دقيقتين." },
    { q: "مناسب لغرفة الأطفال؟", a: "نعم — إضاءة ناعمة وأجواء مهدّئة قبل النوم، مع تصميم لطيف كيعجب الأطفال." },
    { q: "شنو كاين فالعلبة؟", a: "بروجيكتور رائد الفضاء MX003، ريموت تحكم، كابل Type-C، ودليل الاستخدام." },
    { q: "كم مدة التوصيل وهل فيه ضمان؟", a: delivery },
  ];
}

interface ProductPageArProps {
  product: Product;
  related?: Product[];
}

export function ProductPageAr({ product, related: relatedProp }: ProductPageArProps) {
  const addRecentlyViewed = useRecentlyViewedStore((s) => s.addProduct);
  const recentlyViewedIds = useRecentlyViewedStore((s) => s.productIds);

  const [variant] = useState(product.variants[0]);
  const [qty, setQty] = useState(1);
  const [sticky, setSticky] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const name = product.name.ar;
  const discount = calculateDiscount(variant.price, variant.compareAtPrice);
  const reviews = getReviewsForProduct(product.id);
  const headline = getBenefitHeadline(product);
  const productFaqs = getProductFaqs(product);
  const savedAmount =
    variant.compareAtPrice && variant.compareAtPrice > variant.price
      ? variant.compareAtPrice - variant.price
      : 0;

  const related = useMemo(
    () => (relatedProp && relatedProp.length > 0 ? relatedProp : products.filter((p) => p.id !== product.id)).slice(0, 4),
    [relatedProp, product.id],
  );

  const recentlyViewed = useMemo(
    () =>
      recentlyViewedIds
        .filter((id) => id !== product.id)
        .map((id) => getProductById(id))
        .filter((p): p is Product => Boolean(p))
        .slice(0, 8),
    [recentlyViewedIds, product.id],
  );

  useEffect(() => {
    addRecentlyViewed(product.id);
    trackEvent("ViewContent", {
      content_ids: [product.id],
      content_type: "product",
      value: variant.price,
      currency: "MAD",
    });
  }, [product.id, variant.price, addRecentlyViewed]);

  useEffect(() => {
    const onScroll = () => setSticky(window.scrollY > 480);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToOrder = useCallback(() => {
    document.getElementById("order-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const maxQty = Math.min(variant.stock || 10, 10);

  return (
    <div className="product-luxury bg-[#0a0a0f] text-white min-h-screen font-sans" dir="rtl">
      {/* شريط ثقة علوي */}
      <div className="bg-[#12121a] border-b border-white/10 text-white/80 text-xs sm:text-sm py-2.5 px-4">
        <div className="max-w-3xl mx-auto flex flex-wrap justify-center gap-x-6 gap-y-1 text-center">
          <span className="flex items-center gap-1.5">
            <Banknote className="h-3.5 w-3.5" /> الدفع عند الاستلام
          </span>
          <span className="hidden sm:inline text-white/20">|</span>
          <span className="flex items-center gap-1.5">
            <Truck className="h-3.5 w-3.5" /> شحن سريع
          </span>
          <span className="hidden sm:inline text-white/20">|</span>
          <span className="flex items-center gap-1.5">
            <Shield className="h-3.5 w-3.5" /> ضمان الجودة
          </span>
          <span className="hidden sm:inline text-white/20">|</span>
          <span className="flex items-center gap-1.5">
            <MessageCircle className="h-3.5 w-3.5" /> خدمة عملاء
          </span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 pb-28 lg:pb-16 pt-4 space-y-10 sm:space-y-14">
        <nav className="flex items-center gap-2 text-xs text-white/50">
          <Link href="/ar" className="hover:text-[#6366f1] transition-colors">
            نورڤا
          </Link>
          <ChevronLeft className="h-3 w-3" />
          <Link href="/ar/products" className="hover:text-[#6366f1] transition-colors">
            المجموعة
          </Link>
          <ChevronLeft className="h-3 w-3" />
          <span className="font-medium truncate text-white/80">{name}</span>
        </nav>

        {/* 1. الصور */}
        <section aria-label="صور المنتج">
          <PremiumProductGallery product={product} />
        </section>

        {/* 2. اسم المنتج */}
        <section className="space-y-3 text-center sm:text-start">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-sm">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "h-3.5 w-3.5",
                    i < Math.floor(product.rating) ? "fill-luxury-gold text-luxury-gold" : "text-white/20",
                  )}
                />
              ))}
            </div>
            <span className="text-white/55 text-xs">
              {product.rating} · {product.reviewCount.toLocaleString("ar-MA")}+ تقييم
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold leading-tight tracking-tight text-white">{name}</h1>
          <p className="text-white/60 text-base leading-relaxed max-w-xl mx-auto sm:mx-0">{headline.subtitle}</p>
        </section>

        {/* 3. السعر */}
        <section className="rounded-3xl border border-white/10 bg-[#12121a] px-6 py-7 sm:px-8 sm:py-8 space-y-3">
          <div className="flex flex-wrap items-end gap-x-3 gap-y-2">
            <span className="text-5xl sm:text-6xl font-black tabular-nums text-white leading-none tracking-tight">
              {formatPriceNumber(variant.price, "ar")}
            </span>
            <span className="text-lg font-bold text-white/70 pb-1">درهم</span>
            {variant.compareAtPrice && variant.compareAtPrice > variant.price && (
              <span className="text-xl text-white/35 line-through tabular-nums pb-1.5 ms-1">
                {formatPriceNumber(variant.compareAtPrice, "ar")}
              </span>
            )}
            {discount > 0 && (
              <span className="ms-auto sm:ms-2 mb-1 inline-flex items-center rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-sm font-black px-3.5 py-1.5">
                وفر {discount}%
              </span>
            )}
          </div>
          {savedAmount > 0 && (
            <p className="text-sm font-semibold text-emerald-400/90">
              بدلاً من {formatPriceNumber(variant.compareAtPrice || 0, "ar")} درهم
            </p>
          )}
        </section>

        {/* 4. شارات الثقة */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {TRUST_BADGES.map((b) => (
            <div
              key={b.label}
              className="flex flex-col items-center gap-2 rounded-2xl border border-white/8 bg-[#12121a]/70 px-3 py-4 text-center"
            >
              <b.icon className="h-5 w-5 text-emerald-400" />
              <span className="text-[11px] sm:text-xs font-semibold text-white/80 leading-snug">{b.label}</span>
            </div>
          ))}
        </section>

        {/* الكمية — خارج النموذج */}
        <section className="flex items-center justify-between sm:justify-start gap-6 rounded-2xl border border-white/8 bg-[#12121a]/50 px-5 py-4">
          <span className="text-sm font-medium text-white/70">الكمية</span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="إنقاص الكمية"
              disabled={qty <= 1}
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="h-10 w-10 rounded-full border border-white/15 flex items-center justify-center text-white disabled:opacity-30 hover:bg-white/5"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-8 text-center text-lg font-bold tabular-nums">{qty}</span>
            <button
              type="button"
              aria-label="زيادة الكمية"
              disabled={qty >= maxQty}
              onClick={() => setQty((q) => Math.min(maxQty, q + 1))}
              className="h-10 w-10 rounded-full border border-white/15 flex items-center justify-center text-white disabled:opacity-30 hover:bg-white/5"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </section>

        {/* 5. زر اطلب الآن */}
        <button
          type="button"
          onClick={scrollToOrder}
          className="w-full h-14 sm:h-16 rounded-2xl bg-[#6366f1] hover:bg-[#4f46e5] text-white font-black text-base sm:text-lg flex items-center justify-center gap-2.5 shadow-lg shadow-indigo-500/30 transition-colors"
        >
          <ShoppingBag className="h-5 w-5" />
          اطلب الآن
        </button>

        {/* 6. نموذج الطلب */}
        <ProductOrderForm product={product} variant={variant} quantity={qty} />

        {/* 7. الفوائد */}
        <ProductBenefitsSection product={product} onOrderClick={scrollToOrder} />

        {/* 8. الفيديو */}
        <ProductVideoSection product={product} />

        {/* 9. الصور التوضيحية + طريقة الاستخدام */}
        <ProductLandingSections product={product} />
        <ProductHowToSection product={product} />

        {/* 10. المقارنة */}
        <ProductComparisonSection product={product} />

        {/* قصة المنتج / محتويات العلبة / التوصيل */}
        <ProductTrustBlocks product={product} hideGuarantee />

        {/* 11. المواصفات */}
        {product.specifications && product.specifications.length > 0 && (
          <section id="specs" className="scroll-mt-24">
            <div className="rounded-3xl border border-white/10 bg-[#12121a]/80 p-6 sm:p-8">
              <h2 className="text-xl sm:text-2xl font-bold text-center mb-6 text-white">المواصفات</h2>
              <div className="max-w-xl mx-auto divide-y divide-white/5 rounded-2xl border border-white/8 overflow-hidden">
                {product.specifications.map((spec, i) => (
                  <div key={i} className="flex justify-between items-center gap-4 px-5 py-3.5 bg-[#0a0a0f]/40">
                    <span className="text-white/55 text-sm">{spec.label.ar}</span>
                    <span className="font-semibold text-white text-sm text-end">{spec.value.ar}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 12. الأسئلة الشائعة */}
        <section id="faq" className="scroll-mt-24">
          <div className="rounded-3xl border border-white/10 bg-[#12121a]/80 p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-center mb-6 text-white">الأسئلة الشائعة</h2>
            <div className="space-y-2.5 max-w-2xl mx-auto">
              {productFaqs.map((faq, i) => (
                <div key={i} className="rounded-2xl border border-white/8 bg-[#0a0a0f]/40 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex justify-between items-center px-5 py-4 text-start font-medium text-sm text-white hover:text-[#818cf8] transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronLeft className={cn("h-4 w-4 shrink-0 transition-transform", openFaq === i && "-rotate-90")} />
                  </button>
                  <AnimatePresence initial={false}>
                    {openFaq === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22 }}
                        className="overflow-hidden"
                      >
                        <p className="px-5 pb-4 text-sm text-white/55 leading-relaxed">{faq.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 13. التقييمات */}
        <section id="reviews" className="scroll-mt-24">
          <div className="rounded-3xl border border-white/10 bg-[#12121a]/80 p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-center mb-2 text-white">آراء العملاء</h2>
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-4 w-4",
                      i < Math.floor(product.rating) ? "fill-luxury-gold text-luxury-gold" : "text-white/20",
                    )}
                  />
                ))}
              </div>
              <p className="text-white/55 text-sm">
                {product.rating} من 5 · {product.reviewCount.toLocaleString("ar-MA")} تقييم
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {reviews.slice(0, 3).map((r) => (
                <div key={r.id} className="rounded-2xl border border-white/8 bg-[#0a0a0f]/50 p-5 flex flex-col">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={cn("h-3.5 w-3.5", i < r.rating ? "fill-luxury-gold text-luxury-gold" : "text-white/20")}
                        />
                      ))}
                    </div>
                    {r.verified && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full">
                        <BadgeCheck className="h-3 w-3" />
                        موثق
                      </span>
                    )}
                  </div>
                  <p className="font-bold text-sm text-white mb-2">{r.title.ar}</p>
                  <p className="text-sm text-white/60 leading-relaxed flex-1">{r.content.ar}</p>
                  <div className="flex items-center gap-3 mt-4 pt-4 border-t border-white/8">
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold">
                      {r.author.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold truncate">{r.author}</p>
                      <p className="text-[10px] text-white/45 truncate">{r.city}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 14. الضمان */}
        <section id="guarantee" className="scroll-mt-24">
          <div className="rounded-3xl border border-white/10 bg-[#12121a]/80 p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-center mb-6 text-white">الضمان والثقة</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto">
              {[
                {
                  icon: RotateCcw,
                  title: "استبدال خلال 7 أيام",
                  desc: "عند وجود عيب مصنعي — عبر واتساب.",
                },
                {
                  icon: Shield,
                  title: `ضمان ${product.warrantyMonths || 12} شهر`,
                  desc: "تغطية على عيوب التصنيع.",
                },
                {
                  icon: Banknote,
                  title: "الدفع عند الاستلام",
                  desc: "ادفع فقط بعد استلام الطلب.",
                },
                {
                  icon: Truck,
                  title: "شحن محمي",
                  desc: "تغليف آمن لجميع مدن المغرب.",
                },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-4 rounded-2xl border border-white/8 bg-[#0a0a0f]/40 p-5">
                  <div className="shrink-0 bg-emerald-500/10 p-2.5 rounded-xl">
                    <item.icon className="h-5 w-5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{item.title}</p>
                    <p className="text-xs text-white/50 mt-1.5 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* منتجات ذات صلة */}
        {related.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-center mb-5 text-white/80">منتجات قد تعجبك</h2>
            <div className="grid grid-cols-2 gap-3">
              {related.slice(0, 2).map((p) => (
                <Link
                  key={p.id}
                  href={`/ar/products/${p.slug}`}
                  className="group rounded-2xl overflow-hidden border border-white/8 bg-[#12121a] hover:border-[#6366f1]/40 transition-colors"
                >
                  <div className="relative aspect-square">
                    <Image src={resolveProductHero(p)} alt={p.name.ar} fill className="object-cover" sizes="40vw" loading="lazy" />
                  </div>
                  <div className="p-3 text-center">
                    <p className="text-xs font-bold line-clamp-2 text-white mb-1">{p.name.ar}</p>
                    <p className="text-sm font-bold text-[#818cf8]">{formatPriceNumber(p.price, "ar")} درهم</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {recentlyViewed.length > 0 && (
          <section className="opacity-80">
            <h2 className="text-sm font-medium text-center mb-4 text-white/50">شوهد مؤخرًا</h2>
            <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
              {recentlyViewed.map((p) => (
                <Link
                  key={p.id}
                  href={`/ar/products/${p.slug}`}
                  className="shrink-0 w-28 rounded-xl overflow-hidden border border-white/8 bg-[#12121a]"
                >
                  <div className="relative aspect-square">
                    <Image src={resolveProductHero(p)} alt={p.name.ar} fill className="object-cover" sizes="112px" />
                  </div>
                  <p className="text-[10px] font-medium line-clamp-2 text-white/70 p-2 text-center">{p.name.ar}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* 15. Footer ثقة */}
        <footer className="pt-6 border-t border-white/10 flex flex-wrap justify-center gap-x-8 gap-y-3 text-center text-sm text-white/50 pb-4">
          <span className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-[#6366f1]" /> طلب آمن
          </span>
          <span className="flex items-center gap-2">
            <Banknote className="h-4 w-4 text-[#6366f1]" /> دفع عند الاستلام
          </span>
          <span className="flex items-center gap-2">
            <Truck className="h-4 w-4 text-[#6366f1]" /> شحن سريع
          </span>
          <span className="flex items-center gap-2">
            <RotateCcw className="h-4 w-4 text-[#6366f1]" /> استبدال 7 أيام
          </span>
        </footer>
      </div>

      {/* Sticky CTA — موبايل */}
      <AnimatePresence>
        {sticky && (
          <motion.div
            initial={{ y: 88 }}
            animate={{ y: 0 }}
            exit={{ y: 88 }}
            className="fixed bottom-0 inset-x-0 z-50 lg:hidden bg-[#0a0a0f]/95 backdrop-blur-md border-t border-white/10 safe-area-pb"
          >
            <div className="px-4 py-3 max-w-lg mx-auto">
              <button
                type="button"
                onClick={scrollToOrder}
                className="w-full h-14 rounded-2xl bg-[#6366f1] text-white font-black text-base flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/30 active:scale-[0.98] transition-transform"
              >
                <ShoppingBag className="h-5 w-5" />
                اطلب الآن — {formatPriceNumber(variant.price * qty, "ar")} درهم
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
