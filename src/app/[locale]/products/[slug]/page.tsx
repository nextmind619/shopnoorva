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

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: product.name.ar,
          description: product.description.ar,
          image: [resolveProductHero(product)],
          sku: product.sku,
          brand: { "@type": "Brand", name: "NOORVA" },
          offers: {
            "@type": "Offer",
            price: defaultVariant.price,
            priceCurrency: "MAD",
            availability: defaultVariant.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            url: `${SITE_URL}/ar/products/${product.slug}`,
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
