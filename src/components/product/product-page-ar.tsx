"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  Star, Minus, Plus, Check, Heart, Share2, Clock,
  ChevronLeft, Play, Shield, Truck, Package,
  RotateCcw, MessageCircle, Banknote, ShieldCheck,
} from "lucide-react";
import type { Product } from "@/types";
import { useRecentlyViewedStore } from "@/lib/store/recently-viewed-store";
import { trackEvent } from "@/components/analytics/analytics-scripts";
import { products, getReviewsForProduct, getProductById, faqs } from "@/data/products";
import { formatPriceNumber, calculateDiscount, cn } from "@/lib/utils";
import { ProductOrderForm } from "@/components/product/product-order-form";
import { PremiumProductGallery } from "@/components/product/product-gallery-premium";
import { FlashCountdown, StockScarcityBar } from "@/components/product/flash-countdown";

const TOP_BADGES = [
  { icon: Truck, text: "توصيل مجاني لجميع أنحاء المغرب" },
  { icon: Banknote, text: "الدفع عند الاستلام" },
  { icon: RotateCcw, text: "استرداد خلال 7 أيام" },
  { icon: ShieldCheck, text: "طلب آمن 100%" },
];

const WHY_ICON_COLORS = ["text-luxury-gold", "text-sky-400", "text-rose-400", "text-emerald-400", "text-violet-400", "text-orange-400"];

const BENEFIT_CARDS = [
  { emoji: "✨", text: "يحوّل الغرفة إلى مجرة مذهلة" },
  { emoji: "🌙", text: "يساعد على الاسترخاء قبل النوم" },
  { emoji: "🎁", text: "هدية مثالية لأي مناسبة" },
  { emoji: "🎵", text: "مكبر صوت بلوتوث مدمج" },
  { emoji: "🎮", text: "ريموت للتحكم عن بعد" },
  { emoji: "⏰", text: "مؤقت ذكي للإيقاف التلقائي" },
  { emoji: "🌈", text: "أكثر من 10 أوضاع إضاءة" },
];

const WHY_NOORVA = [
  { icon: Shield, title: "جودة عالية", desc: "منتجات مختارة بعناية" },
  { icon: Banknote, title: "الدفع عند الاستلام", desc: "خلّص كاش عند الباب" },
  { icon: Truck, title: "توصيل سريع", desc: "24-48 ساعة للمدن الكبرى" },
  { icon: Package, title: "تغليف آمن", desc: "حماية كاملة للمنتج" },
  { icon: RotateCcw, title: "استبدال خلال 7 أيام", desc: "عند وجود عيب" },
  { icon: MessageCircle, title: "خدمة عبر واتساب", desc: "دعم سريع ومباشر" },
];

interface ProductPageArProps {
  product: Product;
}

export function ProductPageAr({ product }: ProductPageArProps) {
  const recentlyViewedIds = useRecentlyViewedStore((s) => s.productIds);
  const addRecentlyViewed = useRecentlyViewedStore((s) => s.addProduct);

  const [variant] = useState(product.variants[0]);
  const [qty, setQty] = useState(1);
  const [sticky, setSticky] = useState(false);
  const [wishlist, setWishlist] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  // recentlyViewedIds is persisted to localStorage (unavailable during SSR), so we only
  // render that section after mount to avoid a hydration mismatch.
  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time client-mount flag, mirrors pattern used elsewhere in this codebase
  useEffect(() => setMounted(true), []);

  const ar = (obj: { ar: string }) => obj.ar;
  const name = ar(product.name);
  const discount = calculateDiscount(variant.price, variant.compareAtPrice);
  const reviews = getReviewsForProduct(product.id);
  const lowStock = variant.stock > 0 && variant.stock <= 15;

  const related = useMemo(
    () => products.filter((p) => p.id !== product.id),
    [product.id]
  );

  const recentlyViewed = useMemo(
    () =>
      mounted
        ? recentlyViewedIds
            .filter((id) => id !== product.id)
            .map((id) => getProductById(id))
            .filter((p): p is Product => Boolean(p))
            .slice(0, 8)
        : [],
    [mounted, recentlyViewedIds, product.id]
  );

  useEffect(() => {
    addRecentlyViewed(product.id);
    trackEvent("ViewContent", { content_ids: [product.id], content_type: "product", value: variant.price, currency: "MAD" });
  }, [product.id, variant.price, addRecentlyViewed]);

  useEffect(() => {
    const onScroll = () => setSticky(window.scrollY > 480);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const share = async () => {
    const url = window.location.href;
    if (navigator.share) await navigator.share({ title: name, url });
    else await navigator.clipboard.writeText(url);
  };

  const scrollToOrder = () => {
    document.getElementById("order-form")?.scrollIntoView({ behavior: "smooth" });
  };

  const storyText = product.deepDescription?.ar || product.description.ar;

  return (
    <div className="product-luxury cosmic-page-bg text-luxury-black min-h-screen" dir="rtl">
      {/* شريط علوي */}
      <div className="bg-luxury-surface/60 border-b border-luxury-border text-[11px] sm:text-xs py-2.5 px-4">
        <div className="max-w-6xl mx-auto flex flex-wrap justify-center gap-x-6 gap-y-1.5 text-center text-luxury-muted">
          {TOP_BADGES.map((b) => (
            <span key={b.text} className="flex items-center gap-1.5 font-medium">
              <b.icon className="h-3.5 w-3.5 text-luxury-gold shrink-0" />
              {b.text}
            </span>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pb-28 lg:pb-16 pt-4">
        {/* مسار التنقل */}
        <nav className="flex items-center gap-2 text-xs text-luxury-muted mb-6">
          <Link href="/ar" className="hover:text-luxury-gold transition-colors">نورڤا</Link>
          <ChevronLeft className="h-3 w-3" />
          <Link href="/ar/products" className="hover:text-luxury-gold transition-colors">المجموعة</Link>
          <ChevronLeft className="h-3 w-3" />
          <span className="font-medium truncate">{name}</span>
        </nav>

        {/* المعرض + معلومات الشراء */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-6">
          <PremiumProductGallery product={product} />

          {/* معلومات المنتج */}
          <div className="cosmic-glow-bg rounded-[1.75rem] p-5 sm:p-7 lg:sticky lg:top-6 lg:self-start space-y-5">
            <div className="flex items-center gap-2 text-sm flex-wrap">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={cn("h-4 w-4", i < Math.floor(product.rating) ? "fill-luxury-gold text-luxury-gold" : "text-white/15")} />
                ))}
              </div>
              <span className="font-bold">{product.rating}</span>
              <span className="text-luxury-muted">·</span>
              <span className="text-luxury-muted">{product.soldCount.toLocaleString("ar-MA")}+ طلب</span>
              {product.isTikTokViral && (
                <span className="inline-flex items-center gap-1 bg-luxury-gold/15 text-luxury-gold text-[11px] font-bold px-2.5 py-1 rounded-full">
                  فيرال تيك توك 🔥
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight tracking-tight">{name}</h1>
            <p className="text-luxury-muted leading-relaxed">{product.shortDescription.ar}</p>

            <div className="py-4 border-y border-luxury-border">
              <div className="flex flex-wrap items-baseline gap-3">
                <span className="text-3xl sm:text-4xl font-bold tabular-nums">{formatPriceNumber(variant.price, "ar")}</span>
                <span className="text-base font-semibold text-luxury-gold">درهم مغربي</span>
                {variant.compareAtPrice && variant.compareAtPrice > variant.price && (
                  <span className="text-lg text-luxury-muted line-through tabular-nums">{formatPriceNumber(variant.compareAtPrice, "ar")} درهم</span>
                )}
                {discount > 0 && (
                  <span className="badge-urgency text-white text-sm font-bold px-3.5 py-1.5 rounded-full">
                    خصم {discount}%
                  </span>
                )}
              </div>
            </div>

            {product.flashSaleEndsAt && <FlashCountdown endDate={product.flashSaleEndsAt} />}

            <div className="flex items-center gap-3 flex-wrap">
              <span className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-300 text-sm font-medium px-4 py-2 rounded-full border border-emerald-500/20">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                متوفر الآن
              </span>
            </div>

            <StockScarcityBar stock={variant.stock} originalStock={product.stock} />

            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">الكمية</span>
              <div className="flex items-center rounded-full border border-luxury-border overflow-hidden">
                <button type="button" onClick={() => setQty(Math.max(1, qty - 1))} className="p-3 hover:bg-white/5 transition-colors"><Minus className="h-4 w-4" /></button>
                <span className="px-5 font-bold tabular-nums">{qty}</span>
                <button type="button" onClick={() => setQty(qty + 1)} className="p-3 hover:bg-white/5 transition-colors"><Plus className="h-4 w-4" /></button>
              </div>
              {lowStock && <span className="text-orange-300 text-xs font-medium">باقي {variant.stock} فقط!</span>}
            </div>

            <div className="flex flex-col gap-3">
              <button type="button" onClick={scrollToOrder} className="btn-cosmic w-full h-14 rounded-full font-bold text-base active:scale-[0.98] transition-all">
                اطلب الآن — الدفع عند الاستلام
              </button>
            </div>

            <div className="flex gap-2">
              <button type="button" onClick={() => setWishlist(!wishlist)} className={cn("flex-1 flex items-center justify-center gap-2 py-3 rounded-full border text-sm transition-all", wishlist ? "border-luxury-gold text-luxury-gold bg-luxury-gold/5" : "border-luxury-border hover:border-white/20")}>
                <Heart className={cn("h-4 w-4", wishlist && "fill-luxury-gold")} />المفضلة
              </button>
              <button type="button" onClick={share} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-full border border-luxury-border text-sm hover:border-luxury-gold/40 transition-all">
                <Share2 className="h-4 w-4" />مشاركة
              </button>
            </div>
          </div>
        </div>

        {/* مميزات المنتج */}
        <section className="mt-16 sm:mt-20">
          <h2 className="text-xl sm:text-2xl font-bold text-center mb-8">لماذا هذا المنتج؟</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {(product.benefits.length >= 4
              ? product.benefits.map((b, i) => ({ emoji: BENEFIT_CARDS[i]?.emoji || "✨", text: b.ar }))
              : BENEFIT_CARDS
            ).map((card, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }} className="bg-luxury-surface rounded-2xl p-4 sm:p-5 border border-luxury-border shadow-soft hover:shadow-luxury hover:-translate-y-1 hover:border-luxury-gold/25 transition-all duration-300">
                <span className="text-2xl">{card.emoji}</span>
                <p className="text-sm font-medium mt-3 leading-snug">{card.text}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* وصف تسويقي */}
        <section className="mt-16 sm:mt-20 max-w-3xl mx-auto text-center">
          <h2 className="text-xl sm:text-2xl font-bold mb-6">تجربة تستحقها</h2>
          <p className="text-base sm:text-lg text-luxury-muted leading-[1.9]">{storyText}</p>
          <p className="text-base sm:text-lg text-luxury-muted leading-[1.9] mt-4">
            تخيّل غرفتك وهي تتحوّل لعالم من النجوم والألوان — بلا عناء، بلا تعقيد. تشغّل البروجيكتور، تختار الأجواء اللي بغيتي، وتستمتع بلحظة ديالك. هادشي اللي كيخلّي آلاف المغاربة يختارو نورڤا كل يوم.
          </p>
        </section>

        {/* المواصفات */}
        {product.specifications && (
          <section className="mt-16 sm:mt-20">
            <h2 className="text-xl sm:text-2xl font-bold text-center mb-8">المواصفات التقنية</h2>
            <div className="max-w-2xl mx-auto bg-luxury-surface rounded-2xl border border-luxury-border overflow-hidden divide-y divide-luxury-border shadow-soft">
              {product.specifications.map((spec, i) => (
                <div key={i} className="flex justify-between items-center gap-4 px-5 py-4 text-sm">
                  <span className="text-luxury-muted">{spec.label.ar}</span>
                  <span className="font-semibold text-end">{spec.value.ar}</span>
                </div>
              ))}
            </div>
            {product.packageIncludes && (
              <div className="mt-6 grid grid-cols-2 gap-3 max-w-2xl mx-auto">
                {product.packageIncludes.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm bg-luxury-surface rounded-xl p-4 border border-luxury-border">
                    <Check className="h-4 w-4 text-luxury-gold shrink-0" />{item.ar}
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* لماذا NOORVA */}
        <section className="mt-16 sm:mt-20">
          <h2 className="text-xl sm:text-2xl font-bold text-center mb-8">لماذا تختار نورڤا؟</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            {WHY_NOORVA.map((item, i) => (
              <div key={i} className="bg-luxury-surface rounded-2xl p-5 border border-luxury-border text-center hover:border-luxury-gold/30 transition-colors">
                <item.icon className={cn("h-6 w-6 mx-auto mb-3", WHY_ICON_COLORS[i % WHY_ICON_COLORS.length])} />
                <p className="text-sm font-bold">{item.title}</p>
                <p className="text-xs text-luxury-muted mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* آراء العملاء */}
        <section className="mt-16 sm:mt-20" id="reviews">
          <h2 className="text-xl sm:text-2xl font-bold text-center mb-2">آراء العملاء</h2>
          <p className="text-center text-luxury-muted text-sm mb-8">مراجعات حقيقية من زبناء نورڤا</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {reviews.map((r) => (
              <div key={r.id} className="bg-luxury-surface rounded-2xl p-5 border border-luxury-border">
                <div className="flex gap-0.5 mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={cn("h-3.5 w-3.5", i < r.rating ? "fill-luxury-gold text-luxury-gold" : "text-white/15")} />
                  ))}
                </div>
                <p className="font-bold text-sm">{r.title.ar}</p>
                <p className="text-sm text-luxury-muted mt-2 leading-relaxed">{r.content.ar}</p>
                {r.images && (
                  <div className="flex gap-2 mt-3">
                    {r.images.map((img, i) => (
                      <div key={i} className="relative w-14 h-14 rounded-lg overflow-hidden"><Image src={img} alt="" fill className="object-cover" sizes="56px" /></div>
                    ))}
                  </div>
                )}
                {r.hasVideo && (
                  <div className="flex items-center gap-1.5 text-xs text-luxury-gold mt-3"><Play className="h-3 w-3 fill-luxury-gold" />فيديو عميل</div>
                )}
                <p className="text-xs text-luxury-muted mt-3 pt-3 border-t border-luxury-border">{r.author} · {r.city} {r.verified && "· ✓ شراء موثق"}</p>
              </div>
            ))}
          </div>
        </section>

        {/* الأسئلة الشائعة */}
        <section className="mt-16 sm:mt-20 max-w-2xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold text-center mb-8">الأسئلة الشائعة</h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={faq.id} className="bg-luxury-surface rounded-2xl border border-luxury-border overflow-hidden">
                <button type="button" onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex justify-between items-center px-5 py-4 text-start font-medium text-sm hover:text-luxury-gold transition-colors">
                  {faq.question.ar}
                  <ChevronLeft className={cn("h-4 w-4 shrink-0 transition-transform", openFaq === i && "rotate-90")} />
                </button>
                {openFaq === i && <p className="px-5 pb-4 text-sm text-luxury-muted leading-relaxed">{faq.answer.ar}</p>}
              </div>
            ))}
          </div>
        </section>

        {/* منتجات قد تعجبك */}
        <section className="mt-16 sm:mt-20">
          <h2 className="text-xl sm:text-2xl font-bold text-center mb-8">منتجات قد تعجبك</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {related.map((p) => (
              <Link key={p.id} href={`/ar/products/${p.slug}`} className="group bg-luxury-surface rounded-2xl overflow-hidden border border-luxury-border hover:border-luxury-gold/30 hover:shadow-luxury transition-all duration-300">
                <div className="relative aspect-square">
                  <Image src={p.images[0]?.url || ""} alt={p.name.ar} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="25vw" />
                </div>
                <div className="p-3 sm:p-4">
                  <p className="text-sm font-bold line-clamp-2 group-hover:text-luxury-gold transition-colors">{p.name.ar}</p>
                  <p className="text-sm font-bold mt-2 tabular-nums">{formatPriceNumber(p.price, "ar")} <span className="text-xs text-luxury-gold font-semibold">درهم</span></p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* شاهدت مؤخراً */}
        {recentlyViewed.length > 0 && (
          <section className="mt-16 sm:mt-20">
            <h2 className="text-xl sm:text-2xl font-bold text-center mb-2 flex items-center justify-center gap-2">
              <Clock className="h-5 w-5 text-luxury-gold" />
              شاهدت مؤخراً
            </h2>
            <p className="text-center text-luxury-muted text-sm mb-8">المنتجات التي زرتها سابقاً</p>
            <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-2 snap-x -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-4">
              {recentlyViewed.map((p) => (
                <Link key={p.id} href={`/ar/products/${p.slug}`} className="group shrink-0 w-36 sm:w-auto snap-start bg-luxury-surface rounded-2xl overflow-hidden border border-luxury-border hover:border-luxury-gold/30 hover:shadow-luxury transition-all duration-300">
                  <div className="relative aspect-square">
                    <Image src={p.images[0]?.url || ""} alt={p.name.ar} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="20vw" />
                  </div>
                  <div className="p-3">
                    <p className="text-xs font-bold line-clamp-2 group-hover:text-luxury-gold transition-colors">{p.name.ar}</p>
                    <p className="text-xs font-bold mt-1.5 tabular-nums">{formatPriceNumber(p.price, "ar")} <span className="text-[10px] text-luxury-gold font-semibold">درهم</span></p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        <ProductOrderForm product={product} variant={variant} quantity={qty} />
      </div>

      {/* شريط شراء ثابت — موبايل */}
      <AnimatePresence>
        {sticky && (
          <motion.div initial={{ y: 80 }} animate={{ y: 0 }} exit={{ y: 80 }} className="fixed bottom-0 inset-x-0 z-50 lg:hidden bg-luxury-surface/95 backdrop-blur-md border-t border-luxury-border shadow-luxury safe-area-pb">
            <div className="flex items-center gap-3 px-4 py-3 max-w-lg mx-auto">
              <div className="flex-1 min-w-0">
                <p className="text-lg font-bold tabular-nums">{formatPriceNumber(variant.price, "ar")} <span className="text-xs text-luxury-gold">درهم</span></p>
              </div>
              <button type="button" onClick={scrollToOrder} className="btn-cosmic h-12 px-8 rounded-full font-bold text-sm active:scale-95 transition-transform">
                اطلب الآن
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
