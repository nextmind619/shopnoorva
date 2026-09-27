import { getProductById } from "@/data/products";
import { normalizeCodplusSku, resolveCodplusMarketplaceSku } from "@/lib/catalog/codplus-marketplace-sku";
import { physicalUnitsForProduct } from "@/lib/catalog/pack-sku";
import type { StoredOrder } from "@/lib/ai/memory-store";

export type CodplusLeadLine = { sku: string; quantity: number; price: number };

type LineItem = {
  sku: string;
  quantity: number;
  lineTotal: number;
  productId: string;
};

/** When true, use seller pack names + gift SKU lines (requires packs approved in CodPlus). */
export function codplusPackSkusEnabled(): boolean {
  return process.env.CODPLUS_USE_PACK_SKUS === "true";
}

/**
 * Map shop line items to Codplus / Google Sheets lead rows.
 *
 * Default: one approved marketplace SKU per order (main product, COD total in `price`).
 * Gift SKUs and pack names go in order notes — CodPlus sheet import rejects unknown
 * packs and combined SKU strings like "FoldableWasher + ShowerFilter".
 */
export function buildCodplusLeadItems(
  order: StoredOrder,
  lineItems: LineItem[]
): CodplusLeadLine[] {
  const usePackSkus = codplusPackSkusEnabled();
  const giftSkusInPack = new Set<string>();

  if (usePackSkus) {
    for (const item of lineItems) {
      const gift = getProductById(item.productId)?.gift;
      if (gift?.enabled && gift.codplusPackSku && gift.giftSku) {
        giftSkusInPack.add(gift.giftSku);
      }
    }
  }

  const hasSeparateGiftLines =
    usePackSkus &&
    order.gifts?.some((gift) => gift.giftSku && !giftSkusInPack.has(gift.giftSku));

  const productLines = lineItems.map((item, index) => {
    const gift = getProductById(item.productId)?.gift;
    const packSku = usePackSkus && gift?.enabled ? gift.codplusPackSku : undefined;
    const sku = normalizeCodplusSku(
      packSku || resolveCodplusMarketplaceSku(item.productId, item.sku)
    );
    const quantity = physicalUnitsForProduct(item.productId, item.sku, item.quantity);

    const price =
      lineItems.length === 1 && !hasSeparateGiftLines
        ? order.total
        : index === 0
          ? item.lineTotal + order.shipping - order.discount
          : item.lineTotal;

    return { sku, quantity, price };
  });

  if (!usePackSkus) {
    return productLines;
  }

  const giftLines =
    order.gifts
      ?.filter((gift) => gift.giftSku && !giftSkusInPack.has(gift.giftSku))
      .map((gift) => ({
        sku: normalizeCodplusSku(gift.giftSku!),
        quantity: gift.quantity,
        price: 0,
      })) ?? [];

  return [...productLines, ...giftLines];
}
