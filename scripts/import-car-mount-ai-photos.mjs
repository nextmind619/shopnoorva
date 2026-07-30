/**
 * Import AI car-mount photos into magnetic-car-phone-mount-maidsail slots
 * (mapped to PDP gallery per prompt analysis).
 *
 * Usage: node scripts/import-car-mount-ai-photos.mjs
 */
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const PUBLIC = path.join(ROOT, "public");
const SLUG = "magnetic-car-phone-mount-maidsail";
const SKU = "NRV-CARMOUNT-01";
const NAME = "Maidsail Magnetic Car Phone Mount";

const ASSETS = path.join(
  process.env.USERPROFILE || "",
  ".cursor",
  "projects",
  "c-Users-admin-tmp-shopnoorva-rabbit",
  "assets"
);

const IMPORT_DIR = path.join(ROOT, "tmp", "car-mount-ai-import");

/** Slot → staged filename (prompt-matched). */
const SOURCE_FILES = {
  premiumHero: "02-premium-hero.png",
  heroCatalog: "01-hero-white-bg.png",
  featuresInfographic: "10-features.png",
  suctionLockCloseUp: "09-close-up.png",
  inCarLifestyle: "14-product-in-use.png",
};

const SOURCE_MAP = {
  "02-premium-hero": "premiumHero",
  "01-hero-white-bg": "heroCatalog",
  "10-features": "featuresInfographic",
  "09-close-up": "suctionLockCloseUp",
  "14-product-in-use": "inCarLifestyle",
};

const SLOT_CONFIG = {
  "02-premium-hero": { folder: "products", width: 2000, height: 2000, fit: "cover" },
  "01-hero-white-bg": { folder: "products", width: 2000, height: 2000, fit: "contain", bg: "#ffffff" },
  "10-features": { folder: "products", width: 2000, height: 2000, fit: "contain", bg: "#ffffff" },
  "09-close-up": { folder: "products", width: 2000, height: 2000, fit: "contain", bg: "#ffffff" },
  "14-product-in-use": { folder: "lifestyle", width: 2000, height: 2000, fit: "cover" },
};

const CURSOR_ASSET_GLOB = [
  ["premiumHero", "3ed42d59"],
  ["heroCatalog", "62409003"],
  ["featuresInfographic", "e8091c7e"],
  ["suctionLockCloseUp", "26ede10f"],
  ["inCarLifestyle", "1592f03b"],
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
