import type { Product, ProductImage } from "@/types";
import { resolveProductImage, resolveProductHero, resolveLifestyleImage, resolveBeforeAfter } from "./resolve";

const L = (ar: string, fr: string, en: string) => ({ ar, fr, en });

/** Step 6: Automatically place images in correct product sections */
export function enrichProduct(product: Product): Product {
  const hero = resolveProductHero(product);
  const inUse = resolveProductImage(product, "14-product-in-use");
  const closeUp = resolveProductImage(product, "09-close-up");
  const features = resolveProductImage(product, "10-features");

  const images: ProductImage[] = [
    {
      id: "img-hero",
      url: hero,
      alt: L(
        `${product.name.ar} — صورة المنتج`,
        `${product.name.fr} — photo produit`,
        `${product.name.en} — product photo`
      ),
      type: "image",
    },
    {
      id: "img-in-use",
      url: inUse,
      alt: L("تأثير الإسقاط على السقف والجدران", "Projection plafond et murs", "Projection on ceiling and walls"),
      type: "image",
    },
  ];

  if (product.features && product.features.length > 2) {
    images.push({
      id: "img-closeup",
      url: closeUp,
      alt: L("تفاصيل المنتج والريموت", "Détails et télécommande", "Product details and remote"),
      type: "image",
    });
    images.push({
      id: "img-features",
      url: features,
      alt: L("مميزات المنتج", "Fonctionnalités", "Product features"),
      type: "image",
    });
  }

  const lifestyleImages = [
    resolveLifestyleImage(product),
    resolveProductImage(product, "04-bedroom"),
    resolveProductImage(product, "05-living-room"),
    resolveProductImage(product, "06-gaming-room"),
    resolveProductImage(product, "07-romantic-room"),
    resolveProductImage(product, "08-kids-room"),
  ].filter((v, i, a) => a.indexOf(v) === i);

  const lifestyleScenes = product.lifestyleScenes || [
    { id: "bedroom", emoji: "🛏️", title: L("غرفة النوم", "Chambre", "Bedroom"), description: L("أجواء هادئة كل مساء", "Ambiance apaisante", "Calm evening ambiance") },
    { id: "gaming", emoji: "🎮", title: L("غرفة الجيمنغ", "Gaming", "Gaming Room"), description: L("أجواء سينمائية", "Ambiance cinéma", "Cinematic vibe") },
    { id: "kids", emoji: "🧸", title: L("غرفة الأطفال", "Enfants", "Kids Room"), description: L("إضاءة ناعمة", "Lumière douce", "Soft light") },
    { id: "living", emoji: "🛋️", title: L("غرفة المعيشة", "Salon", "Living Room"), description: L("ديكور فاخر", "Déco premium", "Premium decor") },
    { id: "romantic", emoji: "💫", title: L("أجواء رومانسية", "Romantique", "Romantic"), description: L("مجرة خاصة", "Galaxie intime", "Private galaxy") },
  ].map((scene) => ({
    ...scene,
    // Attach resolved lifestyle image per scene
  }));

  return {
    ...product,
    images,
    lifestyleImages,
    lifestyleScenes,
    beforeAfter: resolveBeforeAfter(product),
  };
}

export function enrichProducts(products: Product[]): Product[] {
  return products.map(enrichProduct);
}
