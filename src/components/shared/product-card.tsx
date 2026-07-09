"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale } from "next-intl";
import { motion } from "motion/react";
import { Star, ShoppingBag } from "lucide-react";
import type { Product } from "@/types";
import type { Locale } from "@/types";
import { getLocalized, formatPrice, calculateDiscount, cn } from "@/lib/utils";
import { useCartStore } from "@/lib/store/cart-store";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
  className?: string;
}

export function ProductCard({ product, priority = false, className }: ProductCardProps) {
  const locale = useLocale() as Locale;
  const addItem = useCartStore((s) => s.addItem);
  const defaultVariant = product.variants[0];
  const discount = calculateDiscount(defaultVariant.price, defaultVariant.compareAtPrice);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: product.id,
      variantId: defaultVariant.id,
      quantity: 1,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      className={cn("group product-card-hover", className)}
    >
      <Link href={`/${locale}/products/${product.slug}`}>
        <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100">
          <Image
            src={product.images[0]?.url || ""}
            alt={getLocalized(product.images[0]?.alt || product.name, locale)}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            priority={priority}
          />
          {discount > 0 && (
            <span className="absolute top-3 start-3 bg-gold text-black text-xs font-semibold px-2.5 py-1">
              -{discount}%
            </span>
          )}
          {product.isTikTokViral && (
            <span className="absolute top-3 end-3 bg-black/80 text-white text-[10px] font-medium px-2 py-1 tracking-wider">
              TIKTOK
            </span>
          )}
          <button
            onClick={handleAddToCart}
            className="absolute bottom-3 end-3 bg-white p-2.5 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-gold hover:text-black shadow-lg"
            aria-label="Add to cart"
          >
            <ShoppingBag className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 space-y-1">
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-gold text-gold" />
            <span className="text-xs text-neutral-500">{product.rating} ({product.reviewCount})</span>
          </div>
          <h3 className="text-sm font-medium line-clamp-2 group-hover:text-gold transition-colors">
            {getLocalized(product.name, locale)}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">{formatPrice(defaultVariant.price, locale)}</span>
            {defaultVariant.compareAtPrice && (
              <span className="text-xs text-neutral-400 line-through">
                {formatPrice(defaultVariant.compareAtPrice, locale)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export function SectionHeader({
  title,
  subtitle,
  href,
  linkText,
}: {
  title: string;
  subtitle?: string;
  href?: string;
  linkText?: string;
}) {
  return (
    <div className="flex items-end justify-between mb-10 md:mb-14">
      <div>
        {subtitle && (
          <p className="text-gold text-xs tracking-[0.3em] uppercase mb-2">{subtitle}</p>
        )}
        <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-light tracking-tight">{title}</h2>
      </div>
      {href && linkText && (
        <Link href={href} className="hidden sm:block text-sm tracking-wide uppercase hover:text-gold transition-colors border-b border-black pb-0.5">
          {linkText}
        </Link>
      )}
    </div>
  );
}
