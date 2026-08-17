/**
 * Lock the 1+1 car mount to the client-confirmed original product photo.
 * Replaces the fake MagSafe-printed 1+1 composite with two copies of the real unit.
 * Usage: node scripts/setup-car-mount-1plus1-original.mjs
 */
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const PUBLIC = path.join(ROOT, "public");
const SLUG = "magnetic-car-phone-holder-1-plus-1";
const SKU = "Mag-Holder-2PK";
const OUT = path.join(PUBLIC, "products", SLUG);

const ORIGINAL = path.join(
  PUBLIC,
  "products/magnetic-car-phone-mount-maidsail/01-hero-white-bg.jpg"
);
const FAKE_OFFER = path.join(ROOT, "tmp/img-inspect/11-package-contents.webp.png");

async function optimizeImage(inputBuffer, outDir, baseName) {
  await fs.mkdir(path.join(outDir, "thumbs"), { recursive: true });
  await fs.mkdir(path.join(outDir, "responsive"), { recursive: true });

  const originalPath = path.join(outDir, `${baseName}.jpg`);
  const webpPath = path.join(outDir, `${baseName}.webp`);
  const avifPath = path.join(outDir, `${baseName}.avif`);
  const thumbPath = path.join(outDir, "thumbs", `${baseName}-400.webp`);
  const smPath = path.join(outDir, "responsive", `${baseName}-640.webp`);
  const mdPath = path.join(outDir, "responsive", `${baseName}-1280.webp`);
  const lgPath = path.join(outDir, "responsive", `${baseName}-2000.webp`);

  await sharp(inputBuffer).jpeg({ quality: 92, mozjpeg: true }).toFile(originalPath);
  await sharp(inputBuffer).webp({ quality: 88, effort: 4 }).toFile(webpPath);
  await sharp(inputBuffer).avif({ quality: 80, effort: 4 }).toFile(avifPath);
  await sharp(inputBuffer).resize(400, 400, { fit: "inside" }).webp({ quality: 82 }).toFile(thumbPath);
  await sharp(inputBuffer).resize(640, 640, { fit: "inside" }).webp({ quality: 85 }).toFile(smPath);
  await sharp(inputBuffer).resize(1280, 1280, { fit: "inside" }).webp({ quality: 85 }).toFile(mdPath);
  await sharp(inputBuffer).resize(2000, 2000, { fit: "inside" }).webp({ quality: 85 }).toFile(lgPath);

  const rel = (p) => "/" + path.relative(PUBLIC, p).replace(/\\/g, "/");
  return {
    original: rel(originalPath),
    webp: rel(webpPath),
    avif: rel(avifPath),
    thumbnail: rel(thumbPath),
    responsive: { sm: rel(smPath), md: rel(mdPath), lg: rel(lgPath) },
  };
}

async function extractRealUnit() {
  const cropped = await sharp(ORIGINAL)
    .extract({ left: 580, top: 70, width: 1360, height: 1860 })
    .toBuffer();
  return sharp(cropped)
    .trim({ background: "#ffffff", threshold: 14 })
    .resize(900, 1400, { fit: "inside", background: "#ffffff" })
    .png()
    .toBuffer();
}

async function buildOfferComposite(unitPng) {
  const SIZE = 2000;
  const unit = sharp(unitPng);
  const { width: uw, height: uh } = await unit.metadata();
  const targetH = 1320;
  const scale = targetH / uh;
  const rw = Math.round(uw * scale);
  const rh = targetH;
  const resized = await sharp(unitPng).resize(rw, rh, { fit: "fill" }).png().toBuffer();

  const gap = 48;
  const leftX = Math.round(SIZE / 2 - gap / 2 - rw);
  const rightX = Math.round(SIZE / 2 + gap / 2);
  const unitY = 280;

  const topHSrc = 132;
  const overlayTop = await sharp(FAKE_OFFER)
    .extract({ left: 0, top: 0, width: 1024, height: topHSrc })
    .resize(SIZE, Math.round((topHSrc * SIZE) / 1024))
    .png()
    .toBuffer();
  const badge = await sharp(FAKE_OFFER)
    .extract({ left: 730, top: 8, width: 270, height: 230 })
    .resize(420, 360, { fit: "inside" })
    .png()
    .toBuffer();
  const overlayBottom = await sharp(FAKE_OFFER)
    .extract({ left: 0, top: 900, width: 1024, height: 124 })
    .resize(SIZE, Math.round((124 * SIZE) / 1024))
    .png()
    .toBuffer();
  const bottomH = Math.round((124 * SIZE) / 1024);

  return sharp({
    create: { width: SIZE, height: SIZE, channels: 3, background: "#ffffff" },
  })
    .composite([
      { input: resized, left: leftX, top: unitY },
      { input: resized, left: rightX, top: unitY },
      { input: overlayTop, left: 0, top: 0 },
      { input: badge, left: SIZE - 460, top: 24 },
      { input: overlayBottom, left: 0, top: SIZE - bottomH },
    ])
    .jpeg({ quality: 92, mozjpeg: true })
    .toBuffer();
}

function entry(images, type) {
  return images[type];
}

async function main() {
  await fs.mkdir(OUT, { recursive: true });

  const originalBuf = await sharp(ORIGINAL).jpeg({ quality: 92, mozjpeg: true }).toBuffer();
  await fs.writeFile(path.join(OUT, "product-reference.png"), await sharp(ORIGINAL).png().toBuffer());

  const unit = await extractRealUnit();
  await fs.writeFile(path.join("tmp/img-inspect", "real-unit.png"), unit);

  const singleStudio = await sharp({
    create: { width: 2000, height: 2000, channels: 3, background: "#ffffff" },
  })
    .composite([{ input: await sharp(unit).resize(1600, 1600, { fit: "inside" }).png().toBuffer() }])
    .jpeg({ quality: 92, mozjpeg: true })
    .toBuffer();

  const offerBuf = await buildOfferComposite(unit);
  await fs.writeFile(path.join("tmp/img-inspect", "new-1plus1.jpg"), offerBuf);

  const images = {};
  images["02-premium-hero"] = await optimizeImage(originalBuf, OUT, "02-premium-hero");
  images["01-hero-white-bg"] = await optimizeImage(singleStudio, OUT, "01-hero-white-bg");
  images["11-package-contents"] = await optimizeImage(offerBuf, OUT, "11-package-contents");

  const manifestPath = path.join(ROOT, "src/lib/product-images/manifest.json");
  const manifest = JSON.parse(await fs.readFile(manifestPath, "utf8"));
  const existing = manifest.products[SLUG];
  existing.images["02-premium-hero"] = entry(images, "02-premium-hero");
  existing.images["01-hero-white-bg"] = entry(images, "01-hero-white-bg");
  existing.images["11-package-contents"] = entry(images, "11-package-contents");
  existing.sources["02-premium-hero"] = "client-original";
  existing.sources["01-hero-white-bg"] = "client-original";
  existing.sources["11-package-contents"] = "client-original";
  manifest.generatedAt = new Date().toISOString();
  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2) + "\n");

  for (const leftover of ["02-premium-hero.png", "02-premium-hero-thumb.webp", "11-package-contents.png"]) {
    await fs.unlink(path.join(OUT, leftover)).catch(() => {});
  }

  console.log("Updated original product assets for", SLUG);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
