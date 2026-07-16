/**
 * One-off import: replace ALL 20 image slots for astronaut-bt-speaker-projector
 * with real supplier/product photos (provided by the client), instead of the
 * AI-generated placeholders. Re-optimizes each source photo into the same
 * jpg/webp/avif + responsive + thumbnail set the main pipeline produces, at
 * the exact same paths, so no other code needs to change.
 *
 * Usage: node scripts/import-astronaut-real-photos.mjs
 */
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const PUBLIC = path.join(ROOT, "public");
const SLUG = "astronaut-bt-speaker-projector";

const SRC_DIR =
  "C:/Users/admin/AppData/Roaming/Cursor/User/workspaceStorage/1783604483934/images";

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

// Real supplier photos provided by the client, mapped to the closest-matching slot.
const HERO_MAIN = "1 (1)-9573e7e1-c738-4f09-8c2e-0e5c46473943.png"; // remote + phone + galaxy on ceiling
const DETAIL_DESIGN = "2 (1)-59084f6d-1023-4b5c-a72f-650851af5f7a.png"; // 360 rotation / magnetic head / keys
const POWER_MODES = "3 (1)-a616831a-67a7-4b7e-9f0e-5b0a8a3000fe.png"; // adapter / power bank / USB
const COLORS_EFFECTS = "3-42b52d79-780a-4359-811e-8c0f3428d59c.png"; // 4 colors 48 effects, festive group photo
const CLEAN_WHITE_BG = "images (1)-3e882848-0c3b-48d3-8332-0340bd5a535c.png"; // plain product-only shot
const DIMENSIONS = "4 (1)-76d7a525-82bf-44be-873c-b10975376dc6.png"; // 24cm/12cm dimension diagram
const HANDHELD_BACK = "1000074231-fe677c1c-1fcd-4647-9728-747ae926439a.png"; // real close-up, back view
const TWO_UNITS_BOX = "H61a74287b58443b1b8ca617053ef996bT-bab4d039-75c4-4326-9c59-92eb025f1c89.png"; // 2 units + box
const NEBULA_DEMO = "Hef227538cf9142e1b6df6c9226ce08afE-0feb9945-2f5e-48d6-83bd-9d336f9b1931.png"; // red/green nebula demo

const SOURCE_MAP = {
  "01-hero-white-bg": CLEAN_WHITE_BG,
  "02-premium-hero": HERO_MAIN,
  "03-lifestyle": TWO_UNITS_BOX,
  "04-bedroom": HERO_MAIN,
  "05-living-room": TWO_UNITS_BOX,
  "06-gaming-room": NEBULA_DEMO,
  "07-romantic-room": NEBULA_DEMO,
  "08-kids-room": COLORS_EFFECTS,
  "09-close-up": HANDHELD_BACK,
  "10-features": DETAIL_DESIGN,
  "11-package-contents": TWO_UNITS_BOX,
  "12-dimensions": DIMENSIONS,
  "13-before-after": NEBULA_DEMO,
  "14-product-in-use": HERO_MAIN,
  "15-banner": HERO_MAIN,
  "16-packaging": TWO_UNITS_BOX,
  "17-infographic": POWER_MODES,
  "18-mobile-banner": HERO_MAIN,
  "19-desktop-banner": HERO_MAIN,
  "20-social-media-banner": COLORS_EFFECTS,
};

async function optimizeImage(canvasBuffer, outDir, baseName) {
  const originalPath = path.join(outDir, `${baseName}.jpg`);
  const webpPath = path.join(outDir, `${baseName}.webp`);
  const avifPath = path.join(outDir, `${baseName}.avif`);
  const thumbPath = path.join(outDir, "thumbs", `${baseName}-400.webp`);
  const smPath = path.join(outDir, "responsive", `${baseName}-640.webp`);
  const mdPath = path.join(outDir, "responsive", `${baseName}-1280.webp`);
  const lgPath = path.join(outDir, "responsive", `${baseName}-2000.webp`);

  await fs.mkdir(path.join(outDir, "thumbs"), { recursive: true });
  await fs.mkdir(path.join(outDir, "responsive"), { recursive: true });

  await sharp(canvasBuffer).flatten({ background: "#ffffff" }).jpeg({ quality: 92, mozjpeg: true }).toFile(originalPath);
  await sharp(canvasBuffer).webp({ quality: 88, effort: 4 }).toFile(webpPath);
  await sharp(canvasBuffer).avif({ quality: 80, effort: 4 }).toFile(avifPath);
  await sharp(canvasBuffer).resize(400, 400, { fit: "inside", withoutEnlargement: true }).webp({ quality: 82 }).toFile(thumbPath);

  for (const [size, p] of [[640, smPath], [1280, mdPath], [2000, lgPath]]) {
    await sharp(canvasBuffer).resize(size, size, { fit: "inside", withoutEnlargement: false }).webp({ quality: 85 }).toFile(p);
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

async function main() {
  console.log(`Importing real photos for ${SLUG}...`);
  const manifestPath = path.join(ROOT, "src/lib/product-images/manifest.json");
  const manifest = JSON.parse(await fs.readFile(manifestPath, "utf-8"));
  const productManifest = manifest.products[SLUG] || { slug: SLUG, images: {}, prompts: {}, sources: {} };

  for (const [imageType, config] of Object.entries(IMAGE_TYPE_CONFIGS)) {
    const srcFile = path.join(SRC_DIR, SOURCE_MAP[imageType]);
    const outDir = path.join(PUBLIC, config.folder, SLUG);
    await fs.mkdir(outDir, { recursive: true });

    const inputBuffer = await fs.readFile(srcFile);
    const canvas = await sharp(inputBuffer)
      .rotate()
      .resize(config.width, config.height, { fit: "cover", position: "centre" })
      .toBuffer();

    const optimized = await optimizeImage(canvas, outDir, imageType);
    productManifest.images[imageType] = optimized;
    productManifest.sources[imageType] = "commercial";
    console.log(`  \u2713 ${imageType} <- ${SOURCE_MAP[imageType]}`);
  }

  manifest.products[SLUG] = productManifest;
  manifest.generatedAt = new Date().toISOString();
  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));
  console.log(`\nManifest updated: ${manifestPath}`);
}

main().catch((e) => {
  console.error("Import failed:", e);
  process.exit(1);
});
