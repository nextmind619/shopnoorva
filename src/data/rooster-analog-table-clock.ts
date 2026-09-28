/** Rooster analog table clock — nostalgia COD landing page. */

export const ROOSTER_CLOCK_SLUG = "rooster-analog-table-clock";
export const ROOSTER_CLOCK_PRICE_MAD = 199;
export const ROOSTER_CLOCK_PACK_PRICE_MAD = 299;
export const ROOSTER_CLOCK_PACK_SAVINGS_MAD = ROOSTER_CLOCK_PRICE_MAD * 2 - ROOSTER_CLOCK_PACK_PRICE_MAD;
/** CodPlus / warehouse SKU placeholder until marketplace id is confirmed. */
export const ROOSTER_CLOCK_SKU = "Rooster-Analog-Table-Clock";
export const ROOSTER_CLOCK_PACK_SKU = "Rooster-Analog-Table-Clock-2PK";

export const ROOSTER_CLOCK_HERO_IMAGE =
  "/products/rooster-analog-table-clock/02-premium-hero.webp";
export const ROOSTER_CLOCK_PRODUCT_IMAGE =
  "/products/rooster-analog-table-clock/09-close-up.webp";

/** Image prompt doc for regenerating LP assets */
export const ROOSTER_CLOCK_IMAGE_PROMPTS_PATH =
  "/products/rooster-analog-table-clock/IMAGE_PROMPTS.md";

/** Single SKU finish — shown on LP so customers know what arrives. */
export const ROOSTER_CLOCK_FRAME_COLOR = {
  labelAr: "فضي كروم",
  detailAr: "إطار معدني لامع (فضي كروم)",
  swatchCss:
    "linear-gradient(135deg, #eceff3 0%, #b4bcc8 38%, #f8f9fb 52%, #8f98a8 100%)",
} as const;

export const ROOSTER_CLOCK_FAQS = [
  {
    q: "شحال الثمن؟",
    a: "ساعة وحدة بـ 199 درهم، أو جوج ساعات بـ 299 درهم.",
  },
  {
    q: "كيفاش كنخلص؟",
    a: "الدفع عند الاستلام، كتخلص ملي توصلك الطلبية.",
  },
  {
    q: "فين كتوصلو؟",
    a: "التوصيل داخل المغرب.",
  },
  {
    q: "كيفاش نطلب؟",
    a: "عمر الفورم بالمعلومات ديالك وغادي نتاصلو بك لتأكيد الطلب.",
  },
  {
    q: "شنو اللون ديال الساعة؟",
    a: "إطار واحد: فضي كروم معدني لامع — نفس اللون اللي كيبان فالصورة.",
  },
] as const;
