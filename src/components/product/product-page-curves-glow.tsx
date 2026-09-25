"use client";

import { useState, useEffect, useCallback, useRef, type ReactNode, type CSSProperties } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  ChevronLeft,
  Shield,
  Truck,
  Banknote,
  ShoppingBag,
  Check,
  Gift,
  Sparkles,
  Star,
  Heart,
} from "lucide-react";
import type { Product } from "@/types";
import { getReviewsForProduct, moroccanCities } from "@/data/products";
import { FacebookProductTracker } from "@/components/facebook/facebook-trackers";
import { formatPriceNumber, calculateDiscount, cn } from "@/lib/utils";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CURVES_GLOW_FAQS } from "@/data/curves-glow-faqs";

const ProductOrderForm = dynamic(
  () => import("@/components/product/product-order-form").then((m) => m.ProductOrderForm),
  { ssr: true, loading: () => <div className="min-h-[420px]" aria-hidden /> },
);

const CTA = "اطلبي العرض دابا";
const ACCENT = "#8b3a4a";
const VALUE_SINGLE = 279;

function ImageSlot({
  label,
  className,
  ratio = "aspect-square",
}: {
  label: string;
  className?: string;
  ratio?: string;
}) {
  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-2xl border border-dashed border-[#8b3a4a]/35 bg-gradient-to-br from-[#f7ebe6] via-[#f3e0d8] to-[#e8cfc4]",
        ratio,
        className,
      )}
      aria-label={label}
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4 text-center">
        <span className="rounded-full bg-white/70 px-3 py-1 text-[11px] font-bold tracking-wide text-[#8b3a4a]">
          صورة قريباً
        </span>
        <p className="text-sm font-semibold text-[#5c3a3a]/90">{label}</p>
      </div>
    </div>
  );
}

function CtaButton({
  onClick,
  children,
  className,
}: {
  onClick: () => void;
  children: ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full h-14 sm:h-16 rounded-2xl text-white font-black text-base sm:text-lg flex items-center justify-center gap-2.5 shadow-lg shadow-[#8b3a4a]/25 transition-colors hover:brightness-110",
        className,
      )}
      style={{ backgroundColor: ACCENT }}
    >
      <ShoppingBag className="h-5 w-5" />
      {children}
    </button>
  );
}

interface Props {
  product: Product;
}

export function ProductPageCurvesGlow({ product }: Props) {
  const variant = product.variants[0];
  const price = variant.price;
  const compareAt = variant.compareAtPrice && variant.compareAtPrice > price ? variant.compareAtPrice : 558;
  const discount = calculateDiscount(price, compareAt);
  const reviews = getReviewsForProduct(product.id);
  const [sticky, setSticky] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const formSentinel = useRef<HTMLDivElement>(null);

  const scrollToOrder = useCallback(() => {
    document.getElementById("order-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  useEffect(() => {
    const onScroll = () => setSticky(window.scrollY > 320);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const el = formSentinel.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setFormVisible(entry.isIntersecting), {
      threshold: 0.12,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const showSticky = sticky && !formVisible;
  const priceLabel = `${formatPriceNumber(price, "ar")} درهم`;

  return (
    <div
      className="min-h-screen bg-[#faf6f3] text-[#2a1c1c] font-sans w-full max-w-full overflow-x-clip"
      dir="rtl"
      style={
        {
          "--curves-accent": ACCENT,
        } as CSSProperties
      }
    >
      <FacebookProductTracker
        productId={product.id}
        contentName={product.name.ar}
        value={price}
        currency="MAD"
        quantity={1}
      />

      {/* Top bar */}
      <div className="bg-[#8b3a4a] text-white text-xs sm:text-sm py-2.5 px-4">
        <div className="max-w-3xl mx-auto flex flex-wrap justify-center gap-x-5 gap-y-1 text-center">
          <span className="flex items-center gap-1.5">
            <Gift className="h-3.5 w-3.5 text-amber-200" /> كولاجين بحري هدية مجانية
          </span>
          <span className="hidden sm:inline text-white/30">|</span>
          <span className="flex items-center gap-1.5">
            <Truck className="h-3.5 w-3.5" /> الشحن مجاني
          </span>
          <span className="hidden sm:inline text-white/30">|</span>
          <span className="flex items-center gap-1.5">
            <Banknote className="h-3.5 w-3.5 text-emerald-200" /> الدفع عند الاستلام
          </span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 pb-28 lg:pb-16 pt-4 space-y-10 sm:space-y-12 min-w-0 w-full">
        <nav className="flex items-center gap-2 text-xs text-[#7a6363]">
          <Link href="/ar" className="hover:text-[#8b3a4a] transition-colors">
            الرئيسية
          </Link>
          <ChevronLeft className="h-3 w-3" />
          <Link href="/ar/products" className="hover:text-[#8b3a4a] transition-colors">
            المنتجات
          </Link>
          <ChevronLeft className="h-3 w-3" />
          <span className="font-medium truncate text-[#2a1c1c]">Pack Curves & Glow</span>
        </nav>

        {/* HERO — one composition */}
        <section className="space-y-5">
          <div className="relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-[#8b3a4a] via-[#a34d5c] to-[#6e2e3a] text-white px-5 py-8 sm:px-8 sm:py-10">
            <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_20%_20%,#fff7,transparent_45%),radial-gradient(circle_at_80%_70%,#f3c,transparent_40%)]" />
            <div className="relative space-y-4 text-center">
              <p className="font-display text-3xl sm:text-4xl font-bold tracking-tight">Curves & Glow</p>
              <h1 className="text-xl sm:text-2xl font-black leading-snug max-w-lg mx-auto">
                شكل أنثوي… وبشرة لامعة — فـ روتين واحد
              </h1>
              <p className="text-sm sm:text-base text-white/85 leading-relaxed max-w-md mx-auto">
                بروتين Curves + كولاجين بحري <span className="font-bold text-amber-200">هدية مجانية</span> باش تكمّلي الروتين.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
                <span className="rounded-full bg-white/15 px-3 py-1 font-semibold">⭐ {product.rating}/5</span>
                <span className="rounded-full bg-white/15 px-3 py-1 font-semibold">
                  {product.reviewCount}+ تقييم
                </span>
                <span className="rounded-full bg-white/15 px-3 py-1 font-semibold">+{product.soldCount} طلبية</span>
              </div>
            </div>
          </div>

          <ImageSlot label="صورة العرض الرئيسية — Pack Curves & Glow" ratio="aspect-[4/3] sm:aspect-[16/10]" />

          <div className="rounded-3xl border border-[#8b3a4a]/15 bg-white p-5 sm:p-7 text-center space-y-4 shadow-sm">
            <p className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-xs font-bold text-amber-900">
              <Sparkles className="h-3.5 w-3.5" /> عرض محدود — هدية الكولاجين مجاناً
            </p>
            <p className="text-sm text-[#7a6363]">
              القيمة{" "}
              <span className="line-through decoration-[#7a6363]/60">
                {formatPriceNumber(compareAt, "ar")} درهم
              </span>
              {discount > 0 && (
                <span className="ms-2 font-bold text-emerald-700">توفير {discount}%</span>
              )}
            </p>
            <p className="text-4xl sm:text-5xl font-black tabular-nums leading-none" style={{ color: ACCENT }}>
              {formatPriceNumber(price, "ar")}{" "}
              <span className="text-xl font-bold text-[#2a1c1c]">درهم</span>
            </p>
            <p className="text-sm font-bold text-[#2a1c1c]">جوج منتجات · ثمن واحد · توصيل مجاني 🚚</p>
            <CtaButton onClick={scrollToOrder}>{CTA}</CtaButton>
            <p className="text-xs text-[#8a7575]">ما كخلصي والو دابا — الدفع عند الاستلام</p>
          </div>
        </section>

        {/* What's in the offer */}
        <section className="space-y-4">
          <h2 className="text-center text-xl sm:text-2xl font-black">شنو غادي تاخدي بـ{priceLabel}؟</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-[#e8d5cf] bg-white overflow-hidden">
              <ImageSlot label="صورة بروتين Curves" />
              <div className="p-4 text-center space-y-1">
                <p className="font-black text-[#2a1c1c]">بروتين الشكل الأنثوي</p>
                <p className="text-xs text-[#7a6363]">ورك + صدر · بدون زيادة وزن عامة</p>
                <p className="text-sm font-bold text-[#8b3a4a]">
                  قيمة {formatPriceNumber(VALUE_SINGLE, "ar")} درهم
                </p>
              </div>
            </div>
            <div className="rounded-2xl border-2 border-emerald-400/60 bg-white overflow-hidden relative">
              <span className="absolute top-3 start-3 z-10 rounded-full bg-emerald-600 px-2.5 py-0.5 text-[11px] font-bold text-white flex items-center gap-1">
                <Gift className="h-3 w-3" /> هدية مجانية
              </span>
              <ImageSlot label="صورة كولاجين بحري — الهدية" />
              <div className="p-4 text-center space-y-1">
                <p className="font-black text-[#2a1c1c]">كولاجين بحري</p>
                <p className="text-xs text-emerald-700 font-semibold">بشرة · شعر · أظافر — لإكمال الروتين</p>
                <p className="text-sm font-bold text-emerald-700">
                  مجاني (قيمة {formatPriceNumber(VALUE_SINGLE, "ar")} درهم)
                </p>
              </div>
            </div>
          </div>
          <p className="text-center text-lg font-black" style={{ color: ACCENT }}>
            العرض كامل بـ{priceLabel} فقط
          </p>
          <CtaButton onClick={scrollToOrder}>خدي العرض + الهدية دابا</CtaButton>
        </section>

        {/* Why the gift */}
        <section className="rounded-3xl bg-white border border-[#e8d5cf] p-5 sm:p-7 space-y-4">
          <div className="flex items-start gap-3">
            <div className="shrink-0 rounded-2xl bg-[#8b3a4a]/10 p-3 text-[#8b3a4a]">
              <Heart className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black">علاش الكولاجين هدية؟</h2>
              <p className="mt-2 text-sm sm:text-base text-[#5c4545] leading-relaxed">
                البروتين وحدو كيعاون على الشكل. باش تشوفي فرق واضح فالمرآة، خاص الروتين يكمّل من الداخل:
                <strong className="text-[#2a1c1c]"> بشرة مشدودة، شعر قوي، وأظافر سليمة</strong>.
                الكولاجين البحري هو الحلقة الناقصة — عطيناه لك مجاناً باش ما تفكريش وتكمّلي الروتين من أول طلب.
              </p>
            </div>
          </div>
          <ul className="grid gap-2 sm:grid-cols-3">
            {[
              { t: "Curves", d: "شكل أنثوي مستهدف" },
              { t: "Glow", d: "إشراقة البشرة والشعر" },
              { t: "سهل", d: "روتين يومي بلا تعقيد" },
            ].map((item) => (
              <li
                key={item.t}
                className="rounded-2xl bg-[#faf6f3] border border-[#e8d5cf] px-4 py-3 text-center"
              >
                <p className="font-black text-[#8b3a4a]">{item.t}</p>
                <p className="text-xs text-[#7a6363] mt-1">{item.d}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* Problem → Solution */}
        <section className="space-y-4">
          <h2 className="text-center text-xl sm:text-2xl font-black">المشكل… والحل</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-red-200/80 bg-red-50/50 overflow-hidden">
              <ImageSlot label="قبل — المشكل" ratio="aspect-[4/3]" />
              <div className="p-4 space-y-2">
                <p className="text-xs font-bold text-red-700">قبل</p>
                <p className="font-bold text-[#2a1c1c]">بغيتي curves… وما بغيتيش تزيد الوزن كامل</p>
                <ul className="space-y-1.5 text-sm text-[#5c4545]">
                  {[
                    "تمارين بلا نتيجة واضحة",
                    "مكمّلات عشوائية",
                    "بشرة وشعر ما كيتبدّلوش مع الروتين",
                  ].map((x) => (
                    <li key={x} className="flex gap-2">
                      <span className="text-red-500 shrink-0">×</span>
                      {x}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="rounded-2xl border border-emerald-300/80 bg-emerald-50/40 overflow-hidden">
              <ImageSlot label="بعد — النتيجة" ratio="aspect-[4/3]" />
              <div className="p-4 space-y-2">
                <p className="text-xs font-bold text-emerald-700">بعد</p>
                <p className="font-bold text-[#2a1c1c]">روتين Curves + Glow فـ طلب واحد</p>
                <ul className="space-y-1.5 text-sm text-[#5c4545]">
                  {[
                    "بروتين للشكل الأنثوي",
                    "كولاجين هدية للبشرة والشعر",
                    "ثمن واحد 399 درهم — بلا تردد",
                  ].map((x) => (
                    <li key={x} className="flex gap-2">
                      <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      {x}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <CtaButton onClick={scrollToOrder}>{CTA}</CtaButton>
        </section>

        {/* Benefits */}
        <section className="space-y-4">
          <h2 className="text-center text-xl sm:text-2xl font-black">شنو غادي يبدّل الروتين ديالك؟</h2>
          <div className="grid gap-3">
            {(product.benefits || []).slice(0, 6).map((b) => (
              <div
                key={b.ar}
                className="flex items-start gap-3 rounded-2xl border border-[#e8d5cf] bg-white px-4 py-3.5"
              >
                <Check className="h-5 w-5 text-[#8b3a4a] shrink-0 mt-0.5" />
                <p className="text-sm sm:text-base font-semibold text-[#2a1c1c]">{b.ar}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How to use */}
        <section className="rounded-3xl border border-[#e8d5cf] bg-white p-5 sm:p-7 space-y-5">
          <h2 className="text-center text-xl sm:text-2xl font-black">كيفاش تستعملي؟ 3 خطوات</h2>
          <ImageSlot label="صورة طريقة الاستعمال" ratio="aspect-[16/9]" />
          <ol className="space-y-3">
            {[
              "حضّري شيك بروتين Curves يومياً حسب العلبة",
              "خذي الكولاجين البحري يومياً لإكمال روتين البشرة والشعر",
              "كمّلي بأكل متوازن — الاستمرار كيبان فالمرآة",
            ].map((step, i) => (
              <li key={step} className="flex gap-3 items-start">
                <span
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-black text-white"
                  style={{ backgroundColor: ACCENT }}
                >
                  {i + 1}
                </span>
                <p className="text-sm sm:text-base font-semibold pt-1">{step}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* Package */}
        <section className="rounded-3xl border border-[#e8d5cf] bg-white p-5 sm:p-7 space-y-4">
          <h2 className="text-center text-xl sm:text-2xl font-black">📦 شنو كيجي فالطلب؟</h2>
          <ImageSlot label="صورة محتويات العلبة" ratio="aspect-[16/10]" />
          <div className="grid gap-2">
            {(product.packageIncludes || []).map((item) => (
              <div
                key={item.ar}
                className="flex items-center gap-3 rounded-2xl bg-[#faf6f3] border border-[#e8d5cf] px-4 py-3 text-sm font-semibold"
              >
                <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                {item.ar}
              </div>
            ))}
          </div>
        </section>

        {/* Reviews */}
        <section className="space-y-4" id="reviews">
          <div className="text-center space-y-2">
            <h2 className="text-xl sm:text-2xl font-black">شنو قالت الزبونات؟</h2>
            <p className="text-sm text-[#7a6363] flex items-center justify-center gap-1.5">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              {product.rating}/5 · {product.reviewCount}+ تقييم موثّق
            </p>
          </div>
          <div className="space-y-3">
            {reviews.slice(0, 6).map((r) => (
              <article
                key={r.id}
                className="rounded-2xl border border-[#e8d5cf] bg-white p-4 sm:p-5 space-y-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="font-bold text-sm">{r.author}</p>
                    <p className="text-[11px] text-[#8a7575]">
                      {r.city}
                      {r.verified ? " · ✓ طلب موثّق" : ""}
                    </p>
                  </div>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "h-3.5 w-3.5",
                          i < r.rating ? "fill-amber-400 text-amber-400" : "text-[#e8d5cf]",
                        )}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm font-bold text-[#2a1c1c]">{r.title.ar}</p>
                <p className="text-sm text-[#5c4545] leading-relaxed">{r.content.ar}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Trust */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { icon: Banknote, t: "الدفع عند الاستلام", d: "ما كخلصي دابا" },
            { icon: Truck, t: "توصيل مجاني", d: "كل المدن" },
            { icon: Shield, t: "طلب آمن", d: "تأكيد بالهاتف" },
            { icon: Gift, t: "هدية مضمونة", d: "كولاجين مع الطلب" },
          ].map(({ icon: Icon, t, d }) => (
            <div
              key={t}
              className="rounded-2xl border border-[#e8d5cf] bg-white p-3 text-center space-y-1.5"
            >
              <Icon className="h-5 w-5 mx-auto text-[#8b3a4a]" />
              <p className="text-xs font-bold">{t}</p>
              <p className="text-[10px] text-[#8a7575]">{d}</p>
            </div>
          ))}
        </section>

        {/* FAQ */}
        <section className="space-y-3">
          <h2 className="text-center text-xl sm:text-2xl font-black">أسئلة سريعة</h2>
          <Accordion type="single" collapsible className="rounded-2xl border border-[#e8d5cf] bg-white px-4">
            {CURVES_GLOW_FAQS.map((faq, i) => (
              <AccordionItem key={faq.q} value={`faq-${i}`} className="border-[#e8d5cf]">
                <AccordionTrigger className="text-sm sm:text-base font-bold text-right hover:no-underline">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-[#5c4545] leading-relaxed">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        {/* Final CTA + Form */}
        <section className="rounded-3xl border-2 border-[#8b3a4a]/25 bg-white p-5 sm:p-7 space-y-4 text-center">
          <p className="text-xs font-bold text-[#8b3a4a]">آخر خطوة — بلا بطاقة بنكية</p>
          <h2 className="text-xl sm:text-2xl font-black"> Pack Curves & Glow بـ{priceLabel}</h2>
          <p className="text-sm text-[#5c4545]">
            بروتين + كولاجين هدية · توصيل مجاني · خلّصي غير ملي يوصلك الطلب
          </p>
          <CtaButton onClick={scrollToOrder}>{CTA}</CtaButton>
        </section>

        <div ref={formSentinel}>
          <ProductOrderForm
            product={product}
            variant={variant}
            quantity={1}
            locale="ar"
            extendedAddress
            cityOptions={moroccanCities}
            submitLabel="أكّدي الطلب — الدفع عند الاستلام"
            formTitle="اطلبي Pack Curves & Glow"
            formSubtitle="كولاجين بحري هدية · توصيل مجاني · خلّصي عند الباب"
            quantityLabel="1× Pack Curves & Glow (بروتين + كولاجين هدية)"
            summaryRows={[
              { label: "بروتين Curves", value: "مشمول" },
              { label: "كولاجين بحري", value: "هدية مجانية 🎁" },
            ]}
            orderNote="PACK Curves & Glow | Protein + Marine Collagen GIFT | 399 DH"
            fullNamePlaceholder="الاسم الكامل"
          />
        </div>
      </div>

      {/* Sticky CTA */}
      {showSticky && (
        <div className="fixed bottom-0 inset-x-0 z-50 border-t border-[#e8d5cf] bg-white/95 backdrop-blur-md p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:hidden">
          <div className="max-w-3xl mx-auto flex items-center gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-xs text-[#7a6363] truncate">Pack + هدية كولاجين</p>
              <p className="font-black tabular-nums" style={{ color: ACCENT }}>
                {priceLabel}
              </p>
            </div>
            <button
              type="button"
              onClick={scrollToOrder}
              className="shrink-0 h-12 px-5 rounded-xl text-white font-black text-sm flex items-center gap-2"
              style={{ backgroundColor: ACCENT }}
            >
              <ShoppingBag className="h-4 w-4" />
              اطلبي
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
