import type { Category } from "@/types";
import { getProductHeroUrl } from "@/lib/product-images/assets";

export const categories: Category[] = [
  {
    id: "cat-car-accessories",
    slug: "accessoires-auto",
    name: { ar: "إكسسوارات السيارة", fr: "Accessoires Auto", en: "Car Accessories" },
    description: {
      ar: "حاملات هاتف، مظلات شمس، معطرات ديكور، وإكسسوارات عملية للقيادة المريحة",
      fr: "Supports téléphone, pare-soleil, désodorisants déco et accessoires pratiques pour la conduite",
      en: "Phone mounts, sunshades, decorative fresheners, and practical driving accessories",
    },
    image: getProductHeroUrl("magnetic-car-phone-mount-maidsail"),
    productCount: 6,
  },
  {
    id: "cat-laser-pointers",
    slug: "pointeurs-laser",
    name: { ar: "مؤشرات الليزر", fr: "Pointeurs Laser", en: "Laser Pointers" },
    description: {
      ar: "ليزر أخضر احترافي 303 بمدى بعيد وشحن USB للفلك والتخييم والعروض",
      fr: "Pointeur laser vert 303 professionnel longue portée et charge USB pour astronomie, camping et présentations",
      en: "Professional green laser 303 with long range and USB charging for astronomy, camping and presentations",
    },
    image: getProductHeroUrl("green-laser-pointer-303"),
    productCount: 1,
  },
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
    productCount: 8,
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
    productCount: 5,
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
      ar: "جهاز تدليك شياتسو مع تدفئة، أضواء ومؤقتات تساعد على الاسترخاء والنوم العميق",
      fr: "Masseur Shiatsu chauffant, lumières et minuteries pour la détente et le sommeil",
      en: "Heated Shiatsu massager, lights and timers for relaxation and deep sleep",
    },
    image: getProductHeroUrl("shiatsu-neck-shoulder-massager"),
    productCount: 4,
  },
  {
    id: "cat-study-office",
    slug: "etude-bureau",
    name: { ar: "أدوات الدراسة والمكتب", fr: "Étude & Bureau", en: "Study & Office" },
    description: {
      ar: "آلة حاسبة إلكترونية ومكنسة صغيرة لتنظيف الكيبورد والمكتب",
      fr: "Calculatrice électronique et mini aspirateur pour clavier et bureau",
      en: "Electronic calculator and mini vacuum for keyboard and desk",
    },
    image: getProductHeroUrl("solar-calculator-lcd-notepad"),
    productCount: 2,
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
    productCount: 7,
  },
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getCategoryById(id: string): Category | undefined {
  return categories.find((c) => c.id === id);
}
