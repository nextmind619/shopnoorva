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
    // Astronaut: use premium marketing hero as first slide (matches supplier image)
    const imageType = isAstronaut && cfg.scene === "hero"
      ? "02-premium-hero" as ImageType
      : cfg.aiType;
    const imageUrl = resolveProductImage(product, imageType);

    const slide: GallerySlide = {
      id: `slide-${product.id}-${i}`,
      scene: cfg.scene,
      emoji: cfg.emoji,
      heading: isAstronaut && cfg.scene === "hero" ? "بروجيكتور + سبيكر بلوتوث" : cfg.heading,
      subtitle: isAstronaut && cfg.scene === "hero" ? "10 أوضاع مجرة · ريموت · بلوتوث 5.0" : (cfg.scene === "dimensions" && dims ? dims : cfg.subtitle),
      imageUrl,
      objectFit: "cover", // AI generated images are usually best as cover
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
