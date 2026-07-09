"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "motion/react";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCartStore } from "@/lib/store/cart-store";
import { getProductById } from "@/data/products";
import { formatPrice, getLocalized } from "@/lib/utils";
import { PriceDisplay } from "@/components/shared/price-display";
import type { Locale } from "@/types";
import { Button } from "@/components/ui/button";

export function CartPageClient() {
  const t = useTranslations("cart");
  const tCheckout = useTranslations("checkout");
  const locale = useLocale() as Locale;
  const { items, updateQuantity, removeItem } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="container-luxury section-padding text-center">
        <ShoppingBag className="h-16 w-16 mx-auto text-neutral-300 mb-6" />
        <h1 className="font-display text-3xl mb-4">{t("empty")}</h1>
        <Button variant="gold" asChild>
          <Link href={`/${locale}/products`}>{t("continue")}</Link>
        </Button>
      </div>
    );
  }

  let subtotal = 0;
  const cartItems = items.map((item) => {
    const product = getProductById(item.productId);
    const variant = product?.variants.find((v) => v.id === item.variantId);
    const lineTotal = (variant?.price || 0) * item.quantity;
    subtotal += lineTotal;
    return { ...item, product, variant, lineTotal };
  }).filter((i) => i.product && i.variant);

  return (
    <div className="container-luxury section-padding">
      <h1 className="font-display text-3xl md:text-4xl mb-10">{t("title")}</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-6">
          {cartItems.map((item) => (
            <motion.div
              key={`${item.productId}-${item.variantId}`}
              layout
              className="flex gap-4 md:gap-6 border-b border-neutral-100 pb-6"
            >
              <Link href={`/${locale}/products/${item.product!.slug}`} className="relative w-24 h-32 md:w-32 md:h-40 shrink-0 overflow-hidden bg-neutral-100">
                <Image src={item.product!.images[0]?.url || ""} alt="" fill className="object-cover" sizes="128px" />
              </Link>
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <Link href={`/${locale}/products/${item.product!.slug}`} className="font-medium hover:text-gold transition-colors">
                    {getLocalized(item.product!.name, locale)}
                  </Link>
                  <p className="text-sm text-neutral-500 mt-1">{getLocalized(item.variant!.name, locale)}</p>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center border border-neutral-200">
                    <button onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)} className="p-2"><Minus className="h-3 w-3" /></button>
                    <span className="px-3 text-sm tabular-nums">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)} className="p-2"><Plus className="h-3 w-3" /></button>
                  </div>
                  <div className="flex items-center gap-4">
                    <PriceDisplay amount={item.lineTotal} size="sm" />
                    <button onClick={() => removeItem(item.productId, item.variantId)} className="text-neutral-400 hover:text-red-500 transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="lg:sticky lg:top-28 lg:self-start border border-neutral-200 p-6 h-fit">
          <h2 className="font-display text-xl mb-6">{tCheckout("summary")}</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-neutral-500">{tCheckout("subtotal")}</span>
              <span>{formatPrice(subtotal, locale)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">{tCheckout("shippingCost")}</span>
              <span>{subtotal >= 500 ? "Gratuit" : formatPrice(25, locale)}</span>
            </div>
            <div className="border-t pt-3 flex justify-between items-end font-semibold">
              <span>{tCheckout("total")}</span>
              <PriceDisplay amount={subtotal + (subtotal >= 500 ? 0 : 25)} size="md" />
            </div>
          </div>
          <Button variant="gold" size="lg" className="w-full mt-6" asChild>
            <Link href={`/${locale}/checkout`}>
              {t("checkout")} <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
