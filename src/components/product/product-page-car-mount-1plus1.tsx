"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import {
  ChevronLeft,
  Shield,
  Truck,
  Banknote,
  ShoppingBag,
  Phone,
  Check,
  Gift,
  Magnet,
  Smartphone,
  Car,
  RotateCw,
} from "lucide-react";
import type { Product } from "@/types";
import { moroccanCities } from "@/data/products";
import { FacebookProductTracker } from "@/components/facebook/facebook-trackers";
import { formatPriceNumber, calculateDiscount, cn } from "@/lib/utils";
import { resolveProductImage } from "@/lib/product-images/resolve";
import { PremiumProductGallery } from "@/components/product/product-gallery-premium";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const ProductOrderForm = dynamic(
  () => import("@/components/product/product-order-form").then((m) => m.ProductOrderForm),
  { ssr: true, loading: () => <div className="min-h-[420px]" aria-hidden /> },
);

const SLUG = "magnetic-car-phone-holder-1-plus-1";
const UNITS_SHIPPED = 2;
const UNITS_PAID = 1;
const UNITS_FREE = 1;

const FAQ_ITEMS = [
  {
    q: "واش العرض فعلاً فيه جوج قطع؟",
    a: "نعم. كتخلص ثمن قطعة وحدة وكتحصل على القطعة الثانية مجاناً — جوج حاملات في الطلب.",
  },
  {
    q: "كيفاش نخلص؟",
    a: "الدفع عند الاستلام. ما كخلص والو دابا — كتخلص كاش ملي توصلك الطلبية.",
  },
  {
    q: "واش نقدر نطلب من الهاتف؟",
    a: "نعم. عمّر الاسم، الهاتف، المدينة والعنوان فالفورم واضغط تأكيد الطلب.",
  },
  {
    q: "واش التوصيل متوفر لمدينتي؟",
    a: "كنوصّلو لجميع مدن المغرب. التوصيل مجاني والدفع عند الاستلام.",
  },
  {
    q: "كيفاش كنركّبو؟",
    a: "نظّف السطح داخل السيارة، ضع قاعدة الشفط واضغط، دوّر على TIGHT، قرّب الهاتف من الرأس المغناطيسي واضبط الذراع.",
  },
];

const USE_PHOTOS = [
  {
    src: "/reviews/magnetic-car-phone-mount-maidsail/05-dash-phone.webp",
    alt: "الهاتف مركّب على الحامل فوق لوحة القيادة",
  },
  {
    src: "/reviews/magnetic-car-phone-mount-maidsail/04-dash-screen.webp",
    alt: "الحامل فوق شاشة السيارة أثناء الملاحة",
  },
  {
    src: "/reviews/magnetic-car-phone-mount-maidsail/02-window-nav.webp",
    alt: "الحامل على الزجاج أثناء القيادة",
  },
  {
    src: "/reviews/magnetic-car-phone-mount-maidsail/01-hand-hold.webp",
    alt: "الحامل المغناطيسي في اليد",
  },
] as const;

interface Props {
  product: Product;
}

export function ProductPageCarMount1Plus1({ product }: Props) {
  const variant = product.variants[0];
  const price = variant.price;
  const compareAt = variant.compareAtPrice && variant.compareAtPrice > price ? variant.compareAtPrice : undefined;
  const discount = calculateDiscount(price, compareAt);
  const [sticky, setSticky] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const formSentinel = useRef<HTMLDivElement>(null);

  const scrollToOrder = useCallback(() => {
    document.getElementById("order-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  useEffect(() => {
    const onScroll = () => setSticky(window.scrollY > 380);
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

  const offerSrc = resolveProductImage(SLUG, "11-package-contents", "webp");
  const heroSrc = resolveProductImage(SLUG, "02-premium-hero", "webp");
  const showSticky = sticky && !formVisible;

  return (
    <div className="product-luxury bg-[#0a0a0f] text-white min-h-screen font-sans w-full max-w-full overflow-x-clip" dir="rtl">
      <FacebookProductTracker
        productId={product.id}
        contentName={product.name.ar}
        value={price}
        currency="MAD"
        quantity={1}
      />

      <div className="bg-[#12121a] border-b border-white/10 text-white/80 text-xs sm:text-sm py-2.5 px-4">
        <div className="max-w-3xl mx-auto flex flex-wrap justify-center gap-x-6 gap-y-1 text-center">
          <span className="flex items-center gap-1.5">
            <Banknote className="h-3.5 w-3.5 text-emerald-400" /> الدفع عند الاستلام
          </span>
          <span className="hidden sm:inline text-white/20">|</span>
          <span className="flex items-center gap-1.5">
            <Truck className="h-3.5 w-3.5" /> توصيل لجميع مدن المغرب
          </span>
          <span className="hidden sm:inline text-white/20">|</span>
          <span className="flex items-center gap-1.5">
            <Gift className="h-3.5 w-3.5 text-amber-300" /> 1 + 1 مجاناً
          </span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 pb-28 lg:pb-16 pt-4 space-y-10 sm:space-y-12 min-w-0 w-full">
        <nav className="flex items-center gap-2 text-xs text-white/50">
          <Link href="/ar" className="hover:text-[#6366f1] transition-colors">
            نورڤا
          </Link>
          <ChevronLeft className="h-3 w-3" />
          <Link href="/ar/products" className="hover:text-[#6366f1] transition-colors">
            المجموعة
          </Link>
          <ChevronLeft className="h-3 w-3" />
          <span className="font-medium truncate text-white/80">{product.name.ar}</span>
        </nav>

        <section className="text-center space-y-3">
          <p className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/15 border border-amber-300/30 px-3 py-1 text-xs font-bold text-amber-200">
            🔥 عرض خاص
          </p>
          <p className="text-sm font-medium text-white/60">{product.name.ar}</p>
          <h1 className="text-2xl sm:text-4xl font-black leading-tight tracking-tight">
            اشترِ واحداً وخذ الثاني مجاناً 🎁
          </h1>
          <p className="text-base sm:text-lg text-white/70 leading-relaxed max-w-xl mx-auto">
            {product.shortDescription.ar}
          </p>
        </section>

        <section aria-label="صور المنتج">
          <PremiumProductGallery product={product} />
        </section>

        <section className="rounded-3xl border border-amber-300/25 bg-gradient-to-b from-amber-400/10 to-transparent p-5 sm:p-7 text-center space-y-4">
          <p className="text-3xl sm:text-4xl font-black text-amber-200">1 + 1 مجاناً</p>
          <p className="text-lg font-bold">قطعتان بسعر قطعة واحدة</p>
          <p className="text-sm text-white/65">
            1 قطعة مدفوعة + {UNITS_FREE} قطعة مجاناً = {UNITS_SHIPPED} قطع
          </p>
          <div>
            <p className="text-4xl sm:text-5xl font-black tabular-nums text-white leading-none">
              {formatPriceNumber(price, "ar")}{" "}
              <span className="text-xl font-bold text-white/80">درهم فقط</span>
            </p>
            {compareAt && (
              <p className="mt-2 text-sm text-white/45">
                ثمن جوج قطع:{" "}
                <span className="line-through decoration-white/50">
                  {formatPriceNumber(compareAt, "ar")} درهم
                </span>
                {discount > 0 && (
                  <span className="ms-2 font-semibold text-emerald-400">توفير {discount}%</span>
                )}
              </p>
            )}
            <p className="mt-2 text-base font-bold text-emerald-300">🎁 الثانية مجاناً</p>
          </div>
          <button
            type="button"
            onClick={scrollToOrder}
            className="w-full h-14 sm:h-16 rounded-2xl bg-[#6366f1] hover:bg-[#4f46e5] text-white font-black text-base sm:text-lg flex items-center justify-center gap-2.5 shadow-lg shadow-indigo-500/30"
          >
            <ShoppingBag className="h-5 w-5" />
            أطلب العرض الآن
          </button>
          <p className="text-xs text-white/50">🔥 العرض متوفر لفترة محدودة</p>
        </section>

        <section className="grid grid-cols-2 gap-3">
          {[
            { icon: Banknote, label: "الدفع عند الاستلام" },
            { icon: Phone, label: "تأكيد الطلب هاتفياً" },
            { icon: Truck, label: "توصيل داخل المغرب" },
            { icon: Shield, label: "خدمة زبناء" },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-2 rounded-2xl border border-white/8 bg-[#12121a]/70 px-3 py-3"
            >
              <item.icon className="h-4 w-4 text-emerald-400 shrink-0" />
              <span className="text-xs font-semibold text-white/85">{item.label}</span>
            </div>
          ))}
        </section>

        <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm leading-relaxed">
          <p className="font-bold text-emerald-200">💵 الدفع عند الاستلام</p>
          <p className="text-white/70 mt-1">خلص غير ملي توصلك الطلبية.</p>
          <p className="font-bold text-emerald-200 mt-3">📦 توصيل لجميع مدن المغرب</p>
        </div>

        <div ref={formSentinel}>
          <ProductOrderForm
            product={product}
            variant={variant}
            quantity={1}
            extendedAddress
            cityOptions={moroccanCities}
            fullNamePlaceholder="مثال: محمد أمين"
            formTitle="اطلب العرض الآن — الدفع عند الاستلام"
            formSubtitle="كتخلص ثمن قطعة وحدة وكياوصلك جوج حاملات. الدفع عند الاستلام فقط."
            submitLabel="أريد 1 + 1 مجاناً"
            quantityLabel={`${UNITS_SHIPPED} قطع`}
            summaryRows={[
              { label: "المنتج", value: product.name.ar },
              { label: "العرض", value: `${UNITS_PAID} + ${UNITS_FREE} مجاناً` },
              { label: "السعر", value: `${formatPriceNumber(price, "ar")} DH` },
            ]}
            orderNote="عرض 1+1 مجاناً | قطعتان | مدفوعة 1 + مجانية 1"
          />
        </div>

        <section className="space-y-4">
          <h2 className="text-2xl font-black text-center">علاش غادي يعجبك؟</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { icon: Smartphone, title: "ثبات الهاتف", desc: "خلي هاتفك ثابت وفي مكان واضح أثناء القيادة." },
              { icon: Magnet, title: "تثبيت مغناطيسي", desc: "ركّب الهاتف أو حيدو بسهولة من الرأس المغناطيسي." },
              { icon: Car, title: "مناسب للسيارة", desc: "قاعدة شفط مع قفل TIGHT/OPEN للاستعمال داخل السيارة." },
              { icon: RotateCw, title: "قابل للتعديل", desc: "ذراع بمفصلين باش تضبط زاوية الهاتف حسب الحاجة." },
            ].map((b) => (
              <div key={b.title} className="rounded-2xl border border-white/8 bg-[#12121a] p-4">
                <b.icon className="h-5 w-5 text-[#818cf8] mb-2" />
                <p className="font-bold">{b.title}</p>
                <p className="text-sm text-white/65 mt-1 leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-[#12121a] overflow-hidden">
          <div className="relative aspect-square bg-white">
            <Image
              src={offerSrc}
              alt="اشترِ 1 واحصل على 1 مجاناً — حاملان مغناطيسيان"
              fill
              loading="lazy"
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-contain"
            />
          </div>
          <div className="p-6 sm:p-8 text-center space-y-3">
            <h2 className="text-2xl font-black">🎁 العرض اللي ما خاصكش تفوّتو</h2>
            <p className="text-white/70">تشري حامل واحد؟</p>
            <p className="text-red-300 font-bold">❌ لا</p>
            <p className="text-lg font-black text-emerald-300">دابا كتخلص غير ثمن واحد وكتاخد جوج!</p>
            <p className="text-3xl font-black text-amber-200">1 + 1 FREE</p>
            <p className="font-semibold">قطعة لك + قطعة مجانية</p>
            <button
              type="button"
              onClick={scrollToOrder}
              className="w-full h-14 rounded-2xl bg-[#6366f1] hover:bg-[#4f46e5] text-white font-black"
            >
              أطلب جوج دابا
            </button>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-black text-center">كيفاش كيخدم؟</h2>
          <ol className="space-y-3">
            {[
              { n: "1", t: "ثبت الحامل", d: "ركب الحامل في المكان المناسب داخل السيارة (لوحة القيادة أو الزجاج) ودوّر على TIGHT." },
              { n: "2", t: "قرب الهاتف", d: "ثبت الهاتف على الرأس المغناطيسي بطريقة سهلة." },
              { n: "3", t: "استعمل هاتفك براحة", d: "خليه ثابت قدامك أثناء القيادة للملاحة أو المكالمات." },
            ].map((s) => (
              <li key={s.n} className="flex gap-3 rounded-2xl border border-white/8 bg-[#12121a] p-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#6366f1] font-black">
                  {s.n}
                </span>
                <div>
                  <p className="font-bold">{s.t}</p>
                  <p className="text-sm text-white/65 mt-1">{s.d}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-black text-center">المنتج أثناء الاستعمال</h2>
          <div className="grid grid-cols-2 gap-2">
            {USE_PHOTOS.map((photo) => (
              <div key={photo.src} className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-white/8 bg-[#12121a]">
                <Image src={photo.src} alt={photo.alt} fill loading="lazy" sizes="45vw" className="object-cover" />
              </div>
            ))}
          </div>
        </section>

        <Accordion type="single" collapsible className="rounded-2xl border border-white/10 bg-[#12121a] px-4">
          <AccordionItem value="details" className="border-white/10">
            <AccordionTrigger className="text-white hover:text-white">تفاصيل المنتج</AccordionTrigger>
            <AccordionContent className="text-white/70 text-sm leading-relaxed">
              {product.deepDescription?.ar}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="howto" className="border-white/10">
            <AccordionTrigger className="text-white hover:text-white">طريقة الاستخدام</AccordionTrigger>
            <AccordionContent className="text-white/70 text-sm leading-relaxed">{product.howToUse?.ar}</AccordionContent>
          </AccordionItem>
          <AccordionItem value="box" className="border-white/10">
            <AccordionTrigger className="text-white hover:text-white">محتويات العلبة</AccordionTrigger>
            <AccordionContent className="text-white/70 text-sm">
              <ul className="space-y-2">
                {(product.packageIncludes || []).map((item) => (
                  <li key={item.ar} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-400" /> {item.ar}
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="ship" className="border-white/10">
            <AccordionTrigger className="text-white hover:text-white">الشحن والتوصيل</AccordionTrigger>
            <AccordionContent className="text-white/70 text-sm leading-relaxed">
              توصيل مجاني لجميع مدن المغرب. 24–48 ساعة للمدن الكبرى، و2–4 أيام لباقي المدن.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="cod" className="border-white/10">
            <AccordionTrigger className="text-white hover:text-white">الدفع عند الاستلام</AccordionTrigger>
            <AccordionContent className="text-white/70 text-sm leading-relaxed">
              ما كخلص والو دابا. كتأكد الطلب من الفورم، وكتخلص كاش ملي توصلك الطلبية.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="faq" className="border-white/10">
            <AccordionTrigger className="text-white hover:text-white">الأسئلة الشائعة</AccordionTrigger>
            <AccordionContent className="text-white/70 text-sm space-y-4">
              {FAQ_ITEMS.map((faq) => (
                <div key={faq.q}>
                  <p className="font-bold text-white">{faq.q}</p>
                  <p className="mt-1">{faq.a}</p>
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="relative aspect-[4/5] max-w-sm mx-auto rounded-3xl overflow-hidden border border-white/10 bg-white">
          <Image
            src={heroSrc}
            alt={product.name.ar}
            fill
            loading="lazy"
            sizes="(max-width: 640px) 90vw, 384px"
            className="object-contain"
          />
        </div>

        <button
          type="button"
          onClick={scrollToOrder}
          className="w-full h-14 rounded-2xl bg-[#6366f1] hover:bg-[#4f46e5] text-white font-black flex items-center justify-center gap-2"
        >
          <ShoppingBag className="h-5 w-5" />
          أطلب جوج دابا — {formatPriceNumber(price, "ar")} درهم
        </button>
      </div>

      <AnimatePresence>
        {showSticky && (
          <motion.div
            initial={{ y: 88 }}
            animate={{ y: 0 }}
            exit={{ y: 88 }}
            className="fixed bottom-0 inset-x-0 z-40 lg:hidden bg-[#0a0a0f] border-t border-white/10 safe-area-pb"
          >
            <div className="px-4 py-3 max-w-lg mx-auto flex items-center gap-3">
              <div className="min-w-0">
                <p className="text-xs font-bold text-amber-200">1 + 1 مجاناً</p>
                <p className="text-sm font-black tabular-nums">{formatPriceNumber(price, "ar")} DH</p>
              </div>
              <button
                type="button"
                onClick={scrollToOrder}
                className="flex-1 h-12 rounded-xl bg-[#6366f1] hover:bg-[#4f46e5] text-white font-black text-sm"
              >
                اطلب الآن
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
