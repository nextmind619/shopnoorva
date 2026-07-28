/**
 * Optimize generated Shiatsu massager images into the product image pipeline.
 * Usage: node scripts/optimize-shiatsu-images.mjs
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
const SLUG = "shiatsu-neck-shoulder-massager";
const SKU = "NRV-SHIATSU-01";
const NAME = "Appareil de Massage Shiatsu Cou et Épaules";

const FOLDER = {
  "01-hero-white-bg": "products",
  "02-premium-hero": "products",
  "03-lifestyle": "lifestyle",
  "04-bedroom": "lifestyle",
  "05-living-room": "lifestyle",
  "06-gaming-room": "lifestyle",
  "07-romantic-room": "lifestyle",
  "08-kids-room": "lifestyle",
  "09-close-up": "products",
  "10-features": "generated",
  "11-package-contents": "products",
  "12-dimensions": "specifications",
  "13-before-after": "generated",
  "14-product-in-use": "lifestyle",
  "15-banner": "banners",
  "16-packaging": "products",
  "17-infographic": "generated",
  "18-mobile-banner": "banners",
  "19-desktop-banner": "banners",
  "20-social-media-banner": "banners",
};

const SOURCE_MAP = {
  "01-hero-white-bg": "shiatsu-v2-01-white.png",
  "02-premium-hero": "shiatsu-02-premium-hero.png",
  "03-lifestyle": "shiatsu-03-lifestyle.png",
  "04-bedroom": "shiatsu-v2-14-woman.png",
  "05-living-room": "shiatsu-05-living-room.png",
  "06-gaming-room": "shiatsu-06-healthcare.png",
  "07-romantic-room": "shiatsu-07-man-use.png",
  "08-kids-room": "shiatsu-03-lifestyle.png",
  "09-close-up": "shiatsu-v2-09-closeup.png",
  "10-features": "shiatsu-v2-09-closeup.png",
  "11-package-contents": "shiatsu-v2-16-pack.png",
  "12-dimensions": "shiatsu-v2-01-white.png",
  "13-before-after": "shiatsu-v2-14-woman.png",
  "14-product-in-use": "shiatsu-v2-14-woman.png",
  "15-banner": "shiatsu-19-desktop-banner.png",
  "16-packaging": "shiatsu-v2-16-pack.png",
  "17-infographic": "shiatsu-v2-09-closeup.png",
  "18-mobile-banner": "shiatsu-02-premium-hero.png",
  "19-desktop-banner": "shiatsu-19-desktop-banner.png",
  "20-social-media-banner": "shiatsu-v2-01-white.png",
};

async function optimizeImage(inputBuffer, outDir, baseName, width = 2000, height = 2000) {
  await fs.mkdir(path.join(outDir, "thumbs"), { recursive: true });
  await fs.mkdir(path.join(outDir, "responsive"), { recursive: true });

  const resized = await sharp(inputBuffer)
    .rotate()
    .resize(width, height, { fit: "cover", position: "centre" })
    .toBuffer();

  const originalPath = path.join(outDir, `${baseName}.jpg`);
  const webpPath = path.join(outDir, `${baseName}.webp`);
  const avifPath = path.join(outDir, `${baseName}.avif`);
  const thumbPath = path.join(outDir, "thumbs", `${baseName}-400.webp`);
  const smPath = path.join(outDir, "responsive", `${baseName}-640.webp`);
  const mdPath = path.join(outDir, "responsive", `${baseName}-1280.webp`);
  const lgPath = path.join(outDir, "responsive", `${baseName}-2000.webp`);

  await sharp(resized).jpeg({ quality: 92, mozjpeg: true }).toFile(originalPath);
  await sharp(resized).webp({ quality: 88, effort: 4 }).toFile(webpPath);
  await sharp(resized).avif({ quality: 80, effort: 4 }).toFile(avifPath);
  await sharp(resized).resize(400, 400, { fit: "inside" }).webp({ quality: 82 }).toFile(thumbPath);
  await sharp(resized).resize(640, 640, { fit: "inside" }).webp({ quality: 85 }).toFile(smPath);
  await sharp(resized).resize(1280, 1280, { fit: "inside" }).webp({ quality: 85 }).toFile(mdPath);
  await sharp(resized).resize(2000, 2000, { fit: "inside" }).webp({ quality: 85 }).toFile(lgPath);

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
  const images = {};
  for (const [type, file] of Object.entries(SOURCE_MAP)) {
    const srcPath = path.join(ASSETS, file);
    const folder = FOLDER[type];
    const outDir = path.join(PUBLIC, folder, SLUG);
    await fs.mkdir(outDir, { recursive: true });
    const buf = await fs.readFile(srcPath);
    const isBanner = type.includes("banner") && type !== "20-social-media-banner";
    const w = type === "19-desktop-banner" || type === "15-banner" ? 2560 : type === "18-mobile-banner" ? 1080 : 2000;
    const h = type === "19-desktop-banner" || type === "15-banner" ? 800 : type === "18-mobile-banner" ? 1920 : 2000;
    console.log(`Optimizing ${type}...`);
    images[type] = await optimizeImage(buf, outDir, type, isBanner ? w : 2000, isBanner ? h : 2000);
  }

  const manifestPath = path.join(ROOT, "src/lib/product-images/manifest.json");
  const manifest = JSON.parse(await fs.readFile(manifestPath, "utf8"));
  manifest.generatedAt = new Date().toISOString();
  manifest.products[SLUG] = {
    slug: SLUG,
    sku: SKU,
    name: NAME,
    images,
    prompts: {},
    sources: Object.fromEntries(Object.keys(SOURCE_MAP).map((k) => [k, "ai-generated"])),
  };
  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));
  console.log(`✓ Manifest updated for ${SLUG} (${Object.keys(images).length} images)`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
