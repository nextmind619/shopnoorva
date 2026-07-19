/**
 * Lock rabbit-carousel-night-light gallery to Amazon DORVOL B0H65HJYPN photos.
 * Removes dependence on old Jumia/musical product imagery.
 *
 * Usage: node scripts/apply-amazon-rabbit-photos.mjs
 */
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const PUBLIC = path.join(ROOT, "public");
const SLUG = "rabbit-carousel-night-light";
const AMAZON_DIR = path.join(PUBLIC, "products", SLUG, "amazon-refs");
const MASTER_DIR = path.join(PUBLIC, "products", SLUG, "master-refs");

const SLOTS = {
  "01-hero-white-bg": {
    source: "amazon-01-hero.jpg",
    folder: "products",
    width: 2000,
    height: 2000,
    fit: "contain",
    bg: "#ffffff",
  },
  "02-premium-hero": {
    source: "amazon-01-hero.jpg",
    folder: "products",
    width: 2000,
    height: 2000,
    fit: "cover",
    bg: "#1a1020",
  },
  "03-lifestyle": {
    source: "amazon-05-lifestyle.jpg",
    folder: "lifestyle",
    width: 2000,
    height: 2000,
    fit: "cover",
    bg: "#1a1020",
  },
  "04-bedroom": {
    source: "amazon-03-night.jpg",
    folder: "lifestyle",
    width: 2000,
    height: 2000,
    fit: "cover",
    bg: "#0a0a12",
  },
  "05-living-room": {
    source: "amazon-05-lifestyle.jpg",
    folder: "lifestyle",
    width: 2000,
    height: 2000,
    fit: "cover",
    bg: "#1a1020",
  },
  "06-gaming-room": {
    source: "amazon-03-night.jpg",
    folder: "lifestyle",
    width: 2000,
    height: 2000,
    fit: "cover",
    bg: "#0a0a12",
  },
  "07-romantic-room": {
    source: "amazon-01-hero.jpg",
    folder: "lifestyle",
    width: 2000,
    height: 2000,
    fit: "cover",
    bg: "#1a1020",
  },
  "08-kids-room": {
    source: "amazon-05-lifestyle.jpg",
    folder: "lifestyle",
    width: 2000,
    height: 2000,
    fit: "cover",
    bg: "#1a1020",
  },
  "09-close-up": {
    source: "amazon-01-hero.jpg",
    folder: "products",
    width: 2000,
    height: 2000,
    fit: "cover",
    bg: "#ffffff",
    extractRatio: { left: 0.2, top: 0.35, width: 0.6, height: 0.55 },
  },
  "10-features": {
    source: "amazon-04-howto.jpg",
    folder: "generated",
    width: 2000,
    height: 2000,
    fit: "contain",
    bg: "#12081c",
  },
  "11-package-contents": {
    source: "amazon-04-howto.jpg",
    folder: "products",
    width: 2000,
    height: 2000,
    fit: "contain",
    bg: "#ffffff",
  },
  "12-dimensions": {
    source: "amazon-02-dims.jpg",
    folder: "specifications",
    width: 2000,
    height: 2000,
    fit: "contain",
    bg: "#ffffff",
  },
  "13-before-after": {
    source: "amazon-03-night.jpg",
    folder: "generated",
    width: 2000,
    height: 2000,
    fit: "cover",
    bg: "#0a0a12",
  },
  "14-product-in-use": {
    source: "amazon-03-night.jpg",
    folder: "lifestyle",
    width: 2000,
    height: 2000,
    fit: "cover",
    bg: "#0a0a12",
  },
  "15-banner": {
    source: "amazon-01-hero.jpg",
    folder: "banners",
    width: 2400,
    height: 900,
    fit: "cover",
    bg: "#1a1020",
  },
  "16-packaging": {
    source: "amazon-04-howto.jpg",
    folder: "products",
    width: 2000,
    height: 2000,
    fit: "contain",
    bg: "#ffffff",
  },
  "17-infographic": {
    source: "amazon-02-dims.jpg",
    folder: "generated",
    width: 2000,
    height: 2000,
    fit: "contain",
    bg: "#0f0818",
  },
  "18-mobile-banner": {
    source: "amazon-01-hero.jpg",
    folder: "banners",
    width: 1080,
    height: 1920,
    fit: "cover",
    bg: "#1a1020",
  },
  "19-desktop-banner": {
    source: "amazon-05-lifestyle.jpg",
    folder: "banners",
    width: 2400,
    height: 900,
    fit: "cover",
    bg: "#1a1020",
  },
  "20-social-media-banner": {
    source: "amazon-01-hero.jpg",
    folder: "banners",
    width: 1200,
    height: 1200,
    fit: "cover",
    bg: "#1a1020",
  },
};

async function fileExists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function optimize(buffer, outDir, baseName, flattenBg) {
  await fs.mkdir(path.join(outDir, "thumbs"), { recursive: true });
  await fs.mkdir(path.join(outDir, "responsive"), { recursive: true });
  const jpg = path.join(outDir, `${baseName}.jpg`);
  const webp = path.join(outDir, `${baseName}.webp`);
  const avif = path.join(outDir, `${baseName}.avif`);
  const thumb = path.join(outDir, "thumbs", `${baseName}-400.webp`);

  let jpegPipe = sharp(buffer);
  if (flattenBg === "#ffffff") {
    jpegPipe = jpegPipe.flatten({ background: "#ffffff" });
  }
  await jpegPipe.jpeg({ quality: 92, mozjpeg: true }).toFile(jpg);
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

async function buildCanvas(inputPath, cfg) {
  let pipeline = sharp(inputPath).rotate();
  const meta = await pipeline.metadata();
  const w = meta.width || 1000;
  const h = meta.height || 1000;

  if (cfg.extractRatio) {
    const left = Math.round(w * cfg.extractRatio.left);
    const top = Math.round(h * cfg.extractRatio.top);
    const width = Math.round(w * cfg.extractRatio.width);
    const height = Math.round(h * cfg.extractRatio.height);
    pipeline = sharp(inputPath)
      .rotate()
      .extract({
        left: Math.max(0, left),
        top: Math.max(0, top),
        width: Math.min(width, w - left),
        height: Math.min(height, h - top),
      });
  }

  return pipeline
    .resize(cfg.width, cfg.height, {
      fit: cfg.fit || "contain",
      background: cfg.bg || "#ffffff",
      position: "centre",
    })
    .toBuffer();
}

async function syncMasterRefs() {
  await fs.mkdir(MASTER_DIR, { recursive: true });
  const map = [
    ["amazon-01-hero.jpg", "master-01.png"],
    ["amazon-03-night.jpg", "master-02.png"],
    ["amazon-05-lifestyle.jpg", "master-03.png"],
    ["amazon-04-howto.jpg", "master-04.png"],
    ["amazon-02-dims.jpg", "master-05.png"],
  ];
  for (const [src, dest] of map) {
    const from = path.join(AMAZON_DIR, src);
    const to = path.join(MASTER_DIR, dest);
    if (await fileExists(from)) {
      const buf = await sharp(from).png().toBuffer();
      await fs.writeFile(to, buf);
      console.log(`master-ref ← ${src} → ${dest}`);
    }
  }
}

async function main() {
  const required = [
    "amazon-01-hero.jpg",
    "amazon-02-dims.jpg",
    "amazon-03-night.jpg",
    "amazon-04-howto.jpg",
    "amazon-05-lifestyle.jpg",
  ];
  for (const f of required) {
    if (!(await fileExists(path.join(AMAZON_DIR, f)))) {
      throw new Error(`Missing Amazon ref: ${f}`);
    }
  }

  await syncMasterRefs();

  const manifestPath = path.join(ROOT, "src/lib/product-images/manifest.json");
  const analysisPath = path.join(ROOT, "src/lib/product-images/analysis.json");
  const manifest = JSON.parse(await fs.readFile(manifestPath, "utf8"));
  const product = manifest.products[SLUG];
  if (!product) throw new Error("Product missing from manifest");

  product.name = "DORVOL Pink Rabbit Carousel Night Light (Amazon B0H65HJYPN)";
  product.prompts = product.prompts || {};
  product.sources = product.sources || {};

  for (const [slot, cfg] of Object.entries(SLOTS)) {
    const src = path.join(AMAZON_DIR, cfg.source);
    console.log(`→ ${slot} ← ${cfg.source}`);
    const outDir = path.join(PUBLIC, cfg.folder, SLUG);
    await fs.mkdir(outDir, { recursive: true });
    const canvas = await buildCanvas(src, cfg);
    product.images[slot] = await optimize(canvas, outDir, slot, cfg.bg);
    product.sources[slot] = "amazon-commercial";
  }

  if (product.images["01-hero-white-bg"]) {
    product.cardImage = product.images["01-hero-white-bg"].webp;
  }

  manifest.generatedAt = new Date().toISOString();
  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));

  if (await fileExists(analysisPath)) {
    const analysis = JSON.parse(await fs.readFile(analysisPath, "utf8"));
    const entry = (analysis.products || []).find((p) => p.slug === SLUG);
    if (entry) {
      entry.sources = entry.sources || {};
      entry.name = product.name;
      for (const slot of Object.keys(SLOTS)) {
        entry.sources[slot] = "amazon-commercial";
      }
      await fs.writeFile(analysisPath, JSON.stringify(analysis, null, 2));
    }
  }

  console.log("Done — rabbit gallery locked to Amazon DORVOL product.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
