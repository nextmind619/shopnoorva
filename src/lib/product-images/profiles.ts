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
    name: "Bluetooth Crystal Dome Star Projector",
    type: "Galaxy Star Projector with Bluetooth Speaker & Timer",
    color: "Matte Black",
    category: "Galaxy Projectors",
    categoryId: "cat-projectors",
    shortDescription: "Matte black UFO/saucer body — faceted crystal dome, nebula + laser stars, Bluetooth speaker, remote with timer",
    visualIdentity:
      "Exact product: matte black UFO/saucer-shaped Bluetooth star galaxy projector with wide flat circular top rim, tapered bowl body, smaller recessed circular base. Centered clear multi-faceted diamond-cut crystal projector dome (triangular geometric facets, NEVER smooth glass). Small round translucent white sensor on the top black ring near the dome. Front/side control strip with rectangular tactile buttons, USB-A / TF / DC 5V ports and OFF-ON slider. Fine speaker mesh on the body. Slim matte-black rectangular remote with red power button, circular D-pad, timer and color buttons. Compact tabletop size. DO NOT redesign into a metal cylinder — exact replica of the real commercial product.",
    dimensions: "≈16 × 13 سم",
    accessories: ["IR remote control with timer", "USB power cable", "User manual"],
    packageItems: ["Crystal dome star projector", "Remote control", "USB cable", "Instruction manual"],
    sourceUrls: {},
  },
  {
    id: "prod-aurora",
    slug: "northern-lights-galaxy-projector",
    sku: "NRV-AURORA-01",
    name: "Northern Lights Aurora Galaxy Projector",
    type: "USB Aurora & Water-Pattern Galaxy Projector with Bluetooth Speaker",
    color: "Matte Black (UFO dome)",
    category: "Galaxy Projectors",
    categoryId: "cat-projectors",
    shortDescription: "Dark UFO-shaped dome — model WS-AL22276, dreamy Northern-Lights water-ripple + laser stars, app + remote + Bluetooth control",
    visualIdentity:
      "Exact product: dark globe/UFO-shaped USB aurora galaxy projector (model WS-AL22276) with dreamy Northern-Lights water-pattern effect. Smooth rounded matte-black dome top half over a glossy black lower base. The top lens projects rippling ocean-wave water patterns combined with colorful aurora-borealis light and pinpoint laser stars across the ceiling and walls. Front touch panel with mode and color buttons plus a circular Bluetooth speaker grille with concentric rings. Slim remote control with numbered buttons for 10+ color combinations, timer and volume; also controllable via companion app over Bluetooth. Compact 15x11x12cm size, USB-C powered, premium matte-black finish. DO NOT redesign — exact replica of commercial product photography.",
    dimensions: "15 × 11 × 12 سم",
    accessories: ["Bluetooth remote control", "USB-C power cable", "User manual"],
    packageItems: ["Northern Lights aurora projector", "Remote control", "USB-C cable", "Instruction manual"],
    sourceUrls: {},
  },
  {
    id: "prod-rabbit",
    slug: "rabbit-carousel-night-light",
    sku: "NRV-RABBIT-01",
    name: "Rabbit Carousel Music Box Night Light",
    type: "Musical Carousel Night Light with Sound Machine",
    color: "Pink and Gold",
    category: "Night Lights",
    categoryId: "cat-nightlights",
    shortDescription: "Pink and gold carousel-shaped music box with rotating bunny figurines, built-in sound machine, USB-C rechargeable, white remote",
    visualIdentity:
      "Exact product: whimsical pink-and-gold carousel-shaped musical night light shaped like a rabbit-themed music box. Domed pastel-pink canopy roof with scalloped edge and metallic gold trim, small round gold finial knob on top. Transparent cylindrical chamber with small cute pink bunny/rabbit figurines mounted on thin gold rods that spin when powered on. Rounded pink hemispherical base with metallic gold rim and four slim ornate gold cabriole legs. Row of soft-touch control buttons on the front plus a USB-C charging port. Built-in sound machine plays soft lullaby music while the figurines rotate and project warm star patterns. Includes a small white remote control. Soft pastel-pink and metallic-gold color palette with a warm cozy glow. DO NOT redesign — exact replica of commercial product photography.",
    dimensions: "12 × 12 × 19 سم",
    accessories: ["White remote control", "USB-C charging cable", "User manual"],
    packageItems: ["Rabbit carousel night light", "Remote control", "USB-C cable", "Instruction manual"],
    sourceUrls: {},
  },
];

export function getProductProfile(slug: string): ProductProfile | undefined {
  return PRODUCT_PROFILES.find((p) => p.slug === slug);
}

export function getProductProfileById(id: string): ProductProfile | undefined {
  return PRODUCT_PROFILES.find((p) => p.id === id);
}
