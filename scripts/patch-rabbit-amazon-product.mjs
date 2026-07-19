/**
 * Replace rabbit-carousel product data with Amazon DORVOL B0H65HJYPN confirmed specs.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const file = path.join(ROOT, "src/data/products.ts");
let s = fs.readFileSync(file, "utf8");

const start = s.indexOf('  {\n    id: "prod-rabbit",');
const end = s.indexOf("];\n\nexport const reviews", start);
if (start < 0 || end < 0) {
  console.error("markers not found", start, end);
  process.exit(1);
}

const replacement = `  {
    id: "prod-rabbit",
    slug: "rabbit-carousel-night-light",
    name: L(
      "كاروسيل الأرانب الوردي — 6 أفلام إسقاط ودوران 360°",
      "Veilleuse Carrousel Lapin — 6 films et rotation 360°",
      "Pink Rabbit Carousel Night Light — 6 Films and 360° Rotation"
    ),
    shortDescription: L(
      "6 أفلام قابلة للتبديل + دوران كاروسيل 360° + 5 ألوان LED — تشغيل عبر USB — والدفع غير ملي يوصلك الطلب",
      "6 films interchangeables + carrousel 360° + 5 couleurs LED — alimentation USB — paiement à la livraison",
      "6 interchangeable films + 360° carousel + 5 LED colours — USB powered — cash on delivery"
    ),
    description: L(
      "خلّي غرفة طفلك تتحول لعالم سحري كل ليلة. كاروسيل الأرانب الوردي من NOORVA: أرانب صغيرة دوّارة 360°، إضاءة LED بـ 5 ألوان، و6 أفلام إسقاط قابلة للتبديل (سماء نجوم، عالم المحيط، أرض الديناصورات، عيد ميلاد سعيد، خيال تحت الماء، وغابة الحيوانات). شغّليه عبر USB من الشاحن أو باور بانك أو اللابتوب. هدية أنيقة لغرفة الأطفال — خلّصي كاش عند الباب فجميع مدن المغرب.",
      "Veilleuse carrousel lapin rose NOORVA: figurines rotatives 360°, LED 5 couleurs, 6 films interchangeables (ciel étoilé, océan, dinosaures, anniversaire, sous-marin, forêt). Alimentation USB (adaptateur, power bank ou ordinateur). Cadeau chambre enfant. Paiement à la livraison au Maroc.",
      "NOORVA pink rabbit carousel night light: 360° rotating bunny figurines, 5 LED colour modes, and 6 interchangeable projection films (Starry Sky, Ocean World, Dinosaur Land, Happy Birthday, Underwater Fantasy, Animal Forest). USB powered via adaptor, power bank, or laptop. Perfect kids gift. Cash on delivery in Morocco."
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
    variants: [{ id: "var-rabbit", name: L("وردي", "Rose", "Pink"), price: 139, compareAtPrice: 199, sku: "NRV-RABBIT-01", stock: 110 }],
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
`;

s = s.slice(0, start) + replacement + s.slice(end);
s = s.replace(
  "كاروسيل الأرانب زوين بزاف وجهاز الصوت كيهدّئ بنتي بسرعة.",
  "كاروسيل الأرانب زوين بزاف والإسقاط كيهنّي بنتي بسرعة."
);
s = s.replace(
  "Le carrousel lapin est adorable et le sound machine calme ma fille rapidement.",
  "Le carrousel lapin est adorable et la projection calme ma fille rapidement."
);
s = s.replace(
  "The rabbit carousel is adorable and the sound machine calms my daughter fast.",
  "The rabbit carousel is adorable and the projection calms my daughter fast."
);

fs.writeFileSync(file, s);
console.log("OK products.ts patched");
