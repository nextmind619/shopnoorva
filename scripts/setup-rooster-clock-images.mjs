/**
 * Optimize rooster clock reference + lifestyle assets and update manifest.
 * Usage: node scripts/setup-rooster-clock-images.mjs
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

const REFERENCE = path.join(PUBLIC, "products", SLUG, "product-reference.jpg");

const LIFESTYLE_SOURCES = {
  "02-premium-hero": path.join(ROOT, "public/../opt/cursor/artifacts/assets/rooster-clock-hero-lifestyle.png"),
  "03-lifestyle": path.join(ROOT, "opt/cursor/artifacts/assets/rooster-clock-memory-lifestyle.png"),
  "05-living-room": path.join(ROOT, "opt/cursor/artifacts/assets/rooster-clock-living-room.png"),
  "14-product-in-use": path.join(ROOT, "opt/cursor/artifacts/assets/rooster-clock-entrance.png"),
};

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

async function readFirstExisting(paths) {
  for (const p of paths) {
    try {
      return await fs.readFile(p);
    } catch {
      /* try next */
    }
  }
  throw new Error(`No file found in: ${paths.join(", ")}`);
}

async function main() {
  const refBuf = await fs.readFile(REFERENCE);

  const artifactRoot = "/opt/cursor/artifacts/assets";
  const lifestyleMap = {
    "02-premium-hero": "rooster-clock-hero-lifestyle.png",
    "03-lifestyle": "rooster-clock-memory-lifestyle.png",
    "05-living-room": "rooster-clock-living-room.png",
    "14-product-in-use": "rooster-clock-entrance.png",
  };

  const productManifest = {
    slug: SLUG,
    sku: SKU,
    name: "Rooster Analog Table Clock",
    images: {},
    prompts: {},
    sources: {},
  };

  for (const [type, file] of Object.entries(lifestyleMap)) {
    const folder = type === "02-premium-hero" ? "products" : "lifestyle";
    const outDir = path.join(PUBLIC, folder, SLUG);
    await fs.mkdir(outDir, { recursive: true });
    const buf = await readFirstExisting([
      path.join(artifactRoot, file),
      path.join(ROOT, "opt/cursor/artifacts/assets", file),
    ]);
    console.log(`✓ Optimizing ${type}...`);
    productManifest.images[type] = await optimizeImage(buf, outDir, type);
    productManifest.sources[type] = "ai-lifestyle-reference";
  }

  for (const type of ["01-hero-white-bg", "09-close-up"]) {
    const outDir = path.join(PUBLIC, "products", SLUG);
    console.log(`✓ Optimizing ${type} from reference...`);
    productManifest.images[type] = await optimizeImage(refBuf, outDir, type);
    productManifest.sources[type] = "client-reference";
  }

  const manifestPath = path.join(ROOT, "src/lib/product-images/manifest.json");
  const manifest = JSON.parse(await fs.readFile(manifestPath, "utf8"));
  manifest.products[SLUG] = productManifest;
  manifest.generatedAt = new Date().toISOString();
  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
  console.log(`\n✅ Manifest updated for ${SLUG}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
