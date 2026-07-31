/**
 * Import AI-generated dual-fan cooler image set into public/ + manifest.
 * Usage: node scripts/import-dual-fan-cooler-ai-set.mjs
 */
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const PUBLIC = path.join(ROOT, "public");
const ASSETS = path.join(
  process.env.USERPROFILE || "",
  ".cursor/projects/c-Users-admin-tmp-shopnoorva-rabbit/assets"
);

const SLUG = "portable-rechargeable-dual-fan-air-cooler";
const SKU = "NRV-DUALCOOL-01";
const NAME = "Portable Rechargeable Dual-Fan Air Cooler";

/** Generated file → premium image type + folder */
const IMPORT_MAP = [
  { file: "01-hero-white-bg.png", type: "01-hero-white-bg", folder: "products", w: 2000, h: 2000 },
  { file: "01-hero-white-bg.png", type: "02-premium-hero", folder: "products", w: 2000, h: 2000 },
  { file: "02-summer-lifestyle.png", type: "03-lifestyle", folder: "lifestyle", w: 2000, h: 2000 },
  { file: "03-bedroom-use.png", type: "04-bedroom", folder: "lifestyle", w: 2000, h: 2000 },
  { file: "07-water-tank.png", type: "05-living-room", folder: "lifestyle", w: 2000, h: 2000 },
  { file: "08-portability.png", type: "06-gaming-room", folder: "lifestyle", w: 2000, h: 2000 },
  { file: "13-social-proof.png", type: "07-romantic-room", folder: "lifestyle", w: 2000, h: 2000 },
  { file: "13-social-proof.png", type: "08-kids-room", folder: "lifestyle", w: 2000, h: 2000 },
  { file: "05-close-up.png", type: "09-close-up", folder: "products", w: 2000, h: 2000 },
  { file: "06-feature-infographic.png", type: "10-features", folder: "generated", w: 2000, h: 2000 },
  { file: "09-size-dimensions.png", type: "12-dimensions", folder: "specifications", w: 2000, h: 2000 },
  { file: "10-comparison.png", type: "13-before-after", folder: "generated", w: 2000, h: 2000 },
  { file: "04-office-use.png", type: "14-product-in-use", folder: "lifestyle", w: 2000, h: 2000 },
  { file: "12-premium-banner.png", type: "15-banner", folder: "banners", w: 2000, h: 800 },
  { file: "11-benefits-uses.png", type: "17-infographic", folder: "generated", w: 2000, h: 2000 },
  { file: "14-mobile-hero.png", type: "18-mobile-banner", folder: "banners", w: 1080, h: 1350 },
  { file: "12-premium-banner.png", type: "19-desktop-banner", folder: "banners", w: 2560, h: 800 },
  { file: "13-social-proof.png", type: "20-social-media-banner", folder: "banners", w: 1200, h: 1200 },
];

async function optimizeImage(inputBuffer, outDir, baseName, width, height) {
  await fs.mkdir(path.join(outDir, "thumbs"), { recursive: true });
  await fs.mkdir(path.join(outDir, "responsive"), { recursive: true });

  const resized = await sharp(inputBuffer)
    .rotate()
    .resize(width, height, {
      fit: "contain",
      background: { r: 255, g: 255, b: 255, alpha: 1 },
      withoutEnlargement: false,
    })
    .toBuffer();

  const originalPath = path.join(outDir, `${baseName}.jpg`);
  const webpPath = path.join(outDir, `${baseName}.webp`);
  const avifPath = path.join(outDir, `${baseName}.avif`);
  const thumbPath = path.join(outDir, "thumbs", `${baseName}-400.webp`);
  const smPath = path.join(outDir, "responsive", `${baseName}-640.webp`);
  const mdPath = path.join(outDir, "responsive", `${baseName}-1280.webp`);
  const lgPath = path.join(outDir, "responsive", `${baseName}-2000.webp`);

  await sharp(resized).jpeg({ quality: 90, mozjpeg: true }).toFile(originalPath);
  await sharp(resized).webp({ quality: 86, effort: 4 }).toFile(webpPath);
  await sharp(resized).avif({ quality: 78, effort: 3 }).toFile(avifPath);
  await sharp(resized).resize(400, 400, { fit: "inside" }).webp({ quality: 80 }).toFile(thumbPath);
  await sharp(resized).resize(640, 640, { fit: "inside" }).webp({ quality: 84 }).toFile(smPath);
  await sharp(resized).resize(1280, 1280, { fit: "inside" }).webp({ quality: 84 }).toFile(mdPath);
  await sharp(resized).resize(Math.min(2000, width), Math.min(2000, height), { fit: "inside" }).webp({ quality: 84 }).toFile(lgPath);

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
  console.log("Importing dual-fan cooler AI image set...");
  const images = {};
  const sources = {};
  const prompts = {};

  for (const item of IMPORT_MAP) {
    const src = path.join(ASSETS, item.file);
    try {
      await fs.access(src);
    } catch {
      console.log(`  ✗ missing ${item.file}`);
      continue;
    }
    const buf = await fs.readFile(src);
    const outDir = path.join(PUBLIC, item.folder, SLUG);
    await fs.mkdir(outDir, { recursive: true });
    console.log(`  → ${item.type} from ${item.file} (${item.w}×${item.h})`);
    images[item.type] = await optimizeImage(buf, outDir, item.type, item.w, item.h);
    sources[item.type] = "ai-generated";
    prompts[item.type] = { sourceFile: item.file };
  }

  // Keep a clean ref copy of the hero
  const heroSrc = path.join(ASSETS, "01-hero-white-bg.png");
  const refDir = path.join(PUBLIC, "products", SLUG);
  await fs.mkdir(refDir, { recursive: true });
  try {
    await fs.copyFile(heroSrc, path.join(refDir, "ref-ai-hero.png"));
  } catch { /* optional */ }

  const manifestPath = path.join(ROOT, "src/lib/product-images/manifest.json");
  const manifest = JSON.parse(await fs.readFile(manifestPath, "utf8"));
  manifest.generatedAt = new Date().toISOString();
  manifest.products[SLUG] = {
    slug: SLUG,
    sku: SKU,
    name: NAME,
    images,
    prompts,
    sources,
  };
  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));
  console.log(`\n✅ Imported ${Object.keys(images).length} image types`);
  console.log(`   Manifest: ${manifestPath}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
