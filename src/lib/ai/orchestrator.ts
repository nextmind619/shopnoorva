import { store, uid, type StoredOrder } from "./memory-store";
import { analyzeOrderFraud, applyFraudToOrder } from "./fraud";
import { generateInvoice } from "./invoices";
import { sendMessage } from "./messaging";
import { suggestUpsells } from "./support";
import { createShipment } from "./shipments";
import { decrementStock, autoReorderProducts } from "./inventory";
import { processAbandonedCarts, markCartRecovered } from "./cart-recovery";
import { generateDailyAnalytics, generateMonthlyAnalytics } from "./analytics";
import { appendOrderToSheets } from "./integrations/google-sheets";
import { sendMetaConversion } from "./integrations/meta";
import { sendTikTokEvent } from "./integrations/tiktok";
import { triggerN8n } from "./integrations/n8n";
import { persistOrderToDb } from "./integrations/db-orders";
import { notifyAdminNewOrder } from "./admin-notify";
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
}): Promise<{
  success: boolean;
  blocked?: boolean;
  reason?: string;
  order?: StoredOrder;
  upsell?: Awaited<ReturnType<typeof suggestUpsells>>;
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

  const fraud = await analyzeOrderFraud({
    phone: input.phone,
    email: input.email,
    city: input.city,
    address: input.address,
    total,
    items: lineItems.map((i) => ({ sku: i.sku, quantity: i.quantity, name: i.name })),
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
    phone: input.phone,
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

  for (const item of lineItems) {
    decrementStock(item.sku, item.quantity);
  }

  if (input.cartId) markCartRecovered(input.cartId, order.id);

  const invoice = await generateInvoice(order);

  const customerName = [input.firstName, input.lastName].filter(Boolean).join(" ") || "عميل";

  await notifyAdminNewOrder(order, customerName).catch(() => {
    /* لا تعطّل الطلب إذا فشل إشعار المسؤول */
  });

  await sendMessage({
    channel: "whatsapp",
    recipient: order.phone,
    templateKey: "order_confirmed",
    variables: {
      name: customerFirst,
      order: order.orderNumber,
      total: order.total,
      eta: etaLabel,
      payment: paymentLabel,
    },
    locale: "ar",
  });

  if (order.email) {
    await sendMessage({
      channel: "email",
      recipient: order.email,
      templateKey: "order_confirmed",
      subject: locale === "ar" ? `تأكيد الطلب ${order.orderNumber}` : `Commande ${order.orderNumber} confirmée`,
      variables: {
        name: customerFirst,
        order: order.orderNumber,
        total: order.total,
        eta: etaLabel,
        payment: paymentLabel,
      },
      locale,
      generateWithAi: true,
      intent: "order confirmation email with invoice link",
    });
  }

  await sendMessage({
    channel: "sms",
    recipient: order.phone,
    templateKey: "order_confirmed",
    variables: {
      name: customerFirst,
      order: order.orderNumber,
      total: order.total,
      eta: etaLabel,
      payment: paymentLabel,
    },
    locale: "ar",
  });

  const upsell = await suggestUpsells({
    productIds: lineItems.map((i) => i.productId),
    locale: "ar",
  });

  if (upsell.message && order.status === "confirmed") {
    await sendMessage({
      channel: "whatsapp",
      recipient: order.phone,
      templateKey: "upsell",
      variables: { message: upsell.message },
      locale: "ar",
    });
  }

  if (order.status === "confirmed") {
    await createShipment(order);
  }

  await appendOrderToSheets({
    orderNumber: order.orderNumber,
    phone: order.phone,
    city: order.city,
    total: order.total,
    status: order.status,
  });

  await sendMetaConversion({
    eventName: "Purchase",
    value: order.total,
    currency: "MAD",
    contentIds: lineItems.map((i) => i.sku),
    phone: order.phone,
    email: order.email,
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
    upsell,
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
