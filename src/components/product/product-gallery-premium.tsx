"use client";

import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  X,
  Maximize2,
  Sparkles,
} from "lucide-react";
import type { Product } from "@/types";
import {
  buildProductGallerySlides,
  type GallerySlide,
  type GallerySection,
} from "@/lib/product-gallery-slides";
import { cn } from "@/lib/utils";

interface PremiumProductGalleryProps {
  product: Product;
}

const SECTION_BG: Record<GallerySection, string> = {
  hero: "bg-white",
  lifestyle: "bg-gradient-to-b from-[#0a0e1a] via-[#151b35] to-[#0a0e1a]",
  features: "bg-gradient-to-b from-[#120818] via-[#1a1030] to-[#0a0612]",
  bluetooth: "bg-gradient-to-br from-[#0d1220] via-[#151d35] to-[#0a0e1a]",
  projection: "bg-gradient-to-b from-[#050810] via-[#0d1220] to-[#050810]",
  gift: "bg-gradient-to-br from-[#1a1210] via-[#251818] to-[#120808]",
  package: "bg-gradient-to-b from-neutral-50 via-white to-neutral-100",
  accessories: "bg-white",
  dimensions: "bg-white",
  specifications: "bg-gradient-to-b from-neutral-900 via-[#0d1220] to-neutral-900",
};

function SlideImage({ slide, priority }: { slide: GallerySlide; priority?: boolean }) {
  const isLight = ["hero", "package", "accessories", "dimensions"].includes(slide.section);

  return (
    <div className={cn("relative w-full h-full overflow-hidden", SECTION_BG[slide.section])}>
      {slide.section === "lifestyle" && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 30 }).map((_, i) => (
            <span
              key={i}
              className="absolute rounded-full bg-white/40 animate-pulse"
              style={{
                width: `${1 + (i % 2)}px`,
                height: `${1 + (i % 2)}px`,
                top: `${(i * 17) % 80}%`,
                left: `${(i * 23) % 100}%`,
                opacity: 0.2 + (i % 4) * 0.1,
                animationDelay: `${i * 0.12}s`,
              }}
            />
          ))}
        </div>
      )}

      <div
        className={cn(
          "absolute inset-0 flex items-center justify-center p-2 sm:p-4",
          slide.objectFit === "contain" && "p-4 sm:p-8"
        )}
      >
        <Image
          src={slide.imageUrl}
          alt={slide.heading}
          fill
          priority={priority}
          loading={priority ? undefined : "lazy"}
          sizes="(max-width: 1024px) 100vw, 55vw"
          className={cn(
            slide.objectFit === "contain" ? "object-contain" : "object-cover",
            !isLight && slide.objectFit === "cover" && "opacity-95"
          )}
          style={{ objectPosition: slide.objectPosition ?? "center" }}
        />
      </div>
    </div>
  );
}

interface GalleryOverlayProps {
  mode: "zoom" | "fullscreen";
  current: GallerySlide;
  active: number;
  total: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

function GalleryOverlay({ mode, current, active, total, onClose, onPrev, onNext }: GalleryOverlayProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={cn(
        "fixed inset-0 z-[100] flex flex-col",
        mode === "zoom" ? "bg-black/95 backdrop-blur-md p-3 sm:p-6" : "bg-black"
      )}
      onClick={onClose}
    >
      <div className="flex items-center justify-between mb-3 px-1" onClick={(e) => e.stopPropagation()}>
        <div className="min-w-0 pe-4">
          <p className="text-[#6366f1] text-[10px] font-bold tracking-[0.2em] uppercase truncate">
            {current.sectionLabel}
          </p>
          <p className="text-white text-sm sm:text-base font-bold mt-1 truncate">
            <span className="me-1.5" aria-hidden>{current.emoji}</span>
            {current.heading}
          </p>
          {current.subtitle && (
            <p className="text-white/55 text-xs mt-1 line-clamp-2">{current.subtitle}</p>
          )}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-white p-2 rounded-full hover:bg-white/10 shrink-0"
          aria-label="إغلاق"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      <div
        className={cn(
          "relative flex-1 min-h-0 overflow-hidden",
          mode === "zoom" ? "rounded-2xl" : ""
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <SlideImage slide={current} priority />
      </div>

      <div className="flex items-center justify-center gap-4 mt-4" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          onClick={onPrev}
          className="w-11 h-11 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
          aria-label="السابق"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
        <span className="text-white/70 text-sm tabular-nums min-w-[4rem] text-center">
          {active + 1} / {total}
        </span>
        <button
          type="button"
          onClick={onNext}
          className="w-11 h-11 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
          aria-label="التالي"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      </div>
    </motion.div>
  );
}

export function PremiumProductGallery({ product }: PremiumProductGalleryProps) {
  const slides = useMemo(() => buildProductGallerySlides(product), [product]);
  const [active, setActive] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const thumbRef = useRef<HTMLDivElement>(null);

  const current = slides[active] ?? slides[0];
  const total = slides.length;

  const go = useCallback(
    (idx: number) => {
      if (total === 0) return;
      setActive(((idx % total) + total) % total);
    },
    [total]
  );
  const next = useCallback(() => go(active + 1), [active, go]);
  const prev = useCallback(() => go(active - 1), [active, go]);

  useEffect(() => {
    const el = thumbRef.current?.children[active] as HTMLElement | undefined;
    el?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [active]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!zoomOpen && !fullscreen) return;
      if (e.key === "Escape") {
        setZoomOpen(false);
        setFullscreen(false);
      }
      if (e.key === "ArrowRight") prev();
      if (e.key === "ArrowLeft") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [zoomOpen, fullscreen, next, prev]);

  if (!current) return null;

  return (
    <>
      <div className="space-y-4" dir="rtl">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="text-center sm:text-start"
          >
            <p className="text-[10px] font-bold tracking-[0.25em] text-[#6366f1] uppercase mb-1.5">
              {current.sectionLabel} · {String(active + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </p>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white">
              <span className="me-2" aria-hidden>{current.emoji}</span>
              {current.heading}
            </h2>
            {current.subtitle && (
              <p className="text-sm text-white/60 mt-1.5 leading-relaxed">{current.subtitle}</p>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="relative aspect-[4/5] sm:aspect-square rounded-[1.75rem] overflow-hidden bg-[#12121a] shadow-2xl border border-white/10 group">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 cursor-zoom-in"
              onClick={() => setZoomOpen(true)}
            >
              <SlideImage slide={current} priority={active <= 1} />
            </motion.div>
          </AnimatePresence>

          {product.isTikTokViral && (
            <span className="absolute top-4 start-4 z-20 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1.5 rounded-full tracking-wide flex items-center gap-1.5">
              <Sparkles className="h-3 w-3 text-[#6366f1]" />
              فيرال تيك توك
            </span>
          )}

          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute start-3 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/50 backdrop-blur-md text-white flex items-center justify-center opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all hover:bg-black/70 hover:scale-105"
            aria-label="السابق"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute end-3 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/50 backdrop-blur-md text-white flex items-center justify-center opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all hover:bg-black/70 hover:scale-105"
            aria-label="التالي"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div className="absolute bottom-4 end-4 z-20 flex gap-2">
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setZoomOpen(true); }}
              className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/70 transition-colors"
              aria-label="تكبير"
            >
              <ZoomIn className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setFullscreen(true); }}
              className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/70 transition-colors"
              aria-label="ملء الشاشة"
            >
              <Maximize2 className="h-4 w-4" />
            </button>
          </div>

          <div className="absolute bottom-4 start-4 z-20 bg-black/50 backdrop-blur-md rounded-full px-3 py-1.5 text-[11px] font-semibold text-white tabular-nums">
            {active + 1} / {total}
          </div>
        </div>

        <div
          ref={thumbRef}
          className="flex gap-2.5 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide -mx-1 px-1"
          role="tablist"
          aria-label="صور المنتج"
        >
          {slides.map((slide, i) => (
            <button
              key={slide.id}
              type="button"
              role="tab"
              onClick={() => setActive(i)}
              className={cn(
                "relative shrink-0 snap-center rounded-xl overflow-hidden border-2 transition-all duration-300",
                i === active
                  ? "border-[#6366f1] shadow-lg shadow-indigo-500/20 scale-105 w-[72px] h-[72px] sm:w-20 sm:h-20"
                  : "border-white/10 opacity-55 hover:opacity-100 w-16 h-16 sm:w-[72px] sm:h-[72px]"
              )}
              aria-label={slide.heading}
              aria-selected={i === active}
            >
              <div className={cn("absolute inset-0", SECTION_BG[slide.section])}>
                <Image
                  src={slide.imageUrl}
                  alt=""
                  fill
                  sizes="80px"
                  loading="lazy"
                  className={cn(
                    slide.objectFit === "contain" ? "object-contain p-1" : "object-cover",
                    "opacity-90"
                  )}
                />
              </div>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent pt-5 pb-1 px-0.5">
                <span className="text-[7px] sm:text-[8px] text-white font-bold leading-none line-clamp-2 text-center block">
                  {slide.emoji}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {zoomOpen && (
          <GalleryOverlay
            mode="zoom"
            current={current}
            active={active}
            total={total}
            onClose={() => setZoomOpen(false)}
            onPrev={prev}
            onNext={next}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {fullscreen && (
          <GalleryOverlay
            mode="fullscreen"
            current={current}
            active={active}
            total={total}
            onClose={() => setFullscreen(false)}
            onPrev={prev}
            onNext={next}
          />
        )}
      </AnimatePresence>
    </>
  );
}
