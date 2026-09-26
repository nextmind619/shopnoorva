import { getProductById } from "@/data/products";
import { physicalUnitsForProduct } from "@/lib/catalog/pack-sku";
import type { StoredOrder } from "@/lib/ai/memory-store";

export type CodplusLeadLine = { sku: string; quantity: number; price: number };

type LineItem = {
  sku: string;
  quantity: number;
  lineTotal: number;
  productId: string;
};

/**
 * Map shop line items (+ bundled gifts) to Codplus lead rows.
 * When a product gift defines `codplusPackSku`, send one pack line instead of product + gift SKUs.
 */
export function buildCodplusLeadItems(
  order: StoredOrder,
  lineItems: LineItem[]
): CodplusLeadLine[] {
  const giftSkusInPack = new Set<string>();

  for (const item of lineItems) {
    const gift = getProductById(item.productId)?.gift;
    if (gift?.enabled && gift.codplusPackSku && gift.giftSku) {
      giftSkusInPack.add(gift.giftSku);
    }
  }

  const hasSeparateGiftLines = order.gifts?.some(
    (gift) => gift.giftSku && !giftSkusInPack.has(gift.giftSku)
  );

  const productLines = lineItems.map((item, index) => {
    const gift = getProductById(item.productId)?.gift;
    const packSku = gift?.enabled ? gift.codplusPackSku : undefined;
    const sku = packSku || item.sku;
    const quantity = physicalUnitsForProduct(item.productId, item.sku, item.quantity);

    const price =
      lineItems.length === 1 && !hasSeparateGiftLines
        ? order.total
        : index === 0
          ? item.lineTotal + order.shipping - order.discount
          : item.lineTotal;

    return { sku, quantity, price };
  });

  const giftLines =
    order.gifts
      ?.filter((gift) => gift.giftSku && !giftSkusInPack.has(gift.giftSku))
      .map((gift) => ({
        sku: gift.giftSku!,
        quantity: gift.quantity,
        price: 0,
      })) ?? [];

  return [...productLines, ...giftLines];
}
