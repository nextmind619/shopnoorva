/**
 * Import AI-generated mosquito bed tent photos into gallery slots.
 *
 * Usage: node scripts/import-mosquito-bed-tent-ai-photos.mjs
 */
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const PUBLIC = path.join(ROOT, "public");
const SLUG = "foldable-mosquito-bed-tent";
const SKU = "Mosquito-protection-tent";
const NAME = "Foldable Mosquito Protection Bed Tent";

const ASSETS = path.join(
  process.env.USERPROFILE || "",
  ".cursor",
  "projects",
  "c-Users-admin-tmp-shopnoorva-rabbit",
  "assets"
);

const IMPORT_DIR = path.join(ROOT, "tmp", "mosquito-tent-ai-import");

const SOURCE_FILES = {
  premiumHero: "02-premium-hero.png",
  heroCatalog: "01-hero-white-bg.png",
  featuresSetup: "10-features.png",
  zipCloseUp: "09-close-up.png",
  lifestyleSleep: "14-product-in-use.png",
};

const SOURCE_MAP = {
  "02-premium-hero": "premiumHero",
  "01-hero-white-bg": "heroCatalog",
  "10-features": "featuresSetup",
  "09-close-up": "zipCloseUp",
  "14-product-in-use": "lifestyleSleep",
};

const SLOT_CONFIG = {
  "02-premium-hero": { folder: "products", width: 2000, height: 2000, fit: "cover" },
  "01-hero-white-bg": { folder: "products", width: 2000, height: 2000, fit: "contain", bg: "#ffffff" },
  "10-features": { folder: "products", width: 2000, height: 2000, fit: "cover" },
  "09-close-up": { folder: "products", width: 2000, height: 2000, fit: "cover" },
  "14-product-in-use": { folder: "lifestyle", width: 2000, height: 2000, fit: "cover" },
};

async function stageImports() {
  await fs.mkdir(IMPORT_DIR, { recursive: true });
  for (const file of Object.values(SOURCE_FILES)) {
    const src = path.join(ASSETS, file);
    const dest = path.join(IMPORT_DIR, file);
    await fs.copyFile(src, dest);
    console.log(`  staged ${file}`);
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

async function main() {
  console.log(`Staging AI photos for ${SLUG}...`);
  await stageImports();

  const manifestPath = path.join(ROOT, "src/lib/product-images/manifest.json");
  const manifest = JSON.parse(await fs.readFile(manifestPath, "utf-8"));
  const productManifest = manifest.products[SLUG] || {
    slug: SLUG,
    sku: SKU,
    name: NAME,
    images: {},
    prompts: {},
    sources: {},
  };

  for (const [imageType, config] of Object.entries(SLOT_CONFIG)) {
    const outDir = path.join(PUBLIC, config.folder, SLUG);
    await fs.mkdir(outDir, { recursive: true });

    const fileKey = SOURCE_MAP[imageType];
    const srcFile = path.join(IMPORT_DIR, SOURCE_FILES[fileKey]);
    const inputBuffer = await fs.readFile(srcFile);

    let pipeline = sharp(inputBuffer).rotate();
    if (config.fit === "contain") {
      pipeline = pipeline.resize(config.width, config.height, {
        fit: "contain",
        background: config.bg || "#ffffff",
        position: "centre",
      });
    } else {
      pipeline = pipeline.resize(config.width, config.height, {
        fit: "cover",
        position: "centre",
      });
    }
    const canvas = await pipeline.toBuffer();

    const optimized = await optimizeImage(canvas, outDir, imageType);
    productManifest.images[imageType] = optimized;
    productManifest.sources[imageType] = "ai-generated";
    console.log(`  ✓ ${imageType} <- ${SOURCE_FILES[fileKey]}`);
  }

  productManifest.slug = SLUG;
  productManifest.sku = SKU;
  productManifest.name = NAME;
  manifest.products[SLUG] = productManifest;
  manifest.generatedAt = new Date().toISOString();
  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));
  console.log(`\nManifest updated: ${manifestPath}`);
}

main().catch((e) => {
  console.error("Import failed:", e);
  process.exit(1);
});
