"use client";

import { useState, useEffect, useCallback, useRef, type ReactNode } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, Banknote, Truck, Heart, Home, Gift, Star } from "lucide-react";
import type { Product } from "@/types";
import { getReviewsForProduct } from "@/data/products";
import { ROOSTER_CLOCK_PRICE_MAD } from "@/data/rooster-analog-table-clock";
import { formatPriceNumber, cn } from "@/lib/utils";
import { resolveProductImage } from "@/lib/product-images/resolve";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const ProductOrderForm = dynamic(
  () => import("@/components/product/product-order-form").then((m) => m.ProductOrderForm),
  { ssr: true, loading: () => <div className="min-h-[420px]" aria-hidden /> },
);

const SLUG = "rooster-analog-table-clock";
const PRICE = ROOSTER_CLOCK_PRICE_MAD;

const FAQ_ITEMS = [
  { q: "شحال الثمن؟", a: "الثمن هو 199 درهم." },
  { q: "كيفاش كنخلص؟", a: "الدفع عند الاستلام، كتخلص ملي توصلك الطلبية." },
  { q: "فين كتوصلو؟", a: "التوصيل داخل المغرب." },
  { q: "كيفاش نطلب؟", a: "عمر الفورم بالمعلومات ديالك وغادي نتاصلو بك لتأكيد الطلب." },
];

interface Props {
  product: Product;
}

function img(type: Parameters<typeof resolveProductImage>[1]) {
  return resolveProductImage(SLUG, type, "webp");
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
  const variant = product.variants[0];
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
    { src: img("02-premium-hero"), alt: "ساعة الفروج فديكور مغربي أنيق" },
  ];

  const showSticky = sticky && !formVisible;
  const priceLabel = `${formatPriceNumber(PRICE, "ar")} DH`;

  const orderFormBlock = (
    <div ref={formSentinel} className="space-y-3">
      <ProductOrderForm
        product={product}
        variant={variant}
        quantity={1}
        formTitle="بغيتها ترجع لدارك؟ ❤️"
        formSubtitle="الاسم الكامل، رقم الهاتف، والمدينة أو العنوان — وغادي نتاصلو بك للتأكيد."
        submitLabel={`❤️ اطلب الآن بـ ${formatPriceNumber(PRICE, "ar")} درهم`}
        fullNamePlaceholder="الاسم الكامل"
        addressLabel="المدينة أو العنوان"
        addressPlaceholder="مثال: أكادير — الحي، الشارع، رقم المنزل"
        summaryRows={[
          { label: "المنتج", value: "ساعة الفروج 🐓" },
          { label: "الثمن", value: `${formatPriceNumber(PRICE, "ar")} درهم` },
        ]}
        orderNote="ساعة الفروج | ذكرى أيام زمان"
      />
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

          <div className="relative aspect-square w-full overflow-hidden rounded-3xl border border-[#e8ddd0] bg-[#faf6f0] shadow-xl shadow-[#3d2f28]/10">
            <Image
              src={heroSrc}
              alt="ساعة الفروج الكلاسيكية — المنتج"
              fill
              priority
              sizes="(max-width: 512px) 100vw, 480px"
              className="object-contain p-3"
            />
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#2c2419]/35 to-transparent pointer-events-none" />
          </div>

          <div className="space-y-2">
            <p className="text-xl font-bold">ساعة الفروج 🐓</p>
            <p className="text-3xl font-black tabular-nums text-[#7a3e48]">
              {formatPriceNumber(PRICE, "ar")} درهم فقط
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
        <section id="order-form" className="scroll-mt-20 -mt-6">
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
            <p className="text-3xl font-black text-[#7a3e48] tabular-nums">{priceLabel}</p>
            <p className="text-sm text-[#6b5d4d]">خلص غير ملي توصلك</p>
          </div>
          <NostalgiaButton onClick={scrollToOrder}>اطلبها دابا</NostalgiaButton>
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
          <p className="text-4xl font-black tabular-nums text-[#7a3e48]">
            {formatPriceNumber(PRICE, "ar")} درهم فقط
          </p>
          <div className="text-sm text-[#5c4f42] space-y-1">
            <p>🚚 التوصيل داخل المغرب</p>
            <p>💵 الدفع عند الاستلام</p>
          </div>
          <NostalgiaButton onClick={scrollToOrder}>اطلب الساعة ديالك</NostalgiaButton>
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
