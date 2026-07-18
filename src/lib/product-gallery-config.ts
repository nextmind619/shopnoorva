import type { PremiumImageType } from "@/lib/product-images/types";

export type GallerySection =
  | "hero"
  | "lifestyle"
  | "features"
  | "bluetooth"
  | "projection"
  | "gift"
  | "package"
  | "accessories"
  | "dimensions"
  | "specifications";

export interface GallerySlideConfig {
  section: GallerySection;
  imageType: PremiumImageType;
  emoji: string;
  heading: string;
  subtitle: string;
  objectFit?: "cover" | "contain";
}

export const GALLERY_SECTION_LABELS: Record<GallerySection, string> = {
  hero: "الصورة الرئيسية",
  lifestyle: "أسلوب الحياة",
  features: "المميزات",
  bluetooth: "البلوتوث",
  projection: "الإسقاط",
  gift: "هدية مثالية",
  package: "العلبة",
  accessories: "الملحقات",
  dimensions: "المقاسات",
  specifications: "المواصفات",
};

/** Astronaut Bluetooth Speaker Projector (MX003) — exact manufacturer reference images */
const ASTRONAUT_SLIDES: GallerySlideConfig[] = [
  {
    section: "hero",
    imageType: "02-premium-hero",
    emoji: "🚀",
    heading: "الصورة الرئيسية — رائد الفضاء",
    subtitle: "إسقاط مجرة حية · ريموت تحكم · 8 أصوات مهدئة · سبيكر بلوتوث",
    objectFit: "contain",
  },
  {
    section: "hero",
    imageType: "01-hero-white-bg",
    emoji: "📷",
    heading: "منظر أمامي — المنتج الأصلي",
    subtitle: "قبة سوداء عاكسة · عدسة HD · قاعدة ثابتة · خلفية احترافية",
    objectFit: "contain",
  },
  {
    section: "lifestyle",
    imageType: "03-lifestyle",
    emoji: "🏠",
    heading: "في غرفة حديثة",
    subtitle: "أجواء سينمائية فاخرة تغيّر مزاج المكان بالكامل",
    objectFit: "cover",
  },
  {
    section: "lifestyle",
    imageType: "04-bedroom",
    emoji: "🛏️",
    heading: "غرفة نوم هادئة",
    subtitle: "إضاءة ناعمة · هلال ملون · مجرة · أجواء نوم مريحة",
    objectFit: "cover",
  },
  {
    section: "features",
    imageType: "10-features",
    emoji: "🔄",
    heading: "دوران 360° — رأس مغناطيسي",
    subtitle: "رأس قابل للتدوير · ذراع متحرك · قاعدة ثابتة · عدسة HD",
    objectFit: "contain",
  },
  {
    section: "bluetooth",
    imageType: "14-product-in-use",
    emoji: "🎵",
    heading: "مكبر صوت بلوتوث مدمج",
    subtitle: "اتصال بلوتوث عبر الهاتف · تشغيل الموسيقى بجودة عالية",
    objectFit: "cover",
  },
  {
    section: "projection",
    imageType: "06-gaming-room",
    emoji: "🌌",
    heading: "9 تأثيرات سديمية",
    subtitle: "ألوان مجرة متعددة · تحكم كامل في السرعة والألوان",
    objectFit: "cover",
  },
  {
    section: "projection",
    imageType: "08-kids-room",
    emoji: "🌙",
    heading: "8 أصوات ضوضاء بيضاء مهدئة",
    subtitle: "يساعد على النوم بعمق · مياه جارية · أمواج · أغانٍ مهدئة",
    objectFit: "cover",
  },
  {
    section: "gift",
    imageType: "20-social-media-banner",
    emoji: "🎁",
    heading: "هدية مذهلة",
    subtitle: "للعائلة والأصدقاء في الأعياد وأعياد الميلاد",
    objectFit: "cover",
  },
  {
    section: "package",
    imageType: "16-packaging",
    emoji: "📦",
    heading: "المنتج مع العلبة الأصلية",
    subtitle: "Astronaut Star Light · تغليف فاخر · جاهز للإهداء",
    objectFit: "contain",
  },
  {
    section: "accessories",
    imageType: "11-package-contents",
    emoji: "🧰",
    heading: "محتويات العلبة الكاملة",
    subtitle: "بروجيكتور + ريموت أسود + كابل USB + دليل الاستخدام",
    objectFit: "contain",
  },
  {
    section: "accessories",
    imageType: "09-close-up",
    emoji: "🔧",
    heading: "منظر خلفي — أزرار التحكم",
    subtitle: "ON/OFF · Model · Light · Music/Sound · منفذ USB",
    objectFit: "contain",
  },
  {
    section: "dimensions",
    imageType: "12-dimensions",
    emoji: "📏",
    heading: "المقاسات والأبعاد",
    subtitle: "23×12×12 سم · قاعدة ثابتة · حجم مثالي لأي غرفة",
    objectFit: "contain",
  },
  {
    section: "specifications",
    imageType: "17-infographic",
    emoji: "💡",
    heading: "السطوع وسرعة الدوران",
    subtitle: "سطوع قابل للتعديل 5%–100% · 4 مستويات سرعة الدوران",
    objectFit: "cover",
  },
  {
    section: "specifications",
    imageType: "13-before-after",
    emoji: "✨",
    heading: "قبل وبعد — تحوّل الغرفة",
    subtitle: "من إضاءة عادية إلى سماء نجوم حية من أول تشغيل",
    objectFit: "cover",
  },
];

/** Generic slide builder for products without custom config */
function buildDefaultSlides(productSlug: string): GallerySlideConfig[] {
  const hasBluetooth = productSlug !== "rabbit-carousel-night-light";

  const slides: GallerySlideConfig[] = [
    {
      section: "hero",
      imageType: "02-premium-hero",
      emoji: "✨",
      heading: "الصورة الرئيسية",
      subtitle: "تصميم فاخر · جودة عالية · جاهز للطلب",
      objectFit: "contain",
    },
    {
      section: "hero",
      imageType: "01-hero-white-bg",
      emoji: "📷",
      heading: "منظر أمامي — المنتج الأصلي",
      subtitle: "صورة احترافية على خلفية بيضاء",
      objectFit: "contain",
    },
    {
      section: "lifestyle",
      imageType: "03-lifestyle",
      emoji: "🏠",
      heading: "في غرفة حديثة",
      subtitle: "أجواء سينمائية فاخرة",
      objectFit: "cover",
    },
    {
      section: "lifestyle",
      imageType: "04-bedroom",
      emoji: "🛏️",
      heading: "غرفة نوم هادئة",
      subtitle: "إضاءة ناعمة قبل النوم",
      objectFit: "cover",
    },
    {
      section: "features",
      imageType: "10-features",
      emoji: "⭐",
      heading: "المميزات الرئيسية",
      subtitle: "تقنيات مصممة لرفع تجربتك",
      objectFit: "contain",
    },
  ];

  if (hasBluetooth) {
    slides.push({
      section: "bluetooth",
      imageType: "14-product-in-use",
      emoji: "🎵",
      heading: "مكبر صوت بلوتوث مدمج",
      subtitle: "تشغيل الموسيقى عبر الهاتف بجودة عالية",
      objectFit: "cover",
    });
  }

  slides.push(
    {
      section: "projection",
      imageType: "06-gaming-room",
      emoji: "🌌",
      heading: "تأثيرات إسقاط متعددة",
      subtitle: "ألوان مجرة متعددة · تحكم كامل",
      objectFit: "cover",
    },
    {
      section: "projection",
      imageType: "08-kids-room",
      emoji: "👶",
      heading: "مثالي لغرفة الأطفال",
      subtitle: "أجواء هادئة ومريحة للنوم",
      objectFit: "cover",
    },
    {
      section: "gift",
      imageType: "20-social-media-banner",
      emoji: "🎁",
      heading: "هدية مثالية",
      subtitle: "للعائلة والأصدقاء في كل مناسبة",
      objectFit: "cover",
    },
    {
      section: "package",
      imageType: "16-packaging",
      emoji: "📦",
      heading: "العلبة الأصلية",
      subtitle: "تغليف فاخر · جاهز للإهداء",
      objectFit: "contain",
    },
    {
      section: "accessories",
      imageType: "11-package-contents",
      emoji: "🧰",
      heading: "محتويات العلبة",
      subtitle: "ريموت + كابل + دليل الاستخدام",
      objectFit: "contain",
    },
    {
      section: "accessories",
      imageType: "09-close-up",
      emoji: "🔍",
      heading: "تفاصيل المنتج",
      subtitle: "جودة بناء عالية · تحكم سهل",
      objectFit: "contain",
    },
    {
      section: "dimensions",
      imageType: "12-dimensions",
      emoji: "📏",
      heading: "المقاسات والأبعاد",
      subtitle: "حجم مثالي يناسب أي غرفة",
      objectFit: "contain",
    },
    {
      section: "specifications",
      imageType: "17-infographic",
      emoji: "📋",
      heading: "المواصفات التقنية",
      subtitle: "كل التفاصيل التي تحتاجها",
      objectFit: "cover",
    },
    {
      section: "specifications",
      imageType: "13-before-after",
      emoji: "🔄",
      heading: "قبل وبعد",
      subtitle: "الفرق واضح من أول تشغيل",
      objectFit: "cover",
    }
  );

  return slides;
}

const STAR_PROJECTOR_SLIDES: GallerySlideConfig[] = [
  {
    section: "hero",
    imageType: "02-premium-hero",
    emoji: "🌌",
    heading: "بروجيكتور المجرة والنجوم",
    subtitle: "21 وضع إضاءة · بلوتوث · ريموت بمؤقت",
    objectFit: "contain",
  },
  {
    section: "hero",
    imageType: "01-hero-white-bg",
    emoji: "📷",
    heading: "المنتج الأصلي — قبة كريستال",
    subtitle: "جسم أسود مطفي · صورة احترافية",
    objectFit: "contain",
  },
  {
    section: "lifestyle",
    imageType: "04-bedroom",
    emoji: "🛏️",
    heading: "غرفة نوم هادئة",
    subtitle: "مجرة ناعمة قبل النوم",
    objectFit: "cover",
  },
  {
    section: "lifestyle",
    imageType: "07-romantic-room",
    emoji: "💫",
    heading: "أمسية رومانسية",
    subtitle: "ألوان ناعمة لتاريخ مثالي",
    objectFit: "cover",
  },
  {
    section: "features",
    imageType: "10-features",
    emoji: "⭐",
    heading: "حتى 21 وضع إضاءة",
    subtitle: "RGBW · تعتيم · تحكم كامل",
    objectFit: "contain",
  },
  {
    section: "bluetooth",
    imageType: "05-living-room",
    emoji: "🎵",
    heading: "سبيكر بلوتوث مدمج",
    subtitle: "موسيقى من الهاتف أو USB/TF",
    objectFit: "cover",
  },
  {
    section: "projection",
    imageType: "14-product-in-use",
    emoji: "✨",
    heading: "إسقاط مجرة ونجوم",
    subtitle: "موجات ضوئية + نقاط نجوم",
    objectFit: "cover",
  },
  {
    section: "projection",
    imageType: "08-kids-room",
    emoji: "👶",
    heading: "مثالي لغرفة الأطفال",
    subtitle: "إضاءة مهدّئة وموسيقى للنوم",
    objectFit: "cover",
  },
  {
    section: "gift",
    imageType: "20-social-media-banner",
    emoji: "🎁",
    heading: "هدية مثالية",
    subtitle: "للعائلة والأصدقاء",
    objectFit: "contain",
  },
  {
    section: "package",
    imageType: "16-packaging",
    emoji: "📦",
    heading: "العلبة ومحتويات الشحنة",
    subtitle: "بروجيكتور + ريموت + كابل USB + دليل",
    objectFit: "contain",
  },
  {
    section: "accessories",
    imageType: "11-package-contents",
    emoji: "🎮",
    heading: "الريموت والملحقات",
    subtitle: "تحكم كامل من السرير",
    objectFit: "contain",
  },
  {
    section: "dimensions",
    imageType: "12-dimensions",
    emoji: "📏",
    heading: "الحجم المدمج",
    subtitle: "≈ 13.5 × 13.5 × 10 سم",
    objectFit: "contain",
  },
  {
    section: "specifications",
    imageType: "17-infographic",
    emoji: "⏰",
    heading: "مؤقت وخصائص ذكية",
    subtitle: "1س / 2س · تعتيم · DC 5V 6W",
    objectFit: "cover",
  },
  {
    section: "specifications",
    imageType: "09-close-up",
    emoji: "🔍",
    heading: "تفاصيل القبة والجسم",
    subtitle: "قبة كريستال متعددة الأوجه",
    objectFit: "contain",
  },
];

const AURORA_SLIDES: GallerySlideConfig[] = [
  {
    section: "hero",
    imageType: "02-premium-hero",
    emoji: "🌌",
    heading: "بروجيكتور الأورورا الأبيض الهندسي",
    subtitle: "أورورا + نجوم + قمر · بلوتوث · ريموت",
    objectFit: "contain",
  },
  {
    section: "hero",
    imageType: "01-hero-white-bg",
    emoji: "📷",
    heading: "التصميم الهندسي الأصلي",
    subtitle: "جسم أبيض مطفي متعدد الأوجه",
    objectFit: "contain",
  },
  {
    section: "lifestyle",
    imageType: "05-living-room",
    emoji: "🛋️",
    heading: "في غرفة المعيشة",
    subtitle: "أورورا وقمر يملآن السقف",
    objectFit: "cover",
  },
  {
    section: "lifestyle",
    imageType: "04-bedroom",
    emoji: "🛏️",
    heading: "غرفة نوم هادئة",
    subtitle: "أجواء نوم مع مؤقت 1س/2س",
    objectFit: "cover",
  },
  {
    section: "features",
    imageType: "10-features",
    emoji: "⭐",
    heading: "أوضاع ألوان متعددة",
    subtitle: "RGBW · سطوع · سرعة الإسقاط",
    objectFit: "contain",
  },
  {
    section: "bluetooth",
    imageType: "14-product-in-use",
    emoji: "🎵",
    heading: "سبيكر بلوتوث مدمج",
    subtitle: "موسيقى من الهاتف مع الأورورا",
    objectFit: "cover",
  },
  {
    section: "projection",
    imageType: "07-romantic-room",
    emoji: "🌙",
    heading: "قمر هلالي ونجوم",
    subtitle: "إسقاط مجرة كامل على الغرفة",
    objectFit: "cover",
  },
  {
    section: "projection",
    imageType: "06-gaming-room",
    emoji: "✨",
    heading: "أورورا شمالية متحركة",
    subtitle: "ألوان زرقاء وخضراء ووردية",
    objectFit: "cover",
  },
  {
    section: "gift",
    imageType: "20-social-media-banner",
    emoji: "🎁",
    heading: "هدية مثالية",
    subtitle: "للمنزل والحفلات والديكور",
    objectFit: "cover",
  },
  {
    section: "package",
    imageType: "16-packaging",
    emoji: "📦",
    heading: "العلبة ومحتويات الشحنة",
    subtitle: "بروجيكتور + ريموت أبيض + كابل USB + دليل",
    objectFit: "contain",
  },
  {
    section: "accessories",
    imageType: "11-package-contents",
    emoji: "🎮",
    heading: "الريموت والملحقات",
    subtitle: "تحكم كامل من السرير",
    objectFit: "contain",
  },
  {
    section: "dimensions",
    imageType: "12-dimensions",
    emoji: "📏",
    heading: "الحجم المدمج",
    subtitle: "≈ 16 × 9 × 10.5 سم",
    objectFit: "contain",
  },
  {
    section: "specifications",
    imageType: "17-infographic",
    emoji: "⏰",
    heading: "مؤقت وخصائص ذكية",
    subtitle: "1س / 2س · بلوتوث · USB",
    objectFit: "cover",
  },
  {
    section: "specifications",
    imageType: "09-close-up",
    emoji: "🔍",
    heading: "تفاصيل القبة والجسم",
    subtitle: "قبة شفافة · تصميم هندسي",
    objectFit: "contain",
  },
];

const PRODUCT_SLIDE_CONFIGS: Record<string, GallerySlideConfig[]> = {
  "astronaut-bt-speaker-projector": ASTRONAUT_SLIDES,
  "bluetooth-star-projector": STAR_PROJECTOR_SLIDES,
  "northern-lights-galaxy-projector": AURORA_SLIDES,
};

export function getGallerySlideConfigs(productSlug: string): GallerySlideConfig[] {
  return PRODUCT_SLIDE_CONFIGS[productSlug] ?? buildDefaultSlides(productSlug);
}
