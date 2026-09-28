/**
 * Store ALL rooster LP images under /products/ (Next.js image optimizer allows this path).
 * Usage: node scripts/fix-rooster-clock-image-paths.mjs
 */

import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const PUBLIC = path.join(ROOT, "public");
const SLUG = "rooster-analog-table-clock";
const TYPES = ["03-lifestyle", "05-living-room", "14-product-in-use"];

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
  const outDir = path.join(PUBLIC, "products", SLUG);
  const manifestPath = path.join(ROOT, "src/lib/product-images/manifest.json");
  const manifest = JSON.parse(await fs.readFile(manifestPath, "utf8"));
  const entry = manifest.products[SLUG];
  if (!entry) throw new Error("Missing manifest entry");

  for (const type of TYPES) {
    const lifestyleWebp = path.join(PUBLIC, "lifestyle", SLUG, `${type}.webp`);
    let buf;
    try {
      buf = await fs.readFile(lifestyleWebp);
    } catch {
      const legacy = entry.images[type]?.webp?.replace(/^\//, "");
      if (legacy) buf = await fs.readFile(path.join(PUBLIC, legacy));
      else throw new Error(`Missing ${type}`);
    }
    console.log(`✓ products/${SLUG}/${type}`);
    entry.images[type] = await optimizeImage(buf, outDir, type);
    entry.sources[type] = entry.sources[type] ?? "client-upload";
  }

  manifest.products[SLUG] = entry;
  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
  console.log("\n✅ Lifestyle slots now point to /products/rooster-analog-table-clock/");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
