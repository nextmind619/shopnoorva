"use client";

import type { Product } from "@/types";
import { ProductPageAr } from "@/components/product/product-page-ar";

interface ProductPageClientProps {
  product: Product;
  upsells: Product[];
  crossSells: Product[];
}

export function ProductPageClient({ product, upsells, crossSells }: ProductPageClientProps) {
  const related = [...upsells, ...crossSells];
  return <ProductPageAr product={product} related={related.length > 0 ? related : undefined} />;
}
