import type { Category } from "@/types";
import { getProductHeroUrl } from "@/lib/product-images/assets";

export const categories: Category[] = [
  {
    id: "cat-projectors",
    slug: "projecteurs",
    name: { ar: "بروجيكتور المجرة", fr: "Projecteurs Galaxy", en: "Galaxy Projectors" },
    description: {
      ar: "بروجيكتور رائد الفضاء بلوتوث، بروجيكتور المجرة والنجوم، وبروجيكتور الأورورا الشمالية",
      fr: "Astronaute Bluetooth, projecteur galaxie et aurores boréales",
      en: "Astronaut Bluetooth, galaxy star projector and northern lights projectors",
    },
    image: getProductHeroUrl("astronaut-bt-speaker-projector"),
    productCount: 3,
  },
  {
    id: "cat-nightlights",
    slug: "veilleuses",
    name: { ar: "إضاءة ليلية", fr: "Veilleuses", en: "Night Lights" },
    description: {
      ar: "مصباح كاروسيل الأرانب الموسيقي الفاخر",
      fr: "Veilleuse carrousel musicale lapin premium",
      en: "Premium musical rabbit carousel night light",
    },
    image: getProductHeroUrl("rabbit-carousel-night-light"),
    productCount: 1,
  },
  {
    id: "cat-galaxy-lights",
    slug: "galaxy-lights",
    name: { ar: "إضاءة المجرة", fr: "Lumières Galaxy", en: "Galaxy Lights" },
    description: {
      ar: "تأثيرات مجرة وليزر ونجوم وأورورا على السقف والجدران",
      fr: "Effets galaxie, laser, étoiles et aurores sur plafond et murs",
      en: "Galaxy, laser, star and aurora effects on ceiling and walls",
    },
    image: getProductHeroUrl("northern-lights-galaxy-projector"),
    productCount: 3,
  },
  {
    id: "cat-home-decor",
    slug: "home-decor",
    name: { ar: "ديكور المنزل", fr: "Déco Maison", en: "Home Decor" },
    description: {
      ar: "قطع إضاءة فاخرة تزيّن أي غرفة في المنزل",
      fr: "Pièces lumineuses premium pour décorer chaque pièce",
      en: "Premium lighting pieces to decorate any room",
    },
    image: getProductHeroUrl("bluetooth-star-projector"),
    productCount: 4,
  },
  {
    id: "cat-bedroom-lighting",
    slug: "bedroom-lighting",
    name: { ar: "إضاءة غرفة النوم", fr: "Éclairage Chambre", en: "Bedroom Lighting" },
    description: {
      ar: "إضاءة هادئة تحوّل غرفة نومك إلى كون ساحر",
      fr: "Éclairage apaisant pour transformer votre chambre",
      en: "Calming lighting that transforms your bedroom",
    },
    image: getProductHeroUrl("astronaut-bt-speaker-projector"),
    productCount: 4,
  },
  {
    id: "cat-kids-room",
    slug: "kids-room",
    name: { ar: "غرفة الأطفال", fr: "Chambre Enfant", en: "Kids Room" },
    description: {
      ar: "إضاءة ناعمة وآمنة ومسلّية لغرفة أطفالك",
      fr: "Éclairage doux, sûr et amusant pour enfants",
      en: "Soft, safe and fun lighting for kids",
    },
    image: getProductHeroUrl("rabbit-carousel-night-light"),
    productCount: 2,
  },
  {
    id: "cat-relaxation",
    slug: "relaxation",
    name: { ar: "الاسترخاء", fr: "Relaxation", en: "Relaxation" },
    description: {
      ar: "أضواء ومؤقتات وموسيقى هادئة تساعد على النوم العميق",
      fr: "Lumières, minuteries et musique douce pour un sommeil profond",
      en: "Lights, timers and soft music that help you sleep deeply",
    },
    image: getProductHeroUrl("northern-lights-galaxy-projector"),
    productCount: 3,
  },
  {
    id: "cat-gift-ideas",
    slug: "gift-ideas",
    name: { ar: "أفكار هدايا", fr: "Idées Cadeaux", en: "Gift Ideas" },
    description: {
      ar: "هدايا فاخرة وأصلية لكل المناسبات والأعياد",
      fr: "Cadeaux premium et originaux pour toutes les occasions",
      en: "Premium, original gifts for every occasion",
    },
    image: getProductHeroUrl("rabbit-carousel-night-light"),
    productCount: 4,
  },
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getCategoryById(id: string): Category | undefined {
  return categories.find((c) => c.id === id);
}
