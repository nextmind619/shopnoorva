export type ImageType = 
  | "Hero Image"
  | "Lifestyle Image"
  | "Bedroom Scene"
  | "Living Room Scene"
  | "Gaming Room"
  | "Luxury Home"
  | "Close-up Details"
  | "Product in Use"
  | "Before After"
  | "Premium Packaging"
  | "Dimensions"
  | "Box Contents"
  | "Infographic"
  | "Features"
  | "Mobile Banner"
  | "Desktop Banner"
  | "Trust Banner"
  | "Collection Banner"
  | "Facebook Ad"
  | "Instagram Post"
  | "TikTok Cover"
  | "Gift Scene"
  | "Night Scene"
  | "Premium White Background";

interface AIImageParams {
  productName: string;
  productDescription: string;
  type: ImageType;
  width?: number;
  height?: number;
}

export function generateAIImagePrompt(params: AIImageParams): string {
  const { productName, productDescription, type } = params;
  
  const baseStyle = "premium luxury product photography, Apple style, Dyson style, Nothing style, 8k resolution, highly detailed, photorealistic, cinematic lighting";
  
  switch (type) {
    case "Hero Image":
    case "Premium White Background":
      return `${productName}, ${productDescription}, sleek modern design, floating in center, pure white background, studio lighting, soft shadows, ${baseStyle}`;
    case "Lifestyle Image":
    case "Luxury Home":
      return `${productName} placed in an ultra-modern luxury home interior, architectural digest style, minimalist decor, natural sunlight, ${baseStyle}`;
    case "Bedroom Scene":
    case "Night Scene":
      return `${productName} in a cozy premium dark bedroom, glowing softly, ambient night lighting, relaxing atmosphere, ${baseStyle}`;
    case "Living Room Scene":
      return `${productName} on a marble coffee table in a luxury living room, modern furniture, elegant, ${baseStyle}`;
    case "Gaming Room":
      return `${productName} in a high-end neon cyberpunk gaming room setup, RGB lighting, sleek desk, dark aesthetic, ${baseStyle}`;
    case "Close-up Details":
      return `Extreme macro close-up of ${productName}, showing premium materials, glass and brushed metal textures, perfect craftsmanship, ${baseStyle}`;
    case "Product in Use":
      return `Elegant person using ${productName}, candid lifestyle shot, premium aesthetic, blurred background, ${baseStyle}`;
    case "Before After":
      return `Split screen showing a dull room vs a magical room transformed by ${productName}, dramatic difference, ${baseStyle}`;
    case "Premium Packaging":
    case "Box Contents":
      return `Luxury unboxing experience of ${productName}, premium matte black box with gold foil, neatly arranged accessories, top-down view, ${baseStyle}`;
    case "Dimensions":
    case "Infographic":
    case "Features":
      return `${productName} with sleek minimalist UI elements floating around it, technical schematic style, Apple presentation style, ${baseStyle}`;
    case "Mobile Banner":
    case "Desktop Banner":
    case "Collection Banner":
      return `Wide cinematic banner of ${productName}, dramatic lighting, dark background with subtle glowing accents, ${baseStyle}`;
    case "Trust Banner":
      return `Premium quality assurance badges and shields floating next to ${productName}, secure, trustworthy, luxury, ${baseStyle}`;
    case "Facebook Ad":
    case "Instagram Post":
    case "TikTok Cover":
      return `Eye-catching social media shot of ${productName}, vibrant colors, high contrast, trendy aesthetic, viral product style, ${baseStyle}`;
    case "Gift Scene":
      return `${productName} presented as a luxurious gift, elegant wrapping paper, silk ribbon, warm holiday lighting, ${baseStyle}`;
    default:
      return `${productName}, ${productDescription}, ${baseStyle}`;
  }
}

export function getAIImageUrl(params: AIImageParams): string {
  const prompt = generateAIImagePrompt(params);
  const width = params.width || 1080;
  const height = params.height || 1080;
  // Using Pollinations.ai for dynamic on-the-fly image generation
  // Seed is based on product name to ensure consistency across renders for the same product
  const seed = params.productName.length * 100 + params.type.length;
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=${width}&height=${height}&nologo=true&seed=${seed}`;
}

export function generateAllProductImageUrls(productName: string, productDescription: string) {
  const types: ImageType[] = [
    "Hero Image", "Lifestyle Image", "Bedroom Scene", "Living Room Scene", 
    "Gaming Room", "Luxury Home", "Close-up Details", "Product in Use", 
    "Before After", "Premium Packaging", "Dimensions", "Box Contents", 
    "Infographic", "Features", "Mobile Banner", "Desktop Banner", 
    "Trust Banner", "Collection Banner", "Facebook Ad", "Instagram Post", 
    "TikTok Cover", "Gift Scene", "Night Scene", "Premium White Background"
  ];

  const images: Record<string, string> = {};
  
  types.forEach(type => {
    let width = 1080;
    let height = 1080;
    
    // Adjust dimensions based on type
    if (type.includes("Banner") || type === "Facebook Ad") {
      width = 1200;
      height = 630;
    } else if (type === "TikTok Cover" || type === "Mobile Banner") {
      width = 1080;
      height = 1920;
    } else if (type === "Hero Image") {
      width = 1200;
      height = 1200;
    }

    images[type] = getAIImageUrl({ productName, productDescription, type, width, height });
  });

  return images;
}
