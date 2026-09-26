/**
 * Replace foldable-washer placeholders when sources exist in shopnoorva-foldable-washer/sources/
 * Usage: node scripts/optimize-foldable-washer-images.mjs
 */
import fs from "fs/promises";
import path from "path";
import sharp from "sharp";

const ROOT = process.cwd();
const SLUG = "foldable-9l-mini-washing-machine";
const OUT = path.join(ROOT, "public/products", SLUG);
const SRC = path.join(ROOT, "shopnoorva-foldable-washer/sources");
const MANIFEST = path.join(ROOT, "src/lib/product-images/manifest.json");

const FILES = [
  "01-hero-white-bg",
  "02-premium-hero",
  "10-features",
  "03-lifestyle",
  "14-product-in-use",
  "17-infographic",
  "gift-filtered-shower-head",
];

function rel(filePath) {
  return `/${path.relative(path.join(ROOT, "public"), filePath).replace(/\\/g, "/")}`;
}

async function optimize(inputPath, baseName) {
  await fs.mkdir(path.join(OUT, "thumbs"), { recursive: true });
  await fs.mkdir(path.join(OUT, "responsive"), { recursive: true });
  const buffer = await fs.readFile(inputPath);
  const jpg = path.join(OUT, `${baseName}.jpg`);
  const webp = path.join(OUT, `${baseName}.webp`);
  const avif = path.join(OUT, `${baseName}.avif`);
  const thumb = path.join(OUT, "thumbs", `${baseName}-400.webp`);

  await sharp(buffer).rotate().jpeg({ quality: 86, mozjpeg: true }).toFile(jpg);
  await sharp(buffer).rotate().webp({ quality: 82 }).toFile(webp);
  await sharp(buffer).rotate().avif({ quality: 62 }).toFile(avif);
  await sharp(buffer)
    .rotate()
    .resize(400, 400, { fit: "inside", withoutEnlargement: true })
    .webp({ quality: 78 })
    .toFile(thumb);

  const responsive = {};
  for (const size of [640, 1280, 2000]) {
    const file = path.join(OUT, "responsive", `${baseName}-${size}.webp`);
    await sharp(buffer)
      .rotate()
      .resize(size, size, { fit: "inside", withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(file);
    responsive[size === 640 ? "sm" : size === 1280 ? "md" : "lg"] = rel(file);
  }

  return {
    original: rel(jpg),
    webp: rel(webp),
    avif: rel(avif),
    thumbnail: rel(thumb),
    responsive,
  };
}

async function firstExisting(base) {
  for (const ext of [".jpg", ".jpeg", ".png", ".webp"]) {
    const p = path.join(SRC, `${base}${ext}`);
    try {
      await fs.access(p);
      return p;
    } catch {
      /* next */
    }
  }
  return null;
}

const manifest = JSON.parse(await fs.readFile(MANIFEST, "utf8"));
const entry = manifest.products[SLUG] ?? { images: {}, sources: {} };

for (const base of FILES) {
  const src = await firstExisting(base);
  if (!src) {
    console.warn("Skip (no source):", base);
    continue;
  }
  entry.images[base] = await optimize(src, base);
  entry.sources[base] = "upload";
  console.log("Optimized", base);
}

manifest.products[SLUG] = {
  slug: SLUG,
  sku: "NRV-FWM-01",
  name: "Foldable 9L Mini Washing Machine with Drying",
  ...entry,
};
manifest.generatedAt = new Date().toISOString();
await fs.writeFile(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");
