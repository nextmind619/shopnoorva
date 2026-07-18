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
    name: L("بروجيكتور النجوم بقبة الكريستال بلوتوث", "Projecteur Étoiles Dôme Cristal Bluetooth", "Bluetooth Crystal Dome Star Projector"),
    shortDescription: L(
      "جسم أسود مطفي — قبة كريستال + سديم ونجوم ليزر + سبيكر بلوتوث + ريموت بمؤقت",
      "Corps noir mat — dôme cristal, nébuleuse + étoiles laser, Bluetooth, minuterie",
      "Matte black body — crystal dome, nebula + laser stars, Bluetooth speaker, timer remote"
    ),
    description: L(
      "بروجيكتور نجوم NOORVA بجسم أسود مطفي على شكل صحني وقبة كريستال متعددة الأوجه. يعرض سديم ملوّن مع نقاط نجوم ليزر حادة على السقف والجدران. سبيكر بلوتوث مدمج، ريموت بمؤقت إيقاف تلقائي. مثالي للغرف، الاسترخاء، والتصوير.",
      "Projecteur étoiles NOORVA, corps noir mat en forme de soucoupe avec dôme cristal facetté. Nébuleuse colorée et étoiles laser nettes. Haut-parleur Bluetooth intégré, télécommande avec minuterie. Idéal chambre, détente et contenu.",
      "NOORVA star projector with matte black saucer body and faceted crystal dome. Colorful nebula with sharp laser star points. Built-in Bluetooth speaker, remote with auto-off timer. Perfect for rooms, relaxation and content creation."
    ),
    categoryId: "cat-projectors",
    price: 159,
    compareAtPrice: 229,
    sku: "NRV-STARBT-01",
    stock: 75,
    rating: 4.7,
    reviewCount: 214,
    soldCount: 1390,
    isBestSeller: true,
    isTrending: true,
    isTikTokViral: false,
    isFeatured: true,
    flashSaleEndsAt: flashEnd,
    warrantyMonths: 12,
    problemEmoji: "💫",
    problem: L("البروجيكتور ديالك كيعطي نقط ضعيفة؟", "Votre projecteur fait des points faibles?", "Weak dotty projector?"),
    problemCause: L("البروجيكتورات الرخيصة كتعطي ضوء باهت بدون أجواء حقيقية", "Les projecteurs cheap donnent une lumière faible sans ambiance", "Cheap projectors give weak light without real atmosphere"),
    problemSolution: L("قبة كريستال + سديم ونجوم ليزر + سبيكر بلوتوث + مؤقت", "Dôme cristal + nébuleuse/étoiles laser + Bluetooth + minuterie", "Crystal dome + nebula/laser stars + Bluetooth + timer"),
    deepDescription: L(
      "جسم أسود مطفي بقبة كريستال متعددة الأوجه يعرض سديم ملوّن ونجوم ليزر حادة. سبيكر بلوتوث، ريموت بمؤقت إيقاف تلقائي — أجواء سينمائية في غرفتك.",
      "Corps noir mat avec dôme cristal facetté, nébuleuse colorée et étoiles laser. Bluetooth, minuterie automatique.",
      "Matte black body with faceted crystal dome, colorful nebula and sharp laser stars. Bluetooth speaker, auto-off timer."
    ),
    tags: ["star", "laser", "bluetooth", "crystal", "timer", "galaxy", "bedroom", "decor", "gift", "relaxation"],
    benefits: [
      L("قبة كريستال متعددة الأوجه", "Dôme cristal facetté", "Faceted crystal dome"),
      L("سديم ملوّن + نجوم ليزر", "Nébuleuse + étoiles laser", "Colorful nebula + laser stars"),
      L("بلوتوث + سبيكر مدمج", "Bluetooth + haut-parleur", "Bluetooth + built-in speaker"),
      L("مؤقت إيقاف تلقائي", "Minuterie automatique", "Auto-off timer"),
    ],
    features: [
      L("قبة كريستال + إسقاط مجرة", "Dôme cristal + projection galaxie", "Crystal dome + galaxy projection"),
      L("بلوتوث + سبيكر مدمج", "Bluetooth + haut-parleur", "Bluetooth + built-in speaker"),
      L("ريموت بمؤقت إيقاف تلقائي", "Télécommande avec minuterie", "Remote with auto-off timer"),
      L("جسم أسود مطفي فاخر", "Corps noir mat premium", "Premium matte black body"),
    ],
    specifications: [
      { label: L("التصميم", "Design", "Design"), value: L("صحني أسود + قبة كريستال", "Soucoupe noire + dôme cristal", "Black saucer + crystal dome") },
      { label: L("المادة", "Matériau", "Material"), value: L("بلاستيك ABS مطفي", "Plastique ABS mat", "Matte ABS plastic") },
      { label: L("الطاقة", "Alimentation", "Power"), value: L("DC 5V", "DC 5V", "DC 5V") },
      { label: L("الإسقاط", "Projection", "Projection"), value: L("سديم RGB + نجوم ليزر", "Nébuleuse RGB + étoiles laser", "RGB nebula + laser stars") },
      { label: L("البلوتوث", "Bluetooth", "Bluetooth"), value: L("سبيكر مدمج", "Haut-parleur intégré", "Built-in speaker") },
      { label: L("المؤقت", "Minuterie", "Timer"), value: L("نعم — إيقاف تلقائي", "Oui — arrêt auto", "Yes — auto-off") },
      { label: L("التحكم", "Contrôle", "Control"), value: L("ريموت + أزرار الجهاز", "Télécommande + boutons", "Remote + device buttons") },
      { label: L("الضمان", "Garantie", "Warranty"), value: L("12 شهر", "12 mois", "12 months") },
    ],
    packageIncludes: [
      L("بروجيكتور النجوم بقبة الكريستال", "Projecteur dôme cristal", "Crystal dome star projector"),
      L("ريموت تحكم بمؤقت", "Télécommande avec minuterie", "Remote with timer"),
      L("كابل USB", "Câble USB", "USB cable"),
      L("دليل الاستخدام", "Manuel", "User manual"),
    ],
    howToUse: L("ضع في غرفة مظلمة، وجّه للسقف، استخدم الريموت لاختيار الوضع والمؤقت.", "Pièce sombre, orienter vers plafond, télécommande pour mode et minuterie.", "Dark room, aim at ceiling, use remote for mode and timer."),
    images: [],
    lifestyleImages: [],
    lifestyleScenes: [
      { id: "bedroom", emoji: "🛏️", title: L("غرفة النوم", "Chambre", "Bedroom"), description: L("سديم ناعم يساعد على النوم مع مؤقت إيقاف", "Nébuleuse douce avec minuterie pour dormir", "Soft nebula with sleep timer") },
      { id: "gaming", emoji: "🎮", title: L("غرفة الجيمنغ", "Gaming", "Gaming Room"), description: L("أجواء سينمائية للعب والبث المباشر", "Ambiance cinéma pour gaming et stream", "Cinematic vibe for gaming and streaming") },
      { id: "living", emoji: "🛋️", title: L("غرفة المعيشة", "Salon", "Living Room"), description: L("ديكور فاخر يبان فالتصوير والاستقبال", "Déco premium pour photos et soirées", "Premium decor for photos and evenings") },
      { id: "romantic", emoji: "💫", title: L("أجواء رومانسية", "Romantique", "Romantic"), description: L("مجرة خاصة لأمسيات على قد الحب", "Galaxie intime pour soirées à deux", "Private galaxy for intimate evenings") },
    ],
    variants: [{ id: "var-starbt", name: L("أسود", "Noir", "Black"), price: 159, compareAtPrice: 229, sku: "NRV-STARBT-01", stock: 75 }],
    upsellIds: ["prod-mx003", "prod-aurora"],
    crossSellIds: ["prod-rabbit"],
    seo: {
      title: L("بروجيكتور النجوم بقبة الكريستال بلوتوث | NOORVA", "Projecteur Étoiles Dôme Cristal Bluetooth | NOORVA", "Bluetooth Crystal Dome Star Projector | NOORVA"),
      description: L("بروجيكتور نجوم بقبة كريستال وسديم وليزر وبلوتوث ومؤقت — الدفع عند الاستلام", "Projecteur dôme cristal + nébuleuse + Bluetooth + minuterie — COD", "Crystal dome star projector + nebula + Bluetooth + timer — COD"),
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
  { id: "r4", productId: "prod-starbt", author: "أمين التازي", city: "طنجة", rating: 5, title: L("جودة عالية", "Haute qualité", "High quality"), content: L("بروجيكتور قبة الكريستال كيشعل الغرفة كاملة والمؤقت مفيد بزاف.", "Le projecteur dôme cristal illumine toute la pièce, la minuterie est top.", "Crystal dome projector lights the whole room, the timer is very useful."), date: "2026-06-08", verified: true, images: [resolveProductImage("bluetooth-star-projector", "05-living-room", "thumbnail")] },
  { id: "r5", productId: "prod-aurora", author: "خديجة الفاسي", city: "فاس", rating: 5, title: L("خدمة ممتازة", "Service top", "Great service"), content: L("طلبت بالواتساب والدفع عند الاستلام. كلشي ساهل والتطبيق كيخدم مزيان.", "Commande facile COD, l'app fonctionne très bien.", "Easy COD order, the app works very well."), date: "2026-06-01", verified: true, images: [resolveProductImage("northern-lights-galaxy-projector", "04-bedroom", "thumbnail")] },
  { id: "r6", productId: "prod-mx003", author: "محمد برادة", city: "أكادير", rating: 5, title: L("أجواء سينمائية", "Ambiance cinéma", "Cinema vibe"), content: L("شريت جوج بروجيكتورات MX003. الغرفة ولاّت سينما بصوت البلوتوث.", "Deux projecteurs MX003 = ambiance cinéma avec le Bluetooth.", "Two MX003 projectors = cinema vibe with Bluetooth sound."), date: "2026-05-25", verified: true, hasVideo: true },
  { id: "r7", productId: "prod-starbt", author: "نور الهدى", city: "الدار البيضاء", rating: 5, title: L("أحسن شراء", "Meilleur achat", "Best purchase"), content: L("الليزر قوي بزاف والمؤقت كيخدم مزيان كل ليلة.", "Le laser est très puissant et la minuterie fonctionne bien chaque nuit.", "The laser is very strong and the timer works well every night."), date: "2026-05-18", verified: true, images: [resolveProductImage("bluetooth-star-projector", "05-living-room", "thumbnail")] },
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
  { id: "t4", name: "يوسف", city: "طنجة", videoThumbnail: resolveProductImage("bluetooth-star-projector", "05-living-room", "thumbnail"), videoUrl: "#", quote: L("بروجيكتور الليزر كيشعل الغرفة", "Le projecteur laser illumine tout", "The laser projector lights the room") },
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
