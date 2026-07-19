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
];

export function getProductProfile(slug: string): ProductProfile | undefined {
  return PRODUCT_PROFILES.find((p) => p.slug === slug);
}

export function getProductProfileById(id: string): ProductProfile | undefined {
  return PRODUCT_PROFILES.find((p) => p.id === id);
}
