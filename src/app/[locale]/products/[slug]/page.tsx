import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { products, getProductBySlug, getProductById } from "@/data/products";
import { ProductPageClient } from "@/components/product/product-page-client";
import { JsonLd } from "@/components/seo/json-ld";
import { SITE_URL } from "@/lib/site";

import { resolveProductHero } from "@/lib/product-images/resolve";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

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

  return {
    title: product.seo.title.ar,
    description: product.seo.description.ar,
    keywords: product.tags,
    alternates: { canonical },
    openGraph: {
      title: product.seo.title.ar,
      description: product.seo.description.ar,
      images: [{ url: hero, alt: product.name.ar }],
      locale: "ar_MA",
      type: "website",
      url: canonical,
      siteName: "NOORVA",
    },
    twitter: {
      card: "summary_large_image",
      title: product.seo.title.ar,
      description: product.seo.description.ar,
      images: [hero],
    },
  };
}

function getProductFaqs(slug: string, warrantyMonths: number) {
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
        q: "واش الأرانب كيدورو بصوت؟",
        a: "الدوران لطيف وصامت تقريباً باش ما يقلقش الطفل وهو كينعس.",
      },
      {
        q: "واش فيه موسيقى؟",
        a: "نعم، جهاز صوت مدمج كيشغّل موسيقى مهدّئة — تقدري تتحكمي من الريموت أو الأزرار.",
      },
      {
        q: "كيفاش كيشحن؟",
        a: "عبر منفذ USB-C فقاعدة المصباح. الكابل كاين فالعلبة.",
      },
      {
        q: "شنو كاين فالعلبة؟",
        a: "كاروسيل الأرانب، الريموت الأبيض، كابل USB-C، ودليل الاستخدام.",
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

  const upsells = (product.upsellIds || []).map((id) => getProductById(id)).filter(Boolean) as typeof products;
  const crossSells = (product.crossSellIds || []).map((id) => getProductById(id)).filter(Boolean) as typeof products;
  const defaultVariant = product.variants[0];
  const hero = resolveProductHero(product);
  const productUrl = `${SITE_URL}/ar/products/${product.slug}`;
  const productFaqs = getProductFaqs(product.slug, product.warrantyMonths || 12);

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
          offers: {
            "@type": "Offer",
            price: defaultVariant.price,
            priceCurrency: "MAD",
            availability: defaultVariant.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            url: productUrl,
            priceValidUntil: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString().slice(0, 10),
            itemCondition: "https://schema.org/NewCondition",
          },
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: product.rating,
            reviewCount: product.reviewCount,
          },
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
