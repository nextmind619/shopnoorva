import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { products } from "@/data/products";
import { enrichProduct } from "@/lib/product-images/enrich-products";
import { ProductCard, SectionHeader } from "@/components/shared/product-card";

export const metadata: Metadata = {
  title: "المتجر | NOORVA",
  description: "بروجيكتور رائد الفضاء بلوتوث، ليزر الألمنيوم، الأورورا الشمالية، وكاروسيل الأرانب الموسيقي",
};

export default async function ProductsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ filter?: string; q?: string }>;
}) {
  const { locale } = await params;
  const { filter, q } = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations("sections");

  let filtered = [...products];
  if (filter === "bestseller") filtered = products.filter((p) => p.isBestSeller);
  else if (filter === "trending") filtered = products.filter((p) => p.isTrending);
  else if (filter === "viral") filtered = products.filter((p) => p.isTikTokViral);
  if (q) {
    const query = q.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.name.fr.toLowerCase().includes(query) ||
        p.name.en.toLowerCase().includes(query) ||
        p.name.ar.includes(query)
    );
  }

  return (
    <div className="container-luxury section-padding">
      <SectionHeader title={t("bestSellers")} subtitle="NOORVA" />
      <p className="text-neutral-500 text-sm mb-8">{filtered.length} products</p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {filtered.map((product) => (
          <ProductCard key={product.id} product={enrichProduct(product)} />
        ))}
      </div>
    </div>
  );
}
