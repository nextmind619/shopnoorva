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

/** Landing-page clones reuse the original product's optimized assets. */
const IMAGE_SLUG_ALIASES: Record<string, string> = {
  "magnetic-car-phone-mount": "magnetic-car-phone-mount-maidsail",
};

function resolveImageSlug(slug: string): string {
  return IMAGE_SLUG_ALIASES[slug] ?? slug;
}

function normalizePublicPath(url: string | undefined): string | undefined {
  if (!url) return undefined;
  return url.replace(/\\/g, "/");
}

export function getProductImageUrl(
  slug: string,
  imageType: PremiumImageType,
  variant: "webp" | "avif" | "original" | "thumbnail" | "sm" | "md" | "lg" = "webp"
): string | undefined {
  const entry = manifest.products[resolveImageSlug(slug)]?.images[imageType];
  if (!entry) return undefined;

  switch (variant) {
    case "original":
      return normalizePublicPath(entry.original);
    case "webp":
      return normalizePublicPath(entry.webp);
    case "avif":
      return normalizePublicPath(entry.avif);
    case "thumbnail":
      return normalizePublicPath(entry.thumbnail);
    case "sm":
      return normalizePublicPath(entry.responsive.sm);
    case "md":
      return normalizePublicPath(entry.responsive.md);
    case "lg":
      return normalizePublicPath(entry.responsive.lg);
    default:
      return normalizePublicPath(entry.webp);
  }
}

type HeroVariant = "webp" | "avif" | "original" | "thumbnail" | "sm" | "md" | "lg";

/** Catalog / cards prefer 02-premium-hero when white-bg slot is still a placeholder. */
const PREMIUM_HERO_FIRST_SLUGS = new Set([
  "astronaut-bt-speaker-projector",
  "green-laser-pointer-303",
  "magnetic-car-phone-mount-maidsail",
  "magnetic-car-phone-mount",
  "magnetic-car-phone-holder-1-plus-1",
  "car-dual-fan-foldable-sunshade-2in1-pack",
  "star-galaxy-projector-rgb-gift",
  "solar-calculator-lcd-notepad",
  "cordless-mini-vacuum-keyboard",
  "solar-helicopter-car-air-freshener",
  "foldable-car-windshield-sunshade",
  "kids-art-set-easel-208",
  "bt12-4in1-selfie-stick-tripod",
  "mobile-laptop-desk-with-wheels",
]);

function heroImageTypeOrder(slug: string): PremiumImageType[] {
  const key = resolveImageSlug(slug);
  const sources = manifest.products[key]?.sources;
  if (PREMIUM_HERO_FIRST_SLUGS.has(slug) || PREMIUM_HERO_FIRST_SLUGS.has(key)) {
    return ["02-premium-hero", "01-hero-white-bg"];
  }
  if (sources?.["01-hero-white-bg"] === "placeholder") {
    return ["02-premium-hero", "01-hero-white-bg"];
  }
  return ["01-hero-white-bg", "02-premium-hero"];
}

function pickFirstHeroUrl(slug: string, variant: HeroVariant): string | undefined {
  for (const imageType of heroImageTypeOrder(slug)) {
    const url =
      getProductImageUrl(slug, imageType, variant) ||
      getProductImageUrl(slug, imageType, "webp");
    if (url && !url.endsWith(".svg")) return url;
  }
  return undefined;
}

export function getProductHeroUrl(slug: string, variant: HeroVariant = "webp"): string {
  if (slug === "proteine-curve-collagen-glow") {
    return `/products/proteine-curve-collagen-glow.svg`;
  }
  return (
    pickFirstHeroUrl(slug, variant) ||
    `/products/${slug.replace(/-projector$|-night-light$|-303$/, "")}.svg`
  );
}

export function getAllProductImages(slug: string): OptimizedImageSet[] {
  const product = manifest.products[resolveImageSlug(slug)];
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
