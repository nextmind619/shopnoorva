/**
 * Optimize BT12 hero + gift images into the public product pipeline
 * (jpg/webp/avif + 400 thumb + 640/1280/2000 responsive), then patch the manifest.
 *
 * Prefers original uploads under shopnoorva-bt12/ when present.
 */
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const PUBLIC = path.join(ROOT, "public");
const SLUG = "bt12-4in1-selfie-stick-tripod";
const OUT = path.join(PUBLIC, "products", SLUG);
const MANIFEST = path.join(ROOT, "src/lib/product-images/manifest.json");

async function firstExisting(candidates) {
  for (const candidate of candidates) {
    try {
      await fs.access(candidate);
      return candidate;
    } catch {
      /* try next */
    }
  }
  throw new Error(`Missing source image. Tried:\n${candidates.join("\n")}`);
}

function rel(filePath) {
  return `/${path.relative(PUBLIC, filePath).replace(/\\/g, "/")}`;
}

async function optimize(inputPath, baseName) {
  await fs.mkdir(path.join(OUT, "thumbs"), { recursive: true });
  await fs.mkdir(path.join(OUT, "responsive"), { recursive: true });
  const buffer = await fs.readFile(inputPath);
  const jpg = path.join(OUT, `${baseName}.jpg`);
  const webp = path.join(OUT, `${baseName}.webp`);
  const avif = path.join(OUT, `${baseName}.avif`);
  const thumb = path.join(OUT, "thumbs", `${baseName}-400.webp`);

  await sharp(buffer).rotate().jpeg({ quality: 86, mozjpeg: true }).toFile(jpg);
  await sharp(buffer).rotate().webp({ quality: 82 }).toFile(webp);
  await sharp(buffer).rotate().avif({ quality: 62 }).toFile(avif);
  await sharp(buffer).rotate().resize(400, 400, { fit: "inside", withoutEnlargement: true }).webp({ quality: 78 }).toFile(thumb);

  const responsive = {};
  for (const size of [640, 1280, 2000]) {
    const file = path.join(OUT, "responsive", `${baseName}-${size}.webp`);
    await sharp(buffer)
      .rotate()
      .resize(size, size, { fit: "inside", withoutEnlargement: true })
      .webp({ quality: 80 })
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

const heroSrc = await firstExisting([
  path.join(ROOT, "shopnoorva-bt12/bt12-product-ref.jpg"),
  path.join(ROOT, "shopnoorva-bt12/bt12-product-ref.png"),
  "/opt/cursor/artifacts/assets/bt12-product-ref.png",
]);
const giftSrc = await firstExisting([
  path.join(ROOT, "shopnoorva-bt12/gift-usbc-240w.png"),
  path.join(ROOT, "shopnoorva-bt12/gift-usbc-240w.jpg"),
  "/opt/cursor/artifacts/assets/gift-usbc-240w.png",
]);

const hero = await optimize(heroSrc, "02-premium-hero");
const gift = await optimize(giftSrc, "gift-usbc-240w");

const manifest = JSON.parse(await fs.readFile(MANIFEST, "utf8"));
manifest.generatedAt = new Date().toISOString();
manifest.products[SLUG] = {
  slug: SLUG,
  sku: "NRV-BT12-01",
  name: "BT12 4-in-1 Selfie Stick Tripod with Dual Light Ring",
  images: {
    "02-premium-hero": hero,
  },
  prompts: {},
  sources: {
    "02-premium-hero": "commercial",
  },
};
await fs.writeFile(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");

console.log(JSON.stringify({ heroSrc, giftSrc, hero: hero.webp, gift: gift.webp }, null, 2));
