import type { Product } from "@/types";
import { getProductCroContent } from "@/lib/product-cro-content";

/** Server-friendly headline for above-the-fold copy (avoids shipping full CRO map to the client). */
export function getProductBenefitHeadline(product: Product): { title: string; subtitle: string } {
  const cro = getProductCroContent(product.slug);
  if (cro?.headline) return cro.headline;
  if (product.problemSolution) {
    return { title: product.problemSolution.ar, subtitle: product.shortDescription.ar };
  }
  return { title: product.name.ar, subtitle: product.shortDescription.ar };
}
