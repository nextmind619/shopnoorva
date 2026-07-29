/**
 * Import foldable mosquito bed tent reference photo.
 * Usage: node scripts/import-mosquito-bed-tent-photos.mjs
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
  ".cursor/projects/c-Users-admin-tmp-shopnoorva-rabbit/assets/c__Users_admin_AppData_Roaming_Cursor_User_workspaceStorage_20fa50bb1ae1d39b0ebfd5bed5341b9e_images_1784033529423-ChatGPT_Image_Jul_14__2026__01_52_00_PM-d685f148-c6e2-45fc-945f-279c26f976cc.png"
);
const SLUG = "foldable-mosquito-bed-tent";
const SKU = "NRV-MOSQUITO-01";
const NAME = "Foldable Mosquito Protection Bed Tent";

const PRODUCT_TYPES = ["01-hero-white-bg", "02-premium-hero", "09-close-up", "10-features", "14-product-in-use"];

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
  const buf = await fs.readFile(SOURCE);
  const outDir = path.join(PUBLIC, "products", SLUG);
  await fs.mkdir(outDir, { recursive: true });

  const images = {};
  for (const type of PRODUCT_TYPES) {
    const folder = type === "14-product-in-use" ? path.join(PUBLIC, "lifestyle", SLUG) : outDir;
    await fs.mkdir(folder, { recursive: true });
    console.log(`Optimizing ${type}...`);
    images[type] = await optimizeImage(buf, folder, type);
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
    sources: Object.fromEntries(PRODUCT_TYPES.map((k) => [k, "commercial"])),
  };
  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
  console.log("Done:", SLUG);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
