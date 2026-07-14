import type { Product } from "@/types";
import type { ImageType } from "@/lib/ai/image-generator";
import { resolveProductImage } from "@/lib/product-images/resolve";

export type GalleryScene =
  | "hero"
  | "ceiling"
  | "bedroom"
  | "gaming"
  | "night-room"
  | "remote-bluetooth"
  | "dimensions"
  | "package"
  | "features"
  | "before-after";

export interface GallerySlide {
  id: string;
  scene: GalleryScene;
  emoji: string;
  heading: string;
  subtitle?: string;
  imageUrl: string;
  objectFit?: "cover" | "contain";
  objectPosition?: string;
  imageScale?: number;
  icons?: { emoji: string; label: string }[];
  items?: string[];
}

/** Bear-ear chest-speaker Bluetooth astronaut — user reference product */
const ASTRONAUT_SCENE_TYPES: Partial<Record<GalleryScene, ImageType>> = {
  hero: "02-premium-hero",
  ceiling: "14-product-in-use",
  bedroom: "04-bedroom",
  gaming: "06-gaming-room",
  "night-room": "04-bedroom",
  "remote-bluetooth": "09-close-up",
  dimensions: "12-dimensions",
  package: "11-package-contents",
  features: "10-features",
  "before-after": "13-before-after",
};

const GALLERY_SCENES: Array<{
  scene: GalleryScene;
  emoji: string;
  heading: string;
  subtitle: string;
  aiType: ImageType;
}> = [
  { scene: "hero", emoji: "📦", heading: "صورة المنتج على خلفية بيضاء", subtitle: "تصميم فاخر · جودة عالية · جاهز للطلب", aiType: "Premium White Background" },
  { scene: "ceiling", emoji: "🌌", heading: "المنتج يعمل ويعرض النجوم على السقف", subtitle: "مجرة حية تغطي السقف بالكامل", aiType: "Product in Use" },
  { scene: "bedroom", emoji: "🛏️", heading: "داخل غرفة نوم حديثة", subtitle: "أجواء هادئة وفاخرة كل مساء", aiType: "Bedroom Scene" },
  { scene: "gaming", emoji: "🎮", heading: "داخل غرفة Gaming", subtitle: "أجواء سينمائية لجلسات اللعب", aiType: "Gaming Room" },
  { scene: "night-room", emoji: "🌙", heading: "لقطة ليلية كاملة للغرفة", subtitle: "تحوّل كامل للغرفة تحت ضوء النجوم", aiType: "Night Scene" },
  { scene: "remote-bluetooth", emoji: "🎵", heading: "الريموت والبلوتوث", subtitle: "تحكم عن بعد + موسيقى عبر البلوتوث", aiType: "Close-up Details" },
  { scene: "dimensions", emoji: "📏", heading: "المقاسات", subtitle: "حجم مثالي يناسب أي غرفة", aiType: "Dimensions" },
  { scene: "package", emoji: "📦", heading: "محتويات العلبة", subtitle: "كل ما تحتاجه في علبة واحدة", aiType: "Box Contents" },
  { scene: "features", emoji: "⭐", heading: "المميزات", subtitle: "تقنيات مصممة لرفع تجربتك", aiType: "Features" },
  { scene: "before-after", emoji: "🔄", heading: "قبل / بعد", subtitle: "الفرق واضح من أول تشغيل", aiType: "Before After" },
];

const FEATURE_ICONS = ["✨", "🌌", "🎵", "🎮", "⏰", "🌈"];

export function buildProductGallerySlides(product: Product): GallerySlide[] {
  const dims = product.specifications?.find((s) => s.label.ar.includes("أبعاد"))?.value.ar;
  const features = (product.features || product.benefits).slice(0, 6);
  const pkg = product.packageIncludes || [];
  const isAstronaut = product.slug === "astronaut-galaxy-projector";

  return GALLERY_SCENES.map((cfg, i) => {
    const astronautType = isAstronaut ? ASTRONAUT_SCENE_TYPES[cfg.scene] : undefined;
    const imageType = (astronautType ?? cfg.aiType) as ImageType;
    const imageUrl = resolveProductImage(product, imageType);

    const astronautHeadings: Partial<Record<GalleryScene, { heading: string; subtitle: string }>> = {
      hero: { heading: "رائد فضاء أبيض — صورة المنتج الحقيقية", subtitle: "آذان دب · سبيكر صدر · ريموت · بلوتوث MXS003" },
      ceiling: { heading: "المنتج يعمل — مجرة وهلال على السقف", subtitle: "8 أوضاع ألوان + نجوم خضراء ليزر" },
      bedroom: { heading: "داخل غرفة نوم — إضاءة هادئة", subtitle: "هلال ملون · مجرة · أجواء نوم مريحة" },
      gaming: { heading: "8 أوضاع إضاءة + ريموت", subtitle: "ألوان مجرة متعددة · تحكم كامل عن بعد" },
      "night-room": { heading: "سطوع قابل للتعديل 30% / 60% / 100%", subtitle: "مؤقت تلقائي · إضاءة مثالية للنوم" },
      "remote-bluetooth": { heading: "الريموت · الأزرار الخلفية · البلوتوث", subtitle: "ON/OFF · Model · Light · Music/Sound" },
      dimensions: { heading: "المقاسات والتفاصيل التقنية", subtitle: dims ?? "9.97×4.72 بوصة · قاعدة قمرية" },
      package: { heading: "محتويات العلبة الكاملة", subtitle: "بروجيكتور + ريموت أسود + كابل USB + دليل" },
      features: { heading: "رأس مغناطيسي 360° قابل للتعديل", subtitle: "ذراع متحرك · قاعدة ثابتة · عدسة HD" },
      "before-after": { heading: "قبل وبعد — تحوّل الغرفة", subtitle: "من إضاءة عادية إلى سماء نجوم حية" },
    };

    const astroCopy = isAstronaut ? astronautHeadings[cfg.scene] : undefined;

    const slide: GallerySlide = {
      id: `slide-${product.id}-${i}`,
      scene: cfg.scene,
      emoji: cfg.emoji,
      heading: astroCopy?.heading ?? cfg.heading,
      subtitle: astroCopy?.subtitle ?? (cfg.scene === "dimensions" && dims ? dims : cfg.subtitle),
      imageUrl,
      objectFit: isAstronaut && (cfg.scene === "hero" || cfg.scene === "features" || cfg.scene === "dimensions") ? "contain" : "cover",
      objectPosition: "center",
      imageScale: 1,
    };

    if (cfg.scene === "features") {
      slide.icons = features.map((f, idx) => ({
        emoji: FEATURE_ICONS[idx % FEATURE_ICONS.length],
        label: f.ar,
      }));
    }

    if (cfg.scene === "package") {
      slide.items = pkg.map((p) => p.ar);
    }

    return slide;
  });
}
