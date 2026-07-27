import type { Product, ProductReview, FAQ, Testimonial, InstagramPost, Coupon, Order, Customer } from "@/types";
import { enrichProduct } from "@/lib/product-images/enrich-products";
import { resolveProductImage } from "@/lib/product-images/resolve";

const flashEnd = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString();

const L = (ar: string, fr: string, en: string) => ({ ar, fr, en });

/** Extra categories (Galaxy Lights, Home Decor, Bedroom Lighting, Kids Room, Relaxation, Gift Ideas)
 *  are populated by tag match in addition to the product's primary categoryId. */
const CATEGORY_TAG_MAP: Record<string, string[]> = {
  "cat-galaxy-lights": ["galaxy", "aurora", "laser", "star"],
  "cat-home-decor": ["decor"],
  "cat-bedroom-lighting": ["bedroom"],
  "cat-kids-room": ["kids"],
  "cat-relaxation": ["relaxation"],
  "cat-gift-ideas": ["gift"],
};

export const products: Product[] = [
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
    sku: "NRV-LASER303-01",
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
        sku: "NRV-LASER303-01",
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
    id: "prod-shiatsu",
    slug: "shiatsu-neck-shoulder-massager",
    name: L(
      "جهاز تدليك الرقبة والكتفين شياتسو",
      "Appareil de Massage Shiatsu pour le Cou et les Épaules",
      "Shiatsu Neck and Shoulder Massager"
    ),
    shortDescription: L(
      "تدليك شياتسو ثلاثي الأبعاد مع تدفئة مدمجة لتخفيف آلام الرقبة والكتفين — توصيل مجاني والدفع عند الاستلام في المغرب",
      "Massage Shiatsu 3D avec chauffage intégré pour soulager les douleurs du cou et des épaules — livraison gratuite et paiement à la livraison au Maroc",
      "3D Shiatsu massage with built-in heat to relieve neck and shoulder pain — free shipping and cash on delivery in Morocco"
    ),
    description: L(
      "جهاز تدليك الرقبة والكتفين من NOORVA بتقنية شياتسو ثلاثية الأبعاد وعقد سيليكون ناعمة. تدفئة مدمجة، دوران تلقائي، وسانغات قابلة للتعديل لراحة مثالية. مثالي للاسترخاء بعد يوم طويل، تخفيف التوتر وتحسين الدورة الدموية. تصميم أخضر فاخر مع حزام جلد بني، خفيف وسهل الحمل. التوصيل مجاني لجميع مدن المغرب مع الدفع عند الاستلام.",
      "Appareil de massage cou & épaules NOORVA avec technique Shiatsu 3D et nœuds en silicone doux. Chauffage intégré, rotation automatique et sangles réglables pour un confort optimal. Idéal pour se détendre après une longue journée, soulager le stress et améliorer la circulation. Design vert premium avec sangle en cuir brun, léger et facile à transporter. Livraison gratuite partout au Maroc avec paiement à la livraison.",
      "NOORVA neck & shoulder massager with 3D Shiatsu technique and soft silicone nodes. Built-in heating, auto-rotation and adjustable straps for optimal comfort. Ideal for relaxing after a long day, relieving stress and improving circulation. Premium green design with brown leather strap, lightweight and easy to carry. Free nationwide shipping in Morocco with cash on delivery."
    ),
    categoryId: "cat-relaxation",
    price: 249,
    compareAtPrice: 349,
    sku: "NRV-SHIATSU-01",
    stock: 23,
    rating: 4.9,
    reviewCount: 487,
    soldCount: 2140,
    isBestSeller: true,
    isTrending: true,
    isTikTokViral: false,
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
      "تدليك شياتسو 3D + تدفئة مدمجة في دقائق",
      "Massage Shiatsu 3D + chauffage intégré en quelques minutes",
      "3D Shiatsu massage + built-in heat in minutes"
    ),
    deepDescription: L(
      "جهاز تدليك شياتسو ثلاثي الأبعاد مع تدفئة، دوران تلقائي وسانغات قابلة للتعديل. يخفّف آلام الرقبة والكتفين والظهر، يحسّن الدورة الدموية ويوفّر استرخاء يومي فاخر في المنزل.",
      "Appareil de massage Shiatsu 3D avec chauffage, rotation automatique et sangles réglables. Soulage le cou, les épaules et le dos, améliore la circulation et offre une détente premium au quotidien à la maison.",
      "3D Shiatsu massager with heat, auto-rotation and adjustable straps. Relieves neck, shoulders and back, improves circulation and delivers premium daily wellness at home."
    ),
    tags: ["relaxation", "gift", "shiatsu", "massage", "wellness", "bestseller"],
    benefits: [
      L("استرخاء عميق في دقائق بعد يوم شاق", "Détente profonde en quelques minutes après une journée intense", "Deep relaxation in minutes after a long day"),
      L("تخفيف آلام الرقبة والكتفين والظهر", "Soulage les douleurs du cou, des épaules et du dos", "Relieves neck, shoulder and back pain"),
      L("تقليل التوتر والإجهاد اليومي", "Réduit le stress et la tension quotidienne", "Reduces daily stress and tension"),
      L("تحسين الدورة الدموية بفضل التدفئة", "Améliore la circulation grâce au chauffage", "Improves circulation with built-in heat"),
      L("راحة يومية في المنزل بلا موعد في الصالون", "Confort quotidien à la maison sans rendez-vous au spa", "Daily comfort at home without a spa appointment"),
      L("عافية منتظمة تناسب نمط حياتك", "Bien-être régulier adapté à votre rythme", "Regular wellness that fits your lifestyle"),
    ],
    features: [
      L("تدليك شياتسو ثلاثي الأبعاد", "Massage Shiatsu 3D", "3D Shiatsu Massage"),
      L("تدفئة مدمجة", "Chauffage intégré", "Built-in Heating"),
      L("دوران تلقائي", "Rotation automatique", "Automatic Rotation"),
      L("سانغات قابلة للتعديل", "Sangles réglables", "Adjustable Straps"),
      L("سهل الحمل", "Facile à transporter", "Easy to Carry"),
      L("صامت", "Silencieux", "Quiet Operation"),
      L("تصميم مريح", "Ergonomique", "Ergonomic Design"),
      L("جودة فاخرة", "Qualité Premium", "Premium Quality"),
    ],
    specifications: [
      { label: L("اللون", "Couleur", "Color"), value: L("أخضر", "Vert", "Green") },
      { label: L("المادة", "Matériau", "Material"), value: L("ABS + جلد صناعي PU", "ABS + Cuir PU", "ABS + PU Leather") },
      { label: L("نوع التدليك", "Massage", "Massage"), value: L("شياتسو ثلاثي الأبعاد", "Shiatsu 3D", "Shiatsu 3D") },
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
      L("جهاز تدليك الرقبة والكتفين شياتسو", "Appareil de massage Shiatsu cou & épaules", "Shiatsu neck & shoulder massager"),
      L("محول طاقة", "Adaptateur secteur", "Power adapter"),
      L("دليل الاستخدام", "Manuel d'utilisation", "User manual"),
    ],
    howToUse: L(
      "ضع الجهاز حول الرقبة أو على المنطقة المراد تدليكها، اضبط السانغات، شغّل التدليك وفعّل التدفئة حسب الرغبة. استرخِ لمدة 10–15 دقيقة.",
      "Placez l'appareil autour du cou ou sur la zone à masser, ajustez les sangles, lancez le massage et activez le chauffage si besoin. Détendez-vous 10 à 15 minutes.",
      "Place the device around your neck or on the target area, adjust the straps, start the massage and enable heat if desired. Relax for 10–15 minutes."
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
        price: 249,
        compareAtPrice: 349,
        sku: "NRV-SHIATSU-01",
        stock: 23,
      },
    ],
    upsellIds: ["prod-mx003", "prod-aurora"],
    crossSellIds: ["prod-rabbit", "prod-starbt"],
    seo: {
      title: L(
        "جهاز تدليك الرقبة والكتفين شياتسو | 249 درهم | NOORVA المغرب",
        "Appareil de Massage Shiatsu Cou et Épaules | 249 MAD | NOORVA Maroc",
        "Shiatsu Neck and Shoulder Massager | 249 MAD | NOORVA Morocco"
      ),
      description: L(
        "جهاز تدليك شياتسو 3D مع تدفئة بـ 249 درهم بدل 349. يخفّف آلام الرقبة والكتفين. توصيل مجاني والدفع عند الاستلام في المغرب.",
        "Appareil de massage Shiatsu 3D avec chauffage à 249 MAD au lieu de 349. Soulage cervicales et épaules. Livraison gratuite et paiement à la livraison au Maroc.",
        "3D Shiatsu massager with heat for 249 MAD instead of 349. Relieves neck and shoulders. Free shipping and cash on delivery in Morocco."
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
  { id: "rs13", productId: "prod-shiatsu", author: "Rachid Ziani", city: "Safi", rating: 4, title: L("قيمة ممتازة", "Excellent rapport qualité-prix", "Great value"), content: L("بـ 249 درهم يستاهل. غير بغيت كابل أطول شوية.", "Pour 249 MAD, ça vaut le coup. J'aurais aimé un câble un peu plus long.", "For 249 MAD it's worth it. Wish the cable were a bit longer."), date: "2026-06-30", verified: true },
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
  { id: "rs25", productId: "prod-shiatsu", author: "Hicham Toumi", city: "Marrakech", rating: 5, title: L("عرض يستاهل", "Offre à saisir", "Offer worth it"), content: L("خدّيتو بـ 249 بدل 349. الجودة فاخرة والاقتصاد واضح.", "Pris à 249 au lieu de 349. Qualité premium, vraie économie.", "Got it for 249 instead of 349. Premium quality, real savings."), date: "2026-06-06", verified: true },
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
