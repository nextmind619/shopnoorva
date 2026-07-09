import type { Category } from "@/types";

export const categories: Category[] = [
  {
    id: "cat-skincare",
    slug: "soins-visage",
    name: { ar: "العناية بالبشرة", fr: "Soins Visage", en: "Skincare" },
    description: {
      ar: "زيت الأرgan المغربي الأصيل ومنتجات العناية الفاخرة",
      fr: "Huile d'argan authentique et soins premium du Maroc",
      en: "Authentic Moroccan argan oil and premium skincare",
    },
    image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&q=80",
    productCount: 24,
  },
  {
    id: "cat-haircare",
    slug: "soins-cheveux",
    name: { ar: "العناية بالشعر", fr: "Soins Capillaires", en: "Haircare" },
    description: {
      ar: "زيوت وتقنيات مغربية تقليدية للشعر",
      fr: "Huiles et rituels capillaires marocains traditionnels",
      en: "Traditional Moroccan hair oils and rituals",
    },
    image: "https://images.unsplash.com/photo-1527799820374-dcf8d9a4e388?w=800&q=80",
    productCount: 18,
  },
  {
    id: "cat-body",
    slug: "soins-corps",
    name: { ar: "العناية بالجسم", fr: "Soins Corps", en: "Body Care" },
    description: {
      ar: "حمام مغربي وصابون بلدي فاخر",
      fr: "Hammam marocain et savons artisanaux premium",
      en: "Moroccan hammam and artisan premium soaps",
    },
    image: "https://images.unsplash.com/photo-1570194065650-d99fb4b31108?w=800&q=80",
    productCount: 15,
  },
  {
    id: "cat-perfume",
    slug: "parfums",
    name: { ar: "العطور", fr: "Parfums", en: "Perfumes" },
    description: {
      ar: "عطور شرقية فاخرة مستوحاة من المغرب",
      fr: "Parfums orientaux de luxe inspirés du Maroc",
      en: "Luxury oriental perfumes inspired by Morocco",
    },
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=80",
    productCount: 12,
  },
  {
    id: "cat-wellness",
    slug: "bien-etre",
    name: { ar: "العافية", fr: "Bien-être", en: "Wellness" },
    description: {
      ar: "مكملات طبيعية وأعشاب مغربية",
      fr: "Compléments naturels et herbes marocaines",
      en: "Natural supplements and Moroccan herbs",
    },
    image: "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=800&q=80",
    productCount: 10,
  },
  {
    id: "cat-home",
    slug: "maison",
    name: { ar: "المنزل", fr: "Maison", en: "Home" },
    description: {
      ar: "ديكور ومعطرات فاخرة للمنزل",
      fr: "Déco et parfums d'intérieur haut de gamme",
      en: "Luxury home decor and fragrances",
    },
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80",
    productCount: 8,
  },
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getCategoryById(id: string): Category | undefined {
  return categories.find((c) => c.id === id);
}
