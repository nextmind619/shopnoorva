export const aiConfig = {
  openai: {
    apiKey: process.env.OPENAI_API_KEY || "",
    model: process.env.OPENAI_MODEL || "gpt-4o-mini",
  },
  redis: {
    url: process.env.REDIS_URL || "redis://localhost:6379",
  },
  postgres: {
    url: process.env.DATABASE_URL || "postgresql://noorva:noorva_secret@localhost:5432/noorva_ai",
  },
  minio: {
    endpoint: process.env.MINIO_ENDPOINT || "localhost",
    port: Number(process.env.MINIO_PORT || 9000),
    accessKey: process.env.MINIO_ACCESS_KEY || "noorva",
    secretKey: process.env.MINIO_SECRET_KEY || "noorva_minio_secret",
    bucket: process.env.MINIO_BUCKET || "noorva",
    useSSL: process.env.MINIO_USE_SSL === "true",
  },
  evolution: {
    baseUrl: process.env.EVOLUTION_API_URL || "http://localhost:8080",
    apiKey: process.env.EVOLUTION_API_KEY || "",
    instance: process.env.EVOLUTION_INSTANCE || "noorva",
  },
  n8n: {
    webhookBase: process.env.N8N_WEBHOOK_BASE || "http://localhost:5678/webhook",
  },
  googleSheets: {
    spreadsheetId: process.env.GOOGLE_SHEETS_ID || "",
    serviceAccountEmail: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || "",
    privateKey: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n") || "",
  },
  meta: {
    pixelId: process.env.NEXT_PUBLIC_FB_PIXEL_ID || "",
    accessToken: process.env.META_ACCESS_TOKEN || "",
    adAccountId: process.env.META_AD_ACCOUNT_ID || "",
  },
  tiktok: {
    pixelId: process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID || "",
    accessToken: process.env.TIKTOK_ACCESS_TOKEN || "",
  },
  sms: {
    apiUrl: process.env.SMS_API_URL || "",
    apiKey: process.env.SMS_API_KEY || "",
    sender: process.env.SMS_SENDER || "NOORVA",
  },
  email: {
    apiUrl: process.env.EMAIL_API_URL || "https://api.resend.com/emails",
    apiKey: process.env.EMAIL_API_KEY || "",
    from: process.env.EMAIL_FROM || "NOORVA <orders@shopnoorva.shop>",
  },
  easypanel: {
    webhookUrl: process.env.EASYPANEL_WEBHOOK_URL || "",
  },
  brand: {
    name: "NOORVA",
    domain: "shopnoorva.shop",
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://shopnoorva.shop",
    supportWhatsApp: process.env.SUPPORT_WHATSAPP || process.env.ADMIN_WHATSAPP || "+212693428013",
    adminWhatsApp: process.env.ADMIN_WHATSAPP || "+212693428013",
    currency: "MAD",
    timezone: "Africa/Casablanca",
  },
  automation: {
    cartRecoveryHours: [1, 6, 24],
    fraudThreshold: 70,
    duplicateWindowMinutes: 30,
    lowStockMultiplier: 1.2,
  },
} as const;

export function isConfigured(value: string): boolean {
  return Boolean(value && value.trim().length > 0);
}

/** Reject empty / placeholder Evolution settings that silently break WhatsApp. */
export function isEvolutionReady(): boolean {
  const { baseUrl, apiKey, instance } = aiConfig.evolution;
  if (!isConfigured(apiKey) || !isConfigured(baseUrl) || !isConfigured(instance)) return false;
  const bad = /your[-_]?evolution|example\.com|change[_-]?me|CHANGE_EVOLUTION/i;
  return !bad.test(baseUrl) && !bad.test(apiKey);
}
