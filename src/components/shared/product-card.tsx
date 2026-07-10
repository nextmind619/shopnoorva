"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale } from "next-intl";
import { motion } from "motion/react";
import { Star, ArrowLeft } from "lucide-react";
import type { Product, Locale } from "@/types";
import { getLocalized, calculateDiscount, cn } from "@/lib/utils";
import { PriceDisplay } from "@/components/shared/price-display";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
  className?: string;
}

export function ProductCard({ product, priority = false, className }: ProductCardProps) {
  const locale = useLocale() as Locale;
  const defaultVariant = product.variants[0];
  const discount = calculateDiscount(defaultVariant.price, defaultVariant.compareAtPrice);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={cn("group", className)}
    >
      <Link href={`/${locale}/products/${product.slug}`}>
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-neutral-100 shadow-soft">
          <Image
            src={product.images[0]?.url || ""}
            alt={getLocalized(product.images[0]?.alt || product.name, locale)}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            priority={priority}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-noir/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          {discount > 0 && (
            <span className="absolute top-4 start-4 bg-gold text-noir text-xs font-semibold px-3 py-1 rounded-full">-{discount}%</span>
          )}
          {product.isTikTokViral && (
            <span className="absolute top-4 end-4 glass-dark text-cream text-[10px] font-medium px-2.5 py-1 rounded-full tracking-wider">تيك توك</span>
          )}
          <span
            className="absolute bottom-4 end-4 glass p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:bg-gold shadow-luxury"
            aria-hidden
          >
            <ArrowLeft className="h-4 w-4" />
          </span>
        </div>

        <div className="mt-5 space-y-2">
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-gold text-gold" />
            <span className="text-xs text-muted">{product.rating} ({product.reviewCount})</span>
          </div>
          <h3 className="text-base font-semibold line-clamp-2 group-hover:text-gold transition-colors duration-300">
            {getLocalized(product.name, locale)}
          </h3>
          <PriceDisplay amount={defaultVariant.price} compareAt={defaultVariant.compareAtPrice} size="sm" />
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
