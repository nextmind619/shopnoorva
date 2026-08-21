/**
 * Optimize solar helicopter car air freshener reference image.
 * Usage: node scripts/optimize-heli-freshener-images.mjs
 */
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const PUBLIC = path.join(ROOT, "public");
const SOURCE = path.join(
  process.env.USERPROFILE || "",
  ".cursor/projects/c-Users-admin-tmp-shopnoorva-rabbit/assets/c__Users_admin_AppData_Roaming_Cursor_User_workspaceStorage_20fa50bb1ae1d39b0ebfd5bed5341b9e_images_1783596901395-13_a3ep_ff__2___1_-455bb478-2b7c-4a5a-ad9d-01c117355fc3.png"
);
const SLUG = "solar-helicopter-car-air-freshener";
const SKU = "Car-air-freshener";
const NAME = "Solar Helicopter Car Air Freshener";

async function writeSet(inputBuffer, outDir, baseName, width, height, fit = "cover") {
  await fs.mkdir(path.join(outDir, "thumbs"), { recursive: true });
  await fs.mkdir(path.join(outDir, "responsive"), { recursive: true });

  const resized = await sharp(inputBuffer)
    .rotate()
    .resize(width, height, { fit, position: "centre", background: { r: 255, g: 255, b: 255 } })
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
  await sharp(resized).resize(Math.min(640, width), Math.min(640, height), { fit: "inside" }).webp({ quality: 85 }).toFile(smPath);
  await sharp(resized).resize(Math.min(1280, width), Math.min(1280, height), { fit: "inside" }).webp({ quality: 85 }).toFile(mdPath);
  await sharp(resized).resize(width, height, { fit: "inside" }).webp({ quality: 85 }).toFile(lgPath);

  const rel = (p) => "/" + path.relative(PUBLIC, p).replace(/\\/g, "/");
  return {
    original: rel(originalPath),
    webp: rel(webpPath),
    avif: rel(avifPath),
    thumbnail: rel(thumbPath),
    responsive: { sm: rel(smPath), md: rel(mdPath), lg: rel(lgPath) },
  };
}

async function zoomCrop(buf, zoom = 1.55, yShift = -0.04) {
  const meta = await sharp(buf).metadata();
  const w = meta.width || 2000;
  const h = meta.height || 2000;
  const cropW = Math.round(w / zoom);
  const cropH = Math.round(h / zoom);
  const left = Math.max(0, Math.round((w - cropW) / 2));
  const top = Math.max(0, Math.round((h - cropH) / 2 + h * yShift));
  const extractTop = Math.min(top, h - cropH);
  return sharp(buf)
    .extract({ left, top: extractTop, width: cropW, height: Math.min(cropH, h - extractTop) })
    .toBuffer();
}

async function main() {
  const buf = await fs.readFile(SOURCE);
  const productDir = path.join(PUBLIC, "products", SLUG);
  const lifestyleDir = path.join(PUBLIC, "lifestyle", SLUG);
  const bannerDir = path.join(PUBLIC, "banners", SLUG);
  await fs.mkdir(productDir, { recursive: true });
  await fs.mkdir(lifestyleDir, { recursive: true });
  await fs.mkdir(bannerDir, { recursive: true });

  await fs.copyFile(SOURCE, path.join(productDir, "product-reference.png"));
  await fs.copyFile(SOURCE, path.join(productDir, "ref-source.png"));

  const closeUpBuf = await zoomCrop(buf, 1.7, -0.06);
  const images = {};

  console.log("Optimizing 02-premium-hero...");
  images["02-premium-hero"] = await writeSet(buf, productDir, "02-premium-hero", 2000, 2000);

  console.log("Optimizing 01-hero-white-bg...");
  images["01-hero-white-bg"] = await writeSet(buf, productDir, "01-hero-white-bg", 2000, 2000);

  console.log("Optimizing 09-close-up...");
  images["09-close-up"] = await writeSet(closeUpBuf, productDir, "09-close-up", 2000, 2000);

  console.log("Optimizing 10-features...");
  images["10-features"] = await writeSet(closeUpBuf, productDir, "10-features", 2000, 2000);

  console.log("Optimizing 03-lifestyle...");
  images["03-lifestyle"] = await writeSet(buf, lifestyleDir, "03-lifestyle", 2000, 2000);

  console.log("Optimizing 14-product-in-use...");
  images["14-product-in-use"] = await writeSet(buf, lifestyleDir, "14-product-in-use", 2000, 2000);

  console.log("Optimizing 20-social-media-banner...");
  images["20-social-media-banner"] = await writeSet(buf, bannerDir, "20-social-media-banner", 1200, 1200);

  const manifestPath = path.join(ROOT, "src/lib/product-images/manifest.json");
  const manifest = JSON.parse(await fs.readFile(manifestPath, "utf8"));
  manifest.generatedAt = new Date().toISOString();
  manifest.products[SLUG] = {
    slug: SLUG,
    sku: SKU,
    name: NAME,
    images,
    prompts: {},
    sources: Object.fromEntries(Object.keys(images).map((k) => [k, "client-reference"])),
  };
  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
  console.log(`Manifest updated for ${SLUG}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
