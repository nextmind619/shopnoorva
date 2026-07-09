import type { Product, ProductReview, FAQ, Testimonial, InstagramPost, Coupon, Order, Customer } from "@/types";

const flashEnd = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString();

export const products: Product[] = [
  {
    id: "prod-crystal",
    slug: "projecteur-cristal-galaxy",
    name: {
      ar: "بروجيكتور كريستال مجرة",
      fr: "Projecteur Cristal Galaxy",
      en: "Crystal Galaxy Projector",
    },
    shortDescription: {
      ar: "بروجيكتور أسود بقبّة كريستال يعرض نجوم وألوان على السقف والجدران",
      fr: "Projecteur noir à dôme cristal pour étoiles et couleurs au plafond",
      en: "Black crystal-dome projector for stars and colors on ceiling and walls",
    },
    description: {
      ar: "بروجيكتور كريستال فاخر بتصميم دائري أنيق. يعرض تأثيرات مجرة ونجوم ملونة في غرفة النوم أو الصالون. مثالي للديكور، الجلسات الرومانسية، ومحتوى تيك توك. تشغيل سهل وتأثير إضاءة قوي.",
      fr: "Projecteur cristal premium au design rond élégant. Projette galaxie et étoiles colorées. Idéal déco, ambiance et TikTok.",
      en: "Premium crystal projector with elegant round design. Projects colorful galaxy and stars. Perfect for decor, mood lighting and TikTok.",
    },
    categoryId: "cat-projectors",
    price: 149,
    compareAtPrice: 229,
    sku: "NRV-CRYSTAL-01",
    stock: 86,
    rating: 4.8,
    reviewCount: 312,
    soldCount: 1840,
    isBestSeller: true,
    isTrending: true,
    isTikTokViral: true,
    isFeatured: true,
    flashSaleEndsAt: flashEnd,
    tags: ["projector", "galaxy", "tiktok", "crystal"],
    benefits: [
      { ar: "تأثير مجرة ونجوم ملونة", fr: "Effet galaxie et étoiles", en: "Galaxy & star effects" },
      { ar: "تصميم كريستال أنيق", fr: "Design cristal élégant", en: "Elegant crystal design" },
      { ar: "مثالي لغرف النوم", fr: "Idéal chambre", en: "Perfect for bedrooms" },
      { ar: "هدية رائجة على تيك توك", fr: "Cadeau viral TikTok", en: "TikTok viral gift" },
    ],
    howToUse: {
      ar: "ضع الجهاز في غرفة مظلمة نسبيًا، شغّله، ووجّه القبّة نحو السقف أو الحائط. جرّب زوايا مختلفة لأفضل تأثير.",
      fr: "Placez dans une pièce sombre, allumez et orientez le dôme vers le plafond.",
      en: "Place in a dim room, power on, aim the dome at the ceiling or wall.",
    },
    images: [
      {
        id: "img-1",
        url: "https://images.unsplash.com/photo-1534796636912-3b95b772fc48?w=1200&q=80",
        alt: { ar: "بروجيكتور كريستال", fr: "Projecteur cristal", en: "Crystal projector" },
        type: "image",
      },
      {
        id: "img-2",
        url: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1200&q=80",
        alt: { ar: "تأثير المجرة", fr: "Effet galaxie", en: "Galaxy effect" },
        type: "image",
      },
    ],
    variants: [
      {
        id: "var-crystal",
        name: { ar: "أسود كريستال", fr: "Noir cristal", en: "Black crystal" },
        price: 149,
        compareAtPrice: 229,
        sku: "NRV-CRYSTAL-01",
        stock: 86,
      },
    ],
    upsellIds: ["prod-diamond", "prod-astronaut"],
    crossSellIds: ["prod-carousel"],
    seo: {
      title: {
        ar: "بروجيكتور كريستال مجرة | NOORVA",
        fr: "Projecteur Cristal Galaxy | NOORVA",
        en: "Crystal Galaxy Projector | NOORVA",
      },
      description: {
        ar: "اشترِ بروجيكتور كريستال مجرة بالدفع عند الاستلام في المغرب",
        fr: "Achetez le projecteur cristal avec paiement à la livraison au Maroc",
        en: "Buy crystal galaxy projector with COD in Morocco",
      },
    },
  },
  {
    id: "prod-carousel",
    slug: "veilleuse-carrousel-lapins",
    name: {
      ar: "مصباح كاروسيل الأرانب الوردي",
      fr: "Veilleuse Carrousel Lapins Rose",
      en: "Pink Bunny Carousel Night Light",
    },
    shortDescription: {
      ar: "إضاءة ليلية على شكل كاروسيل وردي مع أرانب — مثالية لغرف الأطفال والهدايا",
      fr: "Veilleuse carrousel rose avec lapins — idéale enfants et cadeaux",
      en: "Pink carousel night light with bunnies — perfect for kids and gifts",
    },
    description: {
      ar: "مصباح ليلي بتصميم كاروسيل لطيف باللون الوردي والذهبي. يضيء بلطف لغرف الأطفال، مناسب كهدية مميزة. قابل للشحن عبر USB، سهل الاستخدام وأنيق على الطاولة.",
      fr: "Veilleuse carrousel rose et or. Lumière douce pour enfants, recharge USB, cadeau parfait.",
      en: "Cute pink and gold carousel night light. Soft glow for kids rooms, USB rechargeable, perfect gift.",
    },
    categoryId: "cat-nightlights",
    price: 129,
    compareAtPrice: 189,
    sku: "NRV-CAROUSEL-01",
    stock: 120,
    rating: 4.9,
    reviewCount: 421,
    soldCount: 2560,
    isBestSeller: true,
    isTrending: true,
    isTikTokViral: true,
    isFeatured: true,
    tags: ["nightlight", "carousel", "kids", "gift"],
    benefits: [
      { ar: "تصميم كاروسيل كيوت", fr: "Design carrousel cute", en: "Cute carousel design" },
      { ar: "إضاءة ناعمة للأطفال", fr: "Lumière douce enfants", en: "Soft kids lighting" },
      { ar: "شحن USB", fr: "Charge USB", en: "USB charging" },
      { ar: "هدية مثالية", fr: "Cadeau idéal", en: "Perfect gift" },
    ],
    howToUse: {
      ar: "اشحن الجهاز عبر USB، اضغط زر التشغيل، وضعه على طاولة بجانب السرير.",
      fr: "Chargez via USB, appuyez sur le bouton, placez près du lit.",
      en: "Charge via USB, press power, place beside the bed.",
    },
    images: [
      {
        id: "img-1",
        url: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=1200&q=80",
        alt: { ar: "مصباح كاروسيل", fr: "Veilleuse carrousel", en: "Carousel night light" },
        type: "image",
      },
      {
        id: "img-2",
        url: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&q=80",
        alt: { ar: "ديكور غرفة أطفال", fr: "Déco chambre enfant", en: "Kids room decor" },
        type: "image",
      },
    ],
    variants: [
      {
        id: "var-carousel-pink",
        name: { ar: "وردي", fr: "Rose", en: "Pink" },
        price: 129,
        compareAtPrice: 189,
        sku: "NRV-CAROUSEL-01",
        stock: 120,
      },
    ],
    upsellIds: ["prod-crystal", "prod-astronaut"],
    crossSellIds: ["prod-diamond"],
    seo: {
      title: {
        ar: "مصباح كاروسيل الأرانب | NOORVA",
        fr: "Veilleuse Carrousel | NOORVA",
        en: "Bunny Carousel Night Light | NOORVA",
      },
      description: {
        ar: "مصباح كاروسيل وردي للأطفال مع الدفع عند الاستلام",
        fr: "Veilleuse carrousel rose pour enfants, paiement à la livraison",
        en: "Pink carousel night light for kids, cash on delivery",
      },
    },
  },
  {
    id: "prod-diamond",
    slug: "projecteur-diamant-galaxy",
    name: {
      ar: "بروجيكتور ألماسي مجرة",
      fr: "Projecteur Diamant Galaxy",
      en: "Diamond Galaxy Projector",
    },
    shortDescription: {
      ar: "بروجيكتور أبيض بشكل ألماسي يعرض نجوم وليزر مجرة على السقف",
      fr: "Projecteur blanc diamant avec étoiles et laser galaxie",
      en: "White diamond-shaped projector with stars and galaxy laser",
    },
    description: {
      ar: "بروجيكتور بتصميم ألماسي هندسي أبيض أنيق. يعرض نجوم وتأثيرات ليزر مجرة قوية. مثالي لغرف الشباب، الـ gaming، وتصوير الريلز. مظهر فاخر ونتيجة إضاءة سينمائية.",
      fr: "Projecteur diamant blanc géométrique. Étoiles + laser galaxie. Idéal gaming, chambre et Reels.",
      en: "Geometric white diamond projector. Stars + galaxy laser. Ideal for gaming rooms, bedrooms and Reels.",
    },
    categoryId: "cat-projectors",
    price: 169,
    compareAtPrice: 249,
    sku: "NRV-DIAMOND-01",
    stock: 64,
    rating: 4.7,
    reviewCount: 198,
    soldCount: 1320,
    isBestSeller: true,
    isTrending: true,
    isTikTokViral: true,
    isFeatured: true,
    flashSaleEndsAt: flashEnd,
    tags: ["projector", "diamond", "laser", "galaxy"],
    benefits: [
      { ar: "تصميم ألماسي فاخر", fr: "Design diamant premium", en: "Premium diamond design" },
      { ar: "ليزر مجرة قوي", fr: "Laser galaxie puissant", en: "Strong galaxy laser" },
      { ar: "مثالي للريلز", fr: "Parfait pour Reels", en: "Perfect for Reels" },
      { ar: "ديكور غرفة عصري", fr: "Déco chambre moderne", en: "Modern room decor" },
    ],
    howToUse: {
      ar: "شغّل الجهاز في غرفة مظلمة، وجّه العدسة للسقف، وتجنب النظر مباشرة إلى فتحة الليزر.",
      fr: "Allumez dans le noir, orientez vers le plafond, ne regardez pas le laser.",
      en: "Power on in a dark room, aim at ceiling, never look into the laser aperture.",
    },
    images: [
      {
        id: "img-1",
        url: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1200&q=80",
        alt: { ar: "بروجيكتور ألماسي", fr: "Projecteur diamant", en: "Diamond projector" },
        type: "image",
      },
      {
        id: "img-2",
        url: "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?w=1200&q=80",
        alt: { ar: "سماء نجوم", fr: "Ciel étoilé", en: "Starry sky" },
        type: "image",
      },
    ],
    variants: [
      {
        id: "var-diamond",
        name: { ar: "أبيض ألماسي", fr: "Blanc diamant", en: "White diamond" },
        price: 169,
        compareAtPrice: 249,
        sku: "NRV-DIAMOND-01",
        stock: 64,
      },
    ],
    upsellIds: ["prod-astronaut", "prod-crystal"],
    crossSellIds: ["prod-carousel"],
    seo: {
      title: {
        ar: "بروجيكتور ألماسي مجرة | NOORVA",
        fr: "Projecteur Diamant | NOORVA",
        en: "Diamond Galaxy Projector | NOORVA",
      },
      description: {
        ar: "بروجيكتور ألماسي مع ليزر مجرة والدفع عند الاستلام",
        fr: "Projecteur diamant laser galaxie, paiement à la livraison",
        en: "Diamond galaxy laser projector with cash on delivery",
      },
    },
  },
  {
    id: "prod-astronaut",
    slug: "projecteur-astronaute",
    name: {
      ar: "بروجيكتور رائد الفضاء",
      fr: "Projecteur Astronaute",
      en: "Astronaut Galaxy Projector",
    },
    shortDescription: {
      ar: "بروجيكتور بشكل رائد فضاء أبيض يعرض مجرة من الخوذة — الأكثر مبيعًا",
      fr: "Projecteur astronaute blanc — galaxie depuis le casque",
      en: "White astronaut projector — galaxy from the helmet",
    },
    description: {
      ar: "بروجيكتور رائد الفضاء الشهير بتصميم كيوت. يعرض نجوم ومجرة من خوذة رائد الفضاء. قطعة ديكور + إضاءة أجواء في جهاز واحد. مطلوب جدًا كهديه وللغرف الشبابية.",
      fr: "Célèbre projecteur astronaute. Galaxie depuis le casque. Déco + ambiance. Cadeau ultra demandé.",
      en: "Famous astronaut projector. Galaxy from the helmet. Decor + ambiance in one. Top gift item.",
    },
    categoryId: "cat-projectors",
    price: 179,
    compareAtPrice: 269,
    sku: "NRV-ASTRO-01",
    stock: 72,
    rating: 4.9,
    reviewCount: 487,
    soldCount: 3210,
    isBestSeller: true,
    isTrending: true,
    isTikTokViral: true,
    isFeatured: true,
    flashSaleEndsAt: flashEnd,
    tags: ["astronaut", "projector", "bestseller", "gift"],
    benefits: [
      { ar: "تصميم رائد فضاء محبوب", fr: "Design astronaute iconique", en: "Iconic astronaut design" },
      { ar: "عرض مجرة من الخوذة", fr: "Galaxie depuis le casque", en: "Galaxy from the helmet" },
      { ar: "ديكور + إضاءة معًا", fr: "Déco + lumière", en: "Decor + light together" },
      { ar: "الأكثر مبيعًا كهديه", fr: "Best-seller cadeau", en: "Best-selling gift" },
    ],
    howToUse: {
      ar: "أزل الغلاف البلاستيكي عن الخوذة قبل الاستخدام، ضع الجهاز على سطح ثابت، وشغّله في غرفة مظلمة.",
      fr: "Retirez le film du casque, placez sur surface stable, allumez dans le noir.",
      en: "Remove helmet protective film, place on a stable surface, power on in a dark room.",
    },
    images: [
      {
        id: "img-1",
        url: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=1200&q=80",
        alt: { ar: "بروجيكتور رائد الفضاء", fr: "Projecteur astronaute", en: "Astronaut projector" },
        type: "image",
      },
      {
        id: "img-2",
        url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&q=80",
        alt: { ar: "فضاء ومجرة", fr: "Espace et galaxie", en: "Space and galaxy" },
        type: "image",
      },
    ],
    variants: [
      {
        id: "var-astro",
        name: { ar: "أبيض", fr: "Blanc", en: "White" },
        price: 179,
        compareAtPrice: 269,
        sku: "NRV-ASTRO-01",
        stock: 72,
      },
    ],
    upsellIds: ["prod-diamond", "prod-crystal"],
    crossSellIds: ["prod-carousel"],
    seo: {
      title: {
        ar: "بروجيكتور رائد الفضاء | NOORVA",
        fr: "Projecteur Astronaute | NOORVA",
        en: "Astronaut Projector | NOORVA",
      },
      description: {
        ar: "بروجيكتور رائد الفضاء الأكثر مبيعًا مع الدفع عند الاستلام في المغرب",
        fr: "Projecteur astronaute best-seller, paiement à la livraison au Maroc",
        en: "Best-selling astronaut projector with COD in Morocco",
      },
    },
  },
];

export const reviews: ProductReview[] = [
  {
    id: "rev-001",
    author: "سارة المنصوري",
    city: "الدار البيضاء",
    rating: 5,
    title: { ar: "حول غرفتي بالكامل!", fr: "Ma chambre est transformée!", en: "Transformed my room!" },
    content: {
      ar: "بروجيكتور رائد الفضاء رهيب. الإضاءة قوية والتوصيل كان سريع والدفع عند الاستلام مريح بزاف.",
      fr: "Le projecteur astronaute est génial. Livraison rapide et COD très pratique.",
      en: "Astronaut projector is amazing. Fast delivery and COD is so convenient.",
    },
    date: "2026-06-20",
    verified: true,
  },
  {
    id: "rev-002",
    author: "يوسف العلوي",
    city: "الرباط",
    rating: 5,
    title: { ar: "مثالي للتيك توك", fr: "Parfait pour TikTok", en: "Perfect for TikTok" },
    content: {
      ar: "البروجيكتور الألماسي كيعطي تصوير رهيب. خديتو بعد ما شفتو في ريلز.",
      fr: "Le projecteur diamant donne un rendu vidéo ouf.",
      en: "Diamond projector looks incredible on camera.",
    },
    date: "2026-06-18",
    verified: true,
  },
  {
    id: "rev-003",
    author: "إيمان بنجلون",
    city: "مراكش",
    rating: 5,
    title: { ar: "هدية بنتي عجباتها", fr: "Ma fille a adoré", en: "My daughter loved it" },
    content: {
      ar: "مصباح الكاروسيل الوردي زوين بزاف. إضاءة ناعمة وتصميم كيوت.",
      fr: "La veilleuse carrousel est adorable et douce.",
      en: "The carousel night light is adorable and soft.",
    },
    date: "2026-06-12",
    verified: true,
  },
  {
    id: "rev-004",
    author: "أمين التازي",
    city: "طنجة",
    rating: 4,
    title: { ar: "جودة جيدة بالثمن", fr: "Bon rapport qualité/prix", en: "Good value" },
    content: {
      ar: "البروجيكتور الكريستال كيشعل الغرفة كاملة. أنصح به.",
      fr: "Le projecteur cristal éclaire bien toute la pièce.",
      en: "Crystal projector lights up the whole room.",
    },
    date: "2026-06-08",
    verified: true,
  },
  {
    id: "rev-005",
    author: "خديجة الفاسي",
    city: "فاس",
    rating: 5,
    title: { ar: "خدمة ممتازة", fr: "Service excellent", en: "Excellent service" },
    content: {
      ar: "طلبت بالواتساب والدفع عند الاستلام. كلشي ساهل والمنتج أصلي.",
      fr: "Commande facile, paiement à la livraison, produit conforme.",
      en: "Easy order, cash on delivery, product as shown.",
    },
    date: "2026-06-01",
    verified: true,
  },
  {
    id: "rev-006",
    author: "محمد برادة",
    city: "أكادير",
    rating: 5,
    title: { ar: "الأجواء ولا أروع", fr: "Ambiance au top", en: "Best vibe" },
    content: {
      ar: "شريت جوج: رائد الفضاء والكريستال. الغرفة ولاّت سينما.",
      fr: "J'ai pris astronaute + cristal. Ambiance cinéma.",
      en: "Got astronaut + crystal. Cinema vibe at home.",
    },
    date: "2026-05-25",
    verified: true,
  },
];

export const faqs: FAQ[] = [
  {
    id: "faq-1",
    question: {
      ar: "كيفاش كايخدم الدفع عند الاستلام؟",
      fr: "Comment fonctionne le paiement à la livraison?",
      en: "How does cash on delivery work?",
    },
    answer: {
      ar: "كتطلب المنتج وكتخلّص كاش ملي يوصلك الطلب. ما محتاجش بطاقة بنكية. متاح في جميع مدن المغرب.",
      fr: "Commandez et payez en espèces à la réception. Disponible partout au Maroc.",
      en: "Order and pay cash on delivery. Available across Morocco.",
    },
  },
  {
    id: "faq-2",
    question: {
      ar: "شحال كتدوم التوصيلة؟",
      fr: "Quel est le délai de livraison?",
      en: "What is the delivery time?",
    },
    answer: {
      ar: "24–48 ساعة للمدن الكبرى، و2–4 أيام لباقي المدن.",
      fr: "24–48h grandes villes, 2–4 jours ailleurs.",
      en: "24–48h major cities, 2–4 days elsewhere.",
    },
  },
  {
    id: "faq-3",
    question: {
      ar: "واش البروجيكتورات أصليين؟",
      fr: "Les projecteurs sont-ils authentiques?",
      en: "Are the projectors authentic?",
    },
    answer: {
      ar: "نعم، كنبيعو منتجات مختبرة بجودة عالية مع ضمان 12 شهر.",
      fr: "Oui, produits testés qualité premium avec garantie 12 mois.",
      en: "Yes, tested premium products with 12-month warranty.",
    },
  },
  {
    id: "faq-4",
    question: {
      ar: "واش كاين إرجاع؟",
      fr: "Puis-je retourner un produit?",
      en: "Can I return a product?",
    },
    answer: {
      ar: "عندك 14 يوم للإرجاع إذا المنتج فيه عيب أو ما خدمش. تواصل معنا على واتساب.",
      fr: "14 jours pour retour en cas de défaut. Contactez-nous sur WhatsApp.",
      en: "14-day returns for defects. Contact us on WhatsApp.",
    },
  },
  {
    id: "faq-5",
    question: {
      ar: "واش التوصيل مجاني؟",
      fr: "La livraison est-elle gratuite?",
      en: "Is shipping free?",
    },
    answer: {
      ar: "نعم، مجاني للطلبات فوق 500 درهم. غير ذلك 25 درهم للمدن الكبرى و35 درهم لباقي المدن.",
      fr: "Oui dès 500 MAD. Sinon 25 MAD grandes villes / 35 MAD ailleurs.",
      en: "Free over 500 MAD. Otherwise 25 MAD major cities / 35 MAD elsewhere.",
    },
  },
];

export const testimonials: Testimonial[] = [
  {
    id: "test-1",
    name: "ليلى منصوري",
    city: "الدار البيضاء",
    videoThumbnail: "https://images.unsplash.com/photo-1534796636912-3b95b772fc48?w=600&q=80",
    videoUrl: "#",
    quote: {
      ar: "بروجيكتور رائد الفضاء بدّل أجواء غرفتي",
      fr: "Le projecteur astronaute a changé ma chambre",
      en: "The astronaut projector changed my room vibe",
    },
  },
  {
    id: "test-2",
    name: "نادية برادة",
    city: "مراكش",
    videoThumbnail: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=600&q=80",
    videoUrl: "#",
    quote: {
      ar: "الكاروسيل الوردي أحسن هدية خديتها لبنتي",
      fr: "Le carrousel rose est le meilleur cadeau",
      en: "The pink carousel was the best gift",
    },
  },
  {
    id: "test-3",
    name: "إيمان شاكر",
    city: "الرباط",
    videoThumbnail: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=600&q=80",
    videoUrl: "#",
    quote: {
      ar: "الجودة فاخرة والثمن مناسب",
      fr: "Qualité premium à prix accessible",
      en: "Premium quality at a fair price",
    },
  },
];

export const instagramPosts: InstagramPost[] = [
  { id: "ig-1", image: "https://images.unsplash.com/photo-1534796636912-3b95b772fc48?w=400&q=80", url: "https://instagram.com/shopnoorva", likes: 2847 },
  { id: "ig-2", image: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&q=80", url: "https://instagram.com/shopnoorva", likes: 1923 },
  { id: "ig-3", image: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=400&q=80", url: "https://instagram.com/shopnoorva", likes: 3456 },
  { id: "ig-4", image: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400&q=80", url: "https://instagram.com/shopnoorva", likes: 1567 },
  { id: "ig-5", image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=400&q=80", url: "https://instagram.com/shopnoorva", likes: 2134 },
  { id: "ig-6", image: "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?w=400&q=80", url: "https://instagram.com/shopnoorva", likes: 987 },
];

export const coupons: Coupon[] = [
  { id: "coup-1", code: "NOORVA10", type: "percentage", value: 10, minOrder: 150, maxUses: 1000, usedCount: 120, expiresAt: "2026-12-31", active: true },
  { id: "coup-2", code: "WELCOME15", type: "percentage", value: 15, minOrder: 200, maxUses: 500, usedCount: 45, expiresAt: "2026-12-31", active: true },
  { id: "coup-3", code: "FREESHIP", type: "fixed", value: 35, minOrder: 120, maxUses: 2000, usedCount: 310, expiresAt: "2026-12-31", active: true },
];

export const moroccanCities = [
  "الدار البيضاء", "الرباط", "مراكش", "فاس", "طنجة", "أكادير", "مكناس", "وجدة",
  "القنيطرة", "تطوان", "آسفي", "الجديدة", "الناظور", "بني ملال", "خريبكة",
  "Casablanca", "Rabat", "Marrakech", "Fès", "Tanger", "Agadir",
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

export function getReviewsForProduct(_productId: string): ProductReview[] {
  return reviews;
}

export function validateCoupon(code: string, subtotal: number): { valid: boolean; discount: number; message?: string } {
  const coupon = coupons.find((c) => c.code.toUpperCase() === code.toUpperCase() && c.active);
  if (!coupon) return { valid: false, discount: 0, message: "كود غير صالح" };
  if (coupon.usedCount >= coupon.maxUses) return { valid: false, discount: 0, message: "الكود منتهي" };
  if (subtotal < coupon.minOrder) return { valid: false, discount: 0, message: `الحد الأدنى ${coupon.minOrder} درهم` };
  const discount = coupon.type === "percentage" ? (subtotal * coupon.value) / 100 : coupon.value;
  return { valid: true, discount: Math.min(discount, subtotal) };
}

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
  { id: "cust-1", firstName: "سارة", lastName: "المنصوري", email: "sara@email.ma", phone: "+212612345678", city: "الدار البيضاء", totalOrders: 5, totalSpent: 890, createdAt: "2025-11-01" },
  { id: "cust-2", firstName: "يوسف", lastName: "العلوي", email: "youssef@email.ma", phone: "+212698765432", city: "الرباط", totalOrders: 3, totalSpent: 520, createdAt: "2025-12-15" },
  { id: "cust-3", firstName: "إيمان", lastName: "بنجلون", email: "iman@email.ma", phone: "+212655443322", city: "مراكش", totalOrders: 8, totalSpent: 1460, createdAt: "2025-09-20" },
];
