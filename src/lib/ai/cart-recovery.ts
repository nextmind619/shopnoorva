import { store, uid, type AbandonedCart } from "./memory-store";
import { sendMessage } from "./messaging";
import { suggestUpsells } from "./support";
import { aiConfig } from "./config";
import { getProductById } from "@/data/products";
import { SITE_URL } from "@/lib/site";

export function saveAbandonedCart(input: {
  sessionId: string;
  phone?: string;
  email?: string;
  items: AbandonedCart["items"];
  subtotal: number;
}): AbandonedCart {
  const existing = store.carts.find(
    (c) => c.sessionId === input.sessionId && !c.recovered
  );

  if (existing) {
    existing.items = input.items;
    existing.subtotal = input.subtotal;
    existing.phone = input.phone || existing.phone;
    existing.email = input.email || existing.email;
    existing.updatedAt = new Date().toISOString();
    return existing;
  }

  const now = new Date().toISOString();
  const cart: AbandonedCart = {
    id: uid("cart"),
    sessionId: input.sessionId,
    phone: input.phone,
    email: input.email,
    items: input.items,
    subtotal: input.subtotal,
    recoveryStage: 0,
    recovered: false,
    createdAt: now,
    updatedAt: now,
  };
  store.carts.push(cart);
  return cart;
}

export async function processAbandonedCarts(): Promise<{
  processed: number;
  notified: number;
  results: Array<{ cartId: string; stage: number; channel: string }>;
}> {
  const stages = aiConfig.automation.cartRecoveryHours;
  const now = Date.now();
  let notified = 0;
  const results: Array<{ cartId: string; stage: number; channel: string }> = [];

  for (const cart of store.carts) {
    if (cart.recovered || (!cart.phone && !cart.email)) continue;
    if (!cart.items.length) continue;

    const ageHours = (now - new Date(cart.createdAt).getTime()) / (1000 * 60 * 60);
    const nextStage = cart.recoveryStage;
    if (nextStage >= stages.length) continue;
    if (ageHours < stages[nextStage]) continue;

    const templateKey = nextStage === 0 ? "abandoned_cart_1" : "abandoned_cart_2";
    const firstProduct = cart.items[0] ? getProductById(cart.items[0].productId) : undefined;
    const link = firstProduct
      ? `${SITE_URL}/ar/products/${firstProduct.slug}#order-form`
      : `${SITE_URL}/ar/products`;
    const productIds = cart.items.map((i) => i.productId);
    const upsell = await suggestUpsells({ productIds, locale: "fr" });

    if (cart.phone) {
      await sendMessage({
        channel: "whatsapp",
        recipient: cart.phone,
        templateKey,
        variables: {
          total: cart.subtotal,
          link,
          message: upsell.message,
        },
        locale: "fr",
        relatedType: "abandoned_cart",
        relatedId: cart.id,
      });
      results.push({ cartId: cart.id, stage: nextStage + 1, channel: "whatsapp" });
      notified++;
    }

    if (cart.email && nextStage >= 1) {
      await sendMessage({
        channel: "email",
        recipient: cart.email,
        templateKey,
        variables: { total: cart.subtotal, link },
        locale: "fr",
        generateWithAi: true,
        intent: "recover abandoned cart with premium tone",
      });
      results.push({ cartId: cart.id, stage: nextStage + 1, channel: "email" });
    }

    if (cart.phone && nextStage === stages.length - 1) {
      await sendMessage({
        channel: "sms",
        recipient: cart.phone,
        templateKey: "abandoned_cart_2",
        variables: { total: cart.subtotal, link },
        locale: "fr",
      });
      results.push({ cartId: cart.id, stage: nextStage + 1, channel: "sms" });
    }

    cart.recoveryStage = nextStage + 1;
    cart.lastNotifiedAt = new Date().toISOString();
  }

  return { processed: store.carts.filter((c) => !c.recovered).length, notified, results };
}

export function markCartRecovered(cartId: string, orderId: string): void {
  const cart = store.carts.find((c) => c.id === cartId);
  if (!cart) return;
  cart.recovered = true;
  cart.recoveredOrderId = orderId;
}
