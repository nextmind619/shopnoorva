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
  "massage shiatsu",
  "masseur cou épaules",
  "appareil massage chauffage",
  "massage cervicales Maroc",
  "relaxation",
  "bien-être",
  "paiement à la livraison",
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
  const title = isShiatsu ? product.seo.title.fr : product.seo.title.ar;
  const description = isShiatsu ? product.seo.description.fr : product.seo.description.ar;
  const ogLocale = isShiatsu ? "fr_MA" : "ar_MA";
  const name = isShiatsu ? product.name.fr : product.name.ar;

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
        q: "Livraison — quels délais au Maroc ?",
        a: "Livraison gratuite partout au Maroc : 24–48 h pour les grandes villes, 2–4 jours pour le reste du Royaume.",
      },
      {
        q: "Paiement — dois-je payer maintenant ?",
        a: "Non. Paiement à la livraison uniquement (COD). Vous réglez en espèces à la réception.",
      },
      {
        q: "Garantie — que couvre-t-elle ?",
        a: `Garantie ${warrantyMonths} mois sur les défauts de fabrication, plus remplacement sous 7 jours en cas de défaut.`,
      },
      {
        q: "Utilisation — comment bien l’utiliser ?",
        a: "Placez l’appareil autour du cou ou sur la zone à masser, ajustez les sangles, lancez le massage et activez le chauffage si besoin. 10–15 minutes suffisent.",
      },
      {
        q: "Chauffage — est-il sûr ?",
        a: "Oui. Le chauffage intégré offre une chaleur douce et contrôlée. Vous pouvez l’activer ou le désactiver selon votre confort.",
      },
      {
        q: "Nettoyage — comment l’entretenir ?",
        a: "Débranchez l’appareil et essuyez-le avec un chiffon doux légèrement humide. Ne jamais immerger dans l’eau.",
      },
      {
        q: "Retour — puis-je renvoyer le produit ?",
        a: "Oui. Contactez-nous sur WhatsApp sous 14 jours en cas de défaut de fabrication.",
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
          name: isShiatsu ? product.name.fr : product.name.ar,
          description: isShiatsu ? product.description.fr : product.description.ar,
          image: [hero],
          sku: product.sku,
          brand: { "@type": "Brand", name: "NOORVA" },
          color: isShiatsu ? "Green" : undefined,
          material: isShiatsu ? "ABS + PU Leather" : undefined,
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
                  name: r.title.fr,
                  reviewBody: r.content.fr,
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
