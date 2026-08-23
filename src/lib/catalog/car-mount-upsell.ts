import type { Product } from "@/types";
import { getProductById } from "@/data/products";

/** Default offer price used only as a line add-on on the two car-mount PDPs. Catalog prices stay unchanged. */
export const CAR_MOUNT_UPSELL_PRICE = 99;

/** Per-SKU upsell prices. Anything not listed uses CAR_MOUNT_UPSELL_PRICE. */
const CAR_MOUNT_UPSELL_PRICE_BY_ID: Record<string, number> = {
  "prod-car-fan-sunshade": 149,
};

export function getCarMountUpsellPrice(productId: string): number {
  return CAR_MOUNT_UPSELL_PRICE_BY_ID[productId] ?? CAR_MOUNT_UPSELL_PRICE;
}

/** Product pages that may attach the 99 DH car-accessory offer. */
export const CAR_MOUNT_UPSELL_HOST_IDS = new Set(["prod-car-mount", "prod-car-mount-1plus1"]);

export const CAR_MOUNT_UPSELL_HOST_SLUGS = new Set([
  "magnetic-car-phone-mount-maidsail",
  "magnetic-car-phone-holder-1-plus-1",
]);

/**
 * Real catalog car accessories only — ranked for use with a magnetic phone mount.
 * Excludes the host SKUs and the duplicate 199 DH mount landing page.
 */
export const CAR_MOUNT_UPSELL_PRODUCT_IDS = [
  "prod-heli-freshener",
  "prod-sunshade",
  "prod-car-fan-sunshade",
] as const;

const UPSELL_ID_SET = new Set<string>(CAR_MOUNT_UPSELL_PRODUCT_IDS);

export function isCarMountUpsellHostSlug(slug: string): boolean {
  return CAR_MOUNT_UPSELL_HOST_SLUGS.has(slug);
}

export function isCarMountUpsellHostId(productId: string): boolean {
  return CAR_MOUNT_UPSELL_HOST_IDS.has(productId);
}

export function isEligibleCarMountUpsellProduct(productId: string): boolean {
  return UPSELL_ID_SET.has(productId);
}

export function orderHasCarMountUpsellHost(productIds: readonly string[]): boolean {
  return productIds.some((id) => isCarMountUpsellHostId(id));
}

/**
 * Server-side unit price. The upsell offer applies only when a host car-mount is on the same order
 * and the line is an allowlisted catalog car accessory. Direct purchases keep catalog price.
 */
export function resolveCarMountUpsellUnitPrice(
  productId: string,
  catalogPrice: number,
  orderProductIds: readonly string[],
): number {
  if (!orderHasCarMountUpsellHost(orderProductIds)) return catalogPrice;
  if (!isEligibleCarMountUpsellProduct(productId)) return catalogPrice;
  if (isCarMountUpsellHostId(productId)) return catalogPrice;
  return getCarMountUpsellPrice(productId);
}

/** One unit per upsell SKU — prevents quantity abuse of the 99 DH offer. */
export function resolveCarMountUpsellQuantity(
  productId: string,
  quantity: number,
  orderProductIds: readonly string[],
): number {
  if (
    orderHasCarMountUpsellHost(orderProductIds) &&
    isEligibleCarMountUpsellProduct(productId)
  ) {
    return 1;
  }
  return quantity;
}

export function getCarMountUpsellProducts(): Product[] {
  return CAR_MOUNT_UPSELL_PRODUCT_IDS.map((id) => getProductById(id)).filter(
    (product): product is Product => Boolean(product),
  );
}

export function carMountUpsellOrderNote(selectedIds: readonly string[]): string | undefined {
  const names = selectedIds
    .map((id) => getProductById(id))
    .filter((product): product is Product => Boolean(product))
    .map((product) => `${product.name.ar} (${getCarMountUpsellPrice(product.id)} درهم)`);
  if (names.length === 0) return undefined;
  return `عرض Upsell: ${names.join(" + ")}`;
}
