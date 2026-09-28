/**
 * Import user-provided rooster clock photos into product/lifestyle slots.
 * Usage: node scripts/import-rooster-clock-user-photos.mjs
 */

import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const PUBLIC = path.join(ROOT, "public");

const SLUG = "rooster-analog-table-clock";
const SKU = "Rooster-Analog-Table-Clock";

const ASSETS = "/home/ubuntu/.cursor/projects/workspace/assets";

/** source filename → { type, folder } */
const MAP = [
  { src: "62026473-fd08-46c5-b1f2-c375478a9c89.jpg", type: "01-hero-white-bg", folder: "products" },
  { src: "bef9cf5c-1fff-4d6f-bd09-b05a9c4c033b.jpg", type: "09-close-up", folder: "products" },
  { src: "5d9b8cec-855f-4dd4-8f6c-eea64f4b1389.jpg", type: "02-premium-hero", folder: "products" },
  { src: "63aad518-7a74-48ba-a6bf-fff9728ae2d6.jpg", type: "03-lifestyle", folder: "lifestyle" },
  { src: "dbc8a156-4444-4681-9fc0-595d5da84772.jpg", type: "05-living-room", folder: "lifestyle" },
  { src: "03094714-a98b-479d-a211-c849327fa717.jpg", type: "14-product-in-use", folder: "lifestyle" },
];

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

  await sharp(inputBuffer).rotate().jpeg({ quality: 92, mozjpeg: true }).toFile(originalPath);
  await sharp(inputBuffer).rotate().webp({ quality: 88, effort: 4 }).toFile(webpPath);
  await sharp(inputBuffer).rotate().avif({ quality: 80, effort: 4 }).toFile(avifPath);
  await sharp(inputBuffer)
    .rotate()
    .resize(400, 400, { fit: "inside", withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(thumbPath);

  for (const [size, p] of [
    [640, smPath],
    [1280, mdPath],
    [2000, lgPath],
  ]) {
    await sharp(inputBuffer)
      .rotate()
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
  const manifestPath = path.join(ROOT, "src/lib/product-images/manifest.json");
  const manifest = JSON.parse(await fs.readFile(manifestPath, "utf8"));
  const productManifest = manifest.products[SLUG] ?? {
    slug: SLUG,
    sku: SKU,
    name: "Rooster Analog Table Clock",
    images: {},
    prompts: {},
    sources: {},
  };

  for (const { src, type, folder } of MAP) {
    const inputPath = path.join(ASSETS, src);
    const buf = await fs.readFile(inputPath);
    const outDir = path.join(PUBLIC, folder, SLUG);
    await fs.mkdir(outDir, { recursive: true });
    console.log(`✓ ${type} ← ${src}`);
    productManifest.images[type] = await optimizeImage(buf, outDir, type);
    productManifest.sources[type] = "client-upload";
  }

  manifest.products[SLUG] = productManifest;
  manifest.generatedAt = new Date().toISOString();
  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2) + "\n");

  // Also save copies as product-reference from white-bg hero
  const refBuf = await fs.readFile(path.join(ASSETS, "62026473-fd08-46c5-b1f2-c375478a9c89.jpg"));
  await fs.writeFile(path.join(PUBLIC, "products", SLUG, "product-reference.jpg"), refBuf);

  console.log("\n✅ All 6 images imported and manifest updated.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
