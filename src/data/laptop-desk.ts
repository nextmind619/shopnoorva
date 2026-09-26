/** Mobile adjustable laptop desk — PDP constants, gallery URLs, gift. */

export const LAPTOP_DESK_SLUG = "mobile-laptop-desk-with-wheels";
export const LAPTOP_DESK_PRICE_MAD = 399;
export const LAPTOP_DESK_GIFT_ID = "gift-waterproof-messenger-bag-usb";

const BASE = `/products/${LAPTOP_DESK_SLUG}`;

export const LAPTOP_DESK_HERO_IMAGE = `${BASE}/02-premium-hero.webp`;
export const LAPTOP_DESK_HERO_WHITE_IMAGE = `${BASE}/01-hero-white-bg.webp`;
export const LAPTOP_DESK_FEATURES_IMAGE = `${BASE}/10-features.webp`;
export const LAPTOP_DESK_LIFESTYLE_IMAGE = `${BASE}/03-lifestyle.webp`;
export const LAPTOP_DESK_IN_USE_IMAGE = `${BASE}/14-product-in-use.webp`;
export const LAPTOP_DESK_INFOGRAPHIC_IMAGE = `${BASE}/17-infographic.webp`;
export const LAPTOP_DESK_GIFT_IMAGE = `${BASE}/gift-crossbody-bag.webp`;

export const LAPTOP_DESK_FAQS = [
  {
    q: "شحال ثمن الطاولة؟",
    a: "399 درهم. الدفع عند الاستلام والتوصيل مجاني لجميع مدن المغرب. الهدية (حقيبة كتف) مجانية بلا درهم زايد.",
  },
  {
    q: "واش الارتفاع كيتعدّل؟",
    a: "نعم. الطاولة فيها نظام باش تعلّي أو تنقّص الارتفاع حسب الكرسي، الكنبة، أو السرير.",
  },
  {
    q: "واش العجلات كيخدمو؟",
    a: "نعم. 4 عجلات مع قفل باش تحرّك الطاولة بسهولة وتثبّتها ملي توصل للبلاصة اللي بغيت.",
  },
  {
    q: "شنو الهدية المجانية؟",
    a: "حقيبة كتف رجالية مقاومة للماء مع منفذ USB خارجي (للشحن من power bank داخل الحقيبة). الهدية مجانية وما غادي تخلص عليها حتى درهم زايد.",
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
    a: "طاولة لابتوب متحركة (سطح خشبي + هيكل أبيض + عجلات) ودليل التركيب. الهدية كتجي مع الطلب.",
  },
] as const;
