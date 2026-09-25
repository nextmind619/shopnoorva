"use client";

import Image from "next/image";
import { Gift } from "lucide-react";
import type { LifestyleScene, ProductGift } from "@/types";

interface ProductSurpriseGiftProps {
  gift: ProductGift;
}

/** Honest free-gift module. Driven by product.gift — not a one-off landing page. */
export function ProductSurpriseGift({ gift }: ProductSurpriseGiftProps) {
  if (!gift.enabled) return null;

  return (
    <section
      id="free-gift"
      aria-labelledby="free-gift-title"
      className="overflow-hidden rounded-3xl border border-amber-300/30 bg-gradient-to-br from-amber-500/15 via-[#17131a] to-[#12121a]"
    >
      <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,180px)_1fr] gap-0">
        {gift.giftImage && (
          <div className="relative aspect-square sm:aspect-auto sm:min-h-[220px] bg-white">
            <Image
              src={gift.giftImage}
              alt={gift.giftTitle.ar}
              fill
              sizes="(max-width: 640px) 100vw, 180px"
              className="object-contain p-3"
              loading="lazy"
            />
          </div>
        )}
        <div className="p-5 sm:p-6 space-y-3">
          <p className="inline-flex items-center gap-2 rounded-full bg-amber-300 px-3 py-1 text-xs font-black text-amber-950">
            <Gift className="h-3.5 w-3.5" /> هدية مجانية
          </p>
          <h2 id="free-gift-title" className="text-xl sm:text-2xl font-black text-white leading-snug">
            وزيد عليها هدية مجانية مفاجأة مع الطلب ديالك 🎁
          </h2>
          <p className="text-base font-bold text-amber-100">{gift.giftTitle.ar}</p>
          {gift.giftDescription && (
            <p className="text-sm leading-relaxed text-white/70">{gift.giftDescription.ar}</p>
          )}
          <p className="text-sm font-semibold text-emerald-300">{gift.giftDisclosure.ar}</p>
        </div>
      </div>
    </section>
  );
}

export function ProductUsageModes({ scenes }: { scenes: LifestyleScene[] }) {
  if (scenes.length === 0) return null;

  return (
    <section aria-labelledby="usage-modes-title" className="space-y-4">
      <h2 id="usage-modes-title" className="text-xl sm:text-2xl font-bold text-center text-white">
        كيفاش تستعملها
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {scenes.map((scene) => (
          <div key={scene.id} className="overflow-hidden rounded-2xl border border-white/10 bg-[#12121a]/80">
            {scene.imageUrl && (
              <div className="relative aspect-[4/3] bg-[#0a0a0f]">
                <Image
                  src={scene.imageUrl}
                  alt={scene.title.ar}
                  fill
                  sizes="(max-width: 640px) 100vw, 50vw"
                  className="object-cover"
                  loading="lazy"
                />
              </div>
            )}
            <div className="px-4 py-4">
              <p className="text-base font-black text-white">
                <span className="me-2" aria-hidden>
                  {scene.emoji}
                </span>
                {scene.title.ar}
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-white/60">{scene.description.ar}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
