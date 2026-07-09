import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Locale } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPriceNumber(amount: number, locale: Locale = "ar"): string {
  return new Intl.NumberFormat(
    locale === "ar" ? "ar-MA" : locale === "fr" ? "fr-MA" : "en-MA",
    { minimumFractionDigits: 0, maximumFractionDigits: 0 }
  ).format(amount);
}

export function getCurrencyLabel(locale: Locale): string {
  if (locale === "ar") return "درهم مغربي";
  if (locale === "fr") return "dirhams marocains";
  return "Moroccan Dirham";
}

export function formatPrice(amount: number, locale: Locale = "ar"): string {
  return `${formatPriceNumber(amount, locale)} ${getCurrencyLabel(locale)}`;
}

export function formatNumber(num: number, locale: Locale = "fr"): string {
  return new Intl.NumberFormat(locale === "ar" ? "ar-MA" : locale === "fr" ? "fr-MA" : "en-MA").format(num);
}

export function getLocalized<T extends Record<Locale, string>>(
  obj: T,
  locale: Locale
): string {
  return obj[locale] || obj.fr || obj.en;
}

export function calculateDiscount(price: number, compareAtPrice?: number): number {
  if (!compareAtPrice || compareAtPrice <= price) return 0;
  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
}

export function generateOrderNumber(): string {
  const prefix = "NRV";
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function getDirection(locale: Locale): "rtl" | "ltr" {
  return locale === "ar" ? "rtl" : "ltr";
}

export function getShippingCost(city: string, subtotal: number): number {
  const freeShippingThreshold = 500;
  if (subtotal >= freeShippingThreshold) return 0;
  const majorCities = ["casablanca", "rabat", "marrakech", "fes", "tanger", "agadir"];
  const normalized = city.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  return majorCities.some((c) => normalized.includes(c)) ? 25 : 35;
}
