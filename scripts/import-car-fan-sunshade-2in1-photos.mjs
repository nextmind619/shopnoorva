/**
 * Import reference photos for car dual-fan + foldable windshield sunshade 2-in-1 pack.
 * Usage: node scripts/import-car-fan-sunshade-2in1-photos.mjs
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

const SRC_BUNDLE = path.join(
  ASSETS,
  "c__Users_admin_AppData_Roaming_Cursor_User_workspaceStorage_20fa50bb1ae1d39b0ebfd5bed5341b9e_images_1783816809298-ChatGPT_Image_Jul_2_2026_09_49_28_PM-e684cd5e-0d0e-4773-a1a2-0837de25e321.png"
);
const SRC_SUNSHADE = path.join(
  ASSETS,
  "c__Users_admin_AppData_Roaming_Cursor_User_workspaceStorage_20fa50bb1ae1d39b0ebfd5bed5341b9e_images_1783598639731-0c12169f61af7bbd174be300b30669b9_hi_1__1_-234574d8-7c50-4f1f-9dcb-8ff78373a730.png"
);

const SLUG = "car-dual-fan-foldable-sunshade-2in1-pack";
const SKU = "NRV-CARFAN-SUN-01";
const NAME = "2-in-1 Pack: Dual Car Fan and Foldable Front Windshield Sunshade";

const SLOT_CONFIG = {
  "01-hero-white-bg": { src: "bundle", folder: "products" },
  "02-premium-hero": { src: "bundle", folder: "products" },
  "09-close-up": { src: "sunshade", folder: "products" },
  "10-features": { src: "sunshade", folder: "products" },
  "14-product-in-use": { src: "bundle", folder: "lifestyle" },
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
  const bundleBuf = await fs.readFile(SRC_BUNDLE);
  const sunshadeBuf = await fs.readFile(SRC_SUNSHADE);
  const buffers = { bundle: bundleBuf, sunshade: sunshadeBuf };

  const images = {};
  for (const [type, { src, folder }] of Object.entries(SLOT_CONFIG)) {
    const outDir = path.join(PUBLIC, folder, SLUG);
    await fs.mkdir(outDir, { recursive: true });
    console.log(`Optimizing ${type} (${src})...`);
    images[type] = await optimizeImage(buffers[src], outDir, type);
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
    sources: Object.fromEntries(Object.keys(SLOT_CONFIG).map((k) => [k, "commercial"])),
  };
  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
  console.log("Done:", SLUG);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
