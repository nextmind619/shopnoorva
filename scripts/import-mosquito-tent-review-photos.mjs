/**
 * Import customer UGC review photos for foldable mosquito bed tent.
 * Usage: node scripts/import-mosquito-tent-review-photos.mjs
 */
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const PUBLIC = path.join(ROOT, "public");
const SLUG = "foldable-mosquito-bed-tent";

const ASSETS = path.join(
  process.env.USERPROFILE || "",
  ".cursor",
  "projects",
  "c-Users-admin-tmp-shopnoorva-rabbit",
  "assets"
);

const SOURCES = [
  { key: "614mkCzH9aL", out: "01-bedroom-floral" },
  { key: "912mATaHy7L", out: "02-carry-bag-setup" },
  { key: "61AAdwQrCgL", out: "03-door-open" },
  { key: "71JIyTSvseL", out: "04-bedroom-zip-open" },
  { key: "71TyzEXTauL", out: "05-two-tents-pack" },
  { key: "81ilciJnSAL", out: "06-kids-room" },
];

async function findAsset(prefix) {
  const names = await fs.readdir(ASSETS);
  const hit = names.find((n) => n.includes(prefix));
  if (!hit) throw new Error(`Asset not found: ${prefix}`);
  return path.join(ASSETS, hit);
}

async function optimizeReview(inputPath, outDir, baseName) {
  await fs.mkdir(outDir, { recursive: true });
  const buf = await sharp(inputPath).rotate().resize(1200, 1200, { fit: "inside", withoutEnlargement: false }).toBuffer();

  const jpg = path.join(outDir, `${baseName}.jpg`);
  const webp = path.join(outDir, `${baseName}.webp`);
  const thumb = path.join(outDir, `${baseName}-thumb.webp`);

  await sharp(buf).jpeg({ quality: 88, mozjpeg: true }).toFile(jpg);
  await sharp(buf).webp({ quality: 85 }).toFile(webp);
  await sharp(buf).resize(480, 480, { fit: "cover", position: "centre" }).webp({ quality: 82 }).toFile(thumb);

  const rel = (p) => "/" + path.relative(PUBLIC, p).replace(/\\/g, "/");
  return { jpg: rel(jpg), webp: rel(webp), thumb: rel(thumb) };
}

async function main() {
  const outDir = path.join(PUBLIC, "reviews", SLUG);
  const manifest = {};

  for (const { key, out } of SOURCES) {
    const src = await findAsset(key);
    manifest[out] = await optimizeReview(src, outDir, out);
    console.log(`  ✓ ${out}`);
  }

  console.log("\nPaths for products.ts:");
  for (const [name, paths] of Object.entries(manifest)) {
    console.log(`  ${name}: ${paths.thumb}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
