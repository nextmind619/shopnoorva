"use client";

import type { Product } from "@/types";
import { ProductPageAr } from "@/components/product/product-page-ar";
import { ProductPageVintageLantern } from "@/components/product/product-page-vintage-lantern";
import { ProductPageWarmLedDecorLamp } from "@/components/product/product-page-warm-led-decor-lamp";
import { ProductPageCarMount1Plus1 } from "@/components/product/product-page-car-mount-1plus1";
import { ProductPageSolarCalculator } from "@/components/product/product-page-solar-calculator";

interface ProductPageClientProps {
  product: Product;
  upsells: Product[];
  crossSells: Product[];
}

export function ProductPageClient({ product, upsells, crossSells }: ProductPageClientProps) {
  const related = [...upsells, ...crossSells];
  const relatedProp = related.length > 0 ? related : undefined;

  if (product.slug === "vintage-led-lantern") {
    return <ProductPageVintageLantern product={product} related={relatedProp} />;
  }

  if (product.slug === "warm-led-decor-lamp") {
    return <ProductPageWarmLedDecorLamp product={product} related={relatedProp} />;
  }

  if (product.slug === "magnetic-car-phone-holder-1-plus-1") {
    return <ProductPageCarMount1Plus1 product={product} />;
  }

  if (product.slug === "solar-calculator-lcd-notepad") {
    return <ProductPageSolarCalculator product={product} />;
  }

  return <ProductPageAr product={product} related={relatedProp} />;
}
