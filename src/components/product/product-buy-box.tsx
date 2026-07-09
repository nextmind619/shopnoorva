"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "motion/react";
import {
  Star, Minus, Plus, ShoppingBag, Check, Heart, Share2, Truck, Shield,
  Package, RotateCcw, Banknote, Clock, Tag,
} from "lucide-react";
import type { Product, Locale, ProductVariant } from "@/types";
import { getLocalized, calculateDiscount, formatPrice, getShippingCost } from "@/lib/utils";
import { PriceDisplay } from "@/components/shared/price-display";
import { useCartStore } from "@/lib/store/cart-store";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/components/analytics/analytics-scripts";
import { cn } from "@/lib/utils";

interface ProductBuyBoxProps {
  product: Product;
  selectedVariant: ProductVariant;
  onVariantChange: (v: ProductVariant) => void;
  quantity: number;
  onQuantityChange: (q: number) => void;
}

const TRUST_KEYS = ["cod", "shipping", "packaging", "delivery", "returns", "warranty"] as const;
const TRUST_ICONS = { cod: Banknote, shipping: Truck, packaging: Package, delivery: Clock, returns: RotateCcw, warranty: Shield };

export function ProductBuyBox({
  product,
  selectedVariant,
  onVariantChange,
  quantity,
  onQuantityChange,
}: ProductBuyBoxProps) {
  const t = useTranslations("product");
  const tSections = useTranslations("sections");
  const locale = useLocale() as Locale;
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);

  const discount = calculateDiscount(selectedVariant.price, selectedVariant.compareAtPrice);
  const shipping = getShippingCost("Casablanca", selectedVariant.price * quantity);
  const lowStock = selectedVariant.stock > 0 && selectedVariant.stock <= 15;

  const handleAddToCart = useCallback(() => {
    addItem({ productId: product.id, variantId: selectedVariant.id, quantity });
    setAdded(true);
    trackEvent("AddToCart", { content_ids: [product.id], value: selectedVariant.price * quantity, currency: "MAD" });
    setTimeout(() => setAdded(false), 2200);
  }, [addItem, product.id, selectedVariant.id, selectedVariant.price, quantity]);

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const title = getLocalized(product.name, locale);
    if (navigator.share) {
      await navigator.share({ title, url });
    } else {
      await navigator.clipboard.writeText(url);
    }
  };

  const checkoutUrl = `/${locale}/checkout?product=${product.id}&variant=${selectedVariant.id}&qty=${quantity}`;

  return (
    <div className="lg:sticky lg:top-28 lg:self-start">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="space-y-6"
      >
        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className={cn("h-4 w-4", i < Math.floor(product.rating) ? "fill-gold text-gold" : "text-neutral-200")} />
            ))}
            <span className="font-semibold ms-1">{product.rating}</span>
          </div>
          <span className="text-neutral-300">·</span>
          <span className="text-muted">{product.reviewCount} {tSections("reviews_count")}</span>
          <span className="text-neutral-300">·</span>
          <span className="text-muted">{product.soldCount.toLocaleString()}+ {tSections("soldCount")}</span>
        </div>

        <div>
          <p className="text-[10px] tracking-[0.25em] uppercase text-gold font-semibold mb-2">NOORVA</p>
          <h1 className="font-display text-3xl md:text-[2.75rem] font-light leading-[1.12] text-noir">
            {getLocalized(product.name, locale)}
          </h1>
          <p className="mt-4 text-muted text-base md:text-lg leading-relaxed">
            {getLocalized(product.shortDescription, locale)}
          </p>
        </div>

        {/* Availability */}
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <span className={cn("inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-medium", selectedVariant.stock > 0 ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600")}>
            <span className={cn("w-2 h-2 rounded-full", selectedVariant.stock > 0 ? "bg-emerald-500" : "bg-red-500")} />
            {selectedVariant.stock > 0 ? t("inStock") : t("outOfStock")}
          </span>
          {lowStock && (
            <span className="text-amber-700 bg-amber-50 px-3 py-1.5 rounded-full text-xs font-medium animate-pulse">
              {t("lowStock", { count: selectedVariant.stock })}
            </span>
          )}
          <span className="text-muted flex items-center gap-1"><Tag className="h-3.5 w-3.5" />{t("sku")}: {selectedVariant.sku}</span>
        </div>

        {/* Price */}
        <div className="py-5 border-y border-black/5">
          <PriceDisplay amount={selectedVariant.price} compareAt={selectedVariant.compareAtPrice} size="xl" />
          {discount > 0 && (
            <span className="inline-block mt-3 text-sm bg-gold/15 text-gold-dark px-4 py-1.5 rounded-full font-semibold">
              {t("save")} {discount}%
            </span>
          )}
          <div className="mt-4 inline-flex items-center gap-2 bg-navy text-cream text-xs font-semibold px-4 py-2 rounded-full">
            <Banknote className="h-4 w-4 text-gold" />
            {t("codBadge")}
          </div>
          <p className="mt-3 text-sm text-muted flex items-center gap-2">
            <Truck className="h-4 w-4 text-gold" />
            {t("deliveryTime")}
          </p>
        </div>

        {product.variants.length > 1 && (
          <div>
            <p className="text-xs tracking-widest uppercase text-muted mb-3">{t("selectVariant")}</p>
            <div className="flex flex-wrap gap-2">
              {product.variants.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => onVariantChange(v)}
                  className={cn(
                    "px-5 py-2.5 text-sm rounded-full border transition-all duration-300",
                    selectedVariant.id === v.id ? "border-noir bg-noir text-cream shadow-soft" : "border-black/10 hover:border-gold"
                  )}
                >
                  {getLocalized(v.name, locale)}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center gap-5">
          <p className="text-xs tracking-widest uppercase text-muted">{t("quantity")}</p>
          <div className="flex items-center rounded-full border border-black/10 overflow-hidden">
            <button type="button" onClick={() => onQuantityChange(Math.max(1, quantity - 1))} className="p-3 hover:bg-neutral-50 transition-colors" aria-label="Decrease"><Minus className="h-4 w-4" /></button>
            <span className="px-5 text-sm font-semibold tabular-nums min-w-[3rem] text-center">{quantity}</span>
            <button type="button" onClick={() => onQuantityChange(quantity + 1)} className="p-3 hover:bg-neutral-50 transition-colors" aria-label="Increase"><Plus className="h-4 w-4" /></button>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col gap-3">
          <Button variant="gold" size="lg" className="w-full rounded-full h-14 text-base shadow-luxury" onClick={handleAddToCart} disabled={selectedVariant.stock <= 0}>
            {added ? <><Check className="h-5 w-5" />{t("added")}</> : <><ShoppingBag className="h-5 w-5" />{tSections("addToCart")}</>}
          </Button>
          <Button variant="default" size="lg" className="w-full rounded-full h-14 text-base bg-noir hover:bg-noir/90" asChild>
            <Link href={checkoutUrl}>{tSections("buyNow")} · {t("codOnly")}</Link>
          </Button>
        </div>

        <div className="flex gap-2">
          <button type="button" onClick={() => setWishlisted(!wishlisted)} className={cn("flex-1 flex items-center justify-center gap-2 py-3 rounded-full border text-sm transition-all", wishlisted ? "border-gold text-gold bg-gold/5" : "border-black/10 hover:border-gold/40")}>
            <Heart className={cn("h-4 w-4", wishlisted && "fill-gold")} />
            {t("wishlist")}
          </button>
          <button type="button" onClick={handleShare} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-full border border-black/10 text-sm hover:border-gold/40 transition-all">
            <Share2 className="h-4 w-4" />
            {t("share")}
          </button>
        </div>

        {/* Trust badges */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          {TRUST_KEYS.map((key) => {
            const Icon = TRUST_ICONS[key];
            return (
              <div key={key} className="flex items-start gap-2.5 p-3 rounded-2xl bg-white border border-black/5 shadow-soft">
                <Icon className="h-4 w-4 text-gold shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold">{t(`trust.${key}.title`)}</p>
                  <p className="text-[10px] text-muted mt-0.5">{t(`trust.${key}.desc`)}</p>
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-center text-xs text-muted">
          {shipping === 0 ? t("freeShipping") : `${t("shippingEstimate")}: ${formatPrice(shipping, locale)}`}
        </p>
      </motion.div>
    </div>
  );
}
