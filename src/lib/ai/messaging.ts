import { generateText } from "./openai";
import { aiConfig, isConfigured, isEvolutionReady } from "./config";
import { store, uid, type NotificationRecord } from "./memory-store";
import { logIntegration } from "./integrations/logger";

export type MessageChannel = "whatsapp" | "sms" | "email";

export interface MessagePayload {
  channel: MessageChannel;
  recipient: string;
  templateKey?: string;
  subject?: string;
  body?: string;
  variables?: Record<string, string | number>;
  locale?: string;
  relatedType?: string;
  relatedId?: string;
  generateWithAi?: boolean;
  intent?: string;
}

/** Formats product lines for customer order confirmation (Arabic). */
export function formatOrderProductsForMessage(
  items: Array<{ name: string; quantity: number }>
): string {
  if (!items.length) return "—";
  if (items.length === 1) {
    const item = items[0];
    const qtyPart = item.quantity > 1 ? ` × ${item.quantity}` : "";
    return `${item.name}${qtyPart}`;
  }
  return items.map((item) => `• ${item.name} × ${item.quantity}`).join("\n");
}

const TEMPLATES: Record<string, Record<string, string>> = {
  order_confirmed: {
    fr: "Bonjour {{name}},\n\nBienvenue chez {{store}} 👋\n\nVotre commande {{order}} est enregistrée ✅\n\n{{products}}\n💰 Total: {{total}} MAD\n\n📞 L'équipe {{store}} vous appellera très bientôt pour confirmer votre commande et l'adresse de livraison.\n\n⚠️ Important : ne repassez pas commande et ne commandez pas depuis une autre pub — votre commande est déjà enregistrée chez nous et sera préparée après confirmation par téléphone.\n\n📲 Merci de répondre à l'appel pour confirmer. Pour toute question, répondez à ce message.\n\n🚚 Livraison à domicile\n💵 Paiement à la livraison\n\nMerci pour votre confiance — {{store}} ❤️",
    ar: "مرحباً بك في NOORVA 👋❤️\n\n✅ تم تسجيل طلبك بنجاح!\n\n🛍️ طلبك: {{products}}\n💰 المبلغ الإجمالي: {{total}} درهم\n\n📞 الخطوة الأخيرة لتأكيد طلبك:\nسيتصل بك فريق NOORVA قريباً لتأكيد الطلب وعنوان التوصيل.\n\n⚠️ ملاحظة مهمة: لا حاجة لإعادة تسجيل الطلب، فقد تم حفظ طلبك بالفعل. فقط انتظر مكالمتنا وأكد معلوماتك معنا.\n\n🚚 التوصيل حتى باب المنزل\n💵 الدفع عند الاستلام\n\n📲 المرجو الرد على المكالمة عند اتصال فريقنا حتى نتمكن من تجهيز طلبك وإرساله إليك.\n\nشكراً لثقتك في NOORVA ❤️",
    en: "Hi {{name}},\n\nWelcome to {{store}} 👋\n\nYour order {{order}} was placed successfully ✅\n\n{{products}}\n💰 Total: {{total}} MAD\n\n📞 The {{store}} team will call you shortly to confirm your order and delivery address.\n\n⚠️ Important: do not place the order again or order from another ad — your order is already registered with us and will be prepared after phone confirmation.\n\n📲 Please answer the call to confirm. Reply to this message if you have any questions.\n\n🚚 Home delivery\n💵 Cash on delivery\n\nThank you for trusting {{store}} ❤️",
  },
  abandoned_cart_1: {
    fr: "Votre panier NOORVA vous attend encore ({{total}} MAD). Finalisez en COD en 1 clic: {{link}}",
    ar: "سلتك في NOORVA بانتظارك ({{total}} درهم). أكمل الطلب بالدفع عند الاستلام: {{link}}",
    en: "Your NOORVA cart is waiting ({{total}} MAD). Complete with COD: {{link}}",
  },
  abandoned_cart_2: {
    fr: "Dernière chance: -10% avec NOORVA10 sur votre panier. Lien: {{link}}",
    ar: "فرصة أخيرة: خصم 10% بكود NOORVA10. الرابط: {{link}}",
    en: "Last chance: 10% off with NOORVA10. Link: {{link}}",
  },
  shipped: {
    fr: "Colis {{order}} expédié. Suivi: {{tracking}}. Destination: {{city}}.",
    ar: "📦 تم شحن طلبك {{order}}\n🔢 رقم التتبع: {{tracking}}\n📍 الوجهة: {{city}}",
    en: "Order {{order}} shipped. Tracking: {{tracking}}. City: {{city}}.",
  },
  upsell: {
    fr: "{{message}}",
    ar: "{{message}}",
    en: "{{message}}",
  },
  admin_new_order: {
    ar: "🛒 *طلب جديد — NOORVA*\n\n📦 رقم الطلب: {{order}}\n👤 الاسم: {{name}}\n📱 الهاتف: {{phone}}\n📍 المدينة: {{city}}\n🏠 العنوان: {{address}}\n🛍 المنتج: {{products}}\n💰 المجموع: {{total}} درهم\n💵 الدفع عند الاستلام\n\n✅ اتصل بالعميل الآن لتأكيد الطلب",
    fr: "🛒 *Nouvelle commande — NOORVA*\n\n📦 {{order}}\n👤 {{name}}\n📱 {{phone}}\n📍 {{city}} — {{address}}\n🛍 {{products}}\n💰 {{total}} MAD\n💵 COD\n\n✅ Appelez le client pour confirmer",
    en: "🛒 *New order — NOORVA*\n\n📦 {{order}}\n👤 {{name}}\n📱 {{phone}}\n📍 {{city}} — {{address}}\n🛍 {{products}}\n💰 {{total}} MAD\n💵 COD\n\n✅ Call customer to confirm",
  },
};

function renderTemplate(template: string, vars: Record<string, string | number> = {}): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => String(vars[key] ?? ""));
}

export async function generateMessageBody(payload: MessagePayload): Promise<{ subject?: string; body: string }> {
  const locale = payload.locale || "ar";
  if (payload.body && !payload.generateWithAi) {
    return { subject: payload.subject, body: payload.body };
  }

  if (payload.templateKey && TEMPLATES[payload.templateKey]) {
    const tpl = TEMPLATES[payload.templateKey][locale] || TEMPLATES[payload.templateKey].fr;
    const body = renderTemplate(tpl, payload.variables);
    if (!payload.generateWithAi) {
      return {
        subject: payload.subject || defaultSubject(payload.templateKey, locale),
        body,
      };
    }
  }

  const generated = await generateText(
    `You write premium short ${payload.channel} messages for NOORVA Morocco. Locale: ${locale}. No spammy tone.`,
    JSON.stringify({
      intent: payload.intent || payload.templateKey,
      variables: payload.variables,
      channel: payload.channel,
      draft: payload.body,
    })
  );

  return {
    subject: payload.subject || defaultSubject(payload.templateKey || "general", locale),
    body: generated,
  };
}

function defaultSubject(key: string, locale: string): string {
  const map: Record<string, Record<string, string>> = {
    order_confirmed: { fr: "Commande confirmée — NOORVA", ar: "تأكيد الطلب — NOORVA", en: "Order confirmed — NOORVA" },
    abandoned_cart_1: { fr: "Votre panier vous attend", ar: "سلتك بانتظارك", en: "Your cart is waiting" },
    shipped: { fr: "Votre colis est en route", ar: "طردك في الطريق", en: "Your package is on the way" },
    general: { fr: "NOORVA", ar: "NOORVA", en: "NOORVA" },
  };
  return map[key]?.[locale] || map.general[locale] || "NOORVA";
}

export async function sendMessage(payload: MessagePayload): Promise<NotificationRecord> {
  const { subject, body } = await generateMessageBody(payload);
  const record: NotificationRecord = {
    id: uid("notif"),
    channel: payload.channel,
    recipient: payload.recipient,
    templateKey: payload.templateKey,
    subject,
    body,
    status: "queued",
    createdAt: new Date().toISOString(),
  };
  store.notifications.push(record);

  try {
    if (payload.channel === "whatsapp") {
      await sendWhatsApp(payload.recipient, body);
    } else if (payload.channel === "sms") {
      await sendSms(payload.recipient, body);
    } else {
      await sendEmail(payload.recipient, subject || "NOORVA", body);
    }
    record.status = "sent";
    record.sentAt = new Date().toISOString();
  } catch (error) {
    record.status = "failed";
    record.error = error instanceof Error ? error.message : "send_failed";
  }

  return record;
}

async function sendWhatsApp(to: string, body: string): Promise<void> {
  const { evolution } = aiConfig;
  if (!isEvolutionReady()) {
    await logIntegration("evolution", "whatsapp_send_dry_run", "ok", {
      to,
      body,
      reason: "evolution_not_configured",
      baseUrl: evolution.baseUrl,
      instance: evolution.instance,
    });
    return;
  }

  const number = normalizeWhatsApp(to);
  const url = `${evolution.baseUrl.replace(/\/$/, "")}/message/sendText/${evolution.instance}`;

  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: evolution.apiKey,
      },
      body: JSON.stringify({ number, text: body }),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "fetch_failed";
    await logIntegration("evolution", "whatsapp_send", "error", { to: number, url }, { message });
    throw new Error(`Evolution API unreachable: ${message}`);
  }

  const data = await res.json().catch(() => ({}));
  await logIntegration("evolution", "whatsapp_send", res.ok ? "ok" : "error", { to: number, url }, data);
  if (!res.ok) {
    const detail =
      (data as { response?: { message?: unknown }; error?: string; message?: string })?.response
        ?.message ??
      (data as { error?: string }).error ??
      (data as { message?: string }).message ??
      res.statusText;
    throw new Error(`Evolution API WhatsApp send failed (${res.status}): ${JSON.stringify(detail)}`);
  }
}

async function sendSms(to: string, body: string): Promise<void> {
  const { sms } = aiConfig;
  if (!isConfigured(sms.apiKey) || !isConfigured(sms.apiUrl)) {
    await logIntegration("sms", "sms_send_dry_run", "ok", { to, body });
    return;
  }

  const res = await fetch(sms.apiUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${sms.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ to, from: sms.sender, message: body }),
  });
  const data = await res.json().catch(() => ({}));
  await logIntegration("sms", "sms_send", res.ok ? "ok" : "error", { to }, data);
  if (!res.ok) throw new Error("SMS send failed");
}

async function sendEmail(to: string, subject: string, body: string): Promise<void> {
  const { email } = aiConfig;
  if (!isConfigured(email.apiKey)) {
    await logIntegration("email", "email_send_dry_run", "ok", { to, subject, body });
    return;
  }

  const res = await fetch(email.apiUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${email.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: email.from,
      to,
      subject,
      html: `<div style="font-family:Georgia,serif;color:#0B0E17"><h2 style="color:#C9A962">NOORVA</h2><p>${body}</p></div>`,
    }),
  });
  const data = await res.json().catch(() => ({}));
  await logIntegration("email", "email_send", res.ok ? "ok" : "error", { to, subject }, data);
  if (!res.ok) throw new Error("Email send failed");
}

function normalizeWhatsApp(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("212")) return digits;
  if (digits.startsWith("0")) return `212${digits.slice(1)}`;
  return `212${digits}`;
}
