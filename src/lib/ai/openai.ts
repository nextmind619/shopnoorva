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
      upsells: ["NRV-SUNSET", "NRV-RGB-BAR"],
      crossSells: ["NRV-ASTRO"],
      message_fr: "Complétez votre ambiance avec la Sunset Lamp — -10% aujourd'hui.",
      message_ar: "أكمل أجواء غرفتك مع مصباح Sunset — خصم 10% اليوم.",
      message_en: "Complete your room vibe with the Sunset Lamp — 10% off today.",
    });
  }

  if (lower.includes("whatsapp") || lower.includes("customer") || lower.includes("support")) {
    if (lower.includes("livraison") || lower.includes("shipping") || lower.includes("توصيل")) {
      return "Votre commande est en préparation. Livraison estimée 24–48h dans les grandes villes. Besoin du numéro de suivi ?";
    }
    if (lower.includes("prix") || lower.includes("price") || lower.includes("سعر")) {
      return "Tous nos prix sont en MAD, livraison gratuite dès 500 MAD. Paiement à la livraison disponible partout au Maroc.";
    }
    return "Merci de contacter NOORVA. Je peux vous aider pour le suivi, le paiement COD, les retours ou le choix d'un projecteur. Que souhaitez-vous ?";
  }

  if (lower.includes("email")) {
    return "Votre lumière NOORVA est confirmée. Nous préparons votre colis avec soin.";
  }

  if (lower.includes("sms")) {
    return "NOORVA: Commande confirmée. Livraison 24-48h. COD disponible.";
  }

  if (lower.includes("report") || lower.includes("analytics")) {
    return JSON.stringify({
      summary: "Daily performance stable. Recovery and COD conversion leading growth.",
      highlights: ["Galaxy Projector trending", "Cart recovery converting", "Low stock on RGB Bar"],
      actions: ["Reorder RGB Bar", "Boost Sunset Lamp ads", "Follow up pending COD confirms"],
    });
  }

  return "NOORVA AI automation ready. Configure OPENAI_API_KEY for full generative responses.";
}
