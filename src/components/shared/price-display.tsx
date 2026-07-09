"use client";

import { useLocale } from "next-intl";
import type { Locale } from "@/types";
import { formatPriceNumber, getCurrencyLabel, cn } from "@/lib/utils";

interface PriceDisplayProps {
  amount: number;
  compareAt?: number;
  size?: "sm" | "md" | "lg" | "xl";
  showFullCurrency?: boolean;
  className?: string;
}

const sizeMap = {
  sm: { amount: "text-base", currency: "text-[11px]" },
  md: { amount: "text-xl", currency: "text-xs" },
  lg: { amount: "text-3xl", currency: "text-sm" },
  xl: { amount: "text-4xl md:text-5xl", currency: "text-base" },
};

export function PriceDisplay({
  amount,
  compareAt,
  size = "md",
  showFullCurrency = true,
  className,
}: PriceDisplayProps) {
  const locale = useLocale() as Locale;
  const s = sizeMap[size];
  const currency = showFullCurrency ? getCurrencyLabel(locale) : locale === "ar" ? "درهم" : "MAD";

  return (
    <div className={cn("inline-flex flex-col gap-0.5", className)}>
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
        <span className={cn("font-bold tabular-nums text-noir leading-none", s.amount)}>
          {formatPriceNumber(amount, locale)}
        </span>
        <span className={cn("font-semibold text-price leading-tight", s.currency)}>{currency}</span>
      </div>
      {compareAt && compareAt > amount && (
        <span className="text-sm text-muted line-through tabular-nums">
          {formatPriceNumber(compareAt, locale)} {currency}
        </span>
      )}
    </div>
  );
}
