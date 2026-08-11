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
import { notifyAdminNewOrder } from "./admin-notify";
import { aiConfig } from "./config";
import { generateOrderNumber, getShippingCost } from "@/lib/utils";
import { getProductById } from "@/data/products";

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
    eventSourceUrl?: string;
    referrerUrl?: string;
  };
}): Promise<{
  success: boolean;
  blocked?: boolean;
  reason?: string;
  order?: StoredOrder;
  invoiceUrl?: string;
}> {
  const lineItems = input.items.map((item) => {
    const product = getProductById(item.productId);
    const variant = product?.variants.find((v) => v.id === item.variantId) || product?.variants[0];
    if (!product || !variant) throw new Error(`Invalid product ${item.productId}`);
    return {
      sku: variant.sku,
      name: product.name.ar || product.name.fr,
      quantity: item.quantity,
      unitPrice: variant.price,
      lineTotal: variant.price * item.quantity,
      productId: product.id,
    };
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
    createdAt: new Date().toISOString(),
  };

  order = applyFraudToOrder(order, fraud);
  store.orders.push(order);

  await persistOrderToDb(order).catch(() => {
    /* لا تعطّل الطلب إذا فشلت قاعدة البيانات — memory-store يبقى مصدر الحقيقة للوحة التحكم */
  });

  if (order.status === "confirmed" || order.status === "review") {
    const noteParts: string[] = [];
    if (order.isDuplicate) noteParts.push("[DUPLICATE]");
    if (input.notes?.trim()) noteParts.push(input.notes.trim());

    const leadPayload = {
      orderNumber: order.orderNumber,
      customerName: [order.firstName, order.lastName].filter(Boolean).join(" ") || "Client",
      phone: order.phone,
      city: order.city,
      address: order.address,
      notes: noteParts.length ? noteParts.join(" ") : undefined,
      items: order.items.map((item, index, arr) => ({
        sku: item.sku,
        quantity: item.quantity,
        price:
          arr.length === 1
            ? order.total
            : index === 0
              ? item.lineTotal + order.shipping - order.discount
              : item.lineTotal,
      })),
    };

    const sheetsResult = await appendOrderToSheets(leadPayload);
    if (!sheetsResult.ok) {
      console.error("[google-sheets] order saved but sheet sync failed:", sheetsResult.error || sheetsResult.skipped);
    }

    const codplusResult = await sendLeadToCodplus(leadPayload);
    if (!codplusResult.ok) {
      console.error("[codplus] order saved but webhook failed:", codplusResult.error || codplusResult.skipped);
    }
  }

  for (const item of lineItems) {
    decrementStock(item.sku, item.quantity);
  }

  if (input.cartId) markCartRecovered(input.cartId, order.id);

  const invoice = await generateInvoice(order);

  const customerName = [input.firstName, input.lastName].filter(Boolean).join(" ") || "عميل";
  const productsLine = formatOrderProductsForMessage(order.items);
  const confirmationVars = {
    name: customerFirst,
    store: aiConfig.brand.name,
    order: order.orderNumber,
    products: productsLine,
    total: order.total,
    eta: etaLabel,
    payment: paymentLabel,
  };

  await notifyAdminNewOrder(order, customerName).catch(() => {
    /* لا تعطّل الطلب إذا فشل إشعار المسؤول */
  });

  await sendMessage({
    channel: "whatsapp",
    recipient: order.phone,
    templateKey: "order_confirmed",
    variables: confirmationVars,
    locale: "ar",
    relatedType: "order",
    relatedId: order.id,
  });

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
    // Must match browser fbPurchase eventID for Meta deduplication
    eventId: `purchase_${order.orderNumber}`,
    orderId: order.orderNumber,
    value: order.total,
    currency: "MAD",
    // Align with Pixel content_ids (product.id) — catalog consistency
    contentIds: lineItems.map((i) => i.productId),
    phone: order.phone,
    email: order.email,
    firstName: order.firstName,
    lastName: order.lastName,
    city: order.city,
    country: "ma",
    clientIpAddress: input.ip,
    clientUserAgent: input.userAgent,
    fbp: input.meta?.fbp,
    fbc: input.meta?.fbc,
    eventSourceUrl: input.meta?.eventSourceUrl,
    referrerUrl: input.meta?.referrerUrl,
  });

  await sendTikTokEvent({
    event: "CompletePayment",
    value: order.total,
    currency: "MAD",
    contentIds: lineItems.map((i) => i.sku),
  });

  await triggerN8n("order-processed", {
    orderNumber: order.orderNumber,
    total: order.total,
    status: order.status,
    fraudScore: order.fraudScore,
    invoiceUrl: invoice.invoiceUrl,
  });

  await autoReorderProducts();

  return {
    success: true,
    order,
    invoiceUrl: invoice.invoiceUrl,
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
  };
}
