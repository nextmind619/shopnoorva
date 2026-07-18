import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const PUBLIC = path.join(ROOT, "public");
const SRC_DIR =
  "C:/Users/admin/AppData/Roaming/Cursor/User/workspaceStorage/1783604483934/images";
const SLUG = "bluetooth-star-projector";
const PREFIX = "75594448-e9a7-4330-b8a2-20cafe5a18e7";

async function optimize(buffer, outDir, baseName) {
  await fs.mkdir(path.join(outDir, "thumbs"), { recursive: true });
  await fs.mkdir(path.join(outDir, "responsive"), { recursive: true });
  const jpg = path.join(outDir, `${baseName}.jpg`);
  const webp = path.join(outDir, `${baseName}.webp`);
  const avif = path.join(outDir, `${baseName}.avif`);
  const thumb = path.join(outDir, "thumbs", `${baseName}-400.webp`);
  await sharp(buffer).jpeg({ quality: 92, mozjpeg: true }).toFile(jpg);
  await sharp(buffer).webp({ quality: 88 }).toFile(webp);
  await sharp(buffer).avif({ quality: 80 }).toFile(avif);
  await sharp(buffer).resize(400, 400, { fit: "inside" }).webp({ quality: 82 }).toFile(thumb);
  const responsive = {};
  for (const size of [640, 1280, 2000]) {
    const p = path.join(outDir, "responsive", `${baseName}-${size}.webp`);
    await sharp(buffer).resize(size, size, { fit: "inside" }).webp({ quality: 85 }).toFile(p);
    responsive[size === 640 ? "sm" : size === 1280 ? "md" : "lg"] =
      "/" + path.relative(PUBLIC, p).replace(/\\/g, "/");
  }
  const rel = (p) => "/" + path.relative(PUBLIC, p).replace(/\\/g, "/");
  return {
    original: rel(jpg),
    webp: rel(webp),
    avif: rel(avif),
    thumbnail: rel(thumb),
    responsive,
  };
}

const files = await fs.readdir(SRC_DIR);
const master = files
  .filter((f) => f.startsWith(PREFIX) && f.endsWith(".png"))
  .sort((a, b) => b.length - a.length)[0];
if (!master) throw new Error("hero source not found");
console.log("HERO:", master);

const input = await fs.readFile(path.join(SRC_DIR, master));
const canvas = await sharp(input)
  .rotate()
  .resize(2000, 2000, { fit: "cover", position: "centre" })
  .toBuffer();

const outDir = path.join(PUBLIC, "products", SLUG);
const manifestPath = path.join(ROOT, "src/lib/product-images/manifest.json");
const manifest = JSON.parse(await fs.readFile(manifestPath, "utf8"));
const product = manifest.products[SLUG];

for (const slot of ["01-hero-white-bg", "02-premium-hero"]) {
  product.images[slot] = await optimize(canvas, outDir, slot);
  product.sources[slot] = "commercial";
  console.log("✓", slot);
}

manifest.generatedAt = new Date().toISOString();
await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));
console.log("Main hero updated.");
