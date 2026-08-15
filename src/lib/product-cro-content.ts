import type { LucideIcon } from "lucide-react";
import {
  Sparkles,
  Moon,
  Music2,
  Wifi,
  Gift,
  Film,
  Baby,
  Palette,
  Timer,
  Zap,
  Crosshair,
  Shield,
  BatteryCharging,
  Feather,
  Heart,
  Thermometer,
  Activity,
  Home,
  Flame,
} from "lucide-react";
import type { PremiumImageType } from "@/lib/product-images/types";

export type CroHowToStep = {
  step: string;
  title: string;
  desc: string;
  imageKey: PremiumImageType | null;
};

export type CroComparison = {
  oursLabel: string;
  rows: { label: string; us: true | string; them: false | string }[];
};

export type CroBenefitBlock = {
  icon: LucideIcon;
  title: string;
  desc: string;
};

export type CroProductContent = {
  headline: { title: string; subtitle: string };
  midCtaLabels: [string, string, string];
  howTo: CroHowToStep[];
  comparison: CroComparison;
  benefits: CroBenefitBlock[];
  videoSrc?: string;
};

const SHARED_TRUST_ROWS: CroComparison["rows"] = [
  { label: "الدفع عند الاستلام في المغرب", us: true, them: "نادر" },
  { label: "ضمان + استبدال عند العيب", us: true, them: "محدود" },
];

export const PRODUCT_CRO: Record<string, CroProductContent> = {
  "astronaut-bt-speaker-projector": {
    headline: {
      title: "حوّل غرفتك إلى مجرة… مع موسيقى بلوتوث في جهاز واحد",
      subtitle:
        "بروجيكتور رائد فضاء أبيض يعرض نجوم وسديم على السقف، وسبيكر مدمج يشتغل من هاتفك — مثالي للنوم، الأطفال، والديكور.",
    },
    midCtaLabels: [
      "جاهز تحوّل غرفتك الليلة؟",
      "السعر واضح — والطلب في دقيقة",
      "باش ما تتردّدش — الدفع غير ملي يوصلك",
    ],
    howTo: [
      {
        step: "1",
        title: "جهّز المكان",
        desc: "ضع رائد الفضاء على سطح ثابت في غرفة مظلمة نسبياً لترى الإسقاط بوضوح.",
        imageKey: "03-lifestyle",
      },
      {
        step: "2",
        title: "شغّل الجهاز",
        desc: "وصّل Type-C، شغّل البروجيكتور، ووجّه الخوذة نحو السقف أو الجدار.",
        imageKey: "09-close-up",
      },
      {
        step: "3",
        title: "اربط البلوتوث",
        desc: "من هاتفك اختر السبيكر، شغّل موسيقاك المفضّلة، واستمتع بالمجرة مع الصوت.",
        imageKey: "05-living-room",
      },
      {
        step: "4",
        title: "تحكّم بالريموت",
        desc: "غيّر الألوان، السطوع، والوضع من الريموت وأنت مرتاح في سريرك.",
        imageKey: "04-bedroom",
      },
    ],
    comparison: {
      oursLabel: "رائد الفضاء MX003",
      rows: [
        { label: "إسقاط مجرة HD على السقف", us: true, them: false },
        { label: "سبيكر بلوتوث مدمج", us: true, them: false },
        { label: "ريموت تحكم عن بعد", us: true, them: "أحياناً" },
        { label: "تصميم أنيق يزيّن الغرفة حتى وهو مطفي", us: true, them: false },
        ...SHARED_TRUST_ROWS,
      ],
    },
    benefits: [
      {
        icon: Sparkles,
        title: "حوّل غرفتك لمجرة في ثوانٍ",
        desc: "بدل إضاءة باهتة، غطّ السقف والجدران بألوان سديم ونجوم تتحرك — أجواء سينمائية بلا تجهيز معقّد.",
      },
      {
        icon: Music2,
        title: "موسيقى من هاتفك بدون أسلاك",
        desc: "اتصل بالبلوتوث خلال ثوانٍ واستمع وأنت مسترخٍ — البروجيكتور والإضاءة والموسيقى في جهاز واحد.",
      },
      {
        icon: Moon,
        title: "روتين نوم أهدأ",
        desc: "إضاءة ناعمة تساعد على تهدئة الأجواء قبل النوم — مثالي للبالغين والأطفال.",
      },
      {
        icon: Wifi,
        title: "تحكم وأنت في السرير",
        desc: "الريموت يخلّيك تغيّر الألوان والوضع بلا ما تقوم — راحة حقيقية كل مساء.",
      },
      {
        icon: Gift,
        title: "هدية تُفتح… وتُحكى",
        desc: "تصميم رائد فضاء أبيض أنيق يبهر من أول نظرة — هدية جاهزة للعائلة أو الأصدقاء.",
      },
    ],
    videoSrc: "/videos/astronaut-product-demo.mp4",
  },

  "bluetooth-star-projector": {
    headline: {
      title: "21 وضع إضاءة… غرفتك تصير مجرة مع موسيقى بلوتوث",
      subtitle:
        "قبة كريستال شفافة تعرض نجوم وموجات ملونة، سبيكر مدمج، وريموت بمؤقت 1س/2س — مثالي للنوم والحفلات والديكور.",
    },
    midCtaLabels: [
      "بغيتي غرفة بأجواء مجرة الليلة؟",
      "21 وضع إضاءة — والطلب عند الاستلام",
      "خلص كاش عند الباب — بلا دفع مسبق",
    ],
    howTo: [
      {
        step: "1",
        title: "حطّو فغرفة مظلمة",
        desc: "وجّه القبة نحو السقف أو الجدار باش يبان الإسقاط بقوة.",
        imageKey: "03-lifestyle",
      },
      {
        step: "2",
        title: "وصّل USB وشغّل",
        desc: "الطاقة عبر USB DC 5V. شغّل من الزر أو الريموت واختار الوضع والسطوع.",
        imageKey: "09-close-up",
      },
      {
        step: "3",
        title: "اربط الموسيقى",
        desc: "بلوتوث من الهاتف، أو USB/TF حسب الجهاز — والإضاءة كتكمل الأجواء.",
        imageKey: "05-living-room",
      },
      {
        step: "4",
        title: "فعّل المؤقت قبل النوم",
        desc: "من الريموت اختار 1 ساعة أو 2 ساعة باش ينطفي وحده وأنت ناعس.",
        imageKey: "04-bedroom",
      },
    ],
    comparison: {
      oursLabel: "بروجيكتور المجرة",
      rows: [
        { label: "حتى 21 وضع إضاءة ملونة", us: true, them: false },
        { label: "سبيكر بلوتوث + USB/TF", us: true, them: false },
        { label: "ريموت بمؤقت إيقاف تلقائي", us: true, them: false },
        { label: "قبة كريستال وإسقاط نجوم", us: true, them: "ضعيف" },
        ...SHARED_TRUST_ROWS,
      ],
    },
    benefits: [
      {
        icon: Palette,
        title: "غيّر مزاج الغرفة بضغطة زر",
        desc: "من نجوم هادئة لألوان حفلات — حتى 21 وضعاً باش تناسب النوم، السهرة، أو الديكور.",
      },
      {
        icon: Music2,
        title: "موسيقى مع الإضاءة في جهاز واحد",
        desc: "بلوتوث سريع من هاتفك، أو USB/TF — ما تحتاجيش سبيكر إضافي.",
      },
      {
        icon: Timer,
        title: "نعس مرتاح… والجهاز كينطفي وحده",
        desc: "مؤقت 1س أو 2س من الريموت — مثالي لروتين النوم بلا ما تقوم.",
      },
      {
        icon: Sparkles,
        title: "قبة كريستال… إسقاط يبان فاخر",
        desc: "موجات ضوئية ونجوم على السقف تعطي إحساس سينمائي من أول تشغيل.",
      },
      {
        icon: Gift,
        title: "هدية عملية وكتحمّق",
        desc: "مناسبة للعائلة، الأطفال، أو أي واحد بغي يبدّل أجواء غرفته بسهولة.",
      },
    ],
  },

  "northern-lights-galaxy-projector": {
    headline: {
      title: "أورورا متحركة + قمر ونجوم… غرفتك تصير سينما هادئة",
      subtitle:
        "تصميم أبيض هندسي أنيق، سبيكر بلوتوث، وريموت بمؤقت — أجواء فاخرة للنوم والديكور بلا ما تبدّل الأثاث.",
    },
    midCtaLabels: [
      "بغيتي سقف غرفتك يتحوّل لمجرة؟",
      "أورورا وقمر — والطلب عند الاستلام",
      "دفع غير ملي يوصلك — بلا مخاطرة",
    ],
    howTo: [
      {
        step: "1",
        title: "حطّو فمكان ثابت",
        desc: "غرفة مظلمة نسبياً، ووجّه القبة الشفافة نحو السقف لأفضل إسقاط.",
        imageKey: "03-lifestyle",
      },
      {
        step: "2",
        title: "وصّل وشغّل",
        desc: "كابل USB/Type-C من العلبة. شغّل من الأزرار أو الريموت الأبيض.",
        imageKey: "09-close-up",
      },
      {
        step: "3",
        title: "اختار الأورورا والسطوع",
        desc: "عدّل الألوان والسرعة من الريموت حتى تلقى الأجواء اللي بغيتي.",
        imageKey: "04-bedroom",
      },
      {
        step: "4",
        title: "بلوتوث + مؤقت النوم",
        desc: "شغّل موسيقاك، وفعّل مؤقت 1س أو 2س باش ينطفي أوتوماتيكياً.",
        imageKey: "05-living-room",
      },
    ],
    comparison: {
      oursLabel: "بروجيكتور الأورورا",
      rows: [
        { label: "أورورا شمالية متحركة", us: true, them: false },
        { label: "قمر هلالي + نجوم دقيقة", us: true, them: false },
        { label: "سبيكر بلوتوث مدمج", us: true, them: false },
        { label: "تصميم أبيض هندسي أنيق", us: true, them: false },
        { label: "ريموت بمؤقت 1س/2س", us: true, them: "أحياناً" },
        ...SHARED_TRUST_ROWS,
      ],
    },
    benefits: [
      {
        icon: Sparkles,
        title: "سقفك يتحوّل لأورورا حقيقية",
        desc: "موجات ملونة متحركة مع نجوم وقمر هلالي — إحساس سينمائي بلا ديكور غالي.",
      },
      {
        icon: Moon,
        title: "نوم أهدأ بأجواء ناعمة",
        desc: "إضاءة مهدّئة تناسب الروتين الليلي — مع مؤقت باش ينطفي وأنت ناعس.",
      },
      {
        icon: Music2,
        title: "موسيقى بلوتوث من السرير",
        desc: "وصّل هاتفك واستمع مع الأورورا — تجربة كاملة في جهاز واحد.",
      },
      {
        icon: Wifi,
        title: "تحكم كامل من الريموت الأبيض",
        desc: "ألوان، سطوع، سرعة، ومؤقت — بلا ما تقوم من بلاصتك.",
      },
      {
        icon: Gift,
        title: "قطعة ديكور… وهدية فاخرة",
        desc: "التصميم الهندسي الأبيض كيبان أنيق حتى مطفي — مثالي كهدية.",
      },
    ],
  },

  "rabbit-carousel-night-light": {
    headline: {
      title: "خلي طفلك ينعس بهدوء… كاروسيل أرانب وإسقاط سحري",
      subtitle:
        "أرانب دوّارة 360°، 6 أفلام إسقاط قابلة للتبديل، و5 ألوان LED ناعمة — تشغيل USB والدفع عند الاستلام.",
    },
    midCtaLabels: [
      "بغيتي ليلة هادئة لطفلك؟",
      "6 أفلام إسقاط — والطلب عند الباب",
      "خلصي كاش ملي يوصلك — بلا دفع دابا",
    ],
    howTo: [
      {
        step: "1",
        title: "حطّيه فوق الكومودينو",
        desc: "سطح ثابت بجانب السرير، ووصلّيه USB (شاحن، باور بانك، أو لابتوب).",
        imageKey: "03-lifestyle",
      },
      {
        step: "2",
        title: "شغّلي اللون والدوران",
        desc: "اختاري من 5 ألوان LED، وفعّلي دوران الكاروسيل 360° لأجواء مهدّئة.",
        imageKey: "09-close-up",
      },
      {
        step: "3",
        title: "بدّلي فيلم الإسقاط",
        desc: "انزعي الغطاء، بدّلي قرص الفيلم (نجوم، محيط، ديناصورات…)، وأعيدي التركيب في ثوانٍ.",
        imageKey: "04-bedroom",
      },
      {
        step: "4",
        title: "عدّلي السطوع وارتاحي",
        desc: "سطوع ناعم يناسب النوم — طفلك كيشوف عالم سحري وأنتِ مرتاحة البال.",
        imageKey: "08-kids-room",
      },
    ],
    comparison: {
      oursLabel: "كاروسيل الأرانب",
      rows: [
        { label: "أرانب دوّارة 360°", us: true, them: false },
        { label: "6 أفلام إسقاط قابلة للتبديل", us: true, them: false },
        { label: "5 ألوان LED ناعمة", us: true, them: "لون واحد" },
        { label: "تشغيل USB مرن", us: true, them: "محدود" },
        { label: "تصميم وردي أنيق كهدية", us: true, them: false },
        ...SHARED_TRUST_ROWS,
      ],
    },
    benefits: [
      {
        icon: Baby,
        title: "تهدئة قبل النوم بلا خوف من الظلام",
        desc: "إضاءة ناعمة وعالم إسقاط سحري كيساعد الطفل ينعس بهدوء وأنتِ مرتاحة.",
      },
      {
        icon: Film,
        title: "6 عوالم مختلفة… كل ليلة قصة جديدة",
        desc: "نجوم، محيط، ديناصورات، عيد ميلاد، تحت الماء، وغابة حيوانات — بدّلي القرص في ثوانٍ.",
      },
      {
        icon: Sparkles,
        title: "كاروسيل دوّار يبهر الأطفال",
        desc: "أرانب كيدورو 360° فوق القاعدة — لحظة سحرية كل مساء فوق الكومودينو.",
      },
      {
        icon: Palette,
        title: "5 ألوان… اختاري الجو المناسب",
        desc: "من وردي ناعم لأوضاع ألوان متعددة مع تعديل السطوع حسب رغبة الطفل.",
      },
      {
        icon: Gift,
        title: "هدية تُفتح وتُحبّ",
        desc: "تصميم وردي فاخر جاهز كهدية لغرفة الأطفال أو لأي مناسبة عائلية.",
      },
    ],
  },

  "green-laser-pointer-303": {
    headline: {
      title: "شعاع أخضر فائق القوة… دقة ومدى بعيد في يدك",
      subtitle:
        "ليزر 303 بجسم ألومنيوم أسود، بطارية 18650 قابلة للشحن، وحزام أمان — مثالي للفلك، التخييم، العروض والاستخدام المهني.",
    },
    midCtaLabels: [
      "بغيتي ليزر احترافي اليوم؟",
      "199 درهم بدل 299 — توفير واضح",
      "خلص كاش عند الباب — بلا مخاطرة",
    ],
    howTo: [
      {
        step: "1",
        title: "اشحن البطارية",
        desc: "وصّل كابل USB وشحن بطارية 18650 حتى تمتلئ قبل أول استخدام.",
        imageKey: "09-close-up",
      },
      {
        step: "2",
        title: "ركّب وفعّل الأمان",
        desc: "أدخل البطارية، وفعّل مفتاح الأمان إن وُجد، وثبّت حزام اليد.",
        imageKey: "11-package-contents",
      },
      {
        step: "3",
        title: "فعّل الشعاع الأخضر",
        desc: "اضغط الزر اللمسي للحصول على نقطة خضراء دقيقة بمدى بعيد.",
        imageKey: "02-premium-hero",
      },
      {
        step: "4",
        title: "جرّب غطاء النجوم",
        desc: "ثبّت غطاء النجوم لإنشاء أنماط سماء مرصّعة — مثالي للّيل والتخييم.",
        imageKey: "14-product-in-use",
      },
    ],
    comparison: {
      oursLabel: "ليزر أخضر 303 NOORVA",
      rows: [
        { label: "شعاع أخضر قوي بمدى بعيد", us: true, them: "ضعيف" },
        { label: "جسم ألومنيوم احترافي", us: true, them: "بلاستيك" },
        { label: "بطارية 18650 قابلة للشحن USB", us: true, them: false },
        { label: "حزام يد + مفاتيح أمان + غطاء نجوم", us: true, them: false },
        { label: "تصميم أسود فاخر وقبضة مضلّعة", us: true, them: false },
        ...SHARED_TRUST_ROWS,
      ],
    },
    benefits: [
      {
        icon: Zap,
        title: "شعاع أخضر فائق القوة",
        desc: "نقطة خضراء واضحة وحيّة تظهر بقوة حتى من مسافات بعيدة — مثالية للّيل والعروض.",
      },
      {
        icon: Crosshair,
        title: "دقة عالية ومدى بعيد",
        desc: "وجّه النجوم، الشرائح، أو نقاط الميدان بدقة احترافية بلا أدوات ثقيلة.",
      },
      {
        icon: Shield,
        title: "جسم ألومنيوم قوي",
        desc: "سبيكة ألومنيوم سوداء مطفية مع قبضة مضلّعة مانعة للانزلاق للاستخدام اليومي.",
      },
      {
        icon: BatteryCharging,
        title: "شحن USB بلا متاعب",
        desc: "بطارية 18650 قابلة للشحن — وداعًا للبطاريات المستهلكة في كل خروج.",
      },
      {
        icon: Feather,
        title: "خفيف ومحمول",
        desc: "تصميم قلم أنيق مع حزام يد — خذه معك للفلك، التخييم، أو الاجتماعات بسهولة.",
      },
    ],
  },
  // Arabic CRO for Shiatsu (ProductPageAr)
  "shiatsu-neck-shoulder-massager": {
    headline: {
      title: "رخي رقبتك وكتافك في دقائق",
      subtitle:
        "تدليك شياتسو 3D محاكاة اليد مع تدفئة مدمجة — استرخاء عميق للرقبة والأكتاف والظهر في البيت.",
    },
    midCtaLabels: [
      "بغيتي ترتاح الليلة؟",
      "399 درهم بدل 549 — سعر تخفيض",
      "خلص كاش عند الباب — بلا مخاطرة",
    ],
    howTo: [
      {
        step: "1",
        title: "حط الجهاز",
        desc: "ضع المساج حول الرقبة أو على المنطقة المتوترة (أكتاف، ظهر، خصر).",
        imageKey: "03-lifestyle",
      },
      {
        step: "2",
        title: "اضبط السانات",
        desc: "شدّ الأحزمة القابلة للتعديل بشكل مريح باش يبقا ثابت.",
        imageKey: "09-close-up",
      },
      {
        step: "3",
        title: "شغّل التدليك",
        desc: "فعّل شياتسو 3D والدوران التلقائي باش يفكّ التقلّص.",
        imageKey: "14-product-in-use",
      },
      {
        step: "4",
        title: "فعّل التدفئة",
        desc: "زيد الدفء اللطيف 10–15 دقيقة لاسترخاء أعمق.",
        imageKey: "10-features",
      },
    ],
    comparison: {
      oursLabel: "تدليك شياتسو NOORVA",
      rows: [
        { label: "تدليك شياتسو 3D محاكاة اليد", us: true, them: "اهتزاز بسيط" },
        { label: "تدفئة مدمجة", us: true, them: false },
        { label: "سانات قابلة للتعديل", us: true, them: "محدود" },
        { label: "صامت وسهل الحمل", us: true, them: false },
        { label: "جودة فاخرة", us: true, them: "عادي" },
        { label: "الدفع عند الاستلام في المغرب", us: true, them: "نادر" },
        { label: "ضمان + استبدال", us: true, them: "محدود" },
      ],
    },
    benefits: [
      {
        icon: Heart,
        title: "استرخاء عميق",
        desc: "فكّ تقلّص الرقبة والأكتاف في دقائق بعد يوم طويل في المكتب أو الطريق.",
      },
      {
        icon: Activity,
        title: "تخفيف الألم",
        desc: "عجن شياتسو 3D بـ 8 أصابع سيليكون كيضرب المناطق المتقلّصة لراحة أطول.",
      },
      {
        icon: Thermometer,
        title: "دفء مريح",
        desc: "التدفئة المدمجة كتحسّن الإحساس بالعافية والدورة الدموية المحلية.",
      },
      {
        icon: Zap,
        title: "طقس يومي",
        desc: "10–15 دقيقة فالعشية كافية ترجع خفيف ومرتاح.",
      },
      {
        icon: Gift,
        title: "هدية فاخرة",
        desc: "مثالية للوالدين والشركاء والزملاء — عافية جاهزة للإهداء.",
      },
    ],
  },
  "portable-rechargeable-dual-fan-air-cooler": {
    headline: {
      title: "برّد مكتبك بمروحتين — ريح أقوى ومساحة أوسع",
      subtitle:
        "مبرد هواء محمول قابل للشحن، تصميم برج أبيض أنيق، تدفق هواء قوي — مثالي للعمل والدراسة فالصيف.",
    },
    midCtaLabels: [
      "بغيتي تهرب من الحر فالمكتب؟",
      "249 درهم — مروحتين بلا تكييف طول النهار",
      "خلص كاش عند الباب — بلا مخاطرة",
    ],
    howTo: [
      {
        step: "1",
        title: "املأ الماء",
        desc: "عبّي خزان الماء حسب الدليل باش يخدم التبريد التبخيري.",
        imageKey: "05-living-room",
      },
      {
        step: "2",
        title: "شحن الجهاز",
        desc: "وصّل USB وشحن البطارية قبل ما تبدأ يومك.",
        imageKey: "09-close-up",
      },
      {
        step: "3",
        title: "شغّل المروحتين",
        desc: "حطّه على مكتب مستقر واستمتع بتدفق هواء واسع ورذاذ بارد.",
        imageKey: "02-premium-hero",
      },
      {
        step: "4",
        title: "خذه معاك",
        desc: "شريط الحمل كيخلّيك تنقلو بسهولة بين الغرفة والمكتب.",
        imageKey: "06-gaming-room",
      },
    ],
    comparison: {
      oursLabel: "مبرد NOORVA بمروحتين",
      rows: [
        { label: "مروحتان لتدفق أقوى", us: true, them: "مروحة واحدة" },
        { label: "قابل للشحن USB", us: true, them: "سلك دائم غالبًا" },
        { label: "تصميم برج مكتبي أنيق", us: true, them: "عادي" },
        { label: "شريط حمل محمول", us: true, them: false },
        { label: "249 درهم", us: true, them: "أغلى" },
        ...SHARED_TRUST_ROWS,
      ],
    },
    benefits: [
      {
        icon: Zap,
        title: "ريح أقوى",
        desc: "مروحتين عموديتين كيوزّعو الهواء على مساحة أوسع من مروحة واحدة.",
      },
      {
        icon: BatteryCharging,
        title: "قابل للشحن",
        desc: "شحن USB — استعملو على المكتب أو بجانب السرير بلا ما يبقى معلّق على المقبس.",
      },
      {
        icon: Feather,
        title: "خفيف ومحمول",
        desc: "شريط حمل عملي وتصميم برج ما كياخدش بزاف ديال البلاصة.",
      },
      {
        icon: Thermometer,
        title: "برد منعش",
        desc: "مثالي فالصيف للعمل، الدراسة، أو الراحة بلا ما تشعل التكييف كامل النهار.",
      },
      {
        icon: Gift,
        title: "هدية صيفية",
        desc: "عملي ومفيد — هدية مناسبة للعائلة والزملاء فموسم الحر.",
      },
    ],
  },

  "vintage-led-lantern": {
    headline: {
      title: "بدّل جو دارك بلمسة وحدة ✨",
      subtitle: "فانوس LED بستايل كلاسيكي كيخلي أي بلاصة دافئة ومميزة",
    },
    midCtaLabels: [
      "ماشي غير ضو… هاد الفانوس كيعطيك جو دافئ وأنيق",
      "اختار العرض ديالك — قطعة أو جوج بأحسن ثمن",
      "🛒 بغيتو دابا — الدفع عند الاستلام",
    ],
    howTo: [
      {
        step: "1",
        title: "حطّو فبلاصة مناسبة",
        desc: "طاولة، رف، تراس أو طاولة تخييم — أي بلاصة بغيتي تزيّنها.",
        imageKey: "05-living-room",
      },
      {
        step: "2",
        title: "شغّل الإضاءة",
        desc: "اضغط على زر التشغيل فالقاعدة باش يولّي الفانوس كيضوي.",
        imageKey: "09-close-up",
      },
      {
        step: "3",
        title: "اضبط الجو",
        desc: "استعمل المقبض باش تختار شدة الإضاءة اللي كتريحك.",
        imageKey: "02-premium-hero",
      },
      {
        step: "4",
        title: "استمتع بالأجواء",
        desc: "صالون، غرفة نوم، تراس أو حديقة — جو دافئ فأي وقت.",
        imageKey: "03-lifestyle",
      },
    ],
    comparison: {
      oursLabel: "فانوس NOORVA LED",
      rows: [
        { label: "إضاءة دافئة كهرمانية", us: true, them: "ضوء بارد عادي" },
        { label: "ستايل Vintage Hurricane", us: true, them: "تصميم عادي" },
        { label: "ديكور + إضاءة فمنتج واحد", us: true, them: "واحد منهم" },
        { label: "عرض جوج بـ 319 درهم", us: true, them: false },
        ...SHARED_TRUST_ROWS,
      ],
    },
    benefits: [
      {
        icon: Flame,
        title: "إضاءة دافئة ✨",
        desc: "كيعطي جو مريح ودافئ خصوصاً فالليل.",
      },
      {
        icon: Sparkles,
        title: "ستايل كلاسيكي 🏮",
        desc: "الشكل ديالو Vintage كيضيف لمسة مميزة لأي بلاصة.",
      },
      {
        icon: Home,
        title: "لدار وبرا 🌙",
        desc: "مناسب للصالون، التراس، الحديقة وحتى الخرجات.",
      },
      {
        icon: Gift,
        title: "اختيار زوين للهدية 🎁",
        desc: "كيجمع بين الديكور والاستعمال فمنتج واحد.",
      },
    ],
  },

  "warm-led-decor-lamp": {
    headline: {
      title: "ضو دافئ كيبدل جو دارك ✨",
      subtitle: "مصباح LED أنيق بستايل عصري، مناسب للبيت وغرفة النوم وكيعطي جو هادئ ومريح.",
    },
    midCtaLabels: [
      "الإضاءة كتقدر تبدل الجو كامل — جرّب هاد المصباح",
      "اختار العرض المناسب ليك — واحد أو جوج",
      "🛒 بغيتو دابا — الدفع عند الاستلام",
    ],
    howTo: [
      {
        step: "1",
        title: "حطّو فبلاصة مناسبة",
        desc: "كومودينو، طاولة صالون أو مكتب — أي بلاصة بغيتي تزيّنها.",
        imageKey: "04-bedroom",
      },
      {
        step: "2",
        title: "شغّل الإضاءة",
        desc: "اضغط على زر التشغيل فالقاعدة الذهبية.",
        imageKey: "09-close-up",
      },
      {
        step: "3",
        title: "استمتع بالجو",
        desc: "ضو دافئ وجو هادئ — مثالي لليل.",
        imageKey: "07-romantic-room",
      },
    ],
    comparison: {
      oursLabel: "مصباح NOORVA LED",
      rows: [
        { label: "إضاءة دافئة ومريحة", us: true, them: "ضوء بارد عادي" },
        { label: "تصميم أنيق وعصري", us: true, them: "تصميم عادي" },
        { label: "ديكور + إضاءة فمنتج واحد", us: true, them: "واحد منهم" },
        { label: "عرض جوج بـ 299 درهم", us: true, them: false },
        ...SHARED_TRUST_ROWS,
      ],
    },
    benefits: [
      {
        icon: Sparkles,
        title: "إضاءة دافئة ✨",
        desc: "كتعطي جو هادئ ومريح.",
      },
      {
        icon: Home,
        title: "ديكور أنيق 🏠",
        desc: "كيزيد لمسة زوينة لأي بلاصة.",
      },
      {
        icon: Moon,
        title: "مثالي لغرفة النوم 🌙",
        desc: "جو هادئ ومناسب للراحة.",
      },
      {
        icon: Gift,
        title: "فكرة هدية 🎁",
        desc: "هدية بسيطة وأنيقة.",
      },
    ],
  },
};

export function getProductCroContent(slug: string): CroProductContent | null {
  return PRODUCT_CRO[slug] ?? null;
}
