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
    shortDescription: "White astronaut galaxy projector with built-in Bluetooth 5.0 speaker, chest speaker grille, 10 nebula light modes, black IR remote, iPhone Bluetooth pairing, 360° adjustable magnetic head",
    visualIdentity:
      "Exact product: white cute chubby astronaut galaxy projector with Bluetooth speaker. Helmet projects multicolor nebula light rays (blue purple pink). Large circular perforated speaker grille on chest center with musical notes. Black slim IR remote control in foreground. iPhone smartphone showing music player app paired via Bluetooth. Dark bedroom background with vivid blue purple nebula projected on walls and ceiling. 10 circular color mode icons showing nebula combinations (red green blue purple orange with crescent moon). Matte white ABS plastic body, glossy dark tinted visor lens. 360° adjustable magnetic astronaut head. USB 5V powered. DO NOT redesign — exact replica of Bluetooth astronaut galaxy projector.",
    dimensions: "12×11×23 cm",
    accessories: ["Black IR remote control", "USB cable", "User manual"],
    packageItems: ["Astronaut projector with Bluetooth speaker", "Remote control", "USB power cable", "Instruction manual"],
    sourceUrls: {
      "01-hero-white-bg": "https://m.media-amazon.com/images/I/71rBbFOVaEL._AC_SL1500_.jpg",
      "02-premium-hero": "https://aryanca.com/cdn/shop/files/HR_Astro_Action_8757581b-4422-48f5-b370-bfb2663ea108.webp?v=1710958720&width=1946",
      "09-close-up": "https://aryanca.com/cdn/shop/files/81gRORu5X7L._AC_SX679.jpg?v=1710958720&width=1946",
      "10-features": "https://aryanca.com/cdn/shop/files/HR_Astro_Options_dd932ae5-d4f5-4ad8-9939-7794423df691.jpg?v=1710958720&width=1946",
      "11-package-contents": "https://aryanca.com/cdn/shop/files/HR_Astro_BS_4122fe55-863e-4fb4-a20e-8c89922d4209.jpg?v=1710958860&width=1946",
      "14-product-in-use": "https://aryanca.com/cdn/shop/files/HR_Astro_BG_3aa0e288-fac6-49ca-84a5-fd1ebfc4dbff.jpg?v=1710958720&width=1946",
      "17-infographic": "https://aryanca.com/cdn/shop/files/HR_Astro_Options_dd932ae5-d4f5-4ad8-9939-7794423df691.jpg?v=1710958720&width=1946",
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
