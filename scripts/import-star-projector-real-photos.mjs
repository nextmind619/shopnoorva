/**
 * Replace ALL 20 image slots for bluetooth-star-projector with the client's
 * real matte-black crystal-dome product photos (not the old aluminium cylinder AI art).
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

const CLEAN_WHITE =
  "b3d96d89-0ac1-4916-af24-e2ce837be7c9.3dba1300d4f6d7ebfb190e2018a6745b-0a50ba85-ca0b-451d-96aa-2b3d1c5199f2.png";
const MODES_FEATURE = "2 (2)-e644558f-5281-4492-883c-7a23b0d8a4c8.png";
const BT_SPEAKER = "3 (2)-a9f1678b-d1d2-45b6-903c-765f8c0c3e7b.png";
const ROMANTIC = "4 (2)-b03ca535-b444-439c-aaea-6e19cf13104f.png";
const HANDHELD_TOP = "1000074233-fa08432d-23fa-4e61-b3c7-dd769fc7e807.png";
const AURORA_BEDROOM = "1 (2)-a6598101-f1ae-4a9a-97ed-e315506cc78d.png";
const REMOTE_ACCESS = "6-66ec276b-34cc-4c4e-851c-d50587defb84.png";
const LIVING_BT =
  "ccadd2cb-368d-489f-b15c-639d1aad9d26-42aa5051-3333-49d5-a7b9-496521569e61.png";
const SLEEP_TIMER =
  "e4ec83a9-e5ca-4c4e-8721-f6ba88989dc4-ebb4d969-d96b-4660-8af7-cca2beb051db.png";
const DESK_REMOTE = "8-186c98ad-7e3c-4c2e-9bc4-a9f8c5249990.png";

const SOURCE_MAP = {
  "01-hero-white-bg": CLEAN_WHITE,
  "02-premium-hero": AURORA_BEDROOM,
  "03-lifestyle": LIVING_BT,
  "04-bedroom": AURORA_BEDROOM,
  "05-living-room": LIVING_BT,
  "06-gaming-room": REMOTE_ACCESS,
  "07-romantic-room": ROMANTIC,
  "08-kids-room": SLEEP_TIMER,
  "09-close-up": HANDHELD_TOP,
  "10-features": MODES_FEATURE,
  "11-package-contents": DESK_REMOTE,
  "12-dimensions": CLEAN_WHITE,
  "13-before-after": AURORA_BEDROOM,
  "14-product-in-use": BT_SPEAKER,
  "15-banner": AURORA_BEDROOM,
  "16-packaging": DESK_REMOTE,
  "17-infographic": SLEEP_TIMER,
  "18-mobile-banner": AURORA_BEDROOM,
  "19-desktop-banner": LIVING_BT,
  "20-social-media-banner": ROMANTIC,
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
  console.log(`Importing real photos for ${SLUG}...`);
  const manifestPath = path.join(ROOT, "src/lib/product-images/manifest.json");
  const manifest = JSON.parse(await fs.readFile(manifestPath, "utf-8"));
  const productManifest = manifest.products[SLUG] || {
    slug: SLUG,
    sku: "NRV-STARBT-01",
    name: "Bluetooth Star Projector",
    images: {},
    prompts: {},
    sources: {},
  };

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
    console.log(`  ✓ ${imageType} <- ${SOURCE_MAP[imageType]}`);
  }

  productManifest.name = "Bluetooth Crystal Dome Star Projector";
  manifest.products[SLUG] = productManifest;
  manifest.generatedAt = new Date().toISOString();
  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));
  console.log(`\nManifest updated: ${manifestPath}`);
}

main().catch((e) => {
  console.error("Import failed:", e);
  process.exit(1);
});
