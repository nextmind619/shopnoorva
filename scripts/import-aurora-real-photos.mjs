/**
 * Replace ALL 20 image slots for northern-lights-galaxy-projector with the
 * client's white geometric Dream Aurora reference photos.
 *
 * Usage: node scripts/import-aurora-real-photos.mjs
 */
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const PUBLIC = path.join(ROOT, "public");
const SLUG = "northern-lights-galaxy-projector";
const PRODUCT_NAME = "White Geometric Dream Aurora Star Projector with Bluetooth";

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

async function resolveByPrefix(prefixes) {
  const files = await fs.readdir(SRC_DIR);
  for (const prefix of prefixes) {
    const matches = files
      .filter((f) => f.startsWith(prefix) && /\.(png|jpe?g|webp)$/i.test(f))
      .sort((a, b) => b.length - a.length || b.localeCompare(a));
    if (matches[0]) return path.join(SRC_DIR, matches[0]);
  }
  throw new Error(`Missing source for: ${prefixes.join(", ")}`);
}

/** Map slots → uploaded marketing / packshot references */
const SOURCE_KEYS = {
  "01-hero-white-bg": ["Sdd5ca5545dcb4be093f926e07d68a1aeC", "projecteur-galaxie-plafond-adulte", "51hUXIevkHL"],
  "02-premium-hero": ["Sdd5ca5545dcb4be093f926e07d68a1aeC", "projecteur-galaxie-plafond-5"],
  "03-lifestyle": ["projecteur-galaxie-plafond-1", "1 (3)"],
  "04-bedroom": ["1 (3)", "projecteur-galaxie-plafond-1"],
  "05-living-room": ["projecteur-galaxie-plafond-1", "2 (3)"],
  "06-gaming-room": ["4 (3)", "projecteur-galaxie-plafond-5"],
  "07-romantic-room": ["2 (3)", "1 (3)"],
  "08-kids-room": ["3 (3)", "4-d3d7d7ef"],
  "09-close-up": ["1000074230", "projecteur-plafond-galaxie"],
  "10-features": ["Sdd5ca5545dcb4be093f926e07d68a1aeC", "projecteur-galaxie-plafond-adulte"],
  "11-package-contents": ["projecteur-galaxie-plafond-adulte", "projecteur-galaxie-plafond-5"],
  "12-dimensions": ["projecteur-galaxie-plafond-adulte", "Sdd5ca5545dcb4be093f926e07d68a1aeC"],
  "13-before-after": ["projecteur-galaxie-plafond-1", "1 (3)"],
  "14-product-in-use": ["projecteur-galaxie-plafond-1", "2 (3)"],
  "15-banner": ["Sdd5ca5545dcb4be093f926e07d68a1aeC", "projecteur-galaxie-plafond-1"],
  "16-packaging": ["projecteur-galaxie-plafond-adulte", "projecteur-galaxie-plafond-5"],
  "17-infographic": ["4 (3)", "Sdd5ca5545dcb4be093f926e07d68a1aeC"],
  "18-mobile-banner": ["1 (3)", "projecteur-galaxie-plafond-1"],
  "19-desktop-banner": ["Sdd5ca5545dcb4be093f926e07d68a1aeC", "2 (3)"],
  "20-social-media-banner": ["projecteur-galaxie-plafond-5", "4 (3)"],
};

async function optimizeImage(canvasBuffer, outDir, baseName, isBanner) {
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
  await sharp(canvasBuffer)
    .resize(400, isBanner ? 160 : 400, { fit: "inside", withoutEnlargement: true })
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
  console.log(`Importing Dream Aurora white geometric photos for ${SLUG}...`);
  const manifestPath = path.join(ROOT, "src/lib/product-images/manifest.json");
  const manifest = JSON.parse(await fs.readFile(manifestPath, "utf-8"));
  const productManifest = manifest.products[SLUG] || {
    slug: SLUG,
    sku: "NRV-AURORA-01",
    name: PRODUCT_NAME,
    images: {},
    prompts: {},
    sources: {},
  };

  for (const [imageType, config] of Object.entries(IMAGE_TYPE_CONFIGS)) {
    const srcFile = await resolveByPrefix(SOURCE_KEYS[imageType]);
    const outDir = path.join(PUBLIC, config.folder, SLUG);
    await fs.mkdir(outDir, { recursive: true });

    const inputBuffer = await fs.readFile(srcFile);
    const isBanner = config.height === 800 || config.height === 1920;
    const canvas = await sharp(inputBuffer)
      .rotate()
      .resize(config.width, config.height, { fit: "cover", position: "centre" })
      .toBuffer();

    const optimized = await optimizeImage(canvas, outDir, imageType, isBanner);
    productManifest.images[imageType] = optimized;
    productManifest.sources[imageType] = "commercial";
    console.log(`  ✓ ${imageType} <- ${path.basename(srcFile)}`);
  }

  productManifest.name = PRODUCT_NAME;
  productManifest.sku = "NRV-AURORA-01";
  productManifest.prompts = {};
  manifest.products[SLUG] = productManifest;
  manifest.generatedAt = new Date().toISOString();
  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));
  console.log(`\nManifest updated: ${manifestPath}`);
}

main().catch((e) => {
  console.error("Import failed:", e);
  process.exit(1);
});
