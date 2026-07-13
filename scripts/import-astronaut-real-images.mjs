/**
 * Import REAL astronaut galaxy projector images matching supplier photos.
 * Bear-ear helmet, chest speaker grille, lunar base, black remote, 8 nebula modes.
 */
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const PUBLIC = path.join(ROOT, "public");
const SLUG = "astronaut-galaxy-projector";

// Real product commercial images (Aryanca / Amazon exact model)
const REAL_SOURCES = {
  "01-hero-white-bg": [
    "https://aryanca.com/cdn/shop/files/HR_Astro_WG_6eb9b6bc-ca7b-4c46-b6bf-ccb766f6a1fc.jpg?v=1710958860&width=2000",
    "https://aryanca.com/cdn/shop/files/81WkrFYJRKL._AC_SX679.jpg?v=1710958720&width=2000",
    "https://m.media-amazon.com/images/I/71LZDzsrvIL._AC_SX679.jpg",
  ],
  "02-premium-hero": [
    "https://aryanca.com/cdn/shop/files/Star-Projector-Galaxy-Night-Light-Astronaut-Space-Projector-Starry-Nebula-Ceiling-LED-Lamp-for-Bedroom-Home_jpg.webp?v=1710958720&width=2000",
    "https://aryanca.com/cdn/shop/files/HR_Astro_Action_8757581b-4422-48f5-b370-bfb2663ea108.webp?v=1710958720&width=2000",
    "https://aryanca.com/cdn/shop/files/81Kba32QfqL._AC_SX679.jpg?v=1710958720&width=2000",
  ],
  "09-close-up": [
    "https://aryanca.com/cdn/shop/files/81gRORu5X7L._AC_SX679.jpg?v=1710958720&width=2000",
    "https://aryanca.com/cdn/shop/files/81pKMzTfIFL._AC_SX679_091cf075-ff46-4a6e-8ee4-e4da7ee5cc63.jpg?v=1710958720&width=2000",
  ],
  "10-features": [
    "https://aryanca.com/cdn/shop/files/HR_Astro_Options_dd932ae5-d4f5-4ad8-9939-7794423df691.jpg?v=1710958720&width=2000",
    "https://aryanca.com/cdn/shop/files/Astro10.webp?v=1710958720&width=2000",
  ],
  "11-package-contents": [
    "https://aryanca.com/cdn/shop/files/HR_Astro_BS_4122fe55-863e-4fb4-a20e-8c89922d4209.jpg?v=1710958860&width=2000",
    "https://aryanca.com/cdn/shop/files/HR_Astro_BS.jpg?v=1709933370&width=2000",
  ],
  "12-dimensions": [
    "https://aryanca.com/cdn/shop/files/81m72WNBJsL._AC_SX679.jpg?v=1710958720&width=2000",
    "https://aryanca.com/cdn/shop/files/Astro2.webp?v=1710958720&width=2000",
  ],
  "14-product-in-use": [
    "https://aryanca.com/cdn/shop/files/HR_Astro_BG_3aa0e288-fac6-49ca-84a5-fd1ebfc4dbff.jpg?v=1710958720&width=2000",
    "https://aryanca.com/cdn/shop/files/HR_Astro_BG_39884426-64e1-44c2-9d4a-35133a669842.jpg?v=1710958860&width=2000",
  ],
  "17-infographic": [
    "https://aryanca.com/cdn/shop/files/HR_Astro_Options_dd932ae5-d4f5-4ad8-9939-7794423df691.jpg?v=1710958720&width=2000",
  ],
};

const AI_PROMPTS = {
  "01-hero-white-bg": "Exact white astronaut galaxy projector product photo on pure white background: chibi white astronaut with two small bear-ear protrusions on helmet, dark glossy black visor, small lens on top of helmet, large circular perforated speaker grille on chest, white lunar crater textured circular base, white cable from head to body, black slim remote beside product, matte white ABS plastic, studio e-commerce photography, photorealistic, 8K, no text",
  "02-premium-hero": "Exact replica marketing photo: white astronaut galaxy Bluetooth projector left side, bear ears on helmet, chest speaker grille with green pink musical notes, black remote and smartphone with music app bottom right, dark bedroom background with blue purple nebula on ceiling walls, 8 circular nebula color mode thumbnails right side with crescent moon, photorealistic product advertisement, 8K, no watermark",
  "03-lifestyle": "White astronaut galaxy projector with bear ear helmet on wooden nightstand in dark bedroom, projecting blue purple nebula on ceiling, black remote nearby, photorealistic, 8K",
  "04-bedroom": "Cozy dark bedroom with white astronaut projector on bed table, vivid blue purple galaxy stars on ceiling and walls, bear ear astronaut design, cinematic, 8K",
  "09-close-up": "Macro close-up white astronaut projector: bear ear helmet, dark visor, chest speaker grille detail, black remote control, photorealistic, 8K",
  "10-features": "Infographic MORE DETAIL DESIGN: white astronaut center on purple nebula background, 4 circular insets showing 360 head rotation, arm swing, magnetic head, back control buttons ON OFF Model Light Music, bear ears on helmet, 8K",
  "12-dimensions": "White astronaut galaxy projector with dimension lines 24cm height 12cm width, lunar crater base, 8 nebula color mode grid with crescent moon on right, starry background, product specification photo, 8K",
  "14-product-in-use": "White astronaut projector on dark wood surface, black remote beside it, projecting vivid blue purple nebula galaxy on wall behind, bear ear helmet design, chest speaker grille, photorealistic hero product shot, 8K",
  "17-infographic": "MULTIPLE POWER MODES infographic: white astronaut on moon rocky surface, backpack USB port, adapter power bank laptop USB icons, bear ear helmet, starry space background, 8K",
};

const IMAGE_FOLDERS = {
  "01-hero-white-bg": "products", "02-premium-hero": "products", "03-lifestyle": "lifestyle",
  "04-bedroom": "lifestyle", "05-living-room": "lifestyle", "06-gaming-room": "lifestyle",
  "07-romantic-room": "lifestyle", "08-kids-room": "lifestyle", "09-close-up": "products",
  "10-features": "generated", "11-package-contents": "products", "12-dimensions": "specifications",
  "13-before-after": "generated", "14-product-in-use": "lifestyle", "15-banner": "banners",
  "16-packaging": "products", "17-infographic": "generated", "18-mobile-banner": "banners",
  "19-desktop-banner": "banners", "20-social-media-banner": "banners",
};

async function downloadFromUrls(urls) {
  for (const url of urls) {
    try {
      const res = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Accept": "image/webp,image/apng,image/*,*/*;q=0.8",
          "Referer": "https://aryanca.com/",
        },
        signal: AbortSignal.timeout(60000),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.length < 8000) throw new Error("too small");
      await sharp(buf).metadata();
      return buf;
    } catch (e) {
      console.log(`    ✗ ${url.slice(0, 60)}... (${e.message})`);
    }
  }
  return null;
}

async function generateAI(prompt, w = 2000, h = 2000) {
  const seed = 42069;
  const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=${w}&height=${h}&nologo=true&seed=${seed}&model=flux`;
  console.log(`    🤖 AI fallback...`);
  return downloadFromUrls([url]);
}

async function optimize(buffer, outDir, baseName) {
  await fs.mkdir(path.join(outDir, "thumbs"), { recursive: true });
  await fs.mkdir(path.join(outDir, "responsive"), { recursive: true });
  const rel = (p) => "/" + path.relative(PUBLIC, p).replace(/\\/g, "/");
  const paths = {
    original: path.join(outDir, `${baseName}.jpg`),
    webp: path.join(outDir, `${baseName}.webp`),
    avif: path.join(outDir, `${baseName}.avif`),
    thumb: path.join(outDir, "thumbs", `${baseName}-400.webp`),
    sm: path.join(outDir, "responsive", `${baseName}-640.webp`),
    md: path.join(outDir, "responsive", `${baseName}-1280.webp`),
    lg: path.join(outDir, "responsive", `${baseName}-2000.webp`),
  };
  await sharp(buffer).rotate().jpeg({ quality: 92, mozjpeg: true }).toFile(paths.original);
  await sharp(buffer).rotate().webp({ quality: 88 }).toFile(paths.webp);
  await sharp(buffer).rotate().avif({ quality: 80 }).toFile(paths.avif);
  await sharp(buffer).rotate().resize(400, 400, { fit: "inside", withoutEnlargement: true }).webp({ quality: 82 }).toFile(paths.thumb);
  for (const [size, p] of [[640, paths.sm], [1280, paths.md], [2000, paths.lg]]) {
    await sharp(buffer).rotate().resize(size, size, { fit: "inside", withoutEnlargement: false }).webp({ quality: 85 }).toFile(p);
  }
  return {
    original: rel(paths.original), webp: rel(paths.webp), avif: rel(paths.avif),
    thumbnail: rel(paths.thumb),
    responsive: { sm: rel(paths.sm), md: rel(paths.md), lg: rel(paths.lg) },
  };
}

async function main() {
  console.log("🚀 Importing REAL astronaut galaxy projector images\n");

  const manifestPath = path.join(ROOT, "src/lib/product-images/manifest.json");
  const manifest = JSON.parse(await fs.readFile(manifestPath, "utf-8"));
  const product = manifest.products[SLUG] || { slug: SLUG, sku: "NRV-ASTRO-01", name: "Astronaut Galaxy Projector", images: {}, sources: {} };

  const priorityTypes = [
    "02-premium-hero", "01-hero-white-bg", "14-product-in-use", "09-close-up",
    "10-features", "12-dimensions", "17-infographic", "11-package-contents",
    "04-bedroom", "03-lifestyle",
  ];

  for (const imageType of priorityTypes) {
    const folder = IMAGE_FOLDERS[imageType];
    const outDir = path.join(PUBLIC, folder, SLUG);
    await fs.mkdir(outDir, { recursive: true });
    console.log(`📸 ${imageType}`);

    let buffer = null;
    let source = "ai-generated";

    if (REAL_SOURCES[imageType]) {
      console.log(`  ↓ Trying commercial sources...`);
      buffer = await downloadFromUrls(REAL_SOURCES[imageType]);
      if (buffer) source = "commercial";
    }

    if (!buffer && AI_PROMPTS[imageType]) {
      buffer = await generateAI(AI_PROMPTS[imageType]);
    }

    if (!buffer) {
      console.log(`  ✗ Skipped\n`);
      continue;
    }

    const optimized = await optimize(buffer, outDir, imageType);
    product.images[imageType] = optimized;
    product.sources[imageType] = source;
    console.log(`  ✓ Done (${source})\n`);
    await new Promise((r) => setTimeout(r, 1000));
  }

  manifest.products[SLUG] = product;
  manifest.generatedAt = new Date().toISOString();
  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));
  console.log("✅ Manifest updated");
}

main().catch((e) => { console.error(e); process.exit(1); });
