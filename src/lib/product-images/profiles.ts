/** Step 1: Product analysis profiles with exact visual identity for AI recreation */
export interface ProductProfile {
  id: string;
  slug: string;
  sku: string;
  name: string;
  type: string;
  color: string;
  category: string;
  categoryId: string;
  shortDescription: string;
  visualIdentity: string;
  dimensions?: string;
  accessories: string[];
  packageItems: string[];
  /** Commercial source URLs (manufacturer / Amazon / supplier) for exact-match downloads */
  sourceUrls: Partial<Record<string, string>>;
}

export const PRODUCT_PROFILES: ProductProfile[] = [
  {
    id: "prod-mx003",
    slug: "astronaut-bt-speaker-projector",
    sku: "NRV-MX003-01",
    name: "Astronaut Bluetooth Speaker Galaxy Projector",
    type: "Galaxy Projector + Bluetooth Speaker (2-in-1)",
    color: "White (black visor, black remote)",
    category: "Galaxy Projectors",
    categoryId: "cat-projectors",
    shortDescription: "White chibi astronaut projector — model MXS003, built-in Bluetooth 5.0 speaker, TF card + AUX playback, RGB nebula modes, black remote",
    visualIdentity:
      "EXACT real product — white chibi astronaut-shaped galaxy projector with built-in Bluetooth 5.0 speaker (model MXS003). Rounded white helmet with large dark glossy reflective visor that projects colorful nebula and star light onto ceiling and walls. Small circular lens on top of the helmet. Large circular perforated speaker grille on the chest with concentric holes. Smooth white rounded body and base, standing pose. Slim black remote control with red power button and RGB color buttons. White USB Type-C charging cable. Supports TF memory card and AUX playback, built-in microphone for hands-free calls. Matte white ABS plastic, friendly rounded astronaut silhouette. Compact tabletop size around 16x10x10cm. DO NOT redesign — exact replica of commercial product photography.",
    dimensions: "16 × 10 × 10 سم",
    accessories: ["Black remote control", "USB Type-C cable", "User manual"],
    packageItems: ["Astronaut Bluetooth speaker projector", "Remote control", "USB Type-C cable", "Instruction manual"],
    sourceUrls: {},
  },
  {
    id: "prod-starbt",
    slug: "bluetooth-star-projector",
    sku: "NRV-STARBT-01",
    name: "Multi-Color Galaxy Star Projector Night Light with Speaker & Remote",
    type: "Multi-color galaxy / star projector night light with built-in speaker and remote",
    color: "Matte Black",
    category: "Galaxy Projectors",
    categoryId: "cat-projectors",
    shortDescription: "Matte black Cosmic Voyager bowl — faceted crystal dome, up to 21 light modes, Bluetooth speaker, remote with 1h/2h timer, USB DC 5V 6W",
    visualIdentity:
      "MASTER REAL PRODUCT (client-confirmed): matte black bowl/saucer galaxy star projector with faceted transparent crystal dome glowing cyan/blue, circular speaker mesh on the body, front panel with four rectangular buttons + USB/TF + dual DC 5V 2A ports, slim black remote with red power button and 1H/2H. Marketing composite may show nebula projection strip and 10 color-mode spheres. NEVER aluminium cylinder, astronaut, white geometric aurora, rabbit lamp, or any redesign.",
    dimensions: "≈13.5 × 13.5 × 10 cm",
    accessories: ["Remote control (2×AAA not included)", "USB power cable", "User manual"],
    packageItems: ["Galaxy star projector", "Remote control", "USB cable", "Instruction manual"],
    sourceUrls: {
      jumia: "https://www.jumia.ma/ar/generic-veilleuse-multi-couleurs-avec-haut-parleur-integre-et-controle-a-distance-64923150.html",
    },
  },
  {
    id: "prod-aurora",
    slug: "northern-lights-galaxy-projector",
    sku: "NRV-AURORA-01",
    name: "White Geometric Dream Aurora Star Projector with Bluetooth",
    type: "Geometric aurora / star / moon projector night light with Bluetooth speaker and remote",
    color: "Matte White",
    category: "Galaxy Projectors",
    categoryId: "cat-projectors",
    shortDescription: "Matte white faceted low-poly body — aurora waves + stars + crescent moon, Bluetooth speaker, white remote with 1h/2h timer, USB Type-C",
    visualIdentity:
      "Use the uploaded reference image as the strict visual reference for the exact physical product. Reproduce the same matte white geometric faceted (low-poly / crystalline) Dream Aurora projector without changing shape, proportions, materials, or color. Exact clear faceted central projection dome on top with two flanking circular apertures. Exact front facet with small red IR/LED indicator and a horizontal row of four grey hexagonal/trapezoidal buttons. Exact slim white rectangular remote with red power button, navigation pad, R/G/B/W and 1H/2H timer buttons. NEVER black UFO dome, astronaut, rabbit lamp, black Cosmic Voyager saucer, or any redesign.",
    dimensions: "≈16 × 9 × 10.5 cm",
    accessories: ["White remote control", "USB / Type-C power cable", "User manual"],
    packageItems: ["White geometric aurora projector", "White remote control", "USB/Type-C cable", "Instruction manual"],
    sourceUrls: {
      aliexpress: "https://www.aliexpress.com/item/1005006343735656.html",
    },
  },
  {
    id: "prod-rabbit",
    slug: "rabbit-carousel-night-light",
    sku: "NRV-RABBIT-01",
    name: "DORVOL Pink Rabbit Rotating Carousel Night Light Projector",
    type: "360° Rotating Carousel LED Starry Night Light Projector with 6-in-1 Films",
    color: "Pink",
    category: "Night Lights",
    categoryId: "cat-nightlights",
    shortDescription:
      "Amazon DORVOL B0H65HJYPN / model WHE11 — pink rabbit carousel, 360° rotation, 6 interchangeable films, 5 colour modes, USB powered, 5W LED, plastic, 350g",
    visualIdentity:
      "AMAZON-CONFIRMED REAL PRODUCT (DORVOL ASIN B0H65HJYPN, model WHE11 — locked): matte pastel pink rabbit-theme carousel night light projector with metallic gold/rose-gold accents. Exact scalloped umbrella canopy + gold trim + round gold ball finial. Exact clear/frosted central projection cylinder. Exact SMALL pink rabbit figurines on thin vertical rods around the spinning carousel. Exact rounded pink bowl base with gold scalloped rim and ornate scroll/cabriole gold legs. Front interface shows a power port and a row of circular control buttons. Projects interchangeable film themes (Starry Sky, Ocean World, Dinosaur Land, Happy Birthday, Underwater Fantasy, Animal Forest). 5 colour modes, brightness adjustment, rotation mode, projection mode. USB powered (corded electric / power bank / laptop / USB adaptor), LED 5W, plastic enclosure. Dimensions 12D x 19W x 12H cm, weight 350g. NEVER invent music box, Bluetooth speaker, remote control, or rechargeable battery if not shown. NEVER birdcage redesign, yellow body, wrong animal, or other brand logos. Preserve exact shape, proportions, materials, and colours from Amazon gallery and amazon-refs.",
    dimensions: "12D × 19W × 12H cm",
    accessories: ["6 interchangeable projection film discs", "User manual"],
    packageItems: [
      "Pink rabbit carousel night light projector",
      "6 interchangeable film discs",
      "User manual",
      "Package contents (4 items per Amazon listing)",
    ],
    sourceUrls: {
      amazon: "https://www.amazon.in/DORVOL-Rotating-Carousel-Projector-Powered/dp/B0H65HJYPN",
      amazonRefs: "/products/rabbit-carousel-night-light/amazon-refs/",
    },
  },
  {
    id: "prod-laser303",
    slug: "green-laser-pointer-303",
    sku: "PRD-3765E729",
    name: "Green Laser Pointer 303",
    type: "Handheld rechargeable green laser pointer",
    color: "Matte Black",
    category: "Laser Pointers",
    categoryId: "cat-laser-pointers",
    shortDescription:
      "Matte black aluminum Laser 303 — powerful green beam, diamond knurled grip, USB-rechargeable 18650, wrist strap, safety keys, star pattern cap",
    visualIdentity:
      "EXACT real product — matte black cylindrical aluminum alloy Green Laser Pointer 303. Diamond-pattern knurled mid-grip, smooth barrel sections, ridged head bezel, small circular tactile power button, silver/metallic Laser 303 label on grip, multi-color laser radiation warning sticker near aperture, recessed USB charging port in tail, black nylon wrist lanyard with two black-headed metal safety keys on split ring. Optional gold-interior star pattern cap. Emits vivid neon green laser beam / starry pattern. NEVER redesign as flashlight-only, toy plastic, or projector dome.",
    dimensions: "Handheld pen-style ≈ 16 cm length",
    accessories: ["USB charging cable", "Wrist strap with safety keys", "Star pattern cap", "User manual"],
    packageItems: [
      "Green Laser Pointer 303",
      "Rechargeable 18650 battery",
      "USB charging cable",
      "Wrist strap with safety keys",
      "Star pattern cap",
      "User manual",
    ],
    sourceUrls: {
      amazonRefs: "/products/green-laser-pointer-303/amazon-refs/",
    },
  },
  {
    id: "prod-shiatsu",
    slug: "shiatsu-neck-shoulder-massager",
    sku: "NRV-SHIATSU-01",
    name: "Shiatsu 3D Neck & Shoulder Massager with Heat",
    type: "Electric Shiatsu neck / shoulder / back massager with heating",
    color: "Forest Green with brown leather strap",
    category: "Relaxation & Wellness",
    categoryId: "cat-relaxation",
    shortDescription:
      "Forest-green U-shaped Shiatsu neck & shoulder massager — soft silicone kneading nodes, built-in heat, auto-rotation, adjustable brown PU leather straps, electric powered",
    visualIdentity:
      "EXACT real product — forest green (#1B4D3E family) ABS U-shaped / wrap-around Bionic Finger / Hand-Simulation Shiatsu neck and shoulder massager with heat. Soft green ABS shell with brown / tan pebbled PU leather adjustable straps and buckle-style fasteners. Black control panel with power + heat buttons. Exactly 8 soft food-grade silicone finger-like kneading nodes (4 per side) on the inner contact surface that simulate hand massage. Compact electric wellness device for neck, shoulders, back, waist and legs. Clean modern premium look, no purple accents, no redesign as pillow-only or handheld gun massager. Preserve exact proportions, forest-green ABS body, brown PU straps, black controls, and 8 silicone nodes from reference photography.",
    dimensions: "Wearable U-shape / wrap-around neck massager",
    accessories: ["Power adapter", "User manual"],
    packageItems: [
      "Shiatsu neck & shoulder massager",
      "Power adapter",
      "User manual",
    ],
    sourceUrls: {
      amazonRefs: "/products/shiatsu-neck-shoulder-massager/",
    },
  },
  {
    id: "prod-galaxy-rgb",
    slug: "star-galaxy-projector-rgb-gift",
    sku: "NRV-GALAXY-RGB-01",
    name: "Star & Galaxy Projection Lamp with RGB LED Strip Gift",
    type: "Galaxy / star projection night light with free RGB LED strip bundle",
    color: "Matte Black",
    category: "Galaxy Projectors",
    categoryId: "cat-projectors",
    shortDescription:
      "Matte black bowl galaxy projector — faceted crystal dome, multicolor nebula/stars, USB + DC 5V 2A, 2H timer, brightness slider, OFF-ON — plus flexible RGB LED strip on reel with gift bow",
    visualIdentity:
      "EXACT real product from client reference: matte black bowl-shaped star/galaxy projector with transparent multifaceted crystal dome emitting vivid magenta/cyan/orange/yellow nebula light. Front control panel with USB-A port, DC 5V 2A input, four square mode/timer buttons (2H), brightness slider, physical OFF-ON toggle. BUNDLE: flexible multicolor RGB LED strip on black plastic reel with large red satin gift bow, yellow plus sign between strip and projector in marketing composite. Cosmic purple/blue/pink nebula background in hero ads. NEVER astronaut, white aurora geometric, rabbit carousel, or aluminium laser pointer.",
    dimensions: "Compact tabletop projector + RGB strip reel",
    accessories: ["RGB LED light strip (gift)", "Power cable", "User manual"],
    packageItems: [
      "Star & galaxy projection lamp",
      "RGB LED light strip gift",
      "Power cable",
      "User manual",
    ],
    sourceUrls: {
      amazonRefs: "/products/star-galaxy-projector-rgb-gift/",
    },
  },
  {
    id: "prod-car-mount",
    slug: "magnetic-car-phone-mount-maidsail",
    sku: "Mag-Holder",
    name: "Maidsail Magnetic Car Phone Mount",
    type: "Magnetic suction-cup car phone holder with adjustable arm",
    color: "Black with metallic grey / silver accents",
    category: "Car Accessories",
    categoryId: "cat-car-accessories",
    shortDescription:
      "Maidsail magnetic car mount — strong MagSafe-compatible ring head, multi-joint adjustable arm, vacuum suction base with twist-lock (TIGHT / OPEN)",
    visualIdentity:
      "CLIENT-CONFIRMED ORIGINAL PRODUCT: matte black + gunmetal magnetic car phone mount. Hollow-center MagSafe-style ring head WITHOUT printed MagSafe text. Dual-hinge foldable metallic arm. Circular vacuum suction base with knurled metallic lock ring labeled ◀ TIGHT |||||||||||| OPEN ▶ and a small suction pull-tab. Official reference is the studio collage (main unit + 3 insets: phone on arm, magnetic attach graphic, folded compact). NEVER use the fake 1+1 composite that shows two units with MagSafe printed on the ring, a mid-arm tightening knob, or a lever lock. NEVER redesign as vent clip-only or wireless charger dock.",
    dimensions: "Foldable adjustable arm mount with suction base",
    accessories: ["Magnetic ring head (MagSafe compatible)", "Suction cup base with lock ring"],
    packageItems: ["Magnetic car phone mount", "User manual"],
    sourceUrls: {
      amazonRefs: "/products/magnetic-car-phone-mount-maidsail/",
      clientRef: "/products/magnetic-car-phone-holder-1-plus-1/product-reference.png",
    },
  },
  {
    id: "prod-mosquito-tent",
    slug: "foldable-mosquito-bed-tent",
    sku: "Mosquito-protection-tent",
    name: "Foldable Mosquito Protection Bed Tent",
    type: "Pop-up mosquito net bed tent with zippered entry",
    color: "White mesh with blue flexible frame trim; lime-green and royal-blue storage bag",
    category: "Bedroom",
    categoryId: "cat-bedroom-lighting",
    shortDescription:
      "White dome mosquito net tent over double/queen bed — lace trim, U-shaped zip door, foldable pop-up frame, circular carry bag",
    visualIdentity:
      "EXACT real product — white fine-mesh pop-up mosquito bed tent with flexible blue border/frame forming a dome over a bed. Horizontal white lace-like decorative trim on upper section. Large U-shaped zippered side opening. Fully deployed covering double/queen mattress on light wood bed frame with white bedding. Circular two-tone carry bag (lime green top, royal blue bottom) with blue handle leaning against bed. Bright modern bedroom with window light, bedside lamp, plant. NEVER redesign as hanging canopy-only net without pop-up frame or different color scheme.",
    dimensions: "200 × 180 × 150 cm opened (L × W × H); fits double/queen bed up to 200 × 180 cm; folded carry bag ≈ 60 cm diameter",
    accessories: ["Circular zippered storage bag (green/blue)"],
    packageItems: ["Foldable mosquito bed tent", "Storage carry bag"],
    sourceUrls: {
      clientRef: "/products/foldable-mosquito-bed-tent/",
    },
  },
  {
    id: "prod-dual-cooler",
    slug: "portable-rechargeable-dual-fan-air-cooler",
    sku: "Portable-air-cooler",
    name: "Portable Rechargeable Dual-Fan Air Cooler",
    type: "Portable evaporative / dual-fan desk air cooler",
    color: "White with tan/brown leather-like carry strap",
    category: "Home & Desk",
    categoryId: "cat-home-decor",
    shortDescription:
      "White tower dual-fan portable air cooler — rechargeable battery, strong wide airflow, mist nozzles, water level window, elegant desk design with top carry strap",
    visualIdentity:
      "EXACT real product — tall white matte plastic tower portable dual-fan air cooler with mist spray and LED light. Two vertically stacked circular fans behind white radial slat grilles with cool blue LED glow inside. Three small copper/rose-gold mist spray nozzles in a horizontal row above the top fan. Slim vertical LED light strip on upper front-right. Tan/brown leather-like carry strap arched over the top with metal rivets. Transparent water tank under top lid. Rounded soft edges, oval flat white base, USB-C charging near base. Compact elegant desk / bedside cooler ~37.5×14.8×8.5 cm — NOT a large floor AC unit, NOT black industrial fan, NOT single-blade only. DO NOT redesign.",
    dimensions: "37.5 × 14.8 × 8.5 cm",
    accessories: ["USB charging cable", "User manual"],
    packageItems: ["Dual-fan portable air cooler", "USB charging cable", "User manual"],
    sourceUrls: {
      clientRef: "/products/portable-rechargeable-dual-fan-air-cooler/",
    },
  },
  {
    id: "prod-car-fan-sunshade",
    slug: "car-dual-fan-foldable-sunshade-2in1-pack",
    sku: "NRV-CARFAN-SUN-01",
    name: "2-in-1 Pack: Dual Car Fan and Foldable Front Windshield Sunshade",
    type: "Dual dashboard car fan + foldable umbrella-style windshield sunshade",
    color: "Black fan base and grilles with yellow blades; silver reflective sunshade with black interior and carry pouch",
    category: "Car Accessories",
    categoryId: "cat-car-accessories",
    shortDescription:
      "2-in-1 car summer pack — dual-head adjustable dashboard fan plus foldable silver reflective front windshield sunshade with carry pouch",
    visualIdentity:
      "EXACT real product bundle — (1) Dual car fan: black plastic base with red toggle switch, two pivoting arms, circular fan heads with black outer grilles and bright yellow inner blades, sits on car dashboard. (2) Foldable windshield sunshade: umbrella-style collapsible frame, silver reflective exterior, black interior fabric, shown open, in black leather-like vertical carry pouch, and installed inside red car windshield with yellow arrows illustrating heat reflection. Marketing hero shows both products on dashboard with palm trees/sunny sky through windshield. NEVER redesign as single fan only, cardboard accordion shade only, or rear-window-only shade.",
    dimensions: "Dashboard dual fan; foldable full windshield sunshade",
    accessories: ["Sunshade carry pouch"],
    packageItems: ["Dual car fan", "Foldable front windshield sunshade", "Sunshade carry pouch"],
    sourceUrls: {
      clientRef: "/products/car-dual-fan-foldable-sunshade-2in1-pack/",
    },
  },
  {
    id: "prod-vintage-lantern",
    slug: "vintage-led-lantern",
    sku: "Rechargeable-Camping-Lantern",
    name: "Vintage LED Hurricane Lantern",
    type: "Classic Hurricane-style decorative LED lantern",
    color: "Distressed antique bronze/gold over dark base",
    category: "Home Decor",
    categoryId: "cat-home-decor",
    shortDescription:
      "35cm tall vintage Hurricane LED lantern — frosted amber globe, X-wire cage, curved side tubes, tiered chimney cap, black wire handle, base power button and dimmer knob",
    visualIdentity:
      "EXACT real product from client reference — classic Hurricane-style LED lantern 35cm tall. Distressed antique bronze/gold brushed finish over dark black/brown base (NOT silver chrome). Frosted glass globe glowing warm amber/orange LED. Thin metal wire protective cage with sharp X-shaped wires front and back. Two thick curved hollow metal side tubes from tiered circular base to tiered chimney cap with small rectangular ventilation holes. Black wire bail handle on top. Base front: round black power button center-bottom and textured round dimmer/switch knob above. NEVER redesign shape, NEVER modernize, NEVER substitute different lantern, NEVER add/remove features.",
    dimensions: "35 cm height",
    accessories: [],
    packageItems: ["Vintage LED lantern"],
    sourceUrls: {
      clientRef: "/products/vintage-led-lantern/product-reference.png",
    },
  },
  {
    id: "prod-warm-led-lamp",
    slug: "warm-led-decor-lamp",
    sku: "Warm-LED-Decor-Lamp",
    name: "Warm LED Decor Lamp",
    type: "Decorative oval/arch LED table lamp",
    color: "Transparent crystal-textured body with warm golden glow, gold metallic base",
    category: "Home Decor",
    categoryId: "cat-home-decor",
    shortDescription:
      "Decorative oval/arch LED lamp — transparent faceted crystal body, gold-lined inner rim, gold metallic cylindrical base with power button, warm ambient glow",
    visualIdentity:
      "EXACT real product from client reference — decorative LED table lamp with tall vertical hollow oval/arch ring design on flat circular gold base. Outer body: transparent crystalline material with highly textured faceted diamond-cut pattern refracting warm light. Inner rim: polished gold-toned metal with concentric ribbed textures along inside of arch. Base: low flat cylindrical polished gold/rose-gold mirror finish with small cylindrical metallic power button on top surface. Warm golden-toned glow diffused through crystalline texture. NEVER redesign shape, NEVER change proportions, NEVER substitute different lamp, NEVER add/remove buttons or features.",
    dimensions: "Table lamp — oval/arch decorative form factor",
    accessories: [],
    packageItems: ["Decorative LED lamp"],
    sourceUrls: {
      clientRef: "/products/warm-led-decor-lamp/product-reference.png",
    },
  },
  {
    id: "prod-calc-tablet",
    slug: "solar-calculator-lcd-notepad",
    sku: "NRV-CALC-ZH70-01",
    name: "Solar Calculator with LCD Writing Tablet",
    type: "2-in-1 desktop calculator with built-in LCD writing tablet and stylus",
    color: "Matte black with teal ON/AC key and teal LCD writing",
    category: "Study & Office",
    categoryId: "cat-study-office",
    shortDescription:
      "Wide landscape 2-in-1 — 12-digit solar calculator on the LEFT, LCD writing tablet with black stylus on the RIGHT, dual power, easy erase",
    visualIdentity:
      "EXACT real product from client reference — WIDE HORIZONTAL landscape 2-in-1, NOT vertical, NOT stacked, NOT a folding clamshell. Slim matte black/dark-grey rectangular body with rounded corners. LEFT half: 12-digit LCD calculator showing numbers, small rectangular solar panel directly above the display, square keys (grey number keys, bright teal/turquoise ON/AC, larger light-grey + and =). Bezel text: ZH-70, 12 DIGITS NOTES, TOW WAY POWER. Trash/lock/stylus icons below the calculator screen. RIGHT half: large bezel-less LCD writing tablet with bright teal handwriting (formulas, sine wave, geometric shapes) and a slim black stylus with clip. Dual solar power. NEVER redesign as a vertical notepad calculator, NEVER change colors or split layout.",
    dimensions: "Wide landscape desktop 2-in-1",
    accessories: ["Black stylus pen"],
    packageItems: ["Calculator with LCD writing tablet", "Stylus pen"],
    sourceUrls: {
      clientRef: "/products/solar-calculator-lcd-notepad/product-reference.png",
    },
  },
  {
    id: "prod-heli-freshener",
    slug: "solar-helicopter-car-air-freshener",
    sku: "NRV-HELI-FRESH-01",
    name: "Solar Helicopter Car Air Freshener",
    type: "Solar-powered decorative helicopter car air freshener",
    color: "Silver chrome helicopter, glossy black cockpit, matte black rotors, metallic red circular base",
    category: "Car Accessories",
    categoryId: "cat-car-accessories",
    shortDescription:
      "Miniature chrome helicopter on a metallic red solar base — spinning rotors in sunlight, fragrance vents on the side, dashboard decor + cabin comfort",
    visualIdentity:
      "EXACT real product from client reference — miniature decorative solar helicopter car air freshener on a car dashboard. Sleek metallic silver chrome helicopter body with glossy black cockpit canopy, pointed aerodynamic tail, four-bladed matte black main rotor. Helicopter sits on a small central pillar above a circular metallic red base. Dark circular solar panel on the top of the red base directly beneath the helicopter. Three vertical fragrance vents/slits on the side of the red base. Placed at the center of a tan textured car dashboard behind the windshield, road and trees visible through the glass. NEVER redesign as a toy helicopter, drone, or vent-clip cardboard freshener. Preserve exact chrome, black cockpit, red solar base, and proportions from the reference photo.",
    dimensions: "Compact dashboard helicopter on circular solar base",
    accessories: [],
    packageItems: ["Solar helicopter car air freshener"],
    sourceUrls: {
      clientRef: "/products/solar-helicopter-car-air-freshener/product-reference.png",
    },
  },
  {
    id: "prod-sunshade",
    slug: "foldable-car-windshield-sunshade",
    sku: "NRV-SUNSHADE-01",
    name: "Foldable Umbrella Car Windshield Sunshade",
    type: "Foldable umbrella-style front windshield sunshade",
    color: "Silver reflective exterior, black interior, black leather-like pouch",
    category: "Car Accessories",
    categoryId: "cat-car-accessories",
    shortDescription:
      "Umbrella-style foldable windshield sunshade — silver reflective exterior, black interior, short black handle, compact black leather-like carry pouch",
    visualIdentity:
      "EXACT real product from client reference — foldable umbrella-style car windshield sunshade. Rectangular canopy with metal ribs radiating from a central shaft and a short black handle with wrist strap. Interior face matte black; exterior face bright silver reflective. Shown fully open against blue sky, installed inside a red sedan windshield with yellow heat-reflection arrows, and folded into a slim black pebbled faux-leather storage sleeve with hanging strap. NEVER redesign as accordion cardboard shade, rear-window-only shade, or dual-fan bundle. Preserve exact umbrella mechanism, silver/black faces, pouch, and proportions.",
    dimensions: "Full front windshield coverage; folds to compact pouch size",
    accessories: ["Black leather-like carry pouch"],
    packageItems: ["Foldable windshield sunshade", "Black carry pouch"],
    sourceUrls: {
      clientRef: "/products/foldable-car-windshield-sunshade/product-reference.jpg",
    },
  },
  {
    id: "prod-mini-vacuum",
    slug: "cordless-mini-vacuum-keyboard",
    sku: "NRV-VACMINI-01",
    name: "Cordless Mini Vacuum Keyboard Duster",
    type: "2-in-1 cordless handheld mini vacuum and air duster for keyboards and electronics",
    color: "Matte Black",
    category: "Study & Office",
    categoryId: "cat-study-office",
    shortDescription:
      "Matte black pistol-grip cordless mini vacuum — transparent dust cup, long brush nozzle, crevice tool, USB rechargeable",
    visualIdentity:
      "EXACT real product from client reference — compact matte black cordless pistol-grip handheld mini vacuum / air duster. Short cylindrical body with semi-transparent dust collection chamber, trigger on the underside of the handle, long thin extension nozzle with a small round brush tip. Palm-sized desktop gadget, NOT a stick vacuum, NOT a full-size household vacuum. Accessories: long crevice tool, spare brush attachment, black USB charging cable. Typical use: cleaning mechanical keyboard keys, laptop, car vents, electronics. DO NOT redesign shape, color, or proportions.",
    dimensions: "Palm-sized handheld pistol-grip",
    accessories: ["Crevice tool", "Brush attachment", "USB charging cable"],
    packageItems: [
      "Cordless mini vacuum",
      "Crevice tool",
      "Brush attachment",
      "USB charging cable",
    ],
    sourceUrls: {
      clientRef: "/products/cordless-mini-vacuum-keyboard/product-reference.png",
    },
  },
];

const PROFILE_SLUG_ALIASES: Record<string, string> = {
  "magnetic-car-phone-mount": "magnetic-car-phone-mount-maidsail",
  "magnetic-car-phone-holder-1-plus-1": "magnetic-car-phone-mount-maidsail",
};

export function getProductProfile(slug: string): ProductProfile | undefined {
  const resolved = PROFILE_SLUG_ALIASES[slug] ?? slug;
  return PRODUCT_PROFILES.find((p) => p.slug === slug) ?? PRODUCT_PROFILES.find((p) => p.slug === resolved);
}

export function getProductProfileById(id: string): ProductProfile | undefined {
  return PRODUCT_PROFILES.find((p) => p.id === id);
}
