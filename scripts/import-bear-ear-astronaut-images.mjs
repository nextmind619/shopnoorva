/**
 * Bear-ear chest-speaker Bluetooth astronaut — exact user reference product.
 * NOT MAKTUL standing model. NOT sitting star model.
 */
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const PUBLIC = path.join(ROOT, "public");
const SLUG = "astronaut-galaxy-projector";
const AMZ = (id) =>
  `https://m.media-amazon.com/images/I/${encodeURIComponent(id)}._AC_SL1500_.jpg`;

const VISUAL =
  "EXACT white chibi astronaut galaxy projector Bluetooth speaker. Two small rounded bear-ear protrusions on top of white helmet. Large dark glossy black visor with nebula projection lens inside. Small circular lens on top of helmet between ears. Large circular perforated chest speaker grille with concentric holes. White lunar crater textured circular base. Grey braided cable connecting head to body. Rectangular white backpack with buttons ON OFF Model Light Music Sound and USB port. Black slim vertical remote red power button R G B W S+ S- NEBULA buttons. 360 magnetic rotating head. Standing pose NOT sitting NOT holding star. Matte white ABS plastic. DO NOT redesign.";

const REAL_SOURCES = {
  "02-premium-hero": [AMZ("71icsbrywBL"), AMZ("51JstmLGBSL")],
  "01-hero-white-bg": [AMZ("416l9BGn6uL"), AMZ("71icsbrywBL")],
  "09-close-up": [AMZ("71icsbrywBL"), AMZ("51JstmLGBSL")],
  "10-features": [AMZ("61ypnZIj6hL"), AMZ("51rpNoYsiQL")],
  "17-infographic": [AMZ("51JstmLGBSL"), AMZ("71icsbrywBL")],
  "14-product-in-use": [AMZ("416l9BGn6uL"), AMZ("71PeLNrt6dL")],
  "03-lifestyle": [AMZ("51KPG-WwiLL"), AMZ("71+NgcPTK9L")],
  "04-bedroom": [AMZ("51KPG-WwiLL"), AMZ("61DhnH8r-yL")],
  "05-living-room": [AMZ("51KPG-WwiLL")],
  "06-gaming-room": [AMZ("51KPG-WwiLL")],
  "08-kids-room": [AMZ("51KPG-WwiLL")],
  "07-romantic-room": [AMZ("61DhnH8r-yL")],
  "11-package-contents": [AMZ("416l9BGn6uL")],
  "12-dimensions": [AMZ("416l9BGn6uL")],
  "13-before-after": [AMZ("61DhnH8r-yL")],
  "15-banner": [AMZ("71PeLNrt6dL"), AMZ("51JprJ589QL")],
  "16-packaging": [AMZ("416l9BGn6uL")],
  "18-mobile-banner": [AMZ("71PeLNrt6dL")],
  "19-desktop-banner": [AMZ("51KPG-WwiLL")],
  "20-social-media-banner": [AMZ("51JprJ589QL"), AMZ("71PeLNrt6dL")],
};

const AI_ONLY = new Set([
  "02-premium-hero",
  "01-hero-white-bg",
  "10-features",
  "17-infographic",
  "12-dimensions",
  "11-package-contents",
]);

const AI_PROMPTS = {
  "02-premium-hero": `${VISUAL} Exact marketing composite photo: astronaut left side chest speaker with green pink musical notes, black remote and smartphone with music player app bottom right, dark bedroom background blue purple nebula on ceiling walls, 8 circular nebula color mode thumbnails right side with crescent moon, photorealistic advertisement 8K no watermark no text`,
  "01-hero-white-bg": `${VISUAL} Product hero on dark rustic wooden plank surface, black remote beside astronaut, vivid blue purple nebula galaxy background with stars, photorealistic commercial photography 8K no text`,
  "03-lifestyle": `${VISUAL} On wooden nightstand dark bedroom projecting blue purple nebula on ceiling black remote nearby cinematic 8K`,
  "04-bedroom": `${VISUAL} Cozy dark bedroom nightstand projecting vivid galaxy stars nebula on ceiling walls cinematic 8K`,
  "05-living-room": `${VISUAL} Modern living room shelf projecting soft purple blue galaxy ambiance 8K`,
  "06-gaming-room": `${VISUAL} Gaming desk purple neon astronaut projector galaxy on wall 8K`,
  "07-romantic-room": `${VISUAL} Romantic bedroom soft pink purple galaxy projection cozy 8K`,
  "08-kids-room": `${VISUAL} Kids bedroom colorful galaxy on ceiling astronaut on dresser 8K`,
  "09-close-up": `${VISUAL} Macro front chest speaker grille bear ear helmet dark visor black remote USB cable detail 8K`,
  "10-features": `${VISUAL} Infographic MORE DETAIL DESIGN purple nebula background 4 circular insets 360 head rotation arm swing magnetic head back buttons ON OFF Model Light Music bear ears chest speaker 8K`,
  "11-package-contents": `${VISUAL} Flat lay whats in the box astronaut projector black remote USB cable user manual white box 8K`,
  "12-dimensions": `${VISUAL} Product dimension lines 24cm height 12cm width lunar crater base 8 nebula color mode grid crescent moon right side starry background 8K`,
  "13-before-after": `Split before after bedroom plain lamp vs ${VISUAL} projecting vivid galaxy on ceiling transformation 8K`,
  "14-product-in-use": `${VISUAL} On dark wood black remote beside projecting blue purple nebula on wall photorealistic 8K`,
  "15-banner": `${VISUAL} Wide ecommerce banner nebula Bluetooth chest speaker remote 2000x800 8K`,
  "16-packaging": `${VISUAL} Retail product box white astronaut galaxy Bluetooth speaker premium packaging 8K`,
  "17-infographic": `${VISUAL} Infographic MULTIPLE POWER MODES white astronaut on moon rocky surface backpack USB port adapter power bank laptop USB icons bear ear helmet starry space 8K`,
  "18-mobile-banner": `${VISUAL} Vertical TikTok mobile ad galaxy bedroom Bluetooth 1080x1920 8K`,
  "19-desktop-banner": `${VISUAL} Wide desktop hero banner astronaut galaxy nebula 2560x800 8K`,
  "20-social-media-banner": `${VISUAL} Square Instagram ad astronaut Bluetooth speaker remote vibrant nebula 1200x1200 8K`,
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
          Accept: "image/*,*/*;q=0.8",
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
  const seed = 99001 + ALL_TYPES.indexOf(imageType);
  const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=${w}&height=${h}&nologo=true&seed=${seed}&model=flux`;
  console.log(`    🤖 AI ${w}x${h}...`);
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
  console.log("🚀 Bear-ear chest-speaker astronaut — 20 image import\n");

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

    if (!AI_ONLY.has(imageType) && REAL_SOURCES[imageType]) {
      console.log("  ↓ Commercial...");
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

    product.images[imageType] = await optimize(buffer, outDir, imageType);
    product.sources[imageType] = source;
    console.log(`  ✓ ${source}\n`);
    await new Promise((r) => setTimeout(r, AI_ONLY.has(imageType) ? 2000 : 600));
  }

  manifest.products[SLUG] = product;
  manifest.generatedAt = new Date().toISOString();
  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));
  console.log("✅ Bear-ear astronaut images complete");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
