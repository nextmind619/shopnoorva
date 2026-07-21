/**
 * Replace rabbit-carousel-night-light main hero with Downloads/download.jfif
 * Usage: node scripts/set-rabbit-hero-from-download.mjs
 */
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const PUBLIC = path.join(ROOT, "public");
const SLUG = "rabbit-carousel-night-light";
const SRC = "C:/Users/admin/Downloads/download.jfif";
const AMAZON_DIR = path.join(PUBLIC, "products", SLUG, "amazon-refs");

async function optimize(buffer, outDir, baseName, flattenBg) {
  await fs.mkdir(path.join(outDir, "thumbs"), { recursive: true });
  await fs.mkdir(path.join(outDir, "responsive"), { recursive: true });
  const jpg = path.join(outDir, `${baseName}.jpg`);
  const webp = path.join(outDir, `${baseName}.webp`);
  const avif = path.join(outDir, `${baseName}.avif`);
  const thumb = path.join(outDir, "thumbs", `${baseName}-400.webp`);

  let jpegPipe = sharp(buffer);
  if (flattenBg === "#ffffff") {
    jpegPipe = jpegPipe.flatten({ background: "#ffffff" });
  }
  await jpegPipe.jpeg({ quality: 92, mozjpeg: true }).toFile(jpg);
  await sharp(buffer).webp({ quality: 88 }).toFile(webp);
  await sharp(buffer).avif({ quality: 80 }).toFile(avif);
  await sharp(buffer).resize(400, 400, { fit: "inside" }).webp({ quality: 82 }).toFile(thumb);

  const responsive = {};
  for (const size of [640, 1280, 2000]) {
    const p = path.join(outDir, "responsive", `${baseName}-${size}.webp`);
    await sharp(buffer).resize(size, size, { fit: "inside" }).webp({ quality: 85 }).toFile(p);
    responsive[size === 640 ? "sm" : size === 1280 ? "md" : "lg"] =
      "/" + path.relative(PUBLIC, p).replace(/\\/g, "/");
  }
  const rel = (p) => "/" + path.relative(PUBLIC, p).replace(/\\/g, "/");
  return {
    original: rel(jpg),
    webp: rel(webp),
    avif: rel(avif),
    thumbnail: rel(thumb),
    responsive,
  };
}

async function main() {
  const meta = await sharp(SRC).metadata();
  console.log(`Source: ${meta.width}x${meta.height} ${meta.format}`);

  await fs.mkdir(AMAZON_DIR, { recursive: true });
  await sharp(SRC)
    .jpeg({ quality: 95, mozjpeg: true })
    .toFile(path.join(AMAZON_DIR, "amazon-01-hero.jpg"));

  const whiteCanvas = await sharp(SRC)
    .rotate()
    .resize(2000, 2000, {
      fit: "contain",
      background: "#ffffff",
      position: "centre",
    })
    .flatten({ background: "#ffffff" })
    .toBuffer();

  const premiumCanvas = await sharp(SRC)
    .rotate()
    .resize(2000, 2000, { fit: "cover", position: "centre" })
    .toBuffer();

  const outDir = path.join(PUBLIC, "products", SLUG);
  const manifestPath = path.join(ROOT, "src/lib/product-images/manifest.json");
  const analysisPath = path.join(ROOT, "src/lib/product-images/analysis.json");
  const manifest = JSON.parse(await fs.readFile(manifestPath, "utf8"));
  const product = manifest.products[SLUG];
  if (!product) throw new Error(`Missing product ${SLUG}`);
  product.sources = product.sources || {};

  product.images["01-hero-white-bg"] = await optimize(
    whiteCanvas,
    outDir,
    "01-hero-white-bg",
    "#ffffff",
  );
  product.sources["01-hero-white-bg"] = "user-download-jfif";
  console.log("OK 01-hero-white-bg");

  product.images["02-premium-hero"] = await optimize(
    premiumCanvas,
    outDir,
    "02-premium-hero",
  );
  product.sources["02-premium-hero"] = "user-download-jfif";
  console.log("OK 02-premium-hero");

  product.cardImage = product.images["01-hero-white-bg"].webp;
  manifest.generatedAt = new Date().toISOString();
  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));

  try {
    const analysis = JSON.parse(await fs.readFile(analysisPath, "utf8"));
    const entry = (analysis.products || []).find((p) => p.slug === SLUG);
    if (entry) {
      entry.sources = entry.sources || {};
      entry.sources["01-hero-white-bg"] = "user-download-jfif";
      entry.sources["02-premium-hero"] = "user-download-jfif";
      await fs.writeFile(analysisPath, JSON.stringify(analysis, null, 2));
    }
  } catch {
    // optional
  }

  const outMeta = await sharp(path.join(outDir, "01-hero-white-bg.jpg")).metadata();
  console.log(`Hero out: ${outMeta.width}x${outMeta.height}`);
  console.log("Done — rabbit hero replaced with download.jfif");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
