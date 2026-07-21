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
    videoSrc: "/videos/astronaut-ugc-tiktok-ad.mp4",
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
};

export function getProductCroContent(slug: string): CroProductContent | null {
  return PRODUCT_CRO[slug] ?? null;
}
