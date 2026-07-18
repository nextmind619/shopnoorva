/**
 * Replace ALL 20 image slots for bluetooth-star-projector with the client's
 * Cosmic Voyager / multi-color galaxy projector reference photos (+ Jumia fallbacks).
 *
 * Usage: node scripts/import-star-projector-real-photos.mjs
 */
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const PUBLIC = path.join(ROOT, "public");
const SLUG = "bluetooth-star-projector";
const PRODUCT_NAME = "Multi-Color Galaxy Projector Night Light with Speaker";

const SRC_DIR =
  "C:/Users/admin/AppData/Roaming/Cursor/User/workspaceStorage/1783604483934/images";
const JUMIA_DIR = path.join(ROOT, "tmp/jumia-starbt");

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

/** Prefer longest matching filename (newest UUID suffix variants). */
async function resolveByPrefix(dir, prefixes) {
  const files = await fs.readdir(dir);
  for (const prefix of prefixes) {
    const matches = files
      .filter((f) => f.startsWith(prefix) && /\.(png|jpe?g|webp)$/i.test(f))
      .sort((a, b) => b.length - a.length || b.localeCompare(a));
    if (matches[0]) return path.join(dir, matches[0]);
  }
  return null;
}

async function resolveSource(keys) {
  const local = await resolveByPrefix(SRC_DIR, keys);
  if (local) return local;
  for (const key of keys) {
    const jumia = path.join(JUMIA_DIR, key);
    try {
      await fs.access(jumia);
      return jumia;
    } catch {
      /* continue */
    }
  }
  throw new Error(`Missing source for keys: ${keys.join(", ")}`);
}

const SOURCE_KEYS = {
  "01-hero-white-bg": ["b3d96d89", "j1.jpg"],
  "02-premium-hero": ["1 (2)", "ccadd2cb", "j2.jpg"],
  "03-lifestyle": ["ccadd2cb", "1 (2)", "j3.jpg"],
  "04-bedroom": ["1 (2)", "e4ec83a9", "j2.jpg"],
  "05-living-room": ["ccadd2cb", "6-", "j3.jpg"],
  "06-gaming-room": ["6-", "ccadd2cb", "j4.jpg"],
  "07-romantic-room": ["2 (2)", "1 (2)", "j5.jpg"],
  "08-kids-room": ["3 (2)", "e4ec83a9", "j5.jpg"],
  "09-close-up": ["1000074233", "b3d96d89", "j1.jpg"],
  "10-features": ["4 (2)", "6-", "j4.jpg"],
  "11-package-contents": ["8-", "8-186c98ad", "j6.jpg"],
  "12-dimensions": ["b3d96d89", "j1.jpg"],
  "13-before-after": ["1 (2)", "ccadd2cb", "j2.jpg"],
  "14-product-in-use": ["ccadd2cb", "1 (2)", "j3.jpg"],
  "15-banner": ["1 (2)", "2 (2)", "j2.jpg"],
  "16-packaging": ["8-", "j6.jpg", "b3d96d89"],
  "17-infographic": ["e4ec83a9", "4 (2)", "j4.jpg"],
  "18-mobile-banner": ["1 (2)", "3 (2)", "j2.jpg"],
  "19-desktop-banner": ["ccadd2cb", "1 (2)", "j3.jpg"],
  "20-social-media-banner": ["4 (2)", "2 (2)", "j5.jpg"],
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

  const flat = sharp(canvasBuffer).flatten({ background: "#ffffff" });
  await flat.clone().jpeg({ quality: 92, mozjpeg: true }).toFile(originalPath);
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
  console.log(`Importing Cosmic Voyager / galaxy projector photos for ${SLUG}...`);
  const manifestPath = path.join(ROOT, "src/lib/product-images/manifest.json");
  const manifest = JSON.parse(await fs.readFile(manifestPath, "utf-8"));
  const productManifest = manifest.products[SLUG] || {
    slug: SLUG,
    sku: "NRV-STARBT-01",
    name: PRODUCT_NAME,
    images: {},
    prompts: {},
    sources: {},
  };

  for (const [imageType, config] of Object.entries(IMAGE_TYPE_CONFIGS)) {
    const srcFile = await resolveSource(SOURCE_KEYS[imageType]);
    const outDir = path.join(PUBLIC, config.folder, SLUG);
    await fs.mkdir(outDir, { recursive: true });

    const inputBuffer = await fs.readFile(srcFile);
    const isBanner = config.height < config.width || config.height === 800 || config.height === 1920;
    const canvas = await sharp(inputBuffer)
      .rotate()
      .resize(config.width, config.height, {
        fit: isBanner && config.height === 1920 ? "cover" : "cover",
        position: "centre",
      })
      .toBuffer();

    const optimized = await optimizeImage(canvas, outDir, imageType, isBanner);
    productManifest.images[imageType] = optimized;
    productManifest.sources[imageType] = "commercial";
    console.log(`  ✓ ${imageType} <- ${path.basename(srcFile)}`);
  }

  productManifest.name = PRODUCT_NAME;
  productManifest.sku = "NRV-STARBT-01";
  manifest.products[SLUG] = productManifest;
  manifest.generatedAt = new Date().toISOString();
  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));
  console.log(`\nManifest updated: ${manifestPath}`);
}

main().catch((e) => {
  console.error("Import failed:", e);
  process.exit(1);
});
