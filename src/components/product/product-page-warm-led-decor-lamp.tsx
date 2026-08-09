"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronLeft,
  Shield,
  Truck,
  Banknote,
  ShoppingBag,
  Phone,
  Check,
  Minus,
  Plus,
  Sparkles,
  Home,
  Moon,
  Gift,
} from "lucide-react";
import type { Product, ProductVariant } from "@/types";
import { useRecentlyViewedStore } from "@/lib/store/recently-viewed-store";
import { products } from "@/data/products";
import { FacebookProductTracker } from "@/components/facebook/facebook-trackers";
import { formatPriceNumber, cn } from "@/lib/utils";
import { resolveProductImage } from "@/lib/product-images/resolve";
import { getProductCroContent } from "@/lib/product-cro-content";
import { PremiumProductGallery } from "@/components/product/product-gallery-premium";
import { isPackVariantSku } from "@/components/product/product-variant-picker";
import type { PremiumImageType } from "@/lib/product-images/types";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const ProductOrderForm = dynamic(
  () => import("@/components/product/product-order-form").then((m) => m.ProductOrderForm),
  { ssr: true, loading: () => <div className="min-h-[420px]" aria-hidden /> },
);

const SLUG = "warm-led-decor-lamp";
const SINGLE_PRICE = 199;
const PACK_PRICE = 299;
const PACK_SAVINGS = 99;

const FAQ_ITEMS = [
  {
    q: "واش الدفع عند الاستلام؟",
    a: "نعم، الدفع عند الاستلام فقط. تطلب بلا بطاقة بنكية وتخلّص كاش ملي يوصلك الطلب.",
  },
  {
    q: "فين كيوصل المنتج؟",
    a: "كنوصّلو لجميع المدن المغربية. التوصيل مجاني والدفع عند الاستلام.",
  },
  {
    q: "شنو هو الثمن؟",
    a: "مصباح واحد بـ199 درهم، أو جوج مصابيح بـ299 درهم (كتوفر 99 درهم).",
  },
  {
    q: "نقدر ناخد جوج؟",
    a: "أكيد! عرض جوج مصابيح بـ299 درهم هو الأكثر طلباً — كتوفر 99 درهم مقارنة بشراء جوج بشكل منفصل.",
  },
  {
    q: "كيفاش نأكد الطلب؟",
    a: "عمّر المعلومات فالفورم (الاسم، الهاتف، المدينة والعنوان) واضغط «أكد الطلب ديالك». غادي نتاصلوا بيك باش نأكدو الطلب.",
  },
];

function resolveLampImage(imageType: PremiumImageType) {
  return resolveProductImage(SLUG, imageType, "webp");
}

interface Props {
  product: Product;
  related?: Product[];
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
          ? "border-[#8b6914] bg-[#f5ead8] shadow-lg shadow-[#8b6914]/15 ring-2 ring-[#8b6914]/25"
          : "border-[#e8ddd0] bg-white hover:border-[#c4a574]/60 hover:shadow-md",
        recommended && "scale-[1.02] shadow-md",
        recommended && !active && "border-[#c4a574]/50",
      )}
    >
      {recommended && (
        <span className="absolute -top-3 start-4 rounded-full bg-[#8b6914] px-3 py-0.5 text-[11px] font-bold text-white shadow-md">
          {badge ?? "🔥 الأكثر طلباً"}
        </span>
      )}
      <div className="flex items-start gap-3">
        <span
          className={cn(
            "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
            active ? "border-[#8b6914] bg-[#8b6914] text-white" : "border-[#d4c4b0] bg-white",
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
          <p className="text-2xl sm:text-3xl font-black tabular-nums text-[#8b6914] leading-none">
            {formatPriceNumber(price, "ar")}{" "}
            <span className="text-base sm:text-lg font-bold text-[#2c2419]">درهم</span>
          </p>
        </div>
      </div>
    </button>
  );
}

function LifestyleBlock({
  title,
  copy,
  imageType,
  reverse,
}: {
  title: string;
  copy?: string;
  imageType: PremiumImageType;
  reverse?: boolean;
}) {
  const src = resolveLampImage(imageType);
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-48px" }}
      transition={{ duration: 0.5 }}
      className="scroll-mt-24"
    >
      <div className="rounded-3xl border border-[#e8ddd0] bg-white overflow-hidden shadow-sm">
        <div className={cn("grid grid-cols-1 lg:grid-cols-2 gap-0", reverse && "lg:[direction:ltr]")}>
          <div className={cn("relative aspect-[4/5] lg:aspect-auto lg:min-h-[440px] bg-[#f7f3ed]", reverse && "lg:order-2")}>
            <Image
              src={src}
              alt={title}
              fill
              loading="lazy"
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div className={cn("p-8 sm:p-10 lg:p-12 flex flex-col justify-center", reverse && "lg:order-1 lg:[direction:rtl]")}>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#2c2419] leading-tight mb-4">{title}</h2>
            {copy && <p className="text-[#6b5d4d] text-base leading-relaxed">{copy}</p>}
          </div>
        </div>
      </div>
    </motion.section>
  );
}

export function ProductPageWarmLedDecorLamp({ product, related: relatedProp }: Props) {
  const addRecentlyViewed = useRecentlyViewedStore((s) => s.addProduct);
  const packVariant = product.variants.find((v) => isPackVariantSku(v.sku)) ?? product.variants[1];
  const singleVariant = product.variants.find((v) => !isPackVariantSku(v.sku)) ?? product.variants[0];

  const [variant, setVariant] = useState<ProductVariant>(packVariant ?? product.variants[0]);
  const [qty, setQty] = useState(1);
  const [sticky, setSticky] = useState(false);

  const cro = getProductCroContent(SLUG);
  const isPack = isPackVariantSku(variant.sku);
  const orderQty = isPack ? 1 : qty;
  const maxQty = Math.min(variant.stock || 3, 3);

  const related = useMemo(
    () => (relatedProp && relatedProp.length > 0 ? relatedProp : products.filter((p) => p.id !== product.id)).slice(0, 4),
    [relatedProp, product.id],
  );

  useEffect(() => {
    addRecentlyViewed(product.id);
  }, [product.id, addRecentlyViewed]);

  useEffect(() => {
    const onScroll = () => setSticky(window.scrollY > 420);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToOrder = useCallback(() => {
    document.getElementById("order-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const heroSrc = resolveLampImage("02-premium-hero");
  const stickyLabel = isPack
    ? `${formatPriceNumber(PACK_PRICE, "ar")} درهم — نطلب جوج`
    : `${formatPriceNumber(SINGLE_PRICE, "ar")} درهم — نطلب دابا`;

  const heroBullets = [
    "إضاءة دافئة ومريحة",
    "تصميم أنيق وعصري",
    "مثالي لغرفة النوم والصالون",
    "فكرة زوينة للهدية",
  ];

  return (
    <div className="min-h-screen bg-[#f7f3ed] text-[#2c2419] font-sans w-full max-w-full overflow-x-clip" dir="rtl">
      <FacebookProductTracker
        productId={product.id}
        contentName={product.name.ar}
        value={variant.price}
        currency="MAD"
        quantity={orderQty}
      />

      {/* Trust strip */}
      <div className="bg-[#2c2419] text-[#f5ead8] text-xs sm:text-sm py-2.5 px-4">
        <div className="max-w-6xl mx-auto flex flex-wrap justify-center gap-x-6 gap-y-1 text-center">
          <span className="flex items-center gap-1.5">
            <Banknote className="h-3.5 w-3.5" /> 💵 الدفع عند الاستلام
          </span>
          <span className="hidden sm:inline opacity-30">|</span>
          <span className="flex items-center gap-1.5">
            <Truck className="h-3.5 w-3.5" /> 🚚 التوصيل للمدن المغربية
          </span>
          <span className="hidden sm:inline opacity-30">|</span>
          <span className="flex items-center gap-1.5">
            <Shield className="h-3.5 w-3.5" /> 🔒 طلب آمن
          </span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pb-28 lg:pb-16 pt-4 space-y-8 sm:space-y-10">
        <nav className="flex items-center gap-2 text-xs text-[#8b7355] max-w-3xl mx-auto">
          <Link href="/ar" className="hover:text-[#8b6914] transition-colors">
            نورڤا
          </Link>
          <ChevronLeft className="h-3 w-3" />
          <Link href="/ar/products" className="hover:text-[#8b6914] transition-colors">
            المجموعة
          </Link>
          <ChevronLeft className="h-3 w-3" />
          <span className="font-medium truncate text-[#2c2419]/80">{product.name.ar}</span>
        </nav>

        {/* HERO — صورة + نص */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-center max-w-5xl mx-auto">
          <div className="relative aspect-square w-full max-w-[520px] mx-auto lg:max-w-none rounded-3xl overflow-hidden border border-[#e8ddd0] bg-white shadow-lg">
            <Image
              src={heroSrc}
              alt="مصباح LED ديكوري بإضاءة دافئة"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>

          <div className="space-y-5 text-center lg:text-start">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#f5ead8] border border-[#e8ddd0] px-4 py-1.5 text-xs font-semibold text-[#8b6914]">
              ✨ ديكور · إضاءة دافئة
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight tracking-tight text-[#2c2419]">
              {cro?.headline.title ?? "ضو دافئ كيبدل جو دارك ✨"}
            </h1>
            <p className="text-base sm:text-lg text-[#6b5d4d] leading-relaxed">
              {cro?.headline.subtitle ?? product.shortDescription.ar}
            </p>
            <ul className="space-y-2 text-sm sm:text-base text-[#2c2419]">
              {heroBullets.map((b) => (
                <li key={b} className="flex items-center gap-2 justify-center lg:justify-start">
                  <span className="text-emerald-600 font-bold" aria-hidden>
                    ✓
                  </span>
                  {b}
                </li>
              ))}
            </ul>
            <div className="space-y-2 pt-2">
              <p className="text-3xl sm:text-4xl font-black text-[#8b6914] tabular-nums">
                {formatPriceNumber(SINGLE_PRICE, "ar")}{" "}
                <span className="text-xl sm:text-2xl font-bold text-[#2c2419]">درهم</span>
              </p>
              <p className="text-lg sm:text-xl font-bold text-[#2c2419]">
                🔥 جوج بـ
                <span className="text-[#8b6914] font-black ms-1">
                  {formatPriceNumber(PACK_PRICE, "ar")} درهم
                </span>
              </p>
            </div>
            <button
              type="button"
              onClick={scrollToOrder}
              className="w-full sm:w-auto min-w-[240px] h-14 rounded-2xl bg-[#8b6914] hover:bg-[#7a5c12] text-white font-black text-lg flex items-center justify-center gap-2 shadow-lg mx-auto lg:mx-0"
            >
              <ShoppingBag className="h-5 w-5" />
              🛒 بغيتو دابا
            </button>
          </div>
        </section>

        {/* PRODUCT GALLERY */}
        <section aria-label="صور المنتج" className="max-w-3xl mx-auto">
          <PremiumProductGallery product={product} />
        </section>

        {/* OFFER SECTION */}
        <section className="space-y-3 max-w-2xl mx-auto scroll-mt-24" id="offers">
          <p className="text-base sm:text-lg font-bold text-center text-[#2c2419]">
            اختار العرض المناسب ليك 👇
          </p>
          <OfferCard
            active={variant.id === singleVariant.id}
            title="مصباح واحد"
            price={SINGLE_PRICE}
            subtitle="قطعة وحدة"
            onSelect={() => {
              setVariant(singleVariant);
              setQty(1);
            }}
          />
          <OfferCard
            active={variant.id === packVariant.id}
            recommended
            title="جوج مصابيح"
            price={PACK_PRICE}
            subtitle="🔥 الأكثر طلباً"
            savings={PACK_SAVINGS}
            badge="🔥 الأكثر طلباً"
            onSelect={() => {
              setVariant(packVariant);
              setQty(1);
            }}
          />

          {!isPack && (
            <div className="flex items-center justify-center gap-4 rounded-2xl border border-[#e8ddd0] bg-white px-5 py-3">
              <span className="text-sm font-medium text-[#6b5d4d]">الكمية</span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  aria-label="إنقاص"
                  disabled={qty <= 1}
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="h-10 w-10 rounded-full border border-[#e8ddd0] flex items-center justify-center disabled:opacity-30 hover:bg-[#f7f3ed]"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-8 text-center text-lg font-bold tabular-nums">{qty}</span>
                <button
                  type="button"
                  aria-label="زيادة"
                  disabled={qty >= maxQty}
                  onClick={() => setQty((q) => Math.min(maxQty, q + 1))}
                  className="h-10 w-10 rounded-full border border-[#e8ddd0] flex items-center justify-center disabled:opacity-30 hover:bg-[#f7f3ed]"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </section>

        {/* ORDER FORM — مباشرة تحت العروض */}
        <div className="max-w-2xl mx-auto">
          <ProductOrderForm
            product={product}
            variant={variant}
            quantity={orderQty}
            extendedAddress
            formTitle="طلبك واجد؟ عمر المعلومات ونسيفطوه ليك 🚚"
            formSubtitle="عمر معلوماتك ونتاصلوا بيك باش نأكدو الطلب."
            submitLabel="🛒 أكد الطلب ديالك"
          />
          <p className="text-center text-sm font-semibold text-[#6b5d4d] mt-3">💵 الأداء عند الاستلام</p>
        </div>

        {/* BENEFITS */}
        <section className="scroll-mt-24 max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 text-[#2c2419]">علاش غادي يعجبك</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon: Sparkles, title: "✨ إضاءة دافئة", desc: "كتعطي جو هادئ ومريح." },
              { icon: Home, title: "🏠 ديكور أنيق", desc: "كيزيد لمسة زوينة لأي بلاصة." },
              { icon: Moon, title: "🌙 مثالي لغرفة النوم", desc: "جو هادئ ومناسب للراحة." },
              { icon: Gift, title: "🎁 فكرة هدية", desc: "هدية بسيطة وأنيقة." },
            ].map((b) => (
              <div
                key={b.title}
                className="rounded-2xl border border-[#e8ddd0] bg-white p-6 shadow-sm flex gap-4 items-start"
              >
                <div className="shrink-0 h-12 w-12 rounded-xl bg-[#f5ead8] flex items-center justify-center">
                  <b.icon className="h-6 w-6 text-[#8b6914]" />
                </div>
                <div>
                  <h3 className="font-bold text-[#2c2419] mb-1">{b.title}</h3>
                  <p className="text-sm text-[#6b5d4d] leading-relaxed">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* PROBLEM / SOLUTION */}
        <section className="rounded-3xl border border-[#e8ddd0] bg-[#2c2419] text-[#f5ead8] p-8 sm:p-12 text-center max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">باقي كتستعمل ضو عادي فالليل؟</h2>
          <p className="text-base sm:text-lg text-[#f5ead8]/85 max-w-2xl mx-auto leading-relaxed">
            الإضاءة ماشي غير باش تشوف...
            <br />
            الإضاءة كتقدر تبدل الجو كامل.
            <br />
            <br />
            هاد المصباح كيضيف إضاءة دافئة وكيخلي المكان أكثر راحة وأناقة.
          </p>
        </section>

        {/* LIFESTYLE IMAGES */}
        <div className="space-y-6 max-w-4xl mx-auto">
          <LifestyleBlock
            title="خلي الليل يكون أهدأ وأجمل ✨"
            copy="ضو خفيف، جو هادئ، وديكور كيخلي المكان مختلف."
            imageType="04-bedroom"
          />
          <LifestyleBlock
            title="ماشي غير مصباح… قطعة ديكور"
            copy="كيزيد لمسة زوينة للصالون والبيت بأجواء دافئة."
            imageType="05-living-room"
            reverse
          />
          <LifestyleBlock
            title="فوق المكتب أو الطاولة"
            copy="إضاءة دافئة بستايل minimal — المنتج واضح وفخم."
            imageType="14-product-in-use"
          />
          <LifestyleBlock
            title="أجواء ليلية سينمائية"
            copy="ضو دافئ وخلفية ناعمة — المصباح هو البطل."
            imageType="07-romantic-room"
            reverse
          />
        </div>

        {/* TWO-PIECE UPSELL */}
        <section className="rounded-3xl border-2 border-[#8b6914]/35 bg-gradient-to-b from-[#f5ead8] to-white p-6 sm:p-10 space-y-6 max-w-3xl mx-auto scroll-mt-24 shadow-lg">
          <h2 className="text-xl sm:text-2xl font-bold text-center text-[#2c2419]">
            علاش تشري واحد إلا قدرت تاخد جوج بثمن أحسن؟ 🔥
          </h2>
          <div className="relative aspect-square max-w-sm mx-auto rounded-2xl overflow-hidden border border-[#e8ddd0]">
            <Image
              src={resolveLampImage("10-features")}
              alt="عرض جوج مصابيح LED ديكورية"
              fill
              loading="lazy"
              sizes="400px"
              className="object-cover"
            />
          </div>
          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto text-center">
            <div className="rounded-2xl border border-[#e8ddd0] bg-white p-4">
              <p className="text-sm text-[#6b5d4d] mb-1">مصباح واحد</p>
              <p className="text-2xl font-black text-[#2c2419]">
                {formatPriceNumber(SINGLE_PRICE, "ar")}{" "}
                <span className="text-sm font-bold">درهم</span>
              </p>
            </div>
            <div className="rounded-2xl border-2 border-[#8b6914] bg-[#f5ead8] p-4 shadow-md">
              <p className="text-xs font-bold text-[#8b6914] mb-1">🔥 الأكثر طلباً</p>
              <p className="text-sm text-[#6b5d4d] mb-1">جوج مصابيح</p>
              <p className="text-2xl font-black text-[#8b6914]">
                {formatPriceNumber(PACK_PRICE, "ar")}{" "}
                <span className="text-sm font-bold">درهم</span>
              </p>
              <p className="text-xs font-semibold text-emerald-700 mt-1">
                كتوفر {formatPriceNumber(PACK_SAVINGS, "ar")} درهم
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setVariant(packVariant);
              setQty(1);
              scrollToOrder();
            }}
            className="w-full max-w-md mx-auto h-14 rounded-2xl bg-[#8b6914] hover:bg-[#7a5c12] text-white font-black text-lg flex items-center justify-center gap-2 shadow-lg"
          >
            <ShoppingBag className="h-5 w-5" />
            🛒 ناخد جوج
          </button>
        </section>

        {/* TRUST */}
        <section className="rounded-2xl border border-[#e8ddd0] bg-white p-6 max-w-3xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            {[
              { icon: Banknote, label: "💵 الدفع عند الاستلام" },
              { icon: Truck, label: "🚚 التوصيل للمدن المغربية" },
              { icon: Shield, label: "🔒 طلب آمن" },
              { icon: Phone, label: "📞 خدمة العملاء" },
            ].map((item) => (
              <div key={item.label} className="flex flex-col items-center gap-2 p-3">
                <item.icon className="h-6 w-6 text-[#8b6914]" />
                <p className="text-xs sm:text-sm font-semibold text-[#2c2419]">{item.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="max-w-2xl mx-auto scroll-mt-24" id="faq">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-[#2c2419]">أسئلة شائعة</h2>
          <Accordion type="single" collapsible className="rounded-2xl border border-[#e8ddd0] bg-white px-5">
            {FAQ_ITEMS.map((faq, i) => (
              <AccordionItem key={faq.q} value={`faq-${i}`}>
                <AccordionTrigger className="text-[#2c2419] font-bold text-base text-end">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-[#6b5d4d] text-end">{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        {/* FINAL CTA */}
        <section className="rounded-3xl border-2 border-[#8b6914]/30 bg-white p-6 sm:p-8 space-y-4 shadow-sm scroll-mt-24 max-w-2xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold text-center text-[#2c2419]">جاهز تطلب؟</h2>
          <p className="text-center text-[#6b5d4d] text-sm">
            {formatPriceNumber(variant.price, "ar")} درهم — الدفع عند الاستلام
          </p>
          <button
            type="button"
            onClick={scrollToOrder}
            className="w-full h-14 rounded-2xl bg-[#8b6914] hover:bg-[#7a5c12] text-white font-black text-lg flex items-center justify-center gap-2 shadow-lg"
          >
            <ShoppingBag className="h-5 w-5" />
            🛒 أكد الطلب ديالك
          </button>
        </section>

        {/* Related */}
        {related.length > 0 && (
          <section className="max-w-lg mx-auto">
            <h2 className="text-lg font-bold text-center mb-5 text-[#6b5d4d]">منتجات قد تعجبك</h2>
            <div className="grid grid-cols-2 gap-3">
              {related.slice(0, 2).map((p) => (
                <Link
                  key={p.id}
                  href={`/ar/products/${p.slug}`}
                  className="group rounded-2xl overflow-hidden border border-[#e8ddd0] bg-white hover:shadow-md transition-shadow"
                >
                  <div className="relative aspect-square">
                    <Image
                      src={resolveProductImage(p.slug, "02-premium-hero", "webp")}
                      alt={p.name.ar}
                      fill
                      className="object-cover"
                      sizes="40vw"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-3 text-center">
                    <p className="text-xs font-bold line-clamp-2 text-[#2c2419] mb-1">{p.name.ar}</p>
                    <p className="text-sm font-bold text-[#8b6914]">{formatPriceNumber(p.price, "ar")} درهم</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Sticky mobile CTA */}
      <AnimatePresence>
        {sticky && (
          <motion.div
            initial={{ y: 88 }}
            animate={{ y: 0 }}
            exit={{ y: 88 }}
            className="fixed bottom-0 inset-x-0 z-50 lg:hidden bg-white/95 backdrop-blur-md border-t border-[#e8ddd0] safe-area-pb shadow-[0_-4px_24px_rgba(44,36,25,0.08)]"
          >
            <div className="flex items-center gap-3 px-4 py-3 max-w-lg mx-auto">
              <button
                type="button"
                onClick={scrollToOrder}
                className="flex-1 h-12 rounded-xl bg-[#8b6914] hover:bg-[#7a5c12] text-white font-black text-sm flex items-center justify-center gap-2"
              >
                <ShoppingBag className="h-4 w-4" />
                {stickyLabel}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ProductPageWarmLedDecorLamp;
