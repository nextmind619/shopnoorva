export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://shopnoorva.shop";

export const SITE_DOMAIN = "shopnoorva.shop";
export const SITE_NAME = "NOORVA";
export const SITE_EMAIL = process.env.EMAIL_FROM || "NOORVA <orders@shopnoorva.shop>";
export const SUPPORT_WHATSAPP = process.env.SUPPORT_WHATSAPP || "+212600000000";
export const WHATSAPP_URL = `https://wa.me/${SUPPORT_WHATSAPP.replace(/\D/g, "")}`;
