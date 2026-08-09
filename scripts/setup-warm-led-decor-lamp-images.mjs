/**
 * Copy reference image into public/ and build manifest entries.
 * Usage: node scripts/setup-warm-led-decor-lamp-images.mjs
 */

import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const PUBLIC = path.join(ROOT, "public");

const SLUG = "warm-led-decor-lamp";
const SKU = "Warm-LED-Decor-Lamp";

const REFERENCE = path.join(
  ROOT,
  "public/products/warm-led-decor-lamp/product-reference.png",
);

const IMAGE_MAP = [
  { type: "02-premium-hero", folder: "products" },
  { type: "04-bedroom", folder: "lifestyle" },
  { type: "09-close-up", folder: "products" },
  { type: "05-living-room", folder: "lifestyle" },
  { type: "14-product-in-use", folder: "lifestyle" },
  { type: "07-romantic-room", folder: "lifestyle" },
  { type: "10-features", folder: "products" },
];

async function optimizeImage(inputBuffer, outDir, baseName) {
  const originalPath = path.join(outDir, `${baseName}.jpg`);
  const webpPath = path.join(outDir, `${baseName}.webp`);
  const avifPath = path.join(outDir, `${baseName}.avif`);
  const thumbPath = path.join(outDir, "thumbs", `${baseName}-400.webp`);
  const smPath = path.join(outDir, "responsive", `${baseName}-640.webp`);
  const mdPath = path.join(outDir, "responsive", `${baseName}-1280.webp`);
  const lgPath = path.join(outDir, "responsive", `${baseName}-2000.webp`);

  await fs.mkdir(path.join(outDir, "thumbs"), { recursive: true });
  await fs.mkdir(path.join(outDir, "responsive"), { recursive: true });

  await sharp(inputBuffer).rotate().jpeg({ quality: 92, mozjpeg: true }).toFile(originalPath);
  await sharp(inputBuffer).rotate().webp({ quality: 88, effort: 4 }).toFile(webpPath);
  await sharp(inputBuffer).rotate().avif({ quality: 80, effort: 4 }).toFile(avifPath);
  await sharp(inputBuffer)
    .rotate()
    .resize(400, 400, { fit: "inside", withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(thumbPath);

  for (const [size, p] of [
    [640, smPath],
    [1280, mdPath],
    [2000, lgPath],
  ]) {
    await sharp(inputBuffer)
      .rotate()
      .resize(size, size, { fit: "inside", withoutEnlargement: false })
      .webp({ quality: 85 })
      .toFile(p);
  }

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
  const refDir = path.dirname(REFERENCE);
  await fs.mkdir(refDir, { recursive: true });

  const assetsRef =
    "C:/Users/admin/.cursor/projects/c-Users-admin-tmp-shopnoorva-rabbit/assets/c__Users_admin_AppData_Roaming_Cursor_User_workspaceStorage_20fa50bb1ae1d39b0ebfd5bed5341b9e_images_1783819373027-H0ba8e75fc38343658a0761f447c9c126S-a1594d32-6dc7-4776-9b8c-03943561bc6a.png";

  let refBuf;
  try {
    refBuf = await fs.readFile(REFERENCE);
  } catch {
    refBuf = await fs.readFile(assetsRef);
    await fs.writeFile(REFERENCE, refBuf);
    console.log("✓ Copied product reference");
  }

  const productManifest = {
    slug: SLUG,
    sku: SKU,
    name: "Warm LED Decor Lamp",
    images: {},
    prompts: {},
    sources: {},
  };

  for (const { type, folder } of IMAGE_MAP) {
    const outDir = path.join(PUBLIC, folder, SLUG);
    await fs.mkdir(outDir, { recursive: true });
    console.log(`✓ Optimizing ${type}...`);
    productManifest.images[type] = await optimizeImage(refBuf, outDir, type);
    productManifest.sources[type] = "client-reference";
  }

  const manifestPath = path.join(ROOT, "src/lib/product-images/manifest.json");
  const manifest = JSON.parse(await fs.readFile(manifestPath, "utf8"));
  manifest.products[SLUG] = productManifest;
  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
  console.log(`\n✅ Manifest updated for ${SLUG}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
