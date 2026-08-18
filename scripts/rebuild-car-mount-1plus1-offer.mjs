/**
 * Rebuild the 1+1 offer image at native 2000px from the original product photo
 * with sharp SVG text (no upscaled 1024px overlays).
 * Usage: node scripts/rebuild-car-mount-1plus1-offer.mjs
 */
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const PUBLIC = path.join(ROOT, "public");
const SLUG = "magnetic-car-phone-holder-1-plus-1";
const OUT = path.join(PUBLIC, "products", SLUG);
const SIZE = 2000;

const ORIGINAL_PNG = path.join(OUT, "product-reference.png");
const ORIGINAL_JPG = path.join(
  PUBLIC,
  "products/magnetic-car-phone-mount-maidsail/01-hero-white-bg.jpg"
);
const FONT_BOLD = "C:/Windows/Fonts/segoeuib.ttf";
const FONT_REG = "C:/Windows/Fonts/segoeui.ttf";

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

  await sharp(inputBuffer).jpeg({ quality: 95, mozjpeg: true }).toFile(originalPath);
  await sharp(inputBuffer).webp({ quality: 92, effort: 4 }).toFile(webpPath);
  await sharp(inputBuffer).avif({ quality: 85, effort: 4 }).toFile(avifPath);
  await sharp(inputBuffer).resize(400, 400, { fit: "inside" }).webp({ quality: 86 }).toFile(thumbPath);
  await sharp(inputBuffer).resize(640, 640, { fit: "inside" }).webp({ quality: 90 }).toFile(smPath);
  await sharp(inputBuffer).resize(1280, 1280, { fit: "inside" }).webp({ quality: 90 }).toFile(mdPath);
  await sharp(inputBuffer).resize(2000, 2000, { fit: "inside" }).webp({ quality: 92 }).toFile(lgPath);

  const rel = (p) => "/" + path.relative(PUBLIC, p).replace(/\\/g, "/");
  return {
    original: rel(originalPath),
    webp: rel(webpPath),
    avif: rel(avifPath),
    thumbnail: rel(thumbPath),
    responsive: { sm: rel(smPath), md: rel(mdPath), lg: rel(lgPath) },
  };
}

function svgBuffer(svg) {
  return Buffer.from(svg);
}

async function fontFace(family, fontPath) {
  const buf = await fs.readFile(fontPath);
  return `@font-face{font-family:'${family}';src:url('data:font/ttf;base64,${buf.toString("base64")}') format('truetype');}`;
}

async function extractRealUnit(sourcePath) {
  const cropped = await sharp(sourcePath)
    .extract({ left: 700, top: 40, width: 1280, height: 1920 })
    .toBuffer();
  return sharp(cropped)
    .trim({ background: "#ffffff", threshold: 14 })
    .resize(980, 1480, { fit: "inside", background: "#ffffff", withoutEnlargement: false })
    .png({ compressionLevel: 6 })
    .toBuffer();
}

async function buildOfferComposite(unitPng, css) {
  const unitMeta = await sharp(unitPng).metadata();
  const targetH = 1380;
  const scale = targetH / unitMeta.height;
  const rw = Math.round(unitMeta.width * scale);
  const resized = await sharp(unitPng).resize(rw, targetH, { fit: "fill" }).png().toBuffer();

  const gap = 36;
  const leftX = Math.round(SIZE / 2 - gap / 2 - rw);
  const rightX = Math.round(SIZE / 2 + gap / 2);
  const unitY = 268;

  const overlay = svgBuffer(`<svg width="${SIZE}" height="${SIZE}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <style type="text/css">${css}
        .n{font-family:'ArBold';font-weight:700}
        .r{font-family:'ArReg'}
      </style>
    </defs>
    <text x="1000" y="168" text-anchor="middle" class="n" font-size="148" fill="#111111">1 + 1</text>
    <g transform="translate(1548,28)">
      <path d="M36 22 C36 8 52 2 70 10 C88 2 104 8 104 22 C104 38 88 46 70 58 C52 46 36 38 36 22Z" fill="#d4a017"/>
      <rect x="18" y="48" width="176" height="118" rx="18" fill="#1f6b3a" stroke="#d4a017" stroke-width="6"/>
      <text x="106" y="124" text-anchor="middle" class="n" font-size="44" fill="#fff8e7">مجاناً</text>
    </g>
    <rect x="0" y="1788" width="2000" height="212" fill="#1b3b6b"/>
    <text x="1000" y="1924" text-anchor="middle" class="n" font-size="64" fill="#ffffff">اشتر 1 واحصل على 1 مجاناً</text>
  </svg>`);

  return sharp({
    create: { width: SIZE, height: SIZE, channels: 3, background: "#ffffff" },
  })
    .composite([
      { input: resized, left: Math.max(24, leftX), top: unitY },
      { input: resized, left: Math.min(SIZE - rw - 24, rightX), top: unitY },
      { input: overlay, left: 0, top: 0 },
    ])
    .jpeg({ quality: 95, mozjpeg: true })
    .toBuffer();
}

async function main() {
  await fs.mkdir(OUT, { recursive: true });
  const source = await fs
    .access(ORIGINAL_PNG)
    .then(() => ORIGINAL_PNG)
    .catch(() => ORIGINAL_JPG);

  const css = `${await fontFace("ArBold", FONT_BOLD)}${await fontFace("ArReg", FONT_REG)}`;
  const originalBuf = await sharp(source)
    .resize(SIZE, SIZE, { fit: "contain", background: "#ffffff" })
    .jpeg({ quality: 95, mozjpeg: true })
    .toBuffer();

  const unit = await extractRealUnit(source);
  const singleStudio = await sharp({
    create: { width: SIZE, height: SIZE, channels: 3, background: "#ffffff" },
  })
    .composite([
      {
        input: await sharp(unit).resize(1680, 1680, { fit: "inside" }).png().toBuffer(),
      },
    ])
    .jpeg({ quality: 95, mozjpeg: true })
    .toBuffer();

  const offerBuf = await buildOfferComposite(unit, css);

  const images = {
    "02-premium-hero": await optimizeImage(originalBuf, OUT, "02-premium-hero"),
    "01-hero-white-bg": await optimizeImage(singleStudio, OUT, "01-hero-white-bg"),
    "11-package-contents": await optimizeImage(offerBuf, OUT, "11-package-contents"),
  };

  const manifestPath = path.join(ROOT, "src/lib/product-images/manifest.json");
  const manifest = JSON.parse(await fs.readFile(manifestPath, "utf8"));
  const existing = manifest.products[SLUG];
  existing.images["02-premium-hero"] = images["02-premium-hero"];
  existing.images["01-hero-white-bg"] = images["01-hero-white-bg"];
  existing.images["11-package-contents"] = images["11-package-contents"];
  existing.sources["02-premium-hero"] = "client-original";
  existing.sources["01-hero-white-bg"] = "client-original";
  existing.sources["11-package-contents"] = "client-original";
  manifest.generatedAt = new Date().toISOString();
  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2) + "\n");

  console.log("Rebuilt sharp 1+1 offer from", path.relative(ROOT, source));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
