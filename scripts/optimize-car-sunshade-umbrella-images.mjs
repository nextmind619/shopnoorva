/**
 * Optimize foldable car windshield sunshade umbrella images.
 * Usage: node scripts/optimize-car-sunshade-umbrella-images.mjs
 */
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const PUBLIC = path.join(ROOT, "public");

const CLIENT_SRC = path.join(
  process.env.USERPROFILE || "",
  ".cursor/projects/c-Users-admin-tmp-shopnoorva-rabbit/assets/c__Users_admin_AppData_Roaming_Cursor_User_workspaceStorage_20fa50bb1ae1d39b0ebfd5bed5341b9e_images_16beda30-cc13-42c4-80de-36d4220d8ee0-d9e4c0be-9a89-4946-b682-0d42c4fd34e3.png"
);
const HIRES_SRC = path.join(
  PUBLIC,
  "products/car-dual-fan-foldable-sunshade-2in1-pack/10-features.jpg"
);

const SLUG = "foldable-car-windshield-sunshade";
const SKU = "Sun-and-heat-protection";
const NAME = "Foldable Umbrella Car Windshield Sunshade";

async function writeSet(inputBuffer, outDir, baseName, width, height, fit = "cover") {
  await fs.mkdir(path.join(outDir, "thumbs"), { recursive: true });
  await fs.mkdir(path.join(outDir, "responsive"), { recursive: true });

  const resized = await sharp(inputBuffer)
    .rotate()
    .resize(width, height, { fit, position: "centre", background: { r: 255, g: 255, b: 255 } })
    .toBuffer();

  const originalPath = path.join(outDir, `${baseName}.jpg`);
  const webpPath = path.join(outDir, `${baseName}.webp`);
  const thumbPath = path.join(outDir, "thumbs", `${baseName}-400.webp`);
  const smPath = path.join(outDir, "responsive", `${baseName}-640.webp`);
  const mdPath = path.join(outDir, "responsive", `${baseName}-1280.webp`);

  await sharp(resized).jpeg({ quality: 86, mozjpeg: true }).toFile(originalPath);
  await sharp(resized).webp({ quality: 80, effort: 3 }).toFile(webpPath);
  await sharp(resized).resize(400, 400, { fit: "inside" }).webp({ quality: 78 }).toFile(thumbPath);
  await sharp(resized).resize(Math.min(640, width), Math.min(640, height), { fit: "inside" }).webp({ quality: 80 }).toFile(smPath);
  await sharp(resized).resize(Math.min(1280, width), Math.min(1280, height), { fit: "inside" }).webp({ quality: 80 }).toFile(mdPath);

  const rel = (p) => "/" + path.relative(PUBLIC, p).replace(/\\/g, "/");
  const webpRel = rel(webpPath);
  return {
    original: rel(originalPath),
    webp: webpRel,
    avif: webpRel,
    thumbnail: rel(thumbPath),
    responsive: { sm: rel(smPath), md: rel(mdPath), lg: webpRel },
  };
}

async function regionCrop(buf, { leftPct, topPct, widthPct, heightPct }) {
  const meta = await sharp(buf).metadata();
  const w = meta.width || 2000;
  const h = meta.height || 2000;
  const left = Math.max(0, Math.round(w * leftPct));
  const top = Math.max(0, Math.round(h * topPct));
  const width = Math.min(w - left, Math.round(w * widthPct));
  const height = Math.min(h - top, Math.round(h * heightPct));
  return sharp(buf).extract({ left, top, width, height }).toBuffer();
}

async function main() {
  let srcBuf;
  try {
    srcBuf = await fs.readFile(HIRES_SRC);
    console.log("Using 2000px sunshade graphic from 2-in-1 pack");
  } catch {
    srcBuf = await fs.readFile(CLIENT_SRC);
    console.log("Using client upload (1024px)");
  }

  const productDir = path.join(PUBLIC, "products", SLUG);
  const lifestyleDir = path.join(PUBLIC, "lifestyle", SLUG);
  const bannerDir = path.join(PUBLIC, "banners", SLUG);
  await fs.mkdir(productDir, { recursive: true });
  await fs.mkdir(lifestyleDir, { recursive: true });
  await fs.mkdir(bannerDir, { recursive: true });

  try {
    const refJpeg = path.join(productDir, "product-reference.jpg");
    await sharp(CLIENT_SRC).jpeg({ quality: 88 }).toFile(refJpeg);
  } catch {
    await sharp(srcBuf).jpeg({ quality: 88 }).toFile(path.join(productDir, "product-reference.jpg"));
  }

  const openUmbrella = await regionCrop(srcBuf, {
    leftPct: 0.08,
    topPct: 0.02,
    widthPct: 0.84,
    heightPct: 0.58,
  });
  const carInUse = await regionCrop(srcBuf, {
    leftPct: 0.28,
    topPct: 0.5,
    widthPct: 0.7,
    heightPct: 0.48,
  });
  const pouch = await regionCrop(srcBuf, {
    leftPct: 0.0,
    topPct: 0.38,
    widthPct: 0.3,
    heightPct: 0.58,
  });
  const handleClose = await regionCrop(srcBuf, {
    leftPct: 0.28,
    topPct: 0.22,
    widthPct: 0.44,
    heightPct: 0.44,
  });

  const images = {};

  console.log("02-premium-hero...");
  images["02-premium-hero"] = await writeSet(srcBuf, productDir, "02-premium-hero", 2000, 2000);

  console.log("01-hero-white-bg...");
  images["01-hero-white-bg"] = await writeSet(openUmbrella, productDir, "01-hero-white-bg", 2000, 2000, "contain");

  console.log("09-close-up...");
  images["09-close-up"] = await writeSet(handleClose, productDir, "09-close-up", 2000, 2000);

  console.log("11-package-contents...");
  images["11-package-contents"] = await writeSet(pouch, productDir, "11-package-contents", 2000, 2000, "contain");

  console.log("14-product-in-use...");
  images["14-product-in-use"] = await writeSet(carInUse, lifestyleDir, "14-product-in-use", 2000, 2000);

  images["10-features"] = images["02-premium-hero"];
  images["03-lifestyle"] = images["14-product-in-use"];
  images["20-social-media-banner"] = images["02-premium-hero"];

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
