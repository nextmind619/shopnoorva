/**
 * Optimize cordless mini vacuum images from the client reference and update the manifest.
 * Usage: node scripts/setup-mini-vacuum-images.mjs
 */

import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const PUBLIC = path.join(ROOT, "public");

const SLUG = "cordless-mini-vacuum-keyboard";
const SKU = "NRV-VACMINI-01";
const PRODUCT_DIR = path.join(PUBLIC, "products", SLUG);
const SIZE = 1280;

async function cropRegion(inputPath, region) {
  const meta = await sharp(inputPath).metadata();
  const width = meta.width || 1024;
  const height = meta.height || 1024;
  const left = Math.round(width * region.left);
  const top = Math.round(height * region.top);
  const cropW = Math.round(width * region.width);
  const cropH = Math.round(height * region.height);
  return sharp(inputPath)
    .extract({
      left: Math.max(0, left),
      top: Math.max(0, top),
      width: Math.min(cropW, width - left),
      height: Math.min(cropH, height - top),
    })
    .resize(SIZE, SIZE, { fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .png()
    .toBuffer();
}

async function squareFromFile(inputPath, fit = "cover") {
  return sharp(inputPath)
    .rotate()
    .resize(SIZE, SIZE, {
      fit,
      position: "centre",
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    })
    .png()
    .toBuffer();
}

async function optimizeImage(inputBuffer, outDir, baseName) {
  const originalPath = path.join(outDir, `${baseName}.jpg`);
  const webpPath = path.join(outDir, `${baseName}.webp`);
  const avifPath = path.join(outDir, `${baseName}.avif`);
  const thumbPath = path.join(outDir, "thumbs", `${baseName}-400.webp`);
  const smPath = path.join(outDir, "responsive", `${baseName}-640.webp`);
  const mdPath = path.join(outDir, "responsive", `${baseName}-1280.webp`);
  const lgPath = path.join(outDir, "responsive", `${baseName}-2000.webp`);

  await fs.mkdir(path.join(outDir, "thumbs"), { recursive: true });
  await fs.mkdir(path.join(outDir, "responsive"), { recursive: true });

  const square = await sharp(inputBuffer)
    .rotate()
    .resize(SIZE, SIZE, { fit: "cover", position: "centre" })
    .toBuffer();

  await sharp(square).jpeg({ quality: 86, mozjpeg: true }).toFile(originalPath);
  await sharp(square).webp({ quality: 82, effort: 4 }).toFile(webpPath);
  await sharp(square).avif({ quality: 62, effort: 3 }).toFile(avifPath);
  await sharp(square).resize(400, 400, { fit: "cover" }).webp({ quality: 78 }).toFile(thumbPath);
  await sharp(square).resize(640, 640, { fit: "cover" }).webp({ quality: 80 }).toFile(smPath);
  await sharp(square).webp({ quality: 82 }).toFile(mdPath);
  await fs.copyFile(mdPath, lgPath);

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
  await fs.mkdir(PRODUCT_DIR, { recursive: true });
  const refPath = path.join(PRODUCT_DIR, "product-reference.png");

  const full = await squareFromFile(refPath, "cover");
  const inUse = await cropRegion(refPath, { left: 0, top: 0, width: 0.78, height: 0.82 });
  const accessories = await cropRegion(refPath, { left: 0.62, top: 0.58, width: 0.38, height: 0.42 });
  const closeUp = await cropRegion(refPath, { left: 0.08, top: 0.18, width: 0.62, height: 0.55 });
  const whiteHero = await cropRegion(refPath, { left: 0.02, top: 0.12, width: 0.7, height: 0.72 });

  const IMAGE_MAP = [
    { type: "02-premium-hero", folder: "products", buffer: full },
    { type: "01-hero-white-bg", folder: "products", buffer: whiteHero },
    { type: "09-close-up", folder: "products", buffer: closeUp },
    { type: "10-features", folder: "products", buffer: full },
    { type: "11-package-contents", folder: "products", buffer: accessories },
    { type: "03-lifestyle", folder: "lifestyle", buffer: inUse },
    { type: "14-product-in-use", folder: "lifestyle", buffer: inUse },
    { type: "20-social-media-banner", folder: "banners", buffer: full },
  ];

  const productManifest = {
    slug: SLUG,
    sku: SKU,
    name: "Cordless Mini Vacuum Keyboard Duster",
    images: {},
    prompts: {},
    sources: {},
  };

  for (const { type, folder, buffer } of IMAGE_MAP) {
    const outDir = path.join(PUBLIC, folder, SLUG);
    await fs.mkdir(outDir, { recursive: true });
    console.log(`Optimizing ${type}...`);
    productManifest.images[type] = await optimizeImage(buffer, outDir, type);
    productManifest.sources[type] = "client-reference";
  }

  const manifestPath = path.join(ROOT, "src/lib/product-images/manifest.json");
  const manifest = JSON.parse(await fs.readFile(manifestPath, "utf8"));
  manifest.generatedAt = new Date().toISOString();
  manifest.products[SLUG] = productManifest;
  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
  console.log(`Manifest updated for ${SLUG}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
