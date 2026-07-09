import { setRequestLocale } from "next-intl/server";
import Link from "next/link";
import Image from "next/image";
import { categories } from "@/data/categories";
import { getLocalized } from "@/lib/utils";
import type { Locale } from "@/types";
import { SectionHeader } from "@/components/shared/product-card";

export default async function CategoriesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="container-luxury section-padding">
      <SectionHeader title="Categories" subtitle="LUXMAR" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <Link key={cat.id} href={`/${locale}/categories/${cat.slug}`} className="group">
            <div className="relative aspect-[16/10] overflow-hidden">
              <Image src={cat.image} alt={getLocalized(cat.name, locale as Locale)} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="33vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-0 p-6">
                <h2 className="text-white text-xl font-display group-hover:text-gold transition-colors">{getLocalized(cat.name, locale as Locale)}</h2>
                <p className="text-neutral-300 text-sm mt-1">{cat.productCount} products</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
