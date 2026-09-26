/**
 * Purple-themed SVG placeholders until photos land in shopnoorva-foldable-washer/sources/
 * Usage: node scripts/seed-foldable-washer-placeholders.mjs
 */
import fs from "fs/promises";
import path from "path";
import sharp from "sharp";

const ROOT = process.cwd();
const SLUG = "foldable-9l-mini-washing-machine";
const OUT = path.join(ROOT, "public/products", SLUG);
const MANIFEST = path.join(ROOT, "src/lib/product-images/manifest.json");

const ASSETS = [
  { base: "01-hero-white-bg", label: "Hero white bg" },
  { base: "02-premium-hero", label: "Premium hero" },
  { base: "10-features", label: "Features composite" },
  { base: "03-lifestyle", label: "Lifestyle" },
  { base: "14-product-in-use", label: "In use / drying" },
  { base: "17-infographic", label: "Infographic AR" },
  { base: "gift-filtered-shower-head", label: "Gift shower head" },
];

function svg(label) {
  const safe = label.replace(/[<>&]/g, "");
  return Buffer.from(`<svg width="1080" height="1080" xmlns="http://www.w3.org/2000/svg">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#2e1064"/><stop offset="100%" stop-color="#1a1a24"/></linearGradient></defs>
<rect width="1080" height="1080" fill="url(#g)"/>
<rect x="80" y="80" width="920" height="920" rx="32" fill="#1e1033" stroke="#a78bfa" stroke-width="4" stroke-dasharray="12 8"/>
<text x="540" y="460" text-anchor="middle" fill="#c4b5fd" font-family="sans-serif" font-size="42" font-weight="700">NOORVA</text>
<text x="540" y="520" text-anchor="middle" fill="#ffffff" font-family="sans-serif" font-size="28">صورة قادمة</text>
<text x="540" y="570" text-anchor="middle" fill="#ddd6fe" font-family="sans-serif" font-size="22">${safe}</text>
<text x="540" y="620" text-anchor="middle" fill="#a78bfa" font-family="sans-serif" font-size="16">foldable-9l-mini-washing-machine</text>
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
    sku: "NRV-FWM-01",
    name: "Foldable 9L Mini Washing Machine with Drying",
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
