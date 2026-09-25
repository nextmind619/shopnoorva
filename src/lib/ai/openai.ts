import OpenAI from "openai";
import { aiConfig, isConfigured } from "./config";

let client: OpenAI | null = null;

function getClient(): OpenAI | null {
  if (!isConfigured(aiConfig.openai.apiKey)) return null;
  if (!client) client = new OpenAI({ apiKey: aiConfig.openai.apiKey });
  return client;
}

export async function generateText(
  system: string,
  user: string,
  options?: { temperature?: number; json?: boolean }
): Promise<string> {
  const openai = getClient();

  if (!openai) {
    return fallbackGenerate(system, user);
  }

  const response = await openai.chat.completions.create({
    model: aiConfig.openai.model,
    temperature: options?.temperature ?? 0.4,
    response_format: options?.json ? { type: "json_object" } : undefined,
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
  });

  return response.choices[0]?.message?.content?.trim() || "";
}

function fallbackGenerate(system: string, user: string): string {
  const lower = `${system}\n${user}`.toLowerCase();
  const hasArabic = /[\u0600-\u06FF]/.test(`${system}\n${user}`);

  if (lower.includes("fraud") || lower.includes("fake")) {
    return JSON.stringify({
      score: 35,
      flags: [],
      decision: "allow",
      reason: "Heuristic fallback — OpenAI not configured",
    });
  }

  if (lower.includes("upsell") || lower.includes("cross")) {
    return JSON.stringify({
      upsells: ["NRV-STARBT-01", "NRV-AURORA-01"],
      crossSells: ["NRV-RABBIT-01"],
      message_fr: "Complétez votre ambiance avec le projecteur aurores boréales — -10% aujourd'hui.",
      message_ar: "كمّل الأجواء ديال الغرفة مع بروجيكتور الأورورا — خصم 10% اليوم.",
      message_en: "Complete your room vibe with the Northern Lights projector — 10% off today.",
    });
  }

  if (
    lower.includes("whatsapp") ||
    lower.includes("customer") ||
    lower.includes("support") ||
    lower.includes("وكيل دعم") ||
    lower.includes("noorva")
  ) {
    if (/توصيل|livraison|shipping|تتبع|suivi|tracking/.test(lower)) {
      return hasArabic || /[\u0600-\u06FF]/.test(user)
        ? "الطلب ديالك كيتوجد دابا 📦 التوصيل عادة 24–48 ساعة فالمدن الكبرى و2–4 أيام فباقي المدن. عافاك عطيني رقم الطلب إلا عندك.\n\nESCALATE: لا"
        : "Votre commande est en préparation. Livraison 24–48h grandes villes, 2–4 jours ailleurs. Envoyez votre n° de commande si vous l'avez.\n\nESCALATE: لا";
    }
    if (/سعر|ثمن|prix|price|شحال|كام/.test(lower)) {
      return "جميع الأثمان بالدرهم، التوصيل مجاني فكل المغرب، والدفع عند الاستلام ✅ شنو المنتوج اللي بغيتي ثمنو؟\n\nESCALATE: لا";
    }
    if (/رجوع|إرجاع|garantie|ضمان|retour|return|warranty/.test(lower)) {
      return "كاين ضمان 12 شهر، ويمكن الإرجاع خلال 14 يوم إلا كان عيب مصنعي — كتب لينا التفاصيل ونعاونوك 🙏\n\nESCALATE: لا";
    }
    if (/استرجاع|نصب|arnaque|rembours|refund|scam/.test(lower)) {
      return "فهمتك 🙏 غادي نحوّل الملف لفريق الدعم دابا ويرجعو ليك ف أقرب وقت.\n\nESCALATE: نعم\nسبب: طلب حساس";
    }
    return "مرحبا بيك ف NOORVA 👋 نقدر نعاونك فالطلب، التتبع، الأثمان، أو اختيار منتوج. شنو بغيتي؟\n\nESCALATE: لا";
  }

  if (lower.includes("email")) {
    return "تم تأكيد طلبك ف NOORVA. كنوجدو الطرد بعناية.";
  }

  if (lower.includes("sms")) {
    return "NOORVA: تم تأكيد الطلب. توصيل 24-48س. الدفع عند الاستلام.";
  }

  if (lower.includes("report") || lower.includes("analytics")) {
    return JSON.stringify({
      summary: "Daily performance stable. Recovery and COD conversion leading growth.",
      highlights: ["Galaxy Projector trending", "Cart recovery converting", "Low stock on RGB Bar"],
      actions: ["Reorder RGB Bar", "Boost Sunset Lamp ads", "Follow up pending COD confirms"],
    });
  }

  return "مرحبا بيك ف NOORVA. فعّل OPENAI_API_KEY باش الردود تكون أقوى.\n\nESCALATE: لا";
}
