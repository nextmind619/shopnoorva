/**
 * Optimize solar calculator images and update the product image manifest.
 * Usage: node scripts/setup-solar-calculator-images.mjs
 */

import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const PUBLIC = path.join(ROOT, "public");

const SLUG = "solar-calculator-lcd-notepad";
const SKU = "NRV-CALC-ZH70-01";
const PRODUCT_DIR = path.join(PUBLIC, "products", SLUG);

const IMAGE_MAP = [
  { type: "02-premium-hero", folder: "products", source: "cropped-original" },
  { type: "01-hero-white-bg", folder: "products", source: "src-hero-landscape.png" },
  { type: "03-lifestyle", folder: "lifestyle", source: "src-desk-landscape.png" },
  { type: "05-living-room", folder: "lifestyle", source: "src-desk-landscape.png" },
  { type: "09-close-up", folder: "products", source: "src-write-closeup.png" },
  { type: "14-product-in-use", folder: "lifestyle", source: "src-write-closeup.png" },
  { type: "10-features", folder: "products", source: "src-hero-landscape.png" },
  { type: "20-social-media-banner", folder: "banners", source: "cropped-original" },
];

async function cropOriginalNoEnglish(inputPath) {
  const meta = await sharp(inputPath).metadata();
  const width = meta.width || 1024;
  const height = meta.height || 1024;
  const top = Math.round(height * 0.2);
  const cropHeight = height - top;
  return sharp(inputPath)
    .extract({ left: 0, top, width, height: cropHeight })
    .resize(2000, 2000, { fit: "cover", position: "centre" })
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
    .resize(2000, 2000, { fit: "cover", position: "centre" })
    .toBuffer();

  await sharp(square).jpeg({ quality: 90, mozjpeg: true }).toFile(originalPath);
  await sharp(square).webp({ quality: 86, effort: 4 }).toFile(webpPath);
  await sharp(square).avif({ quality: 72, effort: 4 }).toFile(avifPath);
  await sharp(square)
    .resize(400, 400, { fit: "cover" })
    .webp({ quality: 80 })
    .toFile(thumbPath);

  for (const [size, p] of [
    [640, smPath],
    [1280, mdPath],
    [2000, lgPath],
  ]) {
    await sharp(square)
      .resize(size, size, { fit: "cover" })
      .webp({ quality: 84 })
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
  await fs.mkdir(PRODUCT_DIR, { recursive: true });
  const refPath = path.join(PRODUCT_DIR, "product-reference.png");
  const croppedOriginal = await cropOriginalNoEnglish(refPath);
  await fs.writeFile(path.join(PRODUCT_DIR, "hero-cropped.png"), croppedOriginal);

  const productManifest = {
    slug: SLUG,
    sku: SKU,
    name: "Solar Calculator LCD Notepad ZH-70",
    images: {},
    prompts: {},
    sources: {},
  };

  for (const { type, folder, source } of IMAGE_MAP) {
    const outDir = path.join(PUBLIC, folder, SLUG);
    await fs.mkdir(outDir, { recursive: true });
    const inputBuffer =
      source === "cropped-original"
        ? croppedOriginal
        : await fs.readFile(path.join(PRODUCT_DIR, source));
    console.log(`Optimizing ${type} from ${source}...`);
    productManifest.images[type] = await optimizeImage(inputBuffer, outDir, type);
    productManifest.sources[type] =
      source === "cropped-original" ? "client-reference" : "ai-generated-locked-shape";
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
