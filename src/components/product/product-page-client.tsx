"use client";

import type { Product } from "@/types";
import { ProductPageAr } from "@/components/product/product-page-ar";

interface ProductPageClientProps {
  product: Product;
  upsells: Product[];
  crossSells: Product[];
}

export function ProductPageClient({ product }: ProductPageClientProps) {
  return <ProductPageAr product={product} />;
}
