"use client";

import Image from "next/image";
import { Check, Gift, Palette, ShoppingBag } from "lucide-react";
import type { Product } from "@/types";
import { formatPriceNumber } from "@/lib/utils";
import { resolveProductImage } from "@/lib/product-images/resolve";

const SLUG = "kids-art-set-easel-208";
const GIFT_IMAGE = "/products/kids-art-set-easel-208/arabic-magic-book-gift.jpg";

interface KidsArtCroSectionsProps {
  product: Product;
  price: number;
  onOrderClick: () => void;
}

export function KidsArtCroSections({ product, price, onOrderClick }: KidsArtCroSectionsProps) {
  const heroSrc = resolveProductImage(SLUG, "02-premium-hero", "webp");
  const priceLabel = `${formatPriceNumber(price, "ar")} DH`;

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-white/10 bg-[#12121a]/80 p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <div className="shrink-0 rounded-2xl bg-indigo-500/15 p-3 text-indigo-300">
            <Palette className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">🎨 مجموعة الرسم والتلوين للأطفال</h2>
            <p className="mt-3 text-sm sm:text-base leading-relaxed text-white/65">
              208 قطعة مع حامل مدمج — ستوديو إبداع كامل فحقيبة وحدة. كل لون فبلاصتو، بلا فوضى فوق الطاولة.
            </p>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-3xl border border-amber-300/25 bg-gradient-to-br from-amber-500/15 via-[#17131a] to-[#12121a]">
        <div className="p-5 sm:p-7 space-y-5">
          <div className="text-center space-y-2">
            <p className="inline-flex items-center gap-2 rounded-full bg-amber-300 px-3 py-1 text-xs font-black text-amber-950">
              <Gift className="h-3.5 w-3.5" /> عرض {priceLabel}
            </p>
            <h2 className="text-2xl sm:text-3xl font-black text-white">شنو غادي تاخد بـ{priceLabel}؟</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-white/10 bg-[#0a0a0f]/50 overflow-hidden">
              <div className="relative aspect-square bg-[#12121a]">
                <Image
                  src={heroSrc}
                  alt="مجموعة الرسم والتلوين للأطفال 208 قطعة مع حامل مدمج"
                  fill
                  sizes="(max-width: 640px) 100vw, 50vw"
                  className="object-cover"
                  loading="lazy"
                />
              </div>
              <div className="p-4 text-center">
                <p className="font-black text-white">🎨 مجموعة الرسم والتلوين</p>
                <p className="text-xs text-white/55 mt-1">القيمة الأساسية للعرض</p>
              </div>
            </div>
            <div className="rounded-2xl border-2 border-emerald-400/50 bg-[#0a0a0f]/50 overflow-hidden relative">
              <span className="absolute top-3 start-3 z-10 rounded-full bg-emerald-500 px-2.5 py-0.5 text-[11px] font-bold text-white">
                هدية مجانية 🎁
              </span>
              <div className="relative aspect-square bg-white">
                <Image
                  src={GIFT_IMAGE}
                  alt="Arabic Magic Book — 4 كتب تعليمية مع قلم سحري"
                  fill
                  sizes="(max-width: 640px) 100vw, 50vw"
                  className="object-contain p-3"
                  loading="lazy"
                />
              </div>
              <div className="p-4 text-center">
                <p className="font-black text-white">🎁 Arabic Magic Book</p>
                <p className="text-xs text-emerald-300 font-semibold mt-1">هدية مجانية مع الطلب</p>
              </div>
            </div>
          </div>
          <p className="text-center text-xl sm:text-2xl font-black tabular-nums text-amber-200">
            🔥 العرض كامل بـ{priceLabel} فقط
          </p>
          <button
            type="button"
            onClick={onOrderClick}
            className="w-full h-14 rounded-2xl bg-amber-300 hover:bg-amber-200 text-amber-950 font-black text-base flex items-center justify-center gap-2 transition-colors"
          >
            <ShoppingBag className="h-5 w-5" /> أطلب العرض الآن 🎁
          </button>
        </div>
        <div className="grid grid-cols-2 border-t border-white/10 bg-black/10 text-center text-xs font-semibold text-white/65">
          <div className="flex items-center justify-center gap-2 px-3 py-4">
            <Image
              src={resolveProductImage(product.slug, "02-premium-hero", "webp")}
              alt="مجموعة الرسم والتلوين"
              width={48}
              height={48}
              className="h-12 w-12 rounded-xl object-cover"
              loading="lazy"
            />
            مجموعة الرسم
          </div>
          <div className="flex items-center justify-center gap-2 border-s border-white/10 px-3 py-4">
            <Image
              src={GIFT_IMAGE}
              alt="Arabic Magic Book"
              width={48}
              height={48}
              className="h-12 w-12 rounded-xl object-cover"
              loading="lazy"
            />
            Arabic Magic Book 🎁
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-white/10 bg-[#12121a]/80 p-6 sm:p-8">
        <h2 className="text-xl sm:text-2xl font-bold text-center text-white">📦 شنو غادي يوصلك؟</h2>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {[
            "حقيبة رسم زرقاء قابلة للطي مع حامل مدمج",
            "208 قطعة: ماركر، أقلام، شمع، مائي",
            "🎁 Arabic Magic Book هدية مجانية (4 كتب + قلم سحري)",
            "ممحاة، مبراة، وفرشاة فتجويفات خاصة",
          ].map((item) => (
            <div
              key={item}
              className="flex items-center gap-3 rounded-2xl border border-white/8 bg-black/15 px-4 py-3 text-sm font-semibold text-white/80"
            >
              <Check className="h-4 w-4 shrink-0 text-emerald-400" />
              {item}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
