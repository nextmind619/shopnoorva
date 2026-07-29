"use client";

import Image from "next/image";
import { motion } from "motion/react";
import type { Product } from "@/types";
import {
  buildProductGallerySlides,
  getSlidesBySection,
  type GallerySection,
} from "@/lib/product-gallery-slides";
import { cn } from "@/lib/utils";

/** Illustrative blocks only — keep gallery clean (max 3 sections) */
const LANDING_SECTIONS: GallerySection[] = [
  "lifestyle",
  "features",
  "projection",
];

interface ProductLandingSectionsProps {
  product: Product;
}

function SectionBlock({
  title,
  slides,
  reverse,
}: {
  title: string;
  slides: ReturnType<typeof buildProductGallerySlides>;
  reverse?: boolean;
}) {
  if (slides.length === 0) return null;
  const primary = slides[0];

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-64px" }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="scroll-mt-24"
    >
      <div className="bg-[#1a1a24] rounded-[2rem] border border-white/10 overflow-hidden shadow-2xl min-w-0 max-w-full">
        <div className={cn("grid grid-cols-1 lg:grid-cols-2 gap-0 min-w-0", reverse && "lg:[direction:ltr]")}>
          <div className={cn("relative aspect-[4/3] lg:aspect-auto lg:min-h-[420px] bg-[#12121a]", reverse && "lg:order-2")}>
            <Image
              src={primary.imageUrl}
              alt={primary.heading}
              fill
              loading="lazy"
              sizes="(max-width: 1024px) 100vw, 50vw"
              className={cn(
                primary.objectFit === "contain" ? "object-contain p-6" : "object-cover"
              )}
            />
            {slides.length > 1 && (
              <div className="absolute bottom-4 inset-x-4 flex gap-2 overflow-x-auto scrollbar-hide">
                {slides.slice(1, 4).map((s) => (
                  <div
                    key={s.id}
                    className="relative shrink-0 w-20 h-20 rounded-xl overflow-hidden border border-white/20"
                  >
                    <Image src={s.imageUrl} alt={s.heading} fill sizes="80px" className="object-cover" loading="lazy" />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className={cn("p-8 sm:p-10 lg:p-12 flex flex-col justify-center", reverse && "lg:order-1 lg:[direction:rtl]")}>
            <p className="text-[10px] font-bold tracking-[0.25em] text-[#6366f1] uppercase mb-3">
              {primary.sectionLabel}
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight mb-4">
              <span className="me-2" aria-hidden>{primary.emoji}</span>
              {primary.heading}
            </h2>
            <p className="text-white/65 text-base leading-relaxed mb-6">{primary.subtitle}</p>

            {slides.length > 1 && (
              <ul className="space-y-3">
                {slides.slice(1).map((s) => (
                  <li key={s.id} className="flex items-start gap-3 text-sm text-white/75">
                    <span className="text-base shrink-0" aria-hidden>{s.emoji}</span>
                    <span>
                      <span className="font-semibold text-white">{s.heading.split("—")[0].trim()}</span>
                      {s.subtitle && <span className="block text-white/50 text-xs mt-0.5">{s.subtitle}</span>}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </motion.section>
  );
}

export function ProductLandingSections({ product }: ProductLandingSectionsProps) {
  const bySection = getSlidesBySection(product);

  return (
    <div className="space-y-8 mt-12 min-w-0 max-w-full">
      {LANDING_SECTIONS.map((section, i) => {
        const slides = bySection.get(section);
        if (!slides?.length) return null;
        const label = slides[0].sectionLabel;
        return (
          <SectionBlock
            key={section}
            title={label}
            slides={slides}
            reverse={i % 2 === 1}
          />
        );
      })}
    </div>
  );
}
