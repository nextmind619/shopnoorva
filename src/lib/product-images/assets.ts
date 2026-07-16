import type { PremiumImageType } from "./types";
import { IMAGE_TYPE_CONFIGS, PREMIUM_IMAGE_TYPES } from "./types";
import { PRODUCT_PROFILES } from "./profiles";

export interface OptimizedImageSet {
  original: string;
  webp: string;
  avif: string;
  thumbnail: string;
  responsive: {
    sm: string;
    md: string;
    lg: string;
  };
}

export interface ProductImageManifest {
  generatedAt: string;
  products: Record<
    string,
    {
      slug: string;
      sku: string;
      name: string;
      images: Partial<Record<PremiumImageType, OptimizedImageSet>>;
      prompts: Partial<Record<PremiumImageType, Record<string, string>>>;
      sources: Partial<Record<PremiumImageType, "commercial" | "ai-generated">>;
    }
  >;
}

// Static manifest — updated by scripts/generate-product-images.mjs
import manifestData from "./manifest.json";

const manifest = manifestData as ProductImageManifest;

export function getProductImageManifest(): ProductImageManifest {
  return manifest;
}

export function getProductImageUrl(
  slug: string,
  imageType: PremiumImageType,
  variant: "webp" | "avif" | "original" | "thumbnail" | "sm" | "md" | "lg" = "webp"
): string | undefined {
  const entry = manifest.products[slug]?.images[imageType];
  if (!entry) return undefined;

  switch (variant) {
    case "original":
      return entry.original;
    case "webp":
      return entry.webp;
    case "avif":
      return entry.avif;
    case "thumbnail":
      return entry.thumbnail;
    case "sm":
      return entry.responsive.sm;
    case "md":
      return entry.responsive.md;
    case "lg":
      return entry.responsive.lg;
    default:
      return entry.webp;
  }
}

export function getProductHeroUrl(slug: string): string {
  // Astronaut uses premium marketing composite as hero
  if (slug === "astronaut-bt-speaker-projector") {
    return (
      getProductImageUrl(slug, "02-premium-hero", "webp") ||
      getProductImageUrl(slug, "01-hero-white-bg", "webp") ||
      `/products/${slug.replace(/-projector$|-night-light$/, "")}.svg`
    );
  }
  return (
    getProductImageUrl(slug, "01-hero-white-bg", "webp") ||
    getProductImageUrl(slug, "02-premium-hero", "webp") ||
    `/products/${slug.replace(/-projector$|-night-light$/, "")}.svg`
  );
}

export function getAllProductImages(slug: string): OptimizedImageSet[] {
  const product = manifest.products[slug];
  if (!product) return [];
  return PREMIUM_IMAGE_TYPES.map((t) => product.images[t]).filter(Boolean) as OptimizedImageSet[];
}

export function getImagesForSection(
  slug: string,
  section: "gallery" | "lifestyle" | "features" | "packaging" | "specifications" | "banner" | "comparison"
): { type: PremiumImageType; url: string }[] {
  return PREMIUM_IMAGE_TYPES.filter((t) => IMAGE_TYPE_CONFIGS[t].section === section)
    .map((t) => ({
      type: t,
      url: getProductImageUrl(slug, t, "webp") || "",
    }))
    .filter((i) => i.url);
}

export function getProductGalleryImages(slug: string): string[] {
  return getImagesForSection(slug, "gallery").map((i) => i.url);
}

export function getProductLifestyleImages(slug: string): string[] {
  return getImagesForSection(slug, "lifestyle").map((i) => i.url);
}

export function getProductBannerUrl(slug: string, device: "mobile" | "desktop" | "social" = "desktop"): string {
  const typeMap = {
    mobile: "18-mobile-banner" as PremiumImageType,
    desktop: "19-desktop-banner" as PremiumImageType,
    social: "20-social-media-banner" as PremiumImageType,
  };
  return getProductImageUrl(slug, typeMap[device], "webp") || getProductHeroUrl(slug);
}

export function getProductBeforeAfter(slug: string): { before: string; after: string } | undefined {
  const url = getProductImageUrl(slug, "13-before-after", "webp");
  if (!url) return undefined;
  return { before: url, after: url };
}

/** Step 1 analysis export */
export function getProductAnalysis() {
  return PRODUCT_PROFILES.map((p) => ({
    productName: p.name,
    productType: p.type,
    productColor: p.color,
    productCategory: p.category,
    sku: p.sku,
    slug: p.slug,
    existingImages: Object.keys(manifest.products[p.slug]?.images || {}),
    imageCount: Object.keys(manifest.products[p.slug]?.images || {}).length,
    sources: manifest.products[p.slug]?.sources || {},
  }));
}
