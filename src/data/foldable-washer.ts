/** Foldable 9L mini washing machine + filtered shower head gift — PDP constants. */

export const FOLDABLE_WASHER_SLUG = "foldable-9l-mini-washing-machine";
export const FOLDABLE_WASHER_PRICE_MAD = 449;
export const FOLDABLE_WASHER_COMPARE_MAD = 649;
export const FOLDABLE_WASHER_GIFT_ID = "gift-filtered-shower-head";

const BASE = `/products/${FOLDABLE_WASHER_SLUG}`;

export const FOLDABLE_WASHER_HERO_IMAGE = `${BASE}/02-premium-hero.webp`;
export const FOLDABLE_WASHER_FEATURES_IMAGE = `${BASE}/10-features.webp`;
export const FOLDABLE_WASHER_LIFESTYLE_IMAGE = `${BASE}/03-lifestyle.webp`;
export const FOLDABLE_WASHER_IN_USE_IMAGE = `${BASE}/14-product-in-use.webp`;
export const FOLDABLE_WASHER_INFOGRAPHIC_IMAGE = `${BASE}/17-infographic.webp`;
export const FOLDABLE_WASHER_GIFT_IMAGE = `${BASE}/gift-filtered-shower-head.webp`;

export const FOLDABLE_WASHER_FAQS = [
  {
    q: "شحال ثمن الغسالة؟",
    a: "449 درهم. الدفع عند الاستلام والتوصيل مجاني لجميع مدن المغرب. رأس الدش بالفلتر هدية مجانية بلا درهم زايد.",
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
