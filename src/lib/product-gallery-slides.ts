import type { Product } from "@/types";
import type { PremiumImageType } from "@/lib/product-images/types";
import { resolveProductImage } from "@/lib/product-images/resolve";
import {
  getGallerySlideConfigs,
  GALLERY_SECTION_LABELS,
  type GallerySection,
  type GallerySlideConfig,
} from "@/lib/product-gallery-config";

export type { GallerySection };

export interface GallerySlide {
  id: string;
  section: GallerySection;
  sectionLabel: string;
  emoji: string;
  heading: string;
  subtitle: string;
  imageUrl: string;
  imageType: PremiumImageType;
  objectFit: "cover" | "contain";
  objectPosition?: string;
}

export function buildProductGallerySlides(product: Product): GallerySlide[] {
  const configs = getGallerySlideConfigs(product.slug);
  const seen = new Set<string>();

  return configs
    .map((cfg) => {
      const imageUrl = resolveProductImage(product, cfg.imageType);
      if (seen.has(imageUrl)) return null;
      seen.add(imageUrl);

      const slide: GallerySlide = {
        id: `slide-${product.id}-${cfg.imageType}`,
        section: cfg.section,
        sectionLabel: GALLERY_SECTION_LABELS[cfg.section],
        emoji: cfg.emoji,
        heading: cfg.heading,
        subtitle: cfg.subtitle,
        imageUrl,
        imageType: cfg.imageType,
        objectFit: cfg.objectFit ?? "cover",
        objectPosition: "center",
      };
      return slide;
    })
    .filter((s): s is GallerySlide => s !== null);
}

/** Main product gallery: max 6 curated slides (hero → lifestyle → feature → use → angle → package) */
const PRIMARY_GALLERY_TYPES: PremiumImageType[] = [
  "01-hero-white-bg",
  "02-premium-hero",
  "09-close-up",
  "03-lifestyle",
  "04-bedroom",
  "11-package-contents",
];

const PRIMARY_GALLERY_FALLBACKS: PremiumImageType[] = [
  "01-hero-white-bg",
  "04-bedroom",
  "05-living-room",
  "06-gaming-room",
  "16-packaging",
  "08-kids-room",
];

export function buildPrimaryGallerySlides(product: Product, limit = 6): GallerySlide[] {
  const all = buildProductGallerySlides(product);
  const byType = new Map(all.map((s) => [s.imageType, s]));
  const picked: GallerySlide[] = [];
  const used = new Set<string>();

  const tryAdd = (type: PremiumImageType) => {
    if (picked.length >= limit) return;
    const slide = byType.get(type);
    if (!slide || used.has(slide.id)) return;
    picked.push(slide);
    used.add(slide.id);
  };

  for (const type of PRIMARY_GALLERY_TYPES) tryAdd(type);
  for (const type of PRIMARY_GALLERY_FALLBACKS) tryAdd(type);
  for (const slide of all) {
    if (picked.length >= limit) break;
    if (!used.has(slide.id)) {
      picked.push(slide);
      used.add(slide.id);
    }
  }

  return picked;
}

/** First slide image per section — for landing page section headers */
export function getSectionHeroImage(
  product: Product,
  section: GallerySection
): string | undefined {
  const slide = buildProductGallerySlides(product).find((s) => s.section === section);
  return slide?.imageUrl;
}

export function getSlidesBySection(product: Product): Map<GallerySection, GallerySlide[]> {
  const map = new Map<GallerySection, GallerySlide[]>();
  for (const slide of buildProductGallerySlides(product)) {
    const list = map.get(slide.section) ?? [];
    list.push(slide);
    map.set(slide.section, list);
  }
  return map;
}
