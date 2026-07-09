"use client";

import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { motion, AnimatePresence } from "motion/react";
import { ShoppingBag } from "lucide-react";
import type { Product, Locale, ProductVariant } from "@/types";
import { getLocalized } from "@/lib/utils";
import { PriceDisplay } from "@/components/shared/price-display";
import { Button } from "@/components/ui/button";

interface ProductStickyBarProps {
  product: Product;
  variant: ProductVariant;
  visible: boolean;
  onAddToCart: () => void;
}

export function ProductStickyBar({ product, variant, visible, onAddToCart }: ProductStickyBarProps) {
  const t = useTranslations("sections");
  const locale = useLocale() as Locale;
  const checkoutUrl = `/${locale}/checkout?product=${product.id}&variant=${variant.id}&qty=1`;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          transition={{ type: "spring", stiffness: 380, damping: 32 }}
          className="fixed bottom-0 inset-x-0 z-50 lg:hidden glass border-t border-black/5 shadow-luxury safe-area-pb"
        >
          <div className="flex items-center gap-3 p-4 max-w-lg mx-auto">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate text-muted">{getLocalized(product.name, locale)}</p>
              <PriceDisplay amount={variant.price} compareAt={variant.compareAtPrice} size="sm" />
            </div>
            <Button variant="outline" size="sm" className="rounded-full shrink-0" onClick={onAddToCart}>
              <ShoppingBag className="h-4 w-4" />
            </Button>
            <Button variant="gold" size="sm" className="rounded-full shrink-0 px-5" asChild>
              <Link href={checkoutUrl}>{t("buyNow")}</Link>
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
