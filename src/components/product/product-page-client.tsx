"use client";

import type { Product } from "@/types";
import { ProductPageAr } from "@/components/product/product-page-ar";
import { ProductPageVintageLantern } from "@/components/product/product-page-vintage-lantern";

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

  return <ProductPageAr product={product} related={relatedProp} />;
}
