import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { products, getProductBySlug, getReviewsForProduct } from "@/data/products";
import { ProductPageClient } from "@/components/product/product-page-client";
import { JsonLd } from "@/components/seo/json-ld";
import { SITE_URL } from "@/lib/site";
import { buildRelatedProductCards } from "@/lib/catalog/to-product-cards";

import { resolveProductHero } from "@/lib/product-images/resolve";
import { CURVES_GLOW_FAQS } from "@/data/curves-glow-faqs";
import { BT12_FAQS, BT12_SLUG } from "@/data/bt12";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

/** SSG + long CDN cache — product copy changes redeploy via build */
export const revalidate = 86400;

const SHIATSU_SLUG = "shiatsu-neck-shoulder-massager";
const CALCULATOR_SLUG = "solar-calculator-lcd-notepad";
const VACUUM_SLUG = "cordless-mini-vacuum-keyboard";
const KIDS_ART_SLUG = "kids-art-set-easel-208";
const EGG_BOILER_SLUG = "mini-egg-boiler";
const CURVES_GLOW_SLUG = "proteine-curve-collagen-glow";

const SHIATSU_KEYWORDS = [
  "جهاز تدليك الرقبة",
  "تدليك شياتسو",
  "مساج الكتفين",
  "تدفئة",
  "استرخاء",
  "عافية",
  "الدفع عند الاستلام",
  "NOORVA",
  "shiatsu",
  "massage",
];

const CALCULATOR_KEYWORDS = [
  "آلة حاسبة",
  "آلة حاسبة إلكترونية",
  "آلة حاسبة للطلاب",
  "آلة حاسبة مع لوح كتابة",
  "آلة حاسبة للدراسة",
  "آلة حاسبة للمكتب",
  "لوح كتابة إلكتروني",
  "الدفع عند الاستلام",
  "NOORVA",
];

const VACUUM_KEYWORDS = [
  "مكنسة لاسلكية",
  "مكنسة كيبورد",
  "تنظيف الكيبورد",
  "مكنسة صغيرة",
  "شفط الغبار",
  "إلكترونيات",
  "الدفع عند الاستلام",
  "NOORVA",
];

const KIDS_ART_KEYWORDS = [
  "مجموعة الرسم والتلوين",
  "Arabic Magic Book",
  "طقم رسم للأطفال",
  "طقم تلوين",
  "حامل رسم",
  "208 قطعة",
  "أقلام تلوين",
  "هدية أطفال",
  "299 درهم",
  "الدخول المدرسي",
  "الدفع عند الاستلام",
  "NOORVA",
];

const EGG_BOILER_KEYWORDS = [
  "جهاز طهي البيض",
  "جهاز سلق البيض",
  "طهي البيض الكهربائي",
  "فطور الصباح",
  "صباح المدرسة",
  "الدفع عند الاستلام",
  "المغرب",
  "NOORVA",
];

const BT12_KEYWORDS = [
  "عصا سيلفي",
  "BT12",
  "ترايبود",
  "ضوء سيلفي",
  "ريموت لاسلكي",
  "349 درهم",
  "الدفع عند الاستلام",
  "NOORVA",
];

const CURVES_GLOW_KEYWORDS = [
  "بروتين الشكل الأنثوي",
  "بروتين curves",
  "كولاجين بحري",
  "كولاجين هدية",
  "Pack Curves & Glow",
  "روتين جمال",
  "399 درهم",
  "الدفع عند الاستلام",
  "المغرب",
  "NOORVA",
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};

  const hero = resolveProductHero(product);
  const canonical = `${SITE_URL}/ar/products/${product.slug}`;
  const isShiatsu = product.slug === SHIATSU_SLUG;
  const isCalculator = product.slug === CALCULATOR_SLUG;
  const isVacuum = product.slug === VACUUM_SLUG;
  const isKidsArt = product.slug === KIDS_ART_SLUG;
  const isEggBoiler = product.slug === EGG_BOILER_SLUG;
  const isCurvesGlow = product.slug === CURVES_GLOW_SLUG;
  const isBt12 = product.slug === BT12_SLUG;
  const title = product.seo.title.ar;
  const description = product.seo.description.ar;
  const ogLocale = "ar_MA";
  const name = product.name.ar;
  const imageAlt = isCalculator
    ? "آلة حاسبة إلكترونية مع لوح كتابة إلكتروني وقلم للطالب والمكتب"
    : isVacuum
      ? "مكنسة لاسلكية صغيرة لتنظيف الكيبورد والإلكترونيات"
      : isKidsArt
        ? "طقم رسم للأطفال 208 قطعة مع حامل مدمج وحقيبة زرقاء"
        : isEggBoiler
          ? "جهاز كهربائي لطهي البيض أصفر مع غطاء شفاف وزر أحمر"
          : isCurvesGlow
            ? "Pack Curves & Glow — بروتين الشكل الأنثوي مع كولاجين بحري هدية"
            : isBt12
              ? "عصا سيلفي BT12 4 في 1 مع ترايبود وضوئين دائريين وريموت لاسلكي"
              : name;

  return {
    title,
    description,
    keywords: isShiatsu
      ? [...SHIATSU_KEYWORDS, ...product.tags]
      : isCalculator
        ? [...CALCULATOR_KEYWORDS, ...product.tags]
        : isVacuum
          ? [...VACUUM_KEYWORDS, ...product.tags]
          : isKidsArt
            ? [...KIDS_ART_KEYWORDS, ...product.tags]
            : isEggBoiler
              ? [...EGG_BOILER_KEYWORDS, ...product.tags]
              : isCurvesGlow
                ? [...CURVES_GLOW_KEYWORDS, ...product.tags]
                : isBt12
                  ? [...BT12_KEYWORDS, ...product.tags]
                  : product.tags,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      images: [{ url: hero, alt: imageAlt }],
      locale: ogLocale,
      type: "website",
      url: canonical,
      siteName: "NOORVA",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [hero],
    },
  };
}

function getProductFaqs(slug: string, warrantyMonths: number) {
  if (slug === BT12_SLUG) {
    return [...BT12_FAQS];
  }

  if (slug === CURVES_GLOW_SLUG) {
    return CURVES_GLOW_FAQS;
  }

  if (slug === SHIATSU_SLUG) {
    return [
      {
        q: "التوصيل المجاني — شحال كياخد؟",
        a: "نعم، التوصيل مجاني لجميع مدن المغرب: 24–48 ساعة للمدن الكبرى، و2–4 أيام لباقي المدن.",
      },
      {
        q: "الدفع عند الاستلام — خاصني نخلص دابا؟",
        a: "لا. الدفع عند الاستلام فقط (كاش عند الباب). تطلب بلا بطاقة بنكية وتخلّص ملي يوصلك الطلب.",
      },
      {
        q: "الضمان — شنو كيغطي؟",
        a: `ضمان ${warrantyMonths} شهر على عيوب التصنيع، مع استبدال خلال 7 أيام إذا كان هناك عيب.`,
      },
      {
        q: "طريقة الاستعمال — كيفاش كنستعملو؟",
        a: "حط الجهاز حول الرقبة أو على المنطقة اللي بغيتي تدليكها، اضبط السانات، وشغّلو حسب تعليمات الاستعمال. استعمل التدفئة حسب راحتك إذا كانت متوفرة.",
      },
      {
        q: "التدفئة — واش آمنة؟",
        a: "التدفئة المدمجة كتزيد إحساس دافئ ومريح. استعملها حسب راحتك وتعليمات المنتج، وقدر تطفيها في أي وقت.",
      },
      {
        q: "التنظيف — كيفاش نحتفظ بيه؟",
        a: "افصل الجهاز من الكهرباء وامسحو بقطعة قماش ناعمة رطبة قليلاً. ما تغطسوش في الماء أبدًا.",
      },
      {
        q: "الإرجاع — واش يمكن نرجع المنتج؟",
        a: "نعم. تواصل معنا على واتساب خلال 14 يومًا إذا كان هناك عيب مصنعي.",
      },
    ];
  }

  if (slug === "northern-lights-galaxy-projector") {
    return [
      {
        q: "هل يوجد الدفع عند الاستلام؟",
        a: "نعم، الدفع عند الاستلام فقط. تطلب بلا بطاقة بنكية وتخلّص كاش ملي يوصلك الطلب.",
      },
      {
        q: "شنو الفرق ديال هاد البروجيكتور؟",
        a: "جسم أبيض هندسي متعدد الأوجه يعرض أورورا شمالية مع نجوم وقمر هلالي، مع سبيكر بلوتوث وريموت أبيض.",
      },
      {
        q: "واش فيه بلوتوث؟",
        a: "نعم، سبيكر بلوتوث مدمج لتشغيل الموسيقى من الهاتف.",
      },
      {
        q: "كيفاش كيخدم المؤقت؟",
        a: "من الريموت الأبيض تقدّر تختار مؤقت إيقاف 1 ساعة أو 2 ساعة.",
      },
      {
        q: "شنو كاين في العلبة؟",
        a: "البروجيكتور، الريموت الأبيض، كابل USB/Type-C، ودليل الاستخدام.",
      },
      {
        q: "كم مدة التوصيل وهل فيه ضمان؟",
        a: `24-48 ساعة للمدن الكبرى، 2-4 أيام لباقي المدن. ضمان ${warrantyMonths} شهر واستبدال خلال 7 أيام عند وجود عيب.`,
      },
    ];
  }

  if (slug === "rabbit-carousel-night-light") {
    return [
      {
        q: "هل يوجد الدفع عند الاستلام؟",
        a: "نعم، الدفع عند الاستلام فقط. تطلبين بلا بطاقة بنكية وتخلّصي كاش ملي يوصلك الطلب.",
      },
      {
        q: "واش الأرانب كيدورو؟",
        a: "نعم، كاروسيل دوّار 360° مع تماثيل أرانب باش يخلق أجواء سحرية قبل النوم.",
      },
      {
        q: "شحال ديال أفلام الإسقاط؟",
        a: "6 أفلام قابلة للتبديل: سماء نجوم، عالم المحيط، أرض الديناصورات، عيد ميلاد سعيد، خيال تحت الماء، وغابة الحيوانات.",
      },
      {
        q: "كيفاش كيشتغل؟",
        a: "تشغيل عبر USB — تقدري توصّليه بالشاحن أو باور بانك أو اللابتوب. فيه 5 ألوان LED وتعديل سطوع.",
      },
      {
        q: "كيفاش نبدّل فيلم الإسقاط؟",
        a: "انزعي غطاء المصباح، دوّري كأس الإضاءة، بدّلي قرص الفيلم، ثم أعيدي التركيب — ثواني فقط.",
      },
      {
        q: "شنو كاين فالعلبة؟",
        a: "مصباح الكاروسيل الوردي، 6 أقراص أفلام إسقاط، ودليل الاستخدام (محتويات العلبة: 4 عناصر حسب المواصفات).",
      },
      {
        q: "كم مدة التوصيل وهل فيه ضمان؟",
        a: `24-48 ساعة للمدن الكبرى، 2-4 أيام لباقي المدن. ضمان ${warrantyMonths} شهر واستبدال خلال 7 أيام عند وجود عيب.`,
      },
    ];
  }

  if (slug === "green-laser-pointer-303") {
    return [
      {
        q: "هل يوجد الدفع عند الاستلام؟",
        a: "نعم، الدفع عند الاستلام فقط. تطلب بلا بطاقة بنكية وتخلّص كاش ملي يوصلك الطلب.",
      },
      {
        q: "واش التوصيل مجاني؟",
        a: "نعم، التوصيل مجاني لجميع مدن المغرب.",
      },
      {
        q: "كيفاش كتشحن البطارية؟",
        a: "البطارية من نوع 18650 وقابلة للشحن عبر كابل USB الموجود في العلبة.",
      },
      {
        q: "شنو مدى الشعاع؟",
        a: "الشعاع الأخضر قوي وواضح لمسافات بعيدة — مناسب للفلك، التخييم، والعروض المهنية.",
      },
      {
        q: "واش فيه ضمان؟",
        a: `نعم، ضمان ${warrantyMonths} شهر على عيوب التصنيع، مع استبدال خلال 7 أيام عند وجود عيب.`,
      },
      {
        q: "كيفاش كنستعملو بسلامة؟",
        a: "لا توجّه الشعاع نحو العيون أو الطائرات أو المركبات. استعمل مفاتيح الأمان وحزام اليد، وفعّله فقط عند الحاجة.",
      },
      {
        q: "واش يمكن الإرجاع؟",
        a: "نعم، تواصل معنا على واتساب خلال 14 يومًا إذا كان هناك عيب مصنعي.",
      },
      {
        q: "شنو كاين فالعلبة؟",
        a: "ليزر أخضر 303، بطارية 18650، كابل USB، حزام يد مع مفاتيح أمان، غطاء نجوم، ودليل الاستخدام.",
      },
      {
        q: "كم مدة التوصيل؟",
        a: `24-48 ساعة للمدن الكبرى، 2-4 أيام لباقي المدن. ضمان ${warrantyMonths} شهر.`,
      },
    ];
  }

  if (slug.includes("magnetic-car-phone-mount")) {
    return [
      {
        q: "هل يوجد الدفع عند الاستلام؟",
        a: "نعم، الدفع عند الاستلام فقط. تطلب بلا بطاقة بنكية وتخلّص كاش ملي يوصلك الطلب.",
      },
      {
        q: "واش التوصيل مجاني؟",
        a: "نعم، التوصيل مجاني لجميع مدن المغرب.",
      },
      {
        q: "كيفاش كنركّبو؟",
        a: "نظّف السطح، ضع قاعدة الشفط واضغط، دوّر الحلقة على TIGHT. ثبّت الهاتف على الرأس المغناطيسي واضبط الذراع. للإزالة، دوّر على OPEN.",
      },
      {
        q: "واش كيتوافق مع MagSafe؟",
        a: "نعم، الرأس حلقة مغناطيسية كبيرة متوافقة مع MagSafe والحلقات المغناطيسية لجميع الهواتف.",
      },
      {
        q: "فين كنثبّتو؟",
        a: "على لوحة القيادة أو الزجاج الأمامي/الجانبي. القفل TIGHT/OPEN كيخلي الشفط ثابت حتى فالمطبات.",
      },
      {
        q: "شنو كاين فالعلبة؟",
        a: "حامل هاتف مغناطيسي للسيارة ودليل الاستخدام.",
      },
      {
        q: "كم مدة التوصيل وهل فيه ضمان؟",
        a: `24-48 ساعة للمدن الكبرى، 2-4 أيام لباقي المدن. ضمان ${warrantyMonths} شهر واستبدال خلال 7 أيام عند وجود عيب.`,
      },
    ];
  }

  if (slug === "magnetic-car-phone-holder-1-plus-1") {
    return [
      {
        q: "واش العرض فعلاً فيه جوج قطع؟",
        a: "نعم. كتخلص ثمن قطعة وحدة وكتحصل على القطعة الثانية مجاناً — جوج حاملات في الطلب.",
      },
      {
        q: "هل يوجد الدفع عند الاستلام؟",
        a: "نعم، الدفع عند الاستلام فقط. تطلب بلا بطاقة بنكية وتخلّص كاش ملي يوصلك الطلب.",
      },
      {
        q: "واش التوصيل مجاني؟",
        a: "نعم، التوصيل مجاني لجميع مدن المغرب.",
      },
      {
        q: "كيفاش كنركّبو؟",
        a: "نظّف السطح، ضع قاعدة الشفط واضغط، دوّر الحلقة على TIGHT. ثبّت الهاتف على الرأس المغناطيسي واضبط الذراع. للإزالة، دوّر على OPEN.",
      },
      {
        q: "واش كيتوافق مع MagSafe؟",
        a: "نعم، الرأس حلقة مغناطيسية كبيرة متوافقة مع MagSafe والحلقات المغناطيسية لجميع الهواتف.",
      },
      {
        q: "فين كنثبّتو؟",
        a: "على لوحة القيادة أو الزجاج الأمامي/الجانبي. القفل TIGHT/OPEN كيخلي الشفط ثابت حتى فالمطبات.",
      },
      {
        q: "شنو كاين فالعلبة؟",
        a: "حاملان مغناطيسيان للسيارة (1 مدفوع + 1 مجاناً) ودليل الاستخدام.",
      },
      {
        q: "كم مدة التوصيل وهل فيه ضمان؟",
        a: `24-48 ساعة للمدن الكبرى، 2-4 أيام لباقي المدن. ضمان ${warrantyMonths} شهر واستبدال خلال 7 أيام عند وجود عيب.`,
      },
    ];
  }

  if (slug === "solar-helicopter-car-air-freshener") {
    return [
      {
        q: "هل يوجد الدفع عند الاستلام؟",
        a: "نعم، الدفع عند الاستلام فقط. تطلب بلا بطاقة بنكية وتخلّص كاش ملي يوصلك الطلب.",
      },
      {
        q: "واش التوصيل مجاني؟",
        a: "نعم، التوصيل مجاني لجميع مدن المغرب.",
      },
      {
        q: "كيفاش كيخدم؟",
        a: "حطّو على وسط الطابلوه قدام الزجاج. الشمس كتشغّل دوران الشفرات، والرائحة كتخرج من فتحات القاعدة الحمراء.",
      },
      {
        q: "واش خاصو بطاريات؟",
        a: "لا. الطاقة شمسية — الشفرات كيدورو مع ضوء الشمس بلا بطاريات وبلا شحن.",
      },
      {
        q: "شنو كيعطي المنتج؟",
        a: "جوج في واحد: معطر كيعطي راحة فالمقصورة، وهليكوبتر كروم ديكور أنيق فوق الطابلوه.",
      },
      {
        q: "شنو الثمن؟",
        a: "169 درهم بدل 229 درهم. توصيل مجاني والدفع عند الاستلام.",
      },
      {
        q: "شنو كاين فالعلبة؟",
        a: "معطر سيارة شمسي بشكل هليكوبتر.",
      },
      {
        q: "كم مدة التوصيل وهل فيه ضمان؟",
        a: `24-48 ساعة للمدن الكبرى، 2-4 أيام لباقي المدن. ضمان ${warrantyMonths} شهر واستبدال خلال 7 أيام عند وجود عيب.`,
      },
    ];
  }

  if (slug === "foldable-car-windshield-sunshade") {
    return [
      {
        q: "هل يوجد الدفع عند الاستلام؟",
        a: "نعم، الدفع عند الاستلام فقط. تطلب بلا بطاقة بنكية وتخلّص كاش ملي يوصلك الطلب.",
      },
      {
        q: "واش التوصيل مجاني؟",
        a: "نعم، التوصيل مجاني لجميع مدن المغرب.",
      },
      {
        q: "كيفاش كنركّبها؟",
        a: "افتحها كالمظلة من المقبض، ثبّتها من داخل السيارة على الزجاج الأمامي والوجه الفضي للخارج. المقبض يرتكز على الطابلوه.",
      },
      {
        q: "واش كتخدم على جميع السيارات؟",
        a: "نعم، الشكل المستطيل مناسب لمعظم الزجاج الأمامي للسيارات السياحية. تطوى بسهولة إذا كان الزجاج أصغر.",
      },
      {
        q: "شنو الثمن؟",
        a: "149 درهم بدل 229 درهم. توصيل مجاني والدفع عند الاستلام.",
      },
      {
        q: "شنو كاين فالعلبة؟",
        a: "مظلة شمس أمامية قابلة للطي وحقيبة حمل جلد أسود.",
      },
      {
        q: "كم مدة التوصيل وهل فيه ضمان؟",
        a: `24-48 ساعة للمدن الكبرى، 2-4 أيام لباقي المدن. ضمان ${warrantyMonths} شهر واستبدال خلال 7 أيام عند وجود عيب.`,
      },
    ];
  }

  if (slug === "warm-led-decor-lamp") {
    return [
      {
        q: "واش الدفع عند الاستلام؟",
        a: "نعم، الدفع عند الاستلام فقط. تطلب بلا بطاقة بنكية وتخلّص كاش ملي يوصلك الطلب.",
      },
      {
        q: "فين كيوصل المنتج؟",
        a: "كنوصّلو لجميع المدن المغربية. التوصيل مجاني والدفع عند الاستلام.",
      },
      {
        q: "شنو هو الثمن؟",
        a: "مصباح واحد بـ199 درهم، أو جوج مصابيح بـ299 درهم (كتوفر 99 درهم).",
      },
      {
        q: "نقدر ناخد جوج؟",
        a: "أكيد! عرض جوج مصابيح بـ299 درهم هو الأكثر طلباً — كتوفر 99 درهم مقارنة بشراء جوج بشكل منفصل.",
      },
      {
        q: "كيفاش نأكد الطلب؟",
        a: "عمّر المعلومات فالفورم (الاسم، الهاتف، المدينة والعنوان) واضغط «أكد الطلب ديالك». غادي نتاصلوا بيك باش نأكدو الطلب.",
      },
    ];
  }

  if (slug === "solar-calculator-lcd-notepad") {
    return [
      {
        q: "واش كتخدم بالطاقة الشمسية؟",
        a: "نعم. فيها لوحة شمسية فوق شاشة الحاسبة، وتشغيل مزدوج للاستخدام اليومي.",
      },
      {
        q: "واش فيها لوح للكتابة؟",
        a: "نعم. لوح كتابة إلكتروني مدمج على يمين الحاسبة، تقدر تكتب عليه الملاحظات والحسابات.",
      },
      {
        q: "واش كيجي معها القلم؟",
        a: "نعم. كيجي معها قلم Stylus باش تكتب على اللوح.",
      },
      {
        q: "واش نقدر نمسح الكتابة؟",
        a: "نعم. تقدر تمسح الكتابة بسهولة من اللوح وتعاود تكتب من جديد.",
      },
      {
        q: "واش مناسبة للتلاميذ والطلبة؟",
        a: "نعم. مناسبة للتلاميذ والطلبة والأساتذة — حساب وتمارين وملاحظات فـ جهاز واحد.",
      },
      {
        q: "واش نقدر نستعملها فالخدمة؟",
        a: "نعم. مناسبة للموظفين وأصحاب المكاتب وأي شخص كيدير الحسابات يومياً.",
      },
      {
        q: "شحال مدة التوصيل؟",
        a: "24–48 ساعة للمدن الكبرى، و2–4 أيام لباقي المدن. التوصيل لجميع مدن المغرب.",
      },
      {
        q: "واش كاين الدفع عند الاستلام؟",
        a: "نعم. الدفع عند الاستلام فقط. ما كخلص والو دابا — كتخلص كاش ملي توصلك الطلبية.",
      },
      {
        q: "واش التوصيل مجاني؟",
        a: "نعم، التوصيل مجاني لجميع مدن المغرب.",
      },
    ];
  }

  if (slug === VACUUM_SLUG) {
    return [
      {
        q: "واش لاسلكية؟",
        a: "نعم. مكنسة صغيرة لاسلكية قابلة للشحن عبر USB. ما كتحتاجش فيشة وأنت كتخدم.",
      },
      {
        q: "واش تنظّف الكيبورد مزيان؟",
        a: "نعم. الفوهة الطويلة مع الفرشاة كتدخل بين الأزرار وكتشفط الغبار والفتات من الكيبورد واللاب توب.",
      },
      {
        q: "شنو كيجي فالعلبة؟",
        a: "المكنسة، فوهة ضيقة للشقوق، رأس فرشاة، وكابل شحن USB.",
      },
      {
        q: "واش نقدر نستعملها فالسيارة؟",
        a: "نعم. مناسبة لفتحات التهوية، الكونسول، والمساحات الضيقة فالسيارة.",
      },
      {
        q: "كيفاش كتشحن؟",
        a: "كتشحن بكابل USB. وصّلها بالشاحن، الباور بانك، أو اللاب توب.",
      },
      {
        q: "واش 2 في 1؟",
        a: "نعم. شفط الغبار + رأس فرشاة لتنظيف الإلكترونيات والأسطح الدقيقة.",
      },
      {
        q: "شحال مدة التوصيل؟",
        a: "24–48 ساعة للمدن الكبرى، و2–4 أيام لباقي المدن. التوصيل لجميع مدن المغرب.",
      },
      {
        q: "واش كاين الدفع عند الاستلام؟",
        a: "نعم. الدفع عند الاستلام فقط. ما كخلص والو دابا — كتخلص كاش ملي توصلك الطلبية.",
      },
      {
        q: "واش التوصيل مجاني؟",
        a: "نعم، التوصيل مجاني لجميع مدن المغرب.",
      },
    ];
  }

  if (slug === KIDS_ART_SLUG) {
    return [
      {
        q: "شحال عدد القطع؟",
        a: "208 قطعة داخل حقيبة وحدة: ماركر، أقلام تلوين، ألوان شمع، باستيل، ألوان مائية، فرشاة، ممحاة ومبراة.",
      },
      {
        q: "واش فيه حامل رسم؟",
        a: "نعم. حامل أبيض ينفتح فالوسط مع كلابين أسودين باش تثبّت الورقة وهو كيرسم.",
      },
      {
        q: "لمن مناسب؟",
        a: "مناسب للأطفال من سن الروض والابتدائي — هدية لعيد الميلاد، الدخول المدرسي، أو وقت الفراغ فالدار.",
      },
      {
        q: "واش كيتفرّق الألوان؟",
        a: "لا. كل أداة عندها تجويف مقولب. منين يسالي الرسم، كيرجع كل لون لبلاصتو وطاوي الحقيبة.",
      },
      {
        q: "واش كاتطوى؟",
        a: "نعم. حقيبة بلاستيك زرقاء قابلة للطي بمقبض. كتفتح لستوديو وكتطوى باش تتخزّن أو تسافر.",
      },
      {
        q: "شنو كيجي فالعلبة؟",
        a: "مجموعة الرسم والتلوين (208 قطعة مع حامل) + Arabic Magic Book هدية مجانية (4 كتب تعليمية + قلم سحري). السعر: 299 درهم.",
      },
      {
        q: "شحال ثمن العرض؟",
        a: "299 درهم فقط — مجموعة الرسم والتلوين + Arabic Magic Book هدية مجانية. التوصيل مجاني والدفع عند الاستلام.",
      },
      {
        q: "شحال مدة التوصيل؟",
        a: "24–48 ساعة للمدن الكبرى، و2–4 أيام لباقي المدن. التوصيل لجميع مدن المغرب.",
      },
      {
        q: "واش كاين الدفع عند الاستلام؟",
        a: "نعم. الدفع عند الاستلام فقط. ما كخلص والو دابا — كتخلص كاش ملي توصلك الطلبية.",
      },
      {
        q: "واش التوصيل مجاني؟",
        a: "نعم، التوصيل مجاني لجميع مدن المغرب.",
      },
    ];
  }

  if (slug === EGG_BOILER_SLUG) {
    return [
      {
        q: "هل يوجد الدفع عند الاستلام؟",
        a: "نعم، الدفع عند الاستلام فقط. تطلب بلا بطاقة بنكية وتخلّص كاش ملي يوصلك الطلب.",
      },
      {
        q: "واش التوصيل مجاني؟",
        a: "نعم، التوصيل مجاني لجميع مدن المغرب.",
      },
      {
        q: "كيفاش كنستعملو؟",
        a: "حط البيض فالصينية (حتى 7 بيضات)، شغّل الزر الأحمر فالواجهة، وخليه يكمل عملية الطهي حسب إعدادات الجهاز. الغطاء الشفاف كيخلّيك تشوف البيض.",
      },
      {
        q: "شحال السعة؟",
        a: "الصينية البيضاء ظاهرة فيها حتى 7 بيضات: واحدة فالوسط وستة من حولها.",
      },
      {
        q: "شحال نقدر نشري؟",
        a: "كاين عرض قطعة بـ199 درهم، جوج قطع بـ299 درهم، أو 3 قطع بـ399 درهم.",
      },
      {
        q: "شنو كاين فالعلبة؟",
        a: "جهاز طهي البيض الكهربائي وكأس قياس صغير ظاهر في صور المنتج.",
      },
      {
        q: "كم مدة التوصيل وهل فيه ضمان؟",
        a: `24-48 ساعة للمدن الكبرى، 2-4 أيام لباقي المدن. ضمان ${warrantyMonths} شهر واستبدال خلال 7 أيام عند وجود عيب.`,
      },
    ];
  }

  return [];
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug } = await params;
  setRequestLocale("ar");

  const product = getProductBySlug(slug);
  if (!product) notFound();

  const relatedCards = buildRelatedProductCards(product, 4);
  const defaultVariant = product.variants[0];
  const hero = resolveProductHero(product);
  const reviewPool = getReviewsForProduct(product.id);
  const clientReviews =
    product.slug === "mini-egg-boiler" || product.slug === BT12_SLUG
      ? reviewPool.filter((r) => r.productId === product.id)
      : reviewPool;
  const productUrl = `${SITE_URL}/ar/products/${product.slug}`;
  const productFaqs = getProductFaqs(product.slug, product.warrantyMonths || 12);
  const isShiatsu = product.slug === SHIATSU_SLUG;
  const isCalculator = product.slug === CALCULATOR_SLUG;
  const isVacuum = product.slug === VACUUM_SLUG;
  const isKidsArt = product.slug === KIDS_ART_SLUG;
  const isEggBoiler = product.slug === EGG_BOILER_SLUG;
  const reviews =
    isShiatsu || product.slug === CURVES_GLOW_SLUG ? getReviewsForProduct(product.id) : [];
  const eggOffers = isEggBoiler
    ? {
        "@type": "AggregateOffer",
        lowPrice: "199",
        highPrice: "399",
        priceCurrency: "MAD",
        offerCount: 3,
        availability: defaultVariant.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        url: productUrl,
        priceValidUntil: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString().slice(0, 10),
        itemCondition: "https://schema.org/NewCondition",
        offers: product.variants.map((v) => ({
          "@type": "Offer",
          name: v.name.ar,
          sku: v.sku,
          price: v.price,
          priceCurrency: "MAD",
          availability: v.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
          url: productUrl,
        })),
      }
    : {
        "@type": "Offer",
        price: defaultVariant.price,
        priceCurrency: "MAD",
        availability: defaultVariant.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        url: productUrl,
        priceValidUntil: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString().slice(0, 10),
        itemCondition: "https://schema.org/NewCondition",
        shippingDetails:
          isShiatsu || isCalculator || isVacuum || isKidsArt || isEggBoiler || product.slug === BT12_SLUG
            ? {
                "@type": "OfferShippingDetails",
                shippingRate: { "@type": "MonetaryAmount", value: "0", currency: "MAD" },
                shippingDestination: { "@type": "DefinedRegion", addressCountry: "MA" },
              }
            : undefined,
      };

  return (
    <>
      <link rel="preload" as="image" href={hero} fetchPriority="high" />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: product.name.ar,
          description: product.description.ar,
          image: [hero],
          sku: product.sku,
          brand: { "@type": "Brand", name: "NOORVA" },
          color: isShiatsu
            ? "أخضر غابة"
            : isCalculator || isVacuum
              ? "أسود مطفي"
              : isKidsArt
                ? "أزرق سماوي"
                : isEggBoiler
                  ? "أصفر فاقع"
                  : product.slug === BT12_SLUG
                    ? "أسود"
                    : undefined,
          material: isShiatsu ? "ABS + جلد PU + سيليكون غذائي" : isKidsArt ? "بلاستيك ABS" : undefined,
          offers: eggOffers,
          ...(product.reviewCount > 0
            ? {
                aggregateRating: {
                  "@type": "AggregateRating",
                  ratingValue: product.rating,
                  reviewCount: product.reviewCount,
                  bestRating: "5",
                  worstRating: "1",
                },
              }
            : {}),
          ...(reviews.length > 0
            ? {
                review: reviews.slice(0, 10).map((r) => ({
                  "@type": "Review",
                  author: { "@type": "Person", name: r.author },
                  datePublished: r.date,
                  reviewRating: {
                    "@type": "Rating",
                    ratingValue: r.rating,
                    bestRating: "5",
                    worstRating: "1",
                  },
                  name: r.title.ar,
                  reviewBody: r.content.ar,
                })),
              }
            : {}),
        }}
      />
      {productFaqs.length > 0 && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: productFaqs.map((faq) => ({
              "@type": "Question",
              name: faq.q,
              acceptedAnswer: {
                "@type": "Answer",
                text: faq.a,
              },
            })),
          }}
        />
      )}
      <ProductPageClient product={product} relatedCards={relatedCards} reviews={clientReviews} />
    </>
  );
}
