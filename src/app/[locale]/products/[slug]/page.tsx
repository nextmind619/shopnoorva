import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { products, getProductBySlug, getProductById, getReviewsForProduct } from "@/data/products";
import { ProductPageClient } from "@/components/product/product-page-client";
import { JsonLd } from "@/components/seo/json-ld";
import { SITE_URL } from "@/lib/site";

import { resolveProductHero } from "@/lib/product-images/resolve";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

const SHIATSU_SLUG = "shiatsu-neck-shoulder-massager";

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
  const title = product.seo.title.ar;
  const description = product.seo.description.ar;
  const ogLocale = "ar_MA";
  const name = product.name.ar;

  return {
    title,
    description,
    keywords: isShiatsu ? [...SHIATSU_KEYWORDS, ...product.tags] : product.tags,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      images: [{ url: hero, alt: name }],
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
        a: "حط الجهاز حول الرقبة أو على المنطقة اللي بغيتي تدليكها، اضبط السانات، شغّل التدليك وفعّل التدفئة إلا بغيتي. 10–15 دقيقة كافية.",
      },
      {
        q: "التدفئة — واش آمنة؟",
        a: "نعم. التدفئة المدمجة كتعطي دفء لطيف ومتحكم فيه. تقدّر تشغّلها أو تطفيها حسب راحتك.",
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
        q: "كيفاش نخلص؟",
        a: "الدفع عند الاستلام. ما كخلص والو دابا — كتخلص كاش ملي توصلك الطلبية.",
      },
      {
        q: "واش نقدر نطلب من الهاتف؟",
        a: "نعم. عمّر الاسم، الهاتف، المدينة والعنوان فالفورم واضغط تأكيد الطلب.",
      },
      {
        q: "واش التوصيل متوفر لمدينتي؟",
        a: "كنوصّلو لجميع مدن المغرب. التوصيل مجاني والدفع عند الاستلام.",
      },
      {
        q: "كيفاش كنركّبو؟",
        a: "نظّف السطح داخل السيارة، ضع قاعدة الشفط واضغط، دوّر على TIGHT، قرّب الهاتف من الرأس المغناطيسي واضبط الذراع.",
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

  const upsells = (product.upsellIds || []).map((id) => getProductById(id)).filter(Boolean) as typeof products;
  const crossSells = (product.crossSellIds || []).map((id) => getProductById(id)).filter(Boolean) as typeof products;
  const defaultVariant = product.variants[0];
  const hero = resolveProductHero(product);
  const productUrl = `${SITE_URL}/ar/products/${product.slug}`;
  const productFaqs = getProductFaqs(product.slug, product.warrantyMonths || 12);
  const isShiatsu = product.slug === SHIATSU_SLUG;
  const reviews = isShiatsu ? getReviewsForProduct(product.id) : [];

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: product.name.ar,
          description: product.description.ar,
          image: [hero],
          sku: product.sku,
          brand: { "@type": "Brand", name: "NOORVA" },
          color: isShiatsu ? "أخضر غابة" : undefined,
          material: isShiatsu ? "ABS + جلد PU + سيليكون غذائي" : undefined,
          offers: {
            "@type": "Offer",
            price: defaultVariant.price,
            priceCurrency: "MAD",
            availability: defaultVariant.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            url: productUrl,
            priceValidUntil: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString().slice(0, 10),
            itemCondition: "https://schema.org/NewCondition",
            shippingDetails: isShiatsu
              ? {
                  "@type": "OfferShippingDetails",
                  shippingRate: { "@type": "MonetaryAmount", value: "0", currency: "MAD" },
                  shippingDestination: { "@type": "DefinedRegion", addressCountry: "MA" },
                }
              : undefined,
          },
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: product.rating,
            reviewCount: product.reviewCount,
            bestRating: "5",
            worstRating: "1",
          },
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
      <ProductPageClient product={product} upsells={upsells} crossSells={crossSells} />
    </>
  );
}
