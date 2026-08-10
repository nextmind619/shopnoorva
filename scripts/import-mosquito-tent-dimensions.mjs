/**
 * Generate 12-dimensions infographic for foldable mosquito bed tent.
 * Usage: node scripts/import-mosquito-tent-dimensions.mjs
 */
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const PUBLIC = path.join(ROOT, "public");
const SLUG = "foldable-mosquito-bed-tent";
const SKU = "Mosquito-protection-tent";
const NAME = "Foldable Mosquito Protection Bed Tent";
const IMAGE_TYPE = "12-dimensions";

const HERO_SRC = path.join(PUBLIC, "products", SLUG, "01-hero-white-bg.jpg");
const OUT_DIR = path.join(PUBLIC, "specifications", SLUG);

const W = 2000;
const H = 2000;

function buildOverlaySvg() {
  const blue = "#2563eb";
  const text = "#1e3a8a";
  return `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <marker id="arrow" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
      <path d="M0,0 L8,4 L0,8 Z" fill="${blue}"/>
    </marker>
  </defs>
  <rect width="100%" height="100%" fill="white"/>
  <text x="100" y="120" font-family="Arial, sans-serif" font-size="52" font-weight="700" fill="${text}">المقاسات — خيمة الحماية من الناموس</text>
  <text x="100" y="180" font-family="Arial, sans-serif" font-size="34" fill="#64748b">Foldable Pop-Up Mosquito Bed Tent</text>

  <!-- dimension labels -->
  <g font-family="Arial, sans-serif" font-weight="700" fill="${blue}">
    <rect x="120" y="1680" width="280" height="72" rx="12" fill="#eff6ff" stroke="${blue}" stroke-width="3"/>
    <text x="260" y="1728" font-size="36" text-anchor="middle" fill="${text}">الطول 200 سم</text>

    <rect x="860" y="1780" width="280" height="72" rx="12" fill="#eff6ff" stroke="${blue}" stroke-width="3"/>
    <text x="1000" y="1828" font-size="36" text-anchor="middle" fill="${text}">العرض 180 سم</text>

    <rect x="1680" y="520" width="280" height="72" rx="12" fill="#eff6ff" stroke="${blue}" stroke-width="3"/>
    <text x="1820" y="568" font-size="36" text-anchor="middle" fill="${text}">الارتفاع 150 سم</text>
  </g>

  <!-- length line (bottom) -->
  <line x1="280" y1="1620" x2="1480" y2="1620" stroke="${blue}" stroke-width="5" marker-start="url(#arrow)" marker-end="url(#arrow)"/>
  <!-- width line (bottom front) -->
  <line x1="1480" y1="1620" x2="1480" y2="1320" stroke="${blue}" stroke-width="5" marker-start="url(#arrow)" marker-end="url(#arrow)"/>
  <!-- height line (right) -->
  <line x1="1560" y1="1320" x2="1560" y2="420" stroke="${blue}" stroke-width="5" marker-start="url(#arrow)" marker-end="url(#arrow)"/>

  <text x="100" y="1900" font-family="Arial, sans-serif" font-size="28" fill="#64748b">مناسبة لسرير زوجي / queen (حتى 200 × 180 سم) · مطوية في حقيبة ≈ 60 سم</text>
</svg>`;
}

async function optimizeImage(canvasBuffer, outDir, baseName) {
  await fs.mkdir(path.join(outDir, "thumbs"), { recursive: true });
  await fs.mkdir(path.join(outDir, "responsive"), { recursive: true });

  const originalPath = path.join(outDir, `${baseName}.jpg`);
  const webpPath = path.join(outDir, `${baseName}.webp`);
  const avifPath = path.join(outDir, `${baseName}.avif`);
  const thumbPath = path.join(outDir, "thumbs", `${baseName}-400.webp`);
  const smPath = path.join(outDir, "responsive", `${baseName}-640.webp`);
  const mdPath = path.join(outDir, "responsive", `${baseName}-1280.webp`);
  const lgPath = path.join(outDir, "responsive", `${baseName}-2000.webp`);

  await sharp(canvasBuffer).jpeg({ quality: 92, mozjpeg: true }).toFile(originalPath);
  await sharp(canvasBuffer).webp({ quality: 88, effort: 4 }).toFile(webpPath);
  await sharp(canvasBuffer).avif({ quality: 80, effort: 4 }).toFile(avifPath);
  await sharp(canvasBuffer).resize(400, 400, { fit: "inside" }).webp({ quality: 82 }).toFile(thumbPath);
  await sharp(canvasBuffer).resize(640, 640, { fit: "inside" }).webp({ quality: 85 }).toFile(smPath);
  await sharp(canvasBuffer).resize(1280, 1280, { fit: "inside" }).webp({ quality: 85 }).toFile(mdPath);
  await sharp(canvasBuffer).resize(2000, 2000, { fit: "inside" }).webp({ quality: 85 }).toFile(lgPath);

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
  console.log(`Generating ${IMAGE_TYPE} for ${SLUG}...`);
  await fs.mkdir(OUT_DIR, { recursive: true });

  const hero = await sharp(HERO_SRC).rotate().resize(1200, 1200, {
    fit: "contain",
    background: "#ffffff",
  }).toBuffer();

  const overlay = Buffer.from(buildOverlaySvg());
  const canvas = await sharp({
    create: { width: W, height: H, channels: 3, background: "#ffffff" },
  })
    .composite([
      { input: hero, top: 220, left: 400 },
      { input: overlay, top: 0, left: 0 },
    ])
    .jpeg({ quality: 92 })
    .toBuffer();

  const optimized = await optimizeImage(canvas, OUT_DIR, IMAGE_TYPE);

  const manifestPath = path.join(ROOT, "src/lib/product-images/manifest.json");
  const manifest = JSON.parse(await fs.readFile(manifestPath, "utf-8"));
  const productManifest = manifest.products[SLUG] || {
    slug: SLUG,
    sku: SKU,
    name: NAME,
    images: {},
    prompts: {},
    sources: {},
  };

  productManifest.images[IMAGE_TYPE] = optimized;
  productManifest.sources[IMAGE_TYPE] = "generated";
  manifest.products[SLUG] = productManifest;
  manifest.generatedAt = new Date().toISOString();
  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));
  console.log(`✓ ${IMAGE_TYPE} saved and manifest updated`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
