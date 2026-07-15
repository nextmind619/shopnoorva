import type { Product, ProductReview, FAQ, Testimonial, InstagramPost, Coupon, Order, Customer } from "@/types";
import { enrichProduct } from "@/lib/product-images/enrich-products";
import { resolveProductImage } from "@/lib/product-images/resolve";

const flashEnd = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString();

const L = (ar: string, fr: string, en: string) => ({ ar, fr, en });

export const products: Product[] = [
  {
    id: "prod-astronaut",
    slug: "astronaut-galaxy-projector",
    name: L("بروجيكتور رائد الفضاء", "Projecteur Astronaute Galaxy", "Astronaut Galaxy Projector"),
    shortDescription: L(
      "رائد فضاء أبيض — 8 أصوات مهدئة للنوم + سبيكر بلوتوث + 9 مؤثرات مجرة",
      "Astronaute blanc — 8 bruits blancs, Bluetooth, 9 effets nébuleuse",
      "White astronaut — 8 soothing white noises, Bluetooth speaker, 9 nebula effects"
    ),
    description: L(
      "بروجيكتور رائد الفضاء من NOORVA — رأس بقبة سوداء عاكسة وعدسة HD للعرض، مع سماعتين دائريتين على الخوذة وسبيكر بلوتوث في الصدر. يحتوي على 8 أصوات مهدئة للنوم (مطر، أمواج، عصافير، حريق مخيم...) و9 مؤثرات مجرة قابلة للتركيب مع 4 سرعات دوران، وسطوع قابل للتعديل من 5% إلى 100%. رأس دوّار 360° مع ذراع قابل للتعديل وقاعدة ثابتة، تحكم بالريموت أو الأزرار الخلفية. الدفع عند الاستلام في جميع مدن المغرب.",
      "Projecteur astronaute NOORVA — dôme noir réfléchissant et lentille HD. 8 bruits blancs apaisants, haut-parleur Bluetooth intégré, 9 effets nébuleuse combinables, 4 vitesses de rotation, luminosité réglable 5%-100%. Tête 360° + bras ajustable + base fixe. Paiement à la livraison au Maroc.",
      "NOORVA astronaut projector — glossy black dome head with HD projection lens, round speaker ears and built-in Bluetooth chest speaker. 8 built-in soothing white noises (rain, waves, birds, campfire...), 9 combinable nebula effects with 4 rotation speeds, brightness adjustable 5%-100%. 360° rotatable head + adjustable arm + fixed stable base, remote or back-button control. Cash on delivery."
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
    problem: L("كيدك ما كينعسش بسهولة؟", "Votre enfant a du mal à dormir?", "Struggling to fall asleep?"),
    problemCause: L("الإضاءة العادية والصمت الثقيل ما كيهدّئوش الأطفال، والبروجيكتورات الرخيصة كتعطي مؤثر واحد بلا صوت", "L'éclairage classique et le silence ne rassurent pas les enfants, les projecteurs bon marché n'ont qu'un seul effet sans son", "Regular lighting and dead silence don't calm kids, and cheap projectors only give one effect with no sound"),
    problemSolution: L("بروجيكتور رائد الفضاء + 8 أصوات مهدئة + بلوتوث + 9 مؤثرات مجرة", "Astronaute + 8 bruits blancs + Bluetooth + 9 effets nébuleuse", "Astronaut + 8 white noises + Bluetooth + 9 nebula effects"),
    deepDescription: L(
      "رأس بقبة سوداء عاكسة وعدسة HD، سماعتين دائريتين على الخوذة، وسبيكر بلوتوث في الصدر. 8 أصوات طبيعية مهدئة للنوم (مطر، أمواج البحر، عصافير الغابة، حريق مخيم، تهويدات...)، 9 مؤثرات مجرة مع 4 سرعات دوران وسطوع قابل للتعديل. رأس دوّار 360° وذراع قابل للتعديل على قاعدة ثابتة. هدية مثالية للأطفال والعائلة.",
      "Dôme noir réfléchissant + lentille HD. 8 bruits blancs naturels, Bluetooth, 9 effets nébuleuse, tête 360° + bras ajustable.",
      "Glossy black dome head with HD lens, round helmet speakers, chest Bluetooth speaker. 8 natural sleep sounds, 9 nebula effects with 4 speeds, adjustable brightness. 360° rotatable head + adjustable arm on a fixed base. Perfect gift for kids and family."
    ),
    tags: ["astronaut", "galaxy", "bluetooth", "white-noise", "bestseller", "tiktok"],
    benefits: [
      L("8 أصوات مهدئة للنوم", "8 bruits blancs apaisants", "8 soothing white noises"),
      L("سبيكر بلوتوث مدمج لتشغيل الموسيقى", "Haut-parleur Bluetooth intégré", "Built-in Bluetooth music speaker"),
      L("9 مؤثرات مجرة قابلة للتركيب", "9 effets nébuleuse combinables", "9 combinable nebula effects"),
      L("سطوع وسرعة دوران قابلين للتعديل", "Luminosité et vitesse réglables", "Adjustable brightness & rotation speed"),
      L("رأس 360° + ذراع قابل للتعديل + قاعدة ثابتة", "Tête 360° + bras ajustable + base fixe", "360° head + adjustable arm + fixed base"),
      L("هدية مثالية للأطفال والعائلة", "Cadeau parfait", "Perfect gift for kids & family"),
    ],
    features: [
      L("8 أصوات مهدئة: مطر، تهويدات، حريق مخيم، أمواج، أصوات الصيف، عصافير، نجوم، جدول ماء", "8 bruits blancs: pluie, berceuses, feu de camp, vagues...", "8 white noises: running water, lullabies, campfires, ocean waves, summer nights, forest birds, twinkling stars, creek rain"),
      L("سبيكر بلوتوث مدمج لربط الهاتف وتشغيل الموسيقى", "Haut-parleur Bluetooth intégré pour la musique", "Built-in Bluetooth speaker for playing music from your phone"),
      L("9 مؤثرات مجرة/سديم مع 4 مستويات سرعة", "9 effets nébuleuse, 4 vitesses", "9 nebula effects with 4 speed levels"),
      L("سطوع قابل للتعديل من 5% إلى 100%", "Luminosité réglable de 5% à 100%", "Brightness adjustable from 5% to 100%"),
      L("رأس دوّار 360° وذراع قابل للتعديل", "Tête rotative 360° et bras ajustable", "360° rotatable head and adjustable arm"),
      L("قاعدة ثابتة وعدسة HD للعرض", "Base fixe et lentille HD", "Fixed stable base with HD projection lens"),
      L("ريموت تحكم كامل + أزرار خلفية", "Télécommande complète + boutons arrière", "Full remote control + back buttons"),
      L("تشغيل USB", "Alimentation USB", "USB powered"),
    ],
    specifications: [
      { label: L("اللون", "Couleur", "Color"), value: L("أبيض", "Blanc", "White") },
      { label: L("البلوتوث", "Bluetooth", "Bluetooth"), value: L("سبيكر مدمج لتشغيل الموسيقى", "Haut-parleur intégré", "Built-in music speaker") },
      { label: L("الأصوات المهدئة", "Bruits blancs", "White Noises"), value: L("8 أصوات طبيعية", "8 sons naturels", "8 natural sounds") },
      { label: L("مؤثرات الإضاءة", "Effets lumière", "Light Effects"), value: L("9 مؤثرات مجرة + 4 سرعات", "9 effets + 4 vitesses", "9 nebula effects + 4 speeds") },
      { label: L("السطوع", "Luminosité", "Brightness"), value: L("قابل للتعديل 5%–100%", "Réglable 5%–100%", "Adjustable 5%–100%") },
      { label: L("الطاقة", "Alimentation", "Power"), value: L("USB 5V", "USB 5V", "USB 5V") },
      { label: L("التحكم", "Contrôle", "Control"), value: L("ريموت + أزرار خلفية", "Télécommande + boutons arrière", "Remote + back buttons") },
      { label: L("الحركة", "Mouvement", "Movement"), value: L("رأس 360° + ذراع قابل للتعديل", "Tête 360° + bras ajustable", "360° head + adjustable arm") },
      { label: L("الأبعاد", "Dimensions", "Dimensions"), value: L("23×12×12 سم", "23×12×12 cm", "23×12×12 cm") },
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
    lifestyleScenes: [
      { id: "bedroom", emoji: "😴", title: L("نوم هادئ", "Sommeil paisible", "Peaceful Sleep"), description: L("8 أصوات طبيعية + مجرة تساعد على النوم بسرعة", "8 sons naturels + galaxie pour s'endormir vite", "8 natural sounds + galaxy to fall asleep fast") },
      { id: "kids", emoji: "🧸", title: L("غرفة الأطفال", "Enfants", "Kids Room"), description: L("إضاءة ناعمة وأصوات مهدئة تطمن الأطفال", "Lumière douce et bruits blancs rassurants", "Soft light and soothing sounds for kids") },
      { id: "gaming", emoji: "🎮", title: L("غرفة الجيمنغ", "Gaming", "Gaming Room"), description: L("أجواء سينمائية بـ9 مؤثرات مجرة", "Ambiance cinéma avec 9 effets nébuleuse", "Cinematic vibe with 9 nebula effects") },
      { id: "music", emoji: "🎵", title: L("موسيقى بلوتوث", "Musique Bluetooth", "Bluetooth Music"), description: L("شغّل موسيقاك من الهاتف واستمتع بالمجرة", "Jouez votre musique avec la galaxie", "Play music from your phone with galaxy lights") },
      { id: "gift", emoji: "🎁", title: L("هدية مثالية", "Cadeau", "Gift"), description: L("هدية رائعة للأطفال والعائلة والأصدقاء", "Cadeau parfait pour enfants et amis", "Amazing gift for kids, family and friends") },
    ],
    images: [],
    lifestyleImages: [],
    variants: [{ id: "var-astro", name: L("أبيض", "Blanc", "White"), price: 179, compareAtPrice: 269, sku: "NRV-ASTRO-01", stock: 72 }],
    upsellIds: ["prod-crystal", "prod-star"],
    crossSellIds: ["prod-carousel"],
    seo: {
      title: L("بروجيكتور رائد الفضاء | NOORVA", "Projecteur Astronaute | NOORVA", "Astronaut Galaxy Projector | NOORVA"),
      description: L("بروجيكتور رائد الفضاء — 8 أصوات مهدئة للنوم + بلوتوث + 9 مؤثرات مجرة — الدفع عند الاستلام", "Projecteur astronaute — 8 bruits blancs + Bluetooth + 9 effets — COD", "Astronaut projector — 8 white noises + Bluetooth + 9 nebula effects — COD"),
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
      { label: L("المادة", "Matériau", "Material"), value: L("ABS + قبّة كريستال", "ABS + dôme cristal", "ABS + crystal dome") },
      { label: L("الطاقة", "Alimentation", "Power"), value: L("USB 5V / DC Type-C", "USB 5V / DC Type-C", "USB 5V / DC Type-C") },
      { label: L("نوع USB", "Type USB", "USB Type"), value: L("USB-A + Type-C IN", "USB-A + Type-C IN", "USB-A + Type-C IN") },
      { label: L("نوع LED", "Type LED", "LED Type"), value: L("RGB متعدد الألوان", "RGB multicolore", "Multicolor RGB") },
      { label: L("مسافة الإسقاط", "Distance projection", "Projection Distance"), value: L("2–5 متر", "2–5 m", "2–5 m") },
      { label: L("أوضاع الإضاءة", "Modes lumière", "Light Modes"), value: L("10 ألوان + مجرة", "10 couleurs + galaxie", "10 colors + galaxy") },
      { label: L("المؤقت", "Minuterie", "Timer"), value: L("نعم — إيقاف تلقائي", "Oui — arrêt auto", "Yes — auto-off") },
      { label: L("الريموت", "Télécommande", "Remote"), value: L("ريموت IR كامل", "Télécommande IR", "Full IR remote") },
      { label: L("البلوتوث", "Bluetooth", "Bluetooth"), value: L("5.0 + سبيكر مدمج", "5.0 + haut-parleur", "5.0 + built-in speaker") },
      { label: L("وضع الموسيقى", "Mode musique", "Music Mode"), value: L("مزامنة مع الإيقاع", "Sync au rythme", "Rhythm sync") },
      { label: L("الأبعاد", "Dimensions", "Dimensions"), value: L("Ø 15 × 12 سم", "Ø 15 × 12 cm", "Ø 15 × 12 cm") },
      { label: L("الوزن", "Poids", "Weight"), value: L("450 غ", "450 g", "450 g") },
      { label: L("الضمان", "Garantie", "Warranty"), value: L("12 شهر", "12 mois", "12 months") },
    ],
    packageIncludes: [
      L("بروجيكتور كريستال", "Projecteur cristal", "Crystal projector"),
      L("ريموت تحكم", "Télécommande", "Remote"),
      L("كابل USB", "Câble USB", "USB cable"),
      L("دليل الاستخدام", "Manuel", "Manual"),
    ],
    howToUse: L("ضع في غرفة مظلمة، وجّه القبّة للسقف، استخدم الريموت لاختيار اللون والمؤقت.", "Pièce sombre, dôme vers plafond, télécommande.", "Dark room, aim at ceiling, use remote."),
    images: [],
    lifestyleImages: [],
    lifestyleScenes: [
      { id: "bedroom", emoji: "🛏️", title: L("غرفة النوم", "Chambre", "Bedroom"), description: L("حوّل غرفتك إلى كون ساحر قبل النوم", "Univers apaisant avant de dormir", "Turn your bedroom into a cosmic retreat") },
      { id: "gaming", emoji: "🎮", title: L("غرفة الجيمنغ", "Gaming", "Gaming Room"), description: L("أجواء سينمائية للعب والبث المباشر", "Ambiance cinéma pour gaming et stream", "Cinematic vibe for gaming and streaming") },
      { id: "kids", emoji: "🧸", title: L("غرفة الأطفال", "Enfants", "Kids Room"), description: L("إضاءة ناعمة تطمن وتساعد على النوم", "Lumière douce et rassurante", "Soft light that soothes and comforts") },
      { id: "living", emoji: "🛋️", title: L("غرفة المعيشة", "Salon", "Living Room"), description: L("ديكور فاخر يبان فالتصوير والاستقبال", "Déco premium pour photos et soirées", "Premium decor for photos and evenings") },
      { id: "romantic", emoji: "💫", title: L("أجواء رومانسية", "Romantique", "Romantic"), description: L("مجرة خاصة لأمسيات على قد الحب", "Galaxie intime pour soirées à deux", "Private galaxy for intimate evenings") },
    ],
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
    flashSaleEndsAt: flashEnd,
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
    images: [],
    lifestyleImages: [],
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
    flashSaleEndsAt: flashEnd,
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
    images: [],
    lifestyleImages: [],
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
  { id: "r1", productId: "prod-astronaut", author: "سارة المنصوري", city: "الدار البيضاء", rating: 5, title: L("حولت غرفتي!", "Chambre transformée!", "Transformed my room!"), content: L("بروجيكتور رائد الفضاء رائع. التوصيل سريع والدفع عند الاستلام مريح.", "Projecteur astronaute génial. Livraison rapide.", "Astronaut projector amazing. Fast delivery."), date: "2026-06-20", verified: true, images: [resolveProductImage("astronaut-galaxy-projector", "04-bedroom", "thumbnail")] },
  { id: "r2", productId: "prod-crystal", author: "يوسف العلوي", city: "الرباط", rating: 5, title: L("فيرال تيك توك", "Viral TikTok", "TikTok viral"), content: L("البروجيكتور الكريستال كيعطي تصوير خرافي للريلز. البلوتوث والريموت زوينين بزاف.", "Le cristal est parfait pour les Reels. Bluetooth impeccable.", "Crystal perfect for Reels. Bluetooth and remote are great."), date: "2026-06-18", verified: true, images: [resolveProductImage("crystal-galaxy-projector", "06-gaming-room", "thumbnail")], hasVideo: true },
  { id: "r3", productId: "prod-carousel", author: "إيمان بنجلون", city: "مراكش", rating: 5, title: L("هدية بنتي", "Cadeau fille", "Daughter gift"), content: L("الكاروسيل الوردي زوين بزاف. بنتي فرحات.", "Carrousel rose adorable.", "Pink carousel adorable."), date: "2026-06-12", verified: true, images: [resolveProductImage("carousel-night-light", "04-bedroom", "thumbnail")] },
  { id: "r4", productId: "prod-star", author: "أمين التازي", city: "طنجة", rating: 5, title: L("جودة عالية", "Haute qualité", "High quality"), content: L("بروجيكتور النجوم كيشعل الغرفة كاملة. أنصح بيه.", "Galaxy Star illumine toute la pièce.", "Galaxy Star lights whole room."), date: "2026-06-08", verified: true, images: [resolveProductImage("galaxy-star-projector", "05-living-room", "thumbnail")] },
  { id: "r5", productId: "prod-crystal", author: "خديجة الفاسي", city: "فاس", rating: 5, title: L("خدمة ممتازة", "Service top", "Great service"), content: L("طلبت بالواتساب والدفع عند الاستلام. كلشي ساهل.", "Commande facile COD.", "Easy COD order."), date: "2026-06-01", verified: true, images: [resolveProductImage("crystal-galaxy-projector", "04-bedroom", "thumbnail")] },
  { id: "r6", productId: "prod-crystal", author: "محمد برادة", city: "أكادير", rating: 5, title: L("أجواء سينمائية", "Ambiance cinéma", "Cinema vibe"), content: L("شريت جوج بروجيكتورات. الغرفة ولاّت سينما.", "Deux projecteurs = ambiance cinéma.", "Two projectors = cinema."), date: "2026-05-25", verified: true, hasVideo: true },
  { id: "r7", productId: "prod-crystal", author: "نور الهدى", city: "الدار البيضاء", rating: 5, title: L("أحسن شراء", "Meilleur achat", "Best purchase"), content: L("10 ألوان ومجرة قوية. الريموت كيخدم مزيان.", "10 couleurs, galaxie puissante.", "10 colors, strong galaxy effect."), date: "2026-05-18", verified: true, images: [resolveProductImage("crystal-galaxy-projector", "05-living-room", "thumbnail")] },
  { id: "r8", productId: "prod-astronaut", author: "كريم بنعيسى", city: "الرباط", rating: 4, title: L("كيوت وفاخر", "Mignon et premium", "Cute and premium"), content: L("رائد الفضاء كيوت بزاف. الهدية ممتازة.", "Astronaute trop mignon.", "Super cute astronaut design."), date: "2026-05-10", verified: true },
];

export const faqs: FAQ[] = [
  { id: "f1", question: L("كيفاش كايخدم الدفع عند الاستلام؟", "Comment fonctionne le COD?", "How does COD work?"), answer: L("كتطلب وكتخلّص كاش ملي يوصلك الطلب. ما محتاجش بطاقة بنكية.", "Commandez et payez en espèces à la livraison.", "Order and pay cash on delivery.") },
  { id: "f2", question: L("شحال كتدوم التوصيلة؟", "Délai de livraison?", "Delivery time?"), answer: L("24-48 ساعة للمدن الكبرى. 2-4 أيام لباقي المدن.", "24-48h grandes villes. 2-4 jours ailleurs.", "24-48h major cities.") },
  { id: "f3", question: L("واش كاين ضمان؟", "Garantie?", "Warranty?"), answer: L("نعم، ضمان 12 شهر على جميع المنتجات.", "Oui, garantie 12 mois.", "Yes, 12-month warranty.") },
  { id: "f4", question: L("واش التوصيل مجاني؟", "Livraison gratuite?", "Free shipping?"), answer: L("مجاني فوق 500 درهم. غير ذلك 25-35 درهم.", "Gratuit dès 500 MAD.", "Free over 500 MAD.") },
  { id: "f5", question: L("واش نقدر نرجع المنتج؟", "Retours?", "Returns?"), answer: L("14 يوم للإرجاع إذا فيه عيب. تواصل معنا على واتساب.", "14 jours si défaut.", "14 days if defective.") },
];

export const testimonials: Testimonial[] = [
  { id: "t1", name: "ليلى", city: "الدار البيضاء", videoThumbnail: resolveProductImage("astronaut-galaxy-projector", "04-bedroom", "thumbnail"), videoUrl: "#", quote: L("بروجيكتور رائد الفضاء بدّل أجواء غرفتي", "Astronaute a changé ma chambre", "Astronaut changed my room") },
  { id: "t2", name: "نادية", city: "مراكش", videoThumbnail: resolveProductImage("carousel-night-light", "08-kids-room", "thumbnail"), videoUrl: "#", quote: L("الكاروسيل أحسن هدية", "Meilleur cadeau", "Best gift ever") },
  { id: "t3", name: "إيمان", city: "الرباط", videoThumbnail: resolveProductImage("crystal-galaxy-projector", "06-gaming-room", "thumbnail"), videoUrl: "#", quote: L("البروجيكتور الكريستال خرافي", "Le cristal est incroyable", "Crystal is amazing") },
  { id: "t4", name: "يوسف", city: "طنجة", videoThumbnail: resolveProductImage("galaxy-star-projector", "05-living-room", "thumbnail"), videoUrl: "#", quote: L("Galaxy Star كيشعل الغرفة", "Galaxy Star illumine tout", "Galaxy Star lights the room") },
];

export const instagramPosts: InstagramPost[] = [
  { id: "ig1", image: resolveProductImage("crystal-galaxy-projector", "20-social-media-banner", "thumbnail"), url: "https://instagram.com/shopnoorva", likes: 2847 },
  { id: "ig2", image: resolveProductImage("astronaut-galaxy-projector", "20-social-media-banner", "thumbnail"), url: "https://instagram.com/shopnoorva", likes: 1923 },
  { id: "ig3", image: resolveProductImage("galaxy-star-projector", "20-social-media-banner", "thumbnail"), url: "https://instagram.com/shopnoorva", likes: 3456 },
  { id: "ig4", image: resolveProductImage("carousel-night-light", "20-social-media-banner", "thumbnail"), url: "https://instagram.com/shopnoorva", likes: 1567 },
];

export const coupons: Coupon[] = [
  { id: "c1", code: "NOORVA10", type: "percentage", value: 10, minOrder: 150, maxUses: 1000, usedCount: 120, expiresAt: "2026-12-31", active: true },
  { id: "c2", code: "WELCOME15", type: "percentage", value: 15, minOrder: 200, maxUses: 500, usedCount: 45, expiresAt: "2026-12-31", active: true },
];

export const moroccanCities = [
  "الدار البيضاء", "الرباط", "مراكش", "فاس", "طنجة", "أكادير", "مكناس", "وجدة",
  "القنيطرة", "تطوان", "آسفي", "الجديدة", "الناظور", "بني ملال", "سلا", "العيون",
  "المحمدية", "خريبكة", "سطات", "تازة", "الحسيمة", "ورزازات",
];

export function getProductBySlug(slug: string) {
  const p = products.find((prod) => prod.slug === slug);
  return p ? enrichProduct(p) : undefined;
}
export function getProductById(id: string) {
  const p = products.find((prod) => prod.id === id) || (id === "prod-diamond" ? products.find((prod) => prod.id === "prod-star") : undefined);
  return p ? enrichProduct(p) : undefined;
}
export function getProductsByCategory(categoryId: string) { return products.filter((p) => p.categoryId === categoryId).map(enrichProduct); }
export function getBestSellers() { return products.filter((p) => p.isBestSeller).map(enrichProduct); }
export function getTrending() { return products.filter((p) => p.isTrending).map(enrichProduct); }
export function getTikTokViral() { return products.filter((p) => p.isTikTokViral).map(enrichProduct); }
export function getFeatured() { return products.filter((p) => p.isFeatured).map(enrichProduct); }
export function getFlashSaleProducts() { return products.filter((p) => p.flashSaleEndsAt).map(enrichProduct); }
export function getReviewsForProduct(productId: string) {
  const matched = reviews.filter((r) => r.productId === productId);
  return matched.length > 0 ? matched : reviews.slice(0, 4);
}

export function validateCoupon(code: string, subtotal: number) {
  const coupon = coupons.find((c) => c.code.toUpperCase() === code.toUpperCase() && c.active);
  if (!coupon) return { valid: false, discount: 0, message: "كود غير صالح" };
  if (coupon.usedCount >= coupon.maxUses) return { valid: false, discount: 0, message: "منتهي" };
  if (subtotal < coupon.minOrder) return { valid: false, discount: 0, message: `الحد الأدنى ${coupon.minOrder} درهم` };
  const discount = coupon.type === "percentage" ? (subtotal * coupon.value) / 100 : coupon.value;
  return { valid: true, discount: Math.min(discount, subtotal) };
}

const ordersStore: Order[] = [];
export function createOrder(order: Order) { ordersStore.push(order); return order; }
export function getOrders() { return [...ordersStore]; }
export function getOrderById(id: string) { return ordersStore.find((o) => o.id === id); }
export function getOrderByNumber(num: string) { return ordersStore.find((o) => o.orderNumber === num); }

export const customers: Customer[] = [
  { id: "c1", firstName: "سارة", lastName: "المنصوري", email: "sara@email.ma", phone: "+212612345678", city: "الدار البيضاء", totalOrders: 5, totalSpent: 890, createdAt: "2025-11-01" },
];
