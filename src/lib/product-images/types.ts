/** 20 premium image types per product (Steps 4 & 6) */
export const PREMIUM_IMAGE_TYPES = [
  "01-hero-white-bg",
  "02-premium-hero",
  "03-lifestyle",
  "04-bedroom",
  "05-living-room",
  "06-gaming-room",
  "07-romantic-room",
  "08-kids-room",
  "09-close-up",
  "10-features",
  "11-package-contents",
  "12-dimensions",
  "13-before-after",
  "14-product-in-use",
  "15-banner",
  "16-packaging",
  "17-infographic",
  "18-mobile-banner",
  "19-desktop-banner",
  "20-social-media-banner",
] as const;

export type PremiumImageType = (typeof PREMIUM_IMAGE_TYPES)[number];

export type ImageSection =
  | "gallery"
  | "lifestyle"
  | "features"
  | "packaging"
  | "specifications"
  | "banner"
  | "comparison"
  | "social";

export interface ImageTypeConfig {
  id: PremiumImageType;
  label: string;
  section: ImageSection;
  width: number;
  height: number;
  folder: "products" | "generated" | "banners" | "lifestyle" | "specifications";
}

export const IMAGE_TYPE_CONFIGS: Record<PremiumImageType, ImageTypeConfig> = {
  "01-hero-white-bg": { id: "01-hero-white-bg", label: "Hero White Background", section: "gallery", width: 2000, height: 2000, folder: "products" },
  "02-premium-hero": { id: "02-premium-hero", label: "Premium Hero", section: "gallery", width: 2000, height: 2000, folder: "products" },
  "03-lifestyle": { id: "03-lifestyle", label: "Lifestyle", section: "lifestyle", width: 2000, height: 2000, folder: "lifestyle" },
  "04-bedroom": { id: "04-bedroom", label: "Bedroom", section: "lifestyle", width: 2000, height: 2000, folder: "lifestyle" },
  "05-living-room": { id: "05-living-room", label: "Living Room", section: "lifestyle", width: 2000, height: 2000, folder: "lifestyle" },
  "06-gaming-room": { id: "06-gaming-room", label: "Gaming Room", section: "lifestyle", width: 2000, height: 2000, folder: "lifestyle" },
  "07-romantic-room": { id: "07-romantic-room", label: "Romantic Room", section: "lifestyle", width: 2000, height: 2000, folder: "lifestyle" },
  "08-kids-room": { id: "08-kids-room", label: "Kids Room", section: "lifestyle", width: 2000, height: 2000, folder: "lifestyle" },
  "09-close-up": { id: "09-close-up", label: "Close-up", section: "gallery", width: 2000, height: 2000, folder: "products" },
  "10-features": { id: "10-features", label: "Features", section: "features", width: 2000, height: 2000, folder: "generated" },
  "11-package-contents": { id: "11-package-contents", label: "Package Contents", section: "packaging", width: 2000, height: 2000, folder: "products" },
  "12-dimensions": { id: "12-dimensions", label: "Dimensions", section: "specifications", width: 2000, height: 2000, folder: "specifications" },
  "13-before-after": { id: "13-before-after", label: "Before After", section: "comparison", width: 2000, height: 2000, folder: "generated" },
  "14-product-in-use": { id: "14-product-in-use", label: "Product in Use", section: "gallery", width: 2000, height: 2000, folder: "lifestyle" },
  "15-banner": { id: "15-banner", label: "Banner", section: "banner", width: 2000, height: 800, folder: "banners" },
  "16-packaging": { id: "16-packaging", label: "Packaging", section: "packaging", width: 2000, height: 2000, folder: "products" },
  "17-infographic": { id: "17-infographic", label: "Infographic", section: "features", width: 2000, height: 2000, folder: "generated" },
  "18-mobile-banner": { id: "18-mobile-banner", label: "Mobile Banner", section: "banner", width: 1080, height: 1920, folder: "banners" },
  "19-desktop-banner": { id: "19-desktop-banner", label: "Desktop Banner", section: "banner", width: 2560, height: 800, folder: "banners" },
  "20-social-media-banner": { id: "20-social-media-banner", label: "Social Media Banner", section: "social", width: 1200, height: 1200, folder: "banners" },
};
