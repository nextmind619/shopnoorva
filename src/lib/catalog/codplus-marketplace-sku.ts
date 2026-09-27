import { getProductById } from "@/data/products";

const INTERNAL_SKU_PREFIX = /^NRV-/i;

/**
 * SKU sent to CodPlus / Google Sheets must match Marketplace → SKU exactly
 * (e.g. FoldableWasher, ShowerFilter, LaptopTable - Adjustable).
 */
export function resolveCodplusMarketplaceSku(productId: string, lineSku: string): string {
  const trimmed = lineSku.trim();
  const product = getProductById(productId);
  if (!product) return trimmed;

  const catalogSku = product.sku?.trim();
  if (catalogSku && !INTERNAL_SKU_PREFIX.test(catalogSku)) {
    return catalogSku;
  }

  const variant = product.variants.find((v) => v.sku.trim() === trimmed);
  const variantSku = variant?.sku.trim();
  if (variantSku && !INTERNAL_SKU_PREFIX.test(variantSku)) {
    return variantSku;
  }

  return trimmed;
}

export function normalizeCodplusSku(sku: string): string {
  return sku.trim();
}
