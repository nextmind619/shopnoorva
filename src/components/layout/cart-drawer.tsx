"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { motion, AnimatePresence } from "motion/react";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/lib/store/cart-store";
import { getProductById } from "@/data/products";
import { formatPrice, getLocalized } from "@/lib/utils";
import { PriceDisplay } from "@/components/shared/price-display";
import type { Locale } from "@/types";
import { Button } from "@/components/ui/button";

export function CartDrawer() {
  const t = useTranslations("cart");
  const locale = useLocale() as Locale;
  const { items, isOpen, setOpen, removeItem, updateQuantity } = useCartStore();

  const cartItems = items
    .map((item) => {
      const product = getProductById(item.productId);
      const variant = product?.variants.find((v) => v.id === item.variantId);
      const lineTotal = (variant?.price || 0) * item.quantity;
      return { ...item, product, variant, lineTotal };
    })
    .filter((i) => i.product && i.variant);

  const total = cartItems.reduce((s, i) => s + i.lineTotal, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-noir/50 z-[70] backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed top-0 end-0 h-full w-full max-w-md bg-cream z-[80] shadow-luxury flex flex-col"
          >
            <div className="flex items-center justify-between p-5 border-b border-black/5">
              <h2 className="font-display text-xl">{t("title")}</h2>
              <button onClick={() => setOpen(false)} className="p-2 hover:text-gold" aria-label={t("close")}>
                <X className="h-5 w-5" />
              </button>
            </div>

            {cartItems.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <ShoppingBag className="h-12 w-12 text-muted mb-4" />
                <p className="text-muted">{t("empty")}</p>
                <p className="text-sm text-muted mt-2">{t("emptyHint")}</p>
                <Button variant="gold" className="mt-6 rounded-full" asChild>
                  <Link href={`/${locale}/products`} onClick={() => setOpen(false)}>{t("continue")}</Link>
                </Button>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                  {cartItems.map((item) => (
                    <div key={`${item.productId}-${item.variantId}`} className="flex gap-4 bg-white rounded-2xl p-3 shadow-soft">
                      <div className="relative w-20 h-24 shrink-0 rounded-xl overflow-hidden bg-neutral-100">
                        <Image src={item.product!.images[0]?.url || ""} alt="" fill className="object-cover" sizes="80px" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium line-clamp-2">{getLocalized(item.product!.name, locale)}</p>
                        <div className="mt-1"><PriceDisplay amount={item.lineTotal} size="sm" /></div>
                        <div className="flex items-center gap-2 mt-2">
                          <button onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)} className="w-7 h-7 rounded-full border flex items-center justify-center hover:border-gold">
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="text-sm tabular-nums w-6 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)} className="w-7 h-7 rounded-full border flex items-center justify-center hover:border-gold">
                            <Plus className="h-3 w-3" />
                          </button>
                          <button onClick={() => removeItem(item.productId, item.variantId)} className="text-xs text-muted ms-auto hover:text-red-500">{t("remove")}</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-5 border-t border-black/5 space-y-4">
                  <div className="flex justify-between items-end">
                    <span className="font-semibold">{t("total")}</span>
                    <PriceDisplay amount={total} size="md" />
                  </div>
                  <Button variant="gold" size="lg" className="w-full rounded-full" asChild>
                    <Link href={`/${locale}/checkout`} onClick={() => setOpen(false)}>{t("checkout")} 🚚</Link>
                  </Button>
                  <p className="text-xs text-center text-muted">{t("codNote")}</p>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
