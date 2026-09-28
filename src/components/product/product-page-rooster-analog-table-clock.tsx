"use client";

import { useState, useEffect, useCallback, useRef, type ReactNode } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, Banknote, Truck, Heart, Home, Gift, Star, Check } from "lucide-react";
import type { Product, ProductVariant } from "@/types";
import { getReviewsForProduct } from "@/data/products";
import {
  ROOSTER_CLOCK_FRAME_COLOR,
  ROOSTER_CLOCK_FAQS,
  ROOSTER_CLOCK_PACK_PRICE_MAD,
  ROOSTER_CLOCK_PACK_SAVINGS_MAD,
  ROOSTER_CLOCK_PRICE_MAD,
} from "@/data/rooster-analog-table-clock";
import { isPackVariantSku } from "@/components/product/product-variant-picker";
import { formatPriceNumber, cn } from "@/lib/utils";
import { resolveProductImage } from "@/lib/product-images/resolve";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const ProductOrderForm = dynamic(
  () => import("@/components/product/product-order-form").then((m) => m.ProductOrderForm),
  { ssr: true, loading: () => <div className="min-h-[420px]" aria-hidden /> },
);

const SLUG = "rooster-analog-table-clock";
const SINGLE_PRICE = ROOSTER_CLOCK_PRICE_MAD;
const PACK_PRICE = ROOSTER_CLOCK_PACK_PRICE_MAD;
const PACK_SAVINGS = ROOSTER_CLOCK_PACK_SAVINGS_MAD;

const FAQ_ITEMS = ROOSTER_CLOCK_FAQS.map((item) => ({ q: item.q, a: item.a }));

function FrameColorUnderPhoto({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex items-center justify-center gap-3 border-t border-[#d4c4b0]/80 bg-[#ebe4d8] px-4 py-3",
        className,
      )}
    >
      <span
        className="h-9 w-9 shrink-0 rounded-full border-2 border-[#a89888]/60 shadow-inner ring-2 ring-white/70"
        style={{ background: ROOSTER_CLOCK_FRAME_COLOR.swatchCss }}
        aria-hidden
      />
      <div className="min-w-0 text-start">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-[#6b5d4d]">اللون</p>
        <p className="text-sm font-bold leading-snug text-[#2c2419]">
          {ROOSTER_CLOCK_FRAME_COLOR.detailAr}
        </p>
        <p className="text-xs text-[#6b5d4d] mt-0.5">نفس اللون اللي فالصورة — ما كاينش ألوان أخرى</p>
      </div>
    </div>
  );
}

interface Props {
  product: Product;
}

function img(type: Parameters<typeof resolveProductImage>[1]) {
  return resolveProductImage(SLUG, type, "webp");
}

function OfferCard({
  active,
  recommended,
  title,
  price,
  subtitle,
  savings,
  badge,
  onSelect,
}: {
  active: boolean;
  recommended?: boolean;
  title: string;
  price: number;
  subtitle: string;
  savings?: number;
  badge?: string;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={active}
      className={cn(
        "relative w-full rounded-2xl border-2 px-5 py-5 text-start transition-all duration-200",
        active
          ? "border-[#7a3e48] bg-[#faf0f0] shadow-lg shadow-[#7a3e48]/15 ring-2 ring-[#7a3e48]/20"
          : "border-[#e8ddd0] bg-white hover:border-[#c4a574]/60 hover:shadow-md",
      )}
    >
      {recommended && (
        <span className="absolute -top-3 start-4 rounded-full bg-[#7a3e48] px-3 py-0.5 text-[11px] font-bold text-[#fff8f0] shadow-md">
          {badge ?? "🔥 الأكثر طلباً"}
        </span>
      )}
      <div className="flex items-start gap-3">
        <span
          className={cn(
            "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
            active ? "border-[#7a3e48] bg-[#7a3e48] text-white" : "border-[#d4c4b0] bg-white",
          )}
          aria-hidden
        >
          {active && <Check className="h-3.5 w-3.5 stroke-[3]" />}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-lg font-bold text-[#2c2419]">{title}</p>
          <p className="text-sm text-[#6b5d4d] mt-0.5">{subtitle}</p>
          {savings != null && savings > 0 && (
            <p className="text-sm font-semibold text-emerald-700 mt-2">
              كتوفر {formatPriceNumber(savings, "ar")} درهم
            </p>
          )}
        </div>
        <div className="text-end shrink-0">
          <p className="text-2xl sm:text-3xl font-black tabular-nums text-[#7a3e48] leading-none">
            {formatPriceNumber(price, "ar")}{" "}
            <span className="text-base sm:text-lg font-bold text-[#2c2419]">درهم</span>
          </p>
        </div>
      </div>
    </button>
  );
}

function NostalgiaButton({
  onClick,
  children,
  className,
  variant = "primary",
}: {
  onClick: () => void;
  children: ReactNode;
  className?: string;
  variant?: "primary" | "soft";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full min-h-[3.5rem] sm:min-h-[4rem] rounded-2xl font-bold text-base sm:text-lg flex items-center justify-center gap-2 px-5 transition-colors shadow-md",
        variant === "primary"
          ? "bg-[#7a3e48] hover:bg-[#68343d] text-[#fff8f0] shadow-[#7a3e48]/25"
          : "bg-[#f5ead8] hover:bg-[#ebe0cc] text-[#2c2419] border border-[#d4c4b0]",
        className,
      )}
    >
      {children}
    </button>
  );
}

function StarRow({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${rating} من 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            "h-4 w-4",
            i < Math.round(rating) ? "fill-amber-400 text-amber-400" : "fill-[#e8ddd0] text-[#e8ddd0]",
          )}
          aria-hidden
        />
      ))}
    </span>
  );
}

export function ProductPageRoosterAnalogTableClock({ product }: Props) {
  const packVariant =
    product.variants.find((v) => isPackVariantSku(v.sku)) ?? product.variants[1];
  const singleVariant =
    product.variants.find((v) => !isPackVariantSku(v.sku)) ?? product.variants[0];
  const [variant, setVariant] = useState<ProductVariant>(packVariant ?? product.variants[0]);
  const reviews = getReviewsForProduct(product.id);
  const [sticky, setSticky] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const formSentinel = useRef<HTMLDivElement>(null);

  const scrollToOrder = useCallback(() => {
    document.getElementById("order-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  useEffect(() => {
    const onScroll = () => setSticky(window.scrollY > 360);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const el = formSentinel.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setFormVisible(entry.isIntersecting), {
      threshold: 0.08,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const heroSrc = img("02-premium-hero");
  const memorySrc = img("03-lifestyle");
  const productSrc = img("09-close-up");
  const decorImages = [
    { src: img("05-living-room"), alt: "ساعة الفروج فصالون مغربي تقليدي" },
    { src: img("14-product-in-use"), alt: "ساعة الفروج فوق طاولة جانبية بضوء طبيعي" },
    { src: img("03-lifestyle"), alt: "ساعة الفروج فجو دار الجدود والذكريات" },
    { src: img("01-hero-white-bg"), alt: "ساعة الفروج — صورة المنتج" },
  ];

  const showSticky = sticky && !formVisible;
  const isPack = isPackVariantSku(variant.sku);
  const priceLabel = `${formatPriceNumber(variant.price, "ar")} DH`;
  const offerLabel = isPack ? "جوج ساعات — 299 درهم" : "ساعة واحدة — 199 درهم";

  const orderFormBlock = (
    <div ref={formSentinel} className="space-y-4">
      <section id="offers" className="scroll-mt-20 space-y-3">
        <p className="text-center font-bold text-[#2c2419]">اختار العرض المناسب ليك 👇</p>
        <OfferCard
          active={variant.id === singleVariant.id}
          title="ساعة واحدة 🐓"
          price={SINGLE_PRICE}
          subtitle="199 درهم — قطعة وحدة"
          onSelect={() => setVariant(singleVariant)}
        />
        <OfferCard
          active={variant.id === packVariant.id}
          recommended
          title="جوج ساعات 🐓🐓"
          price={PACK_PRICE}
          subtitle="299 درهم — للدار أو كهدية"
          savings={PACK_SAVINGS}
          badge="🔥 الأكثر طلباً"
          onSelect={() => setVariant(packVariant)}
        />
      </section>
      <ProductOrderForm
        product={product}
        variant={variant}
        quantity={1}
        formTitle="بغيتها ترجع لدارك؟ ❤️"
        formSubtitle="الاسم الكامل، رقم الهاتف، والمدينة أو العنوان — وغادي نتاصلو بك للتأكيد."
        submitLabel={`❤️ اطلب الآن بـ ${formatPriceNumber(variant.price, "ar")} درهم`}
        fullNamePlaceholder="الاسم الكامل"
        addressLabel="المدينة أو العنوان"
        addressPlaceholder="مثال: أكادير — الحي، الشارع، رقم المنزل"
        summaryRows={[
          { label: "العرض", value: offerLabel },
          { label: "المنتج", value: "ساعة الفروج 🐓" },
          { label: "اللون", value: ROOSTER_CLOCK_FRAME_COLOR.labelAr },
          { label: "الإجمالي", value: `${formatPriceNumber(variant.price, "ar")} درهم` },
        ]}
        orderNote={
          isPack
            ? "ساعة الفروج | عرض جوج ب299 | ذكرى أيام زمان"
            : "ساعة الفروج | 199 | ذكرى أيام زمان"
        }
      />
      <FrameColorUnderPhoto className="rounded-2xl border border-[#d4c4b0]/90 shadow-sm" />
      <p className="text-center text-sm text-[#6b5d4d]">💵 خلّص غير ملي توصلك</p>
    </div>
  );

  return (
    <div
      className="min-h-screen bg-[#f7f3ed] text-[#2c2419] font-sans w-full max-w-full overflow-x-clip pb-24"
      dir="rtl"
    >
      <div className="bg-[#3d2f28] text-[#f5ead8] text-xs sm:text-sm py-2.5 px-4">
        <div className="max-w-lg mx-auto flex flex-wrap justify-center gap-x-5 gap-y-1 text-center">
          <span className="flex items-center gap-1.5">
            <Banknote className="h-3.5 w-3.5" /> 💵 الدفع عند الاستلام
          </span>
          <span className="hidden sm:inline opacity-30">|</span>
          <span className="flex items-center gap-1.5">
            <Truck className="h-3.5 w-3.5" /> 🚚 التوصيل داخل المغرب
          </span>
        </div>
      </div>

      <header className="sticky top-0 z-40 border-b border-[#e8ddd0]/80 bg-[#f7f3ed]/95 backdrop-blur-md">
        <div className="max-w-lg mx-auto flex items-center h-12 px-3">
          <Link
            href="/ar"
            className="flex items-center gap-1 text-sm text-[#6b5d4d] hover:text-[#2c2419]"
            aria-label="رجوع للمتجر"
          >
            <ChevronLeft className="h-5 w-5" />
            NOORVA
          </Link>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 sm:px-5 space-y-14 sm:space-y-16 pt-6">
        {/* Section 1 — Emotional hero */}
        <section className="space-y-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <h1 className="text-2xl sm:text-[1.65rem] font-bold leading-snug text-[#2c2419]">
              كاينين حوايج صغار...
              <br />
              غير كتشوفهم كيرجعوك لأيام زمان ❤️
            </h1>
            <p className="text-[#5c4f42] text-base leading-relaxed">
              هاد الساعة ماشي غير ساعة...
              <br />
              كتفكرنا بدار الجدود، باللمة وبأيام كانت فيها البساطة هي الزين.
            </p>
          </motion.div>

          <div className="overflow-hidden rounded-3xl border border-[#e8ddd0] bg-[#faf6f0] shadow-xl shadow-[#3d2f28]/10">
            <div className="relative aspect-square w-full">
              <Image
                src={heroSrc}
                alt="ساعة الفروج الكلاسيكية — المنتج"
                fill
                priority
                sizes="(max-width: 512px) 100vw, 480px"
                className="object-contain p-3"
              />
            </div>
            <FrameColorUnderPhoto />
          </div>

          <div className="space-y-2">
            <p className="text-xl font-bold">ساعة الفروج 🐓</p>
            <p className="inline-flex items-center justify-center gap-2 text-sm text-[#5c4f42]">
              <span
                className="inline-block h-4 w-4 rounded-full border border-[#a89888]/50 shadow-sm"
                style={{ background: ROOSTER_CLOCK_FRAME_COLOR.swatchCss }}
                aria-hidden
              />
              <span>
                اللون:{" "}
                <span className="font-bold text-[#2c2419]">{ROOSTER_CLOCK_FRAME_COLOR.labelAr}</span>
              </span>
            </p>
            <p className="text-3xl font-black tabular-nums text-[#7a3e48]">
              {formatPriceNumber(SINGLE_PRICE, "ar")} درهم
            </p>
            <p className="text-lg font-bold text-[#2c2419]">
              🔥 جوج بـ{" "}
              <span className="text-[#7a3e48] tabular-nums">{formatPriceNumber(PACK_PRICE, "ar")} درهم</span>
            </p>
            <p className="text-sm text-[#6b5d4d]">💵 الدفع عند الاستلام</p>
            {product.reviewCount > 0 && (
              <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-sm text-[#6b5d4d]">
                <StarRow rating={product.rating} />
                <span className="font-semibold tabular-nums text-[#2c2419]">{product.rating.toFixed(1)}</span>
                <span>({product.reviewCount} تقييم)</span>
              </div>
            )}
          </div>
        </section>

        {/* Order form — directly under hero title & image */}
        <section
          id="order-form"
          className="scroll-mt-20 -mt-6 rounded-3xl border-2 border-[#7a3e48]/15 bg-gradient-to-b from-[#faf6f0] via-[#f5ead8]/90 to-[#ebe4d8] p-4 sm:p-5 shadow-lg shadow-[#3d2f28]/8"
        >
          {orderFormBlock}
        </section>

        {/* Section 2 — The memory */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-center leading-snug">واش باقي كتفكر فداك الوقت؟</h2>
          <div className="space-y-4 text-[#5c4f42] text-base leading-relaxed">
            <p>
              فاش كانت الدار عامرة باللمة...
              <br />
              والأشياء البسيطة كانت كتفرحنا.
            </p>
            <p>
              ساعة معلقة ولا فوق الطابلة،
              <br />
              صوتها كيتسمع فالدار،
              <br />
              والنهار كيدوز بشوية...
            </p>
            <p className="font-semibold text-[#2c2419]">
              يمكن الزمن تبدل...
              <br />
              ولكن بعض الذكريات ما كتبدلش.
            </p>
          </div>
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-[#e8ddd0] shadow-md">
            <Image
              src={memorySrc}
              alt="ذكريات دار الجدود وساعة الفروج"
              fill
              loading="lazy"
              sizes="(max-width: 512px) 100vw, 480px"
              className="object-cover"
            />
          </div>
        </section>

        {/* Section 3 — Product reveal */}
        <section className="rounded-3xl border border-[#e8ddd0] bg-[#faf6f0] p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="space-y-3 text-center">
            <h2 className="text-2xl font-bold">ومن هنا جات ساعة الفروج ❤️</h2>
            <p className="text-[#5c4f42] leading-relaxed">
              تصميم كيرجعك لأجواء ديال زمان،
              <br />
              وفي نفس الوقت كيعطي لمسة مميزة للدار ديالك اليوم.
            </p>
          </div>
          <div className="relative aspect-square w-full max-w-sm mx-auto overflow-hidden rounded-2xl border border-[#d4c4b0] bg-white">
            <Image
              src={productSrc}
              alt="ساعة الفروج — المنتج"
              fill
              loading="lazy"
              sizes="(max-width: 512px) 90vw, 384px"
              className="object-contain p-2"
            />
          </div>
          <div className="text-center space-y-1">
            <p className="text-xl font-black text-[#7a3e48] tabular-nums">
              {formatPriceNumber(SINGLE_PRICE, "ar")} درهم · ساعة واحدة
            </p>
            <p className="text-xl font-black text-[#7a3e48] tabular-nums">
              {formatPriceNumber(PACK_PRICE, "ar")} درهم · جوج ساعات
            </p>
            <p className="text-sm text-[#6b5d4d]">خلص غير ملي توصلك</p>
          </div>
          <NostalgiaButton onClick={scrollToOrder}>اختار العرض واطلب</NostalgiaButton>
        </section>

        {/* Section 4 — Who is it for */}
        <section className="space-y-6">
          <p className="text-lg sm:text-xl text-center leading-relaxed text-[#5c4f42]">
            يمكن تكون غير ساعة بالنسبة لشي واحد...
            <br />
            <span className="font-bold text-[#2c2419]">ولكن بالنسبة ليك يمكن تكون ذكرى.</span>
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { label: "❤️ لدار الوالدين", icon: Home },
              { label: "❤️ لدار الجدود", icon: Heart },
              { label: "❤️ لشي حد كيعشق أيام زمان", icon: Heart },
              { label: "🎁 كهدية بسيطة ومميزة", icon: Gift },
            ].map(({ label, icon: Icon }) => (
              <div
                key={label}
                className="rounded-2xl border border-[#e8ddd0] bg-white px-5 py-6 text-center shadow-sm"
              >
                <Icon className="h-6 w-6 mx-auto mb-2 text-[#7a3e48]/80" aria-hidden />
                <p className="font-bold text-[#2c2419]">{label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 5 — Home decor */}
        <section className="space-y-5">
          <h2 className="text-xl sm:text-2xl font-bold text-center leading-snug">
            ذكرى من الماضي... بلمسة زوينة فدارك اليوم.
          </h2>
          <div className="grid grid-cols-2 gap-2.5">
            {decorImages.map((item) => (
              <div
                key={item.alt}
                className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-[#e8ddd0] bg-[#f0ebe3]"
              >
                <Image src={item.src} alt={item.alt} fill loading="lazy" sizes="45vw" className="object-cover" />
              </div>
            ))}
          </div>
        </section>

        {/* Section 6 — Emotional benefits */}
        <section className="rounded-3xl border border-[#e8ddd0] bg-white p-6 space-y-4">
          {[
            "🐓 تصميم كيرجعك لأيام زمان",
            "🏠 كيزيد لمسة دافئة للدار",
            "❤️ كيحرك ذكريات جميلة",
            "🎁 فكرة زوينة كهدية لشخص عزيز",
          ].map((line) => (
            <p key={line} className="text-base sm:text-lg font-medium text-[#3d3229] border-b border-[#f0ebe3] pb-3 last:border-0 last:pb-0">
              {line}
            </p>
          ))}
        </section>

        {/* Reviews */}
        {reviews.length > 0 && (
          <section id="reviews" className="scroll-mt-20 space-y-4">
            <div className="text-center space-y-2">
              <h2 className="text-xl sm:text-2xl font-bold">شنو قالو اللي خداوها؟</h2>
              <div className="flex flex-wrap items-center justify-center gap-2 text-sm text-[#6b5d4d]">
                <StarRow rating={product.rating} />
                <span className="font-bold text-[#2c2419] tabular-nums">{product.rating.toFixed(1)} / 5</span>
                <span>· {product.reviewCount} تقييم</span>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {reviews.map((r) => (
                <article
                  key={r.id}
                  className="rounded-2xl border border-[#e8ddd0] bg-white p-5 shadow-sm text-start"
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <StarRow rating={r.rating} />
                    {r.verified && (
                      <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                        ✓ طلب مؤكد
                      </span>
                    )}
                  </div>
                  <p className="font-bold text-[#2c2419] mb-1">{r.title.ar}</p>
                  <p className="text-sm text-[#5c4f42] leading-relaxed">{r.content.ar}</p>
                  {r.images?.[0] && (
                    <div className="relative mt-4 aspect-square w-full max-w-xs overflow-hidden rounded-xl border border-[#e8ddd0] bg-[#faf6f0]">
                      <Image
                        src={r.images[0]}
                        alt={`صورة من ${r.author} — ساعة الفروج`}
                        fill
                        className="object-contain p-2"
                        sizes="320px"
                        loading="lazy"
                      />
                    </div>
                  )}
                  <p className="text-xs text-[#8b7355] mt-3">
                    {r.author} · {r.city}
                  </p>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Section 7 — Offer */}
        <section className="rounded-3xl border-2 border-[#7a3e48]/30 bg-gradient-to-b from-[#faf6f0] to-[#f5ead8] p-6 sm:p-8 space-y-5 text-center shadow-lg">
          <h2 className="text-xl sm:text-2xl font-bold leading-snug">
            خلي شي حاجة من أيام زمان ترجع لدارك ❤️
          </h2>
          <div className="space-y-1">
            <p className="text-2xl font-black tabular-nums text-[#7a3e48]">
              {formatPriceNumber(SINGLE_PRICE, "ar")} درهم — ساعة واحدة
            </p>
            <p className="text-2xl font-black tabular-nums text-[#7a3e48]">
              {formatPriceNumber(PACK_PRICE, "ar")} درهم — جوج ساعات
            </p>
          </div>
          <div className="text-sm text-[#5c4f42] space-y-1">
            <p>🚚 التوصيل داخل المغرب</p>
            <p>💵 الدفع عند الاستلام</p>
          </div>
          <NostalgiaButton onClick={scrollToOrder}>اختار العرض واطلب</NostalgiaButton>
        </section>

        {/* Section 8 — Final message (was section 9) */}
        <section className="space-y-6 text-center">
          <h2 className="text-xl sm:text-2xl font-bold leading-snug">
            بعض الأشياء ما كتحتاجش تكون جديدة...
            <br />
            باش تكون غالية علينا.
          </h2>
          <p className="text-[#5c4f42] leading-relaxed text-base">
            إلى كانت هاد الساعة فكراتك بشي شخص، بشي دار، ولا بشي أيام جميلة...
            <br />
            <span className="text-[#2c2419] font-medium">
              يمكن تكون هي اللمسة اللي ناقصة فدارك اليوم.
            </span>
          </p>
          <div className="relative aspect-square max-w-xs mx-auto overflow-hidden rounded-3xl border border-[#e8ddd0] shadow-md">
            <Image
              src={productSrc}
              alt="ساعة الفروج"
              fill
              loading="lazy"
              sizes="320px"
              className="object-contain bg-[#faf6f0]"
            />
          </div>
          <NostalgiaButton onClick={scrollToOrder}>خلي الذكرى ترجع ❤️</NostalgiaButton>
          <p className="text-2xl font-black text-[#7a3e48] tabular-nums">{priceLabel}</p>
        </section>

        {/* Section 10 — FAQ */}
        <Accordion type="single" collapsible className="rounded-2xl border border-[#e8ddd0] bg-white px-4">
          <AccordionItem value="faq">
            <AccordionTrigger className="font-bold">أسئلة شائعة</AccordionTrigger>
            <AccordionContent className="text-[#5c4f42] text-sm space-y-4 pb-4">
              {FAQ_ITEMS.map((faq) => (
                <div key={faq.q}>
                  <p className="font-bold text-[#2c2419]">{faq.q}</p>
                  <p className="mt-1">{faq.a}</p>
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </main>

      <AnimatePresence>
        {showSticky && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 inset-x-0 z-50 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] bg-gradient-to-t from-[#f7f3ed] via-[#f7f3ed] to-transparent"
          >
            <div className="max-w-lg mx-auto">
              <button
                type="button"
                onClick={scrollToOrder}
                className="w-full min-h-[3.25rem] rounded-2xl bg-[#7a3e48] hover:bg-[#68343d] text-[#fff8f0] font-bold text-base shadow-xl shadow-[#7a3e48]/30"
              >
                ❤️ اطلبها بـ {priceLabel}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ProductPageRoosterAnalogTableClock;
