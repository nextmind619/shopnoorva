import type { PremiumImageType } from "./types";
import type { ProductProfile } from "./profiles";

const BASE_QUALITY =
  "commercial product photography, 8K resolution, photorealistic, sharp focus, no watermark, no text overlay, no blur, studio quality, exact product replica";

type AIProvider = "gpt-image" | "gemini" | "flux" | "ideogram" | "midjourney" | "pollinations";

export function generatePromptForProvider(
  profile: ProductProfile,
  imageType: PremiumImageType,
  provider: AIProvider = "pollinations"
): string {
  const product = profile.visualIdentity;
  const name = profile.name;
  const dims = profile.dimensions ? ` Dimensions: ${profile.dimensions}.` : "";
  const accessories = profile.accessories.join(", ");

  const scenePrompts: Record<PremiumImageType, string> = {
    "01-hero-white-bg": `${name} on pure white background, centered, studio lighting, soft shadow, all accessories visible: ${accessories}. ${product}. ${BASE_QUALITY}`,
    "02-premium-hero": `${name} premium hero shot, dramatic studio lighting, floating composition, luxury e-commerce style. ${product}. ${BASE_QUALITY}`,
    "03-lifestyle": `${name} in ultra-modern luxury home interior, architectural digest style, natural light. ${product}. ${BASE_QUALITY}`,
    "04-bedroom": `${name} on nightstand in cozy premium dark bedroom, soft galaxy glow on ceiling, relaxing atmosphere. ${product}. ${BASE_QUALITY}`,
    "05-living-room": `${name} on marble coffee table in luxury living room, evening ambiance, galaxy projection on ceiling. ${product}. ${BASE_QUALITY}`,
    "06-gaming-room": `${name} on gaming desk in neon RGB gaming room, cyberpunk aesthetic, galaxy stars on walls. ${product}. ${BASE_QUALITY}`,
    "07-romantic-room": `${name} in intimate romantic bedroom, warm ambient lighting, soft galaxy stars, candles. ${product}. ${BASE_QUALITY}`,
    "08-kids-room": `${name} in colorful kids bedroom, soft warm lighting, playful decor. ${product}. ${BASE_QUALITY}`,
    "09-close-up": `Extreme close-up macro of ${name}, showing exact buttons, materials, textures, ports. ${product}. ${BASE_QUALITY}`,
    "10-features": `${name} with minimalist feature callout layout, Apple-style presentation, showing: ${profile.packageItems.join(", ")}. ${product}. ${BASE_QUALITY}`,
    "11-package-contents": `Flat lay unboxing: ${profile.packageItems.join(", ")} neatly arranged around ${name}. Top-down view. ${product}. ${BASE_QUALITY}`,
    "12-dimensions": `${name} with dimension lines and measurements${dims}, technical product diagram style on white background. ${product}. ${BASE_QUALITY}`,
    "13-before-after": `Split image: left dull dark boring room, right same room transformed with ${name} galaxy projection on ceiling, dramatic contrast. ${product}. ${BASE_QUALITY}`,
    "14-product-in-use": `${name} actively projecting stars and galaxy onto bedroom ceiling and walls, wide angle room shot. ${product}. ${BASE_QUALITY}`,
    "15-banner": `Wide cinematic banner featuring ${name}, dark gradient background, dramatic lighting, NOORVA brand aesthetic. ${product}. ${BASE_QUALITY}`,
    "16-packaging": `${name} retail packaging box and product, premium unboxing presentation. ${product}. ${BASE_QUALITY}`,
    "17-infographic": `${name} infographic style, icons for features: ${profile.accessories.join(", ")}, clean modern layout. ${product}. ${BASE_QUALITY}`,
    "18-mobile-banner": `Vertical mobile banner ${name}, portrait 9:16, dramatic product hero, dark luxury background. ${product}. ${BASE_QUALITY}`,
    "19-desktop-banner": `Ultra-wide desktop banner ${name}, cinematic hero product shot, dark luxury background. ${product}. ${BASE_QUALITY}`,
    "20-social-media-banner": `Square social media ad ${name}, vibrant high contrast, viral product aesthetic, Instagram-ready. ${product}. ${BASE_QUALITY}`,
  };

  const base = scenePrompts[imageType];

  switch (provider) {
    case "gpt-image":
      return `[GPT Image] ${base} Style: photorealistic commercial product photo. Negative: watermark, text, logo, blur, redesign, different product.`;
    case "gemini":
      return `[Gemini Image] Generate a photorealistic commercial product photograph. ${base} Avoid: watermarks, text overlays, product redesign.`;
    case "flux":
      return `[FLUX] ${base}, flux photorealism, product photography, sdxl quality --neg watermark text blur redesign`;
    case "ideogram":
      return `[Ideogram] ${base} Typography: none. Photorealistic product photography only.`;
    case "midjourney":
      return `[Midjourney] ${base} --ar ${imageType.includes("banner") ? "16:9" : "1:1"} --style raw --v 6.1`;
    default:
      return base;
  }
}

export function generateAllProviderPrompts(
  profile: ProductProfile,
  imageType: PremiumImageType
): Record<AIProvider, string> {
  const providers: AIProvider[] = ["gpt-image", "gemini", "flux", "ideogram", "midjourney", "pollinations"];
  return Object.fromEntries(
    providers.map((p) => [p, generatePromptForProvider(profile, imageType, p)])
  ) as Record<AIProvider, string>;
}

export function getPollinationsUrl(
  profile: ProductProfile,
  imageType: PremiumImageType,
  width: number,
  height: number
): string {
  const prompt = generatePromptForProvider(profile, imageType, "pollinations");
  const seed = profile.slug.length * 1000 + imageType.length * 17;
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=${width}&height=${height}&nologo=true&seed=${seed}&model=flux`;
}
