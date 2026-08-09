/**
 * Copy generated lantern assets into public/ and build manifest entries.
 * Usage: node scripts/setup-vintage-lantern-images.mjs
 */

import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const PUBLIC = path.join(ROOT, "public");
const ASSETS = "C:/Users/admin/.cursor/projects/c-Users-admin-tmp-shopnoorva-rabbit/assets";

const SLUG = "vintage-led-lantern";
const SKU = "NRV-LANTERN-01";

const IMAGE_MAP = [
  { type: "02-premium-hero", src: "02-premium-hero.png", folder: "products" },
  { type: "01-hero-white-bg", src: "01-hero-white-bg.png", folder: "products" },
  { type: "09-close-up", src: "09-close-up.png", folder: "products" },
  { type: "10-features", src: "10-features.png", folder: "products" },
  { type: "03-lifestyle", src: "03-lifestyle.png", folder: "lifestyle" },
  { type: "05-living-room", src: "05-living-room.png", folder: "lifestyle" },
  { type: "14-product-in-use", src: "14-product-in-use.png", folder: "lifestyle" },
  { type: "07-romantic-room", src: "07-romantic-room.png", folder: "lifestyle" },
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
  const productManifest = { slug: SLUG, sku: SKU, name: "Vintage LED Lantern", images: {}, prompts: {}, sources: {} };

  for (const { type, src, folder } of IMAGE_MAP) {
    const srcPath = path.join(ASSETS, src);
    const outDir = path.join(PUBLIC, folder, SLUG);
    await fs.mkdir(outDir, { recursive: true });

    let buf;
    try {
      buf = await fs.readFile(srcPath);
    } catch {
      console.warn(`⚠ Missing ${srcPath}, skipping ${type}`);
      continue;
    }

    console.log(`✓ Optimizing ${type}...`);
    productManifest.images[type] = await optimizeImage(buf, outDir, type);
    productManifest.sources[type] = "generated-with-reference";
  }

  const manifestPath = path.join(ROOT, "src/lib/product-images/manifest.json");
  const manifest = JSON.parse(await fs.readFile(manifestPath, "utf8"));
  manifest.products[SLUG] = productManifest;
  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
  console.log(`\n✅ Manifest updated for ${SLUG}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
