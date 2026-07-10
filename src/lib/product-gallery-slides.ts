import type { Product } from "@/types";

export type GalleryScene =
  | "hero"
  | "bedroom"
  | "ceiling"
  | "walls"
  | "remote"
  | "connectivity"
  | "package"
  | "dimensions"
  | "features"
  | "before-after"
  | "lifestyle"
  | "gaming"
  | "romantic"
  | "kids"
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
}

const SCENE_HEADINGS: Record<GalleryScene, string> = {
  hero: "الصورة الرئيسية",
  bedroom: "في غرفة نوم فاخرة",
  ceiling: "إسقاط المجرة على السقف",
  walls: "إسقاط على الجدران",
  remote: "ريموت التحكم عن بعد",
  connectivity: "بلوتوث و USB",
  package: "محتويات العلبة",
  dimensions: "الأبعاد",
  features: "المميزات",
  "before-after": "قبل وبعد التحوّل",
  lifestyle: "لحظة استرخاء تحت المجرات",
  gaming: "أجواء غرفة الألعاب",
  romantic: "أجواء رومانسية",
  kids: "غرفة الأطفال",
  packaging: "تغليف فاخر",
};

const SCENE_SUBTITLES: Partial<Record<GalleryScene, string>> = {
  hero: "تصميم فاخر · جودة عالية · جاهز للطلب",
  bedroom: "يتحوّل غرفتك إلى ملاذ هادئ كل مساء",
  ceiling: "نجوم ومجرة تغطي السقف بالكامل",
  walls: "ألوان متحركة على كل الجدران",
  remote: "تحكم كامل من راحة يدك",
  connectivity: "موسيقى عبر البلوتوث وشحن Type-C",
  package: "كل ما تحتاجه في علبة واحدة",
  dimensions: "حجم مثالي يناسب أي غرفة",
  features: "تقنيات مصممة لرفع تجربتك",
  "before-after": "الفرق واضح من أول تشغيل",
  lifestyle: "استرخِ تحت سماء من النجوم",
  gaming: "أجواء سينمائية لجلسات اللعب",
  romantic: "ليلة خاصة بإضاءة ناعمة",
  kids: "عالم سحري يحبّه الأطفال",
  packaging: "هدية جاهزة للإهداء",
};

const FEATURE_ICONS = ["✨", "🌌", "🎵", "🎮", "⏰", "🌈", "🔋", "📱"];

export function buildProductGallerySlides(product: Product): GallerySlide[] {
  const heroUrl = product.images[0]?.url || "/products/crystal-galaxy.jpg";
  const dims = product.specifications?.find((s) => s.label.ar.includes("أبعاد"))?.value.ar;
  const features = (product.features || product.benefits).slice(0, 6);
  const pkg = product.packageIncludes || [];

  const scenes: GalleryScene[] = [
    "hero",
    "bedroom",
    "ceiling",
    "walls",
    "remote",
    "connectivity",
    "package",
    "dimensions",
    "features",
    "before-after",
    "lifestyle",
    "gaming",
    "romantic",
    "kids",
    "packaging",
  ];

  return scenes.map((scene, i) => {
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

    if (scene === "package") {
      slide.items = pkg.map((p) => p.ar);
    }

    if (scene === "dimensions" && dims) {
      slide.subtitle = dims;
    }

    return slide;
  });
}

function sceneConfig(scene: GalleryScene): { objectPosition: string; imageScale: number } {
  switch (scene) {
    case "hero":
      return { objectPosition: "center", imageScale: 1 };
    case "remote":
      return { objectPosition: "70% 60%", imageScale: 1.35 };
    case "packaging":
      return { objectPosition: "center", imageScale: 0.85 };
    case "bedroom":
    case "lifestyle":
      return { objectPosition: "center bottom", imageScale: 0.75 };
    case "ceiling":
      return { objectPosition: "center top", imageScale: 0.55 };
    default:
      return { objectPosition: "center", imageScale: 1 };
  }
}
