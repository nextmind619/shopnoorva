import type { Product } from "@/types";

export type GalleryScene =
  | "hero"
  | "lifestyle"
  | "environment"
  | "features"
  | "closeup"
  | "package"
  | "dimensions"
  | "benefits"
  | "before-after"
  | "packaging";

export interface GallerySlide {
  id: string;
  scene: GalleryScene;
  heading: string;
  subtitle?: string;
  imageUrl: string;
  objectFit?: "cover" | "contain";
  objectPosition?: string;
  imageScale?: number;
  icons?: { emoji: string; label: string }[];
  items?: string[];
  isVideo?: boolean;
  videoUrl?: string;
}

/**
 * Order follows the required premium gallery sequence:
 * 1. Hero  2. Lifestyle  3. Real environment  4. Feature  5. Close-up
 * 6. Package contents  7. Dimensions  8. Benefits  9. Before/After  10. Packaging
 */
const SCENE_ORDER: GalleryScene[] = [
  "hero",
  "lifestyle",
  "environment",
  "features",
  "closeup",
  "package",
  "dimensions",
  "benefits",
  "before-after",
  "packaging",
];

const SCENE_HEADINGS: Record<GalleryScene, string> = {
  hero: "الصورة الرئيسية",
  lifestyle: "لحظة استرخاء تحت المجرات",
  environment: "المنتج داخل بيئة حقيقية",
  features: "المميزات الأساسية",
  closeup: "تفاصيل عن قرب",
  package: "محتويات العلبة",
  dimensions: "الأبعاد",
  benefits: "لماذا هذا المنتج؟",
  "before-after": "قبل وبعد التحوّل",
  packaging: "تغليف فاخر",
};

const SCENE_SUBTITLES: Partial<Record<GalleryScene, string>> = {
  hero: "تصميم فاخر · جودة عالية · جاهز للطلب",
  lifestyle: "يتحوّل غرفتك إلى ملاذ هادئ كل مساء",
  environment: "إسقاط حقيقي على السقف والجدران في غرفتك",
  features: "تقنيات مصممة لرفع تجربتك",
  closeup: "جودة تصنيع وتفاصيل دقيقة عن قرب",
  package: "كل ما تحتاجه في علبة واحدة",
  dimensions: "حجم مثالي يناسب أي غرفة",
  benefits: "فوائد حقيقية تشوفها من أول استخدام",
  "before-after": "الفرق واضح من أول تشغيل",
  packaging: "هدية جاهزة للإهداء بتغليف أنيق",
};

const FEATURE_ICONS = ["✨", "🌌", "🎵", "🎮", "⏰", "🌈", "🔋", "📱"];
const BENEFIT_ICONS = ["💎", "🎁", "🛡️", "🚀", "🌟", "❤️", "🔒", "⚡"];

export function buildProductGallerySlides(product: Product): GallerySlide[] {
  const heroUrl = product.images[0]?.url || "/products/crystal-galaxy.jpg";
  const dims = product.specifications?.find((s) => s.label.ar.includes("أبعاد"))?.value.ar;
  const features = (product.features || product.benefits).slice(0, 6);
  const benefits = product.benefits.slice(0, 6);
  const pkg = product.packageIncludes || [];

  const slides = SCENE_ORDER.map((scene, i) => {
    const slide: GallerySlide = {
      id: `slide-${product.id}-${i}`,
      scene,
      heading: SCENE_HEADINGS[scene],
      subtitle: SCENE_SUBTITLES[scene],
      imageUrl: heroUrl,
      objectFit: scene === "hero" ? "contain" : "cover",
      objectPosition: sceneConfig(scene).objectPosition,
      imageScale: sceneConfig(scene).imageScale,
    };

    if (scene === "features") {
      slide.icons = features.map((f, idx) => ({
        emoji: FEATURE_ICONS[idx % FEATURE_ICONS.length],
        label: f.ar,
      }));
    }

    if (scene === "benefits") {
      slide.icons = benefits.map((b, idx) => ({
        emoji: BENEFIT_ICONS[idx % BENEFIT_ICONS.length],
        label: b.ar,
      }));
    }

    if (scene === "package") {
      slide.items = pkg.map((p) => p.ar);
    }

    if (scene === "dimensions" && dims) {
      slide.subtitle = dims;
    }

    return slide;
  });

  if (product.videoUrl && product.videoUrl !== "#") {
    slides.splice(1, 0, {
      id: `slide-${product.id}-video`,
      scene: "hero",
      heading: "فيديو المنتج",
      subtitle: "شوف المنتج في الاستخدام الحقيقي",
      imageUrl: heroUrl,
      objectFit: "cover",
      isVideo: true,
      videoUrl: product.videoUrl,
    });
  }

  return slides;
}

function sceneConfig(scene: GalleryScene): { objectPosition: string; imageScale: number } {
  switch (scene) {
    case "hero":
      return { objectPosition: "center", imageScale: 1 };
    case "closeup":
      return { objectPosition: "70% 60%", imageScale: 1.35 };
    case "packaging":
      return { objectPosition: "center", imageScale: 0.85 };
    case "lifestyle":
      return { objectPosition: "center bottom", imageScale: 0.75 };
    case "environment":
      return { objectPosition: "center top", imageScale: 0.6 };
    default:
      return { objectPosition: "center", imageScale: 1 };
  }
}
