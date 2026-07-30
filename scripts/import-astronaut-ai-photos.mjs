/**
 * Import client AI product photos into astronaut-bt-speaker-projector slots
 * (mapped to PDP gallery / landing / CRO sections per prompt analysis).
 *
 * Usage: node scripts/import-astronaut-ai-photos.mjs
 */
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const PUBLIC = path.join(ROOT, "public");
const SLUG = "astronaut-bt-speaker-projector";

const ASSETS = path.join(
  process.env.USERPROFILE || "",
  ".cursor",
  "projects",
  "c-Users-admin-tmp-shopnoorva-rabbit",
  "assets"
);

/** Stable names copied from Cursor assets (see SOURCE_FILES). */
const IMPORT_DIR = path.join(ROOT, "tmp", "astronaut-ai-import");

const SOURCE_FILES = {
  heroCatalog: "01-hero-nebula-wood.png",
  premiumComposite: "02-premium-bedroom-composite.png",
  bedroomLifestyle: "04-bedroom-lifestyle.png",
  twinUnitStudio: "03-twin-units-box.png",
  projectionDemo: "06-projection-modes.png",
  featuresInfographic: "10-features-infographic.png",
  handheldBack: "09-handheld-back.png",
  effectsCollage: "08-effects-collage.png",
};

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

/** Slot → import file key (prompt-matched). */
const SOURCE_MAP = {
  "01-hero-white-bg": "heroCatalog",
  "02-premium-hero": "premiumComposite",
  "03-lifestyle": "twinUnitStudio",
  "04-bedroom": "bedroomLifestyle",
  "05-living-room": "twinUnitStudio",
  "06-gaming-room": "projectionDemo",
  "07-romantic-room": "projectionDemo",
  "08-kids-room": "effectsCollage",
  "09-close-up": "handheldBack",
  "10-features": "featuresInfographic",
  "11-package-contents": "twinUnitStudio",
  "13-before-after": "projectionDemo",
  "14-product-in-use": "bedroomLifestyle",
  "15-banner": "premiumComposite",
  "16-packaging": "twinUnitStudio",
  "18-mobile-banner": "premiumComposite",
  "19-desktop-banner": "premiumComposite",
  "20-social-media-banner": "effectsCollage",
};

/** Keep existing supplier assets for slots without new AI art. */
const KEEP_EXISTING = new Set(["12-dimensions", "17-infographic"]);

const CURSOR_ASSET_GLOB = [
  ["heroCatalog", "91d4ae78"],
  ["premiumComposite", "35f904aa"],
  ["bedroomLifestyle", "3ab3bb08"],
  ["effectsCollage", "816cf0ab"],
  ["featuresInfographic", "98bc3d8e"],
  ["handheldBack", "80260662"],
  ["twinUnitStudio", "19f85700"],
  ["projectionDemo", "96d87f97"],
];

async function findAsset(prefix) {
  const names = await fs.readdir(ASSETS);
  const hit = names.find((n) => n.includes(prefix));
  if (!hit) throw new Error(`Asset not found for prefix ${prefix} in ${ASSETS}`);
  return path.join(ASSETS, hit);
}

async function stageImports() {
  await fs.mkdir(IMPORT_DIR, { recursive: true });
  for (const [key, prefix] of CURSOR_ASSET_GLOB) {
    const src = await findAsset(prefix);
    const dest = path.join(IMPORT_DIR, SOURCE_FILES[key]);
    await fs.copyFile(src, dest);
    console.log(`  staged ${SOURCE_FILES[key]}`);
  }
}

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

  await sharp(canvasBuffer)
    .flatten({ background: "#ffffff" })
    .jpeg({ quality: 92, mozjpeg: true })
    .toFile(originalPath);
  await sharp(canvasBuffer).webp({ quality: 88, effort: 4 }).toFile(webpPath);
  await sharp(canvasBuffer).avif({ quality: 80, effort: 4 }).toFile(avifPath);
  await sharp(canvasBuffer)
    .resize(400, 400, { fit: "inside", withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(thumbPath);

  for (const [size, p] of [
    [640, smPath],
    [1280, mdPath],
    [2000, lgPath],
  ]) {
    await sharp(canvasBuffer)
      .resize(size, size, { fit: "inside", withoutEnlargement: false })
      .webp({ quality: 85 })
      .toFile(p);
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

async function loadExistingJpg(imageType, config) {
  const jpg = path.join(PUBLIC, config.folder, SLUG, `${imageType}.jpg`);
  return fs.readFile(jpg);
}

async function main() {
  console.log(`Staging AI photos for ${SLUG}...`);
  await stageImports();

  const manifestPath = path.join(ROOT, "src/lib/product-images/manifest.json");
  const manifest = JSON.parse(await fs.readFile(manifestPath, "utf-8"));
  const productManifest = manifest.products[SLUG] || {
    slug: SLUG,
    images: {},
    prompts: {},
    sources: {},
  };

  for (const [imageType, config] of Object.entries(IMAGE_TYPE_CONFIGS)) {
    const outDir = path.join(PUBLIC, config.folder, SLUG);
    await fs.mkdir(outDir, { recursive: true });

    let inputBuffer;
    let sourceLabel;

    if (KEEP_EXISTING.has(imageType)) {
      inputBuffer = await loadExistingJpg(imageType, config);
      sourceLabel = "existing-kept";
    } else {
      const fileKey = SOURCE_MAP[imageType];
      if (!fileKey) continue;
      const srcFile = path.join(IMPORT_DIR, SOURCE_FILES[fileKey]);
      inputBuffer = await fs.readFile(srcFile);
      sourceLabel = SOURCE_FILES[fileKey];
    }

    const canvas = await sharp(inputBuffer)
      .rotate()
      .resize(config.width, config.height, { fit: "cover", position: "centre" })
      .toBuffer();

    const optimized = await optimizeImage(canvas, outDir, imageType);
    productManifest.images[imageType] = optimized;
    productManifest.sources[imageType] = KEEP_EXISTING.has(imageType) ? "commercial" : "ai-generated";
    console.log(`  ✓ ${imageType} <- ${sourceLabel}`);
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
