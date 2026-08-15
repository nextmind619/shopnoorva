/**
 * Replace CGI node close-ups with real original-product photos.
 * Usage: node scripts/replace-shiatsu-cgi-closeups.mjs
 */
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const PUBLIC = path.join(ROOT, "public");
const SLUG = "shiatsu-neck-shoulder-massager";

async function writeVariants(inputBuffer, outDir, baseName) {
  await fs.mkdir(path.join(outDir, "thumbs"), { recursive: true });
  await fs.mkdir(path.join(outDir, "responsive"), { recursive: true });

  const resized = await sharp(inputBuffer)
    .rotate()
    .resize(2000, 2000, { fit: "cover", position: "centre" })
    .toBuffer();

  await sharp(resized).jpeg({ quality: 92, mozjpeg: true }).toFile(path.join(outDir, `${baseName}.jpg`));
  await sharp(resized).webp({ quality: 88, effort: 4 }).toFile(path.join(outDir, `${baseName}.webp`));
  await sharp(resized).avif({ quality: 80, effort: 4 }).toFile(path.join(outDir, `${baseName}.avif`));
  await sharp(resized).resize(400, 400, { fit: "inside" }).webp({ quality: 82 }).toFile(path.join(outDir, "thumbs", `${baseName}-400.webp`));
  await sharp(resized).resize(640, 640, { fit: "inside" }).webp({ quality: 85 }).toFile(path.join(outDir, "responsive", `${baseName}-640.webp`));
  await sharp(resized).resize(1280, 1280, { fit: "inside" }).webp({ quality: 85 }).toFile(path.join(outDir, "responsive", `${baseName}-1280.webp`));
  await sharp(resized).resize(2000, 2000, { fit: "inside" }).webp({ quality: 85 }).toFile(path.join(outDir, "responsive", `${baseName}-2000.webp`));
}

async function main() {
  const realUse = path.join(PUBLIC, "lifestyle", SLUG, "14-product-in-use.jpg");
  const realHero = path.join(PUBLIC, "products", SLUG, "01-hero-white-bg.jpg");

  const nodesCloseup = await sharp(realUse)
    .extract({ left: 500, top: 180, width: 1200, height: 1200 })
    .toBuffer();

  await writeVariants(nodesCloseup, path.join(PUBLIC, "products", SLUG), "09-close-up");
  await writeVariants(await fs.readFile(realHero), path.join(PUBLIC, "generated", SLUG), "10-features");

  const manifestPath = path.join(ROOT, "src/lib/product-images/manifest.json");
  const manifest = JSON.parse(await fs.readFile(manifestPath, "utf8"));
  const product = manifest.products[SLUG];
  if (product?.sources) {
    product.sources["09-close-up"] = "original-product-photo";
    product.sources["10-features"] = "original-product-photo";
  }
  manifest.generatedAt = new Date().toISOString();
  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));
  console.log("Replaced 09-close-up and 10-features with real product photos");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
