"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "motion/react";
import { categories } from "@/data/categories";
import type { Locale } from "@/types";
import { getLocalized } from "@/lib/utils";
import { SectionHeader } from "@/components/shared/product-card";

export function CategoriesSection() {
  const t = useTranslations("sections");
  const locale = useLocale() as Locale;

  return (
    <section className="section-padding bg-black text-white">
      <div className="container-luxury">
        <SectionHeader title={t("featuredCategories")} />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link href={`/${locale}/categories/${cat.slug}`} className="group block">
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={cat.image}
                    alt={getLocalized(cat.name, locale)}
                    fill
                    sizes="(max-width: 768px) 50vw, 16vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-0 inset-x-0 p-3 md:p-4">
                    <h3 className="text-xs md:text-sm font-medium tracking-wide uppercase group-hover:text-gold transition-colors">
                      {getLocalized(cat.name, locale)}
                    </h3>
                    <p className="text-[10px] text-neutral-400 mt-0.5">{cat.productCount} products</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
