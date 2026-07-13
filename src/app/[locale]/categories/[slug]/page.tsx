import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import Image from "next/image";
import { categories, getCategoryBySlug } from "@/data/categories";
import { getProductsByCategory } from "@/data/products";
import { getLocalized } from "@/lib/utils";
import type { Locale } from "@/types";
import { ProductCard } from "@/components/shared/product-card";

export async function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) return {};
  return {
    title: `${getLocalized(category.name, locale as Locale)} | NOORVA`,
    description: getLocalized(category.description, locale as Locale),
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const category = getCategoryBySlug(slug);
  if (!category) notFound();

  const products = getProductsByCategory(category.id);

  return (
    <div className="container-luxury section-padding">
      <div className="relative h-48 md:h-64 mb-10 overflow-hidden">
        <Image src={category.image} alt={getLocalized(category.name, locale as Locale)} fill className="object-cover" sizes="100vw" priority />
        <div className="absolute inset-0 bg-black/50 flex items-end p-8">
          <div>
            <h1 className="font-display text-3xl md:text-5xl text-white font-light">{getLocalized(category.name, locale as Locale)}</h1>
            <p className="text-neutral-300 mt-2">{getLocalized(category.description, locale as Locale)}</p>
          </div>
        </div>
      </div>
      <p className="text-neutral-500 text-sm mb-8">{products.length} products</p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
