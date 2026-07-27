"use client";

import type { Product } from "@/types";
import { ProductPageAr } from "@/components/product/product-page-ar";
import { ProductPageFr } from "@/components/product/product-page-fr";

interface ProductPageClientProps {
  product: Product;
  upsells: Product[];
  crossSells: Product[];
}

export function ProductPageClient({ product, upsells, crossSells }: ProductPageClientProps) {
  const related = [...upsells, ...crossSells];
  const relatedProp = related.length > 0 ? related : undefined;

  if (product.slug === "shiatsu-neck-shoulder-massager") {
    return <ProductPageFr product={product} related={relatedProp} />;
  }

  return <ProductPageAr product={product} related={relatedProp} />;
}
