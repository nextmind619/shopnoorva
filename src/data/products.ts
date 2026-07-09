import type { Product, ProductReview, FAQ, Testimonial, InstagramPost, Coupon, Order, Customer } from "@/types";

const flashEnd = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString();

const L = (ar: string, fr: string, en: string) => ({ ar, fr, en });

export const products: Product[] = [
  {
    id: "prod-astronaut",
    slug: "astronaut-galaxy-projector",
    name: L("بروجيكتور رائد الفضاء", "Projecteur Astronaute Galaxy", "Astronaut Galaxy Projector"),
    shortDescription: L(
      "رائد فضاء أبيض بسبيكر + مجرة من الخوذة + ريموت أسود",
      "Astronaute blanc avec haut-parleur, galaxie et télécommande",
      "White astronaut with speaker, galaxy projection and remote"
    ),
    description: L(
      "بروجيكتور رائد الفضاء من NOORVA يحوّل غرفتك إلى عالم فضائي ساحر. تصميم كيوت فاخر، إضاءة مجرة قوية، ريموت للتحكم، ومثالي كهدية أو ديكور غرفة النوم والجيمنغ. الدفع عند الاستلام في جميع مدن المغرب.",
      "Le projecteur astronaute NOORVA transforme votre chambre en univers spatial. Design premium, galaxie immersive, télécommande incluse. Paiement à la livraison partout au Maroc.",
      "NOORVA astronaut projector turns your room into a cosmic universe. Premium design, immersive galaxy, remote included. Cash on delivery across Morocco."
    ),
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
    warrantyMonths: 12,
    problemEmoji: "🚀",
    problem: L("غرفتك مظلمة ومملة؟", "Chambre sombre et ennuyeuse?", "Room feels dull?"),
    problemCause: L("الإضاءة العادية ما تعطيش الأجواء اللي كتشوفها فتيك توك", "L'éclairage classique ne crée pas l'ambiance TikTok", "Regular lights don't create that TikTok vibe"),
    problemSolution: L("بروجيكتور رائد الفضاء + مجرة من الخوذة", "Projecteur astronaute + galaxie", "Astronaut projector + galaxy from helmet"),
    deepDescription: L(
      "تصميم كيوت فاخر يعرض مجرة سينمائية من الخوذة — مو إضاءة عادية. ريموت كامل، 10 ألوان، ومثالي للغرف والجيمنغ والهدايا. الأكثر مبيعًا على تيك توك.",
      "Design premium projetant une galaxie cinématique depuis le casque. Télécommande, 10 couleurs.",
      "Premium cute design projecting cinematic galaxy from helmet. Full remote, 10 colors."
    ),
    tags: ["astronaut", "galaxy", "bestseller", "tiktok"],
    benefits: [
      L("تأثير مجرة من الخوذة", "Galaxie depuis le casque", "Galaxy from helmet"),
      L("ريموت للتحكم عن بعد", "Télécommande incluse", "Remote included"),
      L("ديكور + إضاءة معًا", "Déco + ambiance", "Decor + ambiance"),
      L("هدية مثالية", "Cadeau parfait", "Perfect gift"),
    ],
    features: [
      L("مجرة من الخوذة", "Galaxie depuis casque", "Galaxy from helmet"),
      L("سبيكر مدمج في الصدر", "Haut-parleur intégré", "Built-in chest speaker"),
      L("ريموت تحكم أسود", "Télécommande noire", "Black remote control"),
      L("تشغيل USB", "Alimentation USB", "USB powered"),
    ],
    specifications: [
      { label: L("اللون", "Couleur", "Color"), value: L("أبيض", "Blanc", "White") },
      { label: L("الطاقة", "Alimentation", "Power"), value: L("USB 5V", "USB 5V", "USB 5V") },
      { label: L("التحكم", "Contrôle", "Control"), value: L("ريموت + أزرار", "Télécommande + boutons", "Remote + buttons") },
      { label: L("الضمان", "Garantie", "Warranty"), value: L("12 شهر", "12 mois", "12 months") },
    ],
    packageIncludes: [
      L("بروجيكتور رائد الفضاء", "Projecteur astronaute", "Astronaut projector"),
      L("ريموت تحكم", "Télécommande", "Remote control"),
      L("كابل USB", "Câble USB", "USB cable"),
      L("دليل الاستخدام", "Manuel", "User manual"),
    ],
    howToUse: L(
      "أزل الغلاف البلاستيكي عن الخوذة، ضع الجهاز على سطح ثابت، شغّله في غرفة مظلمة واستمتع بالمجرة على السقف.",
      "Retirez le film protecteur, placez sur surface stable, allumez dans le noir.",
      "Remove protective film, place on stable surface, power on in dark room."
    ),
    images: [
      { id: "img-1", url: "/products/astronaut-galaxy.svg", alt: L("رائد الفضاء", "Astronaute", "Astronaut"), type: "image" },
      { id: "img-2", url: "/products/astronaut-galaxy.svg", alt: L("تأثير المجرة", "Galaxie", "Galaxy"), type: "image" },
    ],
    lifestyleImages: ["/products/astronaut-galaxy.svg"],
    variants: [{ id: "var-astro", name: L("أبيض", "Blanc", "White"), price: 179, compareAtPrice: 269, sku: "NRV-ASTRO-01", stock: 72 }],
    upsellIds: ["prod-crystal", "prod-star"],
    crossSellIds: ["prod-carousel"],
    seo: {
      title: L("بروجيكتور رائد الفضاء | NOORVA", "Projecteur Astronaute | NOORVA", "Astronaut Galaxy Projector | NOORVA"),
      description: L("اشترِ بروجيكتور رائد الفضاء بالدفع عند الاستلام — توصيل 24-48 ساعة", "Projecteur astronaute COD — livraison 24-48h", "Astronaut projector COD — 24-48h delivery"),
    },
  },
  {
    id: "prod-crystal",
    slug: "crystal-galaxy-projector",
    name: L("بروجيكتور كريستال مجرة", "Projecteur Cristal Galaxy", "Crystal Galaxy Projector"),
    shortDescription: L(
      "أسود بقبّة كريستال — 10 ألوان + بلوتوث + مؤقت + ريموت",
      "Noir dôme cristal — 10 couleurs, Bluetooth, minuterie",
      "Black crystal dome — 10 colors, Bluetooth, timer, remote"
    ),
    description: L(
      "بروجيكتور كريستال NOORVA بتصميم فاخر. يعرض نجوم ومجرة بألوان متعددة على السقف والجدران. يدعم البلوتوث للموسيقى، ريموت تحكم، ومؤقت إيقاف تلقائي. مثالي للغرف، التصوير، والهدايا.",
      "Projecteur cristal NOORVA premium. Étoiles et galaxie multicolores. Bluetooth, télécommande, minuterie. Idéal chambre, contenu et cadeaux.",
      "NOORVA crystal projector. Multicolor stars and galaxy. Bluetooth speaker, remote, timer. Perfect for rooms, content and gifts."
    ),
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
    warrantyMonths: 12,
    problemEmoji: "💎",
    problem: L("البروجيكتور ديالك ضعيف؟", "Projecteur faible?", "Weak projector?"),
    problemCause: L("البروجيكتورات الرخيصة كتعطي نقط صغيرة، ما كاينش مجرة حقيقية", "Les projecteurs cheap font des points, pas de vraie galaxie", "Cheap projectors show dots, not real galaxy"),
    problemSolution: L("قبّة كريستال + 10 ألوان + بلوتوث", "Dôme cristal + 10 couleurs + Bluetooth", "Crystal dome + 10 colors + Bluetooth"),
    deepDescription: L(
      "قبّة كريستال فاخرة تعرض نجوم ومجرة بألوان متعددة على السقف والجدران. مكبر صوت بلوتوث، ريموت، ومؤقت — مو بروجيكتور عادي من السوق.",
      "Dôme cristal premium avec étoiles multicolores. Bluetooth, télécommande, minuterie.",
      "Premium crystal dome with multicolor stars. Bluetooth speaker, remote, timer."
    ),
    tags: ["crystal", "bluetooth", "galaxy"],
    benefits: [
      L("10 ألوان إضاءة", "10 couleurs", "10 colors"),
      L("بلوتوث + سبيكر", "Bluetooth + speaker", "Bluetooth speaker"),
      L("ريموت + مؤقت", "Télécommande + timer", "Remote + timer"),
      L("تأثير مجرة قوي", "Galaxie puissante", "Strong galaxy effect"),
    ],
    features: [
      L("10 أوضاع ألوان", "10 modes couleur", "10 color modes"),
      L("بلوتوث + سبيكر", "Bluetooth + speaker", "Bluetooth speaker"),
      L("مزامنة مع الموسيقى", "Sync musique", "Music sync"),
      L("مؤقت إيقاف تلقائي", "Minuterie", "Auto-off timer"),
    ],
    specifications: [
      { label: L("اللون", "Couleur", "Color"), value: L("أسود", "Noir", "Black") },
      { label: L("الألوان", "Couleurs", "Colors"), value: L("10 أوضاع", "10 modes", "10 modes") },
      { label: L("البلوتوث", "Bluetooth", "Bluetooth"), value: L("نعم + سبيكر", "Oui + speaker", "Yes + speaker") },
      { label: L("الطاقة", "Alimentation", "Power"), value: L("USB 5V", "USB 5V", "USB 5V") },
      { label: L("الضمان", "Garantie", "Warranty"), value: L("12 شهر", "12 mois", "12 months") },
    ],
    packageIncludes: [
      L("بروجيكتور كريستال", "Projecteur cristal", "Crystal projector"),
      L("ريموت تحكم", "Télécommande", "Remote"),
      L("كابل USB", "Câble USB", "USB cable"),
      L("دليل الاستخدام", "Manuel", "Manual"),
    ],
    howToUse: L("ضع في غرفة مظلمة، وجّه القبّة للسقف، استخدم الريموت لاختيار اللون والمؤقت.", "Pièce sombre, dôme vers plafond, télécommande.", "Dark room, aim at ceiling, use remote."),
    images: [
      { id: "img-1", url: "/products/crystal-galaxy.jpg", alt: L("بروجيكتور كريستال مجرة — 10 ألوان + بلوتوث + ريموت", "Projecteur cristal — 10 couleurs, Bluetooth, télécommande", "Crystal galaxy projector — 10 colors, Bluetooth, remote"), type: "image" },
      { id: "img-2", url: "/products/crystal-galaxy.jpg", alt: L("تأثير المجرة على السقف", "Effet galaxie au plafond", "Galaxy projection on ceiling"), type: "image" },
    ],
    lifestyleImages: ["/products/crystal-galaxy.jpg"],
    variants: [{ id: "var-crystal", name: L("أسود", "Noir", "Black"), price: 149, compareAtPrice: 229, sku: "NRV-CRYSTAL-01", stock: 86 }],
    upsellIds: ["prod-astronaut", "prod-star"],
    crossSellIds: ["prod-carousel"],
    seo: {
      title: L("بروجيكتور كريستال مجرة | NOORVA", "Projecteur Cristal | NOORVA", "Crystal Galaxy Projector | NOORVA"),
      description: L("بروجيكتور كريستال مع بلوتوث والدفع عند الاستلام", "Projecteur cristal Bluetooth COD", "Crystal Bluetooth projector COD"),
    },
  },
  {
    id: "prod-star",
    slug: "galaxy-star-projector",
    name: L("بروجيكتور نجوم المجرة", "Projecteur Galaxy Star", "Galaxy Star Projector"),
    shortDescription: L(
      "أبيض Style 2 — شكل ألماسي + أورورا + ريموت + Type-C",
      "Blanc Style 2 — forme diamant, aurora, Type-C",
      "White Style 2 — diamond shape, aurora, remote, Type-C"
    ),
    description: L(
      "بروجيكتور نجوم المجرة بتصميم ألماسي أبيض أنيق. يعرض نجوم وليزر مجرة بجودة سينمائية. مثالي للغرف الشبابية، الـ gaming، والتصوير على تيك توك وإنستغرام.",
      "Projecteur Galaxy Star au design diamant blanc. Étoiles et laser galaxie cinématique. Idéal gaming, chambre et TikTok.",
      "Galaxy Star projector with white diamond design. Cinematic stars and galaxy laser. Ideal for gaming rooms and TikTok."
    ),
    categoryId: "cat-projectors",
    price: 169,
    compareAtPrice: 249,
    sku: "NRV-STAR-01",
    stock: 64,
    rating: 4.7,
    reviewCount: 198,
    soldCount: 1320,
    isBestSeller: true,
    isTrending: true,
    isTikTokViral: true,
    isFeatured: true,
    warrantyMonths: 12,
    problemEmoji: "✨",
    problem: L("بغيتي تصوير خرافي للريلز؟", "Reels cinématiques?", "Want cinematic Reels?"),
    problemCause: L("الإضاءة العادية ما كتعطيش تأثير ليزر ومجرة قوي", "Pas d'effet laser galaxie puissant", "No strong galaxy laser effect"),
    problemSolution: L("شكل ألماسي + ليزر مجرة + ريموت", "Forme diamant + laser galaxie", "Diamond shape + galaxy laser + remote"),
    deepDescription: L(
      "تصميم ألماسي أبيض أنيق يعرض ليزر مجرة بجودة سينمائية. مثالي للغرف الشبابية، الـ gaming، والتصوير على تيك توك وإنستغرام.",
      "Design diamant blanc avec laser galaxie cinématique. Idéal gaming et TikTok.",
      "White diamond design with cinematic galaxy laser. Perfect for gaming and TikTok."
    ),
    tags: ["star", "laser", "diamond"],
    benefits: [
      L("تصميم ألماسي فاخر", "Design diamant", "Diamond design"),
      L("ليزر مجرة قوي", "Laser galaxie", "Galaxy laser"),
      L("مثالي للريلز", "Parfait Reels", "Perfect for Reels"),
      L("إضاءة سينمائية", "Ambiance cinéma", "Cinema ambiance"),
    ],
    features: [
      L("شكل ألماسي هندسي", "Forme diamant", "Diamond shape"),
      L("ليزر + نجوم", "Laser + étoiles", "Laser + stars"),
      L("ريموت تحكم", "Télécommande", "Remote"),
      L("Type-C USB", "USB Type-C", "USB Type-C"),
    ],
    specifications: [
      { label: L("الأبعاد", "Dimensions", "Dimensions"), value: L("16×9×10.5 سم", "16×9×10.5 cm", "16×9×10.5 cm") },
      { label: L("الطاقة", "Alimentation", "Power"), value: L("DC 5V Type-C", "DC 5V Type-C", "DC 5V Type-C") },
      { label: L("التحكم", "Contrôle", "Control"), value: L("ريموت", "Télécommande", "Remote") },
      { label: L("الضمان", "Garantie", "Warranty"), value: L("12 شهر", "12 mois", "12 months") },
    ],
    packageIncludes: [
      L("بروجيكتور نجوم", "Projecteur", "Projector"),
      L("ريموت", "Télécommande", "Remote"),
      L("كابل Type-C", "Câble Type-C", "Type-C cable"),
      L("دليل", "Manuel", "Manual"),
    ],
    images: [
      { id: "img-1", url: "/products/galaxy-star.svg", alt: L("نجوم المجرة أبيض", "Galaxy Star blanc", "White Galaxy Star"), type: "image" },
      { id: "img-2", url: "/products/galaxy-star.svg", alt: L("تأثير الأورورا", "Aurora", "Aurora effect"), type: "image" },
    ],
    lifestyleImages: ["/products/galaxy-star.svg"],
    variants: [{ id: "var-star", name: L("أبيض", "Blanc", "White"), price: 169, compareAtPrice: 249, sku: "NRV-STAR-01", stock: 64 }],
    upsellIds: ["prod-astronaut", "prod-crystal"],
    crossSellIds: ["prod-carousel"],
    seo: {
      title: L("بروجيكتور نجوم المجرة | NOORVA", "Galaxy Star Projector | NOORVA", "Galaxy Star Projector | NOORVA"),
      description: L("بروجيكتور نجوم ألماسي بالدفع عند الاستلام", "Projecteur Galaxy Star COD", "Galaxy Star projector COD"),
    },
  },
  {
    id: "prod-carousel",
    slug: "carousel-night-light",
    name: L("مصباح كاروسيل ليلي", "Veilleuse Carrousel", "Carousel Night Light"),
    shortDescription: L(
      "كاروسيل وردي وذهبي مع أرانب — دوران + موسيقى + ريموت 16 زر",
      "Carrousel rose et or — rotation, musique, télécommande",
      "Pink gold carousel — rotation, music, 16-button remote"
    ),
    description: L(
      "مصباح كاروسيل NOORVA بتصميم فاخر وردي وذهبي. إضاءة ناعمة للأطفال والغرف، ألوان متعددة، موسيقى، وريموت تحكم. هدية مثالية للبنات والعائلات.",
      "Veilleuse carrousel NOORVA rose et or. Lumière douce, couleurs, musique, télécommande. Cadeau parfait.",
      "NOORVA carousel night light in pink and gold. Soft glow, colors, music, remote. Perfect gift."
    ),
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
    warrantyMonths: 12,
    problemEmoji: "🎠",
    problem: L("بنتك خايفة من الظلام؟", "Peur du noir?", "Child afraid of dark?"),
    problemCause: L("المصابيح العادية قاسية أو مملة — ما كتعطيش راحة", "Veilleuses classiques trop dures ou ennuyeuses", "Regular night lights are harsh or boring"),
    problemSolution: L("كاروسيل وردي وذهبي + إضاءة ناعمة + موسيقى", "Carrousel rose et or + lumière douce", "Pink gold carousel + soft light + music"),
    deepDescription: L(
      "كاروسيل فاخر وردي وذهبي مع أرانب دوّارة. إضاءة ناعمة، ألوان متعددة، موسيقى، وريموت — هدية مثالية للبنات والعائلات.",
      "Carrousel rose et or avec lapins rotatifs. Lumière douce, musique, télécommande.",
      "Luxury pink gold carousel with rotating bunnies. Soft glow, music, remote."
    ),
    tags: ["carousel", "nightlight", "kids", "gift"],
    benefits: [
      L("تصميم كاروسيل فاخر", "Design carrousel luxe", "Luxury carousel"),
      L("إضاءة ناعمة للأطفال", "Lumière douce", "Soft kids light"),
      L("شحن USB", "USB rechargeable", "USB charge"),
      L("هدية مثالية", "Cadeau idéal", "Ideal gift"),
    ],
    features: [
      L("دوران كاروسيل", "Rotation carrousel", "Carousel rotation"),
      L("ألوان متعددة", "Couleurs multiples", "Multiple colors"),
      L("ريموت 16 زر", "Télécommande 16 boutons", "16-button remote"),
      L("موسيقى مدمجة", "Musique intégrée", "Built-in music"),
    ],
    specifications: [
      { label: L("اللون", "Couleur", "Color"), value: L("وردي + ذهبي", "Rose + or", "Pink + gold") },
      { label: L("الشحن", "Charge", "Charging"), value: L("USB", "USB", "USB") },
      { label: L("التحكم", "Contrôle", "Control"), value: L("ريموت + أزرار", "Télécommande", "Remote") },
      { label: L("الضمان", "Garantie", "Warranty"), value: L("12 شهر", "12 mois", "12 months") },
    ],
    packageIncludes: [
      L("مصباح كاروسيل", "Veilleuse carrousel", "Carousel light"),
      L("ريموت تحكم", "Télécommande", "Remote"),
      L("كابل USB", "Câble USB", "USB cable"),
      L("دليل الاستخدام", "Manuel", "Manual"),
    ],
    images: [
      { id: "img-1", url: "/products/carousel-night.svg", alt: L("كاروسيل وردي", "Carrousel rose", "Pink carousel"), type: "image" },
      { id: "img-2", url: "/products/carousel-night.svg", alt: L("إضاءة ليلية", "Veilleuse", "Night light"), type: "image" },
    ],
    lifestyleImages: ["/products/carousel-night.svg"],
    variants: [{ id: "var-carousel", name: L("وردي", "Rose", "Pink"), price: 129, compareAtPrice: 189, sku: "NRV-CAROUSEL-01", stock: 120 }],
    upsellIds: ["prod-astronaut", "prod-crystal"],
    crossSellIds: ["prod-star"],
    seo: {
      title: L("مصباح كاروسيل ليلي | NOORVA", "Veilleuse Carrousel | NOORVA", "Carousel Night Light | NOORVA"),
      description: L("مصباح كاروسيل وردي بالدفع عند الاستلام", "Veilleuse carrousel rose COD", "Pink carousel night light COD"),
    },
  },
];

export const reviews: ProductReview[] = [
  { id: "r1", author: "سارة المنصوري", city: "الدار البيضاء", rating: 5, title: L("حولت غرفتي!", "Chambre transformée!", "Transformed my room!"), content: L("بروجيكتور رائد الفضاء رائع. التوصيل سريع والدفع عند الاستلام مريح.", "Projecteur astronaute génial. Livraison rapide.", "Astronaut projector amazing. Fast delivery."), date: "2026-06-20", verified: true },
  { id: "r2", author: "يوسف العلوي", city: "الرباط", rating: 5, title: L("فيرال تيك توك", "Viral TikTok", "TikTok viral"), content: L("البروجيكتور الكريستال كيعطي تصوير خرافي للريلز.", "Le cristal est parfait pour les Reels.", "Crystal perfect for Reels."), date: "2026-06-18", verified: true },
  { id: "r3", author: "إيمان بنجلون", city: "مراكش", rating: 5, title: L("هدية بنتي", "Cadeau fille", "Daughter gift"), content: L("الكاروسيل الوردي زوين بزاف. بنتي فرحات.", "Carrousel rose adorable.", "Pink carousel adorable."), date: "2026-06-12", verified: true },
  { id: "r4", author: "أمين التازي", city: "طنجة", rating: 5, title: L("جودة عالية", "Haute qualité", "High quality"), content: L("بروجيكتور النجوم كيشعل الغرفة كاملة. أنصح بيه.", "Galaxy Star illumine toute la pièce.", "Galaxy Star lights whole room."), date: "2026-06-08", verified: true },
  { id: "r5", author: "خديجة الفاسي", city: "فاس", rating: 5, title: L("خدمة ممتازة", "Service top", "Great service"), content: L("طلبت بالواتساب والدفع عند الاستلام. كلشي ساهل.", "Commande facile COD.", "Easy COD order."), date: "2026-06-01", verified: true },
  { id: "r6", author: "محمد برادة", city: "أكادير", rating: 5, title: L("أجواء سينمائية", "Ambiance cinéma", "Cinema vibe"), content: L("شريت جوج بروجيكتورات. الغرفة ولاّت سينما.", "Deux projecteurs = ambiance cinéma.", "Two projectors = cinema."), date: "2026-05-25", verified: true },
];

export const faqs: FAQ[] = [
  { id: "f1", question: L("كيفاش كايخدم الدفع عند الاستلام؟", "Comment fonctionne le COD?", "How does COD work?"), answer: L("كتطلب وكتخلّص كاش ملي يوصلك الطلب. ما محتاجش بطاقة بنكية.", "Commandez et payez en espèces à la livraison.", "Order and pay cash on delivery.") },
  { id: "f2", question: L("شحال كتدوم التوصيلة؟", "Délai de livraison?", "Delivery time?"), answer: L("24-48 ساعة للمدن الكبرى. 2-4 أيام لباقي المدن.", "24-48h grandes villes. 2-4 jours ailleurs.", "24-48h major cities.") },
  { id: "f3", question: L("واش كاين ضمان؟", "Garantie?", "Warranty?"), answer: L("نعم، ضمان 12 شهر على جميع المنتجات.", "Oui, garantie 12 mois.", "Yes, 12-month warranty.") },
  { id: "f4", question: L("واش التوصيل مجاني؟", "Livraison gratuite?", "Free shipping?"), answer: L("مجاني فوق 500 درهم. غير ذلك 25-35 درهم.", "Gratuit dès 500 MAD.", "Free over 500 MAD.") },
  { id: "f5", question: L("واش نقدر نرجع المنتج؟", "Retours?", "Returns?"), answer: L("14 يوم للإرجاع إذا فيه عيب. تواصل معنا على واتساب.", "14 jours si défaut.", "14 days if defective.") },
];

export const testimonials: Testimonial[] = [
  { id: "t1", name: "ليلى", city: "الدار البيضاء", videoThumbnail: "/products/astronaut-galaxy.svg", videoUrl: "#", quote: L("بروجيكتور رائد الفضاء بدّل أجواء غرفتي", "Astronaute a changé ma chambre", "Astronaut changed my room") },
  { id: "t2", name: "نادية", city: "مراكش", videoThumbnail: "/products/carousel-night.svg", videoUrl: "#", quote: L("الكاروسيل أحسن هدية", "Meilleur cadeau", "Best gift ever") },
  { id: "t3", name: "إيمان", city: "الرباط", videoThumbnail: "/products/crystal-galaxy.jpg", videoUrl: "#", quote: L("البروجيكتور الكريستال خرافي", "Le cristal est incroyable", "Crystal is amazing") },
  { id: "t4", name: "يوسف", city: "طنجة", videoThumbnail: "/products/galaxy-star.svg", videoUrl: "#", quote: L("Galaxy Star كيشعل الغرفة", "Galaxy Star illumine tout", "Galaxy Star lights the room") },
];

export const instagramPosts: InstagramPost[] = [
  { id: "ig1", image: "/products/crystal-galaxy.jpg", url: "https://instagram.com/shopnoorva", likes: 2847 },
  { id: "ig2", image: "/products/astronaut-galaxy.svg", url: "https://instagram.com/shopnoorva", likes: 1923 },
  { id: "ig3", image: "/products/galaxy-star.svg", url: "https://instagram.com/shopnoorva", likes: 3456 },
  { id: "ig4", image: "/products/carousel-night.svg", url: "https://instagram.com/shopnoorva", likes: 1567 },
];

export const coupons: Coupon[] = [
  { id: "c1", code: "NOORVA10", type: "percentage", value: 10, minOrder: 150, maxUses: 1000, usedCount: 120, expiresAt: "2026-12-31", active: true },
  { id: "c2", code: "WELCOME15", type: "percentage", value: 15, minOrder: 200, maxUses: 500, usedCount: 45, expiresAt: "2026-12-31", active: true },
];

export const moroccanCities = [
  "الدار البيضاء", "الرباط", "مراكش", "فاس", "طنجة", "أكادير", "مكناس", "وجدة",
  "القنيطرة", "تطوان", "آسفي", "الجديدة", "الناظور", "بني ملال",
  "Casablanca", "Rabat", "Marrakech", "Fès", "Tanger", "Agadir",
];

export function getProductBySlug(slug: string) { return products.find((p) => p.slug === slug); }
export function getProductById(id: string) { return products.find((p) => p.id === id) || (id === "prod-diamond" ? products.find((p) => p.id === "prod-star") : undefined); }
export function getProductsByCategory(categoryId: string) { return products.filter((p) => p.categoryId === categoryId); }
export function getBestSellers() { return products.filter((p) => p.isBestSeller); }
export function getTrending() { return products.filter((p) => p.isTrending); }
export function getTikTokViral() { return products.filter((p) => p.isTikTokViral); }
export function getFeatured() { return products.filter((p) => p.isFeatured); }
export function getFlashSaleProducts() { return products.filter((p) => p.flashSaleEndsAt); }
export function getReviewsForProduct(_id: string) { return reviews; }

export function validateCoupon(code: string, subtotal: number) {
  const coupon = coupons.find((c) => c.code.toUpperCase() === code.toUpperCase() && c.active);
  if (!coupon) return { valid: false, discount: 0, message: "كود غير صالح" };
  if (coupon.usedCount >= coupon.maxUses) return { valid: false, discount: 0, message: "منتهي" };
  if (subtotal < coupon.minOrder) return { valid: false, discount: 0, message: `الحد الأدنى ${coupon.minOrder} درهم` };
  const discount = coupon.type === "percentage" ? (subtotal * coupon.value) / 100 : coupon.value;
  return { valid: true, discount: Math.min(discount, subtotal) };
}

let ordersStore: Order[] = [];
export function createOrder(order: Order) { ordersStore.push(order); return order; }
export function getOrders() { return [...ordersStore]; }
export function getOrderById(id: string) { return ordersStore.find((o) => o.id === id); }
export function getOrderByNumber(num: string) { return ordersStore.find((o) => o.orderNumber === num); }

export const customers: Customer[] = [
  { id: "c1", firstName: "سارة", lastName: "المنصوري", email: "sara@email.ma", phone: "+212612345678", city: "الدار البيضاء", totalOrders: 5, totalSpent: 890, createdAt: "2025-11-01" },
];
