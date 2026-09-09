"use client";

import Image from "next/image";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProductColorOption } from "@/lib/catalog/product-colors";

type Props = {
  options: ProductColorOption[];
  selectedId: string;
  onSelect: (id: string) => void;
  label?: string;
};

export function ProductColorPicker({
  options,
  selectedId,
  onSelect,
  label = "اختار اللون",
}: Props) {
  const selected = options.find((option) => option.id === selectedId) ?? options[0];

  return (
    <section className="rounded-2xl border border-white/10 bg-[#12121a]/80 px-4 py-5 sm:px-5 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-base sm:text-lg font-bold text-white">{label}</h3>
        {selected && (
          <p className="text-sm font-semibold text-indigo-200">
            {selected.label.ar}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3" role="group" aria-label={label}>
        {options.map((option) => {
          const active = option.id === selectedId;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onSelect(option.id)}
              aria-pressed={active}
              className={cn(
                "relative overflow-hidden rounded-2xl border-2 text-start transition-all duration-200",
                active
                  ? "border-indigo-400 ring-2 ring-indigo-400/40 shadow-lg shadow-indigo-500/20"
                  : "border-white/12 hover:border-white/30",
              )}
            >
              <div className="relative aspect-[4/5] bg-[#0a0a0f]">
                <Image
                  src={option.image}
                  alt={option.label.ar}
                  fill
                  sizes="(max-width: 640px) 45vw, 240px"
                  className="object-cover"
                />
              </div>
              <div className="flex items-center gap-2 px-3 py-2.5">
                <span
                  className="h-5 w-5 shrink-0 rounded-full border border-white/25 shadow-inner"
                  style={{ backgroundColor: option.hex }}
                  aria-hidden
                />
                <span className={cn("text-sm font-bold", active ? "text-white" : "text-white/80")}>
                  {option.label.ar}
                </span>
                {active && (
                  <span className="ms-auto flex h-5 w-5 items-center justify-center rounded-full bg-indigo-400 text-[#0a0a0f]">
                    <Check className="h-3 w-3 stroke-[3]" />
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
