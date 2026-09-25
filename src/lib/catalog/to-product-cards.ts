import type { Product } from "@/types";
import type { ProductCardSummary } from "@/types";
import { resolveProductHero } from "@/lib/product-images/resolve";
import {
  getFallbackRelatedCards,
  getProductCardsByIds,
} from "@/data/product-cards";

export function toProductCardSummary(product: Product): ProductCardSummary {
  return {
    id: product.id,
    slug: product.slug,
    nameAr: product.name.ar,
    price: product.price,
    hero: resolveProductHero(product),
  };
}

/** Upsells + cross-sells as lightweight cards (server-side). */
export function buildRelatedProductCards(product: Product, limit = 4): ProductCardSummary[] {
  const ids = [...(product.upsellIds ?? []), ...(product.crossSellIds ?? [])];
  const fromIds = getProductCardsByIds(ids);
  if (fromIds.length > 0) return fromIds.slice(0, limit);
  return getFallbackRelatedCards(product.id, limit);
}
