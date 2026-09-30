/** Adjustable maternity support belt + free digital thermometer — PDP constants. */

export const MATERNITY_BELT_SLUG = "adjustable-maternity-support-belt";
export const MATERNITY_BELT_PRICE_MAD = 199;
/** Value anchor: belt + thermometer typical retail reference. */
export const MATERNITY_BELT_COMPARE_MAD = 427;
/** CodPlus marketplace SKU (PRD from Marketplace). */
export const MATERNITY_BELT_SKU = "Maternity-SupportBelt";
export const MATERNITY_BELT_GIFT_ID = "gift-digital-thermometer";
/** CodPlus marketplace SKU — must match Marketplace → SKU exactly. */
export const MATERNITY_BELT_GIFT_SKU = "Digital - Thermometer";
/**
 * CodPlus seller Pack → Name (must match exactly; CodPlus may append unit count in UI).
 * Products in pack: 1× {@link MATERNITY_BELT_SKU} + 1× {@link MATERNITY_BELT_GIFT_SKU}.
 */
export const MATERNITY_BELT_CODPLUS_PACK_SKU = "Maternity-SupportBelt Digital-Thermometer Pack";
/** Sum of Marketplace min. selling prices (belt 122 DH + thermometer 65 DH) — pack floor in CodPlus. */
export const MATERNITY_BELT_CODPLUS_PACK_MIN_DH = 187;

const BASE = `/products/${MATERNITY_BELT_SLUG}`;

/** Bust CDN/browser cache after replacing placeholders with real photos. */
export const MATERNITY_BELT_ASSET_VERSION = "20250929-user";

function maternityAsset(file: string): string {
  return `${BASE}/${file}?v=${MATERNITY_BELT_ASSET_VERSION}`;
}

export const MATERNITY_BELT_HERO_IMAGE = maternityAsset("02-premium-hero.webp");
export const MATERNITY_BELT_FEATURES_IMAGE = maternityAsset("10-features.webp");
export const MATERNITY_BELT_LIFESTYLE_IMAGE = maternityAsset("03-lifestyle.webp");
export const MATERNITY_BELT_IN_USE_IMAGE = maternityAsset("14-product-in-use.webp");
export const MATERNITY_BELT_INFOGRAPHIC_IMAGE = maternityAsset("17-infographic.webp");
export const MATERNITY_BELT_GIFT_IMAGE = maternityAsset("gift-digital-thermometer.webp");

export const MATERNITY_BELT_FAQS = [
  {
    q: "شحال الثمن وشنو كيجي فالطلب؟",
    a: "199 درهم — حزام دعم الحمل + ميزان حرارة رقمي هدية مجانية. الدفع عند الاستلام والتوصيل مجاني لجميع مدن المغرب.",
  },
  {
    q: "واش الحزام قابل للتعديل؟",
    a: "نعم. أشرطة قابلة للتعديل وخطافات آمنة باش يناسب البطن مع تطور الحمل من الشهور الأولى حتى الأخيرة.",
  },
  {
    q: "واش كيخفّف آلام الظهر؟",
    a: "الحزام كيدعم أسفل البطن وكيساعد على تحسين وضعية الظهر — كثير من الأمهات كيحسّو براحة أكثر فالمشي والوقوف.",
  },
  {
    q: "شنو الهدية المجانية؟",
    a: "ميزان حرارة رقمي سريع القياس (DARCARE) — مفيد لتتبع الحرارة فالدار. مجاني مع كل طلب، بلا درهم زايد.",
  },
  {
    q: "من أي شهر نقدر نلبسوه؟",
    a: "من لي يبدا البطن يبان (تقريباً من الشهر الرابع) حتى آخر الحمل — حسب راحتك ونصيحة الطبيب.",
  },
  {
    q: "واش كاين الدفع عند الاستلام؟",
    a: "نعم. ما كخلص والو دابا. كتخلص 199 درهم كاش ملي يوصلك الطلب.",
  },
  {
    q: "كم مدة التوصيل؟",
    a: "24–48 ساعة للمدن الكبرى، و2–4 أيام لباقي مدن المغرب.",
  },
  {
    q: "شنو كاين فالعلبة؟",
    a: "حزام دعم الحمل + ميزان الحرارة الرقمي (هدية). تعليمات الاستعمال حسب المنتج.",
  },
] as const;
