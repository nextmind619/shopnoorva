/**
 * Import REAL astronaut galaxy projector images — white-noise / Bluetooth speaker
 * standing-robot model (glossy black dome visor + HD lens, round helmet speaker-ears,
 * chest Bluetooth speaker, 360° head on adjustable arm + fixed base).
 * Replaces the earlier incorrect "bear-ear" design.
 */
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const PUBLIC = path.join(ROOT, "public");
const SLUG = "astronaut-galaxy-projector";
const AMZ = (id) => `https://m.media-amazon.com/images/I/${encodeURIComponent(id)}._AC_SL1500_.jpg`;

const VISUAL =
  "EXACT real product — white standing robot-style astronaut galaxy star projector. Large glossy black dome-shaped visor/helmet face with a centered HD projection lens and small green LED indicator light on top. Two small round perforated speaker-cup ears on the upper sides of the helmet. Thin silver braided mesh strap draping over one shoulder from the helmet. White rounded torso with a large circular perforated speaker grille on the chest. Articulated jointed neck-arm allowing the head to tilt and swivel 360°, mounted on a wide four-point fixed white stable base with magnetic quick-release head mount. Back panel has labeled buttons ON/OFF, Model, Light, Music/Sound and a USB port. Black slim remote control with numeric buttons and nebula/mode grid. 8 built-in soothing white-noise sounds, 9 nebula effects with 4 speed levels, brightness adjustable 5%-100%. Matte white ABS plastic, glossy black visor. Standing pose, NOT sitting, NOT holding a star, NOT bear-ear helmet. DO NOT redesign — exact replica.";

/**
 * Real commercial photos of this exact generic dropship model (shared stock imagery
 * used across multiple resellers of the same supplier product).
 */
const REAL_SOURCES = {
  "01-hero-white-bg": [AMZ("51Hg5RV9KbL"), AMZ("510-S99FFbL")],
  "02-premium-hero": [AMZ("51Vb5sj947L"), AMZ("510-S99FFbL")],
  "03-lifestyle": [AMZ("41HQNM-aTgL"), AMZ("51Hg5RV9KbL")],
  "04-bedroom": [AMZ("51Vb5sj947L"), AMZ("41HQNM-aTgL")],
  "05-living-room": [AMZ("71S9DZxPARL"), AMZ("41HQNM-aTgL")],
  "06-gaming-room": [AMZ("41HQNM-aTgL")],
  "07-romantic-room": [AMZ("71RJxFqKKpL")],
  "08-kids-room": [AMZ("51Vb5sj947L")],
  "09-close-up": [AMZ("51K2iLRpiBL"), AMZ("719jR0YToBL")],
  "10-features": [AMZ("51Hg5RV9KbL"), AMZ("51K2iLRpiBL")],
  "11-package-contents": [AMZ("510-S99FFbL"), AMZ("61rqwvv0owL")],
  "12-dimensions": [AMZ("51K2iLRpiBL")],
  "13-before-after": [AMZ("41HQNM-aTgL")],
  "14-product-in-use": [AMZ("41HQNM-aTgL"), AMZ("51Vb5sj947L")],
  "15-banner": [AMZ("51Vb5sj947L"), AMZ("41HQNM-aTgL")],
  "16-packaging": [AMZ("51K2iLRpiBL"), AMZ("61rqwvv0owL")],
  "17-infographic": [AMZ("510-S99FFbL"), AMZ("51Hg5RV9KbL")],
  "18-mobile-banner": [AMZ("41HQNM-aTgL")],
  "19-desktop-banner": [AMZ("51Vb5sj947L")],
  "20-social-media-banner": [AMZ("41HQNM-aTgL"), AMZ("51Hg5RV9KbL")],
};

const AI_PROMPTS = {
  "01-hero-white-bg": `${VISUAL} Studio product photo on pure white background, 45 degree angle, black remote beside it, photorealistic e-commerce, 8K, no text`,
  "02-premium-hero": `${VISUAL} Marketing hero photo: astronaut on nightstand projecting vivid blue purple nebula and green stars onto bedroom ceiling, black remote and USB cable beside it, 8 circular white-noise icon thumbnails along the bottom, photorealistic advertisement, 8K, no watermark`,
  "03-lifestyle": `${VISUAL} On wooden nightstand in a dark cozy bedroom projecting vivid blue purple nebula on the ceiling, black remote nearby, cinematic, 8K`,
  "04-bedroom": `${VISUAL} Dark bedroom with sleeping child, calming nebula and stars projected on the ceiling, product on nightstand, cinematic mood, 8K`,
  "05-living-room": `${VISUAL} Modern living room shelf projecting soft purple blue galaxy ambiance across the room, 8K`,
  "06-gaming-room": `${VISUAL} Gaming desk setup with purple neon ambience, astronaut projector casting galaxy light on the wall behind monitor, 8K`,
  "07-romantic-room": `${VISUAL} Romantic bedroom with soft pink purple galaxy projection, cozy atmosphere, 8K`,
  "08-kids-room": `${VISUAL} Kids bedroom, child sleeping peacefully under colorful galaxy projection on ceiling, astronaut projector on dresser, 8K`,
  "09-close-up": `${VISUAL} Macro close-up of the glossy black dome visor, HD lens, green LED indicator, round helmet speaker-ears and mesh shoulder strap, photorealistic detail shot, 8K`,
  "10-features": `${VISUAL} Infographic with 4 circular insets showing: 360° rotatable head, adjustable arm, fixed stable base, HD lens close-up, purple nebula background, 8K`,
  "11-package-contents": `${VISUAL} Flat lay "what's in the box": astronaut projector, black remote control, USB cable, instruction manual, retail box printed ASTRONAUT STAR LIGHT, white background, 8K`,
  "12-dimensions": `${VISUAL} Product with dimension lines 23cm height x 12cm base, front and side view, specification photo on light background, 8K`,
  "13-before-after": `Split before/after: plain dull bedroom on left vs same bedroom transformed by ${VISUAL} projecting vivid galaxy nebula on the ceiling on right, dramatic transformation, 8K`,
  "14-product-in-use": `${VISUAL} Powered on, projecting vivid blue purple green nebula and twinkling stars onto a dark bedroom ceiling and wall, photorealistic hero shot, 8K`,
  "15-banner": `${VISUAL} Wide e-commerce banner, nebula background, chest Bluetooth speaker and remote control visible, 2000x800, 8K`,
  "16-packaging": `${VISUAL} Retail packaging box printed ASTRONAUT STAR LIGHT GALAXY PROJECTOR NIGHT LIGHT with astronaut line art, product beside box, 8K`,
  "17-infographic": `${VISUAL} Infographic showing brightness levels 5% 30% 70% 100% and rotation speed control slider, nebula background, 8K`,
  "18-mobile-banner": `${VISUAL} Vertical TikTok-style mobile ad, dark bedroom galaxy projection, 1080x1920, 8K`,
  "19-desktop-banner": `${VISUAL} Wide desktop hero banner, astronaut galaxy nebula projection, cinematic, 2560x800, 8K`,
  "20-social-media-banner": `${VISUAL} Square Instagram/Facebook ad, astronaut Bluetooth speaker with remote, vibrant nebula background, 1200x1200, 8K`,
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
          Referer: "https://www.amazon.com/",
        },
        signal: AbortSignal.timeout(60000),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.length < 10000) throw new Error("too small");
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
  const seed = 77001 + ALL_TYPES.indexOf(imageType);
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
  console.log("🚀 Astronaut galaxy projector (white-noise / standing robot model) — image import\n");

  const manifestPath = path.join(ROOT, "src/lib/product-images/manifest.json");
  const manifest = JSON.parse(await fs.readFile(manifestPath, "utf-8"));
  const product = {
    slug: SLUG,
    sku: "NRV-ASTRO-01",
    name: "Astronaut Galaxy Projector",
    images: {},
    prompts: {},
    sources: {},
  };

  for (const imageType of ALL_TYPES) {
    const folder = IMAGE_FOLDERS[imageType];
    const outDir = path.join(PUBLIC, folder, SLUG);
    await fs.mkdir(outDir, { recursive: true });
    console.log(`📸 ${imageType}`);

    let buffer = null;
    let source = "ai-generated";

    if (REAL_SOURCES[imageType]) {
      console.log("  ↓ Commercial...");
      buffer = await downloadFromUrls(REAL_SOURCES[imageType]);
      if (buffer) source = "commercial";
    }

    if (!buffer && AI_PROMPTS[imageType]) {
      buffer = await generateAI(AI_PROMPTS[imageType], imageType);
      if (buffer) source = "ai-generated";
    }

    if (!buffer) {
      console.log("  ✗ Skipped\n");
      continue;
    }

    product.images[imageType] = await optimize(buffer, outDir, imageType);
    product.sources[imageType] = source;
    console.log(`  ✓ ${source}\n`);
    await new Promise((r) => setTimeout(r, source === "ai-generated" ? 1500 : 500));
  }

  manifest.products[SLUG] = product;
  manifest.generatedAt = new Date().toISOString();
  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));
  console.log("✅ Real astronaut (white-noise model) images complete — manifest updated");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
