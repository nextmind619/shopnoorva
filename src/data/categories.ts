import type { Category } from "@/types";
import { getProductHeroUrl } from "@/lib/product-images/assets";

export const categories: Category[] = [
  {
    id: "cat-projectors",
    slug: "projecteurs",
    name: { ar: "بروجيكتور المجرة", fr: "Projecteurs Galaxy", en: "Galaxy Projectors" },
    description: {
      ar: "بروجيكتور رائد الفضاء، كريستال، ونجوم المجرة",
      fr: "Astronaute, cristal et étoiles galaxy",
      en: "Astronaut, crystal and galaxy star projectors",
    },
    image: getProductHeroUrl("crystal-galaxy-projector"),
    productCount: 3,
  },
  {
    id: "cat-nightlights",
    slug: "veilleuses",
    name: { ar: "إضاءة ليلية", fr: "Veilleuses", en: "Night Lights" },
    description: {
      ar: "مصباح كاروسيل ليلي فاخر",
      fr: "Veilleuse carrousel premium",
      en: "Premium carousel night light",
    },
    image: getProductHeroUrl("carousel-night-light"),
    productCount: 1,
  },
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getCategoryById(id: string): Category | undefined {
  return categories.find((c) => c.id === id);
}
