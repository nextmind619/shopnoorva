/**
 * Import user-generated maternity belt assets into public/ + manifest.
 * Usage: node scripts/import-maternity-belt-user-photos.mjs
 */
import fs from "fs/promises";
import path from "path";
import sharp from "sharp";

const ROOT = process.cwd();
const SLUG = "adjustable-maternity-support-belt";
const OUT = path.join(ROOT, "public/products", SLUG);
const MANIFEST = path.join(ROOT, "src/lib/product-images/manifest.json");
const ASSETS_DIR = path.join(ROOT, "shopnoorva-maternity-belt/sources");

/** base name → source filename in ASSETS_DIR */
const MAP = {
  "02-premium-hero": "02-premium-hero.jpg",
  "01-hero-white-bg": "01-hero-white-bg.jpg",
  "10-features": "10-features.jpg",
  "03-lifestyle": "03-lifestyle.jpg",
  "14-product-in-use": "14-product-in-use.jpg",
  "17-infographic": "17-infographic.jpg",
  "gift-digital-thermometer": "gift-digital-thermometer.jpg",
};

function rel(p) {
  return `/${path.relative(path.join(ROOT, "public"), p).replace(/\\/g, "/")}`;
}

async function writeVariants(base, inputPath) {
  const meta = await sharp(inputPath).metadata();
  const maxEdge = Math.max(meta.width || 1080, meta.height || 1080);
  const pipeline =
    maxEdge > 2000
      ? sharp(inputPath).rotate().resize(2000, 2000, { fit: "inside", withoutEnlargement: true })
      : sharp(inputPath).rotate();

  const jpg = path.join(OUT, `${base}.jpg`);
  const webp = path.join(OUT, `${base}.webp`);
  const avif = path.join(OUT, `${base}.avif`);
  const thumb = path.join(OUT, "thumbs", `${base}-400.webp`);

  await pipeline.clone().jpeg({ quality: 84, mozjpeg: true }).toFile(jpg);
  await pipeline.clone().webp({ quality: 80 }).toFile(webp);
  await pipeline.clone().avif({ quality: 52 }).toFile(avif);
  await pipeline.clone().resize(400, 400, { fit: "inside" }).webp({ quality: 74 }).toFile(thumb);

  const responsive = {};
  for (const size of [640, 1280, 2000]) {
    const file = path.join(OUT, "responsive", `${base}-${size}.webp`);
    await pipeline
      .clone()
      .resize(size, size, { fit: "inside", withoutEnlargement: true })
      .webp({ quality: 78 })
      .toFile(file);
    responsive[size === 640 ? "sm" : size === 1280 ? "md" : "lg"] = rel(file);
  }

  return {
    original: rel(jpg),
    webp: rel(webp),
    avif: rel(avif),
    thumbnail: rel(thumb),
    responsive,
  };
}

/** Back-view panel from 4-up features collage (top-right quadrant). */
async function deriveInUseFromFeatures(featuresPath, outPath) {
  const meta = await sharp(featuresPath).metadata();
  const w = meta.width || 2000;
  const h = meta.height || 2000;
  await sharp(featuresPath)
    .extract({
      left: Math.floor(w / 2),
      top: 0,
      width: Math.floor(w / 2),
      height: Math.floor(h / 2),
    })
    .toFile(outPath);
}

async function main() {
  await fs.mkdir(path.join(OUT, "thumbs"), { recursive: true });
  await fs.mkdir(path.join(OUT, "responsive"), { recursive: true });
  await fs.mkdir(ASSETS_DIR, { recursive: true });

  const featuresSrc = path.join(ASSETS_DIR, MAP["10-features"]);
  const inUseDerived = path.join(ASSETS_DIR, "_derived-14-back.jpg");
  try {
    await fs.access(featuresSrc);
    await deriveInUseFromFeatures(featuresSrc, inUseDerived);
    await fs.copyFile(inUseDerived, path.join(ASSETS_DIR, MAP["14-product-in-use"]));
  } catch {
    console.warn("Skip 14 derive — add 14-product-in-use.jpg manually in sources/");
  }

  const images = {};
  for (const [base, file] of Object.entries(MAP)) {
    const input = path.join(ASSETS_DIR, file);
    await fs.access(input);
    images[base] = await writeVariants(base, input);
    console.log("OK", base);
  }

  const manifest = JSON.parse(await fs.readFile(MANIFEST, "utf8"));
  manifest.generatedAt = new Date().toISOString();
  manifest.products[SLUG] = {
    slug: SLUG,
    sku: "Maternity-SupportBelt",
    name: "Adjustable Maternity Support Belt + Digital Thermometer Gift",
    images,
    prompts: {},
    sources: Object.fromEntries(Object.keys(MAP).map((k) => [k, "upload"])),
  };
  await fs.writeFile(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");
  console.log("Done:", OUT);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
