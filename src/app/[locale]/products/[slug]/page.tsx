import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { products, getProductBySlug, getProductById } from "@/data/products";
import { getLocalized } from "@/lib/utils";
import type { Locale } from "@/types";
import { ProductPageClient } from "@/components/product/product-page-client";
import { JsonLd } from "@/components/seo/json-ld";
import { SITE_URL } from "@/lib/site";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};

  return {
    title: getLocalized(product.seo.title, locale as Locale),
    description: getLocalized(product.seo.description, locale as Locale),
    openGraph: {
      title: getLocalized(product.name, locale as Locale),
      description: getLocalized(product.shortDescription, locale as Locale),
      images: [{ url: product.images[0]?.url || "" }],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const product = getProductBySlug(slug);
  if (!product) notFound();

  const upsells = (product.upsellIds || []).map((id) => getProductById(id)).filter(Boolean) as typeof products;
  const crossSells = (product.crossSellIds || []).map((id) => getProductById(id)).filter(Boolean) as typeof products;
  const defaultVariant = product.variants[0];

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: getLocalized(product.name, locale as Locale),
          description: getLocalized(product.description, locale as Locale),
          image: product.images.map((i) => i.url),
          sku: product.sku,
          brand: { "@type": "Brand", name: "LUXMAR" },
          offers: {
            "@type": "Offer",
            price: defaultVariant.price,
            priceCurrency: "MAD",
            availability: defaultVariant.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            url: `${SITE_URL}/${locale}/products/${product.slug}`,
          },
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: product.rating,
            reviewCount: product.reviewCount,
          },
        }}
      />
      <ProductPageClient product={product} upsells={upsells} crossSells={crossSells} />
    </>
  );
}
