"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, ZoomIn, X, Maximize2, Play, Loader2 } from "lucide-react";
import type { Product, Locale, ProductImage } from "@/types";
import { getLocalized } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  product: Product;
  locale: Locale;
  activeIndex: number;
  onIndexChange: (index: number) => void;
}

export function ProductGallery({ product, locale, activeIndex, onIndexChange }: ProductGalleryProps) {
  const [zoomOpen, setZoomOpen] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [loaded, setLoaded] = useState<Record<string, boolean>>({});
  const [dragging360, setDragging360] = useState(false);

  const media = product.images;
  const current = media[activeIndex];

  const next = useCallback(() => onIndexChange((activeIndex + 1) % media.length), [activeIndex, media.length, onIndexChange]);
  const prev = useCallback(() => onIndexChange((activeIndex - 1 + media.length) % media.length), [activeIndex, media.length, onIndexChange]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!zoomOpen && !fullscreen) return;
      if (e.key === "Escape") { setZoomOpen(false); setFullscreen(false); }
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [zoomOpen, fullscreen, next, prev]);

  const handle360Move = (clientX: number, rect: DOMRect) => {
    const x = (clientX - rect.left) / rect.width;
    const idx = Math.min(media.length - 1, Math.max(0, Math.floor(x * media.length)));
    onIndexChange(idx);
  };

  const renderMedia = (item: ProductImage, fill = true, priority = false) => {
    const isLoaded = loaded[item.id];
    return (
      <>
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-neutral-100">
            <Loader2 className="h-8 w-8 text-gold animate-spin" />
          </div>
        )}
        <Image
          src={item.url}
          alt={getLocalized(item.alt, locale)}
          fill={fill}
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority={priority}
          className={cn("object-cover transition-opacity duration-500", isLoaded ? "opacity-100" : "opacity-0")}
          onLoad={() => setLoaded((s) => ({ ...s, [item.id]: true }))}
        />
      </>
    );
  };

  return (
    <>
      <div className="space-y-4">
        <div className="relative aspect-square overflow-hidden rounded-3xl bg-white shadow-luxury border border-black/5 group">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full h-full cursor-zoom-in"
              onClick={() => setZoomOpen(true)}
            >
              {current && renderMedia(current, true, true)}
            </motion.div>
          </AnimatePresence>

          {product.isTikTokViral && (
            <span className="absolute top-4 start-4 glass-dark text-cream text-[10px] font-semibold px-3 py-1.5 rounded-full tracking-widest z-10">
              فيرال تيك توك
            </span>
          )}

          {media.length > 1 && (
            <>
              <button type="button" onClick={(e) => { e.stopPropagation(); prev(); }} className="absolute start-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full glass flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-white z-10" aria-label="Previous">
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button type="button" onClick={(e) => { e.stopPropagation(); next(); }} className="absolute end-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full glass flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-white z-10" aria-label="Next">
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}

          <div className="absolute bottom-4 end-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
            <button type="button" onClick={(e) => { e.stopPropagation(); setZoomOpen(true); }} className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-white" aria-label="Zoom">
              <ZoomIn className="h-4 w-4" />
            </button>
            <button type="button" onClick={(e) => { e.stopPropagation(); setFullscreen(true); }} className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-white" aria-label="Fullscreen">
              <Maximize2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-1 snap-x scrollbar-hide">
          {media.map((img, i) => (
            <button
              key={img.id}
              type="button"
              onClick={() => onIndexChange(i)}
              className={cn(
                "relative w-[72px] h-[72px] md:w-20 md:h-20 shrink-0 overflow-hidden rounded-2xl border-2 transition-all duration-300 snap-center",
                i === activeIndex ? "border-gold shadow-soft scale-105" : "border-transparent opacity-70 hover:opacity-100"
              )}
            >
              <Image src={img.url} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
          {product.videoUrl && (
            <button type="button" className="relative w-[72px] h-[72px] shrink-0 rounded-2xl border-2 border-dashed border-gold/40 flex items-center justify-center bg-navy/5">
              <Play className="h-5 w-5 text-gold" />
            </button>
          )}
        </div>

        {/* 360 viewer */}
        <div className="premium-card rounded-3xl p-5 hidden md:block">
          <p className="text-[10px] tracking-[0.2em] uppercase text-gold font-semibold mb-3">360°</p>
          <div
            className={cn("relative aspect-[2/1] rounded-2xl overflow-hidden bg-neutral-100", dragging360 ? "cursor-grabbing" : "cursor-grab")}
            onMouseDown={() => setDragging360(true)}
            onMouseUp={() => setDragging360(false)}
            onMouseLeave={() => setDragging360(false)}
            onMouseMove={(e) => dragging360 && handle360Move(e.clientX, e.currentTarget.getBoundingClientRect())}
            onTouchMove={(e) => {
              const touch = e.touches[0];
              if (touch) handle360Move(touch.clientX, e.currentTarget.getBoundingClientRect());
            }}
          >
            {current && <Image src={current.url} alt="" fill className="object-cover" sizes="50vw" />}
            <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-noir/40 to-transparent flex items-end justify-center pb-2">
              <span className="text-[10px] text-white/80 tracking-wider uppercase">Drag to rotate</span>
            </div>
          </div>
        </div>
      </div>

      {/* Zoom overlay */}
      <AnimatePresence>
        {zoomOpen && current && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-noir/95 flex items-center justify-center p-4"
            onClick={() => setZoomOpen(false)}
          >
            <button type="button" className="absolute top-6 end-6 text-cream p-2" onClick={() => setZoomOpen(false)} aria-label="Close">
              <X className="h-6 w-6" />
            </button>
            <div className="relative w-full max-w-5xl aspect-square" onClick={(e) => e.stopPropagation()}>
              <Image src={current.url} alt={getLocalized(current.alt, locale)} fill className="object-contain" sizes="100vw" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fullscreen */}
      <AnimatePresence>
        {fullscreen && current && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black">
            <button type="button" className="absolute top-6 end-6 text-white z-10 p-2" onClick={() => setFullscreen(false)}><X className="h-6 w-6" /></button>
            <Image src={current.url} alt="" fill className="object-contain" sizes="100vw" />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
