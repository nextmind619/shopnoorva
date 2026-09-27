import { products } from "@/data/products";
import type { StoredOrder } from "@/lib/ai/memory-store";
import { buildCodplusLeadItems } from "@/lib/catalog/codplus-lead-items";
import { formatGiftFulfillmentNote } from "@/lib/catalog/product-gift";
import {
  getCarMountUpsellPrice,
  isEligibleCarMountUpsellProduct,
} from "@/lib/catalog/car-mount-upsell";

export type LeadPayload = {
  orderNumber: string;
  customerName: string;
  phone: string;
  city: string;
  address: string;
  notes?: string;
  items: Array<{ sku: string; quantity: number; price: number }>;
};

export type FulfillmentLineItem = {
  sku: string;
  name: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  productId: string;
};

export function resolveProductIdBySku(sku: string): string | undefined {
  for (const product of products) {
    if (product.sku === sku) return product.id;
    if (product.variants.some((variant) => variant.sku === sku)) return product.id;
  }
  return undefined;
}

export function lineItemsFromStoredOrder(order: StoredOrder): FulfillmentLineItem[] {
  return order.items.map((item) => ({
    ...item,
    productId: resolveProductIdBySku(item.sku) ?? "",
  }));
}

/** Codplus + Google Sheets payload (pack SKU = one line when `codplusPackSku` is set). */
export function buildLeadPayloadFromOrder(
  order: StoredOrder,
  lineItems: FulfillmentLineItem[],
  notes?: string
): LeadPayload {
  const noteParts: string[] = [];
  if (order.isDuplicate) noteParts.push("[DUPLICATE]");
  if (notes?.trim()) noteParts.push(notes.trim());
  const giftNote = formatGiftFulfillmentNote(order.gifts);
  if (
    giftNote &&
    !noteParts.some(
      (part) =>
        part.includes("هدية مجانية") ||
        part.includes("CodPlus SKU") ||
        part.includes("بك CodPlus")
    )
  ) {
    noteParts.push(giftNote);
  }
  const upsellLines = lineItems.filter(
    (item) =>
      isEligibleCarMountUpsellProduct(item.productId) &&
      item.unitPrice === getCarMountUpsellPrice(item.productId)
  );
  if (upsellLines.length > 0 && !notes?.includes("عرض Upsell")) {
    noteParts.push(
      `عرض Upsell: ${upsellLines.map((item) => `${item.name} (${item.unitPrice} درهم)`).join(" + ")}`
    );
  }

  return {
    orderNumber: order.orderNumber,
    customerName: [order.firstName, order.lastName].filter(Boolean).join(" ") || "Client",
    phone: order.phone,
    city: order.city,
    address: order.address,
    notes: noteParts.length ? noteParts.join(" ") : undefined,
    items: buildCodplusLeadItems(order, lineItems),
  };
}

export function buildLeadPayloadFromStoredOrder(order: StoredOrder, notes?: string): LeadPayload {
  return buildLeadPayloadFromOrder(order, lineItemsFromStoredOrder(order), notes);
}
