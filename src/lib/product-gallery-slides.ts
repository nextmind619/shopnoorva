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
    .map((cfg, i) => {
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
