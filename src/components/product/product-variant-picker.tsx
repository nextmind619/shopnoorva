"use client";

import { Check, Tag } from "lucide-react";
import type { ProductVariant } from "@/types";
import type { Locale } from "@/types";
import { cn, formatPriceNumber, calculateDiscount } from "@/lib/utils";

type Props = {
  variants: ProductVariant[];
  selectedId: string;
  onSelect: (variant: ProductVariant) => void;
  locale: Locale;
  label: string;
};

const COPY = {
  ar: {
    bestValue: "الأكثر توفيراً",
    save: "وفّر",
    currency: "درهم",
    perUnit: "للوحدة",
    selected: "مختار",
  },
  fr: {
    bestValue: "Meilleure offre",
    save: "Économisez",
    currency: "MAD",
    perUnit: "l'unité",
    selected: "Sélectionné",
  },
  en: {
    bestValue: "Best value",
    save: "Save",
    currency: "MAD",
    perUnit: "each",
    selected: "Selected",
  },
} as const;

function getVariantTitle(name: string): string {
  return name.replace(/\s*[—–-]\s*\d+.*$/u, "").trim() || name;
}

function getSingleVariant(variants: ProductVariant[]): ProductVariant | undefined {
  return variants.find((v) => !isPackVariantSku(v.sku));
}

function getPackSavings(variant: ProductVariant, single?: ProductVariant): number | null {
  if (!single || !isPackVariantSku(variant.sku)) return null;
  const packQty = 2;
  const vsSingles = single.price * packQty - variant.price;
  if (vsSingles > 0) return vsSingles;
  if (variant.compareAtPrice && variant.compareAtPrice > variant.price) {
    return variant.compareAtPrice - variant.price;
  }
  return null;
}

export function ProductVariantPicker({ variants, selectedId, onSelect, locale, label }: Props) {
  if (variants.length <= 1) return null;

  const t = COPY[locale];
  const single = getSingleVariant(variants);
  const packVariant = variants.find((v) => isPackVariantSku(v.sku));
  const recommendedId = packVariant && getPackSavings(packVariant, single) ? packVariant.id : undefined;

  return (
    <section className="rounded-2xl border-2 border-emerald-500/35 bg-gradient-to-b from-emerald-500/10 to-[#12121a]/80 px-4 py-5 sm:px-5 space-y-4 shadow-[0_0_24px_rgba(16,185,129,0.08)]">
      <div className="flex items-center justify-center sm:justify-start gap-2.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300">
          <Tag className="h-4 w-4" />
        </span>
        <h3 className="text-base sm:text-lg font-bold text-white">{label}</h3>
      </div>

      <div className="flex flex-col gap-3">
        {variants.map((v) => {
          const active = v.id === selectedId;
          const isPack = isPackVariantSku(v.sku);
          const title = getVariantTitle(v.name[locale]);
          const savings = getPackSavings(v, single);
          const discount = calculateDiscount(v.price, v.compareAtPrice);
          const perUnit = isPack ? Math.round(v.price / 2) : null;
          const isRecommended = v.id === recommendedId;

          return (
            <button
              key={v.id}
              type="button"
              onClick={() => onSelect(v)}
              aria-pressed={active}
              className={cn(
                "relative w-full rounded-2xl border-2 px-4 py-4 sm:px-5 sm:py-4 text-start transition-all duration-200",
                active
                  ? "border-emerald-400 bg-emerald-500/20 shadow-lg shadow-emerald-500/25 ring-2 ring-emerald-400/40"
                  : "border-white/15 bg-[#0a0a0f]/60 hover:border-emerald-400/40 hover:bg-white/[0.04]",
              )}
            >
              {isRecommended && (
                <span className="absolute -top-3 start-4 rounded-full bg-amber-400 px-3 py-0.5 text-[11px] font-bold text-[#1a1200] shadow-md">
                  {t.bestValue}
                </span>
              )}

              <div className="flex items-center gap-3 sm:gap-4">
                <span
                  className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                    active ? "border-emerald-400 bg-emerald-400 text-[#0a0a0f]" : "border-white/30 bg-transparent",
                  )}
                  aria-hidden
                >
                  {active && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                </span>

                <div className="min-w-0 flex-1">
                  <p className={cn("text-base sm:text-lg font-bold leading-tight", active ? "text-white" : "text-white/90")}>
                    {title}
                  </p>
                  {savings != null && savings > 0 && (
                    <p className="mt-1 text-xs sm:text-sm font-semibold text-emerald-300">
                      {t.save} {formatPriceNumber(savings, locale)} {t.currency}
                      {perUnit != null && (
                        <span className="text-white/50 font-medium">
                          {" "}
                          · {formatPriceNumber(perUnit, locale)} {t.currency} {t.perUnit}
                        </span>
                      )}
                    </p>
                  )}
                  {active && (
                    <p className="mt-1 text-[11px] font-medium text-emerald-200/80 sm:hidden">{t.selected}</p>
                  )}
                </div>

                <div className="shrink-0 text-end">
                  <p className={cn("text-xl sm:text-2xl font-black tabular-nums leading-none", active ? "text-white" : "text-white/95")}>
                    {formatPriceNumber(v.price, locale)}
                    <span className="ms-1 text-sm font-bold text-white/70">{t.currency}</span>
                  </p>
                  {v.compareAtPrice != null && v.compareAtPrice > v.price && (
                    <p className="mt-1 text-xs text-white/45 line-through tabular-nums">
                      {formatPriceNumber(v.compareAtPrice, locale)} {t.currency}
                    </p>
                  )}
                  {discount > 0 && !isPack && (
                    <p className="mt-0.5 text-[11px] font-semibold text-amber-300">-{discount}%</p>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}

/** Pack SKUs (e.g. 2-for-299) are ordered as a single line item. */
export function isPackVariantSku(sku: string): boolean {
  return sku.endsWith("-2PK");
}
