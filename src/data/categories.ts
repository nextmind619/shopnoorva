import type { Category } from "@/types";

export const categories: Category[] = [
  {
    id: "cat-projectors",
    slug: "projecteurs",
    name: { ar: "بروجيكتور النجوم", fr: "Projecteurs", en: "Projectors" },
    description: {
      ar: "بروجيكتور مجرة ونجوم لتحويل غرفتك إلى سماء ليلية",
      fr: "Projecteurs galaxie et étoiles pour transformer votre chambre",
      en: "Galaxy and star projectors to transform your room",
    },
    image: "https://images.unsplash.com/photo-1534796636912-3b95b772fc48?w=800&q=80",
    productCount: 3,
  },
  {
    id: "cat-nightlights",
    slug: "veilleuses",
    name: { ar: "إضاءة ليلية", fr: "Veilleuses", en: "Night Lights" },
    description: {
      ar: "مصابيح ليلية ديكورية للأطفال وغرف النوم",
      fr: "Veilleuses décoratives pour enfants et chambres",
      en: "Decorative night lights for kids and bedrooms",
    },
    image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&q=80",
    productCount: 1,
  },
  {
    id: "cat-decor",
    slug: "decoration",
    name: { ar: "ديكور الغرف", fr: "Déco Chambre", en: "Room Decor" },
    description: {
      ar: "إضاءة ديكورية عصرية لتزيين غرفتك",
      fr: "Éclairage décoratif moderne pour votre espace",
      en: "Modern decorative lighting for your space",
    },
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80",
    productCount: 4,
  },
  {
    id: "cat-gifts",
    slug: "cadeaux",
    name: { ar: "هدايا", fr: "Cadeaux", en: "Gifts" },
    description: {
      ar: "هدايا مميزة للأصدقاء والعائلة",
      fr: "Cadeaux uniques pour vos proches",
      en: "Unique gifts for friends and family",
    },
    image: "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=800&q=80",
    productCount: 4,
  },
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getCategoryById(id: string): Category | undefined {
  return categories.find((c) => c.id === id);
}
