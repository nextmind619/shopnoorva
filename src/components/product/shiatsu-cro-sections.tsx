"use client";

import Image from "next/image";
import { Check, Gift, Heart, Home, ShoppingBag } from "lucide-react";
import type { Product } from "@/types";
import { resolveProductHero } from "@/lib/product-images/resolve";

interface ShiatsuCroSectionsProps {
  product: Product;
  onOrderClick: () => void;
}

const GIFT_IMAGE = "/products/camel-massage-cream-gift.jpg";

export function ShiatsuCroSections({ product, onOrderClick }: ShiatsuCroSectionsProps) {
  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-white/10 bg-[#12121a]/80 p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <div className="shrink-0 rounded-2xl bg-indigo-500/15 p-3 text-indigo-300">
            <Heart className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">علاش تستاهل لحظة راحة؟</h2>
            <p className="mt-3 text-sm sm:text-base leading-relaxed text-white/65">
              نهار طويل قدام البيسي؟ كتسوق بزاف؟ ولا كتقضي ساعات حاني راسك فالتليفون؟
              منين كتوصل لدارك، الجهاز كيعطيك لحظة ديال المساج والاسترخاء فالبيت، بالوتيرة اللي كتناسبك.
            </p>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-3xl border border-amber-300/25 bg-gradient-to-br from-amber-500/15 via-[#17131a] to-[#12121a]">
        <div className="grid gap-5 p-5 sm:grid-cols-[160px_1fr] sm:items-center sm:p-7">
          <div className="relative aspect-square overflow-hidden rounded-2xl border border-white/10 bg-white">
            <Image
              src={GIFT_IMAGE}
              alt="كريم سنام الجمل هدية مع جهاز المساج"
              fill
              sizes="160px"
              className="object-cover"
              loading="lazy"
            />
          </div>
          <div>
            <p className="mb-2 inline-flex items-center gap-2 rounded-full bg-amber-300 px-3 py-1 text-xs font-black text-amber-950">
              <Gift className="h-3.5 w-3.5" /> عرض الهدية
            </p>
            <h2 className="text-2xl font-black leading-tight text-white">🎁 كريم سنام الجمل هدية مجانية</h2>
            <p className="mt-2 text-sm font-semibold text-amber-100/90">
              مع كل طلب ديال جهاز مساج الرقبة والكتاف
            </p>
            <p className="mt-3 text-sm leading-relaxed text-white/60">
              ماشي غير جهاز واحد… غادي توصلك هدية إضافية باش تكمل روتين الراحة ديالك.
              الكريم للاستعمال الخارجي فقط، حسب تعليمات المنتج.
            </p>
            <button
              type="button"
              onClick={onOrderClick}
              className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-amber-300 px-5 text-sm font-black text-amber-950 transition-colors hover:bg-amber-200 sm:w-auto"
            >
              <ShoppingBag className="h-4 w-4" /> اطلب العرض دابا
            </button>
          </div>
        </div>
        <div className="grid grid-cols-2 border-t border-white/10 bg-black/10 text-center text-xs font-semibold text-white/65">
          <div className="flex items-center justify-center gap-2 px-3 py-4">
            <Image
              src={resolveProductHero(product)}
              alt="جهاز مساج الرقبة والكتاف"
              width={48}
              height={48}
              className="h-12 w-12 rounded-xl object-cover"
              loading="lazy"
            />
            جهاز المساج
          </div>
          <div className="flex items-center justify-center gap-2 border-s border-white/10 px-3 py-4">
            <Image
              src={GIFT_IMAGE}
              alt="كريم سنام الجمل"
              width={48}
              height={48}
              className="h-12 w-12 rounded-xl object-cover"
              loading="lazy"
            />
            الكريم هدية 🎁
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-white/10 bg-[#12121a]/80 p-6 sm:p-8">
        <h2 className="text-xl sm:text-2xl font-bold text-center text-white">📦 شنو غادي يوصلك؟</h2>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {[
            "جهاز مساج الرقبة والكتاف شياتسو 3D",
            "🎁 كريم سنام الجمل كهدية مجانية",
            "محول الطاقة",
            "دليل الاستعمال حسب المتوفر",
          ].map((item) => (
            <div key={item} className="flex items-center gap-3 rounded-2xl border border-white/8 bg-black/15 px-4 py-3 text-sm font-semibold text-white/80">
              <Check className="h-4 w-4 shrink-0 text-emerald-400" />
              {item}
            </div>
          ))}
        </div>
        <div className="mt-5 grid gap-3 text-sm text-white/65 sm:grid-cols-2">
          <p className="flex items-center gap-2"><Home className="h-4 w-4 text-indigo-300" /> مناسب لروتين الاسترخاء فالدار</p>
          <p className="flex items-center gap-2"><Check className="h-4 w-4 text-indigo-300" /> استعملو حسب تعليمات المنتج</p>
        </div>
      </section>
    </div>
  );
}
