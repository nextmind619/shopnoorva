import type { Product, ProductReview, FAQ, Testimonial, InstagramPost, Coupon, Order, Customer } from "@/types";
import { enrichProduct } from "@/lib/product-images/enrich-products";
import { resolveProductImage } from "@/lib/product-images/resolve";

const flashEnd = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString();

const L = (ar: string, fr: string, en: string) => ({ ar, fr, en });

/** Extra categories (Galaxy Lights, Home Decor, Bedroom Lighting, Kids Room, Relaxation, Gift Ideas)
 *  are populated by tag match in addition to the product's primary categoryId. */
const CATEGORY_TAG_MAP: Record<string, string[]> = {
  "cat-galaxy-lights": ["galaxy", "aurora", "laser", "star"],
  "cat-home-decor": ["decor", "cooler", "fan", "desk"],
  "cat-bedroom-lighting": ["bedroom"],
  "cat-kids-room": ["kids"],
  "cat-relaxation": ["relaxation"],
  "cat-gift-ideas": ["gift"],
};

export const products: Product[] = [
  {
    id: "prod-shiatsu",
    slug: "shiatsu-neck-shoulder-massager",
    name: L(
      "جهاز تدليك الرقبة والكتفين شياتسو 3D مع تدفئة (محاكاة اليد)",
      "Appareil de Massage Shiatsu 3D Cou & Épaules avec Chauffage (Simulation Main)",
      "3D Shiatsu Neck & Shoulder Massager with Heat (Hand Simulation)"
    ),
    shortDescription: L(
      "تدليك شياتسو 3D محاكاة اليد مع تدفئة مدمجة — فكّ آلام الرقبة والكتفين في دقائق · توصيل مجاني والدفع عند الاستلام",
      "Massage Shiatsu 3D simulation main avec chauffage — soulage cou et épaules en minutes · livraison gratuite et COD",
      "3D hand-simulation Shiatsu with built-in heat — relieve neck & shoulders in minutes · free shipping and COD"
    ),
    description: L(
      "جهاز تدليك الرقبة والكتفين من NOORVA بتقنية شياتسو 3D محاكاة اليد: 8 عقد سيليكون غذائي (4 لكل جهة) كتعجن العضلات بحركة الأصابع. جسم ABS أخضر غابة، أحزمة جلد PU بني محبّب قابلة للتعديل، ولوحة تحكم سوداء (تشغيل + تدفئة). مناسب للرقبة والأكتاف والظهر والخصر والأرجل. دوران تلقائي، صامت، خفيف وسهل الحمل. التوصيل مجاني لجميع مدن المغرب مع الدفع عند الاستلام.",
      "Masseur cou & épaules NOORVA en Shiatsu 3D simulation main : 8 nœuds silicone alimentaire (4 par côté). Coque ABS vert forêt, sangles cuir PU brun grainé réglables, panneau noir (marche + chauffage). Cou, épaules, dos, taille, jambes. Rotation auto, silencieux, portable. Livraison gratuite au Maroc, paiement à la livraison.",
      "NOORVA neck & shoulder massager with 3D hand-simulation Shiatsu: 8 food-grade silicone nodes (4 per side). Forest-green ABS body, adjustable brown pebbled PU leather straps, black control panel (power + heat). For neck, shoulders, back, waist, legs. Auto-rotation, quiet, portable. Free Morocco shipping with cash on delivery."
    ),
    categoryId: "cat-relaxation",
    price: 299,
    compareAtPrice: 399,
    sku: "NRV-SHIATSU-01",
    stock: 47,
    rating: 4.9,
    reviewCount: 487,
    soldCount: 2140,
    isBestSeller: true,
    isTrending: true,
    isTikTokViral: true,
    isFeatured: true,
    flashSaleEndsAt: flashEnd,
    warrantyMonths: 12,
    problemEmoji: "💆",
    problem: L(
      "رقبتك وكتافك كايوجعوك بعد يوم طويل؟",
      "Cou et épaules douloureux après une longue journée?",
      "Neck and shoulders aching after a long day?"
    ),
    problemCause: L(
      "الجلوس الطويل والتوتر اليومي كيسبّبو تقلّص العضلات وآلام مزمنة",
      "La position assise prolongée et le stress quotidien provoquent tensions et douleurs",
      "Prolonged sitting and daily stress cause muscle tension and chronic pain"
    ),
    problemSolution: L(
      "تدليك شياتسو 3D محاكاة اليد + تدفئة مدمجة في دقائق",
      "Massage Shiatsu 3D simulation main + chauffage intégré en quelques minutes",
      "3D hand-simulation Shiatsu + built-in heat in minutes"
    ),
    deepDescription: L(
      "مساج شياتسو 3D بمحاكاة أصابع اليد: 8 عقد سيليكون، تدفئة مدمجة، دوران تلقائي وسانات قابلة للتعديل. يخفّف آلام الرقبة والأكتاف والظهر والخصر والأرجل، يحسّن الدورة الدموية ويوفّر استرخاء يومي فاخر في المنزل — بلا موعد في الصالون.",
      "Masseur Shiatsu 3D type doigts : 8 nœuds silicone, chauffage, rotation auto et sangles réglables. Soulage cou, épaules, dos, taille et jambes, améliore la circulation et offre une détente premium à la maison.",
      "3D finger-simulation Shiatsu: 8 silicone nodes, heat, auto-rotation and adjustable straps. Relieves neck, shoulders, back, waist and legs, improves circulation and delivers premium daily wellness at home."
    ),
    tags: ["shiatsu", "massage", "relaxation", "gift", "wellness", "bestseller", "neck", "shoulder", "heat", "new"],
    benefits: [
      L("استرخاء عميق في دقائق بعد يوم شاق", "Détente profonde en quelques minutes après une journée intense", "Deep relaxation in minutes after a long day"),
      L("تخفيف آلام الرقبة والكتفين والظهر والخصر", "Soulage cou, épaules, dos et taille", "Relieves neck, shoulder, back and waist pain"),
      L("تقليل التوتر والإجهاد اليومي", "Réduit le stress et la tension quotidienne", "Reduces daily stress and tension"),
      L("تحسين الدورة الدموية بفضل التدفئة المدمجة", "Améliore la circulation grâce au chauffage intégré", "Improves circulation with built-in heat"),
      L("راحة يومية في المنزل بلا موعد في الصالون", "Confort quotidien à la maison sans rendez-vous au spa", "Daily comfort at home without a spa appointment"),
      L("هدية فاخرة مثالية للوالدين والشركاء", "Cadeau premium idéal pour parents et proches", "Premium gift ideal for parents and loved ones"),
    ],
    features: [
      L("تدليك شياتسو 3D محاكاة اليد", "Massage Shiatsu 3D simulation main", "3D Hand-Simulation Shiatsu Massage"),
      L("تدفئة مدمجة", "Chauffage intégré", "Built-in Heating"),
      L("دوران تلقائي", "Rotation automatique", "Automatic Rotation"),
      L("سانات/أحزمة قابلة للتعديل", "Sangles réglables", "Adjustable Straps"),
      L("سهل الحمل", "Facile à transporter", "Easy to Carry"),
      L("صامت", "Silencieux", "Quiet Operation"),
      L("مريح", "Confortable", "Comfortable Fit"),
      L("جودة فاخرة", "Qualité Premium", "Premium Quality"),
    ],
    specifications: [
      { label: L("اللون", "Couleur", "Color"), value: L("أخضر", "Vert", "Green") },
      { label: L("المادة", "Matériau", "Material"), value: L("ABS + جلد PU", "ABS + Cuir PU", "ABS + PU Leather") },
      { label: L("نوع التدليك", "Massage", "Massage"), value: L("شياتسو 3D", "Shiatsu 3D", "Shiatsu 3D") },
      { label: L("التدفئة", "Chauffage", "Heating"), value: L("نعم", "Oui", "Yes") },
      { label: L("الطاقة", "Alimentation", "Power"), value: L("كهربائي", "Électrique", "Electric") },
      {
        label: L("الاستخدام", "Utilisation", "Usage"),
        value: L(
          "رقبة / أكتاف / ظهر / خصر / أرجل",
          "Cou / Épaules / Dos / Taille / Jambes",
          "Neck / Shoulders / Back / Waist / Legs"
        ),
      },
      { label: L("الضمان", "Garantie", "Warranty"), value: L("12 شهر", "12 mois", "12 months") },
    ],
    packageIncludes: [
      L("جهاز تدليك الرقبة والكتفين شياتسو 3D مع تدفئة", "Appareil de massage Shiatsu 3D cou & épaules avec chauffage", "3D Shiatsu neck & shoulder massager with heat"),
      L("محول طاقة", "Adaptateur secteur", "Power adapter"),
      L("دليل الاستخدام", "Manuel d'utilisation", "User manual"),
    ],
    howToUse: L(
      "حط الجهاز حول الرقبة أو على المنطقة المراد تدليكها، اضبط السانات، شغّل التدليك من اللوحة السوداء وفعّل التدفئة حسب الرغبة. استرخِ 10–15 دقيقة. مناسب أيضًا للظهر والخصر والأرجل.",
      "Placez l'appareil autour du cou ou sur la zone à masser, ajustez les sangles, lancez le massage et activez le chauffage si besoin. Détendez-vous 10 à 15 minutes. Aussi pour dos, taille et jambes.",
      "Place the device around your neck or on the target area, adjust the straps, start the massage from the black panel and enable heat if desired. Relax 10–15 minutes. Also for back, waist and legs."
    ),
    lifestyleScenes: [
      {
        id: "office",
        emoji: "💼",
        title: L("بعد المكتب", "Après le bureau", "After Work"),
        description: L("فُكّ تقلّص الكتفين بعد يوم جالس", "Dénouez les épaules après une journée assise", "Release shoulder tension after a sitting day"),
      },
      {
        id: "evening",
        emoji: "🌙",
        title: L("استرخاء مسائي", "Détente du soir", "Evening Wind-Down"),
        description: L("طقوس عافية قبل النوم", "Rituel bien-être avant de dormir", "Wellness ritual before sleep"),
      },
      {
        id: "gift",
        emoji: "🎁",
        title: L("هدية فاخرة", "Cadeau premium", "Premium Gift"),
        description: L("هدية مثالية للوالدين والشركاء", "Cadeau idéal pour parents et proches", "Ideal gift for parents and loved ones"),
      },
      {
        id: "travel",
        emoji: "✈️",
        title: L("سهل الحمل", "Facile à emporter", "Travel-Friendly"),
        description: L("خذه معك في السفر والعمل", "Emportez-le en voyage ou au travail", "Take it on trips or to the office"),
      },
    ],
    images: [],
    lifestyleImages: [],
    variants: [
      {
        id: "var-shiatsu",
        name: L("أخضر", "Vert", "Green"),
        price: 299,
        compareAtPrice: 399,
        sku: "NRV-SHIATSU-01",
        stock: 47,
      },
    ],
    upsellIds: ["prod-mx003", "prod-aurora"],
    crossSellIds: ["prod-rabbit", "prod-starbt"],
    seo: {
      title: L(
        "جهاز تدليك الرقبة والكتفين شياتسو 3D مع تدفئة | 299 درهم | NOORVA المغرب",
        "Appareil de Massage Shiatsu 3D Cou et Épaules | 299 MAD | NOORVA Maroc",
        "3D Shiatsu Neck & Shoulder Massager with Heat | 299 MAD | NOORVA Morocco"
      ),
      description: L(
        "جهاز تدليك شياتسو 3D محاكاة اليد مع تدفئة بـ 299 درهم بدل 399. يخفّف آلام الرقبة والكتفين. توصيل مجاني والدفع عند الاستلام في المغرب.",
        "Masseur Shiatsu 3D simulation main avec chauffage à 299 MAD au lieu de 399. Soulage cervicales et épaules. Livraison gratuite et paiement à la livraison au Maroc.",
        "3D hand-simulation Shiatsu with heat for 299 MAD instead of 399. Relieves neck and shoulders. Free shipping and cash on delivery in Morocco."
      ),
    },
  },

  {
    id: "prod-mx003",
    slug: "astronaut-bt-speaker-projector",
    name: L("بروجيكتور رائد الفضاء بلوتوث MX003", "Projecteur Astronaute Bluetooth MX003", "Astronaut Bluetooth Speaker Projector MX003"),
    shortDescription: L(
      "حوّل غرفتك لمجرة حية مع موسيقى بلوتوث — ريموت + Type-C والدفع عند الاستلام",
      "Transformez votre chambre en galaxie avec Bluetooth — télécommande + Type-C, paiement à la livraison",
      "Turn your room into a galaxy with Bluetooth music — remote + USB-C, cash on delivery"
    ),
    description: L(
      "بروجيكتور رائد الفضاء MX003 من NOORVA — بروجيكتور مجرة مع سبيكر بلوتوث 5.0 مدمج في الصدر. تصميم رائد فضاء أبيض أنيق، عدسة HD تعرض نجوم وسديم بألوان متعددة على السقف والجدران. يدعم بطاقة TF وكابل AUX لتشغيل الموسيقى، مع مايكروفون مدمج للمكالمات. ريموت تحكم أسود وكابل Type-C. الدفع عند الاستلام في جميع مدن المغرب.",
      "Projecteur astronaute MX003 NOORVA — galaxie + haut-parleur Bluetooth 5.0 intégré dans la poitrine. Design astronaute blanc élégant, lentille HD projetant étoiles et nébuleuses multicolores. Carte TF et AUX, micro intégré. Télécommande noire, câble Type-C. Paiement à la livraison au Maroc.",
      "NOORVA MX003 astronaut projector — galaxy effect with a built-in Bluetooth 5.0 chest speaker. Elegant white astronaut design, HD lens projecting multicolor stars and nebula on ceiling and walls. TF card and AUX playback, built-in mic. Black remote, USB-C cable. Cash on delivery."
    ),
    categoryId: "cat-projectors",
    price: 189,
    compareAtPrice: 259,
    sku: "NRV-MX003-01",
    stock: 90,
    rating: 4.8,
    reviewCount: 356,
    soldCount: 2480,
    isBestSeller: true,
    isTrending: true,
    isTikTokViral: true,
    isFeatured: true,
    flashSaleEndsAt: flashEnd,
    warrantyMonths: 12,
    problemEmoji: "🚀",
    problem: L("غرفتك مظلمة ومملة؟", "Chambre sombre et ennuyeuse?", "Room feels dull?"),
    problemCause: L("الإضاءة العادية ما كتعطيش موسيقى ولا أجواء مجرة حقيقية", "L'éclairage classique n'a ni musique ni vraie galaxie", "Regular lights have no music and no real galaxy effect"),
    problemSolution: L("رائد فضاء MX003 + سبيكر بلوتوث + مجرة من الخوذة", "Astronaute MX003 + Bluetooth + galaxie", "Astronaut MX003 + Bluetooth speaker + galaxy"),
    deepDescription: L(
      "بروجيكتور + سبيكر بلوتوث 5.0 في الصدر (موديل MXS003). رائد فضاء أبيض أنيق بعدسة HD تعرض مجرة ونجوم. يدعم بطاقة TF وAUX ومايكروفون مدمج. الأكثر طلبًا على تيك توك.",
      "Projecteur + Bluetooth poitrine (MXS003). Astronaute blanc élégant, lentille HD galaxie. Carte TF, AUX, micro intégré.",
      "Projector + chest Bluetooth speaker (MXS003). Elegant white astronaut, HD galaxy lens. TF card, AUX, built-in mic. Top TikTok seller."
    ),
    tags: ["astronaut", "bluetooth", "galaxy", "speaker", "bestseller", "tiktok", "kids", "bedroom", "decor", "gift"],
    benefits: [
      L("سقفك يتحوّل لمجرة ملونة من أول تشغيل", "Plafond transformé en galaxie dès l'allumage", "Ceiling becomes a colorful galaxy instantly"),
      L("شغّل موسيقاك من الهاتف عبر البلوتوث بلا أسلاك", "Musique Bluetooth sans fil depuis le téléphone", "Play phone music wirelessly via Bluetooth"),
      L("أجواء تهدّئ قبل النوم للكبار والأطفال", "Ambiance apaisante avant le sommeil", "Calming bedtime atmosphere for adults and kids"),
      L("تحكم كامل من السرير بالريموت", "Contrôle total depuis le lit", "Full control from bed with the remote"),
      L("تصميم أنيق يزيّن الغرفة حتى وهو مطفي", "Design élégant même éteint", "Elegant look even when powered off"),
      L("هدية جاهزة تُبهر من فتح العلبة", "Cadeau prêt à offrir", "Gift-ready unboxing wow moment"),
    ],
    features: [
      L("سبيكر بلوتوث 5.0 مدمج", "Haut-parleur Bluetooth 5.0", "Built-in Bluetooth 5.0 speaker"),
      L("عدسة HD لإسقاط المجرة والنجوم", "Lentille HD galaxie et étoiles", "HD galaxy & star lens"),
      L("دعم بطاقة TF وكابل AUX", "Carte TF et câble AUX", "TF card and AUX support"),
      L("مايكروفون مدمج", "Micro intégré", "Built-in microphone"),
      L("ريموت تحكم أسود", "Télécommande noire", "Black remote control"),
      L("تصميم رائد فضاء أنيق", "Design astronaute élégant", "Elegant astronaut design"),
      L("شحن USB Type-C", "Charge USB Type-C", "USB Type-C charging"),
    ],
    specifications: [
      { label: L("الموديل", "Modèle", "Model"), value: L("MXS003", "MXS003", "MXS003") },
      { label: L("اللون", "Couleur", "Color"), value: L("أبيض", "Blanc", "White") },
      { label: L("البلوتوث", "Bluetooth", "Bluetooth"), value: L("5.0 + سبيكر مدمج", "5.0 + haut-parleur", "5.0 + built-in speaker") },
      { label: L("قوة الصوت", "Puissance audio", "Output Power"), value: L("0-5 واط", "0-5 W", "0-5 W") },
      { label: L("الطاقة", "Alimentation", "Power"), value: L("USB Type-C", "USB Type-C", "USB Type-C") },
      { label: L("التحكم", "Contrôle", "Control"), value: L("ريموت + بلوتوث", "Télécommande + Bluetooth", "Remote + Bluetooth") },
      { label: L("الأبعاد", "Dimensions", "Dimensions"), value: L("16×10×10 سم", "16×10×10 cm", "16×10×10 cm") },
      { label: L("الوزن", "Poids", "Weight"), value: L("600 غ", "600 g", "600 g") },
      { label: L("الضمان", "Garantie", "Warranty"), value: L("12 شهر", "12 mois", "12 months") },
    ],
    packageIncludes: [
      L("بروجيكتور رائد الفضاء MX003", "Projecteur astronaute MX003", "Astronaut MX003 projector"),
      L("ريموت تحكم", "Télécommande", "Remote control"),
      L("كابل Type-C", "Câble Type-C", "Type-C cable"),
      L("دليل الاستخدام", "Manuel", "User manual"),
    ],
    howToUse: L(
      "أزل الغلاف البلاستيكي، ضع الجهاز على سطح ثابت، شغّله في غرفة مظلمة وربطه بالبلوتوث للاستمتاع بالمجرة والموسيقى.",
      "Retirez le film protecteur, placez sur surface stable, allumez et connectez en Bluetooth.",
      "Remove protective film, place on stable surface, power on and pair via Bluetooth."
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
    variants: [{ id: "var-mx003", name: L("أبيض", "Blanc", "White"), price: 189, compareAtPrice: 259, sku: "NRV-MX003-01", stock: 90 }],
    upsellIds: ["prod-aurora", "prod-starbt", "prod-laser303"],
    crossSellIds: ["prod-rabbit"],
    seo: {
      title: L("بروجيكتور رائد الفضاء بلوتوث MX003 | NOORVA", "Projecteur Astronaute Bluetooth MX003 | NOORVA", "Astronaut Bluetooth Speaker Projector MX003 | NOORVA"),
      description: L("بروجيكتور رائد الفضاء بلوتوث + سبيكر مدمج + مجرة HD — الدفع عند الاستلام", "Projecteur astronaute Bluetooth + galaxie HD — COD", "Astronaut Bluetooth projector + HD galaxy — COD"),
    },
  },
  {
    id: "prod-starbt",
    slug: "bluetooth-star-projector",
    name: L(
      "بروجيكتور المجرة والنجوم متعدد الألوان بسبيكر وريموت",
      "Projecteur Galaxie Multicolore avec Haut-parleur et Télécommande",
      "Multi-Color Galaxy Star Projector Night Light with Speaker & Remote"
    ),
    shortDescription: L(
      "حوّل غرفتك لمجرة بـ21 وضع إضاءة وموسيقى بلوتوث — ريموت بمؤقت والدفع عند الاستلام",
      "Transformez votre chambre avec 21 modes et Bluetooth — télécommande avec minuterie, paiement à la livraison",
      "Turn your room into a galaxy with 21 modes and Bluetooth music — timer remote, cash on delivery"
    ),
    description: L(
      "بروجيكتور مجرة ونجوم من NOORVA بجسم أسود مطفي وقبة شفافة متعددة الأوجه. يعرض سماء مرصّعة بالنجوم مع موجات ضوئية ملوّنة حتى 21 وضع إسقاط (أحمر/أخضر/أزرق/أبيض وتركيبات). سبيكر بلوتوث مدمج — وصّل هاتفك أو USB/TF واستمتع بالموسيقى مع إضاءة تتفاعل مع الإيقاع. ريموت للتحكم في الألوان، السطوع، الموسيقى، ومؤقت الإيقاف التلقائي 1 ساعة أو 2 ساعة. مثالي لغرفة النوم، الأطفال، الحفلات، والديكور الرومانسي. الدفع عند الاستلام في المغرب.",
      "Projecteur galaxie NOORVA, corps noir mat et dôme cristal facetté. Ciel étoilé + vagues colorées jusqu’à 21 modes (R/G/B/W). Haut-parleur Bluetooth, USB/TF, télécommande avec minuterie 1h/2h. Idéal chambre, enfants, soirées. Paiement à la livraison au Maroc.",
      "NOORVA galaxy star projector with matte black body and faceted crystal dome. Starry sky plus colorful wave lighting up to 21 modes (R/G/B/W). Built-in Bluetooth speaker, USB/TF playback, remote with 1h/2h auto-off. Perfect for bedrooms, kids rooms, parties. Cash on delivery in Morocco."
    ),
    categoryId: "cat-projectors",
    price: 169,
    compareAtPrice: 219,
    sku: "NRV-STARBT-01",
    stock: 75,
    rating: 4.8,
    reviewCount: 186,
    soldCount: 1520,
    isBestSeller: true,
    isTrending: true,
    isTikTokViral: true,
    isFeatured: true,
    flashSaleEndsAt: flashEnd,
    warrantyMonths: 12,
    problemEmoji: "🌌",
    problem: L("بغيت غرفة بأجواء مجرة حقيقية؟", "Envie d’une vraie ambiance galaxie?", "Want a real galaxy room vibe?"),
    problemCause: L("الإضاءة العادية ما كتحوّلش الغرفة وما عندهاش موسيقى ولا تحكم سهل", "La lumière classique ne transforme pas la pièce et n’a ni musique ni contrôle facile", "Normal lights don’t transform a room and lack music or easy control"),
    problemSolution: L("21 وضع إضاءة + سبيكر بلوتوث + ريموت بمؤقت", "21 modes + Bluetooth + télécommande avec minuterie", "21 light modes + Bluetooth speaker + timed remote"),
    deepDescription: L(
      "جسم ABS أسود مطفي بقبة كريستال شفافة. إسقاط نجوم وموجات ضوئية متعددة الألوان حتى 21 وضعاً. سبيكر بلوتوث، منافذ USB وTF، مدخل طاقة DC 5V (6W)، ريموت ببطاريات AAA (غير مشمولة) ومؤقت 1س/2س. الأبعاد تقريباً 13.5×13.5×10 سم. قابل للتعتيم.",
      "Corps ABS noir mat, dôme cristal. Jusqu’à 21 modes d’éclairage. Bluetooth, USB/TF, DC 5V 6W, télécommande (piles AAA non incluses), minuterie 1h/2h. Taille ≈13,5×13,5×10 cm. Intensité réglable.",
      "Matte black ABS body with transparent faceted crystal dome. Up to 21 lighting modes. Bluetooth speaker, USB/TF, DC 5V 6W, remote (2×AAA not included), 1h/2h timer. Approx. 13.5×13.5×10 cm. Dimmable."
    ),
    tags: ["star", "galaxy", "bluetooth", "speaker", "remote", "timer", "rgb", "night-light", "bedroom", "kids", "gift", "dimmable"],
    benefits: [
      L("غيّر مزاج الغرفة فوراً حتى 21 وضع إضاءة", "Changez l'ambiance avec jusqu'à 21 modes", "Change the room mood with up to 21 lighting modes"),
      L("موسيقى من هاتفك عبر البلوتوث بلا أسلاك", "Musique Bluetooth sans fil", "Wireless Bluetooth music from your phone"),
      L("نعس مرتاح مع مؤقت إيقاف 1س أو 2س", "Endormez-vous avec minuterie 1h/2h", "Fall asleep with 1h/2h auto-off timer"),
      L("قبة كريستال وإسقاط نجوم يبان فاخر", "Dôme cristal et projection premium", "Crystal dome with premium star projection"),
    ],
    features: [
      L("إسقاط نجوم وموجات ضوئية متعددة الألوان", "Projection étoiles + vagues multicolores", "Star projection + multicolor wave lighting"),
      L("ألوان LED: أحمر / أخضر / أزرق / أبيض", "LED R/G/B/W", "LED colors: Red / Green / Blue / White"),
      L("بلوتوث + USB + بطاقة TF للموسيقى", "Bluetooth + USB + carte TF", "Bluetooth + USB + TF card music"),
      L("ريموت تحكم + تعتيم + مؤقت إيقاف", "Télécommande + intensité + minuterie", "Remote + dimming + auto-off timer"),
    ],
    specifications: [
      { label: L("التصميم", "Design", "Design"), value: L("جسم أسود صحني + قبة كريستال شفافة", "Corps noir + dôme cristal", "Black bowl body + transparent crystal dome") },
      { label: L("المادة", "Matériau", "Material"), value: L("بلاستيك ABS", "Plastique ABS", "ABS plastic") },
      { label: L("الأبعاد", "Dimensions", "Dimensions"), value: L("≈ 13.5 × 13.5 × 10 سم", "≈ 13,5 × 13,5 × 10 cm", "≈ 13.5 × 13.5 × 10 cm") },
      { label: L("الوزن", "Poids", "Weight"), value: L("≈ 0.2 كغ", "≈ 0,2 kg", "≈ 0.2 kg") },
      { label: L("الطاقة", "Alimentation", "Power"), value: L("USB · DC 5V · 6W", "USB · DC 5V · 6W", "USB · DC 5V · 6W") },
      { label: L("أوضاع الإضاءة", "Modes", "Light modes"), value: L("حتى 21 وضعاً", "Jusqu’à 21 modes", "Up to 21 modes") },
      { label: L("ألوان LED", "Couleurs LED", "LED colors"), value: L("أحمر / أخضر / أزرق / أبيض", "Rouge / Vert / Bleu / Blanc", "Red / Green / Blue / White") },
      { label: L("التعتيم", "Intensité", "Dimming"), value: L("نعم — قابل للتعتيم", "Oui — réglable", "Yes — dimmable") },
      { label: L("الصوت", "Audio", "Audio"), value: L("سبيكر بلوتوث + USB/TF", "Haut-parleur Bluetooth + USB/TF", "Bluetooth speaker + USB/TF") },
      { label: L("المؤقت", "Minuterie", "Timer"), value: L("1 ساعة / 2 ساعة", "1 h / 2 h", "1 hour / 2 hours") },
      { label: L("الريموت", "Télécommande", "Remote"), value: L("نعم — بطاريات 2×AAA غير مشمولة", "Oui — 2×AAA non incluses", "Yes — 2×AAA batteries not included") },
      { label: L("الضمان", "Garantie", "Warranty"), value: L("12 شهر", "12 mois", "12 months") },
    ],
    packageIncludes: [
      L("بروجيكتور المجرة والنجوم", "Projecteur galaxie", "Galaxy star projector"),
      L("ريموت تحكم عن بعد", "Télécommande", "Remote control"),
      L("كابل طاقة USB", "Câble USB", "USB power cable"),
      L("دليل الاستخدام", "Manuel", "User manual"),
    ],
    howToUse: L(
      "ضع الجهاز في غرفة مظلمة ووجّهه نحو السقف أو الجدار. وصّل الطاقة عبر USB (DC 5V). شغّل عبر المفتاح أو الريموت، اختر وضع الإضاءة والسطوع، وصِل هاتفك بالبلوتوث أو أدرج USB/TF للموسيقى، وفعّل المؤقت 1س أو 2س عند النوم.",
      "Pièce sombre, orienter vers le plafond. Brancher en USB DC 5V. Allumer via interrupteur ou télécommande, choisir mode/intensité, Bluetooth ou USB/TF pour la musique, minuterie 1h/2h.",
      "Place in a dark room aimed at the ceiling. Power via USB DC 5V. Use the switch or remote for modes/brightness, connect Bluetooth or USB/TF for music, set 1h/2h timer for sleep."
    ),
    images: [],
    lifestyleImages: [],
    lifestyleScenes: [
      { id: "bedroom", emoji: "🛏️", title: L("غرفة النوم", "Chambre", "Bedroom"), description: L("مجرة هادئة + مؤقت للنوم المريح", "Galaxie douce + minuterie sommeil", "Calm galaxy + sleep timer") },
      { id: "kids", emoji: "👶", title: L("غرفة الأطفال", "Enfants", "Kids Room"), description: L("إضاءة مهدّئة وموسيقى قبل النوم", "Lumière apaisante et musique", "Soothing light and bedtime music") },
      { id: "living", emoji: "🛋️", title: L("غرفة المعيشة", "Salon", "Living Room"), description: L("أجواء حفلات وموسيقى بلوتوث", "Ambiance soirée + Bluetooth", "Party vibe + Bluetooth music") },
      { id: "romantic", emoji: "💫", title: L("أمسية رومانسية", "Romantique", "Romantic"), description: L("ألوان ناعمة لتاريخ مثالي في الدار", "Couleurs douces pour une soirée à deux", "Soft colors for date night at home") },
    ],
    variants: [{ id: "var-starbt", name: L("أسود", "Noir", "Black"), price: 169, compareAtPrice: 219, sku: "NRV-STARBT-01", stock: 75 }],
    upsellIds: ["prod-mx003", "prod-aurora"],
    crossSellIds: ["prod-rabbit"],
    seo: {
      title: L(
        "بروجيكتور مجرة ونجوم بلوتوث 21 وضع | NOORVA المغرب",
        "Projecteur Galaxie Bluetooth 21 Modes | NOORVA Maroc",
        "Galaxy Star Projector Bluetooth 21 Modes | NOORVA Morocco"
      ),
      description: L(
        "بروجيكتور نجوم متعدد الألوان بسبيكر بلوتوث وريموت ومؤقت — 21 وضع إضاءة، USB DC 5V، الدفع عند الاستلام في المغرب",
        "Projecteur étoiles multicolore Bluetooth + télécommande + minuterie — 21 modes, USB DC 5V, COD Maroc",
        "Multi-color star galaxy projector with Bluetooth speaker, remote & timer — 21 modes, USB DC 5V, COD Morocco"
      ),
    },
  },
  {
    id: "prod-aurora",
    slug: "northern-lights-galaxy-projector",
    name: L(
      "بروجيكتور الأورورا الهندسي — غرفتك تصير مجرة",
      "Projecteur Aurore Géométrique Blanc Bluetooth",
      "White Geometric Dream Aurora Star Projector with Bluetooth"
    ),
    shortDescription: L(
      "أورورا متحركة + قمر هلالي ونجوم + سبيكر بلوتوث + ريموت بمؤقت — والدفع غير ملي يوصلك الطلب",
      "Aurore animée + lune et étoiles + Bluetooth + minuterie — paiement à la livraison",
      "Moving aurora + moon & stars + Bluetooth + timer remote — cash on delivery"
    ),
    description: L(
      "حوّل سقف غرفتك لمجرة حقيقية مع بروجيكتور الأورورا من NOORVA. جسم أبيض مطفي بتصميم هندسي أنيق وقبة شفافة كتعرض أورورا شمالية متحركة مع نجوم وقمر هلالي. وصّل هاتفك بالبلوتوث وعيش الأجواء مع موسيقاك، وتحكّم من الريموت الأبيض فالألوان والسطوع والسرعة ومؤقت الإيقاف 1 ساعة أو 2 ساعة. مثالي للنوم، الديكور، والهدايا. خلّص كاش عند الباب فجميع مدن المغرب.",
      "Projecteur Dream Aurora NOORVA, corps blanc mat géométrique facetté et dôme transparent. Aurores boréales animées, étoiles et lune. Haut-parleur Bluetooth, télécommande blanche avec minuterie 1h/2h. Idéal chambre et salon. Paiement à la livraison au Maroc.",
      "NOORVA Dream Aurora projector with matte white faceted geometric body and clear projection dome. Moving northern-lights aurora with stars and crescent moon. Built-in Bluetooth speaker, white remote with color/brightness/speed and 1h/2h timer. Perfect for bedroom and living room. Cash on delivery in Morocco."
    ),
    categoryId: "cat-projectors",
    price: 249,
    compareAtPrice: 279,
    sku: "NRV-AURORA-01",
    stock: 68,
    rating: 4.9,
    reviewCount: 268,
    soldCount: 1710,
    isBestSeller: true,
    isTrending: true,
    isTikTokViral: true,
    isFeatured: true,
    flashSaleEndsAt: flashEnd,
    warrantyMonths: 12,
    problemEmoji: "🌌",
    problem: L("بغيتي غرفة تبان سينمائية بلا ما تبدّل الديكور؟", "Envie d'une pièce cinématique sans changer la déco?", "Want a cinematic room without redecorating?"),
    problemCause: L("الضو العادي كيبان بارد وما كيعطي حتى إحساس بالاسترخاء", "La lumière classique reste froide et peu relaxante", "Ordinary light feels cold and rarely helps you unwind"),
    problemSolution: L("أورورا + قمر ونجوم + بلوتوث من الريموت", "Aurore + lune/étoiles + Bluetooth via télécommande", "Aurora + moon/stars + Bluetooth from the remote"),
    deepDescription: L(
      "جسم ABS أبيض هندسي متعدد الأوجه مع قبة شفافة وفتحتين علويتين للإسقاط. أورورا ملونة، نجوم، وقمر هلالي. سبيكر بلوتوث، ريموت أبيض بمؤقت 1س/2س، طاقة USB. الأبعاد ≈ 16 × 9 × 10.5 سم. اللون: أبيض.",
      "Corps ABS blanc géométrique facetté, dôme transparent. Aurore, étoiles, lune. Bluetooth, télécommande 1h/2h, USB. Dimensions ≈ 16 × 9 × 10,5 cm. Couleur: blanc.",
      "Matte white faceted ABS geometric body with clear dome and top apertures. Aurora, stars, crescent moon. Bluetooth speaker, white remote with 1h/2h timer, USB power. Dimensions from reference ≈ 16 × 9 × 10.5 cm. Color: white."
    ),
    tags: ["aurora", "northernlights", "moon", "stars", "bluetooth", "speaker", "remote", "timer", "geometric", "white", "bedroom", "gift"],
    benefits: [
      L("سقفك يتحوّل لأورورا متحركة حقيقية", "Plafond transformé en aurore animée", "Ceiling becomes a real moving aurora"),
      L("قمر هلالي ونجوم دقيقة تهدّئ قبل النوم", "Lune et étoiles apaisantes", "Crescent moon and stars for calm nights"),
      L("موسيقى بلوتوث وأنت مسترخٍ في السرير", "Musique Bluetooth depuis le lit", "Bluetooth music from bed"),
      L("تصميم أبيض هندسي يزيّن الغرفة حتى مطفي", "Design blanc élégant même éteint", "Elegant white design even when off"),
    ],
    features: [
      L("إسقاط أورورا شمالية متحركة", "Projection aurore boréale animée", "Moving northern-lights aurora projection"),
      L("نجوم + قمر هلالي", "Étoiles + lune croissant", "Stars + crescent moon"),
      L("بلوتوث وموسيقى", "Bluetooth et musique", "Bluetooth music playback"),
      L("ريموت أبيض + أزرار على الجهاز", "Télécommande blanche + boutons", "White remote + on-device buttons"),
    ],
    specifications: [
      { label: L("التصميم", "Design", "Design"), value: L("أبيض هندسي متعدد الأوجه + قبة شفافة", "Blanc géométrique facetté + dôme", "White faceted geometric + clear dome") },
      { label: L("اللون", "Couleur", "Color"), value: L("أبيض", "Blanc", "White") },
      { label: L("المادة", "Matériau", "Material"), value: L("بلاستيك ABS مطفي", "Plastique ABS mat", "Matte ABS plastic") },
      { label: L("الأبعاد", "Dimensions", "Dimensions"), value: L("≈ 16 × 9 × 10.5 سم", "≈ 16 × 9 × 10,5 cm", "≈ 16 × 9 × 10.5 cm") },
      { label: L("الطاقة", "Alimentation", "Power"), value: L("USB (كابل Type-C في العلبة)", "USB (câble Type-C inclus)", "USB (Type-C cable in box)") },
      { label: L("الإسقاط", "Projection", "Projection"), value: L("أورورا + نجوم + قمر", "Aurore + étoiles + lune", "Aurora + stars + moon") },
      { label: L("الألوان", "Couleurs", "Colors"), value: L("تركيبات RGBW متعددة", "Combinaisons RGBW multiples", "Multiple RGBW combinations") },
      { label: L("الصوت", "Audio", "Audio"), value: L("سبيكر بلوتوث مدمج", "Haut-parleur Bluetooth", "Built-in Bluetooth speaker") },
      { label: L("المؤقت", "Minuterie", "Timer"), value: L("1 ساعة / 2 ساعة (على الريموت)", "1 h / 2 h (télécommande)", "1 hour / 2 hours (on remote)") },
      { label: L("التحكم", "Contrôle", "Control"), value: L("ريموت أبيض + أزرار الجهاز", "Télécommande + boutons", "White remote + device buttons") },
      { label: L("الضمان", "Garantie", "Warranty"), value: L("12 شهر", "12 mois", "12 months") },
    ],
    packageIncludes: [
      L("بروجيكتور الأورورا الأبيض الهندسي", "Projecteur aurore géométrique blanc", "White geometric aurora projector"),
      L("ريموت تحكم أبيض", "Télécommande blanche", "White remote control"),
      L("كابل USB / Type-C", "Câble USB / Type-C", "USB / Type-C cable"),
      L("دليل الاستخدام", "Manuel", "User manual"),
    ],
    howToUse: L(
      "ضع الجهاز في غرفة مظلمة ووجّهه نحو السقف. وصّل الطاقة عبر USB. شغّل من الأزرار أو الريموت الأبيض، اختر لون الأورورا والسطوع، وصِل هاتفك بالبلوتوث للموسيقى، وفعّل المؤقت 1س أو 2س عند النوم.",
      "Pièce sombre, orienter vers le plafond. Brancher en USB. Allumer via boutons ou télécommande, choisir aurore/intensité, Bluetooth pour la musique, minuterie 1h/2h.",
      "Place in a dark room aimed at the ceiling. Power via USB. Use buttons or white remote for aurora/brightness, connect Bluetooth for music, set 1h/2h timer for sleep."
    ),
    images: [],
    lifestyleImages: [],
    lifestyleScenes: [
      { id: "bedroom", emoji: "🛏️", title: L("غرفة النوم", "Chambre", "Bedroom"), description: L("أورورا وقمر هادئان قبل النوم", "Aurore et lune apaisantes", "Calm aurora and moon before sleep") },
      { id: "living", emoji: "🛋️", title: L("غرفة المعيشة", "Salon", "Living Room"), description: L("مجرة كاملة مع موسيقى بلوتوث", "Galaxie immersive + Bluetooth", "Immersive galaxy + Bluetooth music") },
      { id: "romantic", emoji: "💫", title: L("أجواء رومانسية", "Romantique", "Romantic"), description: L("ألوان ناعمة وقمر هلالي", "Couleurs douces et lune", "Soft colors and crescent moon") },
      { id: "gift", emoji: "🎁", title: L("هدية مثالية", "Cadeau", "Gift"), description: L("هدية أصلية لعشاق الديكور", "Cadeau original déco", "Original gift for décor lovers") },
    ],
    variants: [{ id: "var-aurora", name: L("أبيض", "Blanc", "White"), price: 249, compareAtPrice: 279, sku: "NRV-AURORA-01", stock: 68 }],
    upsellIds: ["prod-mx003", "prod-starbt"],
    crossSellIds: ["prod-rabbit"],
    seo: {
      title: L(
        "بروجيكتور الأورورا الهندسي الأبيض | بلوتوث وقمر ونجوم | NOORVA",
        "Projecteur Aurore Blanc Géométrique Bluetooth | NOORVA",
        "White Geometric Aurora Star Projector Bluetooth + Moon | NOORVA"
      ),
      description: L(
        "حوّل غرفتك لمجرة حقيقية: أورورا متحركة، قمر هلالي ونجوم، سبيكر بلوتوث وريموت بمؤقت. تصميم أبيض هندسي. الدفع عند الاستلام في المغرب.",
        "Transformez votre pièce: aurore animée, lune et étoiles, Bluetooth et minuterie. Design blanc géométrique. Paiement à la livraison au Maroc.",
        "Turn your room into a galaxy: moving aurora, moon and stars, Bluetooth speaker and timer remote. White geometric design. Cash on delivery in Morocco."
      ),
    },
  },
  {
    id: "prod-rabbit",
    slug: "rabbit-carousel-night-light",
    name: L(
      "كاروسيل الأرانب الوردي — 6 أفلام إسقاط ودوران 360°",
      "Veilleuse Carrousel Lapin — 6 films et rotation 360°",
      "Pink Rabbit Carousel Night Light — 6 Films and 360° Rotation"
    ),
    shortDescription: L(
      "خلي طفلك ينعس بهدوء: أرانب دوّارة + 6 أفلام إسقاط + 5 ألوان — والدفع عند الاستلام",
      "Endormissement serein: carrousel + 6 films + 5 couleurs — paiement à la livraison",
      "Calm bedtime: rotating bunnies + 6 films + 5 colours — cash on delivery"
    ),
    description: L(
      "خلّي غرفة طفلك تتحول لعالم سحري كل ليلة. كاروسيل الأرانب الوردي من NOORVA: أرانب صغيرة دوّارة 360°، إضاءة LED بـ 5 ألوان، و6 أفلام إسقاط قابلة للتبديل (سماء نجوم، عالم المحيط، أرض الديناصورات، عيد ميلاد سعيد، خيال تحت الماء، وغابة الحيوانات). شغّليه عبر USB من الشاحن أو باور بانك أو اللابتوب. هدية أنيقة لغرفة الأطفال — خلّصي كاش عند الباب فجميع مدن المغرب.",
      "Veilleuse carrousel lapin rose NOORVA: figurines rotatives 360°, LED 5 couleurs, 6 films interchangeables (ciel étoilé, océan, dinosaures, anniversaire, sous-marin, forêt). Alimentation USB (adaptateur, power bank ou ordinateur). Cadeau chambre enfant. Paiement à la livraison au Maroc.",
      "NOORVA pink rabbit carousel night light: 360° rotating bunny figurines, 5 LED colour modes, and 6 interchangeable projection films (Starry Sky, Ocean World, Dinosaur Land, Happy Birthday, Underwater Fantasy, Animal Forest). USB powered via adaptor, power bank, or laptop. Perfect kids gift. Cash on delivery in Morocco."
    ),
    categoryId: "cat-nightlights",
    price: 249,
    compareAtPrice: 349,
    sku: "NRV-RABBIT-01",
    stock: 110,
    rating: 4.9,
    reviewCount: 389,
    soldCount: 2210,
    isBestSeller: true,
    isTrending: true,
    isTikTokViral: true,
    isFeatured: true,
    flashSaleEndsAt: flashEnd,
    warrantyMonths: 12,
    problemEmoji: "🐰",
    problem: L("بغيتي طفلك ينعس بهدوء بلا خوف من الظلام؟", "Envie que votre enfant s'endorme sans peur du noir?", "Want your child to fall asleep calmly without fear of the dark?"),
    problemCause: L("الضو القاسي أو الغرفة المظلمة كيزيدو القلق قبل النوم", "Lumière dure ou pièce noire = anxiété au coucher", "Harsh light or a dark room raises bedtime anxiety"),
    problemSolution: L("كاروسيل دوّار + 6 أفلام إسقاط + 5 ألوان ناعمة", "Carrousel + 6 films + 5 couleurs douces", "Rotating carousel + 6 films + 5 soft colours"),
    deepDescription: L(
      "مصباح كاروسيل وردي بثيم الأرانب: سقف مموّج، أرانب على قاعدة دوّارة، أسطوانة إسقاط، وتشغيل USB. 6 أقراص أفلام قابلة للتبديل و5 أوضاع ألوان. تعديل السطوع ووضع الدوران ووضع الإسقاط. بلاستيك، LED 5 واط، موديل WHE11.",
      "Veilleuse carrousel rose thème lapin: toit festonné, lapins rotatifs, cylindre de projection, alimentation USB. 6 films interchangeables, 5 modes couleur, réglage luminosité, rotation et projection. Plastique, LED 5W, modèle WHE11.",
      "Pink rabbit-theme carousel lamp: scalloped canopy, spinning bunny figurines, projection cylinder, USB power. 6 interchangeable film discs, 5 colour modes, brightness adjustment, rotation and projection modes. Plastic enclosure, 5W LED, model WHE11."
    ),
    tags: ["carousel", "rabbit", "nightlight", "kids", "gift", "bedroom", "nursery", "projector", "usb", "films", "led"],
    benefits: [
      L("أرانب دوّارة 360° بأجواء سحرية", "Rotation carrousel 360°", "Magical 360° bunny carousel"),
      L("6 أفلام إسقاط قابلة للتبديل", "6 films interchangeables", "6 interchangeable projection films"),
      L("5 أوضاع ألوان LED قابلة للتخصيص", "5 modes couleur LED", "5 customisable LED colour modes"),
      L("تشغيل USB مرن (شاحن / باور بانك / لابتوب)", "Alimentation USB flexible", "Flexible USB power (adaptor / power bank / laptop)"),
      L("تعديل السطوع + وضع دوران + وضع إسقاط", "Luminosité + rotation + projection", "Brightness + rotation + projection modes"),
      L("تصميم وردي أنيق — هدية لغرفة الأطفال", "Design rose premium", "Elegant pink design — perfect kids gift"),
    ],
    features: [
      L("6 أفلام: سماء نجوم، محيط، ديناصورات، عيد ميلاد، تحت الماء، غابة حيوانات", "6 films: ciel, océan, dinosaures, anniversaire, sous-marin, forêt", "6 films: Starry Sky, Ocean, Dinosaurs, Birthday, Underwater, Animal Forest"),
      L("دوران كاروسيل 360° مع تماثيل أرانب", "Carrousel rotatif 360° avec lapins", "360° rotating carousel with rabbit figurines"),
      L("5 أوضاع ألوان لإضاءة مريحة", "5 modes couleur ambiance", "5 colour modes for soothing ambience"),
      L("تركيب سهل للأفلام: انزع الغطاء وبدّل القرص", "Changement de film simple", "Easy film swap: remove cover and replace disc"),
      L("تشغيل عبر USB — مكان مرن في الغرفة", "Fonctionnement USB", "USB operated — flexible room placement"),
      L("LED 5 واط · بلاستيك · لون وردي", "LED 5W · plastique · rose", "5W LED · plastic · pink"),
    ],
    specifications: [
      { label: L("الموديل", "Modèle", "Model"), value: L("WHE11", "WHE11", "WHE11") },
      { label: L("النوع", "Type", "Type"), value: L("مصباح ليلي بروجيكتور كاروسيل", "Veilleuse projecteur carrousel", "Baby night light projector") },
      { label: L("اللون", "Couleur", "Color"), value: L("وردي", "Rose", "Pink") },
      { label: L("المادة", "Matériau", "Material"), value: L("بلاستيك", "Plastique", "Plastic") },
      { label: L("مصدر الضوء", "Source lumineuse", "Light source"), value: L("LED", "LED", "LED") },
      { label: L("الاستطاعة", "Puissance", "Wattage"), value: L("5 واط", "5 W", "5 Watts") },
      { label: L("الطاقة", "Alimentation", "Power"), value: L("USB (كهربائي سلكي)", "USB (électrique)", "USB / Corded Electric") },
      { label: L("الأبعاد", "Dimensions", "Dimensions"), value: L("12 × 19 × 12 سم (عمق × عرض × ارتفاع)", "12 × 19 × 12 cm (P × L × H)", "12D × 19W × 12H cm") },
      { label: L("الوزن", "Poids", "Weight"), value: L("350 غ", "350 g", "350 Grams") },
      { label: L("الإسقاط", "Projection", "Projection"), value: L("6 أفلام قابلة للتبديل", "6 films interchangeables", "6 interchangeable film discs") },
      { label: L("الألوان", "Couleurs", "Colours"), value: L("5 أوضاع ألوان", "5 modes couleur", "5 colour modes") },
      { label: L("الوظائف", "Fonctions", "Features"), value: L("دوران · سطوع · ألوان متعددة · إسقاط", "Rotation · luminosité · multi-couleur · projection", "Rotation · Brightness · Multi-Color · Projection") },
      { label: L("الاستخدام", "Usage", "Usage"), value: L("داخلي", "Intérieur", "Indoor") },
      { label: L("الضمان", "Garantie", "Warranty"), value: L("12 شهر (متجر NOORVA)", "12 mois (boutique NOORVA)", "12 months (NOORVA store)") },
    ],
    packageIncludes: [
      L("مصباح كاروسيل الأرانب الوردي", "Veilleuse carrousel lapin rose", "Pink rabbit carousel night light"),
      L("6 أقراص أفلام إسقاط قابلة للتبديل", "6 disques de films interchangeables", "6 interchangeable projection film discs"),
      L("دليل الاستخدام", "Manuel d'utilisation", "User manual"),
      L("محتويات العلبة (4 عناصر حسب المواصفات)", "Contenu boîte (4 articles)", "Package contents (4 items per listing)"),
    ],
    howToUse: L(
      "وصّلي الجهاز عبر USB (شاحن أو باور بانك أو لابتوب)، ضعيه على سطح ثابت في غرفة هادئة، شغّلي الإضاءة واختاري اللون والسطوع، ولتغيير ثيم الإسقاط انزعي غطاء المصباح ودوّري كأس الإضاءة وبدّلي قرص الفيلم ثم أعيدي التركيب.",
      "Branchez en USB, placez sur surface stable, allumez et choisissez couleur/luminosité. Pour changer de thème: retirez le couvercle, ouvrez la coupelle et remplacez le film.",
      "Connect via USB, place on a stable surface, power on and choose colour/brightness. To change themes: remove the lamp cover, rotate open the lamp cup, swap the film disc, then reassemble."
    ),
    images: [],
    lifestyleImages: [],
    lifestyleScenes: [
      { id: "kids", emoji: "🧸", title: L("غرفة الأطفال", "Enfants", "Kids Room"), description: L("إسقاط ملوّن ودوران لطيف يساعد على الاسترخاء", "Projection colorée et rotation douce", "Colourful projection and gentle rotation for calm") },
      { id: "bedroom", emoji: "🛏️", title: L("غرفة النوم", "Chambre", "Bedroom"), description: L("5 ألوان ناعمة لأجواء قبل النوم", "5 couleurs douces avant le coucher", "5 soft colours for bedtime ambience") },
      { id: "gift", emoji: "🎁", title: L("هدية للأطفال", "Cadeau enfants", "Kids gift"), description: L("6 ثيمات إسقاط لعيد الميلاد وكل مناسبة", "6 thèmes pour chaque occasion", "6 projection themes for every occasion") },
      { id: "living", emoji: "🛋️", title: L("ديكور الغرفة", "Décor", "Room decor"), description: L("تصميم كاروسيل وردي يزيّن الطاولة", "Design carrousel rose décoratif", "Pink carousel design for tabletop decor") },
    ],
    variants: [{ id: "var-rabbit", name: L("وردي", "Rose", "Pink"), price: 249, compareAtPrice: 349, sku: "NRV-RABBIT-01", stock: 110 }],
    upsellIds: ["prod-mx003", "prod-aurora"],
    crossSellIds: ["prod-starbt"],
    seo: {
      title: L(
        "كاروسيل الأرانب الوردي | 6 أفلام إسقاط ودوران 360° | NOORVA",
        "Veilleuse Carrousel Lapin Rose | 6 films et 360° | NOORVA",
        "Pink Rabbit Carousel Night Light | 6 Films and 360° | NOORVA"
      ),
      description: L(
        "كاروسيل أرانب وردي: دوران 360°، 6 أفلام إسقاط، 5 ألوان LED، تشغيل USB. هدية مثالية لغرفة الأطفال. الدفع عند الاستلام في المغرب.",
        "Carrousel lapin rose: rotation 360°, 6 films, 5 couleurs LED, USB. Cadeau chambre enfant. Paiement à la livraison au Maroc.",
        "Pink rabbit carousel: 360° rotation, 6 projection films, 5 LED colours, USB powered. Perfect kids gift. Cash on delivery in Morocco."
      ),
    },
  },
  {
    id: "prod-laser303",
    slug: "green-laser-pointer-303",
    name: L(
      "ليزر أخضر 303 احترافي — قوي وقابل للشحن ومدى بعيد",
      "Pointeur Laser Vert 303 Premium — Puissant, Rechargeable & Longue Portée",
      "Premium Green Laser Pointer 303 — Powerful, Rechargeable & Long Range"
    ),
    shortDescription: L(
      "شعاع أخضر فائق القوة بمدى بعيد، جسم ألومنيوم فاخر، وبطارية 18650 قابلة للشحن — مثالي للفلك، التخييم، العروض المهنية. توصيل مجاني والدفع عند الاستلام في المغرب.",
      "Faisceau vert ultra-puissant à longue portée, corps aluminium premium, batterie 18650 rechargeable — idéal astronomie, camping et présentations. Livraison gratuite et paiement à la livraison au Maroc.",
      "Ultra-powerful long-range green beam, premium aluminum body, rechargeable 18650 battery — ideal for astronomy, camping and presentations. Free shipping and cash on delivery in Morocco."
    ),
    description: L(
      "ليزر أخضر 303 من NOORVA — أداة احترافية بجسم ألومنيوم أسود مطفي وقبضة مضلّعة مانعة للانزلاق. شعاع أخضر دقيق وواضح لمسافات طويلة، مثالي لرصد النجوم، التخييم، العروض، والبناء. يأتي مع بطارية 18650 قابلة للشحن عبر USB، حزام يد، مفاتيح أمان، وغطاء نجوم لإنشاء أنماط سماء مرصّعة. تصميم احترافي خفيف وسهل الاستخدام. التوصيل مجاني لجميع مدن المغرب مع الدفع عند الاستلام.",
      "Pointeur Laser Vert 303 NOORVA — outil premium en aluminium noir mat avec grip antidérapant diamanté. Faisceau vert précis et visible à longue distance pour astronomie, camping, présentations et chantier. Batterie 18650 rechargeable USB, dragonne, clés de sécurité et capuchon étoiles pour motifs célestes. Design professionnel, léger et simple. Livraison gratuite partout au Maroc avec paiement à la livraison.",
      "NOORVA Green Laser Pointer 303 — premium matte-black aluminum tool with diamond knurled anti-slip grip. Precise long-range green beam for astronomy, camping, presentations and construction. Rechargeable 18650 USB battery, wrist strap, safety keys and star cap for sky patterns. Professional, lightweight and easy to use. Free nationwide shipping in Morocco with cash on delivery."
    ),
    categoryId: "cat-laser-pointers",
    price: 199,
    compareAtPrice: 299,
    sku: "PRD-3765E729",
    stock: 47,
    rating: 4.9,
    reviewCount: 312,
    soldCount: 1840,
    isBestSeller: true,
    isTrending: true,
    isTikTokViral: true,
    isFeatured: true,
    flashSaleEndsAt: flashEnd,
    warrantyMonths: 12,
    problemEmoji: "🔦",
    problem: L(
      "بغيتي تشير بدقة من بعيد بلا أدوات ثقيلة؟",
      "Besoin de pointer avec précision à longue distance?",
      "Need precise long-distance pointing without bulky gear?"
    ),
    problemCause: L(
      "المؤشرات العادية ضعيفة، والمدى قصير، والجودة رخيصة",
      "Les pointeurs classiques sont faibles, courts et fragiles",
      "Ordinary pointers are weak, short-range and fragile"
    ),
    problemSolution: L(
      "ليزر أخضر 303 قوي + ألومنيوم + شحن USB",
      "Laser vert 303 puissant + aluminium + charge USB",
      "Powerful green laser 303 + aluminum + USB charging"
    ),
    deepDescription: L(
      "ليزر أخضر 303 بجسم ألومنيوم أسود، شعاع قوي ومدى بعيد، بطارية 18650 قابلة للشحن، حزام يد ومفاتيح أمان وغطاء نجوم. مثالي للفلك والتخييم والعروض المهنية في المغرب.",
      "Laser vert 303 en aluminium noir, faisceau puissant et longue portée, batterie 18650 rechargeable, dragonne, clés de sécurité et capuchon étoiles. Idéal astronomie, camping et présentations au Maroc.",
      "Green Laser 303 with black aluminum body, powerful long-range beam, rechargeable 18650 battery, lanyard, safety keys and star cap. Ideal for astronomy, camping and professional presentations in Morocco."
    ),
    tags: [
      "laser",
      "green-laser",
      "laser-303",
      "astronomy",
      "camping",
      "outdoor",
      "presentation",
      "construction",
      "professional",
      "rechargeable",
      "bestseller",
      "gift",
    ],
    benefits: [
      L("شعاع أخضر فائق القوة وواضح حتى من بعيد", "Faisceau vert ultra puissant et visible de loin", "Ultra-powerful green beam visible from afar"),
      L("مدى بعيد مثالي للفلك والتخييم والعروض", "Longue portée pour astronomie, camping et présentations", "Long range for astronomy, camping and presentations"),
      L("جسم ألومنيوم أسود قوي ومقاوم", "Corps en aluminium robuste et premium", "Robust premium aluminum body"),
      L("خفيف ومحمول مع حزام يد عملي", "Léger, portable avec dragonne pratique", "Lightweight and portable with wrist strap"),
      L("دقة عالية لتوجيه النقاط والأنماط", "Haute précision pour pointer et motifs", "High precision for pointing and patterns"),
      L("تصميم احترافي أسود أنيق", "Design professionnel noir élégant", "Elegant professional black design"),
      L("جودة فاخرة مع بطارية قابلة للشحن", "Qualité supérieure avec batterie rechargeable", "Superior quality with rechargeable battery"),
      L("سهل الاستخدام بزر واحد", "Facile à utiliser en un clic", "Easy one-button operation"),
    ],
    features: [
      L("ليزر أخضر عالي الكثافة — موديل 303", "Laser vert haute intensité — modèle 303", "High-intensity green laser — model 303"),
      L("جسم ألومنيوم أسود مطفي مع قبضة مضلّعة", "Corps aluminium noir mat à grip diamanté", "Matte black aluminum body with diamond knurling"),
      L("بطارية 18650 قابلة للشحن عبر USB", "Batterie 18650 rechargeable USB", "USB-rechargeable 18650 battery"),
      L("حزام يد + مفاتيح أمان", "Dragonne + clés de sécurité", "Wrist strap + safety keys"),
      L("غطاء نجوم لإنشاء أنماط سماء مرصّعة", "Capuchon étoiles pour motifs célestes", "Star cap for starry sky patterns"),
      L("زر تشغيل لمسي مضاد للمس العرضي", "Bouton tactile anti-activation accidentelle", "Tactile button with anti-touch protection"),
      L("مناسب للفلك والتخييم والعروض والبناء", "Astronomie, camping, présentation, construction", "Astronomy, camping, presentation, construction"),
    ],
    specifications: [
      { label: L("الموديل", "Modèle", "Model"), value: L("Laser 303", "Laser 303", "Laser 303") },
      { label: L("اللون", "Couleur", "Color"), value: L("أسود", "Noir", "Black") },
      { label: L("نوع الليزر", "Laser", "Laser"), value: L("أخضر", "Vert", "Green") },
      { label: L("المادة", "Matériau", "Material"), value: L("سبيكة ألومنيوم", "Alliage d'aluminium", "Aluminum Alloy") },
      { label: L("البطارية", "Batterie", "Battery"), value: L("18650 قابلة للشحن", "18650 rechargeable", "18650 Rechargeable") },
      { label: L("الشحن", "Charge", "Charging"), value: L("USB", "USB", "USB") },
      {
        label: L("الاستخدامات", "Applications", "Applications"),
        value: L(
          "فلك · تخييم · عروض · بناء · خارجي · احترافي",
          "Astronomie · Camping · Présentation · Construction · Outdoor · Professionnel",
          "Astronomy · Camping · Presentation · Construction · Outdoor · Professional"
        ),
      },
      { label: L("الملحقات", "Accessoires", "Accessories"), value: L("حزام يد · مفاتيح أمان · غطاء نجوم · كابل USB", "Dragonne · clés · capuchon étoiles · câble USB", "Lanyard · safety keys · star cap · USB cable") },
      { label: L("الضمان", "Garantie", "Warranty"), value: L("12 شهر", "12 mois", "12 months") },
    ],
    packageIncludes: [
      L("ليزر أخضر 303", "Pointeur Laser Vert 303", "Green Laser Pointer 303"),
      L("بطارية 18650 قابلة للشحن", "Batterie 18650 rechargeable", "Rechargeable 18650 battery"),
      L("كابل شحن USB", "Câble de charge USB", "USB charging cable"),
      L("حزام يد مع مفاتيح أمان", "Dragonne avec clés de sécurité", "Wrist strap with safety keys"),
      L("غطاء نجوم / نمط سماوي", "Capuchon étoiles / motif céleste", "Star / sky pattern cap"),
      L("دليل الاستخدام", "Manuel d'utilisation", "User manual"),
    ],
    howToUse: L(
      "اشحن البطارية عبر USB، ركّبها داخل الجهاز، فعّل مفتاح الأمان إن وُجد، ثم اضغط الزر لتفعيل الشعاع الأخضر. للأنماط النجمية، ثبّت غطاء النجوم على الرأس. استخدمه بحذر — لا توجّهه نحو العيون أو الطائرات.",
      "Chargez la batterie via USB, insérez-la, activez le verrou de sécurité si présent, puis appuyez sur le bouton pour le faisceau vert. Pour les motifs étoiles, fixez le capuchon. Utilisez avec prudence — jamais vers les yeux ou les avions.",
      "Charge the battery via USB, insert it, unlock the safety if present, then press the button for the green beam. For star patterns, attach the star cap. Use safely — never point at eyes or aircraft."
    ),
    lifestyleScenes: [
      {
        id: "astronomy",
        emoji: "🌌",
        title: L("علم الفلك", "Astronomie", "Astronomy"),
        description: L("أشر إلى النجوم والكواكب بدقة في سماء الليل", "Pointez étoiles et planètes avec précision", "Point to stars and planets with precision"),
      },
      {
        id: "camping",
        emoji: "⛺",
        title: L("التخييم", "Camping", "Camping"),
        description: L("أداة خفيفة وعملية لكل مغامرة ليلية", "Outil léger pour chaque aventure nocturne", "Lightweight tool for every night adventure"),
      },
      {
        id: "presentation",
        emoji: "📊",
        title: L("العروض", "Présentation", "Presentation"),
        description: L("أشر بوضوح أثناء الاجتماعات والعروض", "Pointez clairement en réunion et en présentation", "Point clearly in meetings and presentations"),
      },
      {
        id: "outdoor",
        emoji: "🏔️",
        title: L("الاستخدام الخارجي", "Outdoor", "Outdoor"),
        description: L("شعاع أخضر قوي يظهر حتى في الظلام", "Faisceau vert visible même dans le noir", "Powerful green beam visible even in the dark"),
      },
      {
        id: "professional",
        emoji: "🏗️",
        title: L("الاستخدام المهني", "Professionnel", "Professional"),
        description: L("مناسب للبناء والتوجيه الميداني", "Idéal chantier et guidage terrain", "Ideal for construction and field guidance"),
      },
    ],
    images: [],
    lifestyleImages: [],
    variants: [
      {
        id: "var-laser303",
        name: L("أسود", "Noir", "Black"),
        price: 199,
        compareAtPrice: 299,
        sku: "PRD-3765E729",
        stock: 47,
      },
    ],
    upsellIds: ["prod-mx003", "prod-starbt"],
    crossSellIds: ["prod-aurora", "prod-rabbit"],
    seo: {
      title: L(
        "ليزر أخضر 303 احترافي | شحن USB ومدى بعيد | NOORVA المغرب",
        "Pointeur Laser Vert 303 Premium | USB & Longue Portée | NOORVA Maroc",
        "Premium Green Laser Pointer 303 | USB & Long Range | NOORVA Morocco"
      ),
      description: L(
        "اشتري ليزر أخضر 303 بسعر 199 درهم بدل 299. شعاع قوي، ألومنيوم، بطارية قابلة للشحن. توصيل مجاني والدفع عند الاستلام في المغرب.",
        "Achetez le Pointeur Laser Vert 303 à 199 MAD au lieu de 299. Faisceau puissant, aluminium, batterie rechargeable. Livraison gratuite et paiement à la livraison au Maroc.",
        "Buy Green Laser Pointer 303 for 199 MAD instead of 299. Powerful beam, aluminum body, rechargeable battery. Free shipping and cash on delivery in Morocco."
      ),
    },
  },

  {
    id: "prod-galaxy-rgb",
    slug: "star-galaxy-projector-rgb-gift",
    name: L(
      "مصباح عرض النجوم والمجرة مع شريط إضاءة RGB هدية",
      "Projecteur Étoiles & Galaxie + Bande LED RGB Offerte",
      "Star & Galaxy Projection Lamp with Free RGB LED Strip Gift"
    ),
    shortDescription: L(
      "مجرة ملونة على السقف + شريط RGB هدية — مؤقت 2س، USB DC 5V والدفع عند الاستلام",
      "Galaxie colorée au plafond + bande RGB offerte — minuterie 2h, USB DC 5V, paiement à la livraison",
      "Colorful galaxy on your ceiling + free RGB strip — 2h timer, USB DC 5V, cash on delivery"
    ),
    description: L(
      "عرض NOORVA: مصباح عرض النجوم والمجرة بقاعدة سوداء مطفي وقبة كريستال شفافة متعددة الأوجه، كيعرض سديم ونجوم بألوان حية (وردي، سماوي، برتقالي…). لوحة تحكم أمامية: منفذ USB، طاقة DC 5V 2A، أزرار أوضاع ومؤقت 2H، منزلق سطوع ومفتاح OFF-ON. مع الطلب: شريط إضاءة LED RGB مرن هدية (على بكرة مع شريطة هدية) باش تكمّل ديكور الغرفة. مثالي لغرفة النوم، الأطفال والهدايا. 199 درهم، توصيل مجاني والدفع عند الاستلام في المغرب.",
      "Offre NOORVA : projecteur étoiles & galaxie, base noire mate et dôme cristal facetté, nébuleuse et étoiles multicolores. Panneau avant : USB, DC 5V 2A, modes, minuterie 2H, curseur luminosité, interrupteur OFF-ON. Bande LED RGB flexible offerte. Idéal chambre, enfants, cadeaux. 199 MAD, livraison gratuite et COD au Maroc.",
      "NOORVA bundle: star & galaxy projection lamp with matte black base and faceted crystal dome, vivid nebula and stars. Front panel: USB, DC 5V 2A, mode buttons, 2H timer, brightness slider, OFF-ON switch. Includes a flexible RGB LED strip gift. Perfect for bedrooms, kids rooms and gifts. 199 MAD, free shipping and cash on delivery in Morocco."
    ),
    categoryId: "cat-projectors",
    price: 199,
    compareAtPrice: 279,
    sku: "NRV-GALAXY-RGB-01",
    stock: 80,
    rating: 4.9,
    reviewCount: 94,
    soldCount: 620,
    isBestSeller: true,
    isTrending: true,
    isTikTokViral: true,
    isFeatured: true,
    flashSaleEndsAt: flashEnd,
    warrantyMonths: 12,
    problemEmoji: "🌌",
    problem: L(
      "بغيت غرفة بمجرة حقيقية بثمن زوين؟",
      "Envie d'une vraie ambiance galaxie à bon prix?",
      "Want a real galaxy room without overspending?"
    ),
    problemCause: L(
      "الإضاءة العادية ما كتعطيش سديم ولا هدية ديكور مع الطلب",
      "La lumière classique ne projette pas de nébuleuse et n'offre pas de bande RGB",
      "Normal lights don't give nebula projection or a bonus RGB strip"
    ),
    problemSolution: L(
      "مصباح مجرة + شريط RGB هدية بـ 199 درهم",
      "Projecteur galaxie + bande RGB offerte à 199 MAD",
      "Galaxy lamp + free RGB strip for 199 MAD"
    ),
    deepDescription: L(
      "جسم ABS أسود صحني بقبة كريستال شفافة. إسقاط نجوم وسديم متعدد الألوان. تحكم يدوي: مؤقت 2H، تعتيم، USB وDC 5V 2A. الشريط RGB المرن هدية — ألوان متعددة لتزيين السرير، المكتب أو التلفزة. حجم مدمج للطاولة أو كومodin.",
      "Corps noir en forme de coupelle, dôme cristal. Projection étoiles et nébuleuse. Minuterie 2H, intensité, USB et DC 5V 2A. Bande RGB flexible offerte pour lit, bureau ou TV. Format compact table de chevet.",
      "Black bowl ABS body with faceted crystal dome. Stars and nebula projection. 2H timer, dimming, USB and DC 5V 2A. Flexible RGB strip gift for bed, desk or TV. Compact bedside size."
    ),
    tags: ["star", "galaxy", "rgb", "night-light", "bedroom", "kids", "gift", "decor", "new", "bundle"],
    benefits: [
      L("مجرة ملونة فوراً على السقف والجدران", "Galaxie colorée instantanée au plafond", "Instant colorful galaxy on ceiling and walls"),
      L("شريط RGB هدية — ديكور إضافي بلا ثمن زائد", "Bande RGB offerte — déco en plus sans surcoût", "Free RGB strip — extra decor at no extra cost"),
      L("مؤقت 2H ومنزلق سطوع للنوم المريح", "Minuterie 2H et curseur pour dormir sereinement", "2H timer and brightness slider for easy sleep"),
      L("هدية مثالية للأطفال والأجواء الرومانسية", "Cadeau idéal enfants et soirées romantiques", "Ideal gift for kids and romantic evenings"),
    ],
    features: [
      L("إسقاط نجوم وسديم متعدد الألوان", "Projection étoiles et nébuleuse multicolore", "Multicolor stars and nebula projection"),
      L("قبة كريستال شفافة متعددة الأوجه", "Dôme cristal facetté transparent", "Faceted transparent crystal dome"),
      L("مؤقت 2H + تعتيم + مفتاح OFF-ON", "Minuterie 2H + intensité + OFF-ON", "2H timer + dimming + OFF-ON switch"),
      L("USB + DC 5V 2A", "USB + DC 5V 2A", "USB + DC 5V 2A power"),
      L("شريط LED RGB مرن هدية", "Bande LED RGB flexible offerte", "Free flexible RGB LED strip"),
    ],
    specifications: [
      { label: L("التصميم", "Design", "Design"), value: L("قاعدة سوداء + قبة كريستال", "Base noire + dôme cristal", "Black base + crystal dome") },
      { label: L("المادة", "Matériau", "Material"), value: L("بلاستيك ABS", "Plastique ABS", "ABS plastic") },
      { label: L("الطاقة", "Alimentation", "Power"), value: L("USB · DC 5V 2A", "USB · DC 5V 2A", "USB · DC 5V 2A") },
      { label: L("المؤقت", "Minuterie", "Timer"), value: L("2 ساعات (2H)", "2 heures (2H)", "2 hours (2H)") },
      { label: L("الهدية", "Offre", "Bundle"), value: L("شريط إضاءة RGB", "Bande LED RGB", "RGB LED light strip") },
      { label: L("الضمان", "Garantie", "Warranty"), value: L("12 شهر", "12 mois", "12 months") },
    ],
    packageIncludes: [
      L("مصباح عرض النجوم والمجرة", "Projecteur étoiles & galaxie", "Star & galaxy projection lamp"),
      L("شريط إضاءة LED RGB (هدية)", "Bande LED RGB (offerte)", "RGB LED light strip (gift)"),
      L("كابل طاقة", "Câble d'alimentation", "Power cable"),
      L("دليل الاستخدام", "Manuel", "User manual"),
    ],
    howToUse: L(
      "ضع المصباح في غرفة مظلمة ووجّهه نحو السقف. وصّل DC 5V 2A أو USB، شغّل المفتاح، اضبط السطوع والوضع، وفعّل مؤقت 2H قبل النوم. ثبّت شريط RGB على السرير أو المكتب حسب التعليمات.",
      "Pièce sombre, orienter vers le plafond. Brancher DC 5V 2A ou USB, allumer, régler luminosité/mode, minuterie 2H. Coller la bande RGB selon le manuel.",
      "Place in a dark room aimed at the ceiling. Connect DC 5V 2A or USB, power on, set brightness/mode and 2H timer before sleep. Mount the RGB strip per instructions."
    ),
    images: [],
    lifestyleImages: [],
    lifestyleScenes: [
      { id: "bedroom", emoji: "🛏️", title: L("غرفة النوم", "Chambre", "Bedroom"), description: L("مجرة هادئة قبل النوم", "Galaxie douce avant de dormir", "Calm galaxy before sleep") },
      { id: "kids", emoji: "👶", title: L("غرفة الأطفال", "Enfants", "Kids Room"), description: L("نجوم + شريط RGB ملوّن", "Étoiles + bande RGB colorée", "Stars + colorful RGB strip") },
      { id: "gift", emoji: "🎁", title: L("هدية", "Cadeau", "Gift"), description: L("مصباح + شريط RGB في طلب واحد", "Projecteur + bande RGB en un colis", "Lamp + RGB strip in one order") },
      { id: "romantic", emoji: "💫", title: L("أجواء رومانسية", "Romantique", "Romantic"), description: L("سديم ملون فالدار", "Nébuleuse colorée à la maison", "Colorful nebula at home") },
    ],
    variants: [
      {
        id: "var-galaxy-rgb",
        name: L("أسود + شريط RGB", "Noir + bande RGB", "Black + RGB strip"),
        price: 199,
        compareAtPrice: 279,
        sku: "NRV-GALAXY-RGB-01",
        stock: 80,
      },
    ],
    upsellIds: ["prod-starbt", "prod-mx003", "prod-aurora"],
    crossSellIds: ["prod-rabbit"],
    seo: {
      title: L(
        "مصباح النجوم والمجرة + شريط RGB هدية | 199 درهم | NOORVA",
        "Projecteur Étoiles Galaxie + Bande RGB | 199 MAD | NOORVA",
        "Star Galaxy Projector + Free RGB Strip | 199 MAD | NOORVA Morocco"
      ),
      description: L(
        "مصباح عرض النجوم والمجرة مع شريط إضاءة RGB هدية بـ 199 درهم. مؤقت 2H، USB DC 5V. توصيل مجاني والدفع عند الاستلام في المغرب.",
        "Projecteur étoiles & galaxie + bande RGB offerte à 199 MAD. Minuterie 2H, USB DC 5V. Livraison gratuite et COD au Maroc.",
        "Star & galaxy projection lamp with free RGB LED strip for 199 MAD. 2H timer, USB DC 5V. Free shipping and COD in Morocco."
      ),
    },
  },

  {
    id: "prod-car-mount",
    slug: "magnetic-car-phone-mount-maidsail",
    name: L(
      "حامل هاتف مغناطيسي للسيارة Maidsail — MagSafe وذراع قابل للتعديل",
      "Support Téléphone Magnétique Voiture Maidsail — MagSafe & Bras Ajustable",
      "Maidsail Magnetic Car Phone Mount — MagSafe & Adjustable Arm"
    ),
    shortDescription: L(
      "تثبيت مغناطيسي قوي، ذراع متعدد المفاصل، وقاعدة شفط مع قفل TIGHT/OPEN — تنقل آمن للهاتف في السيارة · توصيل مجاني والدفع عند الاستلام",
      "Fixation magnétique forte, bras articulé, ventouse avec verrou TIGHT/OPEN — conduite sûre · livraison gratuite et COD",
      "Strong magnetic hold, multi-joint arm, suction base with TIGHT/OPEN lock — safe driving · free shipping and COD"
    ),
    description: L(
      "حامل هاتف مغناطيسي للسيارة من Maidsail عبر NOORVA: رأس حلقة مغناطيسية كبيرة متوافقة مع MagSafe وحالات مغناطيسية، ذراع قابل للطي والتعديل للارتفاع والزاوية، وقاعدة شفط دائرية مع حلقة قفل فضية (TIGHT / OPEN). تصميم أسود أنيق مع لمسات رمادية معدنية، مناسب للملاحة والمكالمات hands-free. التوصيل مجاني لجميع مدن المغرب مع الدفع عند الاستلام.",
      "Support magnétique Maidsail NOORVA : anneau MagSafe, bras pliable réglable, ventouse avec bague de verrouillage (TIGHT / OPEN). Noir et gris métallique pour GPS et mains libres. Livraison gratuite au Maroc, paiement à la livraison.",
      "NOORVA Maidsail magnetic car mount: MagSafe ring head, foldable adjustable arm, suction cup with TIGHT/OPEN lock ring. Black with metallic grey for navigation and hands-free. Free Morocco shipping, cash on delivery."
    ),
    categoryId: "cat-car-accessories",
    price: 159,
    compareAtPrice: 229,
    sku: "Mag-Holder",
    stock: 55,
    rating: 4.8,
    reviewCount: 142,
    soldCount: 680,
    isBestSeller: false,
    isTrending: true,
    isTikTokViral: false,
    isFeatured: true,
    flashSaleEndsAt: flashEnd,
    warrantyMonths: 6,
    problemEmoji: "📱",
    problem: L(
      "الهاتف كيقع أو كيتزحلق فالسيارة؟",
      "Votre téléphone glisse ou tombe en voiture?",
      "Does your phone slip or fall in the car?"
    ),
    problemCause: L(
      "الحاملات الضعيفة ما كتثبتش مزيان فالطريق",
      "Les supports faibles ne tiennent pas sur la route",
      "Weak mounts don't hold on bumpy roads"
    ),
    problemSolution: L(
      "مغناطيس قوي + شفط محكم + ذراع قابل للتعديل",
      "Aimant fort + ventouse verrouillée + bras réglable",
      "Strong magnet + locked suction + adjustable arm"
    ),
    deepDescription: L(
      "حامل Maidsail: رأس مغناطيسي MagSafe، ذراع متعدد المفاصل للزاوية والارتفاع، قاعدة شفط مع قفل دوّار، وتصميم قابل للطي للتخزين. مثالي للملاحة والمكالمات بأمان في المغرب.",
      "Support Maidsail : tête MagSafe, bras articulé, ventouse verrouillée, pliable. Idéal GPS et mains libres au Maroc.",
      "Maidsail mount: MagSafe head, articulated arm, locked suction, foldable storage. Ideal for safe GPS and hands-free in Morocco."
    ),
    tags: ["car", "phone-mount", "magnetic", "magsafe", "driving", "gift", "new", "accessories"],
    benefits: [
      L("تثبيت مغناطيسي قوي للهاتف بلا سقوط", "Fixation magnétique forte sans chute", "Strong magnetic hold without drops"),
      L("ذراع قابل للتعديل للزاوية والارتفاع المثالي", "Bras réglable pour l'angle idéal", "Adjustable arm for the perfect angle"),
      L("قاعدة شفط مع قفل TIGHT/OPEN للثبات", "Ventouse avec verrou TIGHT/OPEN", "Suction base with TIGHT/OPEN lock"),
      L("متوافق MagSafe والحلقات المغناطيسية", "Compatible MagSafe et anneaux magnétiques", "MagSafe and magnetic ring compatible"),
      L("تصميم قابل للطي وسهل الحمل", "Pliable et facile à ranger", "Foldable and easy to store"),
      L("قيادة آمنة للملاحة والمكالمات", "Conduite sûre pour GPS et appels", "Safer driving for GPS and calls"),
    ],
    features: [
      L("رأس حلقة مغناطيسية كبيرة (MagSafe)", "Anneau magnétique MagSafe", "Large MagSafe magnetic ring head"),
      L("ذراع متعدد المفاصل قابل للطي", "Bras articulé pliable", "Multi-joint foldable arm"),
      L("قاعدة شفط مع حلقة قفل دوّارة", "Ventouse à bague de verrouillage", "Suction cup with twist-lock ring"),
      L("تعديل 360° للزاوية", "Rotation 360°", "360° angle adjustment"),
      L("تصميم أسود فاخر", "Design noir premium", "Premium black design"),
      L("سهل التركيب والإزالة", "Installation et retrait faciles", "Easy install and removal"),
    ],
    specifications: [
      { label: L("العلامة", "Marque", "Brand"), value: L("Maidsail", "Maidsail", "Maidsail") },
      { label: L("اللون", "Couleur", "Color"), value: L("أسود / فضي", "Noir / Argent", "Black / Silver") },
      { label: L("النوع", "Type", "Type"), value: L("حامل مغناطيسي للسيارة", "Support magnétique voiture", "Magnetic car mount") },
      { label: L("التوافق", "Compatibilité", "Compatibility"), value: L("MagSafe / حلقة مغناطيسية", "MagSafe / anneau magnétique", "MagSafe / magnetic ring") },
      { label: L("التثبيت", "Fixation", "Mounting"), value: L("شفط + قفل", "Ventouse + verrou", "Suction + lock") },
      { label: L("الضمان", "Garantie", "Warranty"), value: L("6 أشهر", "6 mois", "6 months") },
    ],
    packageIncludes: [
      L("حامل هاتف مغناطيسي Maidsail للسيارة", "Support magnétique Maidsail voiture", "Maidsail magnetic car phone mount"),
      L("دليل الاستخدام", "Manuel d'utilisation", "User manual"),
    ],
    howToUse: L(
      "نظّف السطح (لوحة القيادة أو الزجاج)، ضع قاعدة الشفط واضغط، دوّر الحلقة على TIGHT للتثبيت. ثبّت الهاتف على الرأس المغناطيسي (MagSafe أو حلقة). اضبط الذراع للزاوية المناسبة. للإزالة، دوّر على OPEN.",
      "Nettoyez la surface, posez la ventouse, tournez sur TIGHT. Fixez le téléphone (MagSafe ou anneau). Réglez le bras. Pour retirer, tournez sur OPEN.",
      "Clean the surface, place the suction cup, twist to TIGHT. Attach phone (MagSafe or ring). Adjust the arm. To remove, twist to OPEN."
    ),
    videoUrl: "/videos/car-mount-product-demo-v2.mp4",
    lifestyleScenes: [
      {
        id: "navigation",
        emoji: "🗺️",
        title: L("الملاحة", "Navigation", "Navigation"),
        description: L("GPS واضح بلا إمساك الهاتف", "GPS clair sans tenir le téléphone", "Clear GPS without holding your phone"),
      },
      {
        id: "commute",
        emoji: "🚗",
        title: L("التنقل اليومي", "Trajet quotidien", "Daily commute"),
        description: L("مكالمات hands-free بأمان", "Appels mains libres en sécurité", "Safe hands-free calls"),
      },
      {
        id: "travel",
        emoji: "✈️",
        title: L("السفر", "Voyage", "Travel"),
        description: L("قابل للطي — خذه معاك", "Pliable — emportez-le partout", "Foldable — take it anywhere"),
      },
      {
        id: "gift",
        emoji: "🎁",
        title: L("هدية عملية", "Cadeau pratique", "Practical gift"),
        description: L("مفيد لكل سائق", "Utile pour tout conducteur", "Useful for every driver"),
      },
    ],
    images: [],
    lifestyleImages: [],
    variants: [
      {
        id: "var-car-mount",
        name: L("أسود", "Noir", "Black"),
        price: 159,
        compareAtPrice: 229,
        sku: "Mag-Holder",
        stock: 55,
      },
    ],
    upsellIds: ["prod-laser303", "prod-mx003"],
    crossSellIds: ["prod-shiatsu", "prod-starbt", "prod-car-fan-sunshade"],
    seo: {
      title: L(
        "حامل هاتف مغناطيسي للسيارة Maidsail | 159 درهم | NOORVA المغرب",
        "Support Magnétique Voiture Maidsail | 159 MAD | NOORVA Maroc",
        "Maidsail Magnetic Car Phone Mount | 159 MAD | NOORVA Morocco"
      ),
      description: L(
        "حامل مغناطيسي Maidsail بـ 159 درهم: MagSafe، ذراع قابل للتعديل، شفط مع قفل. توصيل مجاني والدفع عند الاستلام في المغرب.",
        "Support magnétique Maidsail à 159 MAD : MagSafe, bras réglable, ventouse verrouillée. Livraison gratuite et COD au Maroc.",
        "Maidsail magnetic mount for 159 MAD: MagSafe, adjustable arm, locked suction. Free shipping and COD in Morocco."
      ),
    },
  },

  {
    id: "prod-car-fan-sunshade",
    slug: "car-dual-fan-foldable-sunshade-2in1-pack",
    name: L(
      "باك 2 في 1: مروحة سيارة مزدوجة مع مظلة شمس أمامية قابلة للطي",
      "Pack 2 en 1 : Double Ventilateur Voiture + Pare-soleil Pare-brise Pliable",
      "2-in-1 Pack: Dual Car Fan and Foldable Front Windshield Sunshade"
    ),
    shortDescription: L(
      "مروحتين للسيارة + مظلة شمس عاكسة قابلة للطي · 249 درهم · توصيل مجاني والدفع عند الاستلام",
      "Double ventilateur voiture + pare-soleil réfléchissant pliable · 249 MAD · livraison gratuite et COD",
      "Dual car fans + foldable reflective sunshade · 249 MAD · free shipping and COD"
    ),
    description: L(
      "باك 2 في 1 من NOORVA للصيف داخل السيارة: مروحة سيارة مزدوجة برأسين دوّارين وقاعدة سوداء ثابتة على لوحة القيادة، مع مظلة شمس أمامية قابلة للطي بتصميم مظلة — وجه فضي عاكس يبعد الحر والشمس عن المقصورة، وحقيبة حمل للتخزين. مثالي للوقوف تحت الشمس، التنقل اليومي، والسفر. 249 درهم. توصيل مجاني في المغرب والدفع عند الاستلام.",
      "Pack 2 en 1 NOORVA pour l'été en voiture : double ventilateur avec deux têtes orientables sur base noire pour tableau de bord, plus pare-soleil pare-brise pliable type parapluie — face argentée réfléchissante et pochette de rangement. Idéal stationnement au soleil, trajets quotidiens et voyage. 249 MAD. Livraison gratuite au Maroc, paiement à la livraison.",
      "NOORVA 2-in-1 summer car pack: dual-head dashboard car fan on a black adjustable base, plus foldable umbrella-style front windshield sunshade with silver reflective face and carry pouch. Ideal for parking in sun, daily commutes and travel. 249 MAD. Free Morocco shipping, cash on delivery."
    ),
    categoryId: "cat-car-accessories",
    price: 249,
    compareAtPrice: 379,
    sku: "NRV-CARFAN-SUN-01",
    stock: 65,
    rating: 4.8,
    reviewCount: 52,
    soldCount: 380,
    isBestSeller: true,
    isTrending: true,
    isTikTokViral: false,
    isFeatured: true,
    flashSaleEndsAt: flashEnd,
    warrantyMonths: 6,
    problemEmoji: "☀️",
    problem: L(
      "السيارة كتحمّى بزاف فالشمس وما كتبردش بسرعة؟",
      "La voiture surchauffe au soleil et ne refroidit pas assez vite?",
      "Does your car overheat in the sun and take forever to cool down?"
    ),
    problemCause: L(
      "الشمس على الزجاج الأمامي والهواء الراكد داخل المقصورة",
      "Le soleil sur le pare-brise et l'air stagnant dans l'habitacle",
      "Sun on the windshield and stagnant air inside the cabin"
    ),
    problemSolution: L(
      "مظلة عاكسة + مروحتين — حماية من الحر وهواء منعش",
      "Pare-soleil réfléchissant + double ventilateur — moins de chaleur, air frais",
      "Reflective shade + dual fans — block heat and circulate fresh air"
    ),
    deepDescription: L(
      "المروحة المزدوجة: قاعدة سوداء مع مفتاح تشغيل، ذراعان قابلان للتوجيه و رأسان دائريان بشبكة سوداء وريش أصفر للتبريد السريع على لوحة القيادة. المظلة: تصميم قابل للطي كالمظلة، وجه داخلي أسود ووجه خارجي فضي عاكس، مع حقيبة جلدية سوداء للحمل. تركيب المظلة من الداخل على الزجاج الأمامي يقلّل حرارة المقصورة؛ المروحة تعطي تدفق هواء أثناء القيادة أو الوقوف.",
      "Double ventilateur : base noire, interrupteur, deux têtes orientables à grilles noires et pales jaunes pour le tableau de bord. Pare-soleil : pliable type parapluie, intérieur noir, extérieur argent réfléchissant, pochette noire. Réduit la chaleur au stationnement ; ventilateurs pour l'air en conduite ou à l'arrêt.",
      "Dual fan: black base with switch, two adjustable heads with black grilles and yellow blades for dashboard use. Sunshade: umbrella-style foldable design, black interior and silver reflective exterior with black carry pouch. Shade cuts cabin heat when parked; fans add airflow while driving or waiting."
    ),
    tags: ["car", "fan", "summer", "sunshade", "driving", "gift", "new", "accessories"],
    benefits: [
      L("باك كامل: تبريد + حماية من الشمس", "Pack complet : fraîcheur + protection solaire", "Complete pack: cooling + sun protection"),
      L("مروحتين لتدفق هواء أقوى", "Deux ventilateurs pour un flux d'air plus fort", "Two fans for stronger airflow"),
      L("مظلة عاكسة تقلّل حرارة المقصورة", "Pare-soleil réfléchissant réduit la chaleur", "Reflective shade reduces cabin heat"),
      L("قابلة للطي مع حقيبة حمل", "Pliable avec pochette de transport", "Foldable with carry pouch"),
      L("249 درهم — قيمة ممتازة للصيف", "249 MAD — excellent rapport qualité-prix été", "249 MAD — great summer value"),
    ],
    features: [
      L("مروحة سيارة مزدوجة برأسين قابلتين للتوجيه", "Double ventilateur voiture à têtes orientables", "Dual car fan with two adjustable heads"),
      L("مظلة شمس أمامية قابلة للطي", "Pare-soleil pare-brise pliable", "Foldable front windshield sunshade"),
      L("وجه فضي عاكس للشمس", "Face argentée réfléchissante", "Silver reflective sun-facing side"),
      L("حقيبة تخزين للمظلة", "Pochette de rangement pour le pare-soleil", "Sunshade storage pouch"),
      L("مناسبة للسيارة والسفر", "Adapté voiture et voyage", "Suitable for car and travel"),
    ],
    specifications: [
      { label: L("المحتويات", "Contenu", "Contents"), value: L("مروحة مزدوجة + مظلة شمس", "Double ventilateur + pare-soleil", "Dual fan + sunshade") },
      { label: L("المروحة", "Ventilateur", "Fan"), value: L("رأسان دوّاران · قاعدة لوحة القيادة", "2 têtes orientables · base tableau de bord", "2 adjustable heads · dashboard base") },
      { label: L("المظلة", "Pare-soleil", "Sunshade"), value: L("قابلة للطي · عاكسة فضية", "Pliable · réfléchissant argent", "Foldable · silver reflective") },
      { label: L("الاستخدام", "Utilisation", "Usage"), value: L("زجاج أمامي + مقصورة", "Pare-brise + habitacle", "Windshield + cabin") },
      { label: L("الضمان", "Garantie", "Warranty"), value: L("6 أشهر", "6 mois", "6 months") },
    ],
    packageIncludes: [
      L("مروحة سيارة مزدوجة", "Double ventilateur voiture", "Dual car fan"),
      L("مظلة شمس أمامية قابلة للطي", "Pare-soleil pare-brise pliable", "Foldable front windshield sunshade"),
      L("حقيبة حمل للمظلة", "Pochette pour le pare-soleil", "Sunshade carry pouch"),
    ],
    howToUse: L(
      "للمظلة: افتحها كالمظلة وثبّتها من داخل السيارة على الزجاج الأمامي (الوجه الفضي للخارج)، واطوِها في الحقيبة بعد الاستخدام. للمروحة: ضعها على لوحة القيادة، وجّه الرأسين نحوك أو نحو المقاعد، وشغّل المفتاح. استعمل المظلة عند الوقوف والمروحة للتهوية أثناء القيادة أو الانتظار.",
      "Pare-soleil : déployez comme un parapluie, fixez de l'intérieur sur le pare-brise (face argentée dehors), rangez dans la pochette. Ventilateur : posez sur le tableau de bord, orientez les têtes, allumez. Pare-soleil au stationnement, ventilateur en conduite ou à l'arrêt.",
      "Sunshade: open like an umbrella, install from inside on the windshield (silver side out), fold into the pouch when done. Fan: place on dashboard, aim both heads, switch on. Use shade when parked and fan for airflow while driving or waiting."
    ),
    lifestyleScenes: [
      { id: "parking", emoji: "🅿️", title: L("الوقوف تحت الشمس", "Stationnement au soleil", "Parking in sun"), description: L("المظلة تبعد الحر عن المقصورة", "Le pare-soleil limite la surchauffe", "Shade keeps cabin heat down") },
      { id: "commute", emoji: "🚗", title: L("التنقل اليومي", "Trajet quotidien", "Daily commute"), description: L("هواء منعش مع المروحتين", "Air frais avec le double ventilateur", "Fresh air with dual fans") },
      { id: "travel", emoji: "🧳", title: L("السفر", "Voyage", "Travel"), description: L("قابلة للطي — خذ الباك معاك", "Pliable — emportez le pack", "Foldable — take the pack anywhere") },
      { id: "summer", emoji: "☀️", title: L("الصيف", "Été", "Summer"), description: L("رفيقك ضد الحر داخل السيارة", "Votre allié anti-chaleur en voiture", "Your in-car heat companion") },
    ],
    images: [],
    lifestyleImages: [],
    variants: [
      {
        id: "var-car-fan-sunshade",
        name: L("باك 2 في 1", "Pack 2 en 1", "2-in-1 pack"),
        price: 249,
        compareAtPrice: 379,
        sku: "NRV-CARFAN-SUN-01",
        stock: 65,
      },
    ],
    upsellIds: ["prod-car-mount", "prod-laser303"],
    crossSellIds: ["prod-dual-cooler", "prod-car-mount"],
    seo: {
      title: L(
        "باك 2 في 1 مروحة سيارة + مظلة شمس | 249 درهم | NOORVA المغرب",
        "Pack 2 en 1 Ventilateur + Pare-soleil Voiture | 249 MAD | NOORVA Maroc",
        "2-in-1 Car Fan + Sunshade Pack | 249 MAD | NOORVA Morocco"
      ),
      description: L(
        "مروحة سيارة مزدوجة مع مظلة شمس أمامية قابلة للطي بـ 249 درهم. حماية من الحر وهواء منعش. توصيل مجاني والدفع عند الاستلام في المغرب.",
        "Double ventilateur voiture + pare-soleil pliable à 249 MAD. Moins de chaleur, air frais. Livraison gratuite et COD au Maroc.",
        "Dual car fan and foldable windshield sunshade for 249 MAD. Block heat, fresh airflow. Free shipping and COD in Morocco."
      ),
    },
  },

  {
    id: "prod-mosquito-tent",
    slug: "foldable-mosquito-bed-tent",
    name: L(
      "خيمة الحماية من الناموس بتصميم قابل للطي وسريع التركيب",
      "Moustiquaire Pop-Up Pliable — Installation Rapide",
      "Foldable Pop-Up Mosquito Protection Bed Tent"
    ),
    shortDescription: L(
      "شبكة دقيقة فوق السرير · تركيب pop-up في ثوانٍ · 199 درهم · عرض 2 بـ 299 درهم · توصيل مجاني والدفع عند الاستلام",
      "Maille fine sur le lit · montage pop-up en secondes · 199 MAD · 2 pour 299 MAD · livraison gratuite et COD",
      "Fine mesh over the bed · pop-up setup in seconds · 199 MAD · 2 for 299 MAD · free shipping and COD"
    ),
    description: L(
      "خيمة حماية من الناموس من NOORVA: تصميم pop-up قابل للطي يُركّب بسرعة فوق سرير زوجي أو queen. شبكة بيضاء دقيقة مع إطار أزرق مرن، زخرفة dentelle أفقية، وفتحة U كبيرة بسحّاب للدخول والخروج. تُطوى في حقيبة دائرية خضراء/زرقاء للحمل والتخزين. مثالية للصيف، غرف الأطفال، والبيوت والرحلات. 199 درهم للوحدة أو 2 خيمات بـ 299 درهم. توصيل مجاني في المغرب والدفع عند الاستلام.",
      "Moustiquaire pop-up NOORVA : montage rapide sur lit double/queen. Maille blanche fine, cadre bleu souple, dentelle décorative, grande ouverture en U avec fermeture éclair. Se plie dans un sac rond vert/bleu. Idéal été, chambres d'enfants, maison et voyage. 199 MAD l'unité ou 2 pour 299 MAD. Livraison gratuite au Maroc, paiement à la livraison.",
      "NOORVA pop-up mosquito bed tent: quick setup over double/queen bed. Fine white mesh, flexible blue frame, lace trim, large U-shaped zip door. Folds into green/blue circular carry bag. Ideal for summer, kids rooms, home and travel. 199 MAD each or 2 for 299 MAD. Free Morocco shipping, cash on delivery."
    ),
    categoryId: "cat-bedroom-lighting",
    price: 199,
    compareAtPrice: 279,
    sku: "Mosquito-protection-tent",
    stock: 120,
    rating: 4.8,
    reviewCount: 86,
    soldCount: 540,
    isBestSeller: true,
    isTrending: true,
    isTikTokViral: false,
    isFeatured: true,
    flashSaleEndsAt: flashEnd,
    warrantyMonths: 6,
    problemEmoji: "🦟",
    problem: L(
      "الناموس كيوقّفك على النوم فالصيف؟",
      "Les moustiques gâchent votre sommeil en été?",
      "Mosquitoes ruining your sleep in summer?"
    ),
    problemCause: L(
      "الشبكات التقليدية صعبة التركيب أو ما كتغطّيش السرير كامل",
      "Les moustiquaires classiques sont difficiles à installer ou ne couvrent pas tout le lit",
      "Traditional nets are hard to install or don't cover the whole bed"
    ),
    problemSolution: L(
      "خيمة pop-up قابلة للطي — تركيب سريع وحماية كاملة",
      "Moustiquaire pop-up pliable — installation rapide, protection totale",
      "Foldable pop-up tent — fast setup, full protection"
    ),
    deepDescription: L(
      "هيكل pop-up مرن بإطار أزرق يُفتح في ثوانٍ فوق المرتبة. شبكة micro-mesh بيضاء مع زخرفة dentelle وفتحة سحّاب U للدخول بدون إزعاج. تُطوى في حقيبة دائرية ملونة للتخزين أو السفر. مناسبة للسرير الزوجي، غرف الأطفال، والبيوت الصيفية.",
      "Structure pop-up à cadre bleu qui s'ouvre en secondes sur le matelas. Maille blanche fine, dentelle décorative, ouverture U zippée. Se range dans un sac rond coloré. Pour lit double, chambre enfant et maison d'été.",
      "Flexible blue pop-up frame opens in seconds over the mattress. Fine white micro-mesh, lace trim, zippered U entry. Folds into a colorful round bag. For double beds, kids rooms and summer homes."
    ),
    tags: ["bedroom", "home", "kids", "gift", "new", "mosquito", "summer", "travel"],
    benefits: [
      L("حماية كاملة من الناموس طوال الليل", "Protection anti-moustiques toute la nuit", "Full mosquito protection all night"),
      L("تركيب pop-up سريع بلا أدوات", "Montage pop-up rapide sans outils", "Quick pop-up setup with no tools"),
      L("قابلة للطي مع حقيبة حمل عملية", "Pliable avec sac de transport pratique", "Foldable with practical carry bag"),
      L("فتحة سحّاب واسعة للدخول والخروج", "Grande fermeture éclair pour entrer/sortir", "Wide zip entry for easy access"),
      L("عرض 2 خيمات بـ 299 درهم — توفير واضح", "2 moustiquaires pour 299 MAD — vraie économie", "2 tents for 299 MAD — clear savings"),
    ],
    features: [
      L("تصميم pop-up قابل للطي", "Design pop-up pliable", "Foldable pop-up design"),
      L("شبكة micro-mesh بيضاء", "Maille micro-fine blanche", "White micro-mesh netting"),
      L("إطار مرن أزرق", "Cadre souple bleu", "Flexible blue frame"),
      L("فتحة U بسحّاب", "Ouverture en U zippée", "U-shaped zip door"),
      L("حقيبة تخزين دائرية", "Sac de rangement rond", "Circular storage bag"),
      L("مناسبة سرير زوجي / queen", "Adaptée lit double / queen", "Fits double / queen bed"),
    ],
    specifications: [
      { label: L("النوع", "Type", "Type"), value: L("خيمة ناموس pop-up", "Moustiquaire pop-up", "Pop-up mosquito tent") },
      { label: L("اللون", "Couleur", "Color"), value: L("أبيض + إطار أزرق", "Blanc + cadre bleu", "White + blue frame") },
      { label: L("المقاس", "Taille", "Size"), value: L("سرير زوجي / queen", "Lit double / queen", "Double / queen bed") },
      { label: L("الدخول", "Accès", "Entry"), value: L("سحّاب U", "Fermeture U", "U zip door") },
      { label: L("الحمل", "Transport", "Portability"), value: L("حقيبة دائرية قابلة للطي", "Sac rond pliable", "Foldable round bag") },
      { label: L("الضمان", "Garantie", "Warranty"), value: L("6 أشهر", "6 mois", "6 months") },
    ],
    packageIncludes: [
      L("خيمة حماية من الناموس pop-up", "Moustiquaire pop-up anti-moustiques", "Pop-up mosquito bed tent"),
      L("حقيبة حمل وتخزين", "Sac de transport", "Carry / storage bag"),
    ],
    howToUse: L(
      "افتح الخيمة من الحقيبة، اترك الهيكل pop-up يتمدّد فوق السرير، ثبّت الحواف تحت المرتبة أو حسب التعليمات. استخدم السحّاب للدخول. للطي، اطوِ الهيكل بحركة دائرية وارجعها للحقيبة.",
      "Sortez la moustiquaire, laissez le pop-up se déployer sur le lit, fixez les bords sous le matelas. Utilisez la fermeture éclair. Pour ranger, pliez en cercle et remettez dans le sac.",
      "Remove from bag, let the pop-up expand over the bed, tuck edges under the mattress per instructions. Use the zip to enter. To store, fold in a circle and return to the bag."
    ),
    lifestyleScenes: [
      { id: "bedroom", emoji: "🛏️", title: L("غرفة النوم", "Chambre", "Bedroom"), description: L("نوم هادئ بلا لدغات", "Sommeil paisible sans piqûres", "Peaceful bite-free sleep") },
      { id: "kids", emoji: "👶", title: L("غرفة الأطفال", "Enfants", "Kids Room"), description: L("حماية آمنة للصغار", "Protection sûre pour les enfants", "Safe protection for kids") },
      { id: "summer", emoji: "☀️", title: L("الصيف", "Été", "Summer"), description: L("ضرورية فالحر", "Indispensable en saison chaude", "Essential in hot season") },
      { id: "travel", emoji: "🎒", title: L("السفر", "Voyage", "Travel"), description: L("حقيبة حمل — خذها معاك", "Sac compact — emportez-la", "Compact bag — take it anywhere") },
    ],
    images: [],
    lifestyleImages: [],
    variants: [
      {
        id: "var-mosquito-1",
        name: L("1 خيمة — 199 درهم", "1 moustiquaire — 199 MAD", "1 tent — 199 MAD"),
        price: 199,
        compareAtPrice: 279,
        sku: "Mosquito-protection-tent",
        stock: 120,
      },
      {
        id: "var-mosquito-2pk",
        name: L("2 خيمات — 299 درهم", "2 moustiquaires — 299 MAD", "2 tents — 299 MAD"),
        price: 299,
        compareAtPrice: 398,
        sku: "Mosquito-protection-tent-2PK",
        stock: 80,
      },
    ],
    upsellIds: ["prod-rabbit", "prod-starbt"],
    crossSellIds: ["prod-galaxy-rgb", "prod-shiatsu"],
    seo: {
      title: L(
        "خيمة الحماية من الناموس | 199 درهم · 2 بـ 299 | NOORVA المغرب",
        "Moustiquaire Pop-Up Pliable | 199 MAD · 2 pour 299 | NOORVA Maroc",
        "Foldable Mosquito Bed Tent | 199 MAD · 2 for 299 | NOORVA Morocco"
      ),
      description: L(
        "خيمة ناموس pop-up قابلة للطي بـ 199 درهم أو 2 بـ 299 درهم. تركيب سريع، شبكة دقيقة، سحّاب U. توصيل مجاني والدفع عند الاستلام في المغرب.",
        "Moustiquaire pop-up pliable à 199 MAD ou 2 pour 299 MAD. Montage rapide, maille fine, fermeture U. Livraison gratuite et COD au Maroc.",
        "Foldable pop-up mosquito tent for 199 MAD or 2 for 299 MAD. Fast setup, fine mesh, U zip. Free shipping and COD in Morocco."
      ),
    },
  },

  {
    id: "prod-dual-cooler",
    slug: "portable-rechargeable-dual-fan-air-cooler",
    name: L(
      "مبرد هواء محمول قابل للشحن مع مروحتين وتدفق هواء قوي وتصميم مكتبي أنيق",
      "Refroidisseur d'Air Portable Rechargeable — Double Ventilateur & Design Bureau",
      "Portable Rechargeable Dual-Fan Air Cooler — Strong Airflow & Elegant Desk Design"
    ),
    shortDescription: L(
      "مروحتين عموديتين · تدفق هواء واسع وقوي · بطارية قابلة للشحن · 249 درهم · توصيل مجاني والدفع عند الاستلام",
      "Double ventilateur · flux d'air large et puissant · batterie rechargeable · 249 MAD · livraison gratuite et COD",
      "Dual vertical fans · wide strong airflow · rechargeable · 249 MAD · free shipping and COD"
    ),
    description: L(
      "مبرد هواء محمول من NOORVA بتصميم برج أبيض أنيق: مروحتين دائريتين متراصّفتين لتدفق هواء أقوى ومساحة تبريد أوسع، فوهات رش خفيف، نافذة مستوى الماء، وشريط حمل جلدي. قابل للشحن — مثالي للمكتب، غرفة النوم، أو الطاولة بجانبك فالصيف. 249 درهم. توصيل مجاني في المغرب والدفع عند الاستلام.",
      "Refroidisseur portable NOORVA : tour blanche élégante, double ventilateur pour un flux plus fort, buse brume légère, indicateur d'eau, sangle de transport. Rechargeable — idéal bureau, chambre ou table en été. 249 MAD. Livraison gratuite au Maroc, paiement à la livraison.",
      "NOORVA portable air cooler: elegant white tower, dual fans for stronger wide airflow, light mist nozzles, water level window, carry strap. Rechargeable — ideal for desk, bedroom or side table in summer. 249 MAD. Free Morocco shipping, cash on delivery."
    ),
    categoryId: "cat-home-decor",
    price: 249,
    compareAtPrice: 349,
    sku: "Portable-air-cooler",
    stock: 75,
    rating: 4.8,
    reviewCount: 64,
    soldCount: 420,
    isBestSeller: true,
    isTrending: true,
    isTikTokViral: false,
    isFeatured: true,
    flashSaleEndsAt: flashEnd,
    warrantyMonths: 6,
    problemEmoji: "🥵",
    problem: L(
      "الحر فالمكتب أو الغرفة كيخلّيك ما تقدّرش تركّز؟",
      "La chaleur au bureau ou dans la chambre vous empêche de vous concentrer?",
      "Heat at your desk or room making it hard to focus?"
    ),
    problemCause: L(
      "المروحة الواحدة الصغيرة ما كتوصلش بارد كافي للمساحة",
      "Un petit ventilateur unique ne refroidit pas assez la zone",
      "A single small fan doesn't cool enough of your space"
    ),
    problemSolution: L(
      "مروحتين + تدفق واسع + محمول قابل للشحن على مكتبك",
      "Double ventilateur + flux large + portable rechargeable sur votre bureau",
      "Dual fans + wide airflow + rechargeable portable on your desk"
    ),
    deepDescription: L(
      "برج أبيض بمروحتين عموديتين: كل مروحة خلف شبكة slats بيضاء، مع فوهات رش علوية ومؤشر ماء شفاف. شريط حمل بني فاتح للتنقل، وقاعدة بيضاوية ثابتة على الطاولة. شحن USB للاستعمال اليومي في المكتب، الدراسة، أو بجانب السرير — بارد منعش بلا ما تشغّل التكييف كامل النهار.",
      "Tour blanche à deux ventilateurs superposés, grilles slats, buse brume et voyant d'eau. Sangle transport, base ovale stable. Charge USB pour bureau, études ou chevet — fraîcheur sans clim toute la journée.",
      "White tower with two stacked fans, slat grilles, mist nozzles and water window. Carry strap, stable oval base. USB charging for desk, study or bedside — fresh cooling without running AC all day."
    ),
    tags: ["cooler", "fan", "desk", "portable", "rechargeable", "summer", "home", "gift", "new", "decor"],
    benefits: [
      L("تبريد أسرع بفضل مروحتين بدل واحدة", "Refroidissement plus rapide grâce au double ventilateur", "Faster cooling with dual fans instead of one"),
      L("تدفق هواء واسع يغطي منطقة أكبر على المكتب", "Flux d'air large couvrant plus de surface sur le bureau", "Wide airflow covering more of your desk area"),
      L("قابل للشحن — خذه معاك بلا مقبس دائم", "Rechargeable — emportez-le sans prise permanente", "Rechargeable — take it without a permanent outlet"),
      L("تصميم برج أنيق يناسب أي مكتب أو غرفة", "Design tour élégant pour bureau ou chambre", "Elegant tower design for any desk or room"),
      L("خفيف مع شريط حمل عملي", "Léger avec sangle de transport pratique", "Lightweight with practical carry strap"),
      L("249 درهم — قيمة ممتازة فالصيف", "249 MAD — excellent rapport qualité-prix en été", "249 MAD — great summer value"),
    ],
    features: [
      L("مروحتان دائريتان عموديتان", "Deux ventilateurs circulaires superposés", "Two vertically stacked circular fans"),
      L("تدفق هواء قوي ومساحة ريح واسعة", "Flux d'air puissant et zone large", "Strong airflow and wide wind area"),
      L("قابل للشحن (USB)", "Rechargeable (USB)", "Rechargeable (USB)"),
      L("فوهات رش / تبريد تبخيري خفيف", "Buses brume / refroidissement évaporatif léger", "Mist nozzles / light evaporative cooling"),
      L("مؤشر مستوى الماء", "Indicateur niveau d'eau", "Water level indicator"),
      L("شريط حمل وقاعدة مستقرة", "Sangle de transport et base stable", "Carry strap and stable base"),
    ],
    specifications: [
      { label: L("النوع", "Type", "Type"), value: L("مبرد هواء محمول", "Refroidisseur portable", "Portable air cooler") },
      { label: L("اللون", "Couleur", "Color"), value: L("أبيض + شريط بني", "Blanc + sangle marron", "White + tan strap") },
      { label: L("المروحات", "Ventilateurs", "Fans"), value: L("مروحتان", "Double ventilateur", "Dual fans") },
      { label: L("الطاقة", "Alimentation", "Power"), value: L("قابل للشحن USB", "Recharge USB", "USB rechargeable") },
      { label: L("الاستخدام", "Utilisation", "Usage"), value: L("مكتب / غرفة / طاولة", "Bureau / chambre / table", "Desk / room / side table") },
      { label: L("الضمان", "Garantie", "Warranty"), value: L("6 أشهر", "6 mois", "6 months") },
    ],
    packageIncludes: [
      L("مبرد هواء محمول بمروحتين", "Refroidisseur portable double ventilateur", "Dual-fan portable air cooler"),
      L("كابل شحن USB", "Câble de charge USB", "USB charging cable"),
      L("دليل الاستخدام", "Manuel d'utilisation", "User manual"),
    ],
    howToUse: L(
      "املأ خزان الماء حسب التعليمات، شحن الجهاز عبر USB، شغّل المروحتين واضبط مستوى الريح. ضعه على مكتب أو طاولة مستقرة. للتبريد المعزّز، استعمل وضع الرش إن وُجد. أعد الشحن عندما ينخفض المؤشر.",
      "Remplissez le réservoir d'eau, chargez via USB, allumez les ventilateurs et réglez le flux. Placez sur un bureau stable. Utilisez la brume si disponible. Rechargez quand nécessaire.",
      "Fill the water tank per instructions, charge via USB, turn on both fans and adjust airflow. Place on a stable desk or table. Use mist mode if available. Recharge when needed."
    ),
    lifestyleScenes: [
      { id: "desk", emoji: "🖥️", title: L("المكتب", "Bureau", "Desk"), description: L("هواء منعش أثناء العمل", "Air frais pendant le travail", "Fresh air while you work") },
      { id: "bedroom", emoji: "🛏️", title: L("غرفة النوم", "Chambre", "Bedroom"), description: L("برد خفيف بجانب السرير", "Fraîcheur légère au chevet", "Light cooling by the bed") },
      { id: "study", emoji: "📚", title: L("الدراسة", "Études", "Study"), description: L("تركيز أفضل فالحر", "Meilleure concentration par la chaleur", "Better focus in the heat") },
      { id: "summer", emoji: "☀️", title: L("الصيف", "Été", "Summer"), description: L("رفيقك اليومي فالحر", "Votre allié quotidien en été", "Your daily summer companion") },
    ],
    images: [],
    lifestyleImages: [],
    variants: [
      {
        id: "var-dual-cooler",
        name: L("أبيض", "Blanc", "White"),
        price: 249,
        compareAtPrice: 349,
        sku: "Portable-air-cooler",
        stock: 75,
      },
    ],
    upsellIds: ["prod-shiatsu", "prod-mosquito-tent"],
    crossSellIds: ["prod-starbt", "prod-car-mount"],
    seo: {
      title: L(
        "مبرد هواء محمول بمروحتين | 249 درهم | NOORVA المغرب",
        "Refroidisseur Portable Double Ventilateur | 249 MAD | NOORVA Maroc",
        "Portable Dual-Fan Air Cooler | 249 MAD | NOORVA Morocco"
      ),
      description: L(
        "مبرد هواء محمول قابل للشحن مع مروحتين وتدفق هواء قوي بـ 249 درهم. تصميم مكتبي أنيق. توصيل مجاني والدفع عند الاستلام في المغرب.",
        "Refroidisseur portable rechargeable double ventilateur à 249 MAD. Design bureau élégant. Livraison gratuite et COD au Maroc.",
        "Portable rechargeable dual-fan air cooler for 249 MAD. Elegant desk design. Free shipping and COD in Morocco."
      ),
    },
  },

  {
    id: "prod-vintage-lantern",
    slug: "vintage-led-lantern",
    name: L(
      "فانوس LED كلاسيكي للديكور والإضاءة الدافئة",
      "Lanterne LED Vintage — Déco & Lumière Chaleureuse",
      "Vintage LED Lantern — Warm Decor Lighting"
    ),
    shortDescription: L(
      "فانوس LED بستايل كلاسيكي كيخلي أي بلاصة دافئة ومميزة · 229 درهم · عرض جوج بـ 319 درهم · الدفع عند الاستلام",
      "Lanterne LED style classique pour une ambiance chaleureuse · 229 MAD · 2 pour 319 MAD · COD",
      "Classic-style LED lantern for warm ambiance · 229 MAD · 2 for 319 MAD · cash on delivery"
    ),
    description: L(
      "فانوس LED من NOORVA بستايل Hurricane كلاسيكي: تشطيب Vintage برونزي/ذهبي م distressed، كرة زجاجية frosted كتضوي بضوء كهرماني دافئ، قفص سلكي على شكل X، أنابيب جانبية منحنية، ومقبض سلكي أسود. كيضيف جو دافئ وأنيق للصالون، غرفة النوم، التراس، الحديقة والتخييم. قطعة بـ 229 درهم أو جوج بـ 319 درهم (توفير 139 درهم). توصيل مجاني والدفع عند الاستلام في المغرب.",
      "Lanterne LED NOORVA style Hurricane : finition bronze/or vintage, globe givré lumière ambrée, cage fil X, tubes latéraux, poignée noire. Ambiance chaleureuse salon, chambre, terrasse, jardin, camping. 229 MAD l'unité ou 2 pour 319 MAD (139 MAD d'économie). Livraison gratuite et COD au Maroc.",
      "NOORVA classic Hurricane-style LED lantern: distressed bronze/gold vintage finish, frosted amber glow globe, X-wire cage, curved side tubes, black wire handle. Warm elegant ambiance for living room, bedroom, terrace, garden and camping. 229 MAD each or 2 for 319 MAD (save 139 MAD). Free Morocco shipping and cash on delivery."
    ),
    categoryId: "cat-home-decor",
    price: 229,
    sku: "NRV-LANTERN-01",
    stock: 85,
    rating: 0,
    reviewCount: 0,
    soldCount: 0,
    isBestSeller: false,
    isTrending: true,
    isTikTokViral: false,
    isFeatured: true,
    warrantyMonths: 6,
    problemEmoji: "🏮",
    problem: L(
      "حاس براسك الدار ناقصها داك الجو الدافئ؟",
      "Il manque une ambiance chaleureuse chez vous?",
      "Feel like your home is missing that warm cozy glow?"
    ),
    problemCause: L(
      "الإضاءة العادية كتضوي… ولكن ما كتخلقش الجو",
      "La lumière ordinaire éclaire sans créer d'ambiance",
      "Regular lighting illuminates but doesn't create atmosphere"
    ),
    problemSolution: L(
      "إضاءة دافئة + شكل Vintage كلاسيكي فمنتج واحد",
      "Lumière chaleureuse + style vintage classique en un seul objet",
      "Warm lighting + classic vintage look in one piece"
    ),
    deepDescription: L(
      "فانوس LED بارتفاع 35 سم بتصميم Hurricane تقليدي: قاعدة دائرية متدرجة مع زر تشغيل ومقبض dimmer، كرة إضاءة frosted، قفص حماية سلكي، أنبوبان جانبيان يربطان القاعدة بالغطاء العلوي، ومقبض حمل سلكي. تشطيب برونزي/ذهبي antique distressed. مناسب للديكور الداخلي والخارجي والهدايا.",
      "Lanterne LED 35 cm style Hurricane : base à gradins avec bouton et variateur, globe givré, cage fil, tubes latéraux, poignée. Finition bronze/or antique. Déco intérieure, extérieure et cadeaux.",
      "35cm Hurricane-style LED lantern: tiered base with power button and dimmer knob, frosted globe, wire cage, side tubes, carry handle. Distressed antique bronze/gold finish. Indoor/outdoor decor and gifts."
    ),
    tags: ["decor", "bedroom", "gift", "new", "lantern", "vintage", "home"],
    benefits: [
      L("إضاءة دافئة — كيعطي جو مريح ودافئ خصوصاً فالليل", "Lumière chaleureuse — ambiance cosy surtout la nuit", "Warm glow — cozy atmosphere especially at night"),
      L("ستايل كلاسيكي — الشكل Vintage كيضيف لمسة مميزة", "Style classique — touche vintage distinctive", "Classic style — distinctive vintage touch"),
      L("لدار وبرا — صالون، تراس، حديقة وخرجات", "Intérieur & extérieur — salon, terrasse, jardin", "Indoor & outdoor — living room, terrace, garden"),
      L("اختيار زوين للهدية — ديكور واستعمال فمنتج واحد", "Idée cadeau — déco et usage réunis", "Great gift — decor and utility in one"),
    ],
    features: [
      L("تصميم Hurricane كلاسيكي", "Design Hurricane classique", "Classic Hurricane design"),
      L("تشطيب Vintage برونزي/ذهبي", "Finition vintage bronze/or", "Distressed bronze/gold vintage finish"),
      L("إضاءة LED كهرمانية دافئة", "LED ambrée chaleureuse", "Warm amber LED glow"),
      L("قفص سلكي حماية", "Cage fil de protection", "Protective wire cage"),
      L("مقبض حمل سلكي", "Poignée de transport", "Wire carry handle"),
      L("زر تشغيل + مقبض dimmer", "Bouton marche + variateur", "Power button + dimmer knob"),
    ],
    specifications: [
      { label: L("النوع", "Type", "Type"), value: L("فانوس LED ديكور", "Lanterne LED déco", "Decor LED lantern") },
      { label: L("الارتفاع", "Hauteur", "Height"), value: L("35 سم", "35 cm", "35 cm") },
      { label: L("الستايل", "Style", "Style"), value: L("Vintage Hurricane", "Hurricane vintage", "Vintage Hurricane") },
      { label: L("اللون", "Couleur", "Color"), value: L("برونزي/ذهبي antique", "Bronze/or antique", "Antique bronze/gold") },
      { label: L("الإضاءة", "Éclairage", "Lighting"), value: L("LED دافئة كهرمانية", "LED ambrée chaleureuse", "Warm amber LED") },
    ],
    packageIncludes: [
      L("فانوس LED كلاسيكي", "Lanterne LED classique", "Classic LED lantern"),
    ],
    howToUse: L(
      "حط الفانوس على طاولة أو رف، شغّله بالزر فالقاعدة واضبط الإضاءة بالمقبض. مناسب للصالون، غرفة النوم، التراس، الحديقة أو التخييم.",
      "Placez la lanterne sur une table ou étagère, allumez avec le bouton et réglez la lumière avec le variateur. Salon, chambre, terrasse, jardin ou camping.",
      "Place the lantern on a table or shelf, press the base power button and adjust brightness with the dimmer knob. For living room, bedroom, terrace, garden or camping."
    ),
    lifestyleScenes: [
      { id: "living", emoji: "🛋️", title: L("الصالون", "Salon", "Living room"), description: L("جو دافئ وأنيق", "Ambiance chaleureuse", "Warm elegant mood") },
      { id: "terrace", emoji: "🌙", title: L("التراس", "Terrasse", "Terrace"), description: L("أمسيات مميزة", "Soirées cosy", "Cozy evenings") },
      { id: "outdoor", emoji: "⛺", title: L("الخرجات", "Extérieur", "Outdoors"), description: L("تخييم وحديقة", "Camping et jardin", "Camping and garden") },
      { id: "gift", emoji: "🎁", title: L("هدية", "Cadeau", "Gift"), description: L("فكرة هدية جميلة", "Belle idée cadeau", "Beautiful gift idea") },
    ],
    images: [],
    lifestyleImages: [],
    variants: [
      {
        id: "var-lantern-1",
        name: L("قطعة وحدة — 229 درهم", "1 lanterne — 229 MAD", "1 lantern — 229 MAD"),
        price: 229,
        sku: "NRV-LANTERN-01",
        stock: 85,
      },
      {
        id: "var-lantern-2pk",
        name: L("جوج قطع — 319 درهم", "2 lanternes — 319 MAD", "2 lanterns — 319 MAD"),
        price: 319,
        compareAtPrice: 458,
        sku: "NRV-LANTERN-01-2PK",
        stock: 60,
      },
    ],
    upsellIds: ["prod-rabbit", "prod-starbt"],
    crossSellIds: ["prod-mosquito-tent", "prod-galaxy-rgb"],
    seo: {
      title: L(
        "فانوس LED كلاسيكي للديكور والإضاءة | 229 DH",
        "Lanterne LED Classique Déco | 229 MAD | NOORVA",
        "Classic LED Lantern Decor | 229 MAD | NOORVA"
      ),
      description: L(
        "اكتشف فانوس LED بستايل كلاسيكي كيضيف جو دافئ وأنيق للدار، التراس والخرجات. قطعة بـ229 DH أو جوج بـ319 DH.",
        "Lanterne LED style classique pour une ambiance chaleureuse. 229 MAD l'unité ou 2 pour 319 MAD. COD au Maroc.",
        "Classic LED lantern for warm elegant ambiance. 229 MAD each or 2 for 319 MAD. Cash on delivery in Morocco."
      ),
    },
  },
];

export const reviews: ProductReview[] = [
  { id: "r1", productId: "prod-mx003", author: "سارة المنصوري", city: "الدار البيضاء", rating: 5, title: L("حولت غرفتي!", "Chambre transformée!", "Transformed my room!"), content: L("بروجيكتور MX003 رائع، والبلوتوث كيخدم مزيان بزاف. التوصيل سريع والدفع عند الاستلام مريح.", "Projecteur MX003 génial, le Bluetooth fonctionne super bien. Livraison rapide.", "MX003 projector is amazing, Bluetooth works great. Fast delivery."), date: "2026-06-20", verified: true, images: [resolveProductImage("astronaut-bt-speaker-projector", "04-bedroom", "thumbnail")] },
  { id: "r2", productId: "prod-aurora", author: "يوسف العلوي", city: "الرباط", rating: 5, title: L("فيرال تيك توك", "Viral TikTok", "TikTok viral"), content: L("بروجيكتور الأورورا الأبيض كيعطي تصوير خرافي. القمر والنجوم والبلوتوث زوينين بزاف.", "Le projecteur aurore blanc est parfait pour les Reels. Lune, étoiles et Bluetooth au top.", "The white aurora projector is perfect for Reels. Moon, stars and Bluetooth are amazing."), date: "2026-06-18", verified: true, images: [resolveProductImage("northern-lights-galaxy-projector", "06-gaming-room", "thumbnail")], hasVideo: true },
  { id: "r3", productId: "prod-rabbit", author: "إيمان بنجلون", city: "مراكش", rating: 5, title: L("هدية بنتي", "Cadeau fille", "Daughter gift"), content: L("كاروسيل الأرانب زوين بزاف والإسقاط كيهنّي بنتي بسرعة.", "Le carrousel lapin est adorable et la projection calme ma fille rapidement.", "The rabbit carousel is adorable and the projection calms my daughter fast."), date: "2026-06-12", verified: true, images: [resolveProductImage("rabbit-carousel-night-light", "04-bedroom", "thumbnail")] },
  { id: "r4", productId: "prod-starbt", author: "أمين التازي", city: "طنجة", rating: 5, title: L("جودة عالية", "Haute qualité", "High quality"), content: L("بروجيكتور المجرة كيشعل الغرفة كاملة، البلوتوث زوين والمؤقت 1س/2س مفيد بزاف.", "Le projecteur galaxie illumine toute la pièce, Bluetooth top et minuterie 1h/2h très utile.", "Galaxy projector lights the whole room, Bluetooth is great and the 1h/2h timer is very useful."), date: "2026-06-08", verified: true, images: [resolveProductImage("bluetooth-star-projector", "05-living-room", "thumbnail")] },
  { id: "r5", productId: "prod-aurora", author: "خديجة الفاسي", city: "فاس", rating: 5, title: L("خدمة ممتازة", "Service top", "Great service"), content: L("طلبت بالواتساب والدفع عند الاستلام. الريموت ساهل والأورورا كتهنّي قبل النوم.", "Commande COD facile, télécommande simple, aurore parfaite avant de dormir.", "Easy COD order, simple remote, perfect aurora before sleep."), date: "2026-06-01", verified: true, images: [resolveProductImage("northern-lights-galaxy-projector", "04-bedroom", "thumbnail")] },
  { id: "r6", productId: "prod-mx003", author: "محمد برادة", city: "أكادير", rating: 5, title: L("أجواء سينمائية", "Ambiance cinéma", "Cinema vibe"), content: L("شريت جوج بروجيكتورات MX003. الغرفة ولاّت سينما بصوت البلوتوث.", "Deux projecteurs MX003 = ambiance cinéma avec le Bluetooth.", "Two MX003 projectors = cinema vibe with Bluetooth sound."), date: "2026-05-25", verified: true, hasVideo: true },
  { id: "r7", productId: "prod-starbt", author: "نور الهدى", city: "الدار البيضاء", rating: 5, title: L("أحسن شراء", "Meilleur achat", "Best purchase"), content: L("21 وضع إضاءة والموسيقى مع البلوتوث كتهنّي بنتي قبل النوم.", "21 modes et la musique Bluetooth calment ma fille avant de dormir.", "21 light modes and Bluetooth music calm my daughter before sleep."), date: "2026-05-18", verified: true, images: [resolveProductImage("bluetooth-star-projector", "05-living-room", "thumbnail")] },
  { id: "r8", productId: "prod-rabbit", author: "كريم بنعيسى", city: "الرباط", rating: 4, title: L("كيوت وفاخر", "Mignon et premium", "Cute and premium"), content: L("كاروسيل الأرانب كيوت بزاف. الهدية ممتازة لبنتي.", "Le carrousel lapin est trop mignon. Cadeau parfait pour ma fille.", "The rabbit carousel is super cute. Perfect gift for my daughter."), date: "2026-05-10", verified: true },
  // Green Laser Pointer 303 — 25 Moroccan reviews
  { id: "rl1", productId: "prod-laser303", author: "ياسين الإدريسي", city: "الدار البيضاء", rating: 5, title: L("شعاع قوي بزاف", "Faisceau ultra puissant", "Very powerful beam"), content: L("الليزر الأخضر قوي وواضح حتى من بعيد. جودة الألومنيوم ممتازة والتوصيل سريع.", "Le laser vert est puissant et visible de loin. Aluminium top, livraison rapide.", "The green laser is powerful and visible from afar. Great aluminum quality, fast delivery."), date: "2026-07-22", verified: true, images: [resolveProductImage("green-laser-pointer-303", "02-premium-hero", "thumbnail")] },
  { id: "rl2", productId: "prod-laser303", author: "سارة بناني", city: "الرباط", rating: 5, title: L("مثالي للفلك", "Parfait pour l'astronomie", "Perfect for astronomy"), content: L("كنستعملوه باش نشير للنجوم مع ولادي. ساهل وخفيف والدفع عند الاستلام مريح.", "Je l'utilise pour montrer les étoiles aux enfants. Léger, simple, COD pratique.", "I use it to point at stars with my kids. Light, simple, COD is convenient."), date: "2026-07-20", verified: true },
  { id: "rl3", productId: "prod-laser303", author: "أمينة العلوي", city: "مراكش", rating: 5, title: L("هدية زوينة", "Beau cadeau", "Great gift"), content: L("شريتو لخويا لهواة التخييم. عجبو الشعاع الأخضر والعلبة كاملة.", "Acheté pour mon frère campeur. Il a adoré le faisceau vert et le pack complet.", "Bought for my camping brother. He loved the green beam and full pack."), date: "2026-07-18", verified: true, images: [resolveProductImage("green-laser-pointer-303", "11-package-contents", "thumbnail")] },
  { id: "rl4", productId: "prod-laser303", author: "محمد التازي", city: "طنجة", rating: 5, title: L("جودة فاخرة", "Qualité premium", "Premium quality"), content: L("الجسم متين والقبضة مريحة. الشحن USB عملي بزاف ما بقيتش نشري بطاريات.", "Corps solide, prise en main confortable. La charge USB est super pratique.", "Solid body, comfortable grip. USB charging is very practical."), date: "2026-07-16", verified: true },
  { id: "rl5", productId: "prod-laser303", author: "خالد الفاسي", city: "فاس", rating: 5, title: L("للعروض المهنية", "Pour présentations", "For presentations"), content: L("كنستعملوه فالعروض ديالي. الشعاع واضح والتصميم احترافي.", "Je l'utilise en présentation. Faisceau clair et design pro.", "I use it in presentations. Clear beam and pro design."), date: "2026-07-14", verified: true },
  { id: "rl6", productId: "prod-laser303", author: "نادية الشرايبي", city: "أكادير", rating: 5, title: L("توصيل مجاني", "Livraison gratuite", "Free delivery"), content: L("وصلني فـ 48 ساعة لأكادير. المنتج مطابق للصور والجودة عالية.", "Reçu en 48h à Agadir. Conforme aux photos, qualité élevée.", "Received in 48h in Agadir. Matches photos, high quality."), date: "2026-07-12", verified: true },
  { id: "rl7", productId: "prod-laser303", author: "يوسف برادة", city: "مكناس", rating: 4, title: L("زوين للتخييم", "Top camping", "Great for camping"), content: L("خذاوه معايا فالتخييم. الشعاع كيظهر مزيان فالليل. غير خاصك تحترم السلامة.", "Parfait en camping, très visible la nuit. Respectez toujours la sécurité.", "Perfect for camping, very visible at night. Always respect safety."), date: "2026-07-10", verified: true, images: [resolveProductImage("green-laser-pointer-303", "14-product-in-use", "thumbnail")] },
  { id: "rl8", productId: "prod-laser303", author: "إيمان الوردي", city: "وجدة", rating: 5, title: L("أحسن من المتوقع", "Mieux qu'attendu", "Better than expected"), content: L("الصور ما غالطاش. الليزر قوي والعلبة فيها كلشي: كابل، حزام، ومفاتيح.", "Photos fidèles. Laser puissant, pack complet: câble, dragonne, clés.", "Photos are accurate. Powerful laser, full pack: cable, strap, keys."), date: "2026-07-08", verified: true },
  { id: "rl9", productId: "prod-laser303", author: "حمزة السملالي", city: "القنيطرة", rating: 5, title: L("خفيف وعملي", "Léger et pratique", "Light and practical"), content: L("ما كيحسّش بالوزن فالجيب. الزر ساهل والاستجابة فورية.", "Presque rien dans la poche. Bouton facile, réponse immédiate.", "Barely noticeable in the pocket. Easy button, instant response."), date: "2026-07-06", verified: true },
  { id: "rl10", productId: "prod-laser303", author: "ليلى المنصوري", city: "سلا", rating: 5, title: L("دفع عند الاستلام", "Paiement à la livraison", "Cash on delivery"), content: L("طلبت بلا بطاقة وخلّصت كاش. الخدمة زوينة والليزر خدام مزيان.", "Commandé sans carte, payé cash. Service top, laser impeccable.", "Ordered without a card, paid cash. Great service, laser works well."), date: "2026-07-04", verified: true },
  { id: "rl11", productId: "prod-laser303", author: "عمر بنجلون", city: "تطوان", rating: 5, title: L("غطاء النجوم زوين", "Capuchon étoiles top", "Star cap is cool"), content: L("غطاء النجوم كيعطي أنماط جميلة. الولاد تحمّقو عليه فالحديقة.", "Le capuchon étoiles fait de beaux motifs. Les enfants ont adoré.", "The star cap makes beautiful patterns. The kids loved it."), date: "2026-07-02", verified: true, images: [resolveProductImage("green-laser-pointer-303", "10-features", "thumbnail")] },
  { id: "rl12", productId: "prod-laser303", author: "سلمى الحسني", city: "الجديدة", rating: 5, title: L("تصميم احترافي", "Design pro", "Pro design"), content: L("اللون الأسود والقبضة المضلعّة كيبان فاخر. يستاهل الثمن.", "Noir mat et grip diamanté: look premium. Ça vaut le prix.", "Matte black and knurled grip look premium. Worth the price."), date: "2026-06-30", verified: true },
  { id: "rl13", productId: "prod-laser303", author: "رشيد الزياني", city: "آسفي", rating: 5, title: L("مدى بعيد", "Longue portée", "Long range"), content: L("جربتو فالليل فالشاطئ، الشعاع باين من بعيد بزاف. جودة عالية.", "Testé la nuit à la plage: faisceau visible de très loin. Haute qualité.", "Tested at night on the beach: beam visible from very far. High quality."), date: "2026-06-28", verified: true },
  { id: "rl14", productId: "prod-laser303", author: "فاطمة الزهراء", city: "بني ملال", rating: 5, title: L("شحن سريع", "Expédition rapide", "Fast shipping"), content: L("طلبت نهار الثلاثاء ووصلني الخميس. التغليف محمي مزيان.", "Commandé mardi, reçu jeudi. Emballage bien protégé.", "Ordered Tuesday, received Thursday. Well-protected packaging."), date: "2026-06-26", verified: true },
  { id: "rl15", productId: "prod-laser303", author: "عبدالرحيم الناصري", city: "الناظور", rating: 4, title: L("قيمة ممتازة", "Excellent rapport qualité-prix", "Great value"), content: L("بـ 199 درهم الجودة أحسن من اللي كنت كنتسنّى. البطارية كتدوم.", "Pour 199 MAD, mieux que prévu. La batterie tient bien.", "For 199 MAD, better than expected. Battery lasts well."), date: "2026-06-24", verified: true },
  { id: "rl16", productId: "prod-laser303", author: "مريم الكتاني", city: "المحمدية", rating: 5, title: L("سهل الاستخدام", "Facile à utiliser", "Easy to use"), content: L("حتى أمي عرفات كيفاش تستعملوه. زر واحد وكلشي واضح.", "Même ma mère a compris tout de suite. Un bouton, c'est clair.", "Even my mom got it instantly. One button, very clear."), date: "2026-06-22", verified: true },
  { id: "rl17", productId: "prod-laser303", author: "أنس الجابري", city: "خريبكة", rating: 5, title: L("للاستخدام الميداني", "Usage terrain", "Field use"), content: L("كنستعملوه فالشانطيي باش نشير للنقاط. متين وما كيخافش من الاستعمال اليومي.", "Je l'utilise sur chantier pour indiquer les points. Robuste au quotidien.", "I use it on site to mark points. Robust for daily use."), date: "2026-06-20", verified: true },
  { id: "rl18", productId: "prod-laser303", author: "حنان بوستة", city: "سطات", rating: 5, title: L("رضا تام", "Satisfaction totale", "Fully satisfied"), content: L("المنتج فاخر والخدمة ديال NOORVA زوينة. غادي نعاود نطلب.", "Produit premium et service NOORVA au top. Je recommanderai.", "Premium product and great NOORVA service. I'll order again."), date: "2026-06-18", verified: true },
  { id: "rl19", productId: "prod-laser303", author: "طارق المرابط", city: "تازة", rating: 5, title: L("شعاع أخضر نقي", "Vert pur et net", "Pure clean green"), content: L("اللون الأخضر نقي والبقعة دقيقة. أحسن من ليزر رخيص من السوق.", "Vert pur, point précis. Bien mieux qu'un laser bas de gamme.", "Pure green, precise spot. Much better than a cheap market laser."), date: "2026-06-16", verified: true, images: [resolveProductImage("green-laser-pointer-303", "09-close-up", "thumbnail")] },
  { id: "rl20", productId: "prod-laser303", author: "إيمان الصديقي", city: "الحسيمة", rating: 5, title: L("علبة كاملة", "Pack complet", "Complete pack"), content: L("لقيت الكابل والحزام والمفاتيح وغطاء النجوم. كلشي منظم.", "Câble, dragonne, clés et capuchon inclus. Tout est bien rangé.", "Cable, strap, keys and star cap included. Everything well packed."), date: "2026-06-14", verified: true },
  { id: "rl21", productId: "prod-laser303", author: "سعيد العماري", city: "ورزازات", rating: 5, title: L("للسماء الليلية", "Ciel nocturne", "Night sky"), content: L("فصحراء ورزازات السماء صافية والليزر كيبان خرافي مع النجوم.", "À Ouarzazate le ciel est clair: le laser est magique avec les étoiles.", "In Ouarzazate the sky is clear: the laser looks magical with the stars."), date: "2026-06-12", verified: true, images: [resolveProductImage("green-laser-pointer-303", "03-lifestyle", "thumbnail")] },
  { id: "rl22", productId: "prod-laser303", author: "زينب الإدريسي", city: "العيون", rating: 5, title: L("ثقة وكمان", "Confiance totale", "Full trust"), content: L("أول طلب من NOORVA وكان ناجح. التوصيل للمجنوب كان مرتب.", "1re commande NOORVA réussie. Livraison vers le sud impeccable.", "First NOORVA order was a success. Southern delivery was smooth."), date: "2026-06-10", verified: true },
  { id: "rl23", productId: "prod-laser303", author: "كريم الودغيري", city: "الدار البيضاء", rating: 5, title: L("أفضل شراء", "Meilleur achat", "Best purchase"), content: L("جربت بزاف ديال الليزر رخيص، هادا الفرق واضح فالجودة والمدى.", "Après plusieurs lasers cheap, celui-ci marque la différence.", "After many cheap lasers, this one clearly stands out."), date: "2026-06-08", verified: true },
  { id: "rl24", productId: "prod-laser303", author: "أسماء بنصالح", city: "الرباط", rating: 5, title: L("موصى به", "Je recommande", "Highly recommend"), content: L("للأساتذة والمدربين زوين بزاف. كيبان واضح فالمدرجات.", "Parfait pour profs et formateurs. Très visible en amphithéâtre.", "Perfect for teachers and trainers. Very visible in lecture halls."), date: "2026-06-06", verified: true },
  { id: "rl25", productId: "prod-laser303", author: "هشام التومي", city: "مراكش", rating: 5, title: L("عرض محدود يستاهل", "Offre limitée à saisir", "Limited offer worth it"), content: L("خدّيتو بـ 199 بدل 299. الجودة فاخرة والاقتصاد واضح. مبروك NOORVA.", "Pris à 199 au lieu de 299. Qualité premium, vraie économie. Bravo NOORVA.", "Got it for 199 instead of 299. Premium quality, real savings. Well done NOORVA."), date: "2026-06-04", verified: true },
  // Maidsail Magnetic Car Phone Mount — customer UGC reviews
  {
    id: "rcm1",
    productId: "prod-car-mount",
    author: "سارة المنصوري",
    city: "الدار البيضاء",
    rating: 5,
    title: L("المغناطيس قوي بزاف", "Aimant très fort", "Very strong magnet"),
    content: L(
      "ثبّتو على لوحة القيادة والجوال ما كيتحركش حتى فالمطبات. الشكل أنيق وما كياخدش مساحة. أنصح به.",
      "Fixé sur le tableau de bord, le téléphone ne bouge pas même sur les bosses. Design élégant et compact. Je recommande.",
      "Mounted on the dashboard — phone stays put even on bumps. Sleek and compact. Highly recommend."
    ),
    date: "2026-07-28",
    verified: true,
    images: ["/reviews/magnetic-car-phone-mount-maidsail/05-dash-phone-thumb.webp"],
  },
  {
    id: "rcm2",
    productId: "prod-car-mount",
    author: "يوسف العلوي",
    city: "الرباط",
    rating: 5,
    title: L("جودة فاخرة", "Qualité premium", "Premium quality"),
    content: L(
      "الشفط محكم والذراع ساهل للتعديل. المنتج خفيف ومتين، والتوصيل سريع والدفع عند الاستلام مريح.",
      "Ventouse solide, bras facile à régler. Léger et robuste, livraison rapide, COD pratique.",
      "Solid suction, easy arm adjustment. Light and sturdy, fast delivery, COD is convenient."
    ),
    date: "2026-07-26",
    verified: true,
    images: ["/reviews/magnetic-car-phone-mount-maidsail/01-hand-hold-thumb.webp"],
  },
  {
    id: "rcm3",
    productId: "prod-car-mount",
    author: "أمين التازي",
    city: "طنجة",
    rating: 5,
    title: L("يناسب الشاشات الكبيرة", "Parfait pour grand écran", "Fits large screens"),
    content: L(
      "ركبته فوق الشاشة ديال السيارة وثبت مزيان. ما كيحجبش الرؤية وكيخلي الملاحة واضحة.",
      "Installé au-dessus de l’écran: très stable, ne gêne pas la vue, GPS bien visible.",
      "Mounted above the car screen — stable, doesn’t block the view, GPS stays clear."
    ),
    date: "2026-07-24",
    verified: true,
    images: ["/reviews/magnetic-car-phone-mount-maidsail/04-dash-screen-thumb.webp"],
  },
  {
    id: "rcm4",
    productId: "prod-car-mount",
    author: "إيمان بنجلون",
    city: "مراكش",
    rating: 5,
    title: L("زوين على الزجاج", "Top sur la vitre", "Great on the window"),
    content: L(
      "ثبّتو على الزجاج الجانبي للملاحة. المغناطيس كيشد الجوال بقوة والزاوية ممتازة للقيادة.",
      "Fixé sur la vitre latérale pour le GPS. Aimant très accrocheur, angle parfait en conduite.",
      "Fixed on the side window for navigation. Strong magnet, perfect driving angle."
    ),
    date: "2026-07-22",
    verified: true,
    images: ["/reviews/magnetic-car-phone-mount-maidsail/02-window-nav-thumb.webp"],
  },
  {
    id: "rcm5",
    productId: "prod-car-mount",
    author: "خالد الفاسي",
    city: "فاس",
    rating: 5,
    title: L("تصميم أنيق وثابت", "Design élégant et stable", "Sleek and stable"),
    content: L(
      "الحلقة المغناطيسية والشفط على الزجاج ثابتين بزاف. شكله أنيق وما كياخدش بلاصة. يستاهل الثمن.",
      "Anneau magnétique et ventouse sur vitre très stables. Look élégant, peu encombrant. Ça vaut le prix.",
      "Magnetic ring and window suction are very stable. Elegant, compact. Worth the price."
    ),
    date: "2026-07-20",
    verified: true,
    images: ["/reviews/magnetic-car-phone-mount-maidsail/03-window-ring-thumb.webp"],
  },
  // Foldable Mosquito Bed Tent — customer UGC reviews
  {
    id: "rmt1",
    productId: "prod-mosquito-tent",
    author: "فاطمة الزهراء",
    city: "الدار البيضاء",
    rating: 5,
    title: L("تركيب سريع على السرير", "Installation rapide sur le lit", "Quick bed setup"),
    content: L(
      "وصلتني بسرعة وتركيبها pop-up فعلاً فثوانٍ. الشبكة دقيقة والإطار الأزرق متين، بنتي كتنام بلا لدغات.",
      "Livraison rapide, montage pop-up en secondes. Maille fine, cadre bleu solide — ma fille dort sans piqures.",
      "Fast delivery, pop-up setup in seconds. Fine mesh, sturdy blue frame — my daughter sleeps bite-free."
    ),
    date: "2026-07-30",
    verified: true,
    images: ["/reviews/foldable-mosquito-bed-tent/01-bedroom-floral-thumb.webp"],
  },
  {
    id: "rmt2",
    productId: "prod-mosquito-tent",
    author: "سمية العلوي",
    city: "فاس",
    rating: 5,
    title: L("الحقيبة عملية بزاف", "Sac très pratique", "Very handy bag"),
    content: L(
      "الحقيبة الدائرية كتسهّل التخزين والسفر. فتحتها فوق السرير وخدمات مباشرة، جودة الشبكة واضحة.",
      "Le sac rond facilite le rangement et le voyage. Déployée sur le lit tout de suite, maille de qualité.",
      "The round bag makes storage and travel easy. Opened on the bed right away — quality mesh."
    ),
    date: "2026-07-27",
    verified: true,
    images: ["/reviews/foldable-mosquito-bed-tent/02-carry-bag-setup-thumb.webp"],
  },
  {
    id: "rmt3",
    productId: "prod-mosquito-tent",
    author: "نadia الشرايبي",
    city: "مراكش",
    rating: 5,
    title: L("السحّاب واسع وساهل", "Grande fermeture éclair", "Wide easy zip"),
    content: L(
      "الدخول والخروج سهل بلا ما نحيد الخيمة. السحّاب مزدوج وكيخدم مزيان، مناسبة للسرير الزوجي.",
      "Entrer/sortir facile sans retirer la moustiquaire. Double fermeture éclair, parfaite pour lit double.",
      "Easy in and out without removing the tent. Double zip works well, fits our double bed."
    ),
    date: "2026-07-24",
    verified: true,
    images: ["/reviews/foldable-mosquito-bed-tent/03-door-open-thumb.webp"],
  },
  {
    id: "rmt4",
    productId: "prod-mosquito-tent",
    author: "خديجة التازي",
    city: "طنجة",
    rating: 5,
    title: L("تغطي السرير كامل", "Couvre tout le lit", "Covers the whole bed"),
    content: L(
      "كتحمي السرير كامل من الناموس. التركيب pop-up ما خداش وقت وما محتاجاش أدوات، الدفع عند الاستلام مريح.",
      "Protège tout le lit des moustiques. Montage pop-up sans outils, paiement à la livraison pratique.",
      "Protects the whole bed from mosquitoes. Pop-up setup with no tools, COD was convenient."
    ),
    date: "2026-07-21",
    verified: true,
    images: ["/reviews/foldable-mosquito-bed-tent/04-bedroom-zip-open-thumb.webp"],
  },
  {
    id: "rmt5",
    productId: "prod-mosquito-tent",
    author: "أمين برادة",
    city: "أكادير",
    rating: 5,
    title: L("عرض جوج خيمات يستاهل", "Offre 2 moustiquaires top", "2-tent deal worth it"),
    content: L(
      "خديت عرض 2 ب299 درهم — وحدة للغرفة ووحدة للضيوف. التوفير واضح والجودة ممتازة.",
      "Pris l'offre 2 pour 299 MAD — une pour la chambre, une pour les invités. Vraie économie, bonne qualité.",
      "Got the 2 for 299 MAD deal — one for our room, one for guests. Clear savings, great quality."
    ),
    date: "2026-07-18",
    verified: true,
    images: ["/reviews/foldable-mosquito-bed-tent/05-two-tents-pack-thumb.webp"],
  },
  {
    id: "rmt6",
    productId: "prod-mosquito-tent",
    author: "إيمان بنجلون",
    city: "الرباط",
    rating: 5,
    title: L("مثالية لغرفة الأطفال", "Parfaite chambre enfant", "Perfect for kids room"),
    content: L(
      "ركبتها فغرفة الولاد وما بقاوش يتعبو من الناموس. الخيمة واسعة من الداخل وتهوية مزيانة.",
      "Installée dans la chambre des enfants, fini les moustiques. Spacieuse à l'intérieur, bonne aération.",
      "Set up in the kids room — no more mosquito trouble. Spacious inside with good airflow."
    ),
    date: "2026-07-15",
    verified: true,
    images: ["/reviews/foldable-mosquito-bed-tent/06-kids-room-thumb.webp"],
  },
  // Shiatsu Neck & Shoulder Massager — 25 Moroccan French reviews (~4.9 avg)
  { id: "rs1", productId: "prod-shiatsu", author: "Yassine El Idrissi", city: "Casablanca", rating: 5, title: L("ارتياح فوري", "Soulagement immédiat", "Instant relief"), content: L("بعد يوم المكتب رقبتني كترتاح في 10 دقايق. التدفئة زوينة بزاف.", "Après le bureau, mon cou se détend en 10 minutes. Le chauffage est excellent.", "After work, my neck relaxes in 10 minutes. The heat is excellent."), date: "2026-07-24", verified: true },
  { id: "rs2", productId: "prod-shiatsu", author: "Sara Benani", city: "Rabat", rating: 5, title: L("هدية مثالية", "Cadeau parfait", "Perfect gift"), content: L("شريتو لماما، عجباتها السانغات والتدليك الشياتسو.", "Offert à maman : elle adore les sangles et le massage Shiatsu.", "Gifted to mom — she loves the straps and Shiatsu massage."), date: "2026-07-22", verified: true },
  { id: "rs3", productId: "prod-shiatsu", author: "Amina Alaoui", city: "Marrakech", rating: 5, title: L("جودة فاخرة", "Qualité premium", "Premium quality"), content: L("المادة ناعمة والحزام متين. كيبان منتج فاخر من أول استعمال.", "Matière douce, sangle solide. On sent le premium dès la première utilisation.", "Soft material, sturdy strap. Feels premium from the first use."), date: "2026-07-20", verified: true },
  { id: "rs4", productId: "prod-shiatsu", author: "Mohamed Tazi", city: "Tanger", rating: 5, title: L("يخفّف الألم", "Soulage vraiment la douleur", "Really relieves pain"), content: L("كتافي كانو متقلّصين بزاف. من بعد أسبوع الاستعمال الفرق واضح.", "Épaules très contractées. Après une semaine, la différence est nette.", "Very tight shoulders. After a week, the difference is clear."), date: "2026-07-18", verified: true },
  { id: "rs5", productId: "prod-shiatsu", author: "Khalid Fassi", city: "Fès", rating: 4, title: L("زوين مع ملاحظة", "Très bien avec une nuance", "Very good with a note"), content: L("التدليك قوي ومريح. غير خاصك تبدى بسرعة خفيفة.", "Massage puissant et agréable. Commencez sur une intensité douce.", "Powerful, pleasant massage. Start on a gentle intensity."), date: "2026-07-16", verified: true },
  { id: "rs6", productId: "prod-shiatsu", author: "Nadia Chraibi", city: "Agadir", rating: 5, title: L("توصيل سريع", "Livraison rapide", "Fast delivery"), content: L("وصلني فـ 48 ساعة لأكادير. الدفع عند الاستلام مريح.", "Reçu en 48h à Agadir. Paiement à la livraison très pratique.", "Received in 48h in Agadir. Cash on delivery is very practical."), date: "2026-07-14", verified: true },
  { id: "rs7", productId: "prod-shiatsu", author: "Youssef Barada", city: "Meknès", rating: 5, title: L("صامت ومريح", "Silencieux et confortable", "Quiet and comfortable"), content: L("ما كيزعجش فالصالون. كنستعملو وأنا كنتفرّج.", "Ne dérange pas au salon. Je l'utilise en regardant la télé.", "Doesn't disturb in the living room. I use it while watching TV."), date: "2026-07-12", verified: true },
  { id: "rs8", productId: "prod-shiatsu", author: "Imane Ouardi", city: "Oujda", rating: 5, title: L("أحسن من المتوقع", "Mieux qu'attendu", "Better than expected"), content: L("الصور ما غالطاش. التدفئة كتهنّي العضلات بسرعة.", "Photos fidèles. La chaleur détend les muscles rapidement.", "Photos are accurate. Heat relaxes muscles quickly."), date: "2026-07-10", verified: true },
  { id: "rs9", productId: "prod-shiatsu", author: "Hamza Semlali", city: "Kénitra", rating: 5, title: L("سهل الاستعمال", "Facile à utiliser", "Easy to use"), content: L("سانغات قابلة للتعديل وزر واحد. حتى واليديا عرفو كيفاش.", "Sangles réglables et un bouton. Même mes parents ont compris.", "Adjustable straps and one button. Even my parents got it."), date: "2026-07-08", verified: true },
  { id: "rs10", productId: "prod-shiatsu", author: "Leila Mansouri", city: "Salé", rating: 5, title: L("للاسترخاء اليومي", "Pour la détente quotidienne", "For daily relaxation"), content: L("ولّات عادة مسائية. كنحس براحة فالرّقبة والكتاف.", "Devenu un rituel du soir. Cou et épaules vraiment détendus.", "Became an evening ritual. Neck and shoulders truly relaxed."), date: "2026-07-06", verified: true },
  { id: "rs11", productId: "prod-shiatsu", author: "Omar Benjelloun", city: "Tétouan", rating: 5, title: L("دوران تلقائي زوين", "Rotation auto au top", "Auto-rotation is great"), content: L("الدوران التلقائي كيغطّي المناطق المتقلّصة بلا مجهود.", "La rotation automatique couvre les zones tendues sans effort.", "Auto-rotation covers tense areas with no effort."), date: "2026-07-04", verified: true },
  { id: "rs12", productId: "prod-shiatsu", author: "Salma Hassani", city: "El Jadida", rating: 5, title: L("تصميم أنيق", "Design élégant", "Elegant design"), content: L("اللون الأخضر والحزام البني كيبانو فاخرين فالصالون.", "Le vert et la sangle brune font très premium dans le salon.", "Green with brown strap looks premium in the living room."), date: "2026-07-02", verified: true },
  { id: "rs13", productId: "prod-shiatsu", author: "Rachid Ziani", city: "Safi", rating: 4, title: L("قيمة ممتازة", "Excellent rapport qualité-prix", "Great value"), content: L("بـ 299 درهم يستاهل. غير بغيت كابل أطول شوية.", "Pour 299 MAD, ça vaut le coup. J'aurais aimé un câble un peu plus long.", "For 299 MAD it's worth it. Wish the cable were a bit longer."), date: "2026-06-30", verified: true },
  { id: "rs14", productId: "prod-shiatsu", author: "Fatima Zahra", city: "Béni Mellal", rating: 5, title: L("يخفّف التوتر", "Réduit le stress", "Reduces stress"), content: L("منين كنكون متوترة، 15 دقيقة كافية باش نرتاح.", "Quand je suis stressée, 15 minutes suffisent pour me détendre.", "When I'm stressed, 15 minutes are enough to unwind."), date: "2026-06-28", verified: true },
  { id: "rs15", productId: "prod-shiatsu", author: "Abderrahim Naciri", city: "Nador", rating: 5, title: L("للظهر أيضاً", "Aussi pour le dos", "Also for the back"), content: L("كنستعملو على الظهر والخصر. متعدد الاستعمالات ومفيد.", "Je l'utilise aussi sur le dos et la taille. Polyvalent et utile.", "I also use it on the back and waist. Versatile and useful."), date: "2026-06-26", verified: true },
  { id: "rs16", productId: "prod-shiatsu", author: "Meriem Kettani", city: "Mohammedia", rating: 5, title: L("تدفئة مريحة", "Chauffage confortable", "Comfortable heat"), content: L("التدفئة ما سخوناش بزاف — دافية ومريحة للعضلات.", "La chaleur n'est pas excessive — douce et confortable pour les muscles.", "Heat isn't excessive — warm and comfortable for the muscles."), date: "2026-06-24", verified: true },
  { id: "rs17", productId: "prod-shiatsu", author: "Anas Jabri", city: "Khouribga", rating: 5, title: L("خفيف ومحمول", "Léger et portable", "Light and portable"), content: L("كنحملو فالشنطة للعمل. ساهل وبلا ضوضاء.", "Je l'emmène au bureau. Léger et silencieux.", "I take it to the office. Light and quiet."), date: "2026-06-22", verified: true },
  { id: "rs18", productId: "prod-shiatsu", author: "Hanane Bousseta", city: "Settat", rating: 5, title: L("رضا تام", "Satisfaction totale", "Fully satisfied"), content: L("الخدمة زوينة والمنتج فاخر. غادي نعاود نطلب من NOORVA.", "Service top et produit premium. Je commanderai encore chez NOORVA.", "Great service and premium product. I'll order again from NOORVA."), date: "2026-06-20", verified: true },
  { id: "rs19", productId: "prod-shiatsu", author: "Tarik Mrabet", city: "Taza", rating: 5, title: L("يحسّن الدورة", "Améliore la circulation", "Improves circulation"), content: L("كنحس بدفء وارتياح فالرقبة بعد كل جلسة.", "Je sens chaleur et bien-être dans le cou après chaque séance.", "I feel warmth and wellness in my neck after each session."), date: "2026-06-18", verified: true },
  { id: "rs20", productId: "prod-shiatsu", author: "Imane Seddiki", city: "Al Hoceima", rating: 5, title: L("علبة كاملة", "Pack complet", "Complete pack"), content: L("الجهاز + المحول + الدليل. كلشي منظم والتغليف محمي.", "Appareil + adaptateur + manuel. Tout bien rangé, emballage soigné.", "Device + adapter + manual. Well packed, careful packaging."), date: "2026-06-16", verified: true },
  { id: "rs21", productId: "prod-shiatsu", author: "Said Ammari", city: "Ouarzazate", rating: 4, title: L("مفيد بعد السفر", "Utile après le voyage", "Useful after travel"), content: L("بعد الطريق الطويل الكتاف كيرتاحو. شوية قوي فأول مرة.", "Après un long trajet, les épaules se détendent. Un peu fort au début.", "After a long trip, shoulders unwind. A bit strong at first."), date: "2026-06-14", verified: true },
  { id: "rs22", productId: "prod-shiatsu", author: "Zineb El Idrissi", city: "Laâyoune", rating: 5, title: L("ثقة كاملة", "Confiance totale", "Full trust"), content: L("أول طلب من NOORVA وكان ناجح. التوصيل للمجنوب مرتب.", "1re commande NOORVA réussie. Livraison vers le sud impeccable.", "First NOORVA order succeeded. Southern delivery was smooth."), date: "2026-06-12", verified: true },
  { id: "rs23", productId: "prod-shiatsu", author: "Karim Ouadghiri", city: "Casablanca", rating: 5, title: L("أفضل شراء", "Meilleur achat", "Best purchase"), content: L("جربت مساج رخيص من قبل، هادا الفرق واضح فالجودة والراحة.", "Après un massageur cheap, celui-ci marque vraiment la différence.", "After a cheap massager, this one clearly stands out."), date: "2026-06-10", verified: true },
  { id: "rs24", productId: "prod-shiatsu", author: "Asmae Bensalah", city: "Rabat", rating: 5, title: L("موصى به", "Je recommande", "Highly recommend"), content: L("للموظفين والطلبة زوين بزاف. كيهنّي الرقبة بسرعة.", "Parfait pour salariés et étudiants. Détend le cou rapidement.", "Perfect for employees and students. Relaxes the neck quickly."), date: "2026-06-08", verified: true },
  { id: "rs25", productId: "prod-shiatsu", author: "Hicham Toumi", city: "Marrakech", rating: 5, title: L("عرض يستاهل", "Offre à saisir", "Offer worth it"), content: L("خدّيتو بـ 199 بدل 299. الجودة فاخرة والاقتصاد واضح.", "Pris à 199 au lieu de 299. Qualité premium, vraie économie.", "Got it for 199 instead of 299. Premium quality, real savings."), date: "2026-06-06", verified: true },
];

export const faqs: FAQ[] = [
  { id: "f1", question: L("كيفاش كايخدم الدفع عند الاستلام؟", "Comment fonctionne le COD?", "How does COD work?"), answer: L("كتطلب وكتخلّص كاش ملي يوصلك الطلب. ما محتاجش بطاقة بنكية.", "Commandez et payez en espèces à la livraison.", "Order and pay cash on delivery.") },
  { id: "f2", question: L("شحال كتدوم التوصيلة؟", "Délai de livraison?", "Delivery time?"), answer: L("24-48 ساعة للمدن الكبرى. 2-4 أيام لباقي المدن.", "24-48h grandes villes. 2-4 jours ailleurs.", "24-48h major cities.") },
  { id: "f3", question: L("واش كاين ضمان؟", "Garantie?", "Warranty?"), answer: L("نعم، ضمان 12 شهر على جميع المنتجات.", "Oui, garantie 12 mois.", "Yes, 12-month warranty.") },
  { id: "f4", question: L("واش التوصيل مجاني؟", "Livraison gratuite?", "Free shipping?"), answer: L("نعم، التوصيل مجاني لجميع مدن المغرب.", "Oui, livraison gratuite partout au Maroc.", "Yes, free shipping nationwide in Morocco.") },
  { id: "f5", question: L("واش نقدر نرجع المنتج؟", "Retours?", "Returns?"), answer: L("14 يوم للإرجاع إذا فيه عيب. تواصل معنا على واتساب.", "14 jours si défaut.", "14 days if defective.") },
];

export const testimonials: Testimonial[] = [
  { id: "t1", name: "ليلى", city: "الدار البيضاء", videoThumbnail: resolveProductImage("astronaut-bt-speaker-projector", "04-bedroom", "thumbnail"), videoUrl: "#", quote: L("بروجيكتور MX003 بدّل أجواء غرفتي", "MX003 a changé ma chambre", "MX003 changed my room") },
  { id: "t2", name: "نادية", city: "مراكش", videoThumbnail: resolveProductImage("rabbit-carousel-night-light", "08-kids-room", "thumbnail"), videoUrl: "#", quote: L("كاروسيل الأرانب أحسن هدية", "Le carrousel lapin, meilleur cadeau", "The rabbit carousel is the best gift") },
  { id: "t3", name: "إيمان", city: "الرباط", videoThumbnail: resolveProductImage("northern-lights-galaxy-projector", "06-gaming-room", "thumbnail"), videoUrl: "#", quote: L("الأورورا البيضاء والقمر خرافيين", "Aurore blanche et lune incroyables", "White aurora and moon are amazing") },
  { id: "t4", name: "يوسف", city: "طنجة", videoThumbnail: resolveProductImage("bluetooth-star-projector", "05-living-room", "thumbnail"), videoUrl: "#", quote: L("بروجيكتور المجرة كيشعل الغرفة", "Le projecteur galaxie illumine tout", "The galaxy projector lights the room") },
  { id: "t5", name: "ياسين", city: "الدار البيضاء", videoThumbnail: resolveProductImage("green-laser-pointer-303", "02-premium-hero", "thumbnail"), videoUrl: "#", quote: L("الليزر الأخضر قوي ومدى بعيد", "Laser vert puissant et longue portée", "Powerful long-range green laser") },
];

export const instagramPosts: InstagramPost[] = [
  { id: "ig1", image: resolveProductImage("northern-lights-galaxy-projector", "20-social-media-banner", "thumbnail"), url: "https://instagram.com/shopnoorva", likes: 2847 },
  { id: "ig2", image: resolveProductImage("astronaut-bt-speaker-projector", "20-social-media-banner", "thumbnail"), url: "https://instagram.com/shopnoorva", likes: 1923 },
  { id: "ig3", image: resolveProductImage("bluetooth-star-projector", "20-social-media-banner", "thumbnail"), url: "https://instagram.com/shopnoorva", likes: 3456 },
  { id: "ig4", image: resolveProductImage("rabbit-carousel-night-light", "20-social-media-banner", "thumbnail"), url: "https://instagram.com/shopnoorva", likes: 1567 },
  { id: "ig5", image: resolveProductImage("green-laser-pointer-303", "20-social-media-banner", "thumbnail"), url: "https://instagram.com/shopnoorva", likes: 2214 },
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
  const p = products.find((prod) => prod.id === id);
  return p ? enrichProduct(p) : undefined;
}
export function getProductsByCategory(categoryId: string) {
  const tagMatch = CATEGORY_TAG_MAP[categoryId];
  return products
    .filter((p) => p.categoryId === categoryId || (tagMatch && p.tags.some((t) => tagMatch.includes(t))))
    .map(enrichProduct);
}
export function getBestSellers() { return products.filter((p) => p.isBestSeller).map(enrichProduct); }
export function getTrending() { return products.filter((p) => p.isTrending).map(enrichProduct); }
export function getTikTokViral() { return products.filter((p) => p.isTikTokViral).map(enrichProduct); }
export function getFeatured() { return products.filter((p) => p.isFeatured).map(enrichProduct); }
export function getNewArrivals() {
  return products
    .filter((p) => p.tags.includes("new") || p.isTrending)
    .map(enrichProduct);
}
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
