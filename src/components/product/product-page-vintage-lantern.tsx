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
  MessageCircle,
  Flame,
  Sparkles,
  Home,
  Gift,
  Check,
  Minus,
  Plus,
} from "lucide-react";
import type { Product, ProductVariant } from "@/types";
import { useRecentlyViewedStore } from "@/lib/store/recently-viewed-store";
import { products, getReviewsForProduct } from "@/data/products";
import { FacebookProductTracker } from "@/components/facebook/facebook-trackers";
import { formatPriceNumber, cn } from "@/lib/utils";
import { resolveProductImage } from "@/lib/product-images/resolve";
import { getProductCroContent } from "@/lib/product-cro-content";
import { PremiumProductGallery } from "@/components/product/product-gallery-premium";
import { isPackVariantSku } from "@/components/product/product-variant-picker";
import type { PremiumImageType } from "@/lib/product-images/types";

const ProductOrderForm = dynamic(
  () => import("@/components/product/product-order-form").then((m) => m.ProductOrderForm),
  { ssr: true, loading: () => <div className="min-h-[420px]" aria-hidden /> },
);

const SLUG = "vintage-led-lantern";
const SINGLE_PRICE = 229;
const PACK_PRICE = 319;
const PACK_SAVINGS = 139;

function resolveLanternImage(imageType: PremiumImageType) {
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
  const src = resolveLanternImage(imageType);
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

export function ProductPageVintageLantern({ product, related: relatedProp }: Props) {
  const addRecentlyViewed = useRecentlyViewedStore((s) => s.addProduct);
  const packVariant = product.variants.find((v) => isPackVariantSku(v.sku)) ?? product.variants[1];
  const singleVariant = product.variants.find((v) => !isPackVariantSku(v.sku)) ?? product.variants[0];

  const [variant, setVariant] = useState<ProductVariant>(packVariant ?? product.variants[0]);
  const [qty, setQty] = useState(1);
  const [sticky, setSticky] = useState(false);

  const cro = getProductCroContent(SLUG);
  const reviews = getReviewsForProduct(product.id).filter((r) => r.productId === product.id);
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

  const stickyLabel = isPack ? "نطلب جوج" : "نطلب دابا";

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
            <Banknote className="h-3.5 w-3.5" /> 💵 الأداء عند الاستلام
          </span>
          <span className="hidden sm:inline opacity-30">|</span>
          <span className="flex items-center gap-1.5">
            <Truck className="h-3.5 w-3.5" /> 📦 توصيل للمدن المغربية
          </span>
          <span className="hidden sm:inline opacity-30">|</span>
          <span className="flex items-center gap-1.5">
            <Shield className="h-3.5 w-3.5" /> 🔒 طلب آمن
          </span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 pb-28 lg:pb-16 pt-4 space-y-8 sm:space-y-10">
        <nav className="flex items-center gap-2 text-xs text-[#8b7355]">
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

        {/* عنوان + مقدمة قصيرة */}
        <section className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#f5ead8] border border-[#e8ddd0] px-4 py-1.5 text-xs font-semibold text-[#8b6914]">
            🏮 ديكور · إضاءة · Vintage
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold leading-tight tracking-tight text-[#2c2419]">
            {cro?.headline.title ?? "بدّل جو دارك بلمسة وحدة ✨"}
          </h1>
          <p className="text-base text-[#6b5d4d] leading-relaxed max-w-lg mx-auto">
            {cro?.headline.subtitle ?? product.shortDescription.ar}
          </p>
        </section>

        {/* صور المنتج */}
        <section aria-label="صور المنتج">
          <PremiumProductGallery product={product} />
        </section>

        {/* السعر واضح بالعربية */}
        <section className="rounded-2xl border-2 border-[#8b6914]/25 bg-white px-5 py-4 text-center shadow-sm">
          <p className="text-sm font-semibold text-[#6b5d4d] mb-2">الثمن</p>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            <p className="text-xl sm:text-2xl font-black text-[#2c2419]">
              قطعة وحدة:{" "}
              <span className="text-[#8b6914]">{formatPriceNumber(SINGLE_PRICE, "ar")} درهم</span>
            </p>
            <span className="hidden sm:inline text-[#e8ddd0]">|</span>
            <p className="text-xl sm:text-2xl font-black text-[#2c2419]">
              جوج قطع:{" "}
              <span className="text-[#8b6914]">{formatPriceNumber(PACK_PRICE, "ar")} درهم</span>
              <span className="ms-2 text-xs font-bold text-emerald-700 align-middle">🔥 الأكثر طلباً</span>
            </p>
          </div>
          <p className="text-xs text-[#8b7355] mt-2">💵 الأداء عند الاستلام · 📦 توصيل للمدن المغربية</p>
        </section>

        {/* اختيار العرض — مباشرة قبل الفورم */}
        <section className="space-y-3">
          <p className="text-base font-bold text-center text-[#2c2419]">اختار العرض 👇</p>
          <OfferCard
            active={variant.id === singleVariant.id}
            title="قطعة وحدة"
            price={SINGLE_PRICE}
            subtitle="فانوس واحد — 229 درهم"
            onSelect={() => {
              setVariant(singleVariant);
              setQty(1);
            }}
          />
          <OfferCard
            active={variant.id === packVariant.id}
            recommended
            title="جوج قطع"
            price={PACK_PRICE}
            subtitle="فانوسين — 319 درهم · الأكثر طلباً"
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

        {/* نموذج الطلب — مباشرة تحت الصور */}
        <ProductOrderForm
          product={product}
          variant={variant}
          quantity={orderQty}
          extendedAddress
          submitLabel="أكد الطلب ديالك"
        />

        {/* Benefits */}
        <section className="scroll-mt-24">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 text-[#2c2419]">علاش غادي يعجبك</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon: Flame, title: "إضاءة دافئة ✨", desc: "كيعطي جو مريح ودافئ خصوصاً فالليل." },
              { icon: Sparkles, title: "ستايل كلاسيكي 🏮", desc: "الشكل ديالو Vintage كيضيف لمسة مميزة لأي بلاصة." },
              { icon: Home, title: "لدار وبرا 🌙", desc: "مناسب للصالون، التراس، الحديقة وحتى الخرجات." },
              { icon: Gift, title: "اختيار زوين للهدية 🎁", desc: "كيجمع بين الديكور والاستعمال فمنتج واحد." },
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

        {/* Problem → Solution */}
        <section className="rounded-3xl border border-[#e8ddd0] bg-[#2c2419] text-[#f5ead8] p-8 sm:p-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">حاس براسك الدار ناقصها داك الجو الدافئ؟</h2>
          <p className="text-base sm:text-lg text-[#f5ead8]/85 max-w-2xl mx-auto leading-relaxed">
            الإضاءة العادية كتضوي… ولكن ما كتخلقش الجو. هاد الفانوس كيجمع بين الإضاءة الدافئة والشكل الكلاسيكي باش
            يعطي للمكان شخصية مختلفة.
          </p>
        </section>

        <LifestyleBlock
          title="شوف كيفاش كيبدل الجو"
          copy="تراس، صالون أو ركن هادئ — الفانوس كيحوّل أي بلاصة لأجواء دافئة ومميزة."
          imageType="03-lifestyle"
        />
        <LifestyleBlock
          title="ماشي غير فانوس… قطعة ديكور"
          copy="ستايل Hurricane كلاسيكي كيتماشى مع الديكور المغربي العصري والتقليدي."
          imageType="05-living-room"
          reverse
        />
        <LifestyleBlock
          title="وخا فالدار ولا برا"
          copy="مناسب للتراس، الحديقة، التخييم — بلا ما ندّعي مواصفات ما كايناش."
          imageType="14-product-in-use"
        />
        <LifestyleBlock
          title="خد جوج واستافد أكثر"
          copy={`عرض جوج قطع بـ ${PACK_PRICE} درهم — كتوفر ${PACK_SAVINGS} درهم مقارنة بشراء جوج بشكل منفصل.`}
          imageType="10-features"
          reverse
        />

        {/* Bottom offer — CTA للتمرير للفورم */}
        <section className="rounded-3xl border-2 border-[#8b6914]/30 bg-white p-6 sm:p-8 space-y-4 shadow-sm scroll-mt-24">
          <h2 className="text-xl sm:text-2xl font-bold text-center text-[#2c2419]">اختار العرض ديالك 👇</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto">
            <OfferCard
              active={variant.id === singleVariant.id}
              title="1 فانوس"
              price={SINGLE_PRICE}
              subtitle={`${formatPriceNumber(SINGLE_PRICE, "ar")} درهم`}
              onSelect={() => setVariant(singleVariant)}
            />
            <OfferCard
              active={variant.id === packVariant.id}
              recommended
              title="2 فوانيس"
              price={PACK_PRICE}
              subtitle={`${formatPriceNumber(PACK_PRICE, "ar")} درهم · الأكثر طلباً`}
              savings={PACK_SAVINGS}
              onSelect={() => setVariant(packVariant)}
            />
          </div>
          <button
            type="button"
            onClick={scrollToOrder}
            className="w-full max-w-md mx-auto h-14 rounded-2xl bg-[#8b6914] hover:bg-[#7a5c12] text-white font-black text-lg flex items-center justify-center gap-2 shadow-lg"
          >
            <ShoppingBag className="h-5 w-5" />
            🛒 نطلب دابا — {formatPriceNumber(variant.price, "ar")} درهم
          </button>
        </section>

        {/* Reviews placeholder */}
        <section id="reviews" className="scroll-mt-24">
          <div className="rounded-3xl border border-[#e8ddd0] bg-white p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-center mb-2 text-[#2c2419]">آراء الزبناء</h2>
            {reviews.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                {reviews.map((r) => (
                  <div key={r.id} className="rounded-2xl border border-[#e8ddd0] p-5">
                    <p className="font-bold text-sm text-[#2c2419] mb-2">{r.title.ar}</p>
                    <p className="text-sm text-[#6b5d4d] leading-relaxed">{r.content.ar}</p>
                    <p className="text-xs text-[#8b7355] mt-3">{r.author} · {r.city}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 px-4">
                <MessageCircle className="h-10 w-10 text-[#c4a574] mx-auto mb-3" />
                <p className="text-[#6b5d4d] text-sm leading-relaxed max-w-md mx-auto">
                  كنسناو أول آراء الزبناء على هاد المنتج. ملي يوصلونا تقييمات حقيقية، غادي تبان هنا.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Related */}
        {related.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-center mb-5 text-[#6b5d4d]">منتجات قد تعجبك</h2>
            <div className="grid grid-cols-2 gap-3 max-w-lg mx-auto">
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
              <div className="shrink-0 text-end">
                <p className="text-lg font-black tabular-nums text-[#8b6914]">
                  {formatPriceNumber(variant.price, "ar")} درهم
                </p>
              </div>
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

export default ProductPageVintageLantern;
