export const PACK_SKU_SUFFIX = "-2PK";
export const PACK_3_SKU_SUFFIX = "-3PK";

/** 1+1 landing pages billed as one line, shipped as two units of the base SKU. */
export const BOGO_PRODUCT_IDS = new Set(["prod-car-mount-1plus1"]);

/** Shop pack variants (e.g. 2-for-299 / 3-for-399) are ordered as a single line item. */
export function isPackVariantSku(sku: string): boolean {
  return sku.endsWith(PACK_SKU_SUFFIX) || sku.endsWith(PACK_3_SKU_SUFFIX);
}

export function baseSkuFromPack(sku: string): string {
  if (sku.endsWith(PACK_3_SKU_SUFFIX)) return sku.slice(0, -PACK_3_SKU_SUFFIX.length);
  if (sku.endsWith(PACK_SKU_SUFFIX)) return sku.slice(0, -PACK_SKU_SUFFIX.length);
  return sku;
}

/** How many physical units one shop line of this SKU represents. */
export function packUnitCount(sku: string): number {
  if (sku.endsWith(PACK_3_SKU_SUFFIX)) return 3;
  if (sku.endsWith(PACK_SKU_SUFFIX)) return 2;
  return 1;
}

export function physicalUnitsForProduct(productId: string, sku: string, quantity: number): number {
  if (BOGO_PRODUCT_IDS.has(productId)) return quantity * 2;
  return quantity * packUnitCount(sku);
}
