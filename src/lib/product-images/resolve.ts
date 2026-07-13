import type { Product } from "@/types";
import type { PremiumImageType } from "./types";
import { IMAGE_TYPE_CONFIGS } from "./types";
import { getProductImageUrl, getProductHeroUrl, getProductLifestyleImages, getProductBannerUrl, getProductBeforeAfter } from "./assets";
import { getPollinationsUrl } from "./prompts";
import { getProductProfile } from "./profiles";
import { getAIImageUrl, type ImageType } from "@/lib/ai/image-generator";

/** Map legacy ImageType to PremiumImageType */
const LEGACY_TO_PREMIUM: Partial<Record<ImageType, PremiumImageType>> = {
  "Hero Image": "02-premium-hero",
  "Premium White Background": "01-hero-white-bg",
  "Lifestyle Image": "03-lifestyle",
  "Bedroom Scene": "04-bedroom",
  "Living Room Scene": "05-living-room",
  "Gaming Room": "06-gaming-room",
  "Luxury Home": "03-lifestyle",
  "Close-up Details": "09-close-up",
  "Product in Use": "14-product-in-use",
  "Before After": "13-before-after",
  "Premium Packaging": "16-packaging",
  "Dimensions": "12-dimensions",
  "Box Contents": "11-package-contents",
  "Infographic": "17-infographic",
  "Features": "10-features",
  "Mobile Banner": "18-mobile-banner",
  "Desktop Banner": "19-desktop-banner",
  "Collection Banner": "15-banner",
  "Trust Banner": "15-banner",
  "Facebook Ad": "20-social-media-banner",
  "Instagram Post": "20-social-media-banner",
  "TikTok Cover": "18-mobile-banner",
  "Gift Scene": "08-kids-room",
  "Night Scene": "04-bedroom",
};

export type ImageVariant = "webp" | "avif" | "original" | "thumbnail" | "sm" | "md" | "lg";

/**
 * Resolve product image URL: local optimized asset first, Pollinations AI fallback.
 */
export function resolveProductImage(
  product: Product | string,
  imageType: PremiumImageType | ImageType,
  variant: ImageVariant = "webp"
): string {
  const slug = typeof product === "string" ? product : product.slug;
  const premiumType = (imageType as string).includes("-")
    ? (imageType as PremiumImageType)
    : LEGACY_TO_PREMIUM[imageType as ImageType] || "02-premium-hero";

  const local = getProductImageUrl(slug, premiumType, variant);
  if (local) return local;

  // Fallback to Pollinations
  const profile = getProductProfile(slug);
  if (profile) {
    const config = IMAGE_TYPE_CONFIGS[premiumType];
    if (config) {
      return getPollinationsUrl(profile, premiumType, config.width, config.height);
    }
  }

  const p = typeof product === "string" ? null : product;
  if (p) {
    return getAIImageUrl({
      productName: p.name.en || p.name.ar,
      productDescription: p.shortDescription.en || p.shortDescription.ar,
      type: imageType as ImageType,
      width: 1080,
      height: 1080,
    });
  }

  return getProductHeroUrl(slug);
}

export function resolveProductHero(product: Product | string): string {
  const slug = typeof product === "string" ? product : product.slug;
  const hero = getProductHeroUrl(slug);
  if (hero && !hero.endsWith(".svg")) return hero;
  return resolveProductImage(product, "01-hero-white-bg");
}

export function resolveLifestyleImage(product: Product): string {
  const images = getProductLifestyleImages(product.slug);
  if (images.length > 0) return images[0];
  return resolveProductImage(product, "03-lifestyle");
}

export function resolveBannerImage(product: Product, device: "mobile" | "desktop" | "social" = "desktop"): string {
  const url = getProductBannerUrl(product.slug, device);
  if (url && !url.endsWith(".svg")) return url;
  return resolveProductImage(product, device === "mobile" ? "18-mobile-banner" : "19-desktop-banner");
}

export function resolveBeforeAfter(product: Product): { before: string; after: string } | undefined {
  const ba = getProductBeforeAfter(product.slug);
  if (ba) return ba;
  const url = resolveProductImage(product, "13-before-after");
  return { before: url, after: url };
}

export function buildProductImagesFromManifest(product: Product) {
  const slug = product.slug;
  const L = product.name;

  const hero = resolveProductHero(product);
  const lifestyle = resolveLifestyleImage(product);
  const inUse = resolveProductImage(product, "14-product-in-use");
  const closeUp = resolveProductImage(product, "09-close-up");
  const features = resolveProductImage(product, "10-features");
  const packageContents = resolveProductImage(product, "11-package-contents");
  const dimensions = resolveProductImage(product, "12-dimensions");
  const beforeAfter = resolveBeforeAfter(product);

  return {
    images: [
      { id: "img-hero", url: hero, alt: L, type: "image" as const },
      { id: "img-in-use", url: inUse, alt: L, type: "image" as const },
      { id: "img-closeup", url: closeUp, alt: L, type: "image" as const },
      { id: "img-features", url: features, alt: L, type: "image" as const },
    ],
    lifestyleImages: [
      lifestyle,
      resolveProductImage(product, "04-bedroom"),
      resolveProductImage(product, "05-living-room"),
      resolveProductImage(product, "06-gaming-room"),
      resolveProductImage(product, "07-romantic-room"),
      resolveProductImage(product, "08-kids-room"),
    ].filter((v, i, a) => a.indexOf(v) === i),
    beforeAfter,
    banner: resolveBannerImage(product, "desktop"),
    mobileBanner: resolveBannerImage(product, "mobile"),
    socialBanner: resolveBannerImage(product, "social"),
    packageImage: packageContents,
    dimensionsImage: dimensions,
    packagingImage: resolveProductImage(product, "16-packaging"),
    infographicImage: resolveProductImage(product, "17-infographic"),
  };
}

/** Re-export prompt generator for Step 7 */
export { generatePromptForProvider, generateAllProviderPrompts, getPollinationsUrl } from "./prompts";
