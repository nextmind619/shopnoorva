/**
 * Premium Product Image Pipeline
 * Steps 2-5: Search → Generate → Optimize → Manifest
 *
 * Usage: node scripts/generate-product-images.mjs
 *        node scripts/generate-product-images.mjs --product astronaut-bt-speaker-projector
 *        node scripts/generate-product-images.mjs --force
 */

import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const PUBLIC = path.join(ROOT, "public");

const PREMIUM_IMAGE_TYPES = [
  "01-hero-white-bg", "02-premium-hero", "03-lifestyle", "04-bedroom",
  "05-living-room", "06-gaming-room", "07-romantic-room", "08-kids-room",
  "09-close-up", "10-features", "11-package-contents", "12-dimensions",
  "13-before-after", "14-product-in-use", "15-banner", "16-packaging",
  "17-infographic", "18-mobile-banner", "19-desktop-banner", "20-social-media-banner",
];

const IMAGE_TYPE_CONFIGS = {
  "01-hero-white-bg": { folder: "products", width: 2000, height: 2000 },
  "02-premium-hero": { folder: "products", width: 2000, height: 2000 },
  "03-lifestyle": { folder: "lifestyle", width: 2000, height: 2000 },
  "04-bedroom": { folder: "lifestyle", width: 2000, height: 2000 },
  "05-living-room": { folder: "lifestyle", width: 2000, height: 2000 },
  "06-gaming-room": { folder: "lifestyle", width: 2000, height: 2000 },
  "07-romantic-room": { folder: "lifestyle", width: 2000, height: 2000 },
  "08-kids-room": { folder: "lifestyle", width: 2000, height: 2000 },
  "09-close-up": { folder: "products", width: 2000, height: 2000 },
  "10-features": { folder: "generated", width: 2000, height: 2000 },
  "11-package-contents": { folder: "products", width: 2000, height: 2000 },
  "12-dimensions": { folder: "specifications", width: 2000, height: 2000 },
  "13-before-after": { folder: "generated", width: 2000, height: 2000 },
  "14-product-in-use": { folder: "lifestyle", width: 2000, height: 2000 },
  "15-banner": { folder: "banners", width: 2000, height: 800 },
  "16-packaging": { folder: "products", width: 2000, height: 2000 },
  "17-infographic": { folder: "generated", width: 2000, height: 2000 },
  "18-mobile-banner": { folder: "banners", width: 1080, height: 1920 },
  "19-desktop-banner": { folder: "banners", width: 2560, height: 800 },
  "20-social-media-banner": { folder: "banners", width: 1200, height: 1200 },
};

const PRODUCT_PROFILES = [
  {
    id: "prod-mx003", slug: "astronaut-bt-speaker-projector", sku: "NRV-MX003-01",
    name: "Astronaut Bluetooth Speaker Galaxy Projector",
    visualIdentity: "White chibi astronaut-shaped galaxy projector with built-in Bluetooth 5.0 speaker (model MXS003). Rounded white helmet, large dark glossy visor projecting colorful nebula light. Circular perforated speaker grille on chest. Black IR remote. TF card + AUX playback, built-in mic. Compact standing pose, 16x10x10cm. DO NOT redesign.",
    customPrompts: {
      "02-premium-hero": "Premium e-commerce marketing composite: white astronaut Bluetooth galaxy projector in center, helmet emitting colorful nebula light rays, chest speaker grille, black remote control in foreground, dark bedroom background with vivid blue purple nebula on walls and ceiling, professional product advertisement layout, 8K photorealistic, no watermark, no text",
      "01-hero-white-bg": "White astronaut galaxy projector with Bluetooth speaker on pure white background, helmet visor, chest speaker grille visible, black remote beside it, studio product photography, 8K, no watermark",
      "09-close-up": "Close-up of white astronaut projector chest speaker grille and black remote control, macro product photography, 8K",
      "10-features": "Infographic layout: white astronaut Bluetooth galaxy projector center, icons for Bluetooth speaker, nebula modes, remote control, USB-C power, Apple-style feature callout, 8K",
      "14-product-in-use": "Dark cozy bedroom at night, white astronaut projector on nightstand projecting vivid blue purple nebula galaxy on ceiling and walls, cinematic atmosphere, 8K photorealistic",
    },
    sourceUrls: {},
  },
  {
    id: "prod-starbt", slug: "bluetooth-star-projector", sku: "NRV-STARBT-01",
    name: "Multi-Color Galaxy Star Projector Night Light with Speaker & Remote",
    visualIdentity: "Use the uploaded reference as strict visual identity. Exact matte black Cosmic Voyager bowl galaxy projector with faceted transparent crystal dome, USB/TF/DC 5V ports, OFF-ON, slim black remote with red LED/LASER buttons and 1H/2H timer. Up to 21 light modes, Bluetooth speaker. NEVER aluminium cylinder, astronaut, or rabbit lamp.",
    sourceUrls: {},
  },
  {
    id: "prod-aurora", slug: "northern-lights-galaxy-projector", sku: "NRV-AURORA-01",
    name: "White Geometric Dream Aurora Star Projector with Bluetooth",
    visualIdentity: "Use uploaded reference as strict identity. Exact matte white faceted geometric low-poly Dream Aurora projector, clear crystal dome + side apertures, four grey front buttons, white remote with red power and 1H/2H. Aurora + stars + crescent moon. Bluetooth speaker. NEVER black UFO dome, astronaut, or rabbit lamp.",
    sourceUrls: {},
  },
  {
    id: "prod-rabbit", slug: "rabbit-carousel-night-light", sku: "NRV-RABBIT-01",
    name: "Rabbit Carousel Music Box Night Light",
    visualIdentity: "Exact product: pink gold carousel-shaped musical night light, rabbit-themed music box. Domed pastel pink canopy gold trim, transparent cylinder with pink bunny figurines spinning on gold rods, pink hemispherical base gold rim, 4 cabriole gold legs, built-in sound machine plays lullaby music, white remote. DO NOT redesign.",
    sourceUrls: {},
  },
];

const BASE_QUALITY = "commercial product photography, 8K, photorealistic, sharp, no watermark, no text, exact product replica";

function buildPrompt(profile, imageType, config) {
  if (profile.customPrompts?.[imageType]) {
    return profile.customPrompts[imageType];
  }
  const scenes = {
    "01-hero-white-bg": `${profile.name} on pure white background, studio lighting. ${profile.visualIdentity}. ${BASE_QUALITY}`,
    "02-premium-hero": `${profile.name} premium hero, dramatic studio lighting. ${profile.visualIdentity}. ${BASE_QUALITY}`,
    "03-lifestyle": `${profile.name} in luxury modern home interior. ${profile.visualIdentity}. ${BASE_QUALITY}`,
    "04-bedroom": `${profile.name} in cozy dark bedroom, galaxy glow on ceiling. ${profile.visualIdentity}. ${BASE_QUALITY}`,
    "05-living-room": `${profile.name} in luxury living room, galaxy on ceiling. ${profile.visualIdentity}. ${BASE_QUALITY}`,
    "06-gaming-room": `${profile.name} in neon RGB gaming room. ${profile.visualIdentity}. ${BASE_QUALITY}`,
    "07-romantic-room": `${profile.name} in romantic bedroom, soft stars. ${profile.visualIdentity}. ${BASE_QUALITY}`,
    "08-kids-room": `${profile.name} in colorful kids bedroom. ${profile.visualIdentity}. ${BASE_QUALITY}`,
    "09-close-up": `Macro close-up ${profile.name}, buttons textures ports. ${profile.visualIdentity}. ${BASE_QUALITY}`,
    "10-features": `${profile.name} feature infographic Apple style. ${profile.visualIdentity}. ${BASE_QUALITY}`,
    "11-package-contents": `Flat lay unboxing ${profile.name} with remote cable manual. ${profile.visualIdentity}. ${BASE_QUALITY}`,
    "12-dimensions": `${profile.name} with dimension lines technical diagram white bg. ${profile.visualIdentity}. ${BASE_QUALITY}`,
    "13-before-after": `Split: dull room vs room with ${profile.name} galaxy projection. ${profile.visualIdentity}. ${BASE_QUALITY}`,
    "14-product-in-use": `${profile.name} projecting stars galaxy on ceiling walls. ${profile.visualIdentity}. ${BASE_QUALITY}`,
    "15-banner": `Wide banner ${profile.name} dark luxury background. ${profile.visualIdentity}. ${BASE_QUALITY}`,
    "16-packaging": `${profile.name} retail box packaging. ${profile.visualIdentity}. ${BASE_QUALITY}`,
    "17-infographic": `${profile.name} infographic features icons. ${profile.visualIdentity}. ${BASE_QUALITY}`,
    "18-mobile-banner": `Vertical mobile banner ${profile.name} 9:16. ${profile.visualIdentity}. ${BASE_QUALITY}`,
    "19-desktop-banner": `Ultra-wide desktop banner ${profile.name}. ${profile.visualIdentity}. ${BASE_QUALITY}`,
    "20-social-media-banner": `Square social media ${profile.name} vibrant. ${profile.visualIdentity}. ${BASE_QUALITY}`,
  };
  return scenes[imageType];
}

function pollinationsUrl(prompt, width, height, seed) {
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=${width}&height=${height}&nologo=true&seed=${seed}&model=flux`;
}

async function downloadImage(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": "NOORVA-ImagePipeline/1.0" },
        signal: AbortSignal.timeout(120000),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.length < 5000) throw new Error("Image too small");
      const meta = await sharp(buf).metadata();
      if ((meta.width || 0) < 400) throw new Error("Image too narrow");
      return buf;
    } catch (e) {
      if (i === retries - 1) throw e;
      await new Promise((r) => setTimeout(r, 2000 * (i + 1)));
    }
  }
}

async function optimizeImage(inputBuffer, outDir, baseName) {
  const originalPath = path.join(outDir, `${baseName}.jpg`);
  const webpPath = path.join(outDir, `${baseName}.webp`);
  const avifPath = path.join(outDir, `${baseName}.avif`);
  const thumbPath = path.join(outDir, "thumbs", `${baseName}-400.webp`);
  const smPath = path.join(outDir, "responsive", `${baseName}-640.webp`);
  const mdPath = path.join(outDir, "responsive", `${baseName}-1280.webp`);
  const lgPath = path.join(outDir, "responsive", `${baseName}-2000.webp`);

  await fs.mkdir(path.join(outDir, "thumbs"), { recursive: true });
  await fs.mkdir(path.join(outDir, "responsive"), { recursive: true });

  const pipeline = sharp(inputBuffer).rotate();

  // Original JPEG (high quality)
  await pipeline.clone().jpeg({ quality: 92, mozjpeg: true }).toFile(originalPath);

  // WebP
  await sharp(inputBuffer).rotate().webp({ quality: 88, effort: 4 }).toFile(webpPath);

  // AVIF
  await sharp(inputBuffer).rotate().avif({ quality: 80, effort: 4 }).toFile(avifPath);

  // Thumbnail 400px
  await sharp(inputBuffer).rotate().resize(400, 400, { fit: "inside", withoutEnlargement: true })
    .webp({ quality: 82 }).toFile(thumbPath);

  // Responsive sizes
  for (const [size, p] of [[640, smPath], [1280, mdPath], [2000, lgPath]]) {
    await sharp(inputBuffer).rotate().resize(size, size, { fit: "inside", withoutEnlargement: false })
      .webp({ quality: 85 }).toFile(p);
  }

  const rel = (p) => "/" + path.relative(PUBLIC, p).replace(/\\/g, "/");

  return {
    original: rel(originalPath),
    webp: rel(webpPath),
    avif: rel(avifPath),
    thumbnail: rel(thumbPath),
    responsive: { sm: rel(smPath), md: rel(mdPath), lg: rel(lgPath) },
  };
}

async function processProduct(profile, options) {
  console.log(`\n📦 Processing: ${profile.name} (${profile.slug})`);
  const productManifest = {
    slug: profile.slug,
    sku: profile.sku,
    name: profile.name,
    images: {},
    prompts: {},
    sources: {},
  };

  for (const imageType of PREMIUM_IMAGE_TYPES) {
    const config = IMAGE_TYPE_CONFIGS[imageType];
    const outDir = path.join(PUBLIC, config.folder, profile.slug);
    const baseName = imageType;
    const webpPath = path.join(outDir, `${baseName}.webp`);

    if (!options.force) {
      try {
        await fs.access(webpPath);
        console.log(`  ✓ ${imageType} (cached)`);
        const rel = (p) => "/" + path.relative(PUBLIC, p).replace(/\\/g, "/");
        productManifest.images[imageType] = {
          original: rel(path.join(outDir, `${baseName}.jpg`)),
          webp: rel(webpPath),
          avif: rel(path.join(outDir, `${baseName}.avif`)),
          thumbnail: rel(path.join(outDir, "thumbs", `${baseName}-400.webp`)),
          responsive: {
            sm: rel(path.join(outDir, "responsive", `${baseName}-640.webp`)),
            md: rel(path.join(outDir, "responsive", `${baseName}-1280.webp`)),
            lg: rel(path.join(outDir, "responsive", `${baseName}-2000.webp`)),
          },
        };
        continue;
      } catch { /* generate */ }
    }

    await fs.mkdir(outDir, { recursive: true });

    const prompt = buildPrompt(profile, imageType, config);
    productManifest.prompts[imageType] = {
      pollinations: prompt,
      "gpt-image": `[GPT Image] ${prompt}`,
      gemini: `[Gemini Image] ${prompt}`,
      flux: `[FLUX] ${prompt}`,
      ideogram: `[Ideogram] ${prompt}`,
      midjourney: `[Midjourney] ${prompt} --style raw --v 6.1`,
    };

    let buffer;
    let source = "ai-generated";
    const sourceUrl = profile.sourceUrls[imageType];

    if (sourceUrl) {
      try {
        console.log(`  ↓ ${imageType} downloading commercial source...`);
        buffer = await downloadImage(sourceUrl);
        source = "commercial";
      } catch (e) {
        console.log(`  ⚠ ${imageType} source failed (${e.message}), generating AI...`);
      }
    }

    if (!buffer) {
      const seed = profile.slug.length * 1000 + imageType.length * 17;
      const url = pollinationsUrl(prompt, config.width, config.height, seed);
      console.log(`  🤖 ${imageType} generating AI (${config.width}×${config.height})...`);
      try {
        buffer = await downloadImage(url);
      } catch (e) {
        console.log(`  ✗ ${imageType} AI failed: ${e.message}`);
        continue;
      }
    }

    try {
      const optimized = await optimizeImage(buffer, outDir, baseName);
      productManifest.images[imageType] = optimized;
      productManifest.sources[imageType] = source;
      console.log(`  ✓ ${imageType} done (${source})`);
    } catch (e) {
      console.log(`  ✗ ${imageType} optimize failed: ${e.message}`);
    }

    // Rate limit
    await new Promise((r) => setTimeout(r, 1500));
  }

  return productManifest;
}

async function main() {
  const args = process.argv.slice(2);
  const force = args.includes("--force");
  const productArg = args.find((a) => a.startsWith("--product="))?.split("=")[1]
    || (args.indexOf("--product") >= 0 ? args[args.indexOf("--product") + 1] : null);

  let profiles = PRODUCT_PROFILES;
  if (productArg) {
    profiles = profiles.filter((p) => p.slug === productArg);
    if (!profiles.length) {
      console.error(`Product not found: ${productArg}`);
      process.exit(1);
    }
  }

  console.log("🚀 NOORVA Premium Product Image Pipeline");
  console.log(`   Products: ${profiles.length} | Force: ${force}`);

  const manifestPath = path.join(ROOT, "src/lib/product-images/manifest.json");
  let manifest = { generatedAt: new Date().toISOString(), products: {} };
  try {
    const existing = JSON.parse(await fs.readFile(manifestPath, "utf-8"));
    manifest.products = existing.products || {};
  } catch { /* fresh manifest */ }

  for (const profile of profiles) {
    manifest.products[profile.slug] = await processProduct(profile, { force });
  }
  manifest.generatedAt = new Date().toISOString();

  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));
  console.log(`\n✅ Manifest written: ${manifestPath}`);

  const analysisPath = path.join(ROOT, "src/lib/product-images/analysis.json");
  const analysis = Object.values(manifest.products).map((p) => ({
    productName: p.name,
    sku: p.sku,
    slug: p.slug,
    imageCount: Object.keys(p.images).length,
    sources: p.sources,
  }));
  await fs.writeFile(analysisPath, JSON.stringify(analysis, null, 2));
  console.log(`✅ Analysis written: ${analysisPath}`);
}

main().catch((e) => {
  console.error("Pipeline failed:", e);
  process.exit(1);
});
