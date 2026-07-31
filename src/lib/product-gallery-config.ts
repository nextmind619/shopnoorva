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
    imageType: "01-hero-white-bg",
    emoji: "🚀",
    heading: "الصورة الرئيسية — رائد الفضاء",
    subtitle: "إسقاط مجرة حية · ريموت تحكم · 8 أصوات مهدئة · سبيكر بلوتوث",
    objectFit: "contain",
  },
  {
    section: "hero",
    imageType: "09-close-up",
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
  const hasBluetooth =
    productSlug !== "rabbit-carousel-night-light" && productSlug !== "green-laser-pointer-303";

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
  } else {
    slides.push({
      section: "projection",
      imageType: "14-product-in-use",
      emoji: "🌌",
      heading: "إسقاط ليلي سحري",
      subtitle: "6 أفلام قابلة للتبديل · دوران 360°",
      objectFit: "cover",
    });
  }

  slides.push(
    {
      section: "projection",
      imageType: "06-gaming-room",
      emoji: "🌌",
      heading: productSlug === "rabbit-carousel-night-light" ? "6 أفلام إسقاط قابلة للتبديل" : "تأثيرات إسقاط متعددة",
      subtitle:
        productSlug === "rabbit-carousel-night-light"
          ? "نجوم · محيط · ديناصورات · عيد ميلاد · تحت الماء · غابة"
          : "ألوان مجرة متعددة · تحكم كامل",
      objectFit: "cover",
    },
    {
      section: "projection",
      imageType: "08-kids-room",
      emoji: "👶",
      heading: "مثالي لغرفة الأطفال",
      subtitle:
        productSlug === "rabbit-carousel-night-light"
          ? "5 ألوان LED ناعمة لأجواء قبل النوم"
          : "أجواء هادئة ومريحة للنوم",
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
      subtitle:
        productSlug === "rabbit-carousel-night-light"
          ? "المصباح · 6 أفلام إسقاط · دليل الاستخدام"
          : "ريموت + كابل + دليل الاستخدام",
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
    imageType: "01-hero-white-bg",
    emoji: "🌌",
    heading: "بروجيكتور المجرة والنجوم",
    subtitle: "قبة كريستال · بلوتوث · ريموت بمؤقت",
    objectFit: "cover",
  },
  {
    section: "hero",
    imageType: "02-premium-hero",
    emoji: "📷",
    heading: "أجواء الغرفة مع الإسقاط",
    subtitle: "سديم ملون + نجوم + موسيقى بلوتوث",
    objectFit: "cover",
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

/** Green Laser Pointer 303 — black & green premium gallery */
const LASER_SLIDES: GallerySlideConfig[] = [
  {
    section: "hero",
    imageType: "02-premium-hero",
    emoji: "🟢",
    heading: "الصورة الرئيسية — ليزر أخضر 303",
    subtitle: "شعاع أخضر قوي · خلفية سوداء فاخرة · تصميم احترافي",
    objectFit: "contain",
  },
  {
    section: "hero",
    imageType: "01-hero-white-bg",
    emoji: "📷",
    heading: "منظر استوديو أبيض",
    subtitle: "جسم ألومنيوم أسود · قبضة مضلّعة · حزام ومفاتيح أمان",
    objectFit: "contain",
  },
  {
    section: "lifestyle",
    imageType: "03-lifestyle",
    emoji: "🌌",
    heading: "رصد النجوم ليلاً",
    subtitle: "أشر إلى السماء بدقة في ليالي المغرب الصافية",
    objectFit: "cover",
  },
  {
    section: "lifestyle",
    imageType: "14-product-in-use",
    emoji: "⛺",
    heading: "التخييم والاستخدام الخارجي",
    subtitle: "خفيف · محمول · شعاع واضح في الظلام",
    objectFit: "cover",
  },
  {
    section: "features",
    imageType: "10-features",
    emoji: "⭐",
    heading: "نقطة خضراء + نمط نجوم",
    subtitle: "غطاء النجوم يحوّل الشعاع إلى سماء مرصّعة",
    objectFit: "contain",
  },
  {
    section: "features",
    imageType: "09-close-up",
    emoji: "🔍",
    heading: "تفاصيل الألومنيوم",
    subtitle: "قبضة مضلّعة · زر لمسي · جودة فاخرة",
    objectFit: "contain",
  },
  {
    section: "package",
    imageType: "11-package-contents",
    emoji: "📦",
    heading: "محتويات العلبة",
    subtitle: "ليزر · بطارية · USB · حزام · مفاتيح · غطاء نجوم",
    objectFit: "contain",
  },
  {
    section: "package",
    imageType: "16-packaging",
    emoji: "✨",
    heading: "عرض فاخر",
    subtitle: "أسود وأخضر — إحساس منتج احترافي",
    objectFit: "cover",
  },
  {
    section: "accessories",
    imageType: "09-close-up",
    emoji: "🔋",
    heading: "شحن USB",
    subtitle: "بطارية 18650 قابلة للشحن بلا متاعب",
    objectFit: "contain",
  },
];

const SHIATSU_SLIDES: GallerySlideConfig[] = [
  {
    section: "hero",
    imageType: "01-hero-white-bg",
    emoji: "💆",
    heading: "الصورة الرئيسية — خلفية بيضاء",
    subtitle: "أخضر غابة · حزام جلد بني · 8 عقد شياتسو سيليكون",
    objectFit: "contain",
  },
  {
    section: "hero",
    imageType: "02-premium-hero",
    emoji: "✨",
    heading: "بطل فاخر — خلفية سوداء",
    subtitle: "إضاءة استوديو · مظهر عافية راقٍ",
    objectFit: "contain",
  },
  {
    section: "lifestyle",
    imageType: "14-product-in-use",
    emoji: "😌",
    heading: "استرخاء أثناء الاستعمال",
    subtitle: "ارتياح فوري للرقبة والأكتاف",
    objectFit: "cover",
  },
  {
    section: "lifestyle",
    imageType: "07-romantic-room",
    emoji: "🧘",
    heading: "هدوء بعد يوم طويل",
    subtitle: "تدليك شياتسو بدون يدين بعد الإجهاد",
    objectFit: "cover",
  },
  {
    section: "lifestyle",
    imageType: "05-living-room",
    emoji: "🏠",
    heading: "في الصالون",
    subtitle: "تصميم أنيق يندمج مع ديكور البيت",
    objectFit: "cover",
  },
  {
    section: "features",
    imageType: "09-close-up",
    emoji: "✋",
    heading: "عقد تدليك 3D محاكاة اليد",
    subtitle: "8 أصابع سيليكون كتحرك أصابع المعالج",
    objectFit: "cover",
  },
  {
    section: "lifestyle",
    imageType: "06-gaming-room",
    emoji: "🌿",
    heading: "أجواء عافية وصحة",
    subtitle: "سبا منزلي عصري في دقائق",
    objectFit: "cover",
  },
  {
    section: "package",
    imageType: "11-package-contents",
    emoji: "📦",
    heading: "التغليف الفاخر",
    subtitle: "جاهز للإهداء · توصيل مرتّب لكل المغرب",
    objectFit: "contain",
  },
  {
    section: "lifestyle",
    imageType: "03-lifestyle",
    emoji: "🛏️",
    heading: "أسلوب حياة العافية",
    subtitle: "طقس مسائي لتهدئة الجسم والذهن",
    objectFit: "cover",
  },
];

const CAR_MOUNT_SLIDES: GallerySlideConfig[] = [
  {
    section: "hero",
    imageType: "02-premium-hero",
    emoji: "🚗",
    heading: "حامل مغناطيسي Maidsail للسيارة",
    subtitle: "MagSafe · ذراع قابل للتعديل · شفط مع قفل TIGHT/OPEN",
    objectFit: "contain",
  },
  {
    section: "hero",
    imageType: "01-hero-white-bg",
    emoji: "📷",
    heading: "صورة المنتج الأصلية",
    subtitle: "رأس مغناطيسي · ذراع متعدد المفاصل · قاعدة شفط",
    objectFit: "contain",
  },
  {
    section: "features",
    imageType: "10-features",
    emoji: "🧲",
    heading: "تثبيت مغناطيسي قوي",
    subtitle: "متوافق MagSafe والحلقات المغناطيسية",
    objectFit: "contain",
  },
  {
    section: "features",
    imageType: "09-close-up",
    emoji: "🔒",
    heading: "قفل الشفط",
    subtitle: "دوّر على TIGHT للتثبيت · OPEN للإزالة",
    objectFit: "contain",
  },
  {
    section: "lifestyle",
    imageType: "14-product-in-use",
    emoji: "📱",
    heading: "استخدام عملي في السيارة",
    subtitle: "ملاحة ومكالمات hands-free بأمان",
    objectFit: "contain",
  },
];

const DUAL_FAN_COOLER_SLIDES: GallerySlideConfig[] = [
  {
    section: "hero",
    imageType: "02-premium-hero",
    emoji: "❄️",
    heading: "تبريد أقوى بمروحتين",
    subtitle: "هواء بارد ومنعش · رذاذ تبريد فوري",
    objectFit: "contain",
  },
  {
    section: "hero",
    imageType: "01-hero-white-bg",
    emoji: "🌀",
    heading: "مبرد هواء محمول — مروحتين ورذاذ",
    subtitle: "إضاءة زرقاء · رذاذ بارد · تصميم فاخر",
    objectFit: "contain",
  },
  {
    section: "lifestyle",
    imageType: "03-lifestyle",
    emoji: "☀️",
    heading: "برودة فالصيف",
    subtitle: "على المكتب بجانب اللابتوب مع كأس ماء مثلج",
    objectFit: "cover",
  },
  {
    section: "lifestyle",
    imageType: "04-bedroom",
    emoji: "🌙",
    heading: "نوم هادئ ومنعش",
    subtitle: "إضاءة ليلية زرقاء ورذاذ لطيف بجانب السرير",
    objectFit: "cover",
  },
  {
    section: "lifestyle",
    imageType: "14-product-in-use",
    emoji: "💼",
    heading: "مثالي فالمكتب",
    subtitle: "هواء بارد أثناء العمل بدون ضجيج",
    objectFit: "cover",
  },
  {
    section: "features",
    imageType: "10-features",
    emoji: "✅",
    heading: "تبريد أقوى بمروحتين",
    subtitle: "هواء بارد · رذاذ فوري · تشغيل هادئ · قابلة للشحن",
    objectFit: "contain",
  },
  {
    section: "features",
    imageType: "09-close-up",
    emoji: "🔍",
    heading: "تفاصيل فاخرة",
    subtitle: "مروحتين · فوهات رذاذ · بلاستيك ممتاز",
    objectFit: "cover",
  },
  {
    section: "lifestyle",
    imageType: "05-living-room",
    emoji: "🧊",
    heading: "عبّي ماء وثلج",
    subtitle: "خزان علوي سهل التعبئة لتبريد أقوى",
    objectFit: "cover",
  },
  {
    section: "lifestyle",
    imageType: "06-gaming-room",
    emoji: "🎒",
    heading: "خذه معاك فين ما مشيتي",
    subtitle: "مقبض جلد · تخييم · سفر · شرفة",
    objectFit: "cover",
  },
  {
    section: "features",
    imageType: "13-before-after",
    emoji: "🔥",
    heading: "مروحة عادية vs مبرد رذاذ",
    subtitle: "هواء ساخن ولا برودة منعشة",
    objectFit: "cover",
  },
  {
    section: "dimensions",
    imageType: "12-dimensions",
    emoji: "📏",
    heading: "حجم مكتبي أنيق",
    subtitle: "مدمج وسهل الوضع على أي طاولة",
    objectFit: "contain",
  },
  {
    section: "features",
    imageType: "17-infographic",
    emoji: "🏠",
    heading: "للاستخدام فكل مكان",
    subtitle: "بيت · مكتب · غرفة · سفر · دراسة",
    objectFit: "contain",
  },
  {
    section: "lifestyle",
    imageType: "07-romantic-room",
    emoji: "👨‍👩‍👧",
    heading: "راحة للعائلة كاملة",
    subtitle: "صيف منعش للوالدين والأطفال",
    objectFit: "cover",
  },
];

const MOSQUITO_TENT_SLIDES: GallerySlideConfig[] = [
  {
    section: "hero",
    imageType: "02-premium-hero",
    emoji: "🛏️",
    heading: "خيمة حماية من الناموس",
    subtitle: "قابلة للطي · تركيب سريع · فتحة سحّاب U",
    objectFit: "cover",
  },
  {
    section: "hero",
    imageType: "01-hero-white-bg",
    emoji: "🦟",
    heading: "شبكة دقيقة وإطار مرن",
    subtitle: "حماية كاملة للسرير الزوجي",
    objectFit: "cover",
  },
  {
    section: "features",
    imageType: "10-features",
    emoji: "⚡",
    heading: "تركيب في ثوانٍ",
    subtitle: "تصميم pop-up قابل للطي مع حقيبة حمل",
    objectFit: "cover",
  },
  {
    section: "features",
    imageType: "09-close-up",
    emoji: "🔒",
    heading: "سحّاب جانبي واسع",
    subtitle: "دخول وخروج سهل بلا إزعاج",
    objectFit: "cover",
  },
  {
    section: "lifestyle",
    imageType: "14-product-in-use",
    emoji: "🌙",
    heading: "نوم هادئ بلا لدغات",
    subtitle: "مثالية للصيف والبيوت والرحلات",
    objectFit: "cover",
  },
];

const CAR_FAN_SUNSHADE_SLIDES: GallerySlideConfig[] = [
  {
    section: "hero",
    imageType: "02-premium-hero",
    emoji: "🚗",
    heading: "باك 2 في 1 للسيارة",
    subtitle: "مروحتين + مظلة شمس أمامية قابلة للطي",
    objectFit: "cover",
  },
  {
    section: "hero",
    imageType: "01-hero-white-bg",
    emoji: "☀️",
    heading: "حماية من الشمس وهواء منعش",
    subtitle: "249 درهم · توصيل مجاني والدفع عند الاستلام",
    objectFit: "cover",
  },
  {
    section: "features",
    imageType: "10-features",
    emoji: "🌂",
    heading: "مظلة عاكسة قابلة للطي",
    subtitle: "تصميم مظلة · وجه فضي · حقيبة حمل",
    objectFit: "cover",
  },
  {
    section: "features",
    imageType: "09-close-up",
    emoji: "💨",
    heading: "مروحة مزدوجة للوحة القيادة",
    subtitle: "رأسان قابلان للتوجيه · تدفق هواء أقوى",
    objectFit: "cover",
  },
  {
    section: "lifestyle",
    imageType: "14-product-in-use",
    emoji: "🅿️",
    heading: "مثالي فالصيف",
    subtitle: "وقوف تحت الشمس أو تنقل يومي",
    objectFit: "cover",
  },
];

const PRODUCT_SLIDE_CONFIGS: Record<string, GallerySlideConfig[]> = {
  "astronaut-bt-speaker-projector": ASTRONAUT_SLIDES,
  "bluetooth-star-projector": STAR_PROJECTOR_SLIDES,
  "northern-lights-galaxy-projector": AURORA_SLIDES,
  "green-laser-pointer-303": LASER_SLIDES,
  "shiatsu-neck-shoulder-massager": SHIATSU_SLIDES,
  "magnetic-car-phone-mount-maidsail": CAR_MOUNT_SLIDES,
  "car-dual-fan-foldable-sunshade-2in1-pack": CAR_FAN_SUNSHADE_SLIDES,
  "foldable-mosquito-bed-tent": MOSQUITO_TENT_SLIDES,
  "portable-rechargeable-dual-fan-air-cooler": DUAL_FAN_COOLER_SLIDES,
};

export function getGallerySlideConfigs(productSlug: string): GallerySlideConfig[] {
  return PRODUCT_SLIDE_CONFIGS[productSlug] ?? buildDefaultSlides(productSlug);
}
