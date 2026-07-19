"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  Star, ChevronLeft, Shield, Truck, Package,
  RotateCcw, MessageCircle, Banknote, ShoppingBag,
  BadgeCheck, Clock,
} from "lucide-react";
import type { Product } from "@/types";
import { useRecentlyViewedStore } from "@/lib/store/recently-viewed-store";
import { trackEvent } from "@/components/analytics/analytics-scripts";
import { products, getProductById, getReviewsForProduct } from "@/data/products";
import { formatPriceNumber, calculateDiscount, cn } from "@/lib/utils";
import { ProductOrderForm } from "@/components/product/product-order-form";
import { PremiumProductGallery } from "@/components/product/product-gallery-premium";
import { ProductLandingSections } from "@/components/product/product-landing-sections";
import { ProductTrustBlocks } from "@/components/product/product-trust-blocks";
import { FlashCountdown, StockScarcityBar } from "@/components/product/flash-countdown";

const BENEFIT_CARDS_DEFAULT = [
  { emoji: "✨", text: "يحوّل الغرفة إلى مجرة مذهلة" },
  { emoji: "🌙", text: "يساعد على الاسترخاء قبل النوم" },
  { emoji: "🎁", text: "هدية مثالية لأي مناسبة" },
  { emoji: "🎵", text: "مكبر صوت بلوتوث مدمج" },
  { emoji: "🎮", text: "ريموت للتحكم عن بعد" },
  { emoji: "⏰", text: "مؤقت ذكي للإيقاف التلقائي" },
  { emoji: "🌈", text: "أكثر من 10 أوضاع إضاءة" },
];

const BENEFIT_CARDS_STARBT = [
  { emoji: "🌌", text: "حتى 21 وضع إضاءة ملونة" },
  { emoji: "💎", text: "قبة كريستال شفافة متعددة الأوجه" },
  { emoji: "🎵", text: "سبيكر بلوتوث + USB/TF" },
  { emoji: "🎮", text: "ريموت كامل للتحكم عن بعد" },
  { emoji: "⏰", text: "مؤقت إيقاف 1 ساعة / 2 ساعة" },
  { emoji: "🌙", text: "مثالي للنوم والاسترخاء" },
  { emoji: "🎁", text: "هدية مثالية للعائلة والأطفال" },
];

const BENEFIT_CARDS_AURORA = [
  { emoji: "🌌", text: "أورورا شمالية متحركة" },
  { emoji: "🌙", text: "قمر هلالي + نجوم" },
  { emoji: "⬜", text: "تصميم أبيض هندسي أنيق" },
  { emoji: "🎵", text: "سبيكر بلوتوث مدمج" },
  { emoji: "🎮", text: "ريموت أبيض بتحكم كامل" },
  { emoji: "⏰", text: "مؤقت إيقاف 1 ساعة / 2 ساعة" },
  { emoji: "🎁", text: "هدية مثالية للديكور والحفلات" },
];

const BENEFIT_CARDS_RABBIT = [
  { emoji: "🐰", text: "أرانب دوّارة 360°" },
  { emoji: "🎞️", text: "6 أفلام إسقاط قابلة للتبديل" },
  { emoji: "🎨", text: "5 ألوان LED ناعمة" },
  { emoji: "✨", text: "إسقاط سحري على الجدران" },
  { emoji: "🔌", text: "تشغيل USB مرن" },
  { emoji: "🎀", text: "تصميم وردي فاخر" },
  { emoji: "🎁", text: "هدية مثالية للأطفال" },
];

function getFeatureChips(slug: string): string[] {
  if (slug === "rabbit-carousel-night-light") {
    return ["دوران 360°", "6 أفلام", "5 ألوان", "USB", "LED"];
  }
  if (slug === "northern-lights-galaxy-projector") {
    return ["بلوتوث", "ريموت", "مؤقت", "USB", "أورورا"];
  }
  if (slug === "bluetooth-star-projector") {
    return ["بلوتوث", "21 وضع", "ريموت", "مؤقت", "USB"];
  }
  return ["ريموت", "إضاءة", "هدية", "USB", "ضمان"];
}

const WHY_NOORVA = [
  { icon: Shield, title: "جودة ممتازة", desc: "منتجات مختارة بعناية" },
  { icon: Banknote, title: "الدفع عند الاستلام", desc: "خلّص كاش عند الباب" },
  { icon: Truck, title: "شحن سريع", desc: "24-48 ساعة للمدن الكبرى" },
  { icon: Package, title: "تغليف فاخر", desc: "حماية كاملة وتجربة أنيقة" },
  { icon: MessageCircle, title: "خدمة عملاء", desc: "دعم سريع عبر واتساب" },
  { icon: RotateCcw, title: "استبدال خلال 7 أيام", desc: "عند وجود عيب" },
];

interface ProductPageArProps {
  product: Product;
  related?: Product[];
}

import { resolveProductHero } from "@/lib/product-images/resolve";

export function ProductPageAr({ product, related: relatedProp }: ProductPageArProps) {
  const addRecentlyViewed = useRecentlyViewedStore((s) => s.addProduct);
  const recentlyViewedIds = useRecentlyViewedStore((s) => s.productIds);

  const [variant] = useState(product.variants[0]);
  const [qty, setQty] = useState(1);
  const [sticky, setSticky] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const ar = (obj: { ar: string }) => obj.ar;
  const name = ar(product.name);
  const discount = calculateDiscount(variant.price, variant.compareAtPrice);
  const reviews = getReviewsForProduct(product.id);

  const related = useMemo(
    () => (relatedProp && relatedProp.length > 0 ? relatedProp : products.filter((p) => p.id !== product.id)).slice(0, 4),
    [relatedProp, product.id]
  );

  const recentlyViewed = useMemo(
    () =>
      recentlyViewedIds
        .filter((id) => id !== product.id)
        .map((id) => getProductById(id))
        .filter((p): p is Product => Boolean(p))
        .slice(0, 8),
    [recentlyViewedIds, product.id]
  );

  const benefitCards =
    product.slug === "bluetooth-star-projector"
      ? BENEFIT_CARDS_STARBT
      : product.slug === "northern-lights-galaxy-projector"
        ? BENEFIT_CARDS_AURORA
        : product.slug === "rabbit-carousel-night-light"
          ? BENEFIT_CARDS_RABBIT
          : BENEFIT_CARDS_DEFAULT;

  const featureChips = getFeatureChips(product.slug);

  const productFaqs =
    product.slug === "bluetooth-star-projector"
      ? [
          { q: "هل يوجد الدفع عند الاستلام؟", a: "نعم، الدفع عند الاستلام فقط. تطلب بلا بطاقة بنكية وتخلّص كاش ملي يوصلك الطلب." },
          { q: "كم وضع إضاءة فيه؟", a: "حتى 21 وضع إسقاط مع ألوان LED أحمر/أخضر/أزرق/أبيض وتركيبات موجات ونجوم." },
          { q: "واش فيه بلوتوث وموسيقى؟", a: "نعم، سبيكر بلوتوث مدمج. تقدّر توصل الهاتف أو تستعمل USB / بطاقة TF حسب الجهاز." },
          { q: "كيفاش كيخدم المؤقت؟", a: "من الريموت تقدّر تختار مؤقت إيقاف تلقائي 1 ساعة أو 2 ساعة — مناسب قبل النوم." },
          { q: "شنو الطاقة وشنو في العلبة؟", a: "الطاقة عبر USB DC 5V (6W تقريباً). العلبة فيها البروجيكتور، الريموت، كابل USB، ودليل. بطاريات الريموت 2×AAA غير مشمولة." },
          { q: "كم مدة التوصيل وهل فيه ضمان؟", a: `24-48 ساعة للمدن الكبرى، 2-4 أيام لباقي المدن. ضمان ${product.warrantyMonths || 12} شهر واستبدال خلال 7 أيام عند وجود عيب.` },
        ]
      : product.slug === "northern-lights-galaxy-projector"
        ? [
            { q: "هل يوجد الدفع عند الاستلام؟", a: "نعم، الدفع عند الاستلام فقط. تطلب بلا بطاقة بنكية وتخلّص كاش ملي يوصلك الطلب." },
            { q: "شنو الفرق ديال هاد البروجيكتور؟", a: "جسم أبيض هندسي متعدد الأوجه يعرض أورورا شمالية مع نجوم وقمر هلالي، مع سبيكر بلوتوث وريموت أبيض." },
            { q: "واش فيه بلوتوث؟", a: "نعم، سبيكر بلوتوث مدمج لتشغيل الموسيقى من الهاتف (مؤكد من مرجع المنتج)." },
            { q: "كيفاش كيخدم المؤقت؟", a: "من الريموت الأبيض تقدّر تختار مؤقت إيقاف 1 ساعة أو 2 ساعة." },
            { q: "شنو كاين في العلبة؟", a: "البروجيكتور، الريموت الأبيض، كابل USB/Type-C، ودليل الاستخدام." },
            { q: "كم مدة التوصيل وهل فيه ضمان؟", a: `24-48 ساعة للمدن الكبرى، 2-4 أيام لباقي المدن. ضمان ${product.warrantyMonths || 12} شهر واستبدال خلال 7 أيام عند وجود عيب.` },
          ]
        : product.slug === "rabbit-carousel-night-light"
          ? [
              { q: "هل يوجد الدفع عند الاستلام؟", a: "نعم، الدفع عند الاستلام فقط. تطلبين بلا بطاقة بنكية وتخلّصي كاش ملي يوصلك الطلب." },
              { q: "واش الأرانب كيدورو؟", a: "نعم، كاروسيل دوّار 360° مع تماثيل أرانب باش يخلق أجواء سحرية قبل النوم." },
              { q: "شحال ديال أفلام الإسقاط؟", a: "6 أفلام قابلة للتبديل: سماء نجوم، عالم المحيط، أرض الديناصورات، عيد ميلاد سعيد، خيال تحت الماء، وغابة الحيوانات." },
              { q: "كيفاش كيشتغل؟", a: "تشغيل عبر USB — تقدري توصّليه بالشاحن أو باور بانك أو اللابتوب. فيه 5 ألوان LED وتعديل سطوع." },
              { q: "كيفاش نبدّل فيلم الإسقاط؟", a: "انزعي غطاء المصباح، دوّري كأس الإضاءة، بدّلي قرص الفيلم، ثم أعيدي التركيب — ثواني فقط." },
              { q: "شنو كاين فالعلبة؟", a: "مصباح الكاروسيل الوردي، 6 أقراص أفلام إسقاط، ودليل الاستخدام (محتويات العلبة: 4 عناصر حسب المواصفات)." },
              { q: "كم مدة التوصيل وهل فيه ضمان؟", a: `24-48 ساعة للمدن الكبرى، 2-4 أيام لباقي المدن. ضمان ${product.warrantyMonths || 12} شهر واستبدال خلال 7 أيام عند وجود عيب.` },
            ]
        : [
            { q: "هل يوجد الدفع عند الاستلام؟", a: "نعم، الدفع عند الاستلام فقط. تطلب بلا بطاقة بنكية وتخلّص كاش ملي يوصلك الطلب." },
            { q: "كم مدة التوصيل؟", a: "24-48 ساعة للمدن الكبرى (الدار البيضاء، الرباط، مراكش، فاس، طنجة). 2-4 أيام لباقي المدن." },
            { q: "هل يمكن الاستبدال؟", a: "نعم، استبدال خلال 7 أيام عند وجود عيب. تواصل معنا على واتساب." },
            { q: "هل المنتج مضمون؟", a: `نعم، ضمان ${product.warrantyMonths || 12} شهر على جميع منتجات NOORVA.` },
          ];

  useEffect(() => {
    addRecentlyViewed(product.id);
    trackEvent("ViewContent", { content_ids: [product.id], content_type: "product", value: variant.price, currency: "MAD" });
  }, [product.id, variant.price, addRecentlyViewed]);

  useEffect(() => {
    const onScroll = () => setSticky(window.scrollY > 420);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToOrder = useCallback(() => {
    document.getElementById("order-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <div className="product-luxury bg-[#0a0a0f] text-white min-h-screen font-sans" dir="rtl">
      {/* شريط الثقة العلوي */}
      <div className="bg-[#12121a] border-b border-white/10 text-white/80 text-xs sm:text-sm py-2.5 px-4">
        <div className="max-w-6xl mx-auto flex flex-wrap justify-center gap-x-6 gap-y-1 text-center">
          <span className="flex items-center gap-1.5"><Truck className="h-3.5 w-3.5" /> توصيل سريع إلى جميع مدن المغرب</span>
          <span className="hidden sm:inline text-white/20">|</span>
          <span className="flex items-center gap-1.5"><Banknote className="h-3.5 w-3.5" /> الدفع عند الاستلام</span>
          <span className="hidden sm:inline text-white/20">|</span>
          <span className="flex items-center gap-1.5"><RotateCcw className="h-3.5 w-3.5" /> استبدال خلال 7 أيام</span>
          <span className="hidden sm:inline text-white/20">|</span>
          <span className="flex items-center gap-1.5"><Shield className="h-3.5 w-3.5" /> طلب آمن 100%</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pb-28 lg:pb-16 pt-4">
        {/* مسار التنقل */}
        <nav className="flex items-center gap-2 text-xs text-white/50 mb-6">
          <Link href="/ar" className="hover:text-[#6366f1] transition-colors">نورڤا</Link>
          <ChevronLeft className="h-3 w-3" />
          <Link href="/ar/products" className="hover:text-[#6366f1] transition-colors">المجموعة</Link>
          <ChevronLeft className="h-3 w-3" />
          <span className="font-medium truncate text-white/80">{name}</span>
        </nav>

        {/* المعرض + معلومات الشراء */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-start">
          {/* المعرض — موبايل أولاً */}
          <div className="lg:col-span-8 order-1 lg:order-2 space-y-6">
            <PremiumProductGallery product={product} />

            {product.problem && product.problemSolution && (
              <section className="hidden lg:block text-center bg-[#1a1a24] rounded-[2rem] p-8 border border-white/10 shadow-luxury">
                <h2 className="text-2xl md:text-3xl font-bold leading-tight tracking-tight text-white mb-4">
                  {product.problemSolution.ar.split(" ").slice(0, 3).join(" ")}{" "}
                  <span className="text-[#6366f1]">{product.problemSolution.ar.split(" ").slice(3).join(" ")}</span>
                </h2>
                <p className="text-base md:text-lg text-white/70 leading-relaxed max-w-2xl mx-auto">
                  {product.problem.ar}
                </p>
              </section>
            )}
          </div>

          {/* عنوان وسعر — موبايل قبل نموذج الطلب (CRO) */}
          <div className="order-2 lg:hidden space-y-4">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm">
              <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full">
                <span className="text-emerald-400 text-xs font-bold">متوفر في المخزون</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={cn("h-3.5 w-3.5", i < Math.floor(product.rating) ? "fill-luxury-gold text-luxury-gold" : "text-white/20")} />
                  ))}
                </div>
                <span className="font-bold text-white text-xs">({product.rating})</span>
                <span className="text-white/60 text-xs">{product.reviewCount.toLocaleString("ar-MA")}+ تقييم</span>
              </div>
            </div>
            <h1 className="text-2xl font-bold leading-tight tracking-tight text-white">{name}</h1>
            <p className="text-white/70 leading-relaxed text-base">{product.shortDescription.ar}</p>
            <div className="flex flex-wrap items-center gap-3 py-3 border-y border-white/10">
              <span className="text-3xl font-bold tabular-nums text-white">{formatPriceNumber(variant.price, "ar")}</span>
              <span className="text-sm font-bold text-white/60">درهم مغربي</span>
              {variant.compareAtPrice && variant.compareAtPrice > variant.price && (
                <span className="text-base text-white/40 line-through tabular-nums">{formatPriceNumber(variant.compareAtPrice, "ar")}</span>
              )}
              {discount > 0 && (
                <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                  خصم {discount}%
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {featureChips.map((chip) => (
                <span key={chip} className="text-[11px] font-medium text-white/80 bg-white/5 border border-white/10 rounded-full px-3 py-1">
                  {chip}
                </span>
              ))}
            </div>
          </div>

          {/* العمود — معلومات المنتج + نموذج الطلب */}
          <div className="order-3 lg:order-1 lg:col-span-4 space-y-5 lg:sticky lg:top-6 lg:self-start">
            <div className="hidden lg:block space-y-5">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm">
                <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full">
                  <span className="text-emerald-400 text-xs font-bold">متوفر في المخزون</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={cn("h-3.5 w-3.5", i < Math.floor(product.rating) ? "fill-luxury-gold text-luxury-gold" : "text-white/20")} />
                    ))}
                  </div>
                  <span className="font-bold text-white text-xs">({product.rating})</span>
                </div>
                <span className="inline-flex items-center gap-1.5 text-white/60 text-xs">
                  {product.reviewCount.toLocaleString("ar-MA")}+ تقييم
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-[1.75rem] font-bold leading-tight tracking-tight text-white">{name}</h1>
              <p className="text-white/70 leading-relaxed">{product.shortDescription.ar}</p>

              <div className="flex flex-wrap gap-2">
                {featureChips.map((chip) => (
                  <span key={chip} className="text-[11px] font-medium text-white/80 bg-white/5 border border-white/10 rounded-full px-3 py-1">
                    {chip}
                  </span>
                ))}
              </div>

              <div className="py-4 border-y border-white/10">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-4xl sm:text-5xl font-bold tabular-nums text-white">{formatPriceNumber(variant.price, "ar")}</span>
                  <div className="flex flex-col justify-center">
                    <span className="text-xs font-bold text-white/60 leading-none mb-1">مغربي</span>
                    <span className="text-xs font-bold text-white/60 leading-none">درهم</span>
                  </div>
                  {variant.compareAtPrice && variant.compareAtPrice > variant.price && (
                    <div className="flex flex-col justify-center ms-4 border-s border-white/10 ps-4">
                      <span className="text-lg text-white/40 line-through tabular-nums leading-none mb-1">{formatPriceNumber(variant.compareAtPrice || 0, "ar")}</span>
                      <span className="text-[10px] text-white/40 leading-none">السعر الأصلي</span>
                    </div>
                  )}
                  {discount > 0 && (
                    <span className="ms-auto bg-red-600 text-white text-sm font-bold px-4 py-1.5 rounded-full">
                      خصم {discount}%
                    </span>
                  )}
                </div>
              </div>
            </div>

            <ProductOrderForm product={product} variant={variant} quantity={qty} />

            <div className="grid grid-cols-3 gap-2 text-center">
              {[
                { icon: Banknote, label: "دفع عند الباب" },
                { icon: Truck, label: "توصيل سريع" },
                { icon: Shield, label: "ضمان 12 شهر" },
              ].map((t) => (
                <div key={t.label} className="bg-[#1a1a24] border border-white/10 rounded-xl px-2 py-3">
                  <t.icon className="h-4 w-4 text-emerald-400 mx-auto mb-1.5" />
                  <p className="text-[10px] font-medium text-white/70 leading-tight">{t.label}</p>
                </div>
              ))}
            </div>

            {product.flashSaleEndsAt && (
              <div className="space-y-3">
                <FlashCountdown endDate={product.flashSaleEndsAt} />
                <StockScarcityBar stock={variant.stock} originalStock={Math.max(variant.stock, 100)} />
              </div>
            )}
          </div>
        </div>

        <ProductLandingSections product={product} />
        <ProductTrustBlocks product={product} />

        {/* لماذا NOORVA */}
        <section className="mt-12">
          <h2 className="text-xl sm:text-2xl font-bold text-center mb-8">لماذا تختار جهازنا؟</h2>
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {WHY_NOORVA.map((item, i) => (
                  <div key={i} className="bg-[#1a1a24] rounded-2xl p-4 border border-white/10 flex items-center text-start gap-4 hover:border-[#6366f1]/50 transition-colors">
                    <div className="shrink-0 bg-white/5 p-3 rounded-xl">
                      <item.icon className="h-6 w-6 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{item.title}</p>
                      <p className="text-xs text-white/60 mt-1">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
        </section>

            {/* لماذا ستحبه */}
            <section className="mt-8">
              <div className="bg-[#1a1a24] rounded-[2rem] p-8 border border-white/10">
                <h2 className="text-xl sm:text-2xl font-bold text-center mb-8 text-white">لماذا ستحبه؟</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                  {(product.benefits.length >= 4
                    ? product.benefits.map((b, i) => ({ emoji: benefitCards[i % benefitCards.length]?.emoji || "✨", text: b.ar }))
                    : benefitCards
                  ).map((card, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }} className="bg-[#12121a] rounded-2xl p-4 sm:p-5 border border-white/10 shadow-soft hover:shadow-luxury hover:-translate-y-1 transition-all duration-300 text-center">
                      <span className="text-2xl">{card.emoji}</span>
                      <p className="text-sm font-medium text-white mt-3 leading-snug">{card.text}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

        {/* المواصفات التقنية — جدول */}
        {product.specifications && product.specifications.length > 0 && (
          <section className="mt-12">
            <div className="bg-[#1a1a24] rounded-[2rem] p-8 border border-white/10">
              <h2 className="text-xl sm:text-2xl font-bold text-center mb-8 text-white">المواصفات التقنية</h2>
              <div className="max-w-2xl mx-auto bg-[#12121a] rounded-2xl border border-white/10 divide-y divide-white/5">
                {product.specifications.map((spec, i) => (
                  <div key={i} className="flex justify-between items-center gap-4 px-6 py-4">
                    <span className="text-white/60 text-sm">{spec.label.ar}</span>
                    <span className="font-bold text-white text-sm text-end">{spec.value.ar}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* آراء العملاء */}
        <section id="reviews">
          <div className="bg-[#1a1a24] rounded-[2rem] p-8 border border-white/10">
            <h2 className="text-xl sm:text-2xl font-bold text-center mb-2 text-white">آراء العملاء</h2>
            <div className="flex items-center justify-center gap-2 mb-8">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={cn("h-4 w-4", i < Math.floor(product.rating) ? "fill-luxury-gold text-luxury-gold" : "text-white/20")} />
                ))}
              </div>
              <p className="text-white/60 text-sm">{product.rating} من 5 · {product.reviewCount.toLocaleString("ar-MA")} تقييم موثّق</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {reviews.slice(0, 3).map((r) => (
                <div key={r.id} className="bg-[#12121a] rounded-2xl p-5 border border-white/10 flex flex-col h-full">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={cn("h-3.5 w-3.5", i < r.rating ? "fill-luxury-gold text-luxury-gold" : "text-white/20")} />
                      ))}
                    </div>
                    {r.verified && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full shrink-0">
                        <BadgeCheck className="h-3 w-3" />شراء موثق
                      </span>
                    )}
                  </div>
                  <p className="font-bold text-sm text-white mb-2">{r.title.ar}</p>
                  <p className="text-sm text-white/70 leading-relaxed flex-1">{r.content.ar}</p>
                  {r.images && (
                    <div className="flex gap-2 mt-4">
                      {r.images.map((img, i) => (
                        <div key={i} className="relative w-12 h-12 rounded-lg overflow-hidden border border-white/10"><Image src={img} alt="" fill className="object-cover" sizes="48px" /></div>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center gap-3 mt-4 pt-4 border-t border-white/10">
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white text-xs font-bold shrink-0">
                      {r.author.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white truncate">{r.author}</p>
                      <p className="text-[10px] text-white/50 truncate">{r.city}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* الأسئلة الشائعة */}
        <section className="max-w-4xl mx-auto">
          <div className="bg-[#1a1a24] rounded-[2rem] p-8 border border-white/10">
            <h2 className="text-xl sm:text-2xl font-bold text-center mb-8 text-white">الأسئلة الشائعة</h2>
            <div className="space-y-3">
              {productFaqs.map((faq, i) => (
                <div key={i} className="bg-[#12121a] rounded-2xl border border-white/10 overflow-hidden">
                  <button type="button" onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex justify-between items-center px-5 py-4 text-start font-medium text-sm text-white hover:text-[#6366f1] transition-colors">
                    <span className="flex items-center gap-3">
                      <span className="text-[#6366f1]">+</span>
                      {faq.q}
                    </span>
                    <ChevronLeft className={cn("h-4 w-4 shrink-0 transition-transform", openFaq === i && "-rotate-90")} />
                  </button>
                  <AnimatePresence initial={false}>
                    {openFaq === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <p className="px-5 pb-4 text-sm text-white/60 leading-relaxed ps-10">{faq.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* منتجات قد تعجبك */}
        {related.length > 0 && (
          <section>
            <div className="bg-[#1a1a24] rounded-[2rem] p-8 border border-white/10">
              <h2 className="text-xl sm:text-2xl font-bold text-center mb-8 text-white">منتجات قد تعجبك</h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {related.map((p) => (
                  <Link key={p.id} href={`/ar/products/${p.slug}`} className="group bg-[#12121a] rounded-2xl overflow-hidden border border-white/10 hover:border-[#6366f1]/50 hover:shadow-luxury transition-all duration-300 flex flex-col">
                    <div className="relative aspect-square">
                      <Image src={resolveProductHero(p)} alt={p.name.ar} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="25vw" />
                    </div>
                    <div className="p-4 text-center flex flex-col flex-1">
                      <p className="text-sm font-bold line-clamp-2 text-white group-hover:text-[#6366f1] transition-colors mb-2">{p.name.ar}</p>
                      <p className="text-sm font-bold tabular-nums text-[#6366f1] mt-auto">{formatPriceNumber(p.price, "ar")} درهم</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* شوهد مؤخرًا */}
        {recentlyViewed.length > 0 && (
          <section>
            <div className="bg-[#1a1a24] rounded-[2rem] p-8 border border-white/10">
              <h2 className="text-xl sm:text-2xl font-bold text-center mb-8 flex items-center justify-center gap-2 text-white">
                <Clock className="h-5 w-5 text-white/50" />
                شوهد مؤخرًا
              </h2>
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-4">
                {recentlyViewed.map((p) => (
                  <Link key={p.id} href={`/ar/products/${p.slug}`} className="group shrink-0 w-36 sm:w-auto bg-[#12121a] rounded-2xl overflow-hidden border border-white/10 hover:border-[#6366f1]/50 hover:shadow-luxury transition-all duration-300 flex flex-col">
                    <div className="relative aspect-square">
                      <Image src={resolveProductHero(p)} alt={p.name.ar} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="144px" />
                    </div>
                    <div className="p-4 text-center flex flex-col flex-1">
                      <p className="text-xs font-bold line-clamp-2 text-white group-hover:text-[#6366f1] transition-colors mb-2">{p.name.ar}</p>
                      <p className="text-xs font-bold tabular-nums text-[#6366f1] mt-auto">{formatPriceNumber(p.price, "ar")} درهم</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* شريط الثقة السفلي */}
        <div className="pt-8 border-t border-white/10 flex flex-wrap justify-center gap-x-8 gap-y-4 text-center text-sm text-white/60 mb-8">
          <span className="flex items-center gap-2"><Shield className="h-4 w-4 text-[#6366f1]" /> طلب آمن 100%</span>
          <span className="flex items-center gap-2"><Banknote className="h-4 w-4 text-[#6366f1]" /> دفع عند الاستلام</span>
          <span className="flex items-center gap-2"><Truck className="h-4 w-4 text-[#6366f1]" /> توصيل سريع ومجاني</span>
          <span className="flex items-center gap-2"><RotateCcw className="h-4 w-4 text-[#6366f1]" /> ضمان استبدال 7 أيام</span>
        </div>
      </div>

      {/* شريط شراء ثابت — موبايل */}
      <AnimatePresence>
        {sticky && (
          <motion.div initial={{ y: 80 }} animate={{ y: 0 }} exit={{ y: 80 }} className="fixed bottom-0 inset-x-0 z-50 lg:hidden bg-[#12121a]/95 backdrop-blur-md border-t border-white/10 shadow-luxury safe-area-pb">
            <div className="flex items-center gap-3 px-4 py-3 max-w-lg mx-auto">
              <div className="flex-1 min-w-0">
                <p className="text-lg font-bold tabular-nums leading-tight text-[#6366f1]">{formatPriceNumber(variant.price, "ar")} <span className="text-xs">درهم</span></p>
                <p className="text-[11px] text-white/60">الدفع عند الاستلام</p>
              </div>
              <button type="button" onClick={scrollToOrder} className="h-12 px-6 sm:px-8 rounded-xl bg-[#6366f1] text-white font-bold text-sm active:scale-95 transition-transform flex items-center gap-2 shrink-0 shadow-lg shadow-indigo-500/25 hover:bg-[#4f46e5]">
                <ShoppingBag className="h-4 w-4" />
                تأكيد الطلب
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
