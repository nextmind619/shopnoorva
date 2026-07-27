/**
 * Optimize generated Laser 303 marketing images into the product image pipeline.
 * Usage: node scripts/process-laser303-images.mjs
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
const SLUG = "green-laser-pointer-303";
const MANIFEST_PATH = path.join(ROOT, "src/lib/product-images/manifest.json");

const IMAGE_TYPE_CONFIGS = {
  "01-hero-white-bg": { folder: "products", width: 2000, height: 2000 },
  "02-premium-hero": { folder: "products", width: 2000, height: 2000 },
  "03-lifestyle": { folder: "lifestyle", width: 2000, height: 2000 },
  "04-bedroom": { folder: "lifestyle", width: 2000, height: 2000 },
  "05-living-room": { folder: "lifestyle", width: 2000, height: 2000 },
  "06-gaming-room": { folder: "lifestyle", width: 2000, height: 2000 },
  "07-romantic-room": { folder: "lifestyle", width: 2000, height: 2000 },
  "08-kids-room": { folder: "lifestyle", width: 2000, height: 2000 },
  "09-close-up": { folder: "products", width: 2000, height: 2000 },
  "10-features": { folder: "generated", width: 2000, height: 2000 },
  "11-package-contents": { folder: "products", width: 2000, height: 2000 },
  "12-dimensions": { folder: "specifications", width: 2000, height: 2000 },
  "13-before-after": { folder: "generated", width: 2000, height: 2000 },
  "14-product-in-use": { folder: "lifestyle", width: 2000, height: 2000 },
  "15-banner": { folder: "banners", width: 2000, height: 800 },
  "16-packaging": { folder: "products", width: 2000, height: 2000 },
  "17-infographic": { folder: "generated", width: 2000, height: 2000 },
  "18-mobile-banner": { folder: "banners", width: 1080, height: 1920 },
  "19-desktop-banner": { folder: "banners", width: 2560, height: 800 },
  "20-social-media-banner": { folder: "banners", width: 1200, height: 1200 },
};

const SOURCE_MAP = {
  "01-hero-white-bg": "laser303-01-hero-white-bg.png",
  "02-premium-hero": "laser303-02-premium-hero.png",
  "03-lifestyle": "laser303-03-lifestyle-night.png",
  "04-bedroom": "laser303-03-lifestyle-night.png",
  "05-living-room": "laser303-14-product-in-use.png",
  "06-gaming-room": "laser303-02-premium-hero.png",
  "07-romantic-room": "laser303-16-packaging-luxury.png",
  "08-kids-room": "laser303-10-features.png",
  "09-close-up": "laser303-09-close-up.png",
  "10-features": "laser303-10-features.png",
  "11-package-contents": "laser303-11-package-contents.png",
  "12-dimensions": "laser303-09-close-up.png",
  "13-before-after": "laser303-02-premium-hero.png",
  "14-product-in-use": "laser303-14-product-in-use.png",
  "15-banner": "laser303-19-desktop-banner.png",
  "16-packaging": "laser303-16-packaging-luxury.png",
  "17-infographic": "laser303-10-features.png",
  "18-mobile-banner": "laser303-02-premium-hero.png",
  "19-desktop-banner": "laser303-19-desktop-banner.png",
  "20-social-media-banner": "laser303-02-premium-hero.png",
};

async function optimizeImage(inputBuffer, outDir, baseName, width, height) {
  await fs.mkdir(path.join(outDir, "thumbs"), { recursive: true });
  await fs.mkdir(path.join(outDir, "responsive"), { recursive: true });

  const originalPath = path.join(outDir, `${baseName}.jpg`);
  const webpPath = path.join(outDir, `${baseName}.webp`);
  const avifPath = path.join(outDir, `${baseName}.avif`);
  const thumbPath = path.join(outDir, "thumbs", `${baseName}-400.webp`);
  const smPath = path.join(outDir, "responsive", `${baseName}-640.webp`);
  const mdPath = path.join(outDir, "responsive", `${baseName}-1280.webp`);
  const lgPath = path.join(outDir, "responsive", `${baseName}-2000.webp`);

  const resized = await sharp(inputBuffer)
    .rotate()
    .resize(width, height, { fit: "cover", position: "centre" })
    .toBuffer();

  await sharp(resized).jpeg({ quality: 92, mozjpeg: true }).toFile(originalPath);
  await sharp(resized).webp({ quality: 88, effort: 4 }).toFile(webpPath);
  await sharp(resized).avif({ quality: 80, effort: 4 }).toFile(avifPath);
  await sharp(resized)
    .resize(400, 400, { fit: "inside", withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(thumbPath);

  for (const [size, p] of [
    [640, smPath],
    [1280, mdPath],
    [2000, lgPath],
  ]) {
    await sharp(resized)
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
  const productManifest = {
    slug: SLUG,
    sku: "NRV-LASER303-01",
    name: "Green Laser Pointer 303",
    images: {},
    prompts: {},
    sources: {},
  };

  for (const [imageType, fileName] of Object.entries(SOURCE_MAP)) {
    const config = IMAGE_TYPE_CONFIGS[imageType];
    const srcPath = path.join(ASSETS, fileName);
    const outDir = path.join(PUBLIC, config.folder, SLUG);
    await fs.mkdir(outDir, { recursive: true });

    console.log(`Processing ${imageType} from ${fileName}...`);
    const buf = await fs.readFile(srcPath);
    productManifest.images[imageType] = await optimizeImage(
      buf,
      outDir,
      imageType,
      config.width,
      config.height
    );
    productManifest.sources[imageType] = "ai-generated";
  }

  // Copy original references into amazon-refs for provenance
  const refsDir = path.join(PUBLIC, "products", SLUG, "amazon-refs");
  await fs.mkdir(refsDir, { recursive: true });
  const refGlob = await fs.readdir(ASSETS);
  const refs = refGlob.filter(
    (f) =>
      f.includes("1784807271690") ||
      f.includes("ade9e212") ||
      f.includes("b0791551") ||
      f.includes("aad341d3")
  );
  let i = 1;
  for (const f of refs) {
    await fs.copyFile(path.join(ASSETS, f), path.join(refsDir, `ref-0${i}.png`));
    i++;
  }

  const manifest = JSON.parse(await fs.readFile(MANIFEST_PATH, "utf8"));
  manifest.generatedAt = new Date().toISOString();
  manifest.products[SLUG] = productManifest;
  await fs.writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
  console.log(`\n✓ Manifest updated with ${SLUG}`);
  console.log(`✓ Images written under public/{products,lifestyle,generated,banners,specifications}/${SLUG}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
