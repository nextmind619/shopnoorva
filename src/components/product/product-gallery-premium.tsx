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
  Bluetooth,
  Usb,
  Package,
  Ruler,
  Sparkles,
} from "lucide-react";
import type { Product } from "@/types";
import { buildProductGallerySlides, type GallerySlide, type GalleryScene } from "@/lib/product-gallery-slides";
import { cn } from "@/lib/utils";

interface PremiumProductGalleryProps {
  product: Product;
}

const SCENE_BG: Record<GalleryScene, string> = {
  hero: "bg-white",
  lifestyle: "bg-gradient-to-br from-[#1a1520] via-[#2d2438] to-[#1a1520]",
  environment: "bg-gradient-to-b from-[#0a0e1a] via-[#151b35] to-[#0a0e1a]",
  features: "bg-gradient-to-b from-white to-luxury-bg",
  closeup: "bg-gradient-to-b from-neutral-100 to-white",
  package: "bg-gradient-to-b from-luxury-bg to-white",
  dimensions: "bg-white",
  benefits: "bg-gradient-to-br from-neutral-50 via-white to-luxury-bg",
  "before-after": "bg-neutral-900",
  packaging: "bg-gradient-to-b from-neutral-50 to-white",
};

function SceneDecor({ scene }: { scene: GalleryScene }) {
  if (scene === "environment") {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 40 }).map((_, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-white animate-pulse"
            style={{
              width: `${1 + (i % 3)}px`,
              height: `${1 + (i % 3)}px`,
              top: `${(i * 17) % 55}%`,
              left: `${(i * 23) % 95}%`,
              opacity: 0.3 + (i % 5) * 0.12,
              animationDelay: `${i * 0.15}s`,
            }}
          />
        ))}
        <div className="absolute inset-x-0 top-0 h-2/3 bg-gradient-to-b from-indigo-500/20 via-purple-500/10 to-transparent blur-2xl" />
        <div className="absolute inset-y-0 start-0 w-1/3 bg-gradient-to-e from-cyan-500/15 to-transparent blur-xl" />
        <div className="absolute inset-y-0 end-0 w-1/3 bg-gradient-to-s from-violet-500/15 to-transparent blur-xl" />
      </div>
    );
  }
  if (scene === "before-after") {
    return (
      <div className="absolute inset-0 flex pointer-events-none">
        <div className="w-1/2 bg-neutral-800/90" />
        <div className="w-1/2 bg-gradient-to-br from-indigo-900/80 via-purple-900/60 to-violet-800/80" />
        <div className="absolute inset-y-0 start-1/2 w-px bg-white/30" />
      </div>
    );
  }
  if (scene === "lifestyle") {
    return <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_100%,rgba(200,100,120,0.15),transparent_70%)] pointer-events-none" />;
  }
  return null;
}

function SlideContent({ slide, priority }: { slide: GallerySlide; priority?: boolean }) {
  const isDark = !["hero", "closeup", "package", "dimensions", "features", "benefits", "packaging"].includes(slide.scene);
  const scale = slide.imageScale ?? 1;

  if (slide.isVideo && slide.videoUrl) {
    return (
      <div className="relative w-full h-full overflow-hidden bg-black">
        <video
          src={slide.videoUrl}
          poster={slide.imageUrl}
          controls
          playsInline
          preload="metadata"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
    );
  }

  return (
    <div className={cn("relative w-full h-full overflow-hidden", SCENE_BG[slide.scene])}>
      <SceneDecor scene={slide.scene} />

      {slide.scene === "before-after" && (
        <>
          <span className="absolute top-4 start-4 z-20 text-[10px] font-bold tracking-widest text-neutral-400 uppercase">قبل</span>
          <span className="absolute top-4 end-4 z-20 text-[10px] font-bold tracking-widest text-luxury-gold uppercase">بعد</span>
        </>
      )}

      {(slide.scene === "features" || slide.scene === "benefits") && slide.icons && (
        <div className="absolute inset-x-4 bottom-20 sm:bottom-24 z-20 grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
          {slide.icons.map((icon) => (
            <div key={icon.label} className="flex items-center gap-2 bg-white/90 backdrop-blur-md rounded-xl px-3 py-2.5 border border-black/5 shadow-soft">
              <span className="text-lg">{icon.emoji}</span>
              <span className="text-[11px] sm:text-xs font-semibold leading-tight">{icon.label}</span>
            </div>
          ))}
        </div>
      )}

      {slide.scene === "package" && slide.items && (
        <div className="absolute inset-x-4 bottom-16 sm:bottom-20 z-20 space-y-2">
          {slide.items.map((item) => (
            <div key={item} className="flex items-center gap-2 bg-white/90 backdrop-blur-md rounded-xl px-4 py-2.5 border border-black/5">
              <Package className="h-4 w-4 text-luxury-gold shrink-0" />
              <span className="text-xs font-medium">{item}</span>
            </div>
          ))}
        </div>
      )}

      {slide.scene === "closeup" && (
        <div className="absolute inset-x-6 bottom-20 sm:bottom-24 z-20 flex gap-3 justify-center">
          <div className="flex items-center gap-2 bg-white/95 backdrop-blur-md rounded-2xl px-5 py-3 border border-black/5 shadow-soft">
            <Bluetooth className="h-5 w-5 text-luxury-black" />
            <span className="text-xs font-bold">بلوتوث</span>
          </div>
          <div className="flex items-center gap-2 bg-white/95 backdrop-blur-md rounded-2xl px-5 py-3 border border-black/5 shadow-soft">
            <Usb className="h-5 w-5 text-luxury-black" />
            <span className="text-xs font-bold">USB Type-C</span>
          </div>
        </div>
      )}

      {slide.scene === "dimensions" && (
        <div className="absolute inset-x-6 bottom-20 z-20 flex justify-center">
          <div className="flex items-center gap-3 bg-luxury-black/90 text-white backdrop-blur-md rounded-2xl px-6 py-4">
            <Ruler className="h-5 w-5 text-luxury-gold" />
            <span className="text-sm font-bold">{slide.subtitle}</span>
          </div>
        </div>
      )}

      <div
        className={cn(
          "absolute inset-0 flex items-center justify-center transition-transform duration-700",
          slide.scene === "lifestyle" && "items-end pb-8",
          slide.scene === "environment" && "items-start pt-6",
          slide.scene === "hero" && "p-8 sm:p-12"
        )}
        style={{ transform: `scale(${scale})` }}
      >
        <div className={cn("relative w-full h-full", slide.scene === "hero" ? "max-w-[85%] max-h-[85%]" : "opacity-90")}>
          <Image
            src={slide.imageUrl}
            alt={slide.heading}
            fill
            priority={priority}
            loading={priority ? undefined : "lazy"}
            sizes="(max-width: 1024px) 100vw, 50vw"
            className={cn(
              slide.objectFit === "contain" ? "object-contain" : "object-cover",
              isDark && slide.scene !== "before-after" && "mix-blend-lighten opacity-95"
            )}
            style={{ objectPosition: slide.objectPosition }}
          />
        </div>
      </div>

      {slide.scene === "closeup" && (
        <div className="absolute top-1/3 end-8 w-16 h-28 bg-neutral-800 rounded-2xl shadow-luxury opacity-80 blur-[1px] hidden sm:block" aria-hidden />
      )}
    </div>
  );
}

export function PremiumProductGallery({ product }: PremiumProductGalleryProps) {
  const slides = useMemo(() => buildProductGallerySlides(product), [product]);
  const [active, setActive] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const thumbRef = useRef<HTMLDivElement>(null);

  const current = slides[active];
  const total = slides.length;

  const go = useCallback(
    (idx: number) => setActive(((idx % total) + total) % total),
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
      if (e.key === "Escape") { setZoomOpen(false); setFullscreen(false); }
      if (e.key === "ArrowRight") prev();
      if (e.key === "ArrowLeft") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [zoomOpen, fullscreen, next, prev]);

  return (
    <>
      <div className="space-y-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="text-center sm:text-start"
          >
            <p className="text-[10px] font-bold tracking-[0.25em] text-luxury-gold uppercase mb-1" dir="ltr">
              {String(active + 1).padStart(2, "0")} — {String(total).padStart(2, "0")}
            </p>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight">{current.heading}</h2>
            {current.subtitle && (
              <p className="text-sm text-luxury-muted mt-1 leading-relaxed">{current.subtitle}</p>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="relative aspect-square rounded-[1.75rem] overflow-hidden bg-white shadow-luxury border border-black/5 group touch-pan-y">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 cursor-zoom-in"
              drag={current.isVideo ? false : "x"}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.6}
              onClick={() => !current.isVideo && setZoomOpen(true)}
              onDragEnd={(_, info) => {
                if (info.offset.x < -60) next();
                else if (info.offset.x > 60) prev();
              }}
            >
              <SlideContent slide={current} priority={active <= 1} />
            </motion.div>
          </AnimatePresence>

          {product.isTikTokViral && (
            <span className="absolute top-4 start-4 z-20 glass text-luxury-black text-[10px] font-bold px-3 py-1.5 rounded-full tracking-wide flex items-center gap-1.5">
              <Sparkles className="h-3 w-3 text-luxury-gold" />
              فيرال تيك توك
            </span>
          )}

          <button type="button" onClick={(e) => { e.stopPropagation(); prev(); }} className="absolute start-3 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full glass flex items-center justify-center opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all hover:scale-105 shadow-soft" aria-label="السابق">
            <ChevronRight className="h-5 w-5" />
          </button>
          <button type="button" onClick={(e) => { e.stopPropagation(); next(); }} className="absolute end-3 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full glass flex items-center justify-center opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all hover:scale-105 shadow-soft" aria-label="التالي">
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div className="absolute bottom-4 end-4 z-20 flex gap-2">
            <button type="button" onClick={(e) => { e.stopPropagation(); setZoomOpen(true); }} className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-white shadow-soft" aria-label="تكبير">
              <ZoomIn className="h-4 w-4" />
            </button>
            <button type="button" onClick={(e) => { e.stopPropagation(); setFullscreen(true); }} className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-white shadow-soft" aria-label="ملء الشاشة">
              <Maximize2 className="h-4 w-4" />
            </button>
          </div>

          <div className="absolute bottom-4 start-4 z-20 glass rounded-full px-3 py-1.5 text-[11px] font-semibold tabular-nums">
            <span dir="ltr">{active + 1} / {total}</span>
          </div>
        </div>

        <div ref={thumbRef} className="flex gap-2.5 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide -mx-1 px-1">
          {slides.map((slide, i) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => setActive(i)}
              className={cn(
                "relative shrink-0 snap-center rounded-2xl overflow-hidden border-2 transition-all duration-300",
                i === active
                  ? "border-luxury-gold shadow-luxury scale-105 w-[72px] h-[72px] sm:w-20 sm:h-20"
                  : "border-transparent opacity-60 hover:opacity-100 w-16 h-16 sm:w-[72px] sm:h-[72px]"
              )}
              aria-label={slide.heading}
              aria-current={i === active}
            >
              <div className={cn("absolute inset-0", SCENE_BG[slide.scene])}>
                <Image src={slide.imageUrl} alt="" fill sizes="80px" loading="lazy" className="object-cover opacity-80" />
              </div>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-luxury-black/80 to-transparent pt-4 pb-1 px-1">
                <span className="text-[8px] sm:text-[9px] text-white font-bold leading-none line-clamp-2 text-center block">
                  {slide.heading.split(" ").slice(0, 2).join(" ")}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {zoomOpen && (
          <GalleryOverlay mode="zoom" slide={current} active={active} total={total} onClose={() => setZoomOpen(false)} onPrev={prev} onNext={next} />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {fullscreen && (
          <GalleryOverlay mode="fullscreen" slide={current} active={active} total={total} onClose={() => setFullscreen(false)} onPrev={prev} onNext={next} />
        )}
      </AnimatePresence>
    </>
  );
}

function GalleryOverlay({
  mode,
  slide,
  active,
  total,
  onClose,
  onPrev,
  onNext,
}: {
  mode: "zoom" | "fullscreen";
  slide: GallerySlide;
  active: number;
  total: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={cn(
        "fixed inset-0 z-[100] flex flex-col",
        mode === "zoom" ? "bg-luxury-black/96 backdrop-blur-sm p-4 sm:p-8" : "bg-black"
      )}
      onClick={onClose}
    >
      <div className="flex items-center justify-between mb-4 px-2" onClick={(e) => e.stopPropagation()}>
        <div>
          <p className="text-luxury-gold text-[10px] font-bold tracking-[0.2em] uppercase">{slide.heading}</p>
          {slide.subtitle && <p className="text-white/60 text-xs mt-1">{slide.subtitle}</p>}
        </div>
        <button type="button" onClick={onClose} className="text-white p-2 rounded-full hover:bg-white/10" aria-label="إغلاق">
          <X className="h-6 w-6" />
        </button>
      </div>
      <div className="relative flex-1 min-h-0 rounded-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <SlideContent slide={slide} priority />
      </div>
      <div className="flex items-center justify-center gap-4 mt-4" onClick={(e) => e.stopPropagation()}>
        <button type="button" onClick={onPrev} className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20"><ChevronRight className="h-5 w-5" /></button>
        <span className="text-white/70 text-sm tabular-nums" dir="ltr">{active + 1} / {total}</span>
        <button type="button" onClick={onNext} className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20"><ChevronLeft className="h-5 w-5" /></button>
      </div>
    </motion.div>
  );
}
