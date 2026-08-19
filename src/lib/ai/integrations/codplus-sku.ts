import { baseSkuFromPack, isPackVariantSku, packUnitCount } from "@/lib/catalog/pack-sku";

export type CodplusLineItem = {
  sku: string;
  quantity: number;
  price: number;
};

/**
 * Map a shop line item to a Codplus / leads-sheet row.
 *
 * Codplus only knows approved catalog SKUs (e.g. Mag-Holder, Mosquito-protection-tent).
 * Shop 2PK variants are not registered as packs, so we send the base SKU with qty × 2
 * and keep `price` as the COD amount for the row.
 */
export function toCodplusLineItem(item: CodplusLineItem): CodplusLineItem {
  if (!isPackVariantSku(item.sku)) {
    return { sku: item.sku, quantity: item.quantity, price: item.price };
  }

  return {
    sku: baseSkuFromPack(item.sku),
    quantity: item.quantity * packUnitCount(item.sku),
    price: item.price,
  };
}

export function packNoteSuffix(originalSku: string): string | undefined {
  if (!isPackVariantSku(originalSku)) return undefined;
  return `PACK:${originalSku}→${baseSkuFromPack(originalSku)} x${packUnitCount(originalSku)}`;
}
