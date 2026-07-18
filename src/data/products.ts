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
      "رائد فضاء أبيض — سبيكر بلوتوث 5.0 + إسقاط مجرة + ريموت + Type-C",
      "Astronaute blanc — haut-parleur Bluetooth 5.0, projection galaxie, télécommande",
      "White astronaut — Bluetooth 5.0 speaker, galaxy projection, remote, USB-C"
    ),
    description: L(
      "بروجيكتور رائد الفضاء MX003 من NOORVA — بروجيكتور مجرة مع سبيكر بلوتوث 5.0 مدمج في الصدر. تصميم رائد فضاء أبيض أنيق، عدسة HD تعرض نجوم وسديم بألوان متعددة على السقف والجدران. يدعم بطاقة TF وكابل AUX لتشغيل الموسيقى، مع مايكروفون مدمج للمكالمات. ريموت تحكم أسود وكابل Type-C. الدفع عند الاستلام في جميع مدن المغرب.",
      "Projecteur astronaute MX003 NOORVA — galaxie + haut-parleur Bluetooth 5.0 intégré dans la poitrine. Design astronaute blanc élégant, lentille HD projetant étoiles et nébuleuses multicolores. Carte TF et AUX, micro intégré. Télécommande noire, câble Type-C. Paiement à la livraison au Maroc.",
      "NOORVA MX003 astronaut projector — galaxy effect with a built-in Bluetooth 5.0 chest speaker. Elegant white astronaut design, HD lens projecting multicolor stars and nebula on ceiling and walls. TF card and AUX playback, built-in mic. Black remote, USB-C cable. Cash on delivery."
    ),
    categoryId: "cat-projectors",
    price: 179,
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
      L("بروجيكتور + سبيكر بلوتوث 5.0", "Projecteur + Bluetooth 5.0", "Projector + Bluetooth 5.0 speaker"),
      L("إسقاط مجرة ونجوم HD", "Projection galaxie HD", "HD galaxy & star projection"),
      L("تشغيل موسيقى TF / AUX", "Musique TF / AUX", "TF card / AUX music playback"),
      L("مايكروفون مدمج للمكالمات", "Micro intégré pour appels", "Built-in mic for calls"),
      L("ريموت + كابل Type-C", "Télécommande + câble Type-C", "Remote + USB-C cable"),
      L("هدية مثالية", "Cadeau parfait", "Perfect gift"),
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
    variants: [{ id: "var-mx003", name: L("أبيض", "Blanc", "White"), price: 179, compareAtPrice: 259, sku: "NRV-MX003-01", stock: 90 }],
    upsellIds: ["prod-aurora", "prod-starbt"],
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
      "قبة كريستال · 21 وضع إضاءة · بلوتوث وموسيقى · ريموت بمؤقت 1س/2س · USB DC 5V",
      "Dôme cristal · 21 modes · Bluetooth musique · télécommande 1h/2h · USB DC 5V",
      "Crystal dome · 21 light modes · Bluetooth speaker · remote timer 1h/2h · USB DC 5V"
    ),
    description: L(
      "بروجيكتور مجرة ونجوم من NOORVA بجسم أسود مطفي وقبة شفافة متعددة الأوجه. يعرض سماء مرصّعة بالنجوم مع موجات ضوئية ملوّنة حتى 21 وضع إسقاط (أحمر/أخضر/أزرق/أبيض وتركيبات). سبيكر بلوتوث مدمج — وصّل هاتفك أو USB/TF واستمتع بالموسيقى مع إضاءة تتفاعل مع الإيقاع. ريموت للتحكم في الألوان، السطوع، الموسيقى، ومؤقت الإيقاف التلقائي 1 ساعة أو 2 ساعة. مثالي لغرفة النوم، الأطفال، الحفلات، والديكور الرومانسي. الدفع عند الاستلام في المغرب.",
      "Projecteur galaxie NOORVA, corps noir mat et dôme cristal facetté. Ciel étoilé + vagues colorées jusqu’à 21 modes (R/G/B/W). Haut-parleur Bluetooth, USB/TF, télécommande avec minuterie 1h/2h. Idéal chambre, enfants, soirées. Paiement à la livraison au Maroc.",
      "NOORVA galaxy star projector with matte black body and faceted crystal dome. Starry sky plus colorful wave lighting up to 21 modes (R/G/B/W). Built-in Bluetooth speaker, USB/TF playback, remote with 1h/2h auto-off. Perfect for bedrooms, kids rooms, parties. Cash on delivery in Morocco."
    ),
    categoryId: "cat-projectors",
    price: 149,
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
      L("حتى 21 وضع إضاءة ملونة", "Jusqu’à 21 modes d’éclairage", "Up to 21 colorful lighting modes"),
      L("سبيكر بلوتوث مدمج", "Haut-parleur Bluetooth intégré", "Built-in Bluetooth speaker"),
      L("ريموت + مؤقت 1س / 2س", "Télécommande + minuterie 1h/2h", "Remote + 1h / 2h timer"),
      L("قبة كريستال وإسقاط مجرة", "Dôme cristal et projection galaxie", "Crystal dome & galaxy projection"),
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
    variants: [{ id: "var-starbt", name: L("أسود", "Noir", "Black"), price: 149, compareAtPrice: 219, sku: "NRV-STARBT-01", stock: 75 }],
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
    name: L("بروجيكتور الأورورا الشمالية", "Projecteur Aurores Boréales", "Northern Lights Aurora Galaxy Projector"),
    shortDescription: L(
      "قبّة سوداء غامقة — أورورا وموج مائي + ليزر نجوم + تحكم بالتطبيق والريموت",
      "Dôme noir mat — aurores et vagues, laser étoiles, app + télécommande",
      "Matte black dome — aurora + water ripple, laser stars, app + remote control"
    ),
    description: L(
      "بروجيكتور الأورورا الشمالية من NOORVA (موديل WS-AL22276) بشكل قبّة سوداء أنيقة. يعرض تأثير موج مائي حالم مع أورورا شمالية ملونة وليزر نجوم على السقف والجدران. تحكم عبر تطبيق البلوتوث والريموت، سبيكر مدمج. مثالي للاسترخاء والنوم العميق.",
      "Projecteur aurores boréales NOORVA (WS-AL22276), dôme noir élégant. Effet vagues d'eau oniriques avec aurores colorées et laser étoiles. Contrôle via app Bluetooth et télécommande, haut-parleur intégré. Idéal relaxation et sommeil profond.",
      "NOORVA Northern Lights projector (model WS-AL22276), elegant matte-black dome. Dreamy water-ripple effect combined with colorful aurora borealis and laser stars on ceiling and walls. Bluetooth app + remote control, built-in speaker. Perfect for relaxation and deep sleep."
    ),
    categoryId: "cat-projectors",
    price: 189,
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
    problem: L("بغيتي أجواء أورورا حقيقية فبيتك؟", "Envie d'une vraie ambiance aurore boréale?", "Want a real aurora ambiance at home?"),
    problemCause: L("البروجيكتورات العادية ما كتعطيش تأثير موج مائي وأورورا حقيقي", "Les projecteurs classiques n'ont pas de vagues d'eau ni d'aurore réelle", "Regular projectors lack real water-ripple and aurora effects"),
    problemSolution: L("قبّة سوداء + موج مائي + أورورا + تحكم بالتطبيق", "Dôme noir + vagues + aurore + app", "Black dome + water ripple + aurora + app control"),
    deepDescription: L(
      "قبّة سوداء أنيقة (WS-AL22276) تعرض موج مائي حالم مع أورورا شمالية وليزر نجوم. تحكم بالتطبيق والريموت، سبيكر مدمج — تجربة استرخاء كاملة.",
      "Dôme noir (WS-AL22276), vagues d'eau, aurore boréale, laser étoiles. App + télécommande, haut-parleur.",
      "Black dome (WS-AL22276), water ripple, aurora borealis, laser stars. App + remote, built-in speaker."
    ),
    tags: ["aurora", "northernlights", "laser", "app", "bluetooth", "galaxy", "bedroom", "decor", "gift", "relaxation"],
    benefits: [
      L("تأثير موج مائي حالم", "Effet vagues d'eau onirique", "Dreamy water-ripple effect"),
      L("أورورا شمالية ملونة", "Aurores boréales colorées", "Colorful northern lights"),
      L("تحكم بالتطبيق والريموت", "Contrôle app + télécommande", "App + remote control"),
      L("مثالي للاسترخاء والنوم", "Idéal relaxation et sommeil", "Perfect for relaxation and sleep"),
    ],
    features: [
      L("موج مائي + أورورا + ليزر نجوم", "Vagues + aurore + laser étoiles", "Water ripple + aurora + laser stars"),
      L("تحكم عبر تطبيق بلوتوث", "Contrôle via app Bluetooth", "Bluetooth app control"),
      L("سبيكر مدمج", "Haut-parleur intégré", "Built-in speaker"),
      L("+10 تركيبات ألوان", "+10 combinaisons de couleurs", "10+ color combinations"),
    ],
    specifications: [
      { label: L("الموديل", "Modèle", "Model"), value: L("WS-AL22276", "WS-AL22276", "WS-AL22276") },
      { label: L("المادة", "Matériau", "Material"), value: L("ABS أسود مطفي", "ABS noir mat", "Matte black ABS") },
      { label: L("الطاقة", "Alimentation", "Power"), value: L("USB-C DC 5V", "USB-C DC 5V", "USB-C DC 5V") },
      { label: L("التحكم", "Contrôle", "Control"), value: L("تطبيق بلوتوث + ريموت", "App Bluetooth + télécommande", "Bluetooth app + remote") },
      { label: L("التأثيرات", "Effets", "Effects"), value: L("موج مائي + أورورا + ليزر", "Vagues + aurore + laser", "Water ripple + aurora + laser") },
      { label: L("الأبعاد", "Dimensions", "Dimensions"), value: L("15×11×12 سم", "15×11×12 cm", "15×11×12 cm") },
      { label: L("الوزن", "Poids", "Weight"), value: L("490 غ", "490 g", "490 g") },
      { label: L("الضمان", "Garantie", "Warranty"), value: L("12 شهر", "12 mois", "12 months") },
    ],
    packageIncludes: [
      L("بروجيكتور الأورورا الشمالية", "Projecteur aurores boréales", "Northern Lights projector"),
      L("ريموت تحكم", "Télécommande", "Remote control"),
      L("كابل USB-C", "Câble USB-C", "USB-C cable"),
      L("دليل الاستخدام", "Manuel", "User manual"),
    ],
    howToUse: L("ضعه في غرفة مظلمة، حمّل التطبيق أو استخدم الريموت، اختر تركيبة الألوان والمؤقت المفضلة لديك.", "Pièce sombre, app ou télécommande, choisissez couleur et minuterie.", "Dark room, use app or remote, pick your favorite color combo and timer."),
    images: [],
    lifestyleImages: [],
    lifestyleScenes: [
      { id: "bedroom", emoji: "🛏️", title: L("غرفة النوم", "Chambre", "Bedroom"), description: L("أورورا هادئة قبل النوم", "Aurore apaisante avant de dormir", "Calm aurora before sleep") },
      { id: "relax", emoji: "🧘", title: L("الاسترخاء", "Relaxation", "Relaxation"), description: L("موج مائي وأورورا يساعدان على التأمل", "Vagues et aurore pour méditer", "Water ripple and aurora for meditation") },
      { id: "living", emoji: "🛋️", title: L("غرفة المعيشة", "Salon", "Living Room"), description: L("ديكور فاخر يبان فالتصوير والاستقبال", "Déco premium pour photos et soirées", "Premium decor for photos and evenings") },
      { id: "gaming", emoji: "🎮", title: L("غرفة الجيمنغ", "Gaming", "Gaming Room"), description: L("أجواء سينمائية للعب والبث", "Ambiance cinéma gaming", "Cinematic gaming vibe") },
      { id: "gift", emoji: "🎁", title: L("هدية مثالية", "Cadeau", "Gift"), description: L("هدية أصلية لعشاق الاسترخاء", "Cadeau original pour amateurs de détente", "Original gift for relaxation lovers") },
    ],
    variants: [{ id: "var-aurora", name: L("أسود", "Noir", "Black"), price: 189, compareAtPrice: 279, sku: "NRV-AURORA-01", stock: 68 }],
    upsellIds: ["prod-mx003", "prod-starbt"],
    crossSellIds: ["prod-rabbit"],
    seo: {
      title: L("بروجيكتور الأورورا الشمالية | NOORVA", "Projecteur Aurores Boréales | NOORVA", "Northern Lights Aurora Galaxy Projector | NOORVA"),
      description: L("بروجيكتور أورورا وموج مائي مع تحكم بالتطبيق — الدفع عند الاستلام", "Projecteur aurore et vagues avec app — COD", "Aurora and water-ripple projector with app control — COD"),
    },
  },
  {
    id: "prod-rabbit",
    slug: "rabbit-carousel-night-light",
    name: L("مصباح كاروسيل الأرانب الموسيقي", "Veilleuse Carrousel Lapin Musicale", "Rabbit Carousel Music Box Night Light"),
    shortDescription: L(
      "كاروسيل وردي وذهبي بأرانب دوّارة — جهاز صوت للنوم + ريموت + شحن USB-C",
      "Carrousel rose et or avec lapins — sound machine, télécommande, USB-C",
      "Pink gold carousel with spinning bunnies — sound machine, remote, USB-C"
    ),
    description: L(
      "مصباح كاروسيل الأرانب من NOORVA بتصميم فاخر وردي وذهبي. أرانب صغيرة دوّارة على أعمدة ذهبية، جهاز صوت مدمج يشغّل موسيقى هادئة للنوم، ألوان متعددة، وريموت تحكم. هدية مثالية للبنات والعائلات. شحن USB-C.",
      "Veilleuse carrousel lapin NOORVA rose et or. Petits lapins rotatifs sur tiges dorées, sound machine intégré avec musique douce, couleurs multiples, télécommande. Cadeau parfait. Chargement USB-C.",
      "NOORVA rabbit carousel night light in pink and gold. Small spinning bunny figurines on gold rods, built-in sound machine with soft lullaby music, multiple colors, remote control. Perfect gift. USB-C rechargeable."
    ),
    categoryId: "cat-nightlights",
    price: 139,
    compareAtPrice: 199,
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
    problem: L("بنتك خايفة من الظلام أو ما كتنعسش بسهولة؟", "Enfant qui a peur du noir ou dort difficilement?", "Child afraid of the dark or struggling to fall asleep?"),
    problemCause: L("المصابيح العادية قاسية أو مملة وما فيهاش صوت مهدئ", "Les veilleuses classiques sont dures ou sans son apaisant", "Regular night lights are harsh and have no soothing sound"),
    problemSolution: L("كاروسيل الأرانب + جهاز صوت + إضاءة ناعمة", "Carrousel lapin + sound machine + lumière douce", "Rabbit carousel + sound machine + soft light"),
    deepDescription: L(
      "كاروسيل فاخر وردي وذهبي مع أرانب دوّارة وجهاز صوت مدمج يشغّل موسيقى هادئة. إضاءة ناعمة، ألوان متعددة، وريموت — هدية مثالية للبنات والعائلات.",
      "Carrousel rose et or avec lapins rotatifs et sound machine intégré. Lumière douce, musique, télécommande.",
      "Luxury pink gold carousel with rotating bunnies and built-in sound machine. Soft glow, lullaby music, remote."
    ),
    tags: ["carousel", "rabbit", "nightlight", "music", "kids", "gift", "bedroom", "decor", "relaxation"],
    benefits: [
      L("تصميم كاروسيل فاخر بأرانب", "Design carrousel lapin luxe", "Luxury rabbit carousel design"),
      L("جهاز صوت لموسيقى هادئة", "Sound machine musique douce", "Sound machine with soft music"),
      L("شحن USB-C", "Charge USB-C", "USB-C charging"),
      L("هدية مثالية", "Cadeau idéal", "Ideal gift"),
    ],
    features: [
      L("دوران أرانب على أعمدة ذهبية", "Lapins rotatifs sur tiges dorées", "Rotating bunnies on gold rods"),
      L("جهاز صوت وموسيقى هادئة", "Sound machine et musique douce", "Sound machine and soft music"),
      L("ألوان متعددة", "Couleurs multiples", "Multiple colors"),
      L("ريموت تحكم", "Télécommande", "Remote control"),
    ],
    specifications: [
      { label: L("اللون", "Couleur", "Color"), value: L("وردي + ذهبي", "Rose + or", "Pink + gold") },
      { label: L("الشحن", "Charge", "Charging"), value: L("USB-C", "USB-C", "USB-C") },
      { label: L("الصوت", "Son", "Sound"), value: L("جهاز صوت + موسيقى هادئة", "Sound machine + musique", "Sound machine + lullaby music") },
      { label: L("التحكم", "Contrôle", "Control"), value: L("ريموت + أزرار", "Télécommande + boutons", "Remote + buttons") },
      { label: L("الأبعاد", "Dimensions", "Dimensions"), value: L("12×12×19 سم", "12×12×19 cm", "12×12×19 cm") },
      { label: L("الوزن", "Poids", "Weight"), value: L("600 غ", "600 g", "600 g") },
      { label: L("الضمان", "Garantie", "Warranty"), value: L("12 شهر", "12 mois", "12 months") },
    ],
    packageIncludes: [
      L("مصباح كاروسيل الأرانب", "Veilleuse carrousel lapin", "Rabbit carousel light"),
      L("ريموت تحكم", "Télécommande", "Remote control"),
      L("كابل USB-C", "Câble USB-C", "USB-C cable"),
      L("دليل الاستخدام", "Manuel", "Manual"),
    ],
    howToUse: L("اشحن الجهاز، اضغط الزر الأمامي أو استخدم الريموت لاختيار اللون والموسيقى، وضعه قرب سرير طفلك.", "Chargez l'appareil, utilisez les boutons ou la télécommande pour choisir couleur et musique.", "Charge the device, use buttons or remote to pick color and music, place near your child's bed."),
    images: [],
    lifestyleImages: [],
    lifestyleScenes: [
      { id: "kids", emoji: "🧸", title: L("غرفة الأطفال", "Enfants", "Kids Room"), description: L("جهاز صوت وإضاءة ناعمة تساعد على النوم", "Sound machine et lumière douce pour dormir", "Sound machine and soft light for sleep") },
      { id: "bedroom", emoji: "🛏️", title: L("غرفة النوم", "Chambre", "Bedroom"), description: L("أجواء هادئة كل مساء", "Ambiance apaisante chaque soir", "Calm ambiance every evening") },
      { id: "gift", emoji: "🎁", title: L("هدية للبنات", "Cadeau pour filles", "Gift for girls"), description: L("الهدية الأكثر طلبًا على تيك توك", "Cadeau viral TikTok", "Viral TikTok gift") },
      { id: "living", emoji: "🛋️", title: L("غرفة المعيشة", "Salon", "Living Room"), description: L("ديكور فاخر يزيّن الرفوف والطاولات", "Déco premium pour étagères et tables", "Premium decor for shelves and tables") },
    ],
    variants: [{ id: "var-rabbit", name: L("وردي", "Rose", "Pink"), price: 139, compareAtPrice: 199, sku: "NRV-RABBIT-01", stock: 110 }],
    upsellIds: ["prod-mx003", "prod-aurora"],
    crossSellIds: ["prod-starbt"],
    seo: {
      title: L("مصباح كاروسيل الأرانب الموسيقي | NOORVA", "Veilleuse Carrousel Lapin Musicale | NOORVA", "Rabbit Carousel Music Box Night Light | NOORVA"),
      description: L("مصباح كاروسيل وردي بجهاز صوت وريموت — الدفع عند الاستلام", "Veilleuse carrousel rose avec sound machine — COD", "Pink carousel night light with sound machine — COD"),
    },
  },
];

export const reviews: ProductReview[] = [
  { id: "r1", productId: "prod-mx003", author: "سارة المنصوري", city: "الدار البيضاء", rating: 5, title: L("حولت غرفتي!", "Chambre transformée!", "Transformed my room!"), content: L("بروجيكتور MX003 رائع، والبلوتوث كيخدم مزيان بزاف. التوصيل سريع والدفع عند الاستلام مريح.", "Projecteur MX003 génial, le Bluetooth fonctionne super bien. Livraison rapide.", "MX003 projector is amazing, Bluetooth works great. Fast delivery."), date: "2026-06-20", verified: true, images: [resolveProductImage("astronaut-bt-speaker-projector", "04-bedroom", "thumbnail")] },
  { id: "r2", productId: "prod-aurora", author: "يوسف العلوي", city: "الرباط", rating: 5, title: L("فيرال تيك توك", "Viral TikTok", "TikTok viral"), content: L("بروجيكتور الأورورا كيعطي تصوير خرافي للريلز. تأثير الموج المائي زوين بزاف.", "Le projecteur aurore est parfait pour les Reels. L'effet vagues est superbe.", "Aurora projector is perfect for Reels. The water-ripple effect is amazing."), date: "2026-06-18", verified: true, images: [resolveProductImage("northern-lights-galaxy-projector", "06-gaming-room", "thumbnail")], hasVideo: true },
  { id: "r3", productId: "prod-rabbit", author: "إيمان بنجلون", city: "مراكش", rating: 5, title: L("هدية بنتي", "Cadeau fille", "Daughter gift"), content: L("كاروسيل الأرانب زوين بزاف وجهاز الصوت كيهدّئ بنتي بسرعة.", "Le carrousel lapin est adorable et le sound machine calme ma fille rapidement.", "The rabbit carousel is adorable and the sound machine calms my daughter fast."), date: "2026-06-12", verified: true, images: [resolveProductImage("rabbit-carousel-night-light", "04-bedroom", "thumbnail")] },
  { id: "r4", productId: "prod-starbt", author: "أمين التازي", city: "طنجة", rating: 5, title: L("جودة عالية", "Haute qualité", "High quality"), content: L("بروجيكتور المجرة كيشعل الغرفة كاملة، البلوتوث زوين والمؤقت 1س/2س مفيد بزاف.", "Le projecteur galaxie illumine toute la pièce, Bluetooth top et minuterie 1h/2h très utile.", "Galaxy projector lights the whole room, Bluetooth is great and the 1h/2h timer is very useful."), date: "2026-06-08", verified: true, images: [resolveProductImage("bluetooth-star-projector", "05-living-room", "thumbnail")] },
  { id: "r5", productId: "prod-aurora", author: "خديجة الفاسي", city: "فاس", rating: 5, title: L("خدمة ممتازة", "Service top", "Great service"), content: L("طلبت بالواتساب والدفع عند الاستلام. كلشي ساهل والتطبيق كيخدم مزيان.", "Commande facile COD, l'app fonctionne très bien.", "Easy COD order, the app works very well."), date: "2026-06-01", verified: true, images: [resolveProductImage("northern-lights-galaxy-projector", "04-bedroom", "thumbnail")] },
  { id: "r6", productId: "prod-mx003", author: "محمد برادة", city: "أكادير", rating: 5, title: L("أجواء سينمائية", "Ambiance cinéma", "Cinema vibe"), content: L("شريت جوج بروجيكتورات MX003. الغرفة ولاّت سينما بصوت البلوتوث.", "Deux projecteurs MX003 = ambiance cinéma avec le Bluetooth.", "Two MX003 projectors = cinema vibe with Bluetooth sound."), date: "2026-05-25", verified: true, hasVideo: true },
  { id: "r7", productId: "prod-starbt", author: "نور الهدى", city: "الدار البيضاء", rating: 5, title: L("أحسن شراء", "Meilleur achat", "Best purchase"), content: L("21 وضع إضاءة والموسيقى مع البلوتوث كتهنّي بنتي قبل النوم.", "21 modes et la musique Bluetooth calment ma fille avant de dormir.", "21 light modes and Bluetooth music calm my daughter before sleep."), date: "2026-05-18", verified: true, images: [resolveProductImage("bluetooth-star-projector", "05-living-room", "thumbnail")] },
  { id: "r8", productId: "prod-rabbit", author: "كريم بنعيسى", city: "الرباط", rating: 4, title: L("كيوت وفاخر", "Mignon et premium", "Cute and premium"), content: L("كاروسيل الأرانب كيوت بزاف. الهدية ممتازة لبنتي.", "Le carrousel lapin est trop mignon. Cadeau parfait pour ma fille.", "The rabbit carousel is super cute. Perfect gift for my daughter."), date: "2026-05-10", verified: true },
];

export const faqs: FAQ[] = [
  { id: "f1", question: L("كيفاش كايخدم الدفع عند الاستلام؟", "Comment fonctionne le COD?", "How does COD work?"), answer: L("كتطلب وكتخلّص كاش ملي يوصلك الطلب. ما محتاجش بطاقة بنكية.", "Commandez et payez en espèces à la livraison.", "Order and pay cash on delivery.") },
  { id: "f2", question: L("شحال كتدوم التوصيلة؟", "Délai de livraison?", "Delivery time?"), answer: L("24-48 ساعة للمدن الكبرى. 2-4 أيام لباقي المدن.", "24-48h grandes villes. 2-4 jours ailleurs.", "24-48h major cities.") },
  { id: "f3", question: L("واش كاين ضمان؟", "Garantie?", "Warranty?"), answer: L("نعم، ضمان 12 شهر على جميع المنتجات.", "Oui, garantie 12 mois.", "Yes, 12-month warranty.") },
  { id: "f4", question: L("واش التوصيل مجاني؟", "Livraison gratuite?", "Free shipping?"), answer: L("مجاني فوق 500 درهم. غير ذلك 25-35 درهم.", "Gratuit dès 500 MAD.", "Free over 500 MAD.") },
  { id: "f5", question: L("واش نقدر نرجع المنتج؟", "Retours?", "Returns?"), answer: L("14 يوم للإرجاع إذا فيه عيب. تواصل معنا على واتساب.", "14 jours si défaut.", "14 days if defective.") },
];

export const testimonials: Testimonial[] = [
  { id: "t1", name: "ليلى", city: "الدار البيضاء", videoThumbnail: resolveProductImage("astronaut-bt-speaker-projector", "04-bedroom", "thumbnail"), videoUrl: "#", quote: L("بروجيكتور MX003 بدّل أجواء غرفتي", "MX003 a changé ma chambre", "MX003 changed my room") },
  { id: "t2", name: "نادية", city: "مراكش", videoThumbnail: resolveProductImage("rabbit-carousel-night-light", "08-kids-room", "thumbnail"), videoUrl: "#", quote: L("كاروسيل الأرانب أحسن هدية", "Le carrousel lapin, meilleur cadeau", "The rabbit carousel is the best gift") },
  { id: "t3", name: "إيمان", city: "الرباط", videoThumbnail: resolveProductImage("northern-lights-galaxy-projector", "06-gaming-room", "thumbnail"), videoUrl: "#", quote: L("بروجيكتور الأورورا خرافي", "Le projecteur aurore est incroyable", "The aurora projector is amazing") },
  { id: "t4", name: "يوسف", city: "طنجة", videoThumbnail: resolveProductImage("bluetooth-star-projector", "05-living-room", "thumbnail"), videoUrl: "#", quote: L("بروجيكتور المجرة كيشعل الغرفة", "Le projecteur galaxie illumine tout", "The galaxy projector lights the room") },
];

export const instagramPosts: InstagramPost[] = [
  { id: "ig1", image: resolveProductImage("northern-lights-galaxy-projector", "20-social-media-banner", "thumbnail"), url: "https://instagram.com/shopnoorva", likes: 2847 },
  { id: "ig2", image: resolveProductImage("astronaut-bt-speaker-projector", "20-social-media-banner", "thumbnail"), url: "https://instagram.com/shopnoorva", likes: 1923 },
  { id: "ig3", image: resolveProductImage("bluetooth-star-projector", "20-social-media-banner", "thumbnail"), url: "https://instagram.com/shopnoorva", likes: 3456 },
  { id: "ig4", image: resolveProductImage("rabbit-carousel-night-light", "20-social-media-banner", "thumbnail"), url: "https://instagram.com/shopnoorva", likes: 1567 },
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
