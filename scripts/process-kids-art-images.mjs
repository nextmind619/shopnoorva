/**
 * Optimize generated kids-art-set images into public/ + update manifest.
 * Usage: node scripts/process-kids-art-images.mjs
 */
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const PUBLIC = path.join(ROOT, "public");
const ASSET_DIRS = [
  path.join("C:", "Users", "admin", ".cursor", "projects", "c-Users-admin-tmp-shopnoorva-rabbit", "assets"),
  path.join(ROOT, "assets"),
];
const SLUG = "kids-art-set-easel-208";

const MANIFEST_JOBS = [
  { file: "product-reference.jpg", from: "public", type: "02-premium-hero", folder: "products" },
  { file: "kids-art-01-hero-white-bg.png", from: "cursor-assets", type: "01-hero-white-bg", folder: "products" },
  { file: "kids-art-09-close-up.png", from: "cursor-assets", type: "09-close-up", folder: "products" },
  { file: "kids-art-10-features.png", from: "cursor-assets", type: "10-features", folder: "products" },
  { file: "kids-art-16-closed-case.png", from: "cursor-assets", type: "11-package-contents", folder: "products" },
  { file: "kids-art-16-closed-case.png", from: "cursor-assets", type: "16-packaging", folder: "products" },
  { file: "kids-art-03-lifestyle.png", from: "cursor-assets", type: "03-lifestyle", folder: "lifestyle" },
  { file: "kids-art-08-kids-room.png", from: "cursor-assets", type: "08-kids-room", folder: "lifestyle" },
  { file: "kids-art-14-in-use.png", from: "cursor-assets", type: "14-product-in-use", folder: "lifestyle" },
  { file: "kids-art-20-social.png", from: "cursor-assets", type: "20-social-media-banner", folder: "banners" },
];

/** Scene images tied to landing/how-to Arabic captions — stored outside manifest types */
const CUSTOM_JOBS = [
  { file: "kids-art-howto-01-open-bag.png", from: "cursor-assets", type: "howto-01-open-bag", folder: "products" },
  { file: "kids-art-howto-02-clip-paper.png", from: "cursor-assets", type: "howto-02-clip-paper", folder: "products" },
  { file: "kids-art-howto-03-choose-tool.png", from: "cursor-assets", type: "howto-03-choose-tool", folder: "products" },
  { file: "kids-art-howto-04-fold-close.png", from: "cursor-assets", type: "howto-04-fold-close", folder: "products" },
  { file: "kids-art-landing-drawing.png", from: "cursor-assets", type: "landing-drawing", folder: "products" },
  { file: "kids-art-landing-kids-room.png", from: "cursor-assets", type: "landing-kids-room", folder: "products" },
];

async function resolveSrc(job) {
  if (job.from === "public") {
    return path.join(PUBLIC, "products", SLUG, job.file);
  }
  for (const dir of ASSET_DIRS) {
    const candidate = path.join(dir, job.file);
    try {
      await fs.access(candidate);
      return candidate;
    } catch {
      /* try next */
    }
  }
  return null;
}

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

  const resized = sharp(inputBuffer).rotate().resize(2000, 2000, { fit: "inside", withoutEnlargement: false });
  const buf = await resized.jpeg({ quality: 92, mozjpeg: true }).toBuffer();

  await sharp(buf).jpeg({ quality: 92, mozjpeg: true }).toFile(originalPath);
  await sharp(buf).webp({ quality: 88, effort: 4 }).toFile(webpPath);
  await sharp(buf).avif({ quality: 80, effort: 4 }).toFile(avifPath);
  await sharp(buf).resize(400, 400, { fit: "inside", withoutEnlargement: true }).webp({ quality: 82 }).toFile(thumbPath);
  await sharp(buf).resize(640, 640, { fit: "inside", withoutEnlargement: false }).webp({ quality: 85 }).toFile(smPath);
  await sharp(buf).resize(1280, 1280, { fit: "inside", withoutEnlargement: false }).webp({ quality: 85 }).toFile(mdPath);
  await sharp(buf).resize(2000, 2000, { fit: "inside", withoutEnlargement: false }).webp({ quality: 85 }).toFile(lgPath);

  const rel = (p) => "/" + path.relative(PUBLIC, p).replace(/\\/g, "/");
  return {
    original: rel(originalPath),
    webp: rel(webpPath),
    avif: rel(avifPath),
    thumbnail: rel(thumbPath),
    responsive: { sm: rel(smPath), md: rel(mdPath), lg: rel(lgPath) },
  };
}

async function processJob(job, images, sources, writeManifest) {
  const src = await resolveSrc(job);
  if (!src) {
    console.error(`Missing: ${job.file}`);
    return;
  }

  const outDir = path.join(PUBLIC, job.folder, SLUG);
  await fs.mkdir(outDir, { recursive: true });
  const buf = await fs.readFile(src);
  console.log(`→ ${job.type} from ${path.basename(src)}`);
  const optimized = await optimizeImage(buf, outDir, job.type);
  if (writeManifest) {
    images[job.type] = optimized;
    sources[job.type] = job.type === "02-premium-hero" ? "client-reference" : "ai-generated";
  }
}

async function main() {
  const images = {};
  const sources = {};

  for (const job of MANIFEST_JOBS) {
    await processJob(job, images, sources, true);
  }
  for (const job of CUSTOM_JOBS) {
    await processJob(job, images, sources, false);
  }

  const manifestPath = path.join(ROOT, "src/lib/product-images/manifest.json");
  const manifest = JSON.parse(await fs.readFile(manifestPath, "utf-8"));
  manifest.generatedAt = new Date().toISOString();
  manifest.products[SLUG] = {
    slug: SLUG,
    sku: "Kids-Art-Set-208",
    name: "208-Piece Kids Art Set with Pop-up Easel",
    images,
    prompts: {},
    sources,
  };
  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));
  console.log("Manifest updated.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
