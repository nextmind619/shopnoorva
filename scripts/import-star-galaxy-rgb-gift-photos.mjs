/**
 * Import client reference photo for star-galaxy-projector-rgb-gift.
 * Usage: node scripts/import-star-galaxy-rgb-gift-photos.mjs
 */
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const PUBLIC = path.join(ROOT, "public");
const SLUG = "star-galaxy-projector-rgb-gift";
const SKU = "NRV-GALAXY-RGB-01";
const NAME = "Star & Galaxy Projection Lamp with RGB LED Strip Gift";

const SRC = path.join(
  process.env.USERPROFILE || "",
  ".cursor/projects/c-Users-admin-tmp-shopnoorva-rabbit/assets/c__Users_admin_AppData_Roaming_Cursor_User_workspaceStorage_20fa50bb1ae1d39b0ebfd5bed5341b9e_images_1784413018800-ChatGPT_Image_Jul_18__2026__11_16_01_PM-1dcbcd56-5be4-4368-a3bc-d438e7ed2bf0.png"
);

const FOLDER = {
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

/** Reuse hero composite for all slots until dedicated photos exist. */
const TYPES = Object.keys(FOLDER);

async function optimizeImage(inputBuffer, outDir, baseName, width = 2000, height = 2000) {
  await fs.mkdir(path.join(outDir, "thumbs"), { recursive: true });
  await fs.mkdir(path.join(outDir, "responsive"), { recursive: true });

  const resized = await sharp(inputBuffer)
    .rotate()
    .resize(width, height, { fit: "cover", position: "centre" })
    .toBuffer();

  const originalPath = path.join(outDir, `${baseName}.jpg`);
  const webpPath = path.join(outDir, `${baseName}.webp`);
  const avifPath = path.join(outDir, `${baseName}.avif`);
  const thumbPath = path.join(outDir, "thumbs", `${baseName}-400.webp`);
  const smPath = path.join(outDir, "responsive", `${baseName}-640.webp`);
  const mdPath = path.join(outDir, "responsive", `${baseName}-1280.webp`);
  const lgPath = path.join(outDir, "responsive", `${baseName}-2000.webp`);

  await sharp(resized).jpeg({ quality: 92, mozjpeg: true }).toFile(originalPath);
  await sharp(resized).webp({ quality: 88, effort: 4 }).toFile(webpPath);
  await sharp(resized).avif({ quality: 80, effort: 4 }).toFile(avifPath);
  await sharp(resized).resize(400, 400, { fit: "inside" }).webp({ quality: 82 }).toFile(thumbPath);
  await sharp(resized).resize(640, 640, { fit: "inside" }).webp({ quality: 85 }).toFile(smPath);
  await sharp(resized).resize(1280, 1280, { fit: "inside" }).webp({ quality: 85 }).toFile(mdPath);
  await sharp(resized).resize(2000, 2000, { fit: "inside" }).webp({ quality: 85 }).toFile(lgPath);

  const rel = (p) => "/" + path.relative(PUBLIC, p).replace(/\\/g, "/");
  return {
    original: rel(originalPath),
    webp: rel(webpPath),
    avif: rel(avifPath),
    thumbnail: rel(thumbPath),
    responsive: { sm: rel(smPath), md: rel(mdPath), lg: rel(lgPath) },
  };
}

function bannerSize(type) {
  if (type === "19-desktop-banner" || type === "15-banner") return [2560, 800];
  if (type === "18-mobile-banner") return [1080, 1920];
  if (type === "20-social-media-banner") return [1200, 1200];
  return [2000, 2000];
}

async function main() {
  const refDir = path.join(PUBLIC, "products", SLUG);
  await fs.mkdir(refDir, { recursive: true });
  const refCopy = path.join(refDir, "ref-source.png");
  const buf = await fs.readFile(SRC);
  await fs.writeFile(refCopy, buf);

  const images = {};
  for (const type of TYPES) {
    const folder = FOLDER[type];
    const outDir = path.join(PUBLIC, folder, SLUG);
    await fs.mkdir(outDir, { recursive: true });
    const [w, h] = bannerSize(type);
    console.log(`Optimizing ${type} (${w}×${h})...`);
    images[type] = await optimizeImage(buf, outDir, type, w, h);
  }

  const manifestPath = path.join(ROOT, "src/lib/product-images/manifest.json");
  const manifest = JSON.parse(await fs.readFile(manifestPath, "utf8"));
  manifest.generatedAt = new Date().toISOString();
  manifest.products[SLUG] = {
    slug: SLUG,
    sku: SKU,
    name: NAME,
    images,
    prompts: {},
    sources: Object.fromEntries(TYPES.map((k) => [k, "commercial"])),
  };
  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));
  console.log(`✓ ${SLUG}: ${TYPES.length} images + manifest updated`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
