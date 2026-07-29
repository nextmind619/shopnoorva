/**
 * Optimize portable dual-fan air cooler reference image.
 * Usage: node scripts/optimize-dual-fan-cooler-images.mjs
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
  ".cursor/projects/c-Users-admin-tmp-shopnoorva-rabbit/assets/c__Users_admin_AppData_Roaming_Cursor_User_workspaceStorage_20fa50bb1ae1d39b0ebfd5bed5341b9e_images_1783557401696-H4291bbdb08e64ec5b06843958ce9650cm-d4b87d66-b196-4be4-8804-c6a739ab97b6.png"
);
const SLUG = "portable-rechargeable-dual-fan-air-cooler";
const SKU = "NRV-DUALCOOL-01";
const NAME = "Portable Rechargeable Dual-Fan Air Cooler";

const PRODUCT_TYPES = ["01-hero-white-bg", "02-premium-hero", "09-close-up", "10-features", "14-product-in-use"];

async function optimizeImage(inputBuffer, outDir, baseName, width = 2000, height = 2000, bg = { r: 255, g: 255, b: 255 }) {
  await fs.mkdir(path.join(outDir, "thumbs"), { recursive: true });
  await fs.mkdir(path.join(outDir, "responsive"), { recursive: true });

  const resized = await sharp(inputBuffer)
    .rotate()
    .resize(width, height, { fit: "contain", background: bg })
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

  const refCopy = path.join(outDir, "ref-source.png");
  await fs.copyFile(SOURCE, refCopy);

  const images = {};
  const lightBlue = { r: 230, g: 245, b: 255 };

  for (const type of PRODUCT_TYPES) {
    const folder = type === "14-product-in-use" ? path.join(PUBLIC, "lifestyle", SLUG) : outDir;
    await fs.mkdir(folder, { recursive: true });
    console.log(`Optimizing ${type}...`);
    const bg = type === "10-features" ? lightBlue : { r: 255, g: 255, b: 255 };
    images[type] = await optimizeImage(buf, folder, type, 2000, 2000, bg);
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
  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));
  console.log(`Manifest updated for ${SLUG}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
