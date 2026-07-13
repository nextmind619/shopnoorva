/**
 * Import MAKTUL Astronaut Galaxy Projector (B0D8JQNKVP / MKTASTRONAUTA) images.
 * Standing white astronaut, chest Bluetooth speaker, braided cable, lunar base.
 */
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const PUBLIC = path.join(ROOT, "public");
const SLUG = "astronaut-galaxy-projector";
const AMAZON = (id) =>
  `https://m.media-amazon.com/images/I/${encodeURIComponent(id)}._AC_SL1500_.jpg`;

const VISUAL =
  "EXACT MAKTUL MKTASTRONAUTA white standing astronaut galaxy projector Bluetooth speaker. Chibi white spacesuit with horizontal ribbed segmented arms and legs. Large spherical helmet with dark glossy black visor and projection lens inside. Small red-rimmed sensor on helmet forehead. Small rectangular side module with green LED on helmet. Large circular chest speaker grille with concentric holes and star pattern center. Grey braided cable from helmet to white rectangular backpack. Square white lunar landing platform base with raised notched edge blocks. Black slim vertical remote red power button R G B W S+ S- mode buttons. 360 magnetic rotating head. USB powered. Matte white ABS plastic. DO NOT redesign. NOT sitting pose. NOT holding star. NOT bear ears.";

const REAL_SOURCES = {
  "01-hero-white-bg": [AMAZON("416l9BGn6uL"), AMAZON("61faGRLah3L")],
  "02-premium-hero": [AMAZON("61faGRLah3L"), AMAZON("71PeLNrt6dL")],
  "03-lifestyle": [AMAZON("51KPG-WwiLL"), AMAZON("71+NgcPTK9L")],
  "04-bedroom": [AMAZON("61DhnH8r-yL"), AMAZON("51KPG-WwiLL")],
  "05-living-room": [AMAZON("51KPG-WwiLL")],
  "06-gaming-room": [AMAZON("51KPG-WwiLL"), AMAZON("71+NgcPTK9L")],
  "07-romantic-room": [AMAZON("61DhnH8r-yL")],
  "08-kids-room": [AMAZON("51KPG-WwiLL"), AMAZON("71+NgcPTK9L")],
  "09-close-up": [AMAZON("71icsbrywBL"), AMAZON("416l9BGn6uL")],
  "10-features": [AMAZON("61ypnZIj6hL"), AMAZON("51rpNoYsiQL")],
  "11-package-contents": [AMAZON("416l9BGn6uL")],
  "12-dimensions": [AMAZON("61faGRLah3L")],
  "13-before-after": [AMAZON("61DhnH8r-yL")],
  "14-product-in-use": [AMAZON("61faGRLah3L"), AMAZON("61DhnH8r-yL")],
  "15-banner": [AMAZON("71PeLNrt6dL"), AMAZON("51JprJ589QL")],
  "16-packaging": [AMAZON("416l9BGn6uL")],
  "17-infographic": [AMAZON("71icsbrywBL"), AMAZON("51JstmLGBSL")],
  "18-mobile-banner": [AMAZON("71PeLNrt6dL"), AMAZON("61faGRLah3L")],
  "19-desktop-banner": [AMAZON("51KPG-WwiLL"), AMAZON("61faGRLah3L")],
  "20-social-media-banner": [AMAZON("51JprJ589QL"), AMAZON("71PeLNrt6dL")],
};

const AI_PROMPTS = {
  "01-hero-white-bg": `${VISUAL} Pure white studio background product photo 45 degree angle, black remote beside, photorealistic e-commerce 8K no text`,
  "02-premium-hero": `${VISUAL} Marketing hero: astronaut left projecting blue purple nebula, chest speaker with musical notes, black remote and smartphone with music app, bedroom background, 8 circular nebula mode icons with crescent moon right side, 8K no watermark`,
  "03-lifestyle": `${VISUAL} On wooden nightstand dark cozy bedroom projecting vivid blue purple nebula on ceiling, black remote nearby, cinematic 8K`,
  "04-bedroom": `${VISUAL} Dark bedroom on nightstand projecting galaxy stars nebula on ceiling and walls, cinematic mood 8K`,
  "05-living-room": `${VISUAL} Modern living room shelf projecting soft galaxy ambiance purple blue stars on ceiling 8K`,
  "06-gaming-room": `${VISUAL} Gaming desk setup purple neon ambient light astronaut projector projecting galaxy on wall monitor glow 8K`,
  "07-romantic-room": `${VISUAL} Romantic bedroom soft pink purple galaxy projection candles cozy atmosphere 8K`,
  "08-kids-room": `${VISUAL} Kids bedroom child watching colorful galaxy on ceiling astronaut projector on dresser 8K`,
  "09-close-up": `${VISUAL} Macro close-up front chest speaker grille helmet visor green LED module black remote USB cable detail 8K`,
  "10-features": `${VISUAL} Infographic 8 MODOS DE ILUMINACIÓN stars galaxy nebula adjustable intensity circular insets back control buttons 8K`,
  "11-package-contents": `${VISUAL} Flat lay what's in the box: astronaut projector black remote USB cable user manual white packaging 8K`,
  "12-dimensions": `${VISUAL} Product with dimension lines 23.5cm height 12cm width 12cm depth square lunar base side and front view 8K`,
  "13-before-after": `Split before after bedroom plain lamp vs same room with ${VISUAL} projecting vivid galaxy on ceiling dramatic transformation 8K`,
  "14-product-in-use": `${VISUAL} On dark wood surface black remote beside projecting vivid blue purple nebula galaxy on wall behind photorealistic 8K`,
  "15-banner": `${VISUAL} Wide ecommerce banner nebula background chest speaker Bluetooth remote dramatic lighting 2000x800 8K`,
  "16-packaging": `${VISUAL} Retail product box packaging white astronaut galaxy projector Bluetooth speaker premium box 8K`,
  "17-infographic": `${VISUAL} Infographic FUNCIONES ESPECIALES USB Type-C back buttons ON OFF Model Light Music remote control icons 8K`,
  "18-mobile-banner": `${VISUAL} Vertical mobile ad TikTok style galaxy bedroom astronaut projector Bluetooth 1080x1920 8K`,
  "19-desktop-banner": `${VISUAL} Wide desktop hero banner astronaut projector galaxy nebula 2560x800 cinematic 8K`,
  "20-social-media-banner": `${VISUAL} Square Instagram Facebook ad astronaut galaxy Bluetooth speaker remote vibrant nebula 1200x1200 8K`,
};

const IMAGE_FOLDERS = {
  "01-hero-white-bg": "products",
  "02-premium-hero": "products",
  "03-lifestyle": "lifestyle",
  "04-bedroom": "lifestyle",
  "05-living-room": "lifestyle",
  "06-gaming-room": "lifestyle",
  "07-romantic-room": "lifestyle",
  "08-kids-room": "lifestyle",
  "09-close-up": "products",
  "10-features": "generated",
  "11-package-contents": "products",
  "12-dimensions": "specifications",
  "13-before-after": "generated",
  "14-product-in-use": "lifestyle",
  "15-banner": "banners",
  "16-packaging": "products",
  "17-infographic": "generated",
  "18-mobile-banner": "banners",
  "19-desktop-banner": "banners",
  "20-social-media-banner": "banners",
};

const BANNER_SIZES = {
  "15-banner": [2000, 800],
  "18-mobile-banner": [1080, 1920],
  "19-desktop-banner": [2560, 800],
  "20-social-media-banner": [1200, 1200],
};

const ALL_TYPES = Object.keys(IMAGE_FOLDERS);

async function downloadFromUrls(urls) {
  for (const url of urls) {
    try {
      const res = await fetch(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Accept: "image/webp,image/apng,image/*,*/*;q=0.8",
          Referer: "https://www.amazon.nl/",
        },
        signal: AbortSignal.timeout(60000),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.length < 12000) throw new Error("too small");
      await sharp(buf).metadata();
      return buf;
    } catch (e) {
      console.log(`    ✗ ${url.slice(0, 70)}... (${e.message})`);
    }
  }
  return null;
}

async function generateAI(prompt, imageType) {
  const [w, h] = BANNER_SIZES[imageType] || [2000, 2000];
  const seed = 88001 + ALL_TYPES.indexOf(imageType);
  const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=${w}&height=${h}&nologo=true&seed=${seed}&model=flux`;
  console.log(`    🤖 AI fallback ${w}x${h}...`);
  return downloadFromUrls([url]);
}

async function optimize(buffer, outDir, baseName) {
  await fs.mkdir(path.join(outDir, "thumbs"), { recursive: true });
  await fs.mkdir(path.join(outDir, "responsive"), { recursive: true });
  const rel = (p) => "/" + path.relative(PUBLIC, p).replace(/\\/g, "/");
  const paths = {
    original: path.join(outDir, `${baseName}.jpg`),
    webp: path.join(outDir, `${baseName}.webp`),
    avif: path.join(outDir, `${baseName}.avif`),
    thumb: path.join(outDir, "thumbs", `${baseName}-400.webp`),
    sm: path.join(outDir, "responsive", `${baseName}-640.webp`),
    md: path.join(outDir, "responsive", `${baseName}-1280.webp`),
    lg: path.join(outDir, "responsive", `${baseName}-2000.webp`),
  };
  await sharp(buffer).rotate().jpeg({ quality: 92, mozjpeg: true }).toFile(paths.original);
  await sharp(buffer).rotate().webp({ quality: 88 }).toFile(paths.webp);
  await sharp(buffer).rotate().avif({ quality: 80 }).toFile(paths.avif);
  await sharp(buffer)
    .rotate()
    .resize(400, 400, { fit: "inside", withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(paths.thumb);
  for (const [size, p] of [
    [640, paths.sm],
    [1280, paths.md],
    [2000, paths.lg],
  ]) {
    await sharp(buffer)
      .rotate()
      .resize(size, size, { fit: "inside", withoutEnlargement: false })
      .webp({ quality: 85 })
      .toFile(p);
  }
  return {
    original: rel(paths.original),
    webp: rel(paths.webp),
    avif: rel(paths.avif),
    thumbnail: rel(paths.thumb),
    responsive: { sm: rel(paths.sm), md: rel(paths.md), lg: rel(paths.lg) },
  };
}

async function main() {
  console.log("🚀 MAKTUL Astronaut Galaxy Projector — full 20-image import\n");

  const manifestPath = path.join(ROOT, "src/lib/product-images/manifest.json");
  const manifest = JSON.parse(await fs.readFile(manifestPath, "utf-8"));
  const existing = manifest.products[SLUG] || {};
  const product = {
    slug: SLUG,
    sku: "NRV-ASTRO-01",
    name: "Astronaut Galaxy Projector",
    images: { ...existing.images },
    prompts: existing.prompts || {},
    sources: { ...existing.sources },
  };

  for (const imageType of ALL_TYPES) {
    const folder = IMAGE_FOLDERS[imageType];
    const outDir = path.join(PUBLIC, folder, SLUG);
    await fs.mkdir(outDir, { recursive: true });
    console.log(`📸 ${imageType}`);

    let buffer = null;
    let source = "ai-generated";

    if (REAL_SOURCES[imageType]) {
      console.log("  ↓ Amazon MAKTUL sources...");
      buffer = await downloadFromUrls(REAL_SOURCES[imageType]);
      if (buffer) source = "commercial";
    }

    if (!buffer && AI_PROMPTS[imageType]) {
      buffer = await generateAI(AI_PROMPTS[imageType], imageType);
    }

    if (!buffer) {
      console.log("  ✗ Skipped\n");
      continue;
    }

    const optimized = await optimize(buffer, outDir, imageType);
    product.images[imageType] = optimized;
    product.sources[imageType] = source;
    console.log(`  ✓ Done (${source})\n`);
    await new Promise((r) => setTimeout(r, 800));
  }

  manifest.products[SLUG] = product;
  manifest.generatedAt = new Date().toISOString();
  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));
  console.log("✅ All 20 MAKTUL images imported — manifest updated");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
