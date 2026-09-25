import { generateText } from "./openai";
import { store, uid, type Conversation } from "./memory-store";
import { getProductById, products, faqs } from "@/data/products";
import { aiConfig } from "./config";
import { findOrdersByPhone } from "./integrations/db-orders";

const SYSTEM_PROMPT = `نتا وكيل دعم زبائن NOORVA على واتساب — متجر مغربي كيوصل منتجات للدار فجميع المدن.

## اللهجة (مهم بزاف)
- جاوب دائماً بالدارجة المغربية أولاً، طبيعية ودافئة وقصيرة.
- إلا كتب الزبون بالفصحى، جاوب فصحى بسيطة قريبة للمغربية.
- إلا كتب بالفرنسية أو الإنجليزية، جاوب بنفس اللغة بلهجة ودّية قصيرة.
- ممنوع اللهجة الخليجية أو المصرية. ممنوع ردود روبوتية طويلة.

## أسلوب الرد
- جملة أو جملتين، حد أقصى ~4 أسطر إلا احتاج توضيح طلب.
- كن واضح: الأثمان بالدرهم (MAD)، التوصيل، الدفع عند الاستلام.
- ما تخترعشي أرقام تتبع ولا وعود مزيفة.
- إلا ما عرفتيش شي حاجة: قول بصراحة وطلب رقم الطلب أو رقم الهاتف، أو قول غادي نحوّلك لفريق الدعم.
- ما تذكرش أنك AI إلا سألوك مباشرة.

## سياسات المتجر
- العملة: درهم مغربي (MAD)
- الدفع عند الاستلام (COD) فجميع المغرب
- التوصيل مجاني لجميع المدن
- المدة: 24–48 ساعة فالمدن الكبرى، 2–4 أيام فباقي المدن
- بعد الطلب كيعيّط الفريق باش يأكّد العنوان
- ضمان 12 شهر (إلا ما ذُكر غير ذلك فالمنتج)
- إرجاع خلال 14 يوم إلا كان عيب مصنعي — عبر واتساب
- الموقع: ${aiConfig.brand.siteUrl}/ar
- واتساب الدعم: ${aiConfig.brand.supportWhatsApp}

## متى تصعّد للإنسان (escalation)
إلا الرسالة فيها غضب شديد، طلب استرجاع فلوس، شكاية نصب/خداع، تهديد، مشكل قانوني، أو طلب صريح باش يهضر مع شخص — جاوب بجملة قصيرة طمّن فيها الزبون وكتب فآخر السطر بالضبط:
ESCALATE: نعم
سبب قصير
وإلا:
ESCALATE: لا

## المنتوجات
استعمل كتالوج المنتجات والأسعار اللي غادي يتوفر ليك. ما تبدّلش الأثمان.`;

const ESCALATION_PATTERNS =
  /استرجاع|رجعو?\s*ليا\s*(لفلوس|الفلوس)|نصب|خداع|نصاب|محامي|شكاية|بلاغ|تهديد|ساخط|زفت|حرام|scandale|arnaque|rembours|avocat|fraud|scam|refund|lawsuit|أريد التحدث|بغيت نهضر مع|human|agent|responsable|مسؤول/i;

export async function answerCustomer(input: {
  channel: "whatsapp" | "email" | "sms" | "web";
  message: string;
  phone?: string;
  email?: string;
  locale?: string;
  conversationId?: string;
}): Promise<{
  conversationId: string;
  reply: string;
  aiGenerated: boolean;
  escalate: boolean;
  escalateReason?: string;
}> {
  let conversation = resolveConversation(input);

  conversation.messages.push({
    role: "customer",
    content: input.message,
    createdAt: new Date().toISOString(),
  });

  const orderContext = await buildOrderContext(input.phone, input.message);
  const catalog = buildCatalogContext();
  const faqContext = faqs.map((f) => ({
    q: f.question.ar,
    a: f.answer.ar,
  }));

  const history = conversation.messages
    .slice(-10)
    .map((m) => `${m.role}: ${m.content}`)
    .join("\n");

  const locale = conversation.locale || detectLocale(input.message);
  conversation.locale = locale;

  const raw = await generateText(
    SYSTEM_PROMPT,
    `لغة الزبون المتوقعة: ${locale}
طلبات مرتبطة: ${JSON.stringify(orderContext)}
كتالوج: ${JSON.stringify(catalog)}
أسئلة شائعة: ${JSON.stringify(faqContext)}
المحادثة:
${history}

جاوب على آخر رسالة للزبون فقط، وذيّل الرد بـ ESCALATE كما في التعليمات.`
  );

  const { reply, escalate, escalateReason } = parseSupportReply(raw, input.message);

  conversation.messages.push({
    role: "assistant",
    content: reply,
    aiGenerated: true,
    createdAt: new Date().toISOString(),
  });

  if (escalate) {
    conversation.status = "escalated";
  }

  return {
    conversationId: conversation.id,
    reply,
    aiGenerated: true,
    escalate,
    escalateReason,
  };
}

function resolveConversation(input: {
  channel: "whatsapp" | "email" | "sms" | "web";
  phone?: string;
  email?: string;
  locale?: string;
  conversationId?: string;
  message: string;
}): Conversation {
  if (input.conversationId) {
    const byId = store.conversations.find((c) => c.id === input.conversationId);
    if (byId) return byId;
  }

  if (input.phone) {
    const needle = normalizePhoneDigits(input.phone);
    const existing = [...store.conversations]
      .reverse()
      .find(
        (c) =>
          c.channel === input.channel &&
          c.phone &&
          normalizePhoneDigits(c.phone).endsWith(needle.slice(-9)) &&
          (c.status === "open" || c.status === "escalated")
      );
    if (existing) return existing;
  }

  const conversation: Conversation = {
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
  return conversation;
}

async function buildOrderContext(phone?: string, message?: string) {
  const fromMessage = message?.match(/(?:NRV|NV|CMD)[-_]?\d{4,}|\b\d{6,}\b/i)?.[0];
  const memoryOrders = phone
    ? store.orders.filter((o) => phonesMatch(o.phone, phone)).slice(-5)
    : [];

  let dbOrders: Awaited<ReturnType<typeof findOrdersByPhone>> = [];
  try {
    if (phone) dbOrders = await findOrdersByPhone(phone, 5);
  } catch {
    dbOrders = [];
  }

  const merged = [...memoryOrders, ...dbOrders]
    .filter((o, i, arr) => arr.findIndex((x) => x.orderNumber === o.orderNumber) === i)
    .slice(-5)
    .map((o) => ({
      orderNumber: o.orderNumber,
      status: o.status,
      total: o.total,
      city: o.city,
      trackingNumber: o.trackingNumber || null,
      items: o.items.map((it) => `${it.name} × ${it.quantity}`).join("، "),
    }));

  if (fromMessage && !merged.some((o) => o.orderNumber.includes(fromMessage))) {
    const hit =
      store.orders.find((o) => o.orderNumber.includes(fromMessage)) ||
      (await findOrdersByPhone(fromMessage, 1).catch(() => []))[0];
    if (hit) {
      merged.push({
        orderNumber: hit.orderNumber,
        status: hit.status,
        total: hit.total,
        city: hit.city,
        trackingNumber: hit.trackingNumber || null,
        items: hit.items.map((it) => `${it.name} × ${it.quantity}`).join("، "),
      });
    }
  }

  return merged;
}

function buildCatalogContext() {
  return products.slice(0, 24).map((p) => ({
    name: p.name.ar,
    price: p.price,
    compareAt: p.compareAtPrice || null,
    sku: p.sku,
    slug: p.slug,
    warranty: p.warrantyMonths ?? 12,
    blurb: p.shortDescription.ar.slice(0, 120),
  }));
}

function parseSupportReply(
  raw: string,
  customerMessage: string
): { reply: string; escalate: boolean; escalateReason?: string } {
  const escalateMatch = raw.match(/ESCALATE:\s*(نعم|لا|yes|no|true|false)/i);
  const forceEscalate = ESCALATION_PATTERNS.test(customerMessage);
  const escalateFlag = escalateMatch
    ? /نعم|yes|true/i.test(escalateMatch[1])
    : false;
  const escalate = forceEscalate || escalateFlag;

  let reply = raw
    .replace(/\n*ESCALATE:\s*(نعم|لا|yes|no|true|false)[\s\S]*$/im, "")
    .replace(/\n*سبب\s*[:：][^\n]*/gi, "")
    .trim();

  if (!reply) {
    reply = escalate
      ? "فهمتك خويا/ختي 🙏 غادي نحوّل الملف ديالك لفريق الدعم دابا ويرجعو ليك ف أقرب وقت."
      : "مرحبا بيك ف NOORVA 👋 كيفاش نقدر نعاونك؟ طلب، تتبع، أو استفسار على منتوج؟";
  }

  if (escalate && !/فريق الدعم|نحولو|نحوّل|responsable|équipe/i.test(reply)) {
    reply += "\n\nغادي نحوّل الملف لفريق الدعم باش يجاوبوك شخصياً 🙏";
  }

  const reasonMatch = raw.match(/سبب\s*[:：]\s*(.+)/i);
  return {
    reply: reply.slice(0, 1200),
    escalate,
    escalateReason: reasonMatch?.[1]?.trim() || (forceEscalate ? "sensitive_keywords" : undefined),
  };
}

function detectLocale(message: string): string {
  if (/[\u0600-\u06FF]/.test(message)) return "ar";
  if (/bonjour|merci|commande|livraison|prix|salut|svp/i.test(message)) return "fr";
  return "en";
}

function normalizePhoneDigits(phone: string): string {
  return phone.replace(/\D/g, "");
}

function phonesMatch(a: string, b: string): boolean {
  const da = normalizePhoneDigits(a);
  const db = normalizePhoneDigits(b);
  if (!da || !db) return false;
  return da.endsWith(db.slice(-9)) || db.endsWith(da.slice(-9));
}

export function getConversation(id: string): Conversation | undefined {
  return store.conversations.find((c) => c.id === id);
}

export function findOpenConversationByPhone(phone: string): Conversation | undefined {
  const needle = normalizePhoneDigits(phone);
  return [...store.conversations]
    .reverse()
    .find(
      (c) =>
        c.phone &&
        normalizePhoneDigits(c.phone).endsWith(needle.slice(-9)) &&
        (c.status === "open" || c.status === "escalated")
    );
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
    JSON.stringify({
      cart: selected,
      catalog: products.map((p) => ({ id: p.id, name: p.name.fr, price: p.price, tags: p.tags })),
    }),
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
      message: "كمّل الأجواء ديالك مع منتوج NOORVA مناسب — استفد من العرض اليوم.",
    };
  }
}
