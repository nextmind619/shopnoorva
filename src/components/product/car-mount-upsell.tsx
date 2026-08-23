"use client";

import Image from "next/image";
import { Check, Plus } from "lucide-react";
import type { Product } from "@/types";
import { formatPriceNumber, cn } from "@/lib/utils";
import { resolveProductHero } from "@/lib/product-images/resolve";
import { getCarMountUpsellPrice } from "@/lib/catalog/car-mount-upsell";

interface CarMountUpsellProps {
  products: Product[];
  selectedIds: string[];
  onToggle: (productId: string) => void;
}

export function CarMountUpsell({ products, selectedIds, onToggle }: CarMountUpsellProps) {
  if (products.length === 0) return null;

  const selected = new Set(selectedIds);

  return (
    <section
      id="car-mount-upsell"
      className="scroll-mt-24 min-w-0 w-full max-w-full"
      aria-labelledby="car-mount-upsell-title"
      dir="rtl"
    >
      <div className="rounded-3xl border border-amber-400/25 bg-gradient-to-b from-amber-500/10 to-[#12121a] p-5 sm:p-7 space-y-5">
        <header className="text-center space-y-2">
          <h2 id="car-mount-upsell-title" className="text-xl sm:text-2xl font-black text-white">
            كمّل تجهيز سيارتك 🚗
          </h2>
          <p className="text-sm sm:text-base text-white/70 leading-relaxed max-w-md mx-auto">
            اختار منتج إضافي واستافد من <span className="font-black text-amber-300">العرض الخاص</span>
          </p>
        </header>

        <div className="flex gap-3 overflow-x-auto overscroll-x-contain pb-1 scrollbar-hide max-w-full touch-pan-x sm:grid sm:grid-cols-3 sm:overflow-visible sm:pb-0">
          {products.map((product) => {
            const added = selected.has(product.id);
            const originalPrice = product.price;
            const offerPrice = getCarMountUpsellPrice(product.id);
            const showStrike = originalPrice > offerPrice;

            return (
              <article
                key={product.id}
                className={cn(
                  "shrink-0 w-[228px] sm:w-auto sm:min-w-0 rounded-2xl border bg-[#0a0a0f]/80 overflow-hidden flex flex-col",
                  added ? "border-amber-400/60 ring-1 ring-amber-400/30" : "border-white/10",
                )}
              >
                <div className="relative aspect-square bg-white">
                  <Image
                    src={resolveProductHero(product)}
                    alt={product.name.ar}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 228px, 33vw"
                    loading="lazy"
                  />
                  <span className="absolute top-2 start-2 rounded-full bg-amber-400 text-[#1a1408] text-[10px] font-black px-2 py-1">
                    عرض {offerPrice} درهم
                  </span>
                </div>
                <div className="p-3.5 flex flex-col gap-2 flex-1">
                  <h3 className="text-sm font-bold text-white leading-snug line-clamp-2 min-h-[2.5rem]">
                    {product.name.ar}
                  </h3>
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                    {showStrike && (
                      <span className="text-sm text-white/40 line-through tabular-nums">
                        {formatPriceNumber(originalPrice, "ar")} درهم
                      </span>
                    )}
                    <p className="text-lg font-black text-amber-300 tabular-nums leading-none">
                      {offerPrice} درهم فقط
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onToggle(product.id)}
                    aria-pressed={added}
                    className={cn(
                      "mt-auto h-11 w-full rounded-xl text-sm font-black flex items-center justify-center gap-1.5 transition-colors",
                      added
                        ? "bg-emerald-500/15 border border-emerald-400/40 text-emerald-300"
                        : "bg-amber-400 hover:bg-amber-300 text-[#1a1408]",
                    )}
                  >
                    {added ? (
                      <>
                        <Check className="h-4 w-4" />
                        تمت الإضافة
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4" />
                        أضف بـ {offerPrice} درهم
                      </>
                    )}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
