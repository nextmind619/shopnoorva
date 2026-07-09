export const locales = ["ar", "fr", "en"] as const;
export const defaultLocale = "ar";

export const localeNames: Record<string, string> = {
  ar: "العربية",
  fr: "Français",
  en: "English",
};

export const localeDirections: Record<string, "rtl" | "ltr"> = {
  ar: "rtl",
  fr: "ltr",
  en: "ltr",
};
