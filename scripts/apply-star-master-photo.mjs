/**
 * Lock bluetooth-star-projector to the client's confirmed REAL product photo
 * (black bowl + crystal dome + black remote + color modes strip).
 *
 * Usage: node scripts/apply-star-master-photo.mjs
 */
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const PUBLIC = path.join(ROOT, "public");
const SLUG = "bluetooth-star-projector";
const SRC_DIR =
  "C:/Users/admin/AppData/Roaming/Cursor/User/workspaceStorage/1783604483934/images";

const MASTER_PREFIX = "10f48967-57a4-41fd-82e9-fca07b315038";

const SLOTS = {
  "01-hero-white-bg": { folder: "products", width: 2000, height: 2000 },
  "02-premium-hero": { folder: "products", width: 2000, height: 2000 },
  "10-features": { folder: "generated", width: 2000, height: 2000 },
  "11-package-contents": { folder: "products", width: 2000, height: 2000 },
  "12-dimensions": { folder: "specifications", width: 2000, height: 2000 },
  "16-packaging": { folder: "products", width: 2000, height: 2000 },
  "17-infographic": { folder: "generated", width: 2000, height: 2000 },
  "20-social-media-banner": { folder: "banners", width: 1200, height: 1200 },
};

async function resolveMaster() {
  const files = await fs.readdir(SRC_DIR);
  const matches = files
    .filter((f) => f.startsWith(MASTER_PREFIX) && /\.png$/i.test(f))
    .sort((a, b) => b.length - a.length);
  if (!matches[0]) throw new Error("Master photo not found");
  return path.join(SRC_DIR, matches[0]);
}

async function optimize(buffer, outDir, baseName) {
  await fs.mkdir(path.join(outDir, "thumbs"), { recursive: true });
  await fs.mkdir(path.join(outDir, "responsive"), { recursive: true });
  const jpg = path.join(outDir, `${baseName}.jpg`);
  const webp = path.join(outDir, `${baseName}.webp`);
  const avif = path.join(outDir, `${baseName}.avif`);
  const thumb = path.join(outDir, "thumbs", `${baseName}-400.webp`);
  await sharp(buffer).flatten({ background: "#ffffff" }).jpeg({ quality: 92, mozjpeg: true }).toFile(jpg);
  await sharp(buffer).webp({ quality: 88 }).toFile(webp);
  await sharp(buffer).avif({ quality: 80 }).toFile(avif);
  await sharp(buffer).resize(400, 400, { fit: "inside" }).webp({ quality: 82 }).toFile(thumb);
  const resp = {};
  for (const size of [640, 1280, 2000]) {
    const p = path.join(outDir, "responsive", `${baseName}-${size}.webp`);
    await sharp(buffer).resize(size, size, { fit: "inside" }).webp({ quality: 85 }).toFile(p);
    resp[size === 640 ? "sm" : size === 1280 ? "md" : "lg"] =
      "/" + path.relative(PUBLIC, p).replace(/\\/g, "/");
  }
  const rel = (p) => "/" + path.relative(PUBLIC, p).replace(/\\/g, "/");
  return {
    original: rel(jpg),
    webp: rel(webp),
    avif: rel(avif),
    thumbnail: rel(thumb),
    responsive: resp,
  };
}

async function main() {
  const masterPath = await resolveMaster();
  console.log("MASTER:", path.basename(masterPath));
  const input = await fs.readFile(masterPath);
  const manifestPath = path.join(ROOT, "src/lib/product-images/manifest.json");
  const manifest = JSON.parse(await fs.readFile(manifestPath, "utf8"));
  const product = manifest.products[SLUG];
  product.name = "Multi-Color Galaxy Star Projector Night Light with Speaker & Remote";
  product.prompts = product.prompts || {};

  for (const [slot, cfg] of Object.entries(SLOTS)) {
    const outDir = path.join(PUBLIC, cfg.folder, SLUG);
    await fs.mkdir(outDir, { recursive: true });
    const canvas = await sharp(input)
      .rotate()
      .resize(cfg.width, cfg.height, { fit: "contain", background: "#ffffff" })
      .toBuffer();
    product.images[slot] = await optimize(canvas, outDir, slot);
    product.sources[slot] = "commercial";
    console.log("✓", slot);
  }

  manifest.generatedAt = new Date().toISOString();
  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));
  console.log("Done.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
