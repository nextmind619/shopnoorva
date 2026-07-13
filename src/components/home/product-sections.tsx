"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { getFlashSaleProducts } from "@/data/products";
import { ProductCard, SectionHeader } from "@/components/shared/product-card";

function FlashTimer({ endDate }: { endDate: string }) {
  const t = useTranslations("sections");
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculate = () => {
      const diff = new Date(endDate).getTime() - Date.now();
      if (diff <= 0) return { hours: 0, minutes: 0, seconds: 0 };
      return {
        hours: Math.floor(diff / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      };
    };
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initialize countdown immediately on mount
    setTimeLeft(calculate());
    const interval = setInterval(() => setTimeLeft(calculate()), 1000);
    return () => clearInterval(interval);
  }, [endDate]);

  const pad = (n: number) => n.toString().padStart(2, "0");

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-neutral-500">{t("endsIn")}</span>
      <div className="flex gap-2">
        {[
          { val: timeLeft.hours, label: "H" },
          { val: timeLeft.minutes, label: "M" },
          { val: timeLeft.seconds, label: "S" },
        ].map(({ val, label }) => (
          <div key={label} className="bg-black text-white w-12 h-12 flex flex-col items-center justify-center">
            <span className="text-lg font-semibold tabular-nums">{pad(val)}</span>
            <span className="text-[10px] text-neutral-400">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function FlashSaleSection() {
  const t = useTranslations("sections");
  const flashProducts = getFlashSaleProducts();
  // eslint-disable-next-line react-hooks/purity -- stable fallback window when no flash-sale end date is set
  const endDate = flashProducts[0]?.flashSaleEndsAt || new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString();

  return (
    <section className="section-padding bg-neutral-50">
      <div className="container-luxury">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <SectionHeader title={t("flashSale")} subtitle={t("limitedOffers")} />
          <FlashTimer endDate={endDate} />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {flashProducts.slice(0, 4).map((product, i) => (
            <ProductCard key={product.id} product={product} priority={i < 2} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function ProductGridSection({
  title,
  subtitle,
  products,
  filter,
}: {
  title: string;
  subtitle?: string;
  products: ReturnType<typeof getFlashSaleProducts>;
  filter?: string;
}) {
  const t = useTranslations("sections");
  const locale = useLocale();

  return (
    <section className="section-padding">
      <div className="container-luxury">
        <SectionHeader
          title={title}
          subtitle={subtitle}
          href={filter ? `/${locale}/products?filter=${filter}` : `/${locale}/products`}
          linkText={t("viewAll")}
        />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
