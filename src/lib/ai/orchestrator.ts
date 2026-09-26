import { store, uid, type StoredOrder } from "./memory-store";
import { analyzeOrderFraud, applyFraudToOrder } from "./fraud";
import { generateInvoice } from "./invoices";
import { formatOrderProductsForMessage, sendMessage } from "./messaging";
import { decrementStock, autoReorderProducts } from "./inventory";
import { processAbandonedCarts, markCartRecovered } from "./cart-recovery";
import { generateDailyAnalytics, generateMonthlyAnalytics } from "./analytics";
import { appendOrderToSheets } from "./integrations/google-sheets";
import { sendLeadToCodplus } from "./integrations/codplus";
import { sendMetaConversion } from "./integrations/meta";
import { sendTikTokEvent } from "./integrations/tiktok";
import { triggerN8n } from "./integrations/n8n";
import { persistOrderToDb } from "./integrations/db-orders";
import { getIntegrationLogs } from "./integrations/logger";
import { notifyAdminNewOrder } from "./admin-notify";
import { aiConfig, isCustomerWhatsAppEnabled } from "./config";
import { generateOrderNumber, getShippingCost } from "@/lib/utils";
import { getProductById } from "@/data/products";
import { physicalUnitsForProduct } from "@/lib/catalog/pack-sku";
import { formatGiftFulfillmentNote, resolveOrderGifts } from "@/lib/catalog/product-gift";
import {
  getCarMountUpsellPrice,
  isEligibleCarMountUpsellProduct,
  orderHasCarMountUpsellHost,
  resolveCarMountUpsellQuantity,
  resolveCarMountUpsellUnitPrice,
} from "@/lib/catalog/car-mount-upsell";

type LeadPayload = {
  orderNumber: string;
  customerName: string;
  phone: string;
  city: string;
  address: string;
  notes?: string;
  items: Array<{ sku: string; quantity: number; price: number }>;
};

type LineItem = {
  sku: string;
  name: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  productId: string;
};

export type OrderSideEffectsContext = {
  order: StoredOrder;
  locale: string;
  confirmationVars: Record<string, string | number>;
  lineItems: LineItem[];
  ip?: string;
  userAgent?: string;
  meta?: {
    fbp?: string;
    fbc?: string;
    ttclid?: string;
    eventSourceUrl?: string;
    referrerUrl?: string;
  };
};

function buildLeadPayload(
  order: StoredOrder,
  lineItems: LineItem[],
  notes?: string
): LeadPayload {
  const noteParts: string[] = [];
  if (order.isDuplicate) noteParts.push("[DUPLICATE]");
  if (notes?.trim()) noteParts.push(notes.trim());
  const giftNote = formatGiftFulfillmentNote(order.gifts);
  if (giftNote && !noteParts.some((part) => part.includes("هدية مجانية"))) {
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
    items: lineItems.map((item, index, arr) => ({
      sku: item.sku,
      quantity: physicalUnitsForProduct(item.productId, item.sku, item.quantity),
      price:
        arr.length === 1
          ? order.total
          : index === 0
            ? item.lineTotal + order.shipping - order.discount
            : item.lineTotal,
    })),
  };
}

/** Sheets + WhatsApp + Codplus in parallel — never block one on the other. */
export async function dispatchOrderFulfillment(
  order: StoredOrder,
  leadPayload: LeadPayload | null,
  customerName: string,
  confirmationVars: Record<string, string | number>
): Promise<NonNullable<StoredOrder["fulfillment"]>> {
  const fulfillment: NonNullable<StoredOrder["fulfillment"]> = {};

  const tasks: Array<Promise<unknown>> = [];

  if (leadPayload && (order.status === "confirmed" || order.status === "review")) {
    tasks.push(
      appendOrderToSheets(leadPayload).then((sheetsResult) => {
        fulfillment.sheets = sheetsResult;
        if (!sheetsResult.ok) {
          console.error(
            "[google-sheets] order saved but sheet sync failed:",
            sheetsResult.error || sheetsResult.skipped
          );
        }
      })
    );
    tasks.push(
      sendLeadToCodplus(leadPayload).then((codplusResult) => {
        fulfillment.codplus = codplusResult;
        if (!codplusResult.ok) {
          console.error(
            "[codplus] order saved but webhook failed:",
            codplusResult.error || codplusResult.skipped
          );
        }
      })
    );
  }

  tasks.push(
    notifyAdminNewOrder(order, customerName)
      .then(() => {
        fulfillment.whatsappAdmin = { ok: true };
      })
      .catch((error) => {
        const message = error instanceof Error ? error.message : String(error);
        fulfillment.whatsappAdmin = { ok: false, error: message };
        console.error("[whatsapp] admin notify failed:", message);
      })
  );
  if (isCustomerWhatsAppEnabled()) {
    tasks.push(
      sendMessage({
        channel: "whatsapp",
        recipient: order.phone,
        templateKey: "order_confirmed",
        variables: confirmationVars,
        locale: "ar",
        relatedType: "order",
        relatedId: order.id,
      }).then((record) => {
        fulfillment.whatsappCustomer = {
          ok: record.status === "sent",
          error: record.error,
        };
        if (record.status === "failed") {
          console.error("[whatsapp] customer confirm failed:", record.error);
        }
      })
    );
  } else {
    fulfillment.whatsappCustomer = { ok: true, error: "disabled" };
  }

  await Promise.allSettled(tasks);
  order.fulfillment = fulfillment;
  return fulfillment;
}

export async function runOrderSideEffects(ctx: OrderSideEffectsContext): Promise<void> {
  const { order, locale, confirmationVars, lineItems } = ctx;

  try {
    const invoice = await generateInvoice(order);
    order.invoiceUrl = invoice.invoiceUrl;

    if (order.email) {
      await sendMessage({
        channel: "email",
        recipient: order.email,
        templateKey: "order_confirmed",
        subject: locale === "ar" ? `تأكيد الطلب ${order.orderNumber}` : `Commande ${order.orderNumber} confirmée`,
        variables: confirmationVars,
        locale,
        generateWithAi: true,
        intent: "order confirmation email with invoice link",
      });
    }

    await sendMessage({
      channel: "sms",
      recipient: order.phone,
      templateKey: "order_confirmed",
      variables: confirmationVars,
      locale: "ar",
    });

    await sendMetaConversion({
      eventName: "Purchase",
      eventId: `purchase_${order.orderNumber}`,
      orderId: order.orderNumber,
      value: order.total,
      currency: "MAD",
      contentIds: lineItems.map((i) => i.productId),
      phone: order.phone,
      email: order.email,
      firstName: order.firstName,
      lastName: order.lastName,
      city: order.city,
      country: "ma",
      clientIpAddress: ctx.ip,
      clientUserAgent: ctx.userAgent,
      fbp: ctx.meta?.fbp,
      fbc: ctx.meta?.fbc,
      eventSourceUrl: ctx.meta?.eventSourceUrl,
      referrerUrl: ctx.meta?.referrerUrl,
    });

    await sendTikTokEvent({
      event: "CompletePayment",
      eventId: `purchase_${order.orderNumber}`,
      orderId: order.orderNumber,
      value: order.total,
      currency: "MAD",
      contentIds: lineItems.map((i) => i.productId),
      clientIpAddress: ctx.ip,
      clientUserAgent: ctx.userAgent,
      eventSourceUrl: ctx.meta?.eventSourceUrl,
      ttclid: ctx.meta?.ttclid,
    });

    await triggerN8n("order-processed", {
      orderNumber: order.orderNumber,
      total: order.total,
      status: order.status,
      fraudScore: order.fraudScore,
      invoiceUrl: invoice.invoiceUrl,
    });

    await autoReorderProducts();
  } catch (error) {
    console.error("[order] side effects failed:", error instanceof Error ? error.message : error);
  }
}

export async function processIncomingOrder(input: {
  phone: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  city: string;
  address: string;
  notes?: string;
  paymentMethod?: string;
  items: Array<{ productId: string; variantId: string; quantity: number }>;
  discount?: number;
  cartId?: string;
  locale?: string;
  /** Anti-fraud context from checkout */
  ip?: string;
  userAgent?: string;
  acceptLanguage?: string;
  honeypot?: string;
  formFillMs?: number;
  device?: import("@/lib/fraud").DeviceSignals;
  headers?: Record<string, string | null | undefined>;
  /** Meta Pixel cookies + URLs for CAPI Event Match Quality */
  meta?: {
    fbp?: string;
    fbc?: string;
    ttclid?: string;
    gclid?: string;
    eventSourceUrl?: string;
    referrerUrl?: string;
    attribution?: {
      utm_source?: string;
      utm_medium?: string;
      utm_campaign?: string;
      utm_content?: string;
      utm_term?: string;
      gclid?: string;
      landingPath?: string;
      capturedAt?: string;
    };
  };
}): Promise<{
  success: boolean;
  blocked?: boolean;
  reason?: string;
  order?: StoredOrder;
  invoiceUrl?: string;
  sideEffects?: OrderSideEffectsContext;
  fulfillment?: StoredOrder["fulfillment"];
}> {
  const orderProductIds = input.items.map((item) => item.productId);
  const seenUpsellIds = new Set<string>();
  const lineItems = input.items.flatMap((item) => {
    const product = getProductById(item.productId);
    const variant = product?.variants.find((v) => v.id === item.variantId) || product?.variants[0];
    if (!product || !variant) throw new Error(`Invalid product ${item.productId}`);
    if (isEligibleCarMountUpsellProduct(product.id) && orderHasCarMountUpsellHost(orderProductIds)) {
      if (seenUpsellIds.has(product.id)) return [];
      seenUpsellIds.add(product.id);
    }
    const quantity = resolveCarMountUpsellQuantity(product.id, item.quantity, orderProductIds);
    const unitPrice = resolveCarMountUpsellUnitPrice(product.id, variant.price, orderProductIds);
    return [
      {
        sku: variant.sku,
        name: product.name.ar || product.name.fr,
        quantity,
        unitPrice,
        lineTotal: unitPrice * quantity,
        productId: product.id,
      },
    ];
  });

  const locale = input.locale || "ar";
  const paymentLabel =
    locale === "ar" ? "الدفع عند الاستلام" : locale === "en" ? "Cash on delivery" : "Paiement à la livraison";
  const etaLabel = locale === "ar" ? "24-48 ساعة" : "24-48h";
  const customerFirst = input.firstName || (locale === "ar" ? "عميل" : "Client");

  const subtotal = lineItems.reduce((s, i) => s + i.lineTotal, 0);
  const shipping = getShippingCost(input.city, subtotal);
  const discount = input.discount || 0;
  const total = Math.max(0, subtotal + shipping - discount);
  const gifts = resolveOrderGifts(
    lineItems.map((item) => ({ productId: item.productId, quantity: item.quantity })),
    locale === "en" ? "en" : locale === "fr" ? "fr" : "ar"
  );

  const fullName = [input.firstName, input.lastName].filter(Boolean).join(" ").trim();

  const fraud = await analyzeOrderFraud({
    phone: input.phone,
    email: input.email,
    city: input.city,
    address: input.address,
    fullName,
    total,
    items: lineItems.map((i) => ({ sku: i.sku, quantity: i.quantity, name: i.name })),
    ip: input.ip,
    userAgent: input.userAgent,
    acceptLanguage: input.acceptLanguage,
    honeypot: input.honeypot,
    formFillMs: input.formFillMs,
    device: input.device,
    headers: input.headers,
  });

  if (fraud.decision === "block") {
    await triggerN8n("fraud-blocked", { fraud, phone: input.phone, total });
    return { success: false, blocked: true, reason: fraud.reason };
  }

  let order: StoredOrder = {
    id: uid("ord"),
    orderNumber: generateOrderNumber(),
    firstName: input.firstName,
    lastName: input.lastName,
    phone: fraud.phoneNormalized || input.phone,
    email: input.email,
    city: input.city,
    address: input.address,
    items: lineItems.map(({ sku, name, quantity, unitPrice, lineTotal }) => ({
      sku,
      name,
      quantity,
      unitPrice,
      lineTotal,
    })),
    subtotal,
    shipping,
    discount,
    total,
    paymentMethod: input.paymentMethod || "cod",
    status: fraud.decision === "review" ? "review" : "confirmed",
    fraudScore: 0,
    fraudFlags: [],
    isDuplicate: false,
    gifts: gifts.length ? gifts : undefined,
    attribution: input.meta?.attribution
      ? {
          ...input.meta.attribution,
          gclid: input.meta.attribution.gclid || input.meta.gclid,
        }
      : input.meta?.gclid
        ? { gclid: input.meta.gclid }
        : undefined,
    createdAt: new Date().toISOString(),
  };

  order = applyFraudToOrder(order, fraud);
  store.orders.push(order);

  const customerName = [input.firstName, input.lastName].filter(Boolean).join(" ") || "عميل";
  const productsLine = formatOrderProductsForMessage(order.items);
  const giftLine = gifts.length
    ? `\n🎁 ${gifts.map((gift) => `${gift.giftTitle} × ${gift.quantity} (مجاني)`).join(" | ")}`
    : "";
  const confirmationVars = {
    name: customerFirst,
    store: aiConfig.brand.name,
    order: order.orderNumber,
    products: `${productsLine}${giftLine}`,
    total: order.total,
    eta: etaLabel,
    payment: paymentLabel,
  };

  const leadPayload =
    order.status === "confirmed" || order.status === "review"
      ? buildLeadPayload(order, lineItems, input.notes)
      : null;

  // Sheets + WhatsApp must not wait on Postgres / MinIO / pixels.
  await Promise.allSettled([
    persistOrderToDb(order).catch(() => {
      /* memory-store remains the admin fallback */
    }),
    dispatchOrderFulfillment(order, leadPayload, customerName, confirmationVars),
  ]);

  for (const item of lineItems) {
    decrementStock(item.sku, item.quantity);
  }

  if (input.cartId) markCartRecovered(input.cartId, order.id);

  const sideEffects: OrderSideEffectsContext = {
    order,
    locale,
    confirmationVars,
    lineItems,
    ip: input.ip,
    userAgent: input.userAgent,
    meta: input.meta,
  };

  return {
    success: true,
    order,
    invoiceUrl: order.invoiceUrl,
    sideEffects,
    fulfillment: order.fulfillment,
  };
}

export async function runAutomationTick(): Promise<Record<string, unknown>> {
  const recovery = await processAbandonedCarts();
  const reorders = await autoReorderProducts();
  const daily = await generateDailyAnalytics();

  return {
    at: new Date().toISOString(),
    recovery,
    reorders: {
      alerts: reorders.alerts.length,
      purchaseOrders: reorders.purchaseOrders.length,
    },
    daily: {
      day: daily.analytics.day,
      revenue: daily.analytics.revenue,
      reportUrl: daily.reportUrl,
    },
  };
}

export async function runMonthlyAutomation(): Promise<Record<string, unknown>> {
  const monthly = await generateMonthlyAnalytics();
  return monthly;
}

export function getAiDashboard() {
  return {
    orders: store.orders.slice(-20).reverse(),
    carts: store.carts.slice(-20).reverse(),
    notifications: store.notifications.slice(-30).reverse(),
    conversations: store.conversations.slice(-10).reverse(),
    stockAlerts: store.stockAlerts.slice(-20).reverse(),
    purchaseOrders: store.purchaseOrders.slice(-20).reverse(),
    daily: store.daily.slice(-14),
    inventory: store.inventory,
    integrations: getIntegrationLogs(30),
  };
}
