"use client";

import type { ProductVariant } from "@/types";
import type { Locale } from "@/types";
import { cn } from "@/lib/utils";

type Props = {
  variants: ProductVariant[];
  selectedId: string;
  onSelect: (variant: ProductVariant) => void;
  locale: Locale;
  label: string;
};

export function ProductVariantPicker({ variants, selectedId, onSelect, locale, label }: Props) {
  if (variants.length <= 1) return null;

  return (
    <section className="rounded-2xl border border-white/8 bg-[#12121a]/50 px-5 py-4 space-y-3">
      <span className="text-sm font-medium text-white/70">{label}</span>
      <div className="flex flex-col sm:flex-row gap-2">
        {variants.map((v) => {
          const active = v.id === selectedId;
          return (
            <button
              key={v.id}
              type="button"
              onClick={() => onSelect(v)}
              className={cn(
                "flex-1 rounded-xl border px-4 py-3 text-start text-sm font-semibold transition-colors",
                active
                  ? "border-emerald-400/60 bg-emerald-500/15 text-white"
                  : "border-white/12 bg-white/5 text-white/75 hover:border-white/25",
              )}
            >
              {v.name[locale]}
            </button>
          );
        })}
      </div>
    </section>
  );
}

/** Pack SKUs (e.g. 2-for-269) are ordered as a single line item. */
export function isPackVariantSku(sku: string): boolean {
  return sku.endsWith("-2PK");
}
