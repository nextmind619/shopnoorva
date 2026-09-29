/**
 * Rose-themed SVG placeholders until photos land in public/products/adjustable-maternity-support-belt/
 * Usage: node scripts/seed-maternity-belt-placeholders.mjs
 */
import fs from "fs/promises";
import path from "path";
import sharp from "sharp";

const ROOT = process.cwd();
const SLUG = "adjustable-maternity-support-belt";
const OUT = path.join(ROOT, "public/products", SLUG);
const MANIFEST = path.join(ROOT, "src/lib/product-images/manifest.json");

const ASSETS = [
  { base: "01-hero-white-bg", label: "Hero white bg" },
  { base: "02-premium-hero", label: "Premium hero" },
  { base: "10-features", label: "Features composite" },
  { base: "03-lifestyle", label: "Lifestyle pregnant" },
  { base: "14-product-in-use", label: "Wearing belt" },
  { base: "17-infographic", label: "Infographic AR" },
  { base: "gift-digital-thermometer", label: "Gift thermometer" },
];

function svg(label) {
  const safe = label.replace(/[<>&]/g, "");
  return Buffer.from(`<svg width="1080" height="1080" xmlns="http://www.w3.org/2000/svg">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#fce7f3"/><stop offset="100%" stop-color="#fdf2f8"/></linearGradient></defs>
<rect width="1080" height="1080" fill="url(#g)"/>
<rect x="80" y="80" width="920" height="920" rx="32" fill="#fff5f7" stroke="#f472b6" stroke-width="4" stroke-dasharray="12 8"/>
<text x="540" y="440" text-anchor="middle" fill="#be185d" font-family="sans-serif" font-size="40" font-weight="700">NOORVA</text>
<text x="540" y="500" text-anchor="middle" fill="#831843" font-family="sans-serif" font-size="28">حزام دعم الحمل</text>
<text x="540" y="550" text-anchor="middle" fill="#9d174d" font-family="sans-serif" font-size="22">صورة قادمة</text>
<text x="540" y="600" text-anchor="middle" fill="#db2777" font-family="sans-serif" font-size="20">${safe}</text>
</svg>`);
}

function rel(p) {
  return `/${path.relative(path.join(ROOT, "public"), p).replace(/\\/g, "/")}`;
}

async function main() {
  await fs.mkdir(path.join(OUT, "thumbs"), { recursive: true });
  await fs.mkdir(path.join(OUT, "responsive"), { recursive: true });
  const images = {};

  for (const { base, label } of ASSETS) {
    const buf = await sharp(svg(label)).png().toBuffer();
    const jpg = path.join(OUT, `${base}.jpg`);
    const webp = path.join(OUT, `${base}.webp`);
    const avif = path.join(OUT, `${base}.avif`);
    const thumb = path.join(OUT, "thumbs", `${base}-400.webp`);

    await sharp(buf).jpeg({ quality: 85 }).toFile(jpg);
    await sharp(buf).webp({ quality: 80 }).toFile(webp);
    await sharp(buf).avif({ quality: 55 }).toFile(avif);
    await sharp(buf).resize(400, 400, { fit: "inside" }).webp({ quality: 75 }).toFile(thumb);

    const responsive = {};
    for (const size of [640, 1280, 2000]) {
      const file = path.join(OUT, "responsive", `${base}-${size}.webp`);
      await sharp(buf).resize(size, size, { fit: "inside" }).webp({ quality: 78 }).toFile(file);
      responsive[size === 640 ? "sm" : size === 1280 ? "md" : "lg"] = rel(file);
    }

    images[base] = {
      original: rel(jpg),
      webp: rel(webp),
      avif: rel(avif),
      thumbnail: rel(thumb),
      responsive,
    };
  }

  const manifest = JSON.parse(await fs.readFile(MANIFEST, "utf8"));
  manifest.generatedAt = new Date().toISOString();
  manifest.products[SLUG] = {
    slug: SLUG,
    sku: "Maternity-SupportBelt",
    name: "Adjustable Maternity Support Belt + Digital Thermometer Gift",
    images,
    prompts: {},
    sources: Object.fromEntries(ASSETS.map((a) => [a.base, "placeholder"])),
  };
  await fs.writeFile(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");
  console.log("Placeholders ready:", OUT);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
