import type { Locale } from "@/types";
import { getProductById } from "@/data/products";

/** Snapshot stored on the order so fulfillment sees the free gift even if catalog copy changes later. */
export interface OrderGiftRecord {
  giftProductId?: string;
  giftSku?: string;
  codplusPackSku?: string;
  giftTitle: string;
  giftDescription?: string;
  giftImage?: string;
  giftDisclosure: string;
  quantity: number;
  unitPrice: 0;
  stockControlled: boolean;
}

export function resolveOrderGifts(
  items: Array<{ productId: string; quantity: number }>,
  locale: Locale = "ar"
): OrderGiftRecord[] {
  const grouped = new Map<string, OrderGiftRecord>();

  for (const item of items) {
    const gift = getProductById(item.productId)?.gift;
    if (!gift?.enabled) continue;

    const key = gift.giftProductId || gift.giftTitle.ar;
    const quantity = Math.max(1, Math.floor(item.quantity) || 1);
    const existing = grouped.get(key);
    if (existing) {
      existing.quantity += quantity;
      continue;
    }

    grouped.set(key, {
      giftProductId: gift.giftProductId,
      giftSku: gift.giftSku,
      codplusPackSku: gift.codplusPackSku,
      giftTitle: gift.giftTitle[locale] || gift.giftTitle.ar,
      giftDescription: gift.giftDescription?.[locale] || gift.giftDescription?.ar,
      giftImage: gift.giftImage,
      giftDisclosure: gift.giftDisclosure[locale] || gift.giftDisclosure.ar,
      quantity,
      unitPrice: 0,
      stockControlled: Boolean(gift.stockControlled),
    });
  }

  return [...grouped.values()];
}

/** Note appended to Sheets / Codplus so the warehouse packs the gift. */
export function formatGiftFulfillmentNote(gifts: OrderGiftRecord[] | undefined): string | undefined {
  if (!gifts?.length) return undefined;
  return gifts
    .map((gift) => {
      if (gift.codplusPackSku && gift.giftSku) {
        return `هدية CodPlus × ${gift.quantity}: ${gift.giftSku} (${gift.giftTitle} مضمنة) | ${gift.giftDisclosure}`;
      }
      const sku = gift.giftSku ? `SKU ${gift.giftSku} | ` : "";
      const id = !gift.giftSku && gift.giftProductId ? `${gift.giftProductId} | ` : "";
      return `هدية مجانية × ${gift.quantity}: ${sku}${id}${gift.giftTitle} | ${gift.giftDisclosure} | الثمن 0 درهم`;
    })
    .join(" || ");
}
