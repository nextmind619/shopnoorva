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
    id: "prod-astronaut",
    slug: "astronaut-galaxy-projector",
    sku: "NRV-ASTRO-01",
    name: "Astronaut Galaxy Projector",
    type: "Galaxy Projector + Bluetooth Speaker (2-in-1)",
    color: "White (black visor, black remote)",
    category: "Galaxy Projectors",
    categoryId: "cat-projectors",
    shortDescription: "White standing robot-style astronaut — glossy black dome visor with HD lens, round helmet speaker-ears, chest Bluetooth speaker, 8 white noises, 9 nebula effects, 360° head on adjustable arm + fixed base",
    visualIdentity:
      "EXACT real product — white standing robot-style astronaut galaxy star projector. Large glossy black dome-shaped visor/helmet face with a centered HD projection lens and small green LED indicator light on top. Two small round perforated speaker-cup 'ears' on the upper sides of the helmet (grille dot pattern, not pointy bear ears). Thin silver braided mesh strap/handle draping over one shoulder from the helmet. White rounded torso with a large circular perforated speaker grille on the chest. Articulated/jointed neck-arm allowing the head to tilt and swivel 360°, mounted on a wide four-point fixed white stable base with a quick-release magnetic head mount. Back panel has labeled buttons ON/OFF, Model, Light, Music/Sound and a USB-C port. Black slim remote control with numeric buttons, mode/nebula selector grid, brightness and rotation-speed controls. Retail box printed 'ASTRONAUT STAR LIGHT / GALAXY PROJECTOR NIGHT LIGHT' with astronaut+remote line art. 8 built-in soothing white-noise sounds (running water, lullabies, campfires, ocean waves, summer night sounds, forest birds, twinkling stars, creek rain). 9 combinable nebula/galaxy light effects with 4 rotation-speed levels and brightness adjustable 5%-100%. Matte white ABS plastic, glossy black visor. Dimensions ~23cm height x 12cm base. Standing pose, NOT sitting, NOT holding a star or moon, NOT bear-ear helmet. DO NOT redesign — exact replica.",
    dimensions: "23 × 12 × 12 سم",
    accessories: ["Black IR remote control", "USB cable", "User manual"],
    packageItems: ["Astronaut galaxy projector with Bluetooth speaker", "Remote control", "USB power cable", "Instruction manual"],
    sourceUrls: {
      "01-hero-white-bg": "https://m.media-amazon.com/images/I/51Hg5RV9KbL._AC_SL1500_.jpg",
      "02-premium-hero": "https://m.media-amazon.com/images/I/51Vb5sj947L._AC_SL1500_.jpg",
      "03-lifestyle": "https://m.media-amazon.com/images/I/41HQNM-aTgL._AC_SL1500_.jpg",
      "04-bedroom": "https://m.media-amazon.com/images/I/51Vb5sj947L._AC_SL1500_.jpg",
      "08-kids-room": "https://m.media-amazon.com/images/I/51Vb5sj947L._AC_SL1500_.jpg",
      "09-close-up": "https://m.media-amazon.com/images/I/51K2iLRpiBL._AC_SL1500_.jpg",
      "10-features": "https://m.media-amazon.com/images/I/51Hg5RV9KbL._AC_SL1500_.jpg",
      "11-package-contents": "https://m.media-amazon.com/images/I/510-S99FFbL._AC_SL1500_.jpg",
      "14-product-in-use": "https://m.media-amazon.com/images/I/41HQNM-aTgL._AC_SL1500_.jpg",
      "16-packaging": "https://m.media-amazon.com/images/I/51K2iLRpiBL._AC_SL1500_.jpg",
      "17-infographic": "https://m.media-amazon.com/images/I/510-S99FFbL._AC_SL1500_.jpg",
    },
  },
  {
    id: "prod-crystal",
    slug: "crystal-galaxy-projector",
    sku: "NRV-CRYSTAL-01",
    name: "Crystal Galaxy Projector",
    type: "Galaxy Star Projector with Bluetooth Speaker",
    color: "Black (matte base, faceted translucent dome)",
    category: "Galaxy Projectors",
    categoryId: "cat-projectors",
    shortDescription: "Black bowl-shaped base with faceted crystal disco-ball dome, front USB/DC ports, MODE/VOL/LED buttons, black IR remote with 20 buttons",
    visualIdentity:
      "Exact product: black matte circular bowl-shaped galaxy projector base tapering slightly downward. Clear/white translucent faceted triangular dome (disco ball style) on top glowing blue and purple. Front flat panel with USB port, DC 5V jack, On/Off switch, MODE VOL+ VOL- LED buttons. Black slim rectangular remote with red power button and ~20 control buttons for light modes, volume, timer. Projects purple-blue nebula with laser star points. ABS plastic black base, clear faceted plastic dome. Ø15×12cm. Bluetooth 5.0 speaker. DO NOT redesign — exact replica.",
    dimensions: "Ø 15 × 12 cm",
    accessories: ["Black IR remote", "USB cable", "User manual"],
    packageItems: ["Crystal projector", "Remote control", "USB cable", "Instruction manual"],
    sourceUrls: {
      "01-hero-white-bg": "https://m.media-amazon.com/images/I/61YvJhKqJBL._AC_SL1500_.jpg",
      "02-premium-hero": "https://m.media-amazon.com/images/I/71qKqJhKqJL._AC_SL1500_.jpg",
    },
  },
  {
    id: "prod-star",
    slug: "galaxy-star-projector",
    sku: "NRV-STAR-01",
    name: "Galaxy Star Projector",
    type: "Aurora Galaxy Star Projector (Style 2-White)",
    color: "White",
    category: "Galaxy Projectors",
    categoryId: "cat-projectors",
    shortDescription: "White geometric diamond/angular body, large iridescent spherical lens glowing purple-green-blue, smaller secondary aperture, white remote, Type-C cable",
    visualIdentity:
      "Exact product: Style 2-White galaxy aurora star projector. Modern multi-faceted geometric angular white plastic body. Large iridescent spherical projection lens on top glowing purple, green, blue aurora light. Smaller secondary circular aperture beside main lens. Slim white remote with numerous color/pattern buttons. White Type-C USB cable. Dimensions 16×9×10.5 cm (H 10.5cm, W 9cm, L 16cm). Retail box with dark design and green-blue aurora graphics. DO NOT redesign — exact replica of Style 2-White model.",
    dimensions: "16×9×10.5 cm",
    accessories: ["White remote control", "Type-C USB cable", "User manual", "Retail box"],
    packageItems: ["Galaxy Star projector", "Remote control", "Type-C cable", "User manual"],
    sourceUrls: {},
  },
  {
    id: "prod-carousel",
    slug: "carousel-night-light",
    sku: "NRV-CAROUSEL-01",
    name: "Carousel Night Light",
    type: "Musical Carousel Night Light Projector",
    color: "Pink and Gold",
    category: "Night Lights",
    categoryId: "cat-nightlights",
    shortDescription: "Pink and gold carousel-shaped night light with transparent cylinder, pink bunny figurines on gold rods, 4-5 front buttons, white 16-button remote, USB cable",
    visualIdentity:
      "Exact product: whimsical carousel-shaped musical night light projector. Domed light pink roof canopy with scalloped edge and metallic gold trim, small round gold finial knob on top. Transparent cylindrical chamber with small stylized pink bunny figurines mounted on thin vertical gold rods inside. Rounded hemispherical pink base with metallic gold rim. Row of 4-5 circular control buttons on front plus USB charging port. Four ornate curved cabriole style legs in metallic gold. White rectangular remote with black buttons. White USB-A charging cable. Soft pastel pink and metallic gold colors. Projects star patterns. DO NOT redesign — exact replica.",
    accessories: ["White 16-button remote", "USB charging cable"],
    packageItems: ["Carousel night light", "Remote control", "USB cable", "User manual"],
    sourceUrls: {},
  },
];

export function getProductProfile(slug: string): ProductProfile | undefined {
  return PRODUCT_PROFILES.find((p) => p.slug === slug);
}

export function getProductProfileById(id: string): ProductProfile | undefined {
  return PRODUCT_PROFILES.find((p) => p.id === id);
}
