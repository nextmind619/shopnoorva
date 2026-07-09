import type { Product, ProductReview, FAQ, Testimonial, InstagramPost, Coupon, Order, Customer } from "@/types";

export const products: Product[] = [
  {
    id: "prod-001",
    slug: "huile-argan-pure-bio",
    name: {
      ar: "زيت الأرgan النقي العضوي",
      fr: "Huile d'Argan Pure Bio",
      en: "Pure Organic Argan Oil",
    },
    shortDescription: {
      ar: "زيت أرgan مغربي 100% نقي، معصور على البارد",
      fr: "Huile d'argan marocaine 100% pure, pressée à froid",
      en: "100% pure cold-pressed Moroccan argan oil",
    },
    description: {
      ar: "زيت الأرgan النقي من سوس المغرب، غني بفيتamin E وأحماض أوميغا. يغذي البشرة والشعر بعمق، يقلل التجاعيد ويمنح إشراقة طبيعية. معتمد BIO ومعصور على البارد للحفاظ على جميع العناصر الغذائية.",
      fr: "Huile d'argan pure du Souss marocain, riche en vitamine E et acides oméga. Nourrit en profondeur la peau et les cheveux, réduit les rides et apporte un éclat naturel. Certifiée BIO et pressée à froid.",
      en: "Pure argan oil from Morocco's Souss region, rich in vitamin E and omega acids. Deeply nourishes skin and hair, reduces wrinkles and delivers natural radiance. BIO certified and cold-pressed.",
    },
    categoryId: "cat-skincare",
    price: 289,
    compareAtPrice: 399,
    sku: "LXM-ARG-001",
    stock: 847,
    rating: 4.9,
    reviewCount: 2847,
    soldCount: 12450,
    isBestSeller: true,
    isTrending: true,
    isTikTokViral: true,
    isFeatured: true,
    flashSaleEndsAt: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
    tags: ["bio", "argan", "bestseller", "viral"],
    benefits: [
      { ar: "ترطيب عميق 72 ساعة", fr: "Hydratation profonde 72h", en: "72-hour deep hydration" },
      { ar: "مضاد للأكسدة طبيعي", fr: "Antioxydant naturel", en: "Natural antioxidant" },
      { ar: "مناسب لجميع أنواع البشرة", fr: "Convient à tous types de peau", en: "Suitable for all skin types" },
      { ar: "معتمد BIO اتحاد أوروبي", fr: "Certifié BIO UE", en: "EU BIO certified" },
    ],
    ingredients: {
      ar: "100% زيت أرgan عضوي (Argania Spinosa Kernel Oil)",
      fr: "100% Huile d'Argan Bio (Argania Spinosa Kernel Oil)",
      en: "100% Organic Argan Oil (Argania Spinosa Kernel Oil)",
    },
    howToUse: {
      ar: "ضع 2-3 قطرات على الوجه والرقبة صباحاً ومساءً. للشعر: دلّك فروة الرأس واتركه 30 دقيقة.",
      fr: "Appliquer 2-3 gouttes sur le visage matin et soir. Cheveux: masser le cuir chevelu, laisser 30 min.",
      en: "Apply 2-3 drops on face morning and evening. Hair: massage scalp, leave 30 minutes.",
    },
    images: [
      { id: "img-1", url: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=1200&q=80", alt: { ar: "زيت الأرgan", fr: "Huile d'argan", en: "Argan oil" }, type: "image" },
      { id: "img-2", url: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=1200&q=80", alt: { ar: "تطبيق الزيت", fr: "Application", en: "Application" }, type: "image" },
      { id: "img-3", url: "https://images.unsplash.com/photo-1570194065650-d99fb4b31108?w=1200&q=80", alt: { ar: "النتيجة", fr: "Résultat", en: "Result" }, type: "image" },
    ],
    variants: [
      { id: "var-30", name: { ar: "30 مل", fr: "30ml", en: "30ml" }, price: 189, compareAtPrice: 249, sku: "LXM-ARG-30", stock: 320 },
      { id: "var-50", name: { ar: "50 مل", fr: "50ml", en: "50ml" }, price: 289, compareAtPrice: 399, sku: "LXM-ARG-50", stock: 847 },
      { id: "var-100", name: { ar: "100 مل", fr: "100ml", en: "100ml" }, price: 489, compareAtPrice: 649, sku: "LXM-ARG-100", stock: 156 },
    ],
    upsellIds: ["prod-002", "prod-005"],
    crossSellIds: ["prod-003", "prod-006"],
    beforeAfter: {
      before: "https://images.unsplash.com/photo-1596755389378-c31d2fd6c2d0?w=600&q=80",
      after: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=600&q=80",
    },
    seo: {
      title: { ar: "زيت الأرgan النقي | LUXMAR", fr: "Huile d'Argan Pure Bio | LUXMAR", en: "Pure Organic Argan Oil | LUXMAR" },
      description: { ar: "زيت أرgan مغربي أصلي معصور على البارد", fr: "Huile d'argan marocaine authentique pressée à froid", en: "Authentic Moroccan cold-pressed argan oil" },
    },
  },
  {
    id: "prod-002",
    slug: "serum-vitamine-c-eclat",
    name: {
      ar: "سيروم فيتامين C للإشراق",
      fr: "Sérum Vitamine C Éclat",
      en: "Vitamin C Radiance Serum",
    },
    shortDescription: {
      ar: "سيروم مركز 20% فيتامين C للبشرة المتوهجة",
      fr: "Sérum concentré 20% vitamine C pour une peau lumineuse",
      en: "20% vitamin C concentrated serum for glowing skin",
    },
    description: {
      ar: "سيروم فيتامين C مركز بنسبة 20% مع حمض الهيالورونيك وزيت الأرgan. يوحد لون البشرة، يقلل البقع الداكنة ويمنح إشراقة فورية.",
      fr: "Sérum vitamine C 20% avec acide hyaluronique et huile d'argan. Unifie le teint, réduit les taches et illumine instantanément.",
      en: "20% vitamin C serum with hyaluronic acid and argan oil. Evens skin tone, reduces dark spots and instantly brightens.",
    },
    categoryId: "cat-skincare",
    price: 349,
    compareAtPrice: 449,
    sku: "LXM-VTC-002",
    stock: 523,
    rating: 4.8,
    reviewCount: 1923,
    soldCount: 8760,
    isBestSeller: true,
    isTrending: true,
    isTikTokViral: false,
    isFeatured: true,
    tags: ["serum", "vitamin-c", "brightening"],
    benefits: [
      { ar: "إشراق فوري", fr: "Éclat instantané", en: "Instant radiance" },
      { ar: "تقليل البقع", fr: "Réduction des taches", en: "Spot reduction" },
      { ar: "ترطيب مكثف", fr: "Hydratation intense", en: "Intense hydration" },
    ],
    images: [
      { id: "img-1", url: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=1200&q=80", alt: { ar: "سيروم", fr: "Sérum", en: "Serum" }, type: "image" },
      { id: "img-2", url: "https://images.unsplash.com/photo-1570194065650-d99fb4b31108?w=1200&q=80", alt: { ar: "تطبيق", fr: "Application", en: "Application" }, type: "image" },
    ],
    variants: [
      { id: "var-30", name: { ar: "30 مل", fr: "30ml", en: "30ml" }, price: 349, compareAtPrice: 449, sku: "LXM-VTC-30", stock: 523 },
    ],
    upsellIds: ["prod-001"],
    crossSellIds: ["prod-004"],
    seo: {
      title: { ar: "سيروم فيتامين C | LUXMAR", fr: "Sérum Vitamine C | LUXMAR", en: "Vitamin C Serum | LUXMAR" },
      description: { ar: "سيروم فيتامين C 20%", fr: "Sérum vitamine C 20%", en: "20% Vitamin C serum" },
    },
  },
  {
    id: "prod-003",
    slug: "masque-argile-ghassoul",
    name: {
      ar: "قناع الغassoul الطبيعي",
      fr: "Masque Ghassoul Naturel",
      en: "Natural Ghassoul Clay Mask",
    },
    shortDescription: {
      ar: "طين الغassoul المغربي الأصيل لتنظيف عميق",
      fr: "Argile ghassoul marocaine authentique pour un nettoyage profond",
      en: "Authentic Moroccan ghassoul clay for deep cleansing",
    },
    description: {
      ar: "طين الغassoul من جبال الأطلس، يمتص الشوائب وينظف المسام بعمق. مثالي للبشرة الدهنية والمختلطة.",
      fr: "Ghassoul des montagnes de l'Atlas, absorbe les impuretés et nettoie les pores en profondeur.",
      en: "Ghassoul from the Atlas Mountains, absorbs impurities and deeply cleanses pores.",
    },
    categoryId: "cat-body",
    price: 129,
    compareAtPrice: 169,
    sku: "LXM-GHS-003",
    stock: 1200,
    rating: 4.7,
    reviewCount: 987,
    soldCount: 5430,
    isBestSeller: false,
    isTrending: true,
    isTikTokViral: true,
    isFeatured: false,
    tags: ["ghassoul", "mask", "detox"],
    benefits: [
      { ar: "تنظيف عميق", fr: "Nettoyage profond", en: "Deep cleansing" },
      { ar: "امتصاص الزيوت", fr: "Absorption des sébum", en: "Sebum absorption" },
    ],
    images: [
      { id: "img-1", url: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=1200&q=80", alt: { ar: "غassoul", fr: "Ghassoul", en: "Ghassoul" }, type: "image" },
    ],
    variants: [
      { id: "var-200", name: { ar: "200 غ", fr: "200g", en: "200g" }, price: 129, compareAtPrice: 169, sku: "LXM-GHS-200", stock: 1200 },
      { id: "var-500", name: { ar: "500 غ", fr: "500g", en: "500g" }, price: 249, compareAtPrice: 299, sku: "LXM-GHS-500", stock: 450 },
    ],
    seo: {
      title: { ar: "قناع الغassoul | LUXMAR", fr: "Masque Ghassoul | LUXMAR", en: "Ghassoul Mask | LUXMAR" },
      description: { ar: "طين غassoul مغربي", fr: "Argile ghassoul marocaine", en: "Moroccan ghassoul clay" },
    },
  },
  {
    id: "prod-004",
    slug: "huile-cheveux-argan-rose",
    name: {
      ar: "زيت الشعر بالأرgan والورد",
      fr: "Huile Capillaire Argan & Rose",
      en: "Argan & Rose Hair Oil",
    },
    shortDescription: {
      ar: "زيت شعر مغذي بزيت الأرgan وماء الورد",
      fr: "Huile capillaire nourrissante à l'argan et eau de rose",
      en: "Nourishing hair oil with argan and rose water",
    },
    description: {
      ar: "تركيبة فاخرة تجمع زيت الأرgan المغربي وماء الورد من قصبة. تغذي الشعر، تقلل التقصف وتمنح لمعاناً طبيعياً.",
      fr: "Formule luxueuse alliant argan marocain et eau de rose de Kelaat M'Gouna. Nourrit, réduit les fourches et apporte brillance.",
      en: "Luxurious blend of Moroccan argan and Kelaat M'Gouna rose water. Nourishes, reduces split ends and adds natural shine.",
    },
    categoryId: "cat-haircare",
    price: 219,
    compareAtPrice: 279,
    sku: "LXM-HRO-004",
    stock: 678,
    rating: 4.9,
    reviewCount: 1456,
    soldCount: 7890,
    isBestSeller: true,
    isTrending: false,
    isTikTokViral: true,
    isFeatured: true,
    tags: ["hair", "argan", "rose"],
    benefits: [
      { ar: "لمعان فوري", fr: "Brillance instantanée", en: "Instant shine" },
      { ar: "تقليل التقصف", fr: "Réduction des fourches", en: "Split end reduction" },
    ],
    images: [
      { id: "img-1", url: "https://images.unsplash.com/photo-1527799820374-dcf8d9a4e388?w=1200&q=80", alt: { ar: "زيت شعر", fr: "Huile cheveux", en: "Hair oil" }, type: "image" },
    ],
    variants: [
      { id: "var-100", name: { ar: "100 مل", fr: "100ml", en: "100ml" }, price: 219, compareAtPrice: 279, sku: "LXM-HRO-100", stock: 678 },
    ],
    seo: {
      title: { ar: "زيت الشعر | LUXMAR", fr: "Huile Capillaire | LUXMAR", en: "Hair Oil | LUXMAR" },
      description: { ar: "زيت شعر بالأرgan", fr: "Huile capillaire argan", en: "Argan hair oil" },
    },
  },
  {
    id: "prod-005",
    slug: "creme-nuit-regeneration",
    name: {
      ar: "كريم الليل للتجديد",
      fr: "Crème de Nuit Régénérante",
      en: "Regenerating Night Cream",
    },
    shortDescription: {
      ar: "كريم ليلي غني بالأرgan والريتينول الطبيعي",
      fr: "Crème de nuit enrichie en argan et rétinol naturel",
      en: "Night cream enriched with argan and natural retinol",
    },
    description: {
      ar: "كريم ليلي فاخر يعمل أثناء النوم لتجديد البشرة. يحتوي على زيت الأرgan، البakuchiol والبptideات.",
      fr: "Crème de nuit luxueuse qui régénère pendant le sommeil. Enrichie en argan, bakuchiol et peptides.",
      en: "Luxury night cream that regenerates while you sleep. Enriched with argan, bakuchiol and peptides.",
    },
    categoryId: "cat-skincare",
    price: 399,
    compareAtPrice: 499,
    sku: "LXM-NCR-005",
    stock: 234,
    rating: 4.8,
    reviewCount: 756,
    soldCount: 3210,
    isBestSeller: false,
    isTrending: true,
    isTikTokViral: false,
    isFeatured: true,
    tags: ["night-cream", "anti-aging"],
    benefits: [
      { ar: "تجديد ليلي", fr: "Régénération nocturne", en: "Nightly regeneration" },
      { ar: "مضاد للشيخوخة", fr: "Anti-âge", en: "Anti-aging" },
    ],
    images: [
      { id: "img-1", url: "https://images.unsplash.com/photo-1611935111128-4e0b4b4b4b4b?w=1200&q=80", alt: { ar: "كريم ليل", fr: "Crème nuit", en: "Night cream" }, type: "image" },
    ],
    variants: [
      { id: "var-50", name: { ar: "50 مل", fr: "50ml", en: "50ml" }, price: 399, compareAtPrice: 499, sku: "LXM-NCR-50", stock: 234 },
    ],
    seo: {
      title: { ar: "كريم الليل | LUXMAR", fr: "Crème de Nuit | LUXMAR", en: "Night Cream | LUXMAR" },
      description: { ar: "كريم ليلي تجديد", fr: "Crème nuit régénérante", en: "Regenerating night cream" },
    },
  },
  {
    id: "prod-006",
    slug: "savon-beldi-artisanal",
    name: {
      ar: "صابون بلدي حرفي",
      fr: "Savon Beldi Artisanal",
      en: "Artisan Beldi Soap",
    },
    shortDescription: {
      ar: "صابون بلدي مغربي تقليدي 100% طبيعي",
      fr: "Savon beldi marocain traditionnel 100% naturel",
      en: "100% natural traditional Moroccan beldi soap",
    },
    description: {
      ar: "صابون بلدي مصنوع يدوياً من زيت الزيتون والأرgan. مثالي للحمام المغربي التقليدي.",
      fr: "Savon beldi fait main à l'huile d'olive et d'argan. Idéal pour le hammam traditionnel.",
      en: "Handmade beldi soap with olive and argan oil. Perfect for traditional hammam.",
    },
    categoryId: "cat-body",
    price: 79,
    compareAtPrice: 99,
    sku: "LXM-SBL-006",
    stock: 2000,
    rating: 4.6,
    reviewCount: 2341,
    soldCount: 15670,
    isBestSeller: true,
    isTrending: false,
    isTikTokViral: false,
    isFeatured: false,
    tags: ["soap", "hammam", "natural"],
    benefits: [
      { ar: "100% طبيعي", fr: "100% naturel", en: "100% natural" },
      { ar: "تقشير لطيف", fr: "Gommage doux", en: "Gentle exfoliation" },
    ],
    images: [
      { id: "img-1", url: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=1200&q=80", alt: { ar: "صابون", fr: "Savon", en: "Soap" }, type: "image" },
    ],
    variants: [
      { id: "var-200", name: { ar: "200 غ", fr: "200g", en: "200g" }, price: 79, compareAtPrice: 99, sku: "LXM-SBL-200", stock: 2000 },
    ],
    seo: {
      title: { ar: "صابون بلدي | LUXMAR", fr: "Savon Beldi | LUXMAR", en: "Beldi Soap | LUXMAR" },
      description: { ar: "صابون بلدي مغربي", fr: "Savon beldi marocain", en: "Moroccan beldi soap" },
    },
  },
  {
    id: "prod-007",
    slug: "parfum-ambre-oriental",
    name: {
      ar: "عطر العنبر الشرقي",
      fr: "Parfum Ambre Oriental",
      en: "Oriental Amber Perfume",
    },
    shortDescription: {
      ar: "عطر فاخر بالعنبر والعود المغربي",
      fr: "Parfum de luxe à l'ambre et oud marocain",
      en: "Luxury perfume with amber and Moroccan oud",
    },
    description: {
      ar: "عطر شرقي فاخر يجمع العنبر، العود المغربي، الزعفران والورد. ثبات 12 ساعة.",
      fr: "Parfum oriental de luxe alliant ambre, oud marocain, safran et rose. Tenue 12 heures.",
      en: "Luxury oriental perfume blending amber, Moroccan oud, saffron and rose. 12-hour longevity.",
    },
    categoryId: "cat-perfume",
    price: 589,
    compareAtPrice: 749,
    sku: "LXM-PAR-007",
    stock: 89,
    rating: 4.9,
    reviewCount: 432,
    soldCount: 1890,
    isBestSeller: false,
    isTrending: true,
    isTikTokViral: true,
    isFeatured: true,
    tags: ["perfume", "oud", "luxury"],
    benefits: [
      { ar: "ثبات 12 ساعة", fr: "Tenue 12 heures", en: "12-hour longevity" },
      { ar: "رائحة فاخرة", fr: "Sillage luxueux", en: "Luxurious sillage" },
    ],
    images: [
      { id: "img-1", url: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=1200&q=80", alt: { ar: "عطر", fr: "Parfum", en: "Perfume" }, type: "image" },
    ],
    variants: [
      { id: "var-50", name: { ar: "50 مل", fr: "50ml", en: "50ml" }, price: 589, compareAtPrice: 749, sku: "LXM-PAR-50", stock: 89 },
      { id: "var-100", name: { ar: "100 مل", fr: "100ml", en: "100ml" }, price: 899, compareAtPrice: 1099, sku: "LXM-PAR-100", stock: 34 },
    ],
    seo: {
      title: { ar: "عطر العنبر | LUXMAR", fr: "Parfum Ambre | LUXMAR", en: "Amber Perfume | LUXMAR" },
      description: { ar: "عطر عنبر شرقي", fr: "Parfum ambre oriental", en: "Oriental amber perfume" },
    },
  },
  {
    id: "prod-008",
    slug: "kit-routine-eclat",
    name: {
      ar: "طقم روتين الإشراق",
      fr: "Kit Routine Éclat",
      en: "Radiance Routine Kit",
    },
    shortDescription: {
      ar: "طقم كامل للعناية بالبشرة - وفر 25%",
      fr: "Kit complet de soin - Économisez 25%",
      en: "Complete skincare kit - Save 25%",
    },
    description: {
      ar: "طقم فاخر يشمل زيت الأرgan، سيروم فيتامين C وكريم الليل. روتين كامل للبشرة المتوهجة.",
      fr: "Kit luxueux incluant huile d'argan, sérum vitamine C et crème de nuit. Routine complète.",
      en: "Luxury kit including argan oil, vitamin C serum and night cream. Complete routine.",
    },
    categoryId: "cat-skincare",
    price: 899,
    compareAtPrice: 1199,
    sku: "LXM-KIT-008",
    stock: 156,
    rating: 4.9,
    reviewCount: 567,
    soldCount: 2340,
    isBestSeller: true,
    isTrending: true,
    isTikTokViral: false,
    isFeatured: true,
    tags: ["bundle", "kit", "gift"],
    benefits: [
      { ar: "وفر 25%", fr: "Économisez 25%", en: "Save 25%" },
      { ar: "روتين كامل", fr: "Routine complète", en: "Complete routine" },
    ],
    images: [
      { id: "img-1", url: "https://images.unsplash.com/photo-1596755389378-c31d2fd6c2d0?w=1200&q=80", alt: { ar: "طقم", fr: "Kit", en: "Kit" }, type: "image" },
    ],
    variants: [
      { id: "var-kit", name: { ar: "طقم كامل", fr: "Kit Complet", en: "Full Kit" }, price: 899, compareAtPrice: 1199, sku: "LXM-KIT-FULL", stock: 156 },
    ],
    bundles: [
      { id: "bundle-1", name: { ar: "طقم الإشراق", fr: "Kit Éclat", en: "Radiance Kit" }, products: ["prod-001", "prod-002", "prod-005"], discount: 25 },
    ],
    seo: {
      title: { ar: "طقم الإشراق | LUXMAR", fr: "Kit Éclat | LUXMAR", en: "Radiance Kit | LUXMAR" },
      description: { ar: "طقم عناية كامل", fr: "Kit soin complet", en: "Complete care kit" },
    },
  },
];

export const reviews: ProductReview[] = [
  {
    id: "rev-001",
    author: "Fatima Zahra",
    city: "Casablanca",
    rating: 5,
    title: { ar: "نتائج مذهلة!", fr: "Résultats incroyables!", en: "Amazing results!" },
    content: {
      ar: "استخدمت زيت الأرgan لمدة شهر والفرق واضح. بشرتي أصبحت أكثر نعومة وإشراقاً. التوصيل سريع والتغليف فاخر.",
      fr: "J'utilise l'huile d'argan depuis un mois et la différence est visible. Ma peau est plus douce et lumineuse. Livraison rapide et emballage luxueux.",
      en: "Been using argan oil for a month and the difference is visible. My skin is softer and brighter. Fast delivery and luxurious packaging.",
    },
    date: "2026-06-15",
    verified: true,
    images: ["https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=400&q=80"],
  },
  {
    id: "rev-002",
    author: "Youssef Alami",
    city: "Rabat",
    rating: 5,
    title: { ar: "جودة استثنائية", fr: "Qualité exceptionnelle", en: "Exceptional quality" },
    content: {
      ar: "أفضل زيت أرgan جربته. 100% أصلي من المغرب. أنصح به بشدة.",
      fr: "La meilleure huile d'argan que j'ai testée. 100% authentique du Maroc. Je recommande vivement.",
      en: "The best argan oil I've tried. 100% authentic from Morocco. Highly recommend.",
    },
    date: "2026-06-10",
    verified: true,
  },
  {
    id: "rev-003",
    author: "Amina Benjelloun",
    city: "Marrakech",
    rating: 5,
    title: { ar: "خدمة ممتازة", fr: "Service excellent", en: "Excellent service" },
    content: {
      ar: "الدفع عند الاستلام مريح جداً. المنتجات أصلية والأسعار معقولة.",
      fr: "Le paiement à la livraison est très pratique. Produits authentiques et prix raisonnables.",
      en: "Cash on delivery is very convenient. Authentic products and reasonable prices.",
    },
    date: "2026-06-05",
    verified: true,
  },
  {
    id: "rev-004",
    author: "Sarah Mitchell",
    city: "Tanger",
    rating: 4,
    title: { ar: "منتج رائع", fr: "Produit génial", en: "Great product" },
    content: {
      ar: "السيروم رائع للبشرة. لاحظت تحسناً في لون البشرة بعد أسبوعين.",
      fr: "Le sérum est génial pour la peau. J'ai remarqué une amélioration du teint après 2 semaines.",
      en: "The serum is great for skin. Noticed improvement in complexion after 2 weeks.",
    },
    date: "2026-05-28",
    verified: true,
  },
  {
    id: "rev-005",
    author: "Khadija El Fassi",
    city: "Fès",
    rating: 5,
    title: { ar: "هدية مثالية", fr: "Cadeau parfait", en: "Perfect gift" },
    content: {
      ar: "اشتريت الطقم كهدية لأختي وهي سعيدة جداً. التغليف أنيق جداً.",
      fr: "J'ai acheté le kit en cadeau pour ma sœur et elle est ravie. L'emballage est très élégant.",
      en: "Bought the kit as a gift for my sister and she's thrilled. Packaging is very elegant.",
    },
    date: "2026-05-20",
    verified: true,
  },
  {
    id: "rev-006",
    author: "Mohammed Tazi",
    city: "Agadir",
    rating: 5,
    title: { ar: "أصلي 100%", fr: "100% authentique", en: "100% authentic" },
    content: {
      ar: "منتجات مغربية أصلية بجودة عالمية. فخور بدعم العلامات المحلية.",
      fr: "Produits marocains authentiques de qualité mondiale. Fier de soutenir les marques locales.",
      en: "Authentic Moroccan products with world-class quality. Proud to support local brands.",
    },
    date: "2026-05-15",
    verified: true,
  },
];

export const faqs: FAQ[] = [
  {
    id: "faq-1",
    question: { ar: "كيف يعمل الدفع عند الاستلام؟", fr: "Comment fonctionne le paiement à la livraison?", en: "How does cash on delivery work?" },
    answer: {
      ar: "اطلب منتجاتك وادفع نقداً عند استلام الطلب. لا حاجة لبطاقة بنكية. متاح في جميع مدن المغرب.",
      fr: "Commandez vos produits et payez en espèces à la réception. Pas besoin de carte bancaire. Disponible dans toutes les villes du Maroc.",
      en: "Order your products and pay cash upon delivery. No bank card needed. Available in all Moroccan cities.",
    },
  },
  {
    id: "faq-2",
    question: { ar: "ما هي مدة التوصيل؟", fr: "Quel est le délai de livraison?", en: "What is the delivery time?" },
    answer: {
      ar: "24-48 ساعة للمدن الكبرى (الدار البيضاء، الرباط، مراكش). 2-4 أيام للمدن الأخرى.",
      fr: "24-48h pour les grandes villes (Casablanca, Rabat, Marrakech). 2-4 jours pour les autres villes.",
      en: "24-48 hours for major cities (Casablanca, Rabat, Marrakech). 2-4 days for other cities.",
    },
  },
  {
    id: "faq-3",
    question: { ar: "هل المنتجات أصلية؟", fr: "Les produits sont-ils authentiques?", en: "Are products authentic?" },
    answer: {
      ar: "نعم، جميع منتجاتنا 100% أصلية من المغرب. معتمدة BIO ومعبأة في مرافقنا بالدار البيضاء.",
      fr: "Oui, tous nos produits sont 100% authentiques du Maroc. Certifiés BIO et conditionnés dans nos installations à Casablanca.",
      en: "Yes, all our products are 100% authentic from Morocco. BIO certified and packaged in our Casablanca facilities.",
    },
  },
  {
    id: "faq-4",
    question: { ar: "هل يمكنني إرجاع المنتج؟", fr: "Puis-je retourner un produit?", en: "Can I return a product?" },
    answer: {
      ar: "نعم، لديك 14 يوماً للإرجاع. المنتج يجب أن يكون غير مفتوح. اتصل بنا على WhatsApp.",
      fr: "Oui, vous avez 14 jours pour retourner. Le produit doit être non ouvert. Contactez-nous sur WhatsApp.",
      en: "Yes, you have 14 days to return. Product must be unopened. Contact us on WhatsApp.",
    },
  },
  {
    id: "faq-5",
    question: { ar: "هل التوصيل مجاني؟", fr: "La livraison est-elle gratuite?", en: "Is shipping free?" },
    answer: {
      ar: "نعم، التوصيل مجاني للطلبات فوق 500 درهم. 25 درهم للمدن الكبرى و35 درهم للمدن الأخرى.",
      fr: "Oui, livraison gratuite pour les commandes de plus de 500 MAD. 25 MAD pour les grandes villes, 35 MAD pour les autres.",
      en: "Yes, free shipping for orders over 500 MAD. 25 MAD for major cities, 35 MAD for others.",
    },
  },
];

export const testimonials: Testimonial[] = [
  {
    id: "test-1",
    name: "Leila Mansouri",
    city: "Casablanca",
    videoThumbnail: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=600&q=80",
    videoUrl: "#",
    quote: {
      ar: "LUXMAR غيرت روتين العناية ببشرتي تماماً",
      fr: "LUXMAR a complètement transformé ma routine skincare",
      en: "LUXMAR completely transformed my skincare routine",
    },
  },
  {
    id: "test-2",
    name: "Nadia Berrada",
    city: "Marrakech",
    videoThumbnail: "https://images.unsplash.com/photo-1596755389378-c31d2fd6c2d0?w=600&q=80",
    videoUrl: "#",
    quote: {
      ar: "أفضل زيت أرgan جربته في حياتي",
      fr: "La meilleure huile d'argan de ma vie",
      en: "The best argan oil I've ever tried",
    },
  },
  {
    id: "test-3",
    name: "Imane Chakir",
    city: "Rabat",
    videoThumbnail: "https://images.unsplash.com/photo-1570194065650-d99fb4b31108?w=600&q=80",
    videoUrl: "#",
    quote: {
      ar: "جودة فاخرة بأسعار معقولة",
      fr: "Qualité luxueuse à prix accessible",
      en: "Luxury quality at accessible prices",
    },
  },
];

export const instagramPosts: InstagramPost[] = [
  { id: "ig-1", image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400&q=80", url: "https://instagram.com/luxmar", likes: 2847 },
  { id: "ig-2", image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&q=80", url: "https://instagram.com/luxmar", likes: 1923 },
  { id: "ig-3", image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&q=80", url: "https://instagram.com/luxmar", likes: 3456 },
  { id: "ig-4", image: "https://images.unsplash.com/photo-1527799820374-dcf8d9a4e388?w=400&q=80", url: "https://instagram.com/luxmar", likes: 1567 },
  { id: "ig-5", image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&q=80", url: "https://instagram.com/luxmar", likes: 2134 },
  { id: "ig-6", image: "https://images.unsplash.com/photo-1570194065650-d99fb4b31108?w=400&q=80", url: "https://instagram.com/luxmar", likes: 987 },
];

export const coupons: Coupon[] = [
  { id: "coup-1", code: "LUXMAR10", type: "percentage", value: 10, minOrder: 200, maxUses: 1000, usedCount: 234, expiresAt: "2026-12-31", active: true },
  { id: "coup-2", code: "WELCOME20", type: "percentage", value: 20, minOrder: 300, maxUses: 500, usedCount: 89, expiresAt: "2026-12-31", active: true },
  { id: "coup-3", code: "FREESHIP", type: "fixed", value: 35, minOrder: 150, maxUses: 2000, usedCount: 567, expiresAt: "2026-12-31", active: true },
];

export const moroccanCities = [
  "Casablanca", "Rabat", "Marrakech", "Fès", "Tanger", "Agadir", "Meknès", "Oujda",
  "Kenitra", "Tétouan", "Safi", "El Jadida", "Nador", "Beni Mellal", "Khouribga",
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getProductsByCategory(categoryId: string): Product[] {
  return products.filter((p) => p.categoryId === categoryId);
}

export function getBestSellers(): Product[] {
  return products.filter((p) => p.isBestSeller);
}

export function getTrending(): Product[] {
  return products.filter((p) => p.isTrending);
}

export function getTikTokViral(): Product[] {
  return products.filter((p) => p.isTikTokViral);
}

export function getFeatured(): Product[] {
  return products.filter((p) => p.isFeatured);
}

export function getFlashSaleProducts(): Product[] {
  return products.filter((p) => p.flashSaleEndsAt);
}

export function getReviewsForProduct(productId: string): ProductReview[] {
  return reviews;
}

export function validateCoupon(code: string, subtotal: number): { valid: boolean; discount: number; message?: string } {
  const coupon = coupons.find((c) => c.code.toUpperCase() === code.toUpperCase() && c.active);
  if (!coupon) return { valid: false, discount: 0, message: "Invalid coupon" };
  if (coupon.usedCount >= coupon.maxUses) return { valid: false, discount: 0, message: "Coupon expired" };
  if (subtotal < coupon.minOrder) return { valid: false, discount: 0, message: `Minimum order ${coupon.minOrder} MAD` };
  const discount = coupon.type === "percentage" ? (subtotal * coupon.value) / 100 : coupon.value;
  return { valid: true, discount: Math.min(discount, subtotal) };
}

// In-memory order store for demo
let ordersStore: Order[] = [];

export function createOrder(order: Order): Order {
  ordersStore.push(order);
  return order;
}

export function getOrders(): Order[] {
  return [...ordersStore];
}

export function getOrderById(id: string): Order | undefined {
  return ordersStore.find((o) => o.id === id);
}

export const customers: Customer[] = [
  { id: "cust-1", firstName: "Fatima", lastName: "Zahra", email: "fatima@email.ma", phone: "+212612345678", city: "Casablanca", totalOrders: 5, totalSpent: 2450, createdAt: "2025-11-01" },
  { id: "cust-2", firstName: "Youssef", lastName: "Alami", email: "youssef@email.ma", phone: "+212698765432", city: "Rabat", totalOrders: 3, totalSpent: 890, createdAt: "2025-12-15" },
  { id: "cust-3", firstName: "Amina", lastName: "Benjelloun", email: "amina@email.ma", phone: "+212655443322", city: "Marrakech", totalOrders: 8, totalSpent: 4200, createdAt: "2025-09-20" },
];
