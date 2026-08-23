import { baseSkuFromPack, isPackVariantSku, packUnitCount } from "@/lib/catalog/pack-sku";

export type CodplusLineItem = {
  sku: string;
  quantity: number;
  price: number;
};

export type CollapsedCodplusLead = {
  sku: string;
  quantity: number;
  price: number;
  extraNotes: string[];
  products: CodplusLineItem[];
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

  const units = packUnitCount(item.sku);
  return {
    sku: baseSkuFromPack(item.sku),
    // Orchestrator may already send physical units; only expand a 1-pack line.
    quantity: item.quantity < units ? item.quantity * units : item.quantity,
    price: item.price,
  };
}

export function packNoteSuffix(originalSku: string): string | undefined {
  if (!isPackVariantSku(originalSku)) return undefined;
  return `PACK:${originalSku}→${baseSkuFromPack(originalSku)} x${packUnitCount(originalSku)}`;
}

function skuWithQty(item: CodplusLineItem): string {
  return item.quantity > 1 ? `${item.sku} x${item.quantity}` : item.sku;
}

/**
 * Collapse every shop line (main product + upsells) into one Codplus lead / sheet row.
 * Codplus treats each imported row as a separate order, so upsells must not be split.
 */
export function collapseCodplusLeadItems(items: readonly CodplusLineItem[]): CollapsedCodplusLead {
  const products = items.map(toCodplusLineItem);
  const extraNotes = items
    .map((item) => packNoteSuffix(item.sku))
    .filter((note): note is string => Boolean(note));

  if (products.length === 0) {
    return { sku: "", quantity: 0, price: 0, extraNotes, products };
  }

  if (products.length === 1) {
    return {
      sku: products[0].sku,
      quantity: products[0].quantity,
      price: products[0].price,
      extraNotes,
      products,
    };
  }

  const breakdown = products
    .map((item) => `${item.sku} x${item.quantity} (${item.price})`)
    .join(" + ");

  return {
    sku: products.map(skuWithQty).join(" + "),
    quantity: 1,
    price: products.reduce((sum, item) => sum + item.price, 0),
    extraNotes: [...extraNotes, `المنتجات: ${breakdown}`],
    products,
  };
}
