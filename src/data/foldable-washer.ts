/** Foldable 9L mini washing machine + filtered shower head gift — PDP constants. */

export const FOLDABLE_WASHER_SLUG = "foldable-9l-mini-washing-machine";
export const FOLDABLE_WASHER_PRICE_MAD = 399;
export const FOLDABLE_WASHER_COMPARE_MAD = 649;
/** CodPlus marketplace SKU (PRD-A08247F9). */
export const FOLDABLE_WASHER_SKU = "FoldableWasher";
/** Internal gift key for order grouping; CodPlus SKU is {@link FOLDABLE_WASHER_GIFT_SKU}. */
export const FOLDABLE_WASHER_GIFT_ID = "gift-filtered-shower-head";
/** CodPlus marketplace SKU for the free shower head gift (PRD-9A095FB2). */
export const FOLDABLE_WASHER_GIFT_SKU = "ShowerFilter";
/** CodPlus pack name/SKU: 1× FoldableWasher + 1× ShowerFilter — must match seller Packs → Name exactly. */
export const FOLDABLE_WASHER_CODPLUS_PACK_SKU = "FoldableWasher ShowerFilter Pack";

const BASE = `/products/${FOLDABLE_WASHER_SLUG}`;

/** Bust long-lived immutable cache after replacing placeholder JPGs with real photos. */
export const FOLDABLE_WASHER_ASSET_VERSION = "20250926-real";

function foldableWasherAsset(file: string): string {
  return `${BASE}/${file}?v=${FOLDABLE_WASHER_ASSET_VERSION}`;
}

export const FOLDABLE_WASHER_HERO_IMAGE = foldableWasherAsset("02-premium-hero.webp");
export const FOLDABLE_WASHER_FEATURES_IMAGE = foldableWasherAsset("10-features.webp");
export const FOLDABLE_WASHER_LIFESTYLE_IMAGE = foldableWasherAsset("03-lifestyle.webp");
export const FOLDABLE_WASHER_IN_USE_IMAGE = foldableWasherAsset("14-product-in-use.webp");
export const FOLDABLE_WASHER_INFOGRAPHIC_IMAGE = foldableWasherAsset("17-infographic.webp");
export const FOLDABLE_WASHER_GIFT_IMAGE = foldableWasherAsset("gift-filtered-shower-head.webp");

export const FOLDABLE_WASHER_FAQS = [
  {
    q: "شحال ثمن الغسالة؟",
    a: "399 درهم. الدفع عند الاستلام والتوصيل مجاني لجميع مدن المغرب. رأس الدش بالفلتر هدية مجانية بلا درهم زايد.",
  },
  {
    q: "واش فعلاً 9 لتر وقابلة للطي؟",
    a: "نعم. سعة 9 لتر للملابس الخفيفة (جوارب، ملابس رياضية، ملابس أطفال، مناشف صغيرة). كتطوى وتولّي compact باش تاخدها معاك أو تحطها فبلاصة صغيرة.",
  },
  {
    q: "واش فيها تجفيف؟",
    a: "نعم. فيها وضع تجفيف بعد الغسيل باش الملابس ما تبقاش نقية بزاف — مناسب للاستعمال اليومي السريع.",
  },
  {
    q: "شنو الهدية المجانية؟",
    a: "رأس دش يدوي مع فلتر 3mm لتنقية المياه وزيادة ضغط الماء — مجاني مع كل طلب، بلا درهم زايد.",
  },
  {
    q: "واش كاين الدفع عند الاستلام؟",
    a: "نعم. ما كخلص والو دابا. كتخلص كاش ملي يوصلك الطلب.",
  },
  {
    q: "كم مدة التوصيل؟",
    a: "24–48 ساعة للمدن الكبرى، و2–4 أيام لباقي مدن المغرب.",
  },
  {
    q: "شنو كاين فالعلبة؟",
    a: "الغسالة القابلة للطي، كابل الطاقة، ودليل الاستعمال. رأس الدش بالفلتر كيجي هدية مع الطلب.",
  },
] as const;
