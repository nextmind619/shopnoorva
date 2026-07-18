import { generateText } from "./openai";
import { store, uid, type Conversation } from "./memory-store";
import { getProductById, products } from "@/data/products";

const SYSTEM_PROMPT = `You are NOORVA AI Support for a premium Moroccan lighting ecommerce brand.
Languages: answer in the customer's language (Arabic, French, or English).
Products: astronaut Bluetooth speaker projector (MX003), multi-color galaxy star projector night light with Bluetooth speaker and remote (21 light modes), white geometric Dream Aurora star/moon projector with Bluetooth speaker and remote, rabbit carousel music-box night light.
Policies:
- Currency MAD
- Cash on Delivery available nationwide
- Free shipping over 500 MAD
- Delivery 24-48h major cities, 2-4 days elsewhere
- 14-day returns for unopened products
- 12-month warranty
Be concise, premium, helpful. Never invent tracking numbers. If unknown, ask for order number.`;

export async function answerCustomer(input: {
  channel: "whatsapp" | "email" | "sms" | "web";
  message: string;
  phone?: string;
  email?: string;
  locale?: string;
  conversationId?: string;
}): Promise<{ conversationId: string; reply: string; aiGenerated: boolean }> {
  let conversation = input.conversationId
    ? store.conversations.find((c) => c.id === input.conversationId)
    : undefined;

  if (!conversation) {
    conversation = {
      id: uid("conv"),
      channel: input.channel,
      phone: input.phone,
      email: input.email,
      locale: input.locale || detectLocale(input.message),
      messages: [],
      status: "open",
      createdAt: new Date().toISOString(),
    };
    store.conversations.push(conversation);
  }

  conversation.messages.push({
    role: "customer",
    content: input.message,
    createdAt: new Date().toISOString(),
  });

  const orderContext = input.phone
    ? store.orders
        .filter((o) => o.phone.replace(/\D/g, "").endsWith(input.phone!.replace(/\D/g, "").slice(-9)))
        .slice(-3)
        .map((o) => ({
          orderNumber: o.orderNumber,
          status: o.status,
          total: o.total,
          trackingNumber: o.trackingNumber,
        }))
    : [];

  const catalog = products.slice(0, 8).map((p) => ({
    name: p.name.fr,
    price: p.price,
    slug: p.slug,
  }));

  const history = conversation.messages
    .slice(-8)
    .map((m) => `${m.role}: ${m.content}`)
    .join("\n");

  const reply = await generateText(
    SYSTEM_PROMPT,
    `Locale hint: ${conversation.locale}
Recent orders: ${JSON.stringify(orderContext)}
Catalog sample: ${JSON.stringify(catalog)}
Conversation:
${history}

Reply to the latest customer message only.`
  );

  conversation.messages.push({
    role: "assistant",
    content: reply,
    aiGenerated: true,
    createdAt: new Date().toISOString(),
  });

  return {
    conversationId: conversation.id,
    reply,
    aiGenerated: true,
  };
}

function detectLocale(message: string): string {
  if (/[\u0600-\u06FF]/.test(message)) return "ar";
  if (/bonjour|merci|commande|livraison|prix/i.test(message)) return "fr";
  return "en";
}

export function getConversation(id: string): Conversation | undefined {
  return store.conversations.find((c) => c.id === id);
}

export async function suggestUpsells(input: {
  productIds: string[];
  locale?: string;
}): Promise<{
  upsells: string[];
  crossSells: string[];
  message: string;
}> {
  const selected = input.productIds
    .map((id) => getProductById(id))
    .filter(Boolean)
    .map((p) => ({ id: p!.id, name: p!.name.fr, price: p!.price, tags: p!.tags }));

  const raw = await generateText(
    "You are a CRO upsell engine for NOORVA lighting. Return JSON: upsells (sku/id[]), crossSells (id[]), message_fr, message_ar, message_en.",
    JSON.stringify({ cart: selected, catalog: products.map((p) => ({ id: p.id, name: p.name.fr, price: p.price, tags: p.tags })) }),
    { json: true, temperature: 0.5 }
  );

  try {
    const parsed = JSON.parse(raw) as {
      upsells?: string[];
      crossSells?: string[];
      message_fr?: string;
      message_ar?: string;
      message_en?: string;
    };
    const locale = input.locale || "fr";
    const message =
      locale === "ar"
        ? parsed.message_ar || parsed.message_fr || ""
        : locale === "en"
          ? parsed.message_en || parsed.message_fr || ""
          : parsed.message_fr || "";

    return {
      upsells: parsed.upsells || selected.flatMap((p) => getProductById(p.id)?.upsellIds || []).slice(0, 2),
      crossSells: parsed.crossSells || selected.flatMap((p) => getProductById(p.id)?.crossSellIds || []).slice(0, 2),
      message,
    };
  } catch {
    const fallbackUpsells = selected.flatMap((p) => getProductById(p.id)?.upsellIds || []).slice(0, 2);
    const fallbackCross = selected.flatMap((p) => getProductById(p.id)?.crossSellIds || []).slice(0, 2);
    return {
      upsells: fallbackUpsells,
      crossSells: fallbackCross,
      message: "Complétez votre ambiance NOORVA avec un accessoire assorti.",
    };
  }
}
